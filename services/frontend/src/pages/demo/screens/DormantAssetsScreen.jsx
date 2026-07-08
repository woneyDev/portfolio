import { Fragment } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData } from './dormantAssetsData';

const s = sharedStyles;

function MultiLine({ text }) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export default function DormantAssetsScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => field[lang];

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();

  const infoNote1 = L(tx.infoNote1).replace('{baseDate}', L(sampleData.baseDate));

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={s.main}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>
              {L(tx.titleBold)}
              <span className={s.mainTitLight}>{L(tx.titleLight)}</span>
            </h2>
            <p className={s.subTitBadge}>{L(tx.badge)}</p>
          </div>
        </section>

        <section className={s.noticeIntro}>
          <div className={s.introCard}>
            <div className={s.noticeGreeting}>
              <span>{L(tx.greeting)}</span>
              <span className={s.suffix}>{L(tx.greetingSuffix)}</span>
            </div>
            <div className={s.noticeBody}>
              <p className={s.noticeBodyText}>{L(tx.bodyText1)}</p>
              <p className={s.noticeBodyText}>{L(tx.bodyText2)}</p>
            </div>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.guideBoxTit}>{L(tx.guideBoxTit)}</h3>
          <div className={s.guideBox}>
            <ul className={s.guideBoxList}>
              <li><a href="#guide" onClick={(e) => { e.preventDefault(); showToast(d.toastGeneric); }}>{L(tx.guideItem1)}</a></li>
              <li>
                <a href="#guide" onClick={(e) => { e.preventDefault(); showToast(d.toastGeneric); }}>{L(tx.guideItem2Line1)}</a>
                <br />
                {L(tx.guideItem2Line2)}
              </li>
              <li>
                {L(tx.guideItem3Line1)}
                <br />
                <span className={s.dotArrow}>{L(tx.kofia)}</span>
                <span className={s.dotArrow}>{L(tx.payinfo)}</span>
              </li>
              <li>
                {L(tx.guideItem4)}
                <p>{L(tx.guideItem4Sub)}</p>
              </li>
            </ul>
            <button type="button" className={s.linkBtn1} onClick={() => showToast(d.toastGeneric)}>{L(tx.linkBtn1)}</button>
            <button type="button" className={s.linkBtn2} onClick={() => showToast(d.toastGeneric)}>{L(tx.linkBtn2)}</button>
          </div>
        </section>

        <section className={s.inner}>
          <div className={s.info}>
            <h3 className={s.infoTit}>{L(tx.infoTit)}</h3>
            <ul>
              <li><MultiLine text={infoNote1} /></li>
              <li><MultiLine text={L(tx.infoNote2)} /></li>
            </ul>
          </div>
        </section>

        <section className={s.btnArea}>
          <button type="button" className={s.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {d.chatbotName}
          </button>
          <div className={s.customer}>
            <button type="button" className={s.customerBtn} onClick={() => showToast(d.toastGeneric)}>
              {d.customerCenter}
            </button>
          </div>
        </section>

        <DemoFooter
          line1={d.aiPromoLine1}
          line2={d.aiPromoLine2}
          iconAlt={d.aiPromoIconAlt}
          footerAlt={d.footerName}
          onLogoClick={() => showToast(d.toastGeneric)}
        />
      </DemoScreenShell>

      <Toast message={toast} scale={scale} />
    </>
  );
}
