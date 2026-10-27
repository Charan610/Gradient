import {accountJson,accountsConfigured,callAccountGateway,validAccountOrigin} from '@/lib/account/server';
import {signupSchema,signinSchema,passwordSchema} from '@/lib/account/validation';
import {createServerSideClient} from '@/lib/supabase/server';
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
 if(!validAccountOrigin(request))return accountJson({error:'Please submit this form from Gradient.'},403);
 if(!accountsConfigured())return accountJson({error:'Accounts are temporarily unavailable. You can still use a local workspace.'},503);
 const {action}=await params;
 if(!['signup','signin','signout','password'].includes(action))return accountJson({error:'Not found.'},404);
 try{
  const client=await createServerSideClient();if(!client)return accountJson({error:'Account service is unavailable.'},503);
  if(action==='signout'){const {error}=await client.auth.signOut({scope:'local'});return error?accountJson({error:'Could not sign out. Please try again.'},503):accountJson({success:true});}
  const source=await request.text();if(source.length>4096)return accountJson({error:'Request is too large.'},413);
  const body=JSON.parse(source);
  const parsed=action==='signup'?signupSchema.safeParse(body):action==='signin'?signinSchema.safeParse(body):passwordSchema.safeParse(body.password);
  if(!parsed.success)return accountJson({error:parsed.error.issues[0].message},400);
  let payload:Record<string,unknown>;
  if(action==='password'){
   const {data:{user},error}=await client.auth.getUser();if(error||!user)return accountJson({error:'Please sign in again.'},401);
   const {data:{session}}=await client.auth.getSession();if(!session)return accountJson({error:'Please sign in again.'},401);
   payload={action,password:parsed.data,accessToken:session.access_token};
  }else payload={action,...parsed.data as Record<string,unknown>};
  const response=await callAccountGateway(request,payload);
  const result=await response.json();
  if(!response.ok)return accountJson({error:result.error||'Account request failed. Please try again.'},response.status);
  if(result.session){const {error}=await client.auth.setSession(result.session);if(error)return accountJson({error:'Could not save your sign-in. Please try again.'},503);}
  // Provider tokens remain in HttpOnly cookies and are never returned to browser JS.
  return accountJson(result.account?{account:result.account}:{success:true});
 }catch{return accountJson({error:'Could not reach the account service. Please try again.'},503);}
}
