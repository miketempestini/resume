import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Chip, Eyebrow, Scene, rise, useSpring} from '../anim';
import {C} from '../theme';

// Footage clips live in public/ — trimmed to their first 4.5s, muted, 30fps
const Talk: React.FC<{delay: number; clip: string; chip: string; title: string; desc: string}> = ({
  delay,
  clip,
  chip,
  title,
  desc,
}) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay);
  // Small pulse on the live dot
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin((frame - delay) / 9));
  const tag = interpolate(frame, [delay + 8, delay + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
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
      {/* Footage starts the moment this card appears */}
      <Sequence from={delay} layout="none">
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to top, rgba(11,15,23,0.98) 0%, rgba(11,15,23,0.92) 38%, rgba(11,15,23,0.4) 62%, rgba(11,15,23,0) 82%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px 8px 14px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '0.04em',
          opacity: tag,
        }}
      >
        <span style={{width: 12, height: 12, borderRadius: '50%', background: '#ef4444', opacity: pulse, boxShadow: '0 0 10px rgba(239,68,68,0.8)'}} />
        LIVE
      </div>
      <div style={{position: 'relative'}}>
        <Chip accent style={{background: 'rgba(129,140,248,0.22)'}}>{chip}</Chip>
        <div style={{fontSize: 50, fontWeight: 800, letterSpacing: '-0.03em', color: C.text, marginTop: 20, lineHeight: 1.1}}>{title}</div>
        <div style={{fontSize: 26, color: '#c3cbd8', marginTop: 14, lineHeight: 1.4}}>{desc}</div>
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
          clip="tia-2025.mp4"
          chip="TIA 2025 · Conference talk"
          title="Gaining a Competitive Edge"
          desc="Freight automation best practices — a six-step implementation framework and real-world case studies."
        />
        <Talk
          delay={26}
          clip="freightwaves-2025.mp4"
          chip="FreightWaves 2025 · Live demo"
          title="OTR Solutions Product Demo"
          desc="Live product demo of the OTR Solutions platform, presented on stage."
        />
      </div>
    </Scene>
  );
};
