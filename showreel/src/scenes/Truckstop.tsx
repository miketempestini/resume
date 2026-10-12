import React from 'react';
import {Bar, Card, Check, Chip, Counter, JobHeader, Metric, Scene, rise, useSpring} from '../anim';
import {C} from '../theme';

const Shield = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.accentText} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BrowserMock: React.FC = () => {
  const win = useSpring(10);
  const popup = useSpring(30, 18);
  const c1 = useSpring(48, 14);
  const c2 = useSpring(58, 14);
  const c3 = useSpring(68, 14);
  const prem = useSpring(92, 16);
  return (
    <Card style={{width: '100%', height: 600, overflow: 'hidden', position: 'relative', ...rise(win, 50)}}>
      <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: `1px solid ${C.border}`, background: C.card2}}>
        {['#f87171', '#fbbf24', '#34d399'].map((c) => (
          <div key={c} style={{width: 14, height: 14, borderRadius: '50%', background: c, opacity: 0.8}} />
        ))}
        <div style={{marginLeft: 20, flex: 1, height: 34, borderRadius: 10, background: '#0f1522', display: 'flex', alignItems: 'center', padding: '0 16px'}}>
          <Bar w={260} h={10} />
        </div>
        <div style={{width: 34, height: 34, borderRadius: 8, background: C.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Shield />
        </div>
      </div>
      <div style={{padding: 36, display: 'flex', flexDirection: 'column', gap: 18}}>
        <Bar w="42%" h={18} color="#2a364f" />
        <Bar w="88%" />
        <Bar w="76%" />
        <Bar w="82%" />
        <Bar w="64%" />
        <Bar w="70%" style={{marginTop: 18}} />
        <Bar w="58%" />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 84,
          right: 28,
          width: 420,
          background: '#0f1522',
          border: `1px solid rgba(129,140,248,0.5)`,
          borderRadius: 20,
          padding: 28,
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          opacity: popup,
          transform: `translateY(${(1 - popup) * -30}px) scale(${0.94 + popup * 0.06})`,
          transformOrigin: 'top right',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Shield />
          <div style={{fontSize: 32, fontWeight: 800, color: C.text}}>Risk Factors</div>
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 16}}>
          <Chip accent>Chrome</Chip>
          <Chip accent>Outlook</Chip>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26}}>
          {[c1, c2, c3].map((p, i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <Check p={p} />
              <Bar w={[220, 260, 190][i]} />
            </div>
          ))}
        </div>
        <div style={{marginTop: 26, opacity: prem, transform: `scale(${0.9 + prem * 0.1})`, transformOrigin: 'left'}}>
          <Chip style={{background: 'rgba(255,181,71,0.14)', color: C.amber, border: 'none'}}>★ Premium tier · Nov 2024</Chip>
        </div>
      </div>
    </Card>
  );
};

export const Truckstop: React.FC = () => (
  <Scene style={{flexDirection: 'row', gap: 70, alignItems: 'center'}}>
    <div style={{width: 760, display: 'flex', flexDirection: 'column', gap: 40}}>
      <JobHeader
        logo="Truckstop.jpg"
        company="Internet Truckstop Group"
        meta="2023 — 2025 · Remote"
        title="Associate Product Manager"
        subtitle="Risk Factors for Chrome & Outlook — launched June 2024, up-market premium tier by November 2024."
      />
      <div style={{display: 'flex', gap: 18}}>
        <Metric delay={40} value={<>$<Counter to={41.7} dec={1} start={44} />k</>} label="MRR in 6 months, from $0" />
        <Metric delay={50} value={<><Counter to={800} start={54} />k</>} label="requests per day" />
      </div>
    </div>
    <div style={{flex: 1}}>
      <BrowserMock />
    </div>
  </Scene>
);
