import type {Metadata} from 'next';
export const metadata:Metadata={title:'The learning roadmap',description:'Explore six guided courses and a nine-phase roadmap, from C++ foundations through backend engineering and grounded AI.',alternates:{canonical:'/explore'}};
export default function PublicLayout({children}:{children:React.ReactNode}){return children;}
