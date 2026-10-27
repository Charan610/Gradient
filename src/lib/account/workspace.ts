// Initialized before study components mount. Account changes use a full navigation
// so pending writes and cached lesson state cannot cross identity boundaries.
let workspaceId:string|null=null;
const accountPrefix='gradient_workspace_';
export function initializeWorkspace(id:string|null){workspaceId=id;}
export function workspaceStorageKey(key:string){return workspaceId?`${accountPrefix}${workspaceId}_${key}`:key;}
export function portableStorageKey(key:string):string|null{
 if(!workspaceId)return key.startsWith(accountPrefix)?null:key;
 const prefix=`${accountPrefix}${workspaceId}_`;
 return key.startsWith(prefix)?key.slice(prefix.length):null;
}
export function projectStorageKey(id:string){return workspaceStorageKey(`foundation_proj_${id}`);}
