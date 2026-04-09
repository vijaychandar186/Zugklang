import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { SettingsPageView } from '@/features/settings/components/SettingsPageView';
export const metadata: Metadata = {
  title: 'Settings | Zugklang',
  description: 'Manage your chess and account preferences.'
};
export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  return (
    <PageContainer scrollable={true}>
      <Navbar />
      <SettingsPageView />
    </PageContainer>
  );
}
