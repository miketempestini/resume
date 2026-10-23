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

// Scene lengths (frames @ 30fps) in play order; start/end frames are derived below
export const FPS = 30;
const LENGTHS = {
  intro: 75,
  coyote: 180,
  truckstop: 150,
  otr: 150,
  stage: 120,
  side: 135,
  outro: 90,
};
export type SceneName = keyof typeof LENGTHS;

export const T = {} as Record<SceneName, readonly [number, number]>;
let start = 0;
for (const [name, len] of Object.entries(LENGTHS) as [SceneName, number][]) {
  T[name] = [start, start + len];
  start += len;
}
export const TOTAL = start;
