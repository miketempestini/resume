import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useSpring = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, mass: 0.8}});
};

export const rise = (p: number, dist = 30): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dist}px)`,
});

export const Counter: React.FC<{to: number; start: number; dur?: number; dec?: number}> = ({
  to,
  start,
  dur = 36,
  dec = 0,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [0, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{v.toFixed(dec)}</span>;
};

// Highlighter sweep behind a phrase, like the site's .hl
export const Sweep: React.FC<{start: number; dur?: number; children: React.ReactNode}> = ({
  start,
  dur = 22,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 100], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${C.hl}, ${C.hl})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 90%',
        backgroundSize: `${p}% 40%`,
      }}
    >
      {children}
    </span>
  );
};

// Fades each scene in and out
export const Scene: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const inP = interpolate(frame, [0, 10], [0, 1], clamp);
  const outP = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp);
  const scale = interpolate(outP, [0, 1], [0.985, 1]);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inP, outP),
        transform: `scale(${scale})`,
        padding: '130px 140px 190px',
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Chip: React.FC<{children: React.ReactNode; accent?: boolean; style?: React.CSSProperties}> = ({
  children,
  accent,
  style,
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 18px',
      borderRadius: 999,
      fontSize: 22,
      fontWeight: 600,
      background: accent ? C.accentSoft : C.card,
      border: `1px solid ${accent ? 'transparent' : C.border}`,
      color: accent ? C.accentText : C.muted,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 24,
      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Eyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: C.accentText,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Logo: React.FC<{src: string; size?: number}> = ({src, size = 104}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.21,
      background: '#fff',
      padding: size * 0.11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 0 6px ${C.accentSoft}`,
      flexShrink: 0,
    }}
  >
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
  </div>
);

export const JobHeader: React.FC<{
  logo: string;
  company: string;
  meta: string;
  title: string;
  subtitle?: React.ReactNode;
  delay?: number;
}> = ({logo, company, meta, title, subtitle, delay = 0}) => {
  const a = useSpring(delay);
  const b = useSpring(delay + 6);
  const c = useSpring(delay + 12);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, ...rise(a)}}>
        <Logo src={logo} />
        <div>
          <div style={{fontSize: 34, fontWeight: 700, color: C.text}}>{company}</div>
          <div style={{fontSize: 24, color: C.faint, fontWeight: 500, marginTop: 2}}>{meta}</div>
        </div>
      </div>
      <div
        style={{
          fontSize: 70,
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.05,
          color: C.text,
          ...rise(b, 40),
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div style={{fontSize: 30, color: C.muted, lineHeight: 1.4, ...rise(c)}}>{subtitle}</div>
      ) : null}
    </div>
  );
};

export const Metric: React.FC<{value: React.ReactNode; label: string; delay: number; size?: number}> = ({
  value,
  label,
  delay,
  size = 64,
}) => {
  const p = useSpring(delay);
  return (
    <Card style={{padding: '24px 28px', flex: 1, ...rise(p)}}>
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          color: C.accentText,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
      <div style={{fontSize: 22, color: C.muted, marginTop: 12, fontWeight: 500, lineHeight: 1.3}}>{label}</div>
    </Card>
  );
};

// Grey placeholder line for mock UI
export const Bar: React.FC<{w: number | string; h?: number; color?: string; style?: React.CSSProperties}> = ({
  w,
  h = 14,
  color = '#243047',
  style,
}) => <div style={{width: w, height: h, borderRadius: h, background: color, ...style}} />;

export const Check: React.FC<{p: number; size?: number}> = ({p, size = 34}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: C.successSoft,
      border: `2px solid ${C.success}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${p})`,
      opacity: p,
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);
