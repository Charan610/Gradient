/** Shared by repository reads, writes and restore. Never nest this lock. */
const pending = new Map<string, Promise<unknown>>();
function storageTask():Promise<void>{
 return new Promise(resolve=>{
  if(typeof MessageChannel==='undefined'){setTimeout(resolve,0);return;}
  const channel=new MessageChannel();
  channel.port1.onmessage=()=>{channel.port1.close();channel.port2.close();resolve();};
  channel.port2.postMessage(null);
 });
}
export function studyLockName(profileKey:string){return `gradient:study:${profileKey}`;}
export async function withStudyLock<T>(profileKey:string,operation:()=>T|Promise<T>,requireCrossTab=false):Promise<T>{
 const name=studyLockName(profileKey);
 if(typeof navigator!=='undefined'&&navigator.locks?.request){
  return await navigator.locks.request(name,{mode:'exclusive'},async()=>{
   // Yield for queued storage notifications. This is not a storage-coherence
   // guarantee; ordinary readers must never replay a restore undo image.
   await storageTask();
   try{return await operation();}
   finally{await storageTask();}
  });
 }
 // A restore must not start if readers in another tab cannot be coordinated.
 if(requireCrossTab)return Promise.reject(new Error('This browser cannot safely coordinate a restore. Use a browser with Web Locks support.'));
 const previous=pending.get(name)??Promise.resolve();
 const next=previous.catch(()=>undefined).then(operation);
 pending.set(name,next);
 void next.finally(()=>{if(pending.get(name)===next)pending.delete(name)}).catch(()=>undefined);
 return next;
}
