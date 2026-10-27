import {createClient} from '@supabase/supabase-js';
import {signupSchema,signinSchema,passwordSchema} from './validation.ts';
// Replaced with the SHA-256 digest of a random server-only gateway key at deploy.
// The plaintext key lives only in Next.js server environment variables.
const gatewayKeyHash='__GATEWAY_KEY_HASH__';
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const accountView=(row:Record<string,unknown>)=>({id:row.user_id,username:row.username,hasPassword:row.has_password,semester:row.semester,minutes:row.daily_minutes});
Deno.serve(async(req:Request)=>{
 try{
  const key=req.headers.get('x-gradient-gateway-key')||'';
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key)))).map(n=>n.toString(16).padStart(2,'0')).join('');
  if(hash!==gatewayKeyHash)return json({error:'Not authorized.'},403);
  if(req.method!=='POST')return json({error:'Method not allowed.'},405);
  if(Number(req.headers.get('content-length')||0)>4096)return json({error:'Request is too large.'},413);
  const raw=await req.text();if(raw.length>4096)return json({error:'Request is too large.'},413);
  const body=JSON.parse(raw);
  const url=Deno.env.get('SUPABASE_URL')!;
  const admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  const client=createClient(url,Deno.env.get('SUPABASE_ANON_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  const clientKey=req.headers.get('x-gradient-client-key');if(!clientKey)return json({error:'Not authorized.'},403);
  const action=body.action;
  const {data:allowed,error:limitError}=await admin.rpc('gradient_account_allow',{p_bucket:`${action}:${clientKey}`,p_limit:action==='signup'?10:40,p_seconds:900});
  if(limitError)return json({error:'Account service is temporarily unavailable.'},503);
  if(!allowed)return json({error:'Too many attempts. Please try again in 15 minutes.'},429);
  if(action==='signup'){
   const parsed=signupSchema.safeParse(body);if(!parsed.success)return json({error:parsed.error.issues[0].message},400);
   const {username,password,semester,minutes}=parsed.data;
   const {data:existing,error:lookupError}=await admin.from('gradient_accounts').select('user_id').eq('username',username).maybeSingle();
   if(lookupError)return json({error:'Account service is temporarily unavailable.'},503);
   if(existing)return json({error:'That username is already taken. Try another.'},409);
   const email=`${crypto.randomUUID()}@accounts.gradient.invalid`;
   const credential=password||`${crypto.randomUUID()}-${crypto.randomUUID()}`;
   const {data:created,error:createError}=await admin.auth.admin.createUser({email,password:credential,email_confirm:true});
   if(createError||!created.user)return json({error:'Could not create your account. Please try again.'},503);
   const {data:row,error:insertError}=await admin.from('gradient_accounts').insert({user_id:created.user.id,username,has_password:!!password,semester,daily_minutes:minutes}).select().single();
   if(insertError){await admin.auth.admin.deleteUser(created.user.id);return json({error:insertError.code==='23505'?'That username is already taken. Try another.':'Could not save your account. Please try again.'},insertError.code==='23505'?409:503);}
   const {data:signed,error:signError}=await client.auth.signInWithPassword({email,password:credential});
   if(signError||!signed.session)return json({error:'Account saved, but sign-in failed. Please try signing in.'},503);
   return json({account:accountView(row),session:{access_token:signed.session.access_token,refresh_token:signed.session.refresh_token}});
  }
  if(action==='signin'){
   const parsed=signinSchema.safeParse(body);if(!parsed.success)return json({error:parsed.error.issues[0].message},400);
   const {username,password}=parsed.data;
   const {data:row,error:lookupError}=await admin.from('gradient_accounts').select('*').eq('username',username).maybeSingle();
   if(lookupError)return json({error:'Account service is temporarily unavailable.'},503);
   if(!row)return json({error:'Username or password is incorrect.'},401);
   const {data:owner,error:ownerError}=await admin.auth.admin.getUserById(row.user_id);
   if(ownerError||!owner.user.email)return json({error:'Username or password is incorrect.'},401);
   const {data:signed,error:signError}=await client.auth.signInWithPassword({email:owner.user.email,password});
   if(signError||!signed.session)return json({error:'Username or password is incorrect.'},401);
   return json({account:accountView(row),session:{access_token:signed.session.access_token,refresh_token:signed.session.refresh_token}});
  }
  if(action==='password'){
   const password=passwordSchema.safeParse(body.password);if(!password.success)return json({error:password.error.issues[0].message},400);
   const token=body.accessToken;if(typeof token!=='string')return json({error:'Please sign in again.'},401);
   const {data:auth,error:authError}=await client.auth.getUser(token);
   if(authError||!auth.user)return json({error:'Please sign in again.'},401);
   const {data:row}=await admin.from('gradient_accounts').select('*').eq('user_id',auth.user.id).single();
   if(!row||row.has_password)return json({error:'This account already has a password.'},409);
   const {error:updateError}=await admin.auth.admin.updateUserById(auth.user.id,{password:password.data});
   if(updateError)return json({error:'Could not add your password. Please try again.'},503);
   const {error:saveError}=await admin.from('gradient_accounts').update({has_password:true}).eq('user_id',auth.user.id);
   if(saveError)return json({error:'Could not confirm your password settings. Please try again.'},503);
   return json({success:true});
  }
  return json({error:'Unknown account action.'},400);
 }catch{return json({error:'Could not process the account request. Please try again.'},400);}
});
