import { AppShell } from '@/components/layout/AppShell';
import { WorkspaceSkeleton } from '@/components/ui/WorkspaceSkeleton';
export default function Loading() { return <AppShell><h1 className="sr-only">Loading your workspace page</h1><WorkspaceSkeleton /></AppShell>; }
