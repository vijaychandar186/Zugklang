import Link from 'next/link';

const footerLinks = [
  {
    heading: 'Play',
    links: [
      { label: 'vs Computer', href: '/play/computer' },
      { label: 'Local Multiplayer', href: '/play/local' },
      { label: 'Online Multiplayer', href: '/play/multiplayer' },
      { label: 'Custom Modes', href: '/play/custom' }
    ]
  },
  {
    heading: 'Practice',
    links: [
      { label: 'Puzzles', href: '/practice/puzzles' },
      { label: 'Puzzle Rush', href: '/practice/puzzles/rush' },
      { label: 'Opening Explorer', href: '/practice/learn/openings' },
      { label: 'Memory & Vision', href: '/practice/memory' }
    ]
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Analysis Board', href: '/tools/analysis' },
      { label: 'Game Review', href: '/tools/game-review' }
    ]
  },
  {
    heading: 'Info',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' }
    ]
  }
];

export function Footer() {
  return (
    <footer className='border-t'>
      <div className='mx-auto max-w-7xl px-4 py-12'>
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-4'>
          {footerLinks.map((section) => (
            <div key={section.heading} className='flex flex-col gap-3'>
              <p className='text-sm font-semibold'>{section.heading}</p>
              <ul className='flex flex-col gap-2'>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-muted-foreground hover:text-primary text-sm transition-colors'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='mt-10 flex flex-col items-center gap-2 border-t pt-6 text-center sm:flex-row sm:justify-between'>
          <p className='text-sm font-semibold tracking-tight'>Zugklang</p>
          <p className='text-muted-foreground text-xs'>
            © {new Date().getFullYear()} Zugklang. Where Strategy Meets
            Symphony.
          </p>
        </div>
      </div>
    </footer>
  );
}
