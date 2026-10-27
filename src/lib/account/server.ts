import 'server-only';
import {createHmac} from 'node:crypto';
import {NextResponse} from 'next/server';
import {createServerSideClient} from '@/lib/supabase/server';
import type {StudyAccount} from './validation';
export function accountsConfigured(){return !!(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY&&process.env.GRADIENT_ACCOUNT_GATEWAY_KEY&&process.env.GRADIENT_ACCOUNT_ENDPOINT);}
export function accountJson(data:unknown,status=200){return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});}
export function validAccountOrigin(request:Request){const origin=request.headers.get('origin');return request.headers.get('sec-fetch-site')!=='cross-site'&&origin===new URL(request.url).origin;}
export async function currentAccount():Promise<StudyAccount|null>{
 if(!accountsConfigured())return null;
 const client=await createServerSideClient();if(!client)return null;
 const {data:{user},error}=await client.auth.getUser();if(error||!user)return null;
 const {data:row,error:accountError}=await client.from('gradient_accounts').select('user_id,username,has_password,semester,daily_minutes').eq('user_id',user.id).single();
 if(accountError)throw new Error('Could not load your account. Please try again.');
 return {id:row.user_id,username:row.username,hasPassword:row.has_password,semester:row.semester,minutes:row.daily_minutes};
}
export async function callAccountGateway(request:Request,body:Record<string,unknown>){
 const ip=request.headers.get('x-real-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';
 const clientKey=createHmac('sha256',process.env.GRADIENT_ACCOUNT_GATEWAY_KEY!).update(ip).digest('hex');
 return fetch(process.env.GRADIENT_ACCOUNT_ENDPOINT!,{method:'POST',headers:{'Content-Type':'application/json','x-gradient-gateway-key':process.env.GRADIENT_ACCOUNT_GATEWAY_KEY!,'x-gradient-client-key':clientKey},body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(20000)});
}
