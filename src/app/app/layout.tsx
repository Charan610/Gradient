import type {Metadata} from 'next';
import {Workspace3DBackground} from '@/components/ui/Workspace3DBackground';

export const metadata:Metadata={robots:{index:false,follow:false}};
export default function PrivateLayout({children}:{children:React.ReactNode}){
  return (
    <>
      <Workspace3DBackground />
      {children}
    </>
  );
}
