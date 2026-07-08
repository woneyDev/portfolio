import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './customerInfoDisclosureNoticeData';

const s = sharedStyles;
const CIRCLE_NUM = ['①', '②', '③', '④'];

export default function CustomerInfoDisclosureNoticeScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();

  const periodLabel = L(tx.periodLabel).replace('{from}', sd.periodFrom).replace('{to}', sd.periodTo);

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
              <span>{L(tx.greeting)}</span>
              <span className={s.suffix}>{L(tx.greetingSuffix)}</span>
            </div>
            <div className={s.noticeBody}>
              <p className={s.noticeBodyLead}>{L(tx.bodyText1)}</p>
              <p className={s.noticeBodyText}>{L(tx.bodyText2)}</p>
              <p className={s.noticeBodyText}>{L(tx.bodyText3)}</p>
            </div>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s1Tit)}</h3>
          <h3 className={s.contTit} style={{ marginBottom: 0 }}>{L(tx.s1Sub)}</h3>
          <p className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.s1SubSub)}</p>
          <div className={s.info}>
            <ul>
              {tx.s1Items.map((item, i) => (
                <li key={i} style={{ marginBottom: i < tx.s1Items.length - 1 ? 10 : 0 }}>
                  {CIRCLE_NUM[i === 0 ? 0 : 3]} {L(item)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px', marginTop: 25 }}>
          <h3 className={s.sectionTit} style={{ marginBottom: 10 }}>{L(tx.s2Tit)}</h3>
          <p style={{ fontSize: 13, marginBottom: 15 }}>{periodLabel}</p>
          <table className={s.dataTable}>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.provider)}</th>
                <th className={s.rowDivider}>{L(tx.col.recipient)}</th>
                <th className={s.rowDivider}>{L(tx.col.purpose)}</th>
                <th className={s.rowDivider}>{L(tx.col.items)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.disclosures.length === 0 ? (
                <tr><td colSpan={4} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.disclosures.map((row, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal} style={{ fontWeight: 300 }}>{L(row.provider)}</td>
                  <td className={s.tal} style={{ fontWeight: 300, padding: '10px 6px' }}>{L(row.recipient)}</td>
                  <td className={s.tal} style={{ fontWeight: 300 }}>{L(row.purpose)}</td>
                  <td className={s.tal} style={{ fontWeight: 300 }}>{L(row.items)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}>
            <ul><li>{L(tx.s2Note)}</li></ul>
          </div>
        </section>

        <section className={s.table2r1c} style={{ padding: '0 24px', marginTop: 25 }}>
          <h3 className={s.contTit}>{L(tx.s3Tit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '35%' }} /><col style={{ width: '65%' }} /></colgroup>
            <tbody>
              {tx.purposeRows.map((row, i) => (
                <tr key={i} className={s.bdr}>
                  <th className={s.bdr} style={{ verticalAlign: 'top' }}>{L(row.title)}</th>
                  <td className={s.tal} style={{ padding: '10px 6px' }}>
                    {row.paragraphs.map((p, j) => (
                      <p key={j} style={{ fontWeight: 300, marginBottom: j < row.paragraphs.length - 1 ? 8 : 0 }}>{L(p)}</p>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              {tx.s3Notes.map((n, i) => <li key={i}>{L(n)}</li>)}
            </ul>
          </div>
        </section>

        <section className={s.inner} style={{ marginTop: 25 }}>
          <div className={s.txtBox}><p>{L(tx.promiseText)}</p></div>
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
