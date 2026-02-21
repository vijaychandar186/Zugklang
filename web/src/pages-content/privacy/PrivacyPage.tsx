import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import LegalContent from '../LegalContent';
import { Footer } from '../landing/components/Footer';
import { privacyContent } from '@/pages-content/privacy/constants/privacyContent';

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className='bg-background text-foreground min-h-screen'>
        <Navbar />
        <main className='mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
          <LegalContent
            title={privacyContent.title}
            lastUpdated={privacyContent.lastUpdated}
            sections={privacyContent.sections}
          />
        </main>
        <Footer />
      </div>
    </PageContainer>
  );
}
