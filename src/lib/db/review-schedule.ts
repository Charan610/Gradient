// Shared by scheduling and portable backup validation.
export const REVIEW_OFFSETS = [1, 3, 7, 21, 45] as const;

export function recallStep(profile:{active_day_index:number;recall_step?:number}) {
 const cursor=profile.recall_step;
 return Math.max(profile.active_day_index,typeof cursor==='number'&&Number.isInteger(cursor)&&cursor>0?cursor:profile.active_day_index);
}
