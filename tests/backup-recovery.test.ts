import {it,expect} from 'vitest';
import {offerBackup,exportRecoveryBackup,readRecoveryIdentity,RECOVERY_SESSION_KEY} from '../src/lib/db/backup-tools';
const profile={user_id:'local_user',alias:'Learner',academic_semester:'2-2',target_role:'Learning',preferred_daily_minutes:60,preferred_mode:'normal',theme:'light',onboarding_status:'completed',active_day_index:1};
function storage(values:Record<string,string>):Storage{return{get length(){return Object.keys(values).length},getItem:k=>values[k]??null,setItem:(k,v)=>{values[k]=v},removeItem:k=>{delete values[k]},key:i=>Object.keys(values)[i]??null,clear:()=>{}};}
it('offers a first backup and waits for five further lessons after an explicit dismissal or download',()=>{
 expect(offerBackup(0,null)).toBe(false);expect(offerBackup(1,null)).toBe(true);expect(offerBackup(1,1)).toBe(false);expect(offerBackup(5,1)).toBe(false);expect(offerBackup(6,1)).toBe(true);expect(offerBackup(2,10)).toBe(false);
});
it('exports only the previously verified identity, leaving storage and other accounts untouched',()=>{
 const values={gradient_workspace_a_foundation_career_os_local_user_profile:JSON.stringify(profile),gradient_workspace_b_foundation_career_os_local_user_profile:JSON.stringify({...profile,alias:'Private B'}),foundation_theme:'dark'};
 const before=JSON.stringify(values);const result=exportRecoveryBackup(storage(values),{id:'a',username:'Learner'});
 expect(result).not.toContain('Private B');expect(result).not.toContain('foundation_theme');expect(JSON.stringify(values)).toBe(before);
});
it('does not invent a recovery identity or offer another account when this tab has none',()=>{
 expect(readRecoveryIdentity(storage({}))).toBeNull();
 expect(readRecoveryIdentity(storage({[RECOVERY_SESSION_KEY]:'not json'}))).toBeNull();
 expect(()=>exportRecoveryBackup(storage({}),{id:'missing',username:'Learner'})).toThrow('No saved study profile');
});
it('exports the original workspace from a failed restore journal without storage writes',()=>{
 const scope='gradient_workspace_a_';const key=scope+'foundation_career_os_local_user_profile';
 const values:Record<string,string>={[key]:JSON.stringify({...profile,alias:'Partial replacement'}),[scope+'gradient_restore_journal']:JSON.stringify({version:1,before:{[key]:JSON.stringify(profile),[scope+'foundation_career_os_local_user_reviews']:'[]'}}),gradient_workspace_b_foundation_career_os_local_user_profile:JSON.stringify({...profile,alias:'Private B'})};
 const s=storage(values);s.setItem=()=>{throw Error('Quota')};const original=JSON.stringify(values);
 const bundle=JSON.parse(exportRecoveryBackup(s,{id:'a',username:'Learner'}));
 expect(bundle.profile.alias).toBe('Learner');expect(JSON.stringify(bundle)).not.toContain('Partial replacement');expect(JSON.stringify(bundle)).not.toContain('Private B');expect(JSON.stringify(values)).toBe(original);
});
