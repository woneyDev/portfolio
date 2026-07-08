import { Fragment, useState } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './fundReturnReportData';

const s = sharedStyles;

function MultiLine({ text }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export default function FundReturnReportScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [detail, setDetail] = useState(null);
  const [overseasDetail, setOverseasDetail] = useState(null);

  const openFundDetail = (item) => {
    setDetail({
      title: `${L(tx.maxTitText).replace('{v}', num(item.valuation)).replace('{r}', item.cumulativeReturnAfter)}`,
      rows: [
        [L(tx.detail.seqNo), item.seqNo],
        [L(tx.detail.fundName), L(item.name)],
        [L(tx.detail.currency), L(item.currency)],
        [L(tx.detail.units), `${num(item.units)}${L(tx.detail.unitSuffix)}`],
        [L(tx.detail.firstInvestDate), L(item.firstInvestDate)],
        [L(tx.detail.principal), won(item.principal)],
        [`${L(tx.detail.interimRedemption)} (${L(tx.detail.beforeCost)})`, won(item.interimBeforeCost)],
        [`${L(tx.detail.interimRedemption)} (${L(tx.detail.afterCost)})`, won(item.interimAfterCost)],
        [L(tx.detail.fees), won(item.fees)],
        [L(tx.detail.feeRates), `(${item.salesFeeRate}%, ${item.totalFeeRate}%)`],
        [L(tx.detail.valuation), won(item.valuation)],
        [L(tx.detail.deductionExpected), won(item.deductionExpected)],
        [L(tx.detail.redemptionExpected), won(item.redemptionExpected)],
        [`${L(tx.detail.cumulativeReturn)} (${L(tx.detail.beforeCost)})`, `${item.cumulativeReturnBefore} %`],
        [`${L(tx.detail.cumulativeReturn)} (${L(tx.detail.afterCost)})`, `${item.cumulativeReturnAfter} %`],
        [`${L(tx.detail.annualizedReturn)} (${L(tx.detail.beforeCost)})`, `${item.annualizedReturnBefore} %`],
        [`${L(tx.detail.annualizedReturn)} (${L(tx.detail.afterCost)})`, `${item.annualizedReturnAfter} %`],
        [L(tx.detail.applicableLaw), L(item.applicableLaw)],
        [L(tx.detail.smallFund), L(item.smallFund)],
      ],
    });
  };

  const openOverseasDetail = (item) => {
    setOverseasDetail({
      title: L(item.name),
      rows: [
        [L(tx.detail.seqNo), item.seqNo],
        [L(tx.detail.fundName), L(item.name)],
        [L(tx.detail.buyPrincipal), won(item.buyPrincipal)],
        [L(tx.detail.nav), item.nav],
        [L(tx.detail.units), `${num(item.units)}${L(tx.detail.unitSuffix)}`],
        [L(tx.detail.preTaxValuation), won(item.preTaxValuation)],
        [L(tx.detail.preTaxReturn), `${item.preTaxReturn} %`],
        [L(tx.detail.currency), L(item.currency)],
      ],
    });
  };

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
            <div className={s.introGreeting}>
              <span className={s.name}>{L(sd.customerName)}</span>
              <span className={s.suffix}>{L(tx.greetingAfter)}</span>
            </div>
            <table className={s.introTable}>
              <colgroup><col style={{ width: '30%' }} /><col style={{ width: '70%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.accountNumber)}</th><td>{L(sd.accountNo)}</td></tr>
                <tr><th>{L(tx.accountName)}</th><td>{L(sd.customerName)}</td></tr>
                <tr><th>{L(tx.balanceDate)}</th><td>{L(sd.balanceDate)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px' }}>
          <div className={s.tableMoreHeadWrap}>
            <h3 className={s.contTit}>{L(tx.fundReturnTit)}</h3>
            <span className={s.totalNum}>{L(tx.totalPrefix)}{sd.funds.length}{L(tx.totalSuffix)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.seqNo)}</th>
                <th className={s.rowDivider}>{L(tx.col.fundName)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.funds.length === 0 ? (
                <tr><td colSpan={3} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.funds.map((item) => (
                <tr key={item.seqNo} className={s.rowDivider}>
                  <td className={s.tac}>{item.seqNo}</td>
                  <td className={s.tal} style={{ padding: '10px 6px' }}>{L(item.name)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col.details)} onClick={() => openFundDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sd.funds.length > 0 && (
            <div className={s.sumValue} style={{ marginTop: 15 }}>
              <h3 className={s.sumValueTit}>{L(tx.totalValuation)}</h3>
              <p className={s.sumValueNum}>{won(sd.fundSum)}</p>
            </div>
          )}
          <div className={s.info}>
            <ul>
              {tx.fundNotes.map((note, i) => (
                <li key={i}>
                  {L(note)}
                  {note.sub && (
                    <ul className={s.guideSubList}>
                      {note.sub.map((subItem, j) => <li key={j}>{L(subItem)}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px' }}>
          <div className={s.tableMoreHeadWrap}>
            <h3 className={s.contTit}>{L(tx.overseasFundTit)}</h3>
            <span className={s.totalNum}>{L(tx.totalPrefix)}{sd.overseasFunds.length}{L(tx.totalSuffix)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.seqNo)}</th>
                <th className={s.rowDivider}>{L(tx.col.fundName)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.overseasFunds.length === 0 ? (
                <tr><td colSpan={3} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.overseasFunds.map((item) => (
                <tr key={item.seqNo} className={s.rowDivider}>
                  <td className={s.tac}>{item.seqNo}</td>
                  <td className={s.tal} style={{ padding: '10px 6px' }}>{L(item.name)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col.details)} onClick={() => openOverseasDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sd.overseasFunds.length > 0 && (
            <div className={s.sumValue} style={{ marginTop: 15 }}>
              <h3 className={s.sumValueTit}>{L(tx.totalValuation)}</h3>
              <p className={s.sumValueNum}>{won(sd.overseasFundSum)}</p>
            </div>
          )}
          <div className={s.info}>
            <ul>
              {tx.overseasFundNotes.map((note, i) => (
                <li key={i} style={i === 1 ? { fontWeight: 500 } : undefined}>{L(note)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.guide}>
          <div>
            <h3 className={s.guideTit}>{L(tx.glossaryTit)}</h3>
            <ul className={s.guideCont}>
              {tx.glossary.map((g, i) => (
                <li key={i}><span style={{ fontWeight: 500 }}>{L(g.term)}</span> : <MultiLine text={L(g.desc)} /></li>
              ))}
            </ul>
          </div>
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

      {detail && (
        <>
          <div className={s.dark} onClick={() => setDetail(null)} />
          <div className={s.detailModal} style={{ transform: `translate(-50%, -50%) scale(${scale})`, maxWidth: 340 }}>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 15 }}>{detail.title}</p>
            <table className={s.detailModalTable}>
              <tbody>
                {detail.rows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className={s.closeBtn} onClick={() => setDetail(null)}>{L(tx.close)}</button>
          </div>
        </>
      )}

      {overseasDetail && (
        <>
          <div className={s.dark} onClick={() => setOverseasDetail(null)} />
          <div className={s.detailModal} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
            <h3 className={s.detailModalTit}>{overseasDetail.title}</h3>
            <table className={s.detailModalTable}>
              <tbody>
                {overseasDetail.rows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className={s.closeBtn} onClick={() => setOverseasDetail(null)}>{L(tx.close)}</button>
          </div>
        </>
      )}

      <Toast message={toast} scale={scale} />
    </>
  );
}
