import {beforeEach,expect,it,vi} from 'vitest';
const h=vi.hoisted(()=>({refs:[] as {current:any}[],index:0,effects:[] as (()=>any)[],layouts:[] as (()=>any)[],revision:'initial',workspace:'',write:vi.fn(),drafts:new Map<string,string>()}));
vi.mock('react',()=>({useRef:(value:any)=>h.refs[h.index++]??(h.refs[h.index-1]={current:value}),useState:(value:any)=>[typeof value==='function'?value():value,vi.fn()],useCallback:(fn:any)=>fn,useEffect:(fn:any)=>h.effects.push(fn),useLayoutEffect:(fn:any)=>h.layouts.push(fn)}));
vi.mock('@/lib/db/progress-repository',()=>({ProgressRepository:{updateDayNotes:(...args:any[])=>h.write(...args)}}));
vi.mock('@/lib/db/lesson-drafts',()=>({lessonDraftRevision:()=>h.revision}));
vi.mock('@/lib/account/workspace',()=>({workspaceStorageKey:(key:string)=>h.workspace+key}));
import {LessonNotes} from '../src/components/learn/LessonNotes';
function find(node:any,type:string):any {if(node?.type===type)return node;for(const child of node?.children?.flat(Infinity)??[]){const found=find(child,type);if(found)return found;}}
function editor(){const tree=LessonNotes({dayId:'P0-D01',initialNotes:'original'});return {textarea:find(tree,'textarea'),button:find(tree,'button')};}
beforeEach(()=>{h.refs=[];h.index=0;h.effects=[];h.layouts=[];h.revision='initial';h.workspace='';h.write.mockReset();h.drafts.clear();vi.stubGlobal('React',{createElement:(type:any,props:any,...children:any[])=>({type,props,children})});vi.stubGlobal('sessionStorage',{getItem:(key:string)=>h.drafts.get(key)??null,setItem:(key:string,value:string)=>h.drafts.set(key,value),removeItem:(key:string)=>h.drafts.delete(key)});});
it('writes a revert after an overlapping save instead of skipping it',async()=>{
 let finish!:()=>void;h.write.mockImplementationOnce(()=>new Promise<void>(resolve=>{finish=resolve})).mockResolvedValue(undefined);
 const {textarea}=editor();textarea.props.onChange({target:{value:'changed'}});textarea.props.onBlur();await Promise.resolve();
 textarea.props.onChange({target:{value:'original'}});textarea.props.onBlur();finish();await h.refs[4].current;
 expect(h.write.mock.calls.map(call=>call[2])).toEqual(['changed','original']);
});
it('does not run a queued write after backup restore changes the revision',async()=>{
 let finish!:()=>void;h.write.mockImplementationOnce(()=>new Promise<void>(resolve=>{finish=resolve}));
 const {textarea}=editor();textarea.props.onChange({target:{value:'first'}});textarea.props.onBlur();await Promise.resolve();
 textarea.props.onChange({target:{value:'second'}});textarea.props.onBlur();h.revision='restored';finish();await h.refs[4].current;
 expect(h.write).toHaveBeenCalledTimes(1);expect(h.drafts.get('gradient_lesson_draft_P0-D01_initial')).toBe('second');
});

it('does not write into a different workspace with the same initial revision',async()=>{
 h.workspace='account-a_';h.write.mockResolvedValue(undefined);
 const {textarea}=editor();textarea.props.onChange({target:{value:'private account A notes'}});textarea.props.onBlur();
 // Workspace initialization can run before the queued save microtask.
 h.workspace='account-b_';await h.refs[4].current;
 expect(h.write).not.toHaveBeenCalled();
 expect(h.drafts.get('account-a_gradient_lesson_draft_P0-D01_initial')).toBe('private account A notes');
 expect([...h.drafts.keys()].some(key=>key.startsWith('account-b_'))).toBe(false);
});
it('does not acknowledge or clear the old draft if workspace changes during a save',async()=>{
 h.workspace='account-a_';h.write.mockImplementation(()=>{h.workspace='account-b_';return Promise.resolve();});
 const {textarea}=editor();textarea.props.onChange({target:{value:'private account A notes'}});textarea.props.onBlur();await h.refs[4].current;
 expect(h.refs[1].current).toBe('original');
 expect(h.drafts.get('account-a_gradient_lesson_draft_P0-D01_initial')).toBe('private account A notes');
});

it('keeps a reverted tab draft through the layout commit while an earlier save is queued',async()=>{
 vi.stubGlobal('window',{setTimeout:()=>0,clearTimeout:()=>{}});
 h.write.mockResolvedValue(undefined);
 const {textarea}=editor();
 textarea.props.onChange({target:{value:'changed'}});textarea.props.onBlur();
 textarea.props.onChange({target:{value:'original'}});
 // The existing change handler clears a draft equal to saved.current.
 expect(h.drafts.has('gradient_lesson_draft_P0-D01_initial')).toBe(false);
 // React runs layout effects synchronously on commit, before later unload tasks.
 h.layouts.forEach(effect=>effect());
 expect(h.drafts.get('gradient_lesson_draft_P0-D01_initial')).toBe('original');
 await h.refs[4].current;
 expect(h.drafts.get('gradient_lesson_draft_P0-D01_initial')).toBe('original');
});
