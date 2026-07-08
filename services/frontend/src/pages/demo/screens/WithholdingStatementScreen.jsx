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
import { text as tx, sampleData as sd } from './withholdingStatementData';

const s = sharedStyles;

export default function WithholdingStatementScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [detail, setDetail] = useState(null);

  const openDetail = (item) => setDetail({
    title: `${item.accountNo.slice(0, 3)}-${item.accountNo.slice(3, 5)}-${item.accountNo.slice(5, 6)}*****`,
    rows: [
      [L(tx.detail.accountNo), `${item.accountNo.slice(0, 3)}-${item.accountNo.slice(3, 5)}-${item.accountNo.slice(5, 6)}*****`],
      [L(tx.detail.branchName), L(item.branchName)],
      [L(tx.detail.businessNo), item.businessNo],
      [L(tx.detail.incomeType), L(item.incomeType)],
      [L(tx.detail.incomeAmount), won(item.incomeAmount)],
      [L(tx.detail.taxDivision), L(item.taxDivision)],
      [L(tx.detail.incomeTax), won(item.incomeTax)],
      [L(tx.detail.localTax), won(item.localTax)],
      [L(tx.detail.total), won(item.total)],
    ],
  });

  const maskedResidentNo = `${sd.residentNo}-${sd.residentNo.slice(0, 1)}******`;

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={s.main}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>{L(tx.screenName)}</h2>
            <p className={s.subTitBadge} style={{ background: 'none', padding: 0, color: 'rgba(255,255,255,0.85)' }}>
              {L(tx.fiscalYear)}{sd.fiscalYear}{L(tx.fiscalYearSuffix)}
            </p>
          </div>
        </section>

        <section className={s.intro} style={{ marginTop: -45 }}>
          <div className={s.introCard} style={{ boxShadow: 'none', borderRadius: 0 }}>
            <table className={s.introTable}>
              <colgroup><col style={{ width: '40%' }} /><col style={{ width: '60%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.name)}</th><td>{L(sd.name)}</td></tr>
                <tr><th>{L(tx.residentNo)}</th><td>{maskedResidentNo}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px' }}>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.incomes.length}{L(tx.totalSuffix)}</p>
            <span className={s.unit}>{L(tx.unitWon)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '15%' }} /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col.accountNo)}</th>
                <th className={s.rowDivider}>{L(tx.col.incomeType)}</th>
                <th colSpan={3} className={s.rowDivider}>{L(tx.col.incomeAmount)}</th>
                <th rowSpan={2} className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col.details)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.taxDivision)}</th>
                <th className={s.rowDivider}>{L(tx.col.incomeTax)}</th>
                <th className={s.rowDivider}>{L(tx.col.localTax)}</th>
                <th className={s.rowDivider}>{L(tx.col.total)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.incomes.length === 0 ? (
                <tr><td colSpan={5} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.incomes.map((item, i) => (
                <>
                  <tr key={`${i}-a`} className={s.rowDivider}>
                    <td rowSpan={2} className={s.tal} style={{ paddingRight: 6 }}>{item.accountNo.slice(0, 3)}-{item.accountNo.slice(3, 5)}-{item.accountNo.slice(5, 6)}*****</td>
                    <td className={s.tac}>{L(item.incomeType)}</td>
                    <td colSpan={3} className={s.tar} style={{ padding: '10px 6px' }}>{num(item.incomeAmount)}</td>
                    <td rowSpan={2} className={s.detailBtnCell}>
                      <button type="button" className={s.detailBtn} aria-label={L(tx.col.details)} onClick={() => openDetail(item)} />
                    </td>
                  </tr>
                  <tr key={`${i}-b`} className={s.rowDivider}>
                    <td className={s.tac}>{L(item.taxDivision)}</td>
                    <td className={s.tar} style={{ padding: '10px 6px' }}>{num(item.incomeTax)}</td>
                    <td className={s.tar} style={{ padding: '10px 6px' }}>{num(item.localTax)}</td>
                    <td className={s.tar} style={{ padding: '10px 6px' }}>{num(item.total)}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 0 }}>{L(tx.sumTit)}</h3>
          <span className={s.unit}>{L(tx.unitWon)}</span>
          <table className={s.dataTable}>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.sumCol.division)}</th>
                <th className={s.rowDivider}>{L(tx.sumCol.incomeAmount)}</th>
                <th className={s.rowDivider}>{L(tx.sumCol.incomeTax)}</th>
                <th className={s.rowDivider}>{L(tx.sumCol.localTax)}</th>
                <th className={s.rowDivider}>{L(tx.sumCol.taxSum)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.summary.map((row, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal} style={{ fontSize: 10 }}>{L(tx.sumRows[i])}</td>
                  <td className={s.tar} style={{ padding: '10px 6px' }}>{num(row.incomeAmount)}</td>
                  <td className={s.tar} style={{ padding: '10px 6px' }}>{num(row.incomeTax)}</td>
                  <td className={s.tar} style={{ padding: '10px 6px' }}>{num(row.localTax)}</td>
                  <td className={s.tar}>{num(row.taxSum)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              {tx.sumNotes.map((n, i) => (
                <li key={i}>
                  {L(n)}
                  {n.sub && (
                    <ul className={s.guideSubList}>
                      {n.sub.map((sub, j) => <li key={j}>{L(sub)}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.yearSign}>
          <p className={s.yearSignDateOnly}>{L(sd.signDate)}</p>
          <div className={s.yearSignWrap}>
            <h3 className={s.signTit}>{L(tx.companyName)}</h3>
          </div>
        </section>

        <section className={s.guide}>
          <div>
            <h3 className={s.guideTit}>{L(tx.guideTit)}</h3>
            <ul className={s.guideCont}>
              {tx.guideItems.map((item, i) => (
                <li key={i}>{L(item)}</li>
              ))}
            </ul>
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

      <DetailModal detail={detail} onClose={() => setDetail(null)} scale={scale} closeLabel={L(tx.close)} />
      <Toast message={toast} scale={scale} />
    </>
  );
}
