import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Bar, Card, Check, Chip, JobHeader, Scene, rise, useSpring} from '../anim';
import {C} from '../theme';

const STATUS = [
  {t: 'Audited', c: C.accentText, bg: C.accentSoft},
  {t: 'Invoiced', c: C.amber, bg: 'rgba(255,181,71,0.14)'},
  {t: 'Paid', c: C.success, bg: C.successSoft},
  {t: 'Audited', c: C.accentText, bg: C.accentSoft},
  {t: 'Paid', c: C.success, bg: C.successSoft},
];

const Row: React.FC<{i: number}> = ({i}) => {
  const p = useSpring(22 + i * 7);
  const s = STATUS[i];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '18px 0', borderTop: `1px solid ${C.border}`, ...rise(p, 20)}}>
      <div style={{width: 40, height: 40, borderRadius: 10, background: '#1c2538'}} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
        <Bar w={[240, 200, 260, 180, 220][i]} h={12} color="#2a364f" />
        <Bar w={[150, 170, 130, 160, 120][i]} h={10} />
      </div>
      <div style={{width: 130, textAlign: 'center', padding: '8px 0', borderRadius: 999, fontSize: 20, fontWeight: 700, color: s.c, background: s.bg}}>{s.t}</div>
    </div>
  );
};

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(48, 18);
  const prog = interpolate(frame, [70, 104], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const done = useSpring(106, 12);
  return (
    <div
      style={{
        position: 'absolute',
        right: -40,
        bottom: -60,
        width: 270,
        height: 560,
        borderRadius: 48,
        background: '#05070c',
        border: `3px solid ${C.borderHi}`,
        padding: 14,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        opacity: p,
        transform: `translateY(${(1 - p) * 140}px) rotate(${(1 - p) * 6}deg)`,
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 36, background: C.card, padding: '42px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18}}>
        <div style={{width: 90, height: 8, borderRadius: 8, background: '#000', alignSelf: 'center', marginTop: -26, marginBottom: 6}} />
        <div style={{fontSize: 22, fontWeight: 800, color: C.text}}>Delivery documents</div>
        <div style={{height: 170, borderRadius: 16, background: '#1c2538', padding: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
          <Bar w="70%" h={10} color="#2f3c57" />
          <Bar w="90%" h={8} color="#2a364f" />
          <Bar w="80%" h={8} color="#2a364f" />
          <Bar w="60%" h={8} color="#2a364f" />
          <Bar w="85%" h={8} color="#2a364f" />
        </div>
        <div style={{height: 12, borderRadius: 12, background: '#1c2538', overflow: 'hidden'}}>
          <div style={{width: `${prog}%`, height: '100%', background: C.accent, borderRadius: 12}} />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: done, transform: `scale(${0.8 + done * 0.2})`, transformOrigin: 'left'}}>
          <Check p={done} size={32} />
          <div style={{fontSize: 22, fontWeight: 700, color: C.success}}>Submitted</div>
        </div>
        <div style={{marginTop: 'auto', height: 52, borderRadius: 14, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.bg, fontWeight: 800, fontSize: 20}}>
          Upload
        </div>
      </div>
    </div>
  );
};

export const Otr: React.FC = () => {
  const dash = useSpring(10);
  const t1 = useSpring(40);
  const t2 = useSpring(48);
  const t3 = useSpring(56);
  return (
    <Scene style={{flexDirection: 'row', gap: 70, alignItems: 'center'}}>
      <div style={{width: 740, display: 'flex', flexDirection: 'column', gap: 36}}>
        <JobHeader
          logo="OTR.png"
          company="OTR Solutions"
          meta="2025 — 2026 · Remote"
          title="Product Manager"
          subtitle="Owned Epay Manager — real-time billing, invoicing & document audit for brokers, carriers & factoring firms."
        />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          <span style={rise(t1, 16)}><Chip accent>📱 Mobile app: discovery → go-live</Chip></span>
          <span style={rise(t2, 16)}><Chip accent>✦ AI-assisted product workflows</Chip></span>
          <span style={rise(t3, 16)}><Chip accent>🎤 Live demos at TIA &amp; FreightWaves</Chip></span>
        </div>
      </div>
      <div style={{flex: 1, position: 'relative'}}>
        <Card style={{padding: '30px 36px', marginRight: 220, ...rise(dash, 50)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18}}>
            <div style={{width: 16, height: 16, borderRadius: 5, background: C.accent}} />
            <div style={{fontSize: 28, fontWeight: 800, color: C.text}}>Epay Manager</div>
            <div style={{marginLeft: 'auto', display: 'flex', gap: 10}}>
              <Bar w={70} h={28} color="#1c2538" />
              <Bar w={70} h={28} color="#1c2538" />
            </div>
          </div>
          {STATUS.map((_, i) => (
            <Row key={i} i={i} />
          ))}
        </Card>
        <Phone />
      </div>
    </Scene>
  );
};
