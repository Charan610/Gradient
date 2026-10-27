import {z} from 'zod';
const username=z.string().trim().min(3,'Use at least 3 characters.').max(24,'Use at most 24 characters.').regex(/^[a-zA-Z][a-zA-Z0-9_.]*$/,'Start with a letter; use letters, numbers, dots or underscores.').transform(value=>value.toLowerCase());
export const passwordSchema=z.string().min(10,'Use at least 10 characters for your password.').max(128,'Use at most 128 characters.');
export const signupSchema=z.object({username,password:z.preprocess(value=>value===''?undefined:value,passwordSchema.optional()),semester:z.enum(['1-1','1-2','2-1','2-2','3-1','3-2','4-1','4-2']).default('2-2'),minutes:z.union([z.literal(45),z.literal(60),z.literal(90),z.literal(120),z.literal(150)]).default(90)});
export const signinSchema=z.object({username,password:z.string().min(1,'Enter your password.').max(128)});
export interface StudyAccount {id:string;username:string;hasPassword:boolean;semester:string;minutes:number}
