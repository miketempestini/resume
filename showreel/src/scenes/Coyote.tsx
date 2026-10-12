import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Card, Counter, JobHeader, Metric, Scene, Sweep, rise, useSpring} from '../anim';
import {C} from '../theme';

const Role: React.FC<{
  title: string;
  dates: string;
  delay: number;
  active: boolean;
  done: boolean;
  last?: boolean;
  children?: React.ReactNode;
}> = ({title, dates, delay, active, done, last, children}) => {
  const p = useSpring(delay);
  return (
    <div style={{display: 'flex', gap: 28, ...rise(p, 40)}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 26}}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            marginTop: 30,
            background: active ? C.accent : C.card,
            border: `3px solid ${active || done ? C.accent : C.borderHi}`,
            boxShadow: active ? `0 0 0 8px ${C.accentSoft}` : 'none',
          }}
        />
        {!last && <div style={{flex: 1, width: 3, background: C.border, marginTop: 8}} />}
      </div>
      <Card
        style={{
          flex: 1,
          padding: '24px 30px',
          marginBottom: last ? 0 : 20,
          borderColor: active ? 'rgba(129,140,248,0.55)' : C.border,
          opacity: active ? 1 : 0.62,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20}}>
          <div style={{fontSize: 34, fontWeight: 700, color: C.text}}>{title}</div>
          <div style={{fontSize: 22, color: C.faint, fontWeight: 600, whiteSpace: 'nowrap'}}>{dates}</div>
        </div>
        {children}
      </Card>
    </div>
  );
};

export const Coyote: React.FC = () => {
  const frame = useCurrentFrame();
  const active = frame < 48 ? 0 : frame < 82 ? 1 : 2;

  return (
    <Scene style={{flexDirection: 'row', gap: 80, alignItems: 'center'}}>
      <div style={{width: 600}}>
        <JobHeader
          logo="Coyote.png"
          company="Coyote Logistics"
          meta="2019 — 2023 · Chicago, IL"
          title="From carrier sales to product"
          subtitle="Three roles, four years — learning freight from the inside before building software for it."
        />
      </div>
      <div style={{flex: 1}}>
        <Role title="Carrier Sales Representative" dates="2019 — 2020" delay={16} active={active === 0} done={active > 0}>
          <div style={{fontSize: 26, color: C.muted, marginTop: 8}}>Sold spot &amp; dedicated freight to owner-operators and fleets</div>
        </Role>
        <Role title="Carrier Engagement Rep" dates="2020 — 2021" delay={46} active={active === 1} done={active > 1}>
          <div style={{fontSize: 26, color: C.muted, marginTop: 8}}>
            Onboarded{' '}
            <strong style={{color: C.text}}>
              <Sweep start={66}>
                <Counter to={200} start={52} dur={30} />+ new carriers per week
              </Sweep>
            </strong>{' '}
            to CoyoteGO
          </div>
        </Role>
        <Role title="Associate Product Manager" dates="2021 — 2023" delay={80} active={active === 2} done={false} last>
          <div style={{display: 'flex', gap: 16, marginTop: 18}}>
            <Metric delay={96} size={52} value={<>+<Counter to={50} start={98} />%</>} label="load-opening speed" />
            <Metric delay={104} size={52} value={<>−<Counter to={20} start={106} />%</>} label="time-to-task" />
            <Metric delay={112} size={52} value="+5–7%" label="offers & engagement" />
          </div>
        </Role>
      </div>
    </Scene>
  );
};
