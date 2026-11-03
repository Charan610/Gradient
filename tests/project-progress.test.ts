import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {initializeWorkspace,projectStorageKey} from '../src/lib/account/workspace';
import {readProjectProgress,saveProjectProgress} from '../src/lib/db/project-progress';
beforeEach(()=>{initializeWorkspace('project-test');const values=new Map<string,string>();vi.stubGlobal('navigator',{});vi.stubGlobal('localStorage',{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k),get length(){return values.size},key:(i:number)=>[...values.keys()][i]??null})});
afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
it('keeps concurrent milestone edits and existing project notes',async()=>{
 await saveProjectProgress('PROJ-A',{repoUrl:'https://example.com/repo',notes:'Keep my work'});
 await Promise.all([saveProjectProgress('PROJ-A',{milestones:{one:true}}),saveProjectProgress('PROJ-A',{milestones:{two:true}})]);
 expect(await readProjectProgress('PROJ-A')).toMatchObject({milestones:{one:true,two:true},notes:'Keep my work',repoUrl:'https://example.com/repo'});
});
it('does not overwrite unreadable project records',async()=>{
 const key=projectStorageKey('PROJ-A');localStorage.setItem(key,'damaged-but-preserved');
 await expect(saveProjectProgress('PROJ-A',{notes:'New'})).rejects.toThrow();expect(localStorage.getItem(key)).toBe('damaged-but-preserved');
});
it('rejects queued project work after switching accounts',async()=>{
 const pending=saveProjectProgress('PROJ-A',{notes:'Account A private notes'});initializeWorkspace('account-b');
 await expect(pending).rejects.toThrow('Workspace changed');expect(localStorage.getItem(projectStorageKey('PROJ-A'))).toBeNull();
});
