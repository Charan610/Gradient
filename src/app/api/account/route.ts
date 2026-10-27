import {accountJson,accountsConfigured,currentAccount} from '@/lib/account/server';
export const dynamic='force-dynamic';
export async function GET(){
 try{return accountJson({configured:accountsConfigured(),account:await currentAccount()});}
 catch{return accountJson({error:'Your account could not be loaded. Please try again.'},503);}
}
