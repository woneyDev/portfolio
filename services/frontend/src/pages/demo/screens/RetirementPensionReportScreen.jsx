import { Fragment, useState } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './retirementPensionReportData';
import circle1 from '../../../assets/jsp-demo/circle_1.png';
import circle2 from '../../../assets/jsp-demo/circle_2.png';
import circle3 from '../../../assets/jsp-demo/circle_3.png';
import circle4 from '../../../assets/jsp-demo/circle_4.png';
import circle5 from '../../../assets/jsp-demo/circle_5.png';

const s = sharedStyles;
const CIRCLE_IMG = [circle1, circle2, circle3, circle4, circle5];

function MultiLine({ text }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export default function RetirementPensionReportScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [pensionExpanded, setPensionExpanded] = useState(false);

  const keyInfoText = L(tx.keyInfoText).replace('{baseDate}', sd.baseDate);
  const visiblePension = pensionExpanded ? sd.pensionSchedule : sd.pensionSchedule.slice(0, 3);

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={s.main} style={{ paddingBottom: 76 }}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>{L(tx.screenName)}</h2>
          </div>
        </section>

        <div className={s.sectionTitleBar}>
          <h3 className={s.sectionTitleH}>{L(tx.summaryReportTit)}</h3>
        </div>

        <section className={s.content}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 15 }}>{L(tx.baseDateLabel)}{sd.baseDate}</p>
          <p style={{ fontSize: 14, fontWeight: 300, marginBottom: 25 }}>
            {L(tx.introSummary)}<span style={{ fontWeight: 500 }}>{L(tx.introSummaryHighlight)}</span>{L(tx.introSummaryEnd)}
          </p>

          <h3 className={s.sectionTit} style={{ marginBottom: 10 }}>{L(tx.basicInfoTit)}</h3>
          <div className={s.tableLR} style={{ marginBottom: 25 }}>
            <table>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.subscriber)}</th><td>{L(sd.subscriber)}</td></tr>
                <tr><th>{L(tx.contractDate)}</th><td>{sd.contractDate}</td></tr>
                <tr><th>{L(tx.planType)}</th><td>{L(sd.planType)}</td></tr>
                <tr><th>{L(tx.company)}</th><td>{L(sd.company)}</td></tr>
                <tr><th>{L(tx.pensionAvailableDate)}</th><td>{sd.pensionAvailableDate}</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.keyInfoTit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 15 }}>
            {keyInfoText}
            <img className={s.numImg} src={CIRCLE_IMG[0]} alt="" /><span style={{ fontWeight: 500, textDecoration: 'underline' }}>{num(sd.contribution)}</span>
            {L(tx.keyInfoMid1)}
            <img className={s.numImg} src={CIRCLE_IMG[4]} alt="" /><span style={{ fontWeight: 500, textDecoration: 'underline' }}>{num(sd.accruedBalance)}</span>
            {L(tx.keyInfoMid2)}
            <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{sd.cumulativeReturn}</span>
            {L(tx.keyInfoEnd)}
          </div>

          <table className={s.summaryTable} style={{ marginBottom: 25 }}>
            <colgroup><col style={{ width: '55%' }} /><col style={{ width: '45%' }} /></colgroup>
            <tbody>
              <tr><th><img className={s.numImg} src={CIRCLE_IMG[0]} alt="" />{L(tx.contribution)}</th><td className={s.tar}>{num(sd.contribution)} 원</td></tr>
              <tr><th><img className={s.numImg} src={CIRCLE_IMG[1]} alt="" />{L(tx.investProfit)}</th><td className={s.tar}>{num(sd.investProfit)} 원</td></tr>
              <tr><th><img className={s.numImg} src={CIRCLE_IMG[2]} alt="" />{L(tx.withdrawalEtc)}</th><td className={s.tar}>{num(sd.withdrawalEtc)} 원</td></tr>
              <tr className={s.summaryToggleRow}><td colSpan={2}>{L(tx.withdrawalNote)}</td></tr>
              <tr><th><img className={s.numImg} src={CIRCLE_IMG[3]} alt="" />{L(tx.feeAmount)}</th><td className={s.tar}>{num(sd.feeAmount)} 원</td></tr>
              <tr className={s.summaryToggleRow}><td colSpan={2}>{L(tx.feeNote)}</td></tr>
              <tr className={s.summaryToggleRow}><td colSpan={2}>{L(tx.balanceExplain)}</td></tr>
              <tr><th><img className={s.numImg} src={CIRCLE_IMG[4]} alt="" />{L(tx.accruedBalance)}</th><td className={s.tar}>{num(sd.accruedBalance)} 원</td></tr>
              <tr><th>{L(tx.cumulativeReturnAfterFee)}</th><td className={s.tar}>{sd.cumulativeReturn} %</td></tr>
              <tr><th>{L(tx.annualAvgReturn)}</th><td className={s.tar}>{sd.annualAvgReturn} %</td></tr>
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25 }}>
            <ul>
              <li>{L(tx.keyInfoNote1)}</li>
              <li>{L(tx.keyInfoNote2)}</li>
            </ul>
          </div>
        </section>

        <div className={s.sectionBar} />
        <div className={s.sectionTitleBar}>
          <h3 className={s.sectionTitleH}>{L(tx.bodyReportTit)}</h3>
        </div>

        <section className={s.content}>
          <div className={s.tableLR} style={{ marginBottom: 15 }}>
            <table>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.contractDate)}</th><td>{sd.contractDate}</td></tr>
                <tr><th>{L(tx.baseDate2)}</th><td>{sd.baseDate}</td></tr>
                <tr><th>{L(tx.planType)}</th><td>{L(sd.planType)}</td></tr>
                <tr><th>{L(tx.subscriberOrWorkplace)}</th><td>{L(sd.subscriber)}</td></tr>
                <tr><th>{L(tx.affiliatedCompany)}</th><td>{L(sd.company)}</td></tr>
                <tr><th>{L(tx.contact)}</th><td>{L(sd.contact)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className={s.info} style={{ marginBottom: 25 }}>
            <ul><li>{L(tx.contactNote)}</li></ul>
          </div>

          <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s1Tit)}</h3>
          <h3 className={s.contTit}>{L(tx.s1_1Tit)}</h3>
          <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
            <colgroup><col style={{ width: '40%' }} /><col style={{ width: '25%' }} /><col style={{ width: '35%' }} /></colgroup>
            <tbody>
              <tr><th colSpan={2}>{L(tx.priorBalance)}</th><td className={s.tar}>{num(sd.priorBalance)} 원</td></tr>
              <tr><th rowSpan={2}>{L(tx.paymentAmount)}</th><th className={s.tac}>{L(tx.companyPayment)}</th><td className={s.tar}>{num(sd.companyPaymentTotal)} 원</td></tr>
              <tr><th className={s.tac}>{L(tx.subscriberPayment)}</th><td className={s.tar}>{num(sd.subscriberPaymentTotal)} 원</td></tr>
              <tr><th rowSpan={2}>{L(tx.deductionAmount)}</th><th className={s.tac}>{L(tx.feeDeduction)}</th><td className={s.tar}>{num(sd.feeDeductionTotal)} 원</td></tr>
              <tr><th className={s.tac}>{L(tx.withdrawalDeduction)}</th><td className={s.tar}>{num(sd.withdrawalDeductionTotal)} 원</td></tr>
              <tr><th colSpan={2}>{L(tx.investProfitD)}</th><td className={s.tar}>{num(sd.investProfitD)} 원</td></tr>
              <tr><th colSpan={2}>{L(tx.currentBalance)}</th><td className={s.tar}>{num(sd.currentBalance)} 원</td></tr>
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25 }}>
            <ul>
              <li>{L(tx.s1_1Note1)}</li>
              <li>{L(tx.s1_1Note2)}</li>
            </ul>
          </div>

          <h3 className={s.contTit}>{L(tx.s1_2Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s1_2aTit)}</h3>
          <span className={s.unit}>{L(tx.unitWon)}</span>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /></colgroup>
            <thead>
              <tr>
                <th colSpan={2} className={s.rowDivider}>{L(tx.companyPaymentAmount)}</th>
                <th colSpan={2} className={s.rowDivider}>{L(tx.subscriberPaymentAmount)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.paymentDate)}</th>
                <th className={s.rowDivider}>{L(tx.paymentAmountCol)}</th>
                <th className={s.rowDivider}>{L(tx.paymentDate)}</th>
                <th className={s.rowDivider}>{L(tx.paymentAmountCol)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.payments.length === 0 ? (
                <tr><td colSpan={4} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.payments.map((p, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tac}>{p.companyDate}</td>
                  <td className={s.tar}>{num(p.companyAmount)}</td>
                  <td className={s.tac}>{p.subscriberDate}</td>
                  <td className={s.tar}>{num(p.subscriberAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.sumValue} style={{ marginTop: 15, flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3 className={s.sumValueTit}>{L(tx.companyPaymentSum)}</h3>
              <p className={s.sumValueNum}>{won(sd.companyPaymentTotal)}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h3 className={s.sumValueTit}>{L(tx.subscriberPaymentSum)}</h3>
              <p className={s.sumValueNum}>{won(sd.subscriberPaymentTotal)}</p>
            </div>
          </div>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul><li>{L(tx.s1_2aNote)}</li></ul>
          </div>

          <h3 className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.s1_2bTit)}</h3>
          <table className={s.dataTable}>
            <thead>
              <tr><th colSpan={3} className={s.rowDivider}>{L(tx.feeTit)}</th></tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.detailItem)}</th>
                <th className={s.rowDivider}>{L(tx.deductionDate)}</th>
                <th className={s.rowDivider}>{L(tx.deductionAmountCol)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.fees.length === 0 ? (
                <tr><td colSpan={3} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.fees.map((f, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tac}>{L(f.item)}</td>
                  <td className={s.tac}>{f.date}</td>
                  <td className={s.tar}>{num(f.amount)} 원</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.sumValue} style={{ marginTop: 15 }}>
            <h3 className={s.sumValueTit}>{L(tx.deductionSum)}</h3>
            <p className={s.sumValueNum}>{won(sd.feeDeductionTotal)}</p>
          </div>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul><li>{L(tx.s1_2bNote)}</li></ul>
          </div>

          <table className={s.dataTable}>
            <thead>
              <tr><th colSpan={3} className={s.rowDivider}>{L(tx.withdrawalTit)}</th></tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.detailItem2)}</th>
                <th className={s.rowDivider}>{L(tx.deductionDate)}</th>
                <th className={s.rowDivider}>{L(tx.deductionAmountCol)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.withdrawals.length === 0 ? (
                <tr><td colSpan={3} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.withdrawals.map((w, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tac}>{L(w.item)}</td>
                  <td className={s.tac}>{w.date}</td>
                  <td className={s.tar}>{num(w.amount)} 원</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.sumValue} style={{ marginTop: 15 }}>
            <h3 className={s.sumValueTit}>{L(tx.withdrawalSum)}</h3>
            <p className={s.sumValueNum}>{won(sd.withdrawalDeductionTotal)}</p>
          </div>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul><li>{L(tx.s1_2cNote)}</li></ul>
          </div>

          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s1_3Tit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.holdings.length}{L(tx.totalSuffix)}</p>
            <span className={s.unit}>{L(tx.unitWonPercent)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '18%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col.division)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col.productName)}</th>
                <th className={s.rowDivider}>{L(tx.col.buyPrincipal)}</th>
                <th colSpan={2} className={s.rowDivider}>{L(tx.accruedBalance)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.profitLoss)}</th>
                <th className={s.rowDivider}>{L(tx.col.valuation)}</th>
                <th className={s.rowDivider}>{L(tx.col.weight)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.holdings.length === 0 ? (
                <tr><td colSpan={5} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.holdings.map((h, i) => (
                <Fragment key={i}>
                  <tr>
                    <td rowSpan={2} className={`${s.tac} ${s.rowDivider}`}>{L(h.division)}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(h.name)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(h.buyPrincipal)}</td>
                    <td rowSpan={2} className={`${s.tar} ${s.rowDivider}`}>{num(h.valuation)}</td>
                    <td rowSpan={2} className={`${s.tar} ${s.rowDivider}`}>{h.weight}</td>
                  </tr>
                  <tr><td className={`${s.tar} ${s.bdr} ${s.rowDivider}`}>{num(h.profitLoss)}</td></tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          <div className={s.sumValue} style={{ marginTop: 15 }}>
            <h3 className={s.sumValueTit}>{L(tx.valuationSum)}</h3>
            <p className={s.sumValueNum}>{won(sd.holdingSum)}</p>
          </div>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul>{tx.s1_3Notes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s2Tit)}</h3>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s2_1Tit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.tac}>{L(tx.cumulativeReturnLabel)}<br /><span style={{ fontSize: 11, fontWeight: 300 }}>({sd.periodFrom} ~ {sd.periodTo})</span></th>
                <th className={s.tac}>{L(tx.annualAvgReturnLabel)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={s.tac}>{sd.overallCumulativeReturn} %</td>
                <td className={s.tac}>{sd.overallAnnualReturn} %</td>
              </tr>
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25 }}>
            <ul>{tx.s2_1Notes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
          </div>

          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s2_2Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s2_2aTit)}</h3>
          <span className={s.unit}>{L(tx.unitPercent)}</span>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '18%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col2.productName)}</th>
                <th className={s.rowDivider}>{L(tx.col2.rate)}</th>
                <th className={s.rowDivider}>{L(tx.col2.buyDate)}</th>
                <th className={s.rowDivider}>{L(tx.col2.maturityDate)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.guaranteedProducts.length === 0 ? (
                <tr><td colSpan={4} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.guaranteedProducts.map((p, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(p.name)}</td>
                  <td className={s.tac}>{p.rate}</td>
                  <td className={s.tac}>{p.buyDate}</td>
                  <td className={s.tac}>{p.maturityDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul>{tx.s2_2aNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
          </div>

          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s2_2bTit)}</h3>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '25%' }} /><col style={{ width: '18%' }} /><col style={{ width: '25%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.productName)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.investPeriod)}</th>
                <th colSpan={2} className={s.rowDivider}>{L(tx.col3.cumulativeReturn)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col3.cumulativeReturn)}</th>
                <th className={s.rowDivider}>{L(tx.col3.annualizedReturn)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.performanceProducts.length === 0 ? (
                <tr><td colSpan={4} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.performanceProducts.map((p, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(p.name)}</td>
                  <td className={s.tac}>{p.periodFrom} ~ {p.periodTo}</td>
                  <td className={s.tac}>{p.cumulativeReturn}</td>
                  <td className={s.tac}>{p.annualizedReturn}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul><li style={{ color: 'blue' }}>{L(tx.s2_2bNote)}</li></ul>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s3Tit)}</h3>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s3_1Tit)}</h3>
          <table className={s.dataTable}>
            <thead>
              <tr><th colSpan={5} className={`${s.tac} ${s.rowDivider}`}>{L(tx.feeDiscountTit)}</th></tr>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col4.division)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col4.applicable)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col4.plan)}</th>
                <th colSpan={2} className={s.rowDivider}>{L(tx.col4.mgmtDiscount)}</th>
              </tr>
              <tr><th className={s.rowDivider}>{L(tx.col4.custodyDiscount)}</th><th className={s.rowDivider}>{L(tx.col4.note)}</th></tr>
            </thead>
            <tbody>
              {tx.feeDiscountRows.map((row, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tac}>{L(row.division)}</td>
                  <td className={s.tal}>{L(row.applicable)}</td>
                  <td className={s.tac}>{L(row.plan)}</td>
                  <td className={s.tac}><MultiLine text={L(row.rate)} /></td>
                  <td className={s.tal}>{L(row.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul className={s.infoNumList}>{tx.s3_1Notes.map((n, i) => <li key={i}>{i + 1}. {L(n)}</li>)}</ul>
          </div>

          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s3_2Tit)}</h3>
          <table className={s.dataTable}>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col5.productName)}</th>
                <th className={s.rowDivider}>{L(tx.col5.totalFeeRate)}</th>
                <th className={s.rowDivider}>{L(tx.col5.feePer100)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.fundFees.length === 0 ? (
                <tr><td colSpan={3} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.fundFees.map((f, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(f.name)}</td>
                  <td className={s.tac}>{f.totalFeeRate}</td>
                  <td className={s.tar}>{f.feePer100}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
            <ul>{tx.s3_2Notes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s4Tit)}</h3>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s4_1Tit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 15 }}>
            <ul>{tx.s4_1Notes.map((n, i) => <li key={i}>※ {L(n)}</li>)}</ul>
          </div>
          <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
            <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
            <tbody>
              <tr><th>{L(tx.expectedContribution)}</th><td>{num(sd.expectedContribution)} 원</td></tr>
              <tr><th>{L(tx.expectedReturn)}</th><td>{sd.expectedReturn} %</td></tr>
            </tbody>
          </table>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '25%' }} /><col style={{ width: '40%' }} /><col /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col6.age)}</th>
                <th className={s.rowDivider}>{L(tx.col6.year)}</th>
                <th className={s.rowDivider}>{L(tx.col6.amount)}</th>
              </tr>
            </thead>
            <tbody>
              {visiblePension.map((row) => (
                <tr key={row.age} className={s.rowDivider}>
                  <td className={s.tac}>{row.age}{L(tx.ageSuffix)}</td>
                  <td className={s.tar}>{row.year}{L(tx.yearSuffix)}</td>
                  <td className={s.tar}>{num(row.amount)} 원</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sd.pensionSchedule.length > 3 && (
            pensionExpanded ? (
              <button type="button" className={s.lessBtn} onClick={() => setPensionExpanded(false)}>{L(tx.less)}</button>
            ) : (
              <button type="button" className={s.moreBtn} onClick={() => setPensionExpanded(true)}>{L(tx.more)}</button>
            )
          )}
          <div className={s.info} style={{ marginBottom: 25 }}>
            <ul>{tx.s4_1FooterNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
          </div>

          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s4_2Tit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 15 }}>
            <p style={{ fontWeight: 500, marginBottom: 7 }}>※ {L(tx.s4_2Warning)}</p>
            <ul>{tx.s4_2Notes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
          </div>
          <p style={{ fontSize: 13, fontWeight: 300, color: '#555', marginBottom: 25 }}>{L(tx.s4_2Portal)}</p>
        </section>

        <section className={s.yearSign}>
          <div className={s.yearSignWrap}>
            <h3 className={s.signTit}>{L(tx.companyName)}</h3>
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

      <Toast message={toast} scale={scale} />
    </>
  );
}
