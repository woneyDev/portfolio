import { useState } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import DetailModal from '../shared/DetailModal';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './legalEducationIRPData';

const s = sharedStyles;

export default function LegalEducationIRPScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [detail, setDetail] = useState(null);

  const openDetail = (item) => setDetail({
    title: `${item.year}${L(tx.yearSuffix)}`,
    rows: [
      [L(tx.detail.period), `${item.from} ~ ${item.to}`],
      [L(tx.detail.amount), won(item.amount)],
      [L(tx.detail.severancePay), won(item.severancePay)],
      [L(tx.detail.subscriberContribution), won(item.subscriberAmount)],
      [L(tx.detail.transferredAmount), won(item.transferredAmount)],
    ],
  });

  const maskedAccountNo = `${sd.accountNo.slice(0, 3)}-${sd.accountNo.slice(3, 5)}-***${sd.accountNo.slice(8, 11)}`;

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

        <section className={s.intro}>
          <div className={s.introCard}>
            <div className={s.noticeGreeting} style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: 15 }}>
              <span className={s.name}>{L(sd.subscriberName)}</span>
              <span className={s.suffix}>{L(tx.greetingAfter)}</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, margin: '15px 0' }}>{L(tx.legalNotice)}</p>
            <table className={s.table2r1cTable}>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.subscriberName)}</th><td className={s.tar}>{L(sd.subscriberName)}</td></tr>
                <tr><th>{L(tx.accountNo)}</th><td className={s.tar}>{maskedAccountNo}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.content}>
          <h3 className={s.sectionTit} style={{ color: '#10226A', marginBottom: 17 }}>{L(tx.planStatusTit)}</h3>
          <div className={s.info} style={{ background: 'transparent', padding: 0, marginBottom: 15 }}>
            <ul>
              <li style={{ fontWeight: 500, fontSize: 12 }}>
                {L(tx.planLine1)}
                <ul className={s.guideSubList}>
                  <li style={{ fontWeight: 300 }}>{L(tx.contractDateLabel)}{L(sd.contractDate)}</li>
                </ul>
              </li>
              <li style={{ fontWeight: 500, fontSize: 12 }}>{L(tx.planLine2)}</li>
            </ul>
          </div>

          <span className={s.unit}>{L(tx.unitWon)}</span>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '35%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.year)}</th>
                <th className={s.rowDivider}>{L(tx.col.period)}</th>
                <th className={s.rowDivider}>{L(tx.col.amount)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.contributions.map((item) => (
                <tr key={item.year} className={s.rowDivider}>
                  <td className={s.tac}>{item.year}{L(tx.yearSuffix)}</td>
                  <td className={s.tac}>{item.from} ~ {item.to}</td>
                  <td className={s.tac}>{item.amount.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col.details)} onClick={() => openDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={s.info} style={{ marginTop: 15 }}>
            <ul>
              {tx.glossaryItems.map((g, i) => (
                <li key={i} style={{ fontSize: 12 }}><span style={{ fontWeight: 700 }}>{L(g.term)} :</span> {L(g.desc)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.inner} style={{ marginBottom: 25 }}>
          <h3 style={{ fontSize: 16, fontWeight: 300, marginBottom: 4 }}>{L(tx.closingLine1)}</h3>
          <h3 style={{ fontSize: 16, fontWeight: 300 }}>{L(tx.closingLine2)}</h3>
        </section>

        <section className={s.btnArea}>
          <button type="button" className={s.pdfBtn} onClick={() => showToast(d.toastGeneric)}>
            {L(tx.downloadBtn)}
          </button>
          <button type="button" className={s.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {d.appLinkName}
          </button>
          <div className={s.sectionBar} />
          <button type="button" className={s.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {d.chatbotName}
          </button>
          <div className={s.customer}>
            <button type="button" className={s.customerBtn} onClick={() => showToast(d.toastGeneric)}>
              {L(tx.customerCenter)}
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

      <DetailModal detail={detail} onClose={() => setDetail(null)} scale={scale} closeLabel={L(tx.close)} />
      <Toast message={toast} scale={scale} />
    </>
  );
}
