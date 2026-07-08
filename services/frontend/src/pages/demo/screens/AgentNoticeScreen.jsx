import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData } from './agentNoticeData';

const s = sharedStyles;

export default function AgentNoticeScreen() {
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
            <h2 className={s.mainTit}>{L(tx.screenName)}</h2>
          </div>
        </section>

        <section className={s.noticeIntro}>
          <div className={s.introCard}>
            <div className={s.noticeGreeting}>
              <span>{L(tx.greetingBefore)}{L(sampleData.customerName)}</span>
              <span className={s.suffix}>{L(tx.greetingAfter)}</span>
            </div>
            <div className={s.noticeBody}>
              <p className={s.noticeBodyLead}>{L(tx.bodyLead)}</p>
              <p className={s.noticeBodyText}>{L(tx.bodyText1)}</p>
              <p className={s.noticeBodyText}>{L(tx.bodyText2)}</p>
            </div>
          </div>
        </section>

        <section className={s.inner}>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
            <tbody>
              <tr><th>{L(tx.delegatingCustomer)}</th><td>{L(sampleData.customerName)}</td></tr>
              <tr><th>{L(tx.agentName)}</th><td>{L(sampleData.agentName)}</td></tr>
              <tr><th>{L(tx.registeredDate)}</th><td>{sampleData.registeredDate}</td></tr>
            </tbody>
          </table>
          <div className={s.sendDate}>{sampleData.sendDate}</div>
          <div className={s.info}>
            <ul>
              <li>{L(tx.infoNote)}</li>
            </ul>
          </div>
        </section>

        <section className={s.yearSign}>
          <div className={s.yearSignWrap}>
            <h3 className={s.signTit}>{L(tx.signName)}</h3>
          </div>
        </section>

        <section className={s.btnArea}>
          <button type="button" className={s.pdfBtn} onClick={() => showToast(d.toastPdf)}>
            {d.pdfDownload}
          </button>
          <p className={s.infoRed}>{d.pdfPasswordNote}</p>
          <button type="button" className={s.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {d.appLinkName}
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
