import {loadFont} from '@remotion/google-fonts/Inter';

export const {fontFamily} = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

// Mirrors the dark-theme tokens in ../index.html
export const C = {
  bg: '#0b0f17',
  card: '#121826',
  card2: '#161e30',
  border: '#1f2937',
  borderHi: '#2c3a52',
  text: '#e5e7eb',
  muted: '#a3afc2',
  faint: '#8a96a8',
  accent: '#818cf8',
  accentText: '#a5b4fc',
  accentSoft: 'rgba(129, 140, 248, 0.14)',
  hl: 'rgba(129, 140, 248, 0.32)',
  success: '#34d399',
  successSoft: 'rgba(52, 211, 153, 0.12)',
  amber: '#ffb547',
};

// Scene timing (frames @ 30fps)
export const FPS = 30;
export const T = {
  intro: [0, 75],
  coyote: [75, 255],
  truckstop: [255, 405],
  otr: [405, 555],
  stage: [555, 675],
  side: [675, 810],
  outro: [810, 900],
} as const;
export const TOTAL = 900;
