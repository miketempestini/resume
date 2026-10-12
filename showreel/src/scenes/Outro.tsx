import React from 'react';
import {Img, staticFile} from 'remotion';
import {Scene, rise, useSpring} from '../anim';
import {C} from '../theme';

export const Outro: React.FC = () => {
  const photo = useSpring(0, 16);
  const name = useSpring(8);
  const role = useSpring(14);
  const pill = useSpring(20, 14);
  const url = useSpring(26);
  return (
    <Scene style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 130}}>
      <div
        style={{
          width: 210,
          height: 210,
          borderRadius: 52,
          overflow: 'hidden',
          border: `2px solid ${C.borderHi}`,
          boxShadow: `0 0 0 12px ${C.accentSoft}`,
          opacity: photo,
          transform: `scale(${0.8 + photo * 0.2})`,
        }}
      >
        <Img src={staticFile('headshot.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{fontSize: 116, fontWeight: 800, letterSpacing: '-0.045em', color: C.text, marginTop: 44, lineHeight: 1, ...rise(name, 40)}}>
        Mike Tempestini
      </div>
      <div style={{fontSize: 38, color: C.muted, fontWeight: 500, marginTop: 22, ...rise(role)}}>Product Manager · Chicago, IL</div>
      <div
        style={{
          marginTop: 34,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 26px 12px 22px',
          borderRadius: 999,
          background: C.successSoft,
          color: C.success,
          fontSize: 28,
          fontWeight: 700,
          opacity: pill,
          transform: `scale(${0.85 + pill * 0.15})`,
        }}
      >
        <span style={{width: 14, height: 14, borderRadius: '50%', background: C.success}} />
        Open to new product roles
      </div>
      <div style={{fontSize: 30, color: C.accentText, fontWeight: 600, marginTop: 30, ...rise(url)}}>miketempestini.github.io/resume</div>
    </Scene>
  );
};
