import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx } from './termsChangeNoticeData';

const s = sharedStyles;

export default function TermsChangeNoticeScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => field[lang];

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={s.main}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>
              {L(tx.titleLine1)}<br />{L(tx.titleLine2)}
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
              <p className={s.noticeBodyText}>{L(tx.bodyText3)}</p>
              <p className={s.noticeBodyText}>{L(tx.bodyText4)}</p>
            </div>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.guideBoxTit} style={{ textAlign: 'center' }}>{L(tx.guideTit)}</h3>
          <div className={s.info}>
            <ul>
              <li>
                {L(tx.scopeTit)}
                <ul className={s.guideSubList}>
                  <li>{L(tx.scopeItem)}</li>
                </ul>
              </li>
              <li>
                {L(tx.effectiveTit)}
                <ul className={s.guideSubList}>
                  <li>{L(tx.effectiveItem)}</li>
                </ul>
              </li>
              <li>
                {L(tx.revisionTit)}
                <ul className={s.guideSubList}>
                  <li>{L(tx.revisionItem1)}</li>
                  <li>
                    {L(tx.revisionItem2Prefix)}
                    <strong style={{ color: '#2878f5' }}>{L(tx.revisionItem2Highlight)}</strong>
                    {L(tx.revisionItem2Suffix)}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        <section className={s.btnArea}>
          <p className={s.noticeBodyText} style={{ textAlign: 'center', padding: '0 24px 15px' }}>{L(tx.checkPrompt)}</p>
          <button type="button" className={s.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {L(tx.termsBtn)}
          </button>
          <button type="button" className={s.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {L(tx.compareBtn)}
          </button>
          <div className={s.sectionBar} />
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
