import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import LegalContent from '../LegalContent';
import { Footer } from '../landing/components/Footer';
import { termsContent } from '@/pages-content/terms/constants/termsContent';

export default function TermsPage() {
  return (
    <PageContainer>
      <div className='bg-background text-foreground min-h-screen'>
        <Navbar />
        <main className='mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
          <LegalContent
            title={termsContent.title}
            lastUpdated={termsContent.lastUpdated}
            sections={termsContent.sections}
          />
        </main>
        <Footer />
      </div>
    </PageContainer>
  );
}
