'use client';
import dynamic from 'next/dynamic';

const HeroSlideshow = dynamic(
  () => import('@/components/HeroSlideshow'),
  {
    ssr: false,
    loading: () => (
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#091420 0%,#0D1B2A 100%)' }}/>
    ),
  }
);

export default function HeroSlideshowClient() {
  return <HeroSlideshow/>;
}
