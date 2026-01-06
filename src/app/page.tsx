import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/pages-content/landing/components/Navbar';
import { Hero } from '@/pages-content/landing/components/Hero';
import { Features } from '@/pages-content/landing/components/Features';
import { FAQ } from '@/pages-content/landing/components/FAQ';
import { Footer } from '@/pages-content/landing/components/Footer';

export const metadata: Metadata = {
  title: 'Zugklang | Where Strategy Meets Symphony',
  description:
    'Experience chess with immersive audio feedback and premium aesthetics. Play against Stockfish 16, analyze games, and improve your skills.'
};

function Divider() {
  return <hr className='border-border mx-auto w-11/12' />;
}

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <Navbar />
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <FAQ />
      <Divider />
      <Footer />
    </PageContainer>
  );
}
