import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {C, T, fontFamily} from './theme';
import {Intro} from './scenes/Intro';
import {Coyote} from './scenes/Coyote';
import {Truckstop} from './scenes/Truckstop';
import {Otr} from './scenes/Otr';
import {Stage} from './scenes/Stage';
import {Side} from './scenes/Side';
import {Outro} from './scenes/Outro';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const x = 68 + Math.sin(f / 70) * 10;
  const y = 28 + Math.cos(f / 90) * 10;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(148,163,184,0.14) 1.6px, transparent 1.6px)',
          backgroundSize: '44px 44px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)',
        }}
      />
      <AbsoluteFill
        style={{background: `radial-gradient(1000px circle at ${x}% ${y}%, rgba(129,140,248,0.16), transparent 60%)`}}
      />
    </AbsoluteFill>
  );
};

// Career rail along the bottom; fills as the story advances
const STOPS = [
  {label: 'Coyote Logistics', sub: '2019'},
  {label: 'Truckstop', sub: '2023'},
  {label: 'OTR Solutions', sub: '2025'},
  {label: 'On stage', sub: '2025'},
  {label: 'Side projects', sub: 'Now'},
];
const RAIL_X0 = 140;
const RAIL_X1 = 1780;
const RAIL_Y = 975;

const Rail: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = Math.min(
    interpolate(f, [T.coyote[0] - 6, T.coyote[0] + 10], [0, 1], clamp),
    interpolate(f, [T.side[1] - 10, T.side[1] + 4], [1, 0], clamp),
  );
  const starts = [T.coyote[0], T.truckstop[0], T.otr[0], T.stage[0], T.side[0]];
  const input: number[] = [];
  const output: number[] = [];
  starts.forEach((s, i) => {
    input.push(s, s + 20);
    output.push(i === 0 ? 0 : (i - 1) / 4, i / 4);
  });
  const progress = interpolate(f, input, output, clamp);
  const width = RAIL_X1 - RAIL_X0;
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{position: 'absolute', left: RAIL_X0, top: RAIL_Y, width, height: 4, borderRadius: 4, background: C.border}} />
      <div style={{position: 'absolute', left: RAIL_X0, top: RAIL_Y, width: width * progress, height: 4, borderRadius: 4, background: C.accent}} />
      {STOPS.map((s, i) => {
        const at = i / 4;
        const reached = progress >= at - 0.001;
        const current = reached && (i === 4 || progress < (i + 1) / 4 - 0.001);
        const x = RAIL_X0 + width * at;
        return (
          <div key={s.label} style={{position: 'absolute', left: x, top: RAIL_Y + 2, transform: 'translate(-50%, -50%)'}}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: reached ? C.accent : C.bg,
                border: `3px solid ${reached ? C.accent : C.borderHi}`,
                boxShadow: current ? `0 0 0 8px ${C.accentSoft}` : 'none',
                margin: '0 auto',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: '50%',
                transform: `translateX(${i === 0 ? '-12px' : i === 4 ? 'calc(-100% + 12px)' : '-50%'})`,
                whiteSpace: 'nowrap',
                textAlign: i === 0 ? 'left' : i === 4 ? 'right' : 'center',
              }}
            >
              <span style={{fontSize: 22, fontWeight: 700, color: current ? C.text : reached ? C.muted : C.faint}}>{s.label}</span>
              <span style={{fontSize: 20, fontWeight: 500, color: C.faint, marginLeft: 10}}>{s.sub}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = Math.min(
    interpolate(f, [T.coyote[0] - 6, T.coyote[0] + 10], [0, 1], clamp),
    interpolate(f, [T.side[1] - 10, T.side[1] + 4], [1, 0], clamp),
  );
  return (
    <div
      style={{
        position: 'absolute',
        top: 54,
        left: 140,
        right: 140,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        opacity,
      }}
    >
      <span style={{fontWeight: 700, color: C.text}}>Mike Tempestini</span>
      <span style={{fontWeight: 500, color: C.faint}}>Product Manager · Freight &amp; logistics tech</span>
    </div>
  );
};

const seq = (range: readonly [number, number]) => ({from: range[0], durationInFrames: range[1] - range[0]});

export const Reel: React.FC = () => (
  <AbsoluteFill style={{fontFamily, color: C.text}}>
    <Background />
    <Sequence {...seq(T.intro)}><Intro /></Sequence>
    <Sequence {...seq(T.coyote)}><Coyote /></Sequence>
    <Sequence {...seq(T.truckstop)}><Truckstop /></Sequence>
    <Sequence {...seq(T.otr)}><Otr /></Sequence>
    <Sequence {...seq(T.stage)}><Stage /></Sequence>
    <Sequence {...seq(T.side)}><Side /></Sequence>
    <Sequence {...seq(T.outro)}><Outro /></Sequence>
    <TopBar />
    <Rail />
  </AbsoluteFill>
);
