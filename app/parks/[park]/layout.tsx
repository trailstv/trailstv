import { PARK_SLUGS } from '@/lib/parks';

export function generateStaticParams() {
  return PARK_SLUGS.map(slug => ({ park: slug }));
}

export default function ParkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
