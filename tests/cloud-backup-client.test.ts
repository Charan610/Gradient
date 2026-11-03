import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {initializeWorkspace} from '../src/lib/account/workspace';
import {cloudBackupRequest,parseCloudCopies} from '../src/lib/db/cloud-backup-client';
const account='11111111-1111-4111-8111-111111111111';
beforeEach(()=>initializeWorkspace(account));afterEach(()=>{initializeWorkspace(null);vi.unstubAllGlobals()});
it('refuses to send records after the workspace switches',async()=>{const fetch=vi.fn();vi.stubGlobal('fetch',fetch);initializeWorkspace('other');await expect(cloudBackupRequest(account,'GET')).rejects.toThrow('workspace changed');expect(fetch).not.toHaveBeenCalled()});
it('binds requests to the captured account and refuses redirects',async()=>{const fetch=vi.fn(async()=>Response.json({backups:[]}));vi.stubGlobal('fetch',fetch);await cloudBackupRequest(account,'GET');expect(fetch).toHaveBeenCalledWith('/api/backups',expect.objectContaining({redirect:'error',credentials:'same-origin',cache:'no-store',headers:expect.objectContaining({'x-gradient-account':account})}))});
it('does not offer a response from an account that changed during the request',async()=>{vi.stubGlobal('fetch',vi.fn(async()=>{initializeWorkspace('other');return Response.json({backups:[]})}));await expect(cloudBackupRequest(account,'GET')).rejects.toThrow('workspace changed')});
it('rejects invalid payloads and cloud IDs before sending anything',async()=>{const fetch=vi.fn();vi.stubGlobal('fetch',fetch);await expect(cloudBackupRequest(account,'POST',{source:'{}'})).rejects.toThrow();await expect(cloudBackupRequest(account,'DELETE',{id:'../../private'})).rejects.toThrow('valid cloud copy');expect(fetch).not.toHaveBeenCalled()});
it('shows a service error without pretending a backup was saved',async()=>{vi.stubGlobal('fetch',vi.fn(async()=>Response.json({error:'Cloud backups are not configured yet.'},{status:503})));await expect(cloudBackupRequest(account,'GET')).rejects.toThrow('not configured')});
it('validates cloud metadata and excludes unexpected response fields',()=>{const row={id:account,created_at:'2026-11-03T10:00:00Z',byte_length:128,source:'private'};expect(parseCloudCopies([row])).toEqual([{id:account,created_at:row.created_at,byte_length:128}]);for(const value of [[{...row,id:'bad'}],[{...row,created_at:'bad'}],[{...row,byte_length:4*1024*1024}],null])expect(()=>parseCloudCopies(value)).toThrow()});
it('reports an interrupted upload as an unknown outcome instead of claiming it failed',async()=>{
 const profile={user_id:'local_user',alias:'Student',academic_semester:'2-2',target_role:'Learning',preferred_daily_minutes:60,preferred_mode:'normal',theme:'light',onboarding_status:'completed',active_day_index:1};
 const source=JSON.stringify({format_version:1,storage_mode:'local',profile,local_records:{}});
 vi.stubGlobal('fetch',vi.fn(async()=>{throw new DOMException('Timed out','TimeoutError')}));
 await expect(cloudBackupRequest(account,'POST',{source})).rejects.toThrow('outcome is unknown');
});
