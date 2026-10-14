import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Chip, Eyebrow, Scene, rise, useSpring} from '../anim';
import {C} from '../theme';

const BitcoinArt: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [delay + 10, delay + 50], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lock = useSpring(delay + 40, 14);
  return (
    <div style={{width: '100%', height: '100%', background: 'linear-gradient(160deg, #1a1408, #0d121d 60%)', position: 'relative'}}>
      <svg viewBox="0 0 520 292" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        {[70, 130, 190, 250].map((y) => (
          <line key={y} x1="30" x2="490" y1={y} y2={y} stroke="#1f2937" strokeWidth="1" />
        ))}
        <path
          d="M30 230 L90 214 L140 222 L190 180 L240 192 L290 150 L340 160 L390 112 L440 124 L490 78"
          fill="none"
          stroke="#f7931a"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={draw}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 26,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#f7931a',
          color: '#fff',
          fontSize: 40,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ₿
      </div>
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 30,
          padding: '8px 16px',
          borderRadius: 999,
          background: C.successSoft,
          color: C.success,
          fontSize: 20,
          fontWeight: 700,
          opacity: lock,
          transform: `scale(${0.85 + lock * 0.15})`,
        }}
      >
        🔒 100% local
      </div>
    </div>
  );
};

const Project: React.FC<{
  delay: number;
  chip: string;
  title: string;
  desc: string;
  img?: string;
  zoom?: number;
  art?: React.ReactNode;
}> = ({delay, chip, title, desc, img, zoom = 1, art}) => {
  const p = useSpring(delay, 20);
  return (
    <div style={{flex: 1, perspective: 1800}}>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 26,
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
          opacity: Math.min(1, p * 1.4),
          transform: `rotateY(${(1 - p) * 55}deg) translateY(${(1 - p) * 40}px)`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{height: 300, overflow: 'hidden', borderBottom: `1px solid ${C.border}`}}>
          {img ? <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} /> : art}
        </div>
        <div style={{padding: '26px 30px 32px'}}>
          <Chip accent>{chip}</Chip>
          <div style={{fontSize: 42, fontWeight: 800, letterSpacing: '-0.025em', color: C.text, marginTop: 16}}>{title}</div>
          <div style={{fontSize: 24, color: C.muted, marginTop: 10, lineHeight: 1.4, minHeight: 68}}>{desc}</div>
        </div>
      </div>
    </div>
  );
};

export const Side: React.FC = () => {
  const h = useSpring(0);
  return (
    <Scene style={{justifyContent: 'center'}}>
      <div style={rise(h)}>
        <Eyebrow>Built on my own time</Eyebrow>
        <div style={{fontSize: 70, fontWeight: 800, letterSpacing: '-0.035em', color: C.text, marginTop: 12}}>Side projects</div>
      </div>
      <div style={{display: 'flex', gap: 32, marginTop: 40}}>
        <Project delay={12} img="cart-jockey.png" chip="Browser game" title="Cart Jockey" desc="Wrangle shopping carts across a parking lot before your shift ends." />
        <Project delay={22} img="band-rise.jpg" chip="Strategy sim" title="Band Rise" desc="Go from bedroom musician to international stardom." />
        <Project
          delay={32}
          art={<BitcoinArt delay={32} />}
          chip="Local app · Privacy-first"
          title="Bitcoin Portfolio"
          desc="A 100% local, private Bitcoin purchase tracker for financial planning."
        />
      </div>
    </Scene>
  );
};
