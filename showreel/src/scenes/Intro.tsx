import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Counter, Eyebrow, Scene, Sweep, rise, useSpring} from '../anim';
import {C} from '../theme';

const NAME = 'Mike Tempestini';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const eyebrow = useSpring(0);
  const sub = useSpring(22);
  const years = useSpring(32);

  return (
    <Scene style={{justifyContent: 'center', paddingBottom: 130}}>
      <Eyebrow style={{marginBottom: 28, ...rise(eyebrow)}}>Product Manager · Showreel</Eyebrow>
      <div
        style={{
          fontSize: 168,
          fontWeight: 800,
          letterSpacing: '-0.045em',
          lineHeight: 1,
          color: C.text,
          display: 'flex',
        }}
      >
        {NAME.split('').map((ch, i) => {
          const p = spring({frame: frame - 4 - i * 1.4, fps, config: {damping: 16, mass: 0.6}});
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: Math.min(1, p),
                transform: `translateY(${(1 - p) * 70}px)`,
                filter: `blur(${Math.max(0, (1 - p) * 10)}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div style={{fontSize: 44, color: C.muted, fontWeight: 500, marginTop: 34, ...rise(sub)}}>
        Product Manager · B2B SaaS · Freight &amp; logistics tech
      </div>
      <div style={{fontSize: 44, color: C.text, fontWeight: 700, marginTop: 18, ...rise(years)}}>
        <Sweep start={44}>
          <Counter to={7} start={34} dur={24} />+ years turning messy operations into simple software
        </Sweep>
      </div>
    </Scene>
  );
};
