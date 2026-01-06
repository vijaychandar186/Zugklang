import {
  Navbar,
  Hero,
  Features,
  FAQ,
  Footer
} from '@/features/landing/components';

export default function Page() {
  return (
    <main className='bg-background min-h-screen'>
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
