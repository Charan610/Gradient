import Link from 'next/link';
import { BrandMark } from '@/components/ui/BrandMark';
import styles from './AuthFrame.module.scss';
export function AuthFrame({children}:{children:React.ReactNode}) { return <main className={styles.frame}><Link href="/" className={styles.brand}><BrandMark/>Gradient</Link><div className={styles.layout}><aside><span>YOUR NEXT CHAPTER</span><h2>Start small.<br/>Go somewhere<br/><em>remarkable.</em></h2><p>A calm space to learn, practice, and build something you can call your own.</p><ol><li>Begin with your first C++ program.</li><li>Keep your notes and work together.</li><li>Return whenever you’re ready.</li></ol><small>30 guided foundation lessons. At your own pace.</small></aside><div>{children}</div></div></main>; }
