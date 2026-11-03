import type {Metadata} from 'next';
export const metadata:Metadata={title:'The learning roadmap',description:'Explore two guided courses and clearly labelled study outlines. Build C++ foundations, then practise introductory data structures and algorithms.',alternates:{canonical:'/explore'}};
export default function PublicLayout({children}:{children:React.ReactNode}){return children;}
