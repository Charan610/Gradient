import {beforeEach,afterEach,it,expect,vi} from 'vitest';
const state=vi.hoisted(()=>({user:'11111111-1111-4111-8111-111111111111' as string|null,origin:true,rows:[] as Record<string,unknown>[],insertError:'',calls:[] as unknown[]}));
vi.mock('@/lib/account/server',()=>({validAccountOrigin:()=>state.origin,accountJson:(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}})}));
vi.mock('@/lib/supabase/server',()=>({createServerSideClient:async()=>({auth:{getUser:async()=>({data:{user:state.user?{id:state.user}:null},error:null})},from:(table:string)=>{
 state.calls.push(table);let mode='select',columns='',data:Record<string,unknown>|undefined,single=false;const filters:Record<string,unknown>={};
 const query:any={select:(value:string)=>{columns=value;return query},eq:(key:string,value:unknown)=>{filters[key]=value;return query},order:()=>query,limit:()=>query,insert:(value:Record<string,unknown>)=>{mode='insert';data=value;return query},delete:()=>{mode='delete';return query},single:()=>{single=true;return query},maybeSingle:()=>{single=true;return query},then:(resolve:(value:unknown)=>unknown)=>{
  let rows=state.rows.filter(row=>Object.entries(filters).every(([k,v])=>row[k]===v));
  if(mode==='insert'){
   if(state.insertError)return Promise.resolve(resolve({data:null,error:{code:state.insertError}}));
   const row={...data,id:'33333333-3333-4333-8333-333333333333',created_at:'2026-11-03T10:00:00Z',byte_length:new TextEncoder().encode(String(data?.source)).length};state.rows.push(row);rows=[row];
  }
  if(mode==='delete')state.rows=state.rows.filter(row=>!rows.includes(row));
  const selected=rows.map(row=>Object.fromEntries(columns.split(',').map(key=>[key.trim(),row[key.trim()]])));
  return Promise.resolve(resolve({data:single?selected[0]??null:selected,error:null}));
 }};return query;
 }})}));
import {GET,POST,DELETE} from '../src/app/api/backups/route';
const own='11111111-1111-4111-8111-111111111111',foreign='22222222-2222-4222-8222-222222222222';
const id='44444444-4444-4444-8444-444444444444';
const profile={user_id:'local_user',alias:'Student',academic_semester:'2-2',target_role:'Learning',preferred_daily_minutes:60,preferred_mode:'normal',theme:'light',onboarding_status:'completed',active_day_index:1};
const source=JSON.stringify({format_version:1,storage_mode:'local',profile,local_records:{foundation_career_os_local_user_profile:JSON.stringify(profile)}});
function request(method='GET',body?:string,query=''){return new Request('http://localhost/api/backups'+query,{method,headers:{origin:'http://localhost','Content-Type':'application/json','x-gradient-account':own},body});}
beforeEach(()=>{vi.stubEnv('GRADIENT_CLOUD_BACKUPS_ENABLED','true');state.user=own;state.origin=true;state.rows=[];state.calls=[];state.insertError=''});
afterEach(()=>vi.unstubAllEnvs());
it('rejects unsigned reads and writes before accessing any backups',async()=>{state.user=null;expect((await GET(request())).status).toBe(401);expect((await POST(request('POST',source))).status).toBe(401);expect(state.calls).toEqual([])});
it('refuses a stale client account rather than uploading its data to the new account',async()=>{state.user=foreign;expect((await POST(request('POST',source))).status).toBe(409);expect(state.rows).toEqual([])});
it('rejects cross-origin uploads and deletes',async()=>{state.origin=false;expect((await POST(request('POST',source))).status).toBe(403);expect((await DELETE(request('DELETE',undefined,'?id='+id))).status).toBe(403);expect(state.calls).toEqual([])});
it('does not enable cloud storage until explicitly configured',async()=>{vi.stubEnv('GRADIENT_CLOUD_BACKUPS_ENABLED','false');expect((await GET(request())).status).toBe(503);expect(state.calls).toEqual([])});
it('rejects invalid backup contents before insertion',async()=>{expect((await POST(request('POST','{"profile":{}}'))).status).toBe(400);expect(state.rows).toEqual([])});
it('rejects oversized streaming bodies',async()=>{expect((await POST(request('POST','x'.repeat(5*1024*1024+1)))).status).toBe(413);expect(state.rows).toEqual([])});
it('adds a separate snapshot without overwriting existing cloud copies',async()=>{state.rows=[{user_id:own,slot:1,id,source:'keep earlier bytes'}];const response=await POST(request('POST',source));expect(response.status).toBe(201);expect(state.rows).toHaveLength(2);expect(state.rows[0].source).toBe('keep earlier bytes');expect(state.rows[1]).toMatchObject({user_id:own,slot:2,source})});
it('returns a retryable conflict when another tab takes the same slot',async()=>{state.insertError='23505';expect((await POST(request('POST',source))).status).toBe(409);expect(state.rows).toEqual([])});
it('never evicts old copies when all ten slots are occupied',async()=>{state.rows=Array.from({length:10},(_,i)=>({user_id:own,slot:i+1,id:String(i),source:'copy '+i}));const before=structuredClone(state.rows);expect((await POST(request('POST',source))).status).toBe(409);expect(state.rows).toEqual(before)});
it('lists only owner metadata and never includes snapshot bodies',async()=>{state.rows=[{user_id:own,id,created_at:'2026-11-03',byte_length:42,source:'private-own'},{user_id:foreign,id:'foreign',source:'private-foreign'}];const r=await GET(request());expect(r.status).toBe(200);const body=await r.text();expect(body).toContain(id);expect(body).not.toContain('private');expect(r.headers.get('Cache-Control')).toBe('no-store')});
it('does not expose another account snapshot by ID',async()=>{state.rows=[{user_id:foreign,id,source}];expect((await GET(request('GET',undefined,'?id='+id))).status).toBe(404)});
it('downloads a validated owner snapshot without changing it',async()=>{state.rows=[{user_id:own,id,source}];const r=await GET(request('GET',undefined,'?id='+id));expect(r.status).toBe(200);expect(await r.text()).toBe(source);expect(state.rows).toHaveLength(1)});
it('deletes only the explicitly selected owner copy',async()=>{state.rows=[{user_id:own,id,source},{user_id:foreign,id,source:'private'}];expect((await DELETE(request('DELETE',undefined,'?id='+id))).status).toBe(200);expect(state.rows).toEqual([{user_id:foreign,id,source:'private'}])});
it('rejects invalid IDs without accessing snapshot records',async()=>{expect((await GET(request('GET',undefined,'?id=invalid'))).status).toBe(400);expect((await DELETE(request('DELETE'))).status).toBe(400);expect(state.calls).toEqual([])});
