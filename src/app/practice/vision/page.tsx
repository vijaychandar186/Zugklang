import { VisionView } from '@/features/vision/components/VisionView';

export const metadata = {
  title: 'Vision Training | Zugklang',
  description:
    'Train your board awareness by identifying coordinates and valid moves'
};

export default function VisionPage() {
  return <VisionView />;
}
