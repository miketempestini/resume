import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Chip, Eyebrow, Scene, rise, useSpring} from '../anim';
import {C} from '../theme';

const Talk: React.FC<{delay: number; chip: string; title: string; desc: string}> = ({delay, chip, title, desc}) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay);
  // Spotlight flickers on, then holds
  const light = interpolate(frame, [delay + 6, delay + 9, delay + 11, delay + 14, delay + 22], [0, 0.9, 0.35, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const play = useSpring(delay + 16, 12);
  return (
    <div
      style={{
        flex: 1,
        height: 520,
        borderRadius: 28,
        border: `1px solid ${C.border}`,
        background: '#0d121d',
        position: 'relative',
        overflow: 'hidden',
        padding: 44,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        ...rise(p, 50),
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: light,
          background:
            'radial-gradient(60% 90% at 50% -10%, rgba(165,180,252,0.28), rgba(129,140,248,0.08) 45%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 96,
          width: 110,
          height: 110,
          marginLeft: -55,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '2px solid rgba(255,255,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${play})`,
          opacity: play,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill={C.text}>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div style={{position: 'relative'}}>
        <Chip accent>{chip}</Chip>
        <div style={{fontSize: 50, fontWeight: 800, letterSpacing: '-0.03em', color: C.text, marginTop: 20, lineHeight: 1.1}}>{title}</div>
        <div style={{fontSize: 26, color: C.muted, marginTop: 14, lineHeight: 1.4}}>{desc}</div>
      </div>
    </div>
  );
};

export const Stage: React.FC = () => {
  const h = useSpring(0);
  return (
    <Scene style={{justifyContent: 'center'}}>
      <div style={rise(h)}>
        <Eyebrow>On stage</Eyebrow>
        <div style={{fontSize: 70, fontWeight: 800, letterSpacing: '-0.035em', color: C.text, marginTop: 12}}>Talks &amp; live demos</div>
      </div>
      <div style={{display: 'flex', gap: 36, marginTop: 44}}>
        <Talk
          delay={12}
          chip="TIA 2025 · Conference talk"
          title="Gaining a Competitive Edge"
          desc="Freight automation best practices — a six-step implementation framework and real-world case studies."
        />
        <Talk
          delay={26}
          chip="FreightWaves 2025 · Live demo"
          title="OTR Solutions Product Demo"
          desc="Live product demo of the OTR Solutions platform, presented on stage."
        />
      </div>
    </Scene>
  );
};
