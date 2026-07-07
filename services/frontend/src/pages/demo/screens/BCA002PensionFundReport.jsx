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
import { text as tx, sampleData as sd } from './bca002Data';
import circle1 from '../../../assets/jsp-demo/circle_1.png';
import circle2 from '../../../assets/jsp-demo/circle_2.png';
import circle3 from '../../../assets/jsp-demo/circle_3.png';
import circle4 from '../../../assets/jsp-demo/circle_4.png';
import circle5 from '../../../assets/jsp-demo/circle_5.png';
import circle6 from '../../../assets/jsp-demo/circle_6.png';

const s = sharedStyles;
const CIRCLE_IMG = [circle1, circle2, circle3, circle4, circle5, circle6];

export default function BCA002PensionFundReport() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [holdingDetail, setHoldingDetail] = useState(null);
  const [feeDetail, setFeeDetail] = useState(null);
  const [pensionExpanded, setPensionExpanded] = useState(false);

  const openHoldingDetail = (item) => setHoldingDetail({
    title: L(item.name),
    rows: [
      [L(tx.detail.holdingName), L(item.name)],
      [L(tx.detail.fundCode), item.fundCode],
      [L(tx.detail.buyPeriod), `${num(item.buyPeriodDays)}${L(tx.detail.buyPeriodUnit)}`],
      [L(tx.detail.buyPrincipal), won(item.buyPrincipal)],
      [L(tx.detail.valuation), won(item.valuation)],
      [L(tx.detail.cumulativeReturn), `${item.cumulativeReturn} %`],
    ],
  });

  const openFeeDetail = (item) => setFeeDetail({
    title: L(item.name),
    rows: [
      [L(tx.detail.holdingName), L(item.name)],
      [L(tx.detail.totalFeeRate), `${item.totalFeeRate} %`],
      [L(tx.detail.mgmtFee), `${item.mgmtFee} %`],
      [L(tx.detail.salesFee), `${item.salesFee} %`],
      [L(tx.detail.trustFee), `${item.trustFee} %`],
      [L(tx.detail.adminFee), `${item.adminFee} %`],
    ],
  });

  const introText = L(tx.introSummary).replace('{product}', L(sd.productName));
  const keyInfoText = L(tx.keyInfoText).replace('{baseDate}', sd.baseDate).replace('{product}', L(sd.productName));
  const visiblePension = pensionExpanded ? sd.pensionSchedule : sd.pensionSchedule.slice(0, 3);

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={s.main} style={{ paddingBottom: 76 }}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>
              {L(tx.screenNameLine1)}<br />{L(tx.screenNameLine2)} <span style={{ fontSize: 14 }}>{L(tx.summaryTag)}</span>
            </h2>
          </div>
        </section>

            <section className={s.content} style={{ paddingTop: 15 }}>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 15 }}>{L(tx.baseDateLabel)}{sd.baseDate}</p>
              <p style={{ fontSize: 14, fontWeight: 300, marginBottom: 25 }}>
                {introText}
                <span style={{ color: '#0046FF', fontWeight: 500 }}>{L(tx.introSummaryHighlight)}</span>
                {L(tx.introSummaryEnd)}
              </p>

              <h3 className={s.sectionTit} style={{ marginBottom: 10 }}>{L(tx.s1aTit)}</h3>
              <div className={s.tableLR} style={{ marginBottom: 25 }}>
                <table>
                  <colgroup><col style={{ width: '40%' }} /><col style={{ width: '60%' }} /></colgroup>
                  <tbody>
                    <tr><th>{L(tx.contractor)}</th><td>{L(sd.contractor)}</td></tr>
                    <tr><th>{L(tx.productName)}</th><td>{L(sd.productName)}</td></tr>
                    <tr><th>{L(tx.accountNo)}</th><td>{sd.accountNo}</td></tr>
                    <tr><th>{L(tx.contractDate)}</th><td>{sd.contractDate}</td></tr>
                    <tr><th>{L(tx.pensionAvailableDate)}</th><td>{sd.pensionAvailableDate}</td></tr>
                    <tr><th>{L(tx.pensionStartDate)}</th><td>{sd.pensionStartDate}</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s1bTit)}</h3>
              <div className={s.txtBox} style={{ marginBottom: 15 }}>
                {keyInfoText}
                <img className={s.numImg} src={CIRCLE_IMG[0]} alt="" /><span style={{ fontWeight: 500, textDecoration: 'underline' }}>{num(sd.principal)}</span>
                {L(tx.keyInfoMid1)}
                <img className={s.numImg} src={CIRCLE_IMG[3]} alt="" /><span style={{ fontWeight: 500, textDecoration: 'underline' }}>{num(sd.accruedBalance)}</span>
                {L(tx.keyInfoMid2)}
                <img className={s.numImg} src={CIRCLE_IMG[4]} alt="" /><span style={{ fontWeight: 500, textDecoration: 'underline' }}>{sd.cumulativeReturn}</span>
                {L(tx.keyInfoEnd)}
              </div>

              <table className={s.summaryTable} style={{ marginBottom: 50 }}>
                <colgroup><col style={{ width: '30%' }} /><col style={{ width: '30%' }} /><col style={{ width: '40%' }} /></colgroup>
                <tbody>
                  <tr>
                    <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[0]} alt="" />{L(tx.principal)}</th>
                    <td className={s.tar}>{num(sd.principal)} 원</td>
                  </tr>
                  <tr>
                    <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[1]} alt="" />{L(tx.withdrawal)}</th>
                    <td className={s.tar}>(-) {num(sd.withdrawal)} 원</td>
                  </tr>
                  <tr>
                    <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[2]} alt="" />{L(tx.totalFees)}</th>
                    <td className={s.tar}>(-) {num(sd.totalFees)} 원</td>
                  </tr>
                  <tr className={s.summaryToggleRow}>
                    <td colSpan={3}>
                      {L(tx.toggleExplain)}
                      <p style={{ fontSize: 13, fontWeight: 300, marginTop: 4 }}>{L(tx.toggleExplainNote)}</p>
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[3]} alt="" />{L(tx.accruedBalance)}</th>
                    <td className={s.tar}>{num(sd.accruedBalance)} 원</td>
                  </tr>
                  <tr>
                    <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[4]} alt="" />{L(tx.cumulativeReturn)}</th>
                    <td className={s.tar}>{sd.cumulativeReturn} %</td>
                  </tr>
                  <tr>
                    <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[5]} alt="" />{L(tx.annualAvgReturn)}</th>
                    <td className={s.tar}>{sd.annualAvgReturn} %</td>
                  </tr>
                  <tr>
                    <th rowSpan={2} className={s.bdr}>{L(tx.earlyTerminationRefund)}</th>
                    <th className={s.bdr}>{L(tx.taxDeductionExpected)}</th>
                    <td className={s.tar}>(-) {num(sd.taxDeductionExpected)} 원</td>
                  </tr>
                  <tr>
                    <th className={s.bdr}>{L(tx.refundExpected)}</th>
                    <td className={s.tar}>{num(sd.refundExpected)} 원</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <DemoHeader alt={d.logoAlt} />

            <section className={s.main} style={{ paddingBottom: 76 }}>
              <div className={s.mainImg} />
              <div className={s.inner}>
                <h2 className={s.mainTit}>{L(tx.screenNameLine1)}<br />{L(tx.screenNameLine2)}</h2>
              </div>
            </section>

            <section className={s.content} style={{ paddingTop: 15 }}>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 15 }}>{L(tx.baseDateLabel)}{sd.baseDate}</p>
              <p style={{ fontSize: 14, fontWeight: 300, marginBottom: 25 }}>{L(tx.websiteNote)}</p>

              <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s21Tit)}</h3>
              <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
                <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
                <tbody>
                  <tr><th>{L(tx.contractorName)}</th><td>{L(sd.contractorName)}</td></tr>
                  <tr><th>{L(tx.contractDateNew)}</th><td>{sd.contractDate}</td></tr>
                  <tr><th>{L(tx.paymentMaturityDate)}</th><td>{L(sd.paymentMaturityDate)}</td></tr>
                  <tr><th>{L(tx.pensionStartDateApplied)}</th><td>{sd.pensionStartDate}</td></tr>
                  <tr><th>{L(tx.pensionAvailableDate)}</th><td>{sd.pensionAvailableDate}</td></tr>
                  <tr><th>{L(tx.pensionMaturityDate)}</th><td>-</td></tr>
                  <tr><th>{L(tx.accountNo)}</th><td>{sd.accountNo}</td></tr>
                  <tr><th>{L(tx.productName)}</th><td>{L(sd.productName)}</td></tr>
                  <tr><th>{L(tx.productType)}</th><td>{L(sd.productType)}</td></tr>
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25 }}>
                <ul>{tx.s21Notes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.sectionTit}>{L(tx.s22Tit)}</h3>
              <p className={s.contTitSub} style={{ marginBottom: 17 }}>{L(tx.s22Sub)}</p>
              <h3 className={s.contTit}>{L(tx.s22aTit)}</h3>
              <div className={s.txtBox} style={{ marginBottom: 15 }}>
                <ul>{tx.s22aNotes.map((n, i) => <li key={i} style={{ marginBottom: i === 0 ? 10 : 0 }}>{L(n)}</li>)}</ul>
              </div>
              <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
                <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
                <tbody>
                  <tr><th>{L(tx.principal)}</th><td>{num(sd.investReturnPrincipal)} 원</td></tr>
                  <tr><th>{L(tx.withdrawal)}</th><td>{num(sd.investReturnWithdrawal)} 원</td></tr>
                  <tr><th>{L(tx.fundValuation)}</th><td>{num(sd.investReturnBalance)} 원</td></tr>
                  <tr><th>{L(tx.cumulativeReturn)}</th><td>{sd.investReturnCumulative} %</td></tr>
                  <tr><th>{L(tx.annualAvgReturn)}</th><td>{sd.investReturnAnnual} %</td></tr>
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25 }}>
                <ul>{tx.s22aFooterNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s22bTit)}</h3>
              <div className={s.numunitflex}>
                <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.fundReturns.length}{L(tx.totalSuffix)}</p>
                <span className={s.unit}>{L(tx.unitPercent)}</span>
              </div>
              <table className={s.dataTable}>
                <colgroup><col /><col style={{ width: '17%' }} /><col style={{ width: '17%' }} /><col style={{ width: '17%' }} /><col style={{ width: '17%' }} /></colgroup>
                <thead>
                  <tr>
                    <th className={s.rowDivider}>{L(tx.col.fundName)}</th>
                    <th className={s.rowDivider}>{L(tx.col.m3)}</th>
                    <th className={s.rowDivider}>{L(tx.col.m6)}</th>
                    <th className={s.rowDivider}>{L(tx.col.m9)}</th>
                    <th className={s.rowDivider}>{L(tx.col.m12)}</th>
                  </tr>
                </thead>
                <tbody>
                  {sd.fundReturns.length === 0 ? (
                    <tr><td colSpan={5} className={s.noResult}>{L(tx.noResult)}</td></tr>
                  ) : sd.fundReturns.map((item, i) => (
                    <tr key={i} className={s.rowDivider}>
                      <td className={s.tal}>{L(item.name)}</td>
                      <td className={s.tar}>{item.m3}</td>
                      <td className={s.tar}>{item.m6}</td>
                      <td className={s.tar}>{item.m9}</td>
                      <td className={s.tar}>{item.m12}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25 }}>
                <ul>{tx.s22bNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.contTit} style={{ marginBottom: 10 }}>{L(tx.s22cTit)}</h3>
              <div className={s.txtBox} style={{ marginBottom: 15 }}>
                <ul>{tx.s22cNotes1.map((n, i) => <li key={i} style={{ marginBottom: i === 0 ? 7 : 0 }}>{L(n)}</li>)}</ul>
              </div>
              <div className={s.numunitflex}>
                <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.holdings.length}{L(tx.totalSuffix)}</p>
                <span className={s.unit}>{L(tx.unitWonPercent)}</span>
              </div>
              <table className={s.dataTable}>
                <colgroup><col /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '15%' }} /><col style={{ width: '12%' }} /></colgroup>
                <thead>
                  <tr>
                    <th className={s.rowDivider}>{L(tx.col2.holdingName)}</th>
                    <th className={s.rowDivider}>{L(tx.col2.buyPrincipal)}</th>
                    <th className={s.rowDivider}>{L(tx.col2.valuation)}</th>
                    <th className={s.rowDivider}>{L(tx.col2.cumulativeReturn)}</th>
                    <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col2.details)}</th>
                  </tr>
                </thead>
                <tbody>
                  {sd.holdings.length === 0 ? (
                    <tr><td colSpan={5} className={s.noResult}>{L(tx.noResult)}</td></tr>
                  ) : sd.holdings.map((item, i) => (
                    <tr key={i} className={s.rowDivider}>
                      <td className={s.tal}>{L(item.name)}</td>
                      <td className={s.tar}>{num(item.buyPrincipal)}</td>
                      <td className={s.tar}>{num(item.valuation)}</td>
                      <td className={s.tar}>{item.cumulativeReturn}</td>
                      <td className={s.detailBtnCell}>
                        <button type="button" className={s.detailBtn} aria-label={L(tx.col2.details)} onClick={() => openHoldingDetail(item)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
                <ul>{tx.s22cModalNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.contTit}>{L(tx.s22dTit)}</h3>
              <p className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.s22dSub)}</p>
              <div className={s.txtBox} style={{ marginBottom: 15 }}>
                <ul>{tx.s22dNotes1.map((n, i) => <li key={i} style={{ marginBottom: i === 0 ? 7 : 0 }}>{L(n)}</li>)}</ul>
              </div>
              <table className={s.dataTable} style={{ marginBottom: 15 }}>
                <thead>
                  <tr>
                    <th className={s.rowDivider}>{L(tx.col3.division)}</th>
                    <th className={s.rowDivider}>{L(tx.col3.totalFeeAmount)}</th>
                    <th className={s.rowDivider}>{L(tx.col3.totalFeeRate)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={s.rowDivider}>
                    <td className={s.tal}>{L(tx.currentPeriod)}</td>
                    <td className={s.tar}>{num(sd.feesCurrentAmount)} 원</td>
                    <td className={s.tar}>{sd.feesCurrentRate} %</td>
                  </tr>
                  <tr className={s.rowDivider}>
                    <td className={s.tal}>{L(tx.cumulativePeriod)}</td>
                    <td className={s.tar}>{num(sd.feesCumulativeAmount)} 원</td>
                    <td className={s.tar}>{sd.feesCumulativeRate} %</td>
                  </tr>
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25 }}>
                <ul>{tx.s22dNotes2.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.contTit} style={{ marginBottom: 10 }}>{L(tx.s22eTit)}</h3>
              <table className={s.dataTable}>
                <colgroup><col /><col style={{ width: '30%' }} /><col style={{ width: '15%' }} /></colgroup>
                <thead>
                  <tr>
                    <th className={s.rowDivider}>{L(tx.col4.holdingName)}</th>
                    <th className={s.rowDivider}>{L(tx.col4.totalFeeRate)}</th>
                    <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col4.details)}</th>
                  </tr>
                </thead>
                <tbody>
                  {sd.feeRatesByHolding.map((item, i) => (
                    <tr key={i} className={s.rowDivider}>
                      <td className={s.tal}>{L(item.name)}</td>
                      <td className={s.tar}>{item.totalFeeRate}</td>
                      <td className={s.detailBtnCell}>
                        <button type="button" className={s.detailBtn} aria-label={L(tx.col4.details)} onClick={() => openFeeDetail(item)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25, marginTop: 15 }}>
                <ul>{tx.s22eNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.sectionTit}>{L(tx.s23Tit)}</h3>
              <p className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.s23Sub)}</p>
              <div className={s.txtBox} style={{ marginBottom: 15 }}>
                <ul>{tx.s23Notes.map((n, i) => <li key={i} style={{ marginBottom: i < 2 ? 7 : 0 }}>{L(n)}</li>)}</ul>
              </div>
              <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
                <colgroup><col style={{ width: '40%' }} /><col style={{ width: '60%' }} /></colgroup>
                <tbody>
                  <tr><th>{L(tx.expectedContribution)}</th><td>{num(sd.expectedContribution)} 원</td></tr>
                  <tr><th>{L(tx.expectedReturn)}</th><td>{sd.expectedReturn} %</td></tr>
                </tbody>
              </table>
              <table className={s.dataTable}>
                <colgroup><col style={{ width: '25%' }} /><col style={{ width: '40%' }} /><col /></colgroup>
                <thead>
                  <tr>
                    <th className={s.rowDivider}>{L(tx.col5.age)}</th>
                    <th className={s.rowDivider}>{L(tx.col5.year)}</th>
                    <th className={s.rowDivider}>{L(tx.col5.amount)}</th>
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
                <ul>{tx.s23FooterNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s24Tit)}</h3>
              <p className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s24aTit)}</p>
              <div className={s.txtBox} style={{ marginBottom: 25 }}>
                <ul>{tx.s24aNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <p className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s24bTit)}</p>
              <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
                <colgroup><col style={{ width: '15%' }} /><col style={{ width: '25%' }} /><col style={{ width: '60%' }} /></colgroup>
                <tbody>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.terminationBaseDate)}</th><td className={s.tar}>{sd.terminationBaseDate}</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.division)}</th><td className={s.tar}>{L(tx.beforeMaturityTermination)}</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.principal)}</th><td className={s.tar}>{num(sd.terminationPrincipal)} 원</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.withdrawal)}</th><td className={s.tar}>{num(sd.terminationWithdrawal)} 원</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.accruedBalance)}</th><td className={s.tar}>{num(sd.terminationBalance)} 원</td></tr>
                  <tr>
                    <th rowSpan={2} className={s.bdr}>{L(tx.taxes)}</th>
                    <th className={s.bdr}>{L(tx.otherIncomeTax)}</th>
                    <td className={s.tar}>{num(sd.otherIncomeTax)} 원</td>
                  </tr>
                  <tr><th className={s.bdr}>{L(tx.otherTaxes)}</th><td className={s.tar}>{num(sd.otherTaxes)} 원</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.refundExpectedAmount)}</th><td className={s.tar}>{num(sd.terminationRefund)} 원</td></tr>
                </tbody>
              </table>
              <div className={s.info} style={{ marginBottom: 25 }}>
                <ul>{tx.s24bNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>

              <h3 className={s.sectionTit} style={{ marginBottom: 17 }}>{L(tx.s25Tit)}</h3>
              <div className={s.txtBox} style={{ marginBottom: 15 }}><p>{L(tx.s25Warning)}</p></div>
              <div className={s.info} style={{ marginBottom: 15 }}>
                <ul>
                  {tx.s25Notes1.map((n, i) => (
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
              <div className={s.info} style={{ marginBottom: 15 }}>
                <h3 className={s.infoTit}>{L(tx.s25AvailableTit)}</h3>
                <ul>{tx.s25AvailableNotes.map((n, i) => <li key={i}>{L(n)}</li>)}</ul>
              </div>
              <p style={{ fontSize: 13, fontWeight: 300, marginTop: 15, marginBottom: 25, color: '#555' }}>{L(tx.s25Portal)}</p>
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

      <DetailModal detail={holdingDetail} onClose={() => setHoldingDetail(null)} scale={scale} closeLabel={L(tx.close)} />
      <DetailModal detail={feeDetail} onClose={() => setFeeDetail(null)} scale={scale} closeLabel={L(tx.close)} />
      <Toast message={toast} scale={scale} />
    </>
  );
}
