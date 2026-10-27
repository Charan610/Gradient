import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {AccountForm} from '@/components/account/AccountForm';
export default function SignUpPage(){return <main className="workspaceEntry"><Link className="buttonTertiary" href="/"><ArrowLeft size={14}/>Home</Link><AccountForm/></main>}
