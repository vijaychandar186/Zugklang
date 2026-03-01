import { NavItem } from '@/types/navitem';
export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'home',
    shortcut: ['h', 'h']
  },
  {
    title: 'Play',
    url: '/play',
    icon: 'play',
    shortcut: ['p', 'p'],
    items: [
      {
        title: 'Local',
        url: '/play/local',
        shortcut: ['l', 'o'],
        items: [
          { title: 'Standard', url: '/play/local/standard' },
          { title: 'Atomic', url: '/play/local/atomic' },
          { title: 'Antichess', url: '/play/local/antichess' },
          { title: 'Crazyhouse', url: '/play/local/crazyhouse' },
          { title: 'Fischer Random', url: '/play/local/fischer-random' },
          { title: 'Horde', url: '/play/local/horde' },
          { title: 'King of the Hill', url: '/play/local/king-of-the-hill' },
          { title: 'Racing Kings', url: '/play/local/racing-kings' },
          { title: 'Three-Check', url: '/play/local/three-check' },
          { title: 'Checkers Chess', url: '/play/local/checkers-chess' }
        ]
      },
      {
        title: 'Computer',
        url: '/play/computer',
        shortcut: ['c', 'p'],
        items: [
          { title: 'Standard', url: '/play/computer/standard' },
          { title: 'Atomic', url: '/play/computer/atomic' },
          { title: 'Antichess', url: '/play/computer/antichess' },
          { title: 'Crazyhouse', url: '/play/computer/crazyhouse' },
          { title: 'Fischer Random', url: '/play/computer/fischer-random' },
          { title: 'Horde', url: '/play/computer/horde' },
          { title: 'King of the Hill', url: '/play/computer/king-of-the-hill' },
          { title: 'Racing Kings', url: '/play/computer/racing-kings' },
          { title: 'Three-Check', url: '/play/computer/three-check' },
          { title: 'Checkers Chess', url: '/play/computer/checkers-chess' }
        ]
      },
      {
        title: 'Multiplayer',
        url: '/play/multiplayer',
        shortcut: ['m', 'p'],
        items: [
          { title: 'Standard', url: '/play/multiplayer/standard' },
          { title: 'Atomic', url: '/play/multiplayer/atomic' },
          { title: 'Antichess', url: '/play/multiplayer/antichess' },
          { title: 'Crazyhouse', url: '/play/multiplayer/crazyhouse' },
          { title: 'Fischer Random', url: '/play/multiplayer/fischer-random' },
          { title: 'Horde', url: '/play/multiplayer/horde' },
          {
            title: 'King of the Hill',
            url: '/play/multiplayer/king-of-the-hill'
          },
          { title: 'Racing Kings', url: '/play/multiplayer/racing-kings' },
          { title: 'Three-Check', url: '/play/multiplayer/three-check' },
          { title: 'Checkers Chess', url: '/play/multiplayer/checkers-chess' }
        ]
      },
      {
        title: 'Custom',
        url: '/play/custom',
        shortcut: ['c', 'u'],
        items: [
          { title: 'Card Chess', url: '/play/custom/card-chess' },
          { title: 'Dice Chess', url: '/play/custom/dice-chess' },
          { title: 'Four Player', url: '/play/custom/four-player' },
          {
            title: 'Tri-D Chess',
            url: '/play/custom/tri-d'
          }
        ]
      },
      {
        title: 'Custom Multiplayer',
        url: '/play/custom-multiplayer',
        shortcut: ['c', 'm'],
        items: [
          {
            title: 'Four Player Chess',
            url: '/play/custom-multiplayer/four-player'
          },
          { title: 'Dice Chess', url: '/play/custom-multiplayer/dice-chess' },
          { title: 'Card Chess', url: '/play/custom-multiplayer/card-chess' }
        ]
      }
    ]
  },
  {
    title: 'Tools',
    url: '/tools',
    icon: 'wrench',
    shortcut: ['t', 't'],
    items: [
      { title: 'Analysis', url: '/tools/analysis' },
      { title: 'Game Review', url: '/tools/game-review' }
    ]
  },
  {
    title: 'Practice',
    url: '/practice',
    icon: 'practice',
    shortcut: ['p', 'r'],
    items: [
      { title: 'Openings', url: '/practice/learn/openings' },
      { title: 'Puzzles: Standard', url: '/practice/puzzles/standard' },
      { title: 'Puzzles: Rush', url: '/practice/puzzles/rush' },
      { title: 'Memory', url: '/practice/cognitive/memory' },
      { title: 'Vision', url: '/practice/cognitive/vision' }
    ]
  },
  {
    title: 'History',
    url: '/history',
    icon: 'book',
    shortcut: ['g', 'g']
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: 'settings',
    shortcut: ['s', 's']
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: 'player',
    shortcut: ['p', 'f']
  },
  {
    title: 'Legal',
    url: '/privacy',
    icon: 'fileText',
    shortcut: ['l', 'g'],
    items: [
      { title: 'Privacy', url: '/privacy' },
      { title: 'Terms', url: '/terms' }
    ]
  }
];
