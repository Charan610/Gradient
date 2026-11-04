'use client';
import {useEffect,useState} from 'react';
import {ProgressRepository} from '@/lib/db/progress-repository';
import styles from './Courses.module.scss';
export function CourseInterest({courseId}:{courseId:string}){
 const [saved,setSaved]=useState(false);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{let active=true;ProgressRepository.getProfile().then(profile=>{if(active){setSaved(profile.saved_course_ids?.includes(courseId)||false);setLoading(false)}}).catch(()=>{if(active){setError('Saved interests could not be loaded. Reload to try again.');setLoading(false)}});return()=>{active=false}},[courseId]);
 return <div className={styles.interest}><button className="buttonSecondary" aria-pressed={saved} disabled={loading} onClick={async()=>{setLoading(true);setError('');try{const profile=await ProgressRepository.setCourseInterest('local_user',courseId,!saved);setSaved(profile.saved_course_ids?.includes(courseId)||false)}catch{setError('This interest could not be saved. Try again.')}finally{setLoading(false)}}}>{loading?'Opening saved interests…':saved?'Saved for later':'Save this course'}</button><p role="status">{saved?'Saved on this device. You can remove it with the same button.':'Keep this topic on your learning shelf.'} This saves an interest locally; it does not subscribe you to notifications.</p>{error&&<p role="alert">{error}</p>}</div>;
}
