import type { Metadata } from 'next';
import SignInViewPage from '@/components/auth/sign-in-view';

export const metadata: Metadata = {
  title: 'Sign In | Zugklang',
  description: 'Sign in to access Zugklang.'
};

export default function Page() {
  return <SignInViewPage />;
}
