import { Fragment } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import TrendLineChart from '../shared/TrendLineChart';
import AssetDonutChart from '../shared/AssetDonutChart';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './baa003Data';
import circle1 from '../../../assets/jsp-demo/circle_1.png';
import circle2 from '../../../assets/jsp-demo/circle_2.png';
import circle3 from '../../../assets/jsp-demo/circle_3.png';
import circle4 from '../../../assets/jsp-demo/circle_4.png';
import circle5 from '../../../assets/jsp-demo/circle_5.png';
import circle6 from '../../../assets/jsp-demo/circle_6.png';
import circle7 from '../../../assets/jsp-demo/circle_7.png';

const s = sharedStyles;
const CIRCLE_IMG = [circle1, circle2, circle3, circle4, circle5, circle6, circle7];

export default function BAA003WrapPerformanceReport() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();

  const keyInfoText = (
    <>
      {L(tx.keyInfoText1).split(sd.infoBaseDate).length > 1 ? null : null}
      {lang === 'ko' ? '정보제공 시점인 ' : 'As of '}
      <span style={{ fontWeight: 500 }}>{sd.infoBaseDate}</span>
      {L(tx.keyInfoText1)}
      <img className={s.numImg} src={CIRCLE_IMG[3]} alt="" />
      <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{num(sd.valuation)}</span>
      {L(tx.keyInfoText2)}
      <img className={s.numImg} src={CIRCLE_IMG[4]} alt="" />
      <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{sd.cumulativeReturn}</span>
      {L(tx.keyInfoText3)}
    </>
  );

  const toggleExplain1 = L(tx.toggleExplain)
    .replace('{p}', num(sd.principal))
    .replace('{w}', num(sd.withdrawal))
    .replace('{f}', num(sd.fees))
    .replace('{v}', num(sd.valuation));

  const toggleExplain2 = L(tx.terminationExplain)
    .replace('{v}', num(sd.valuation))
    .replace('{e}', num(sd.expectedTermination));

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={`${s.main} ${s.mainShort}`}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>{L(tx.screenName)}</h2>
            <p className={s.subTitBadge} style={{ background: 'none', padding: 0, color: 'rgba(255,255,255,0.85)' }}>
              {L(tx.baseDateLabel)}{sd.baseDate}
            </p>
          </div>
        </section>

        <div className={s.sectionTitleBar}>
          <h3 className={s.sectionTitleH}>{L(tx.summaryTit)}</h3>
        </div>

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.basicInfoTit)}</h3>
          <div className={s.tableLR}>
            <table>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.contractor)}</th><td>{L(sd.contractor)}</td></tr>
                <tr><th>{L(tx.productName)}</th><td>{L(sd.productName)}</td></tr>
                <tr><th>{L(tx.accountNo)}</th><td>{sd.accountNo.slice(0, 3)}-{sd.accountNo.slice(3, 5)}-***{sd.accountNo.slice(8, 11)}</td></tr>
                <tr><th>{L(tx.firstContractDate)}</th><td>{sd.firstContractDate}</td></tr>
                <tr><th>{L(tx.investPeriod)}</th><td>{num(sd.investPeriod)}{L(tx.days)}</td></tr>
                <tr><th>{L(tx.infoBaseDate)}</th><td>{sd.infoBaseDate}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.sectionTit}>{L(tx.keyInfoTit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 15 }}>{keyInfoText}</div>

          <table className={s.summaryTable}>
            <colgroup><col style={{ width: '30%' }} /><col style={{ width: '30%' }} /><col style={{ width: '40%' }} /></colgroup>
            <tbody>
              <tr>
                <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[0]} alt="" />{L(tx.principal)}</th>
                <td className={s.tar}>{num(sd.principal)} 원</td>
              </tr>
              <tr>
                <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[1]} alt="" />{L(tx.withdrawal)}</th>
                <td className={s.tar}>{num(sd.withdrawal)} 원</td>
              </tr>
              <tr>
                <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[2]} alt="" />{L(tx.fees)}</th>
                <td className={s.tar}>(-) {num(sd.fees)} 원</td>
              </tr>
              <tr className={s.summaryToggleRow}>
                <td colSpan={3}>{toggleExplain1}</td>
              </tr>
              <tr>
                <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[3]} alt="" />{L(tx.valuation)}</th>
                <td className={s.tar}>{num(sd.valuation)} 원</td>
              </tr>
              <tr>
                <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[4]} alt="" />{L(tx.cumulativeReturn)}</th>
                <td className={s.tar}>{sd.cumulativeReturn} %</td>
              </tr>
              <tr>
                <th colSpan={2}><img className={s.numImg} src={CIRCLE_IMG[5]} alt="" />{L(tx.annualizedReturn)}</th>
                <td className={s.tar}>{sd.annualizedReturn} %</td>
              </tr>
              <tr className={s.summaryToggleRow}>
                <td colSpan={3}>{toggleExplain2}</td>
              </tr>
              <tr>
                <th rowSpan={2} className={s.bdr}>{L(tx.expectedTermination)}</th>
                <th className={s.bdr}>
                  <div>{L(tx.deductionExpected)}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>{L(tx.deductionExpectedSub)}</div>
                </th>
                <td className={s.tar}>(-) {num(sd.terminationDeduction)} 원</td>
              </tr>
              <tr>
                <th className={s.bdr}>{L(tx.expectedTermination)}</th>
                <td className={s.tar}>{num(sd.expectedTermination)} 원</td>
              </tr>
            </tbody>
          </table>

          <div className={s.info}>
            <h3 className={s.infoTit}>{L(tx.referenceTit)}</h3>
            <ul className={s.infoCircleList}>
              {tx.referenceNotes.map((note, i) => (
                <li key={i}>
                  {L(note)}
                  {note.sub && <p style={{ fontSize: 13, fontWeight: 300, marginTop: 4 }}>{L(note.sub)}</p>}
                  {note.circleItems && (
                    <ul style={{ marginTop: 5, marginLeft: 7 }}>
                      {note.circleItems.map((ci, j) => (
                        <li key={j} className={j === 0 ? s.circle1 : s.circle2} style={{ position: 'relative', paddingLeft: 15, marginTop: 5 }}>
                          {j === 0 ? '① ' : '② '}{L(ci)}
                        </li>
                      ))}
                    </ul>
                  )}
                  {note.formula && (
                    <ul style={{ marginTop: 5 }}>
                      {note.formula.map((f, j) => (
                        <li key={j} style={{ marginLeft: 17, position: 'relative' }}>{j + 1}. {L(f)}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className={s.sectionBar} />
        <div className={s.sectionTitleBar}>
          <h3 className={s.sectionTitleH}>{L(tx.reportSectionTit)}</h3>
        </div>

        <section className={s.inner}>
          <div className={s.tableLR} style={{ marginBottom: 15 }}>
            <table>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.contractAmount)}</th><td>{num(sd.contractAmount)} 원</td></tr>
                <tr><th>{L(tx.valuation)}</th><td>{num(sd.reportValuation)} 원</td></tr>
                <tr><th>{L(tx.cumulativeProfit)}</th><td>{num(sd.cumulativeProfit)} 원</td></tr>
                <tr><th>{L(tx.cumulativeReturnPeriod)}({sd.cumulativeReturnFrom} ~ {sd.cumulativeReturnTo})</th><td>{sd.cumulativeReturnPct} %</td></tr>
                <tr><th>{L(tx.quarterlyProfit)}</th><td>{num(sd.quarterlyProfit)} 원</td></tr>
                <tr><th>{L(tx.quarterlyReturnPeriod)}({sd.quarterlyReturnFrom} ~ {sd.quarterlyReturnTo})</th><td>{sd.quarterlyReturnPct} %</td></tr>
              </tbody>
            </table>
          </div>
          <div className={s.info}>
            <ul>
              <li>{L(tx.returnNote)}</li>
            </ul>
          </div>
        </section>

        <section className={s.table2r1c} style={{ padding: '0 24px' }}>
          <h3 className={s.contTit}>{L(tx.s1Tit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '30%' }} /><col style={{ width: '70%' }} /></colgroup>
            <tbody>
              <tr><th>{L(tx.wrapService)}</th><td>{L(sd.wrapService)}</td></tr>
              <tr><th>{L(tx.accountNo)}</th><td>{sd.accountNo.slice(0, 3)}-{sd.accountNo.slice(3, 5)}-***{sd.accountNo.slice(8, 11)}</td></tr>
              <tr><th>{L(tx.accountName)}</th><td>{L(sd.accountName)}</td></tr>
              <tr><th>{L(tx.riskProfile)}</th><td>{L(sd.riskTendency)}/{L(sd.riskGrade)}</td></tr>
              <tr><th>{L(tx.serviceRegDate)}</th><td>{sd.serviceRegDate}</td></tr>
              <tr><th>{L(tx.contractPeriod)}</th><td>{sd.contractFrom} ~ {sd.contractTo}</td></tr>
              <tr><th>{L(tx.overseasInvest)}</th><td>{L(sd.overseasInvest)}</td></tr>
              <tr><th>{L(tx.benchmark)}</th><td>{L(sd.benchmark)}</td></tr>
              <tr><th>{L(tx.expectedMaturity)}</th><td>{sd.expectedMaturity}</td></tr>
              <tr><th>{L(tx.wrapBranch)}</th><td>{L(sd.wrapBranch)}</td></tr>
              <tr><th>{L(tx.wrapManager)}</th><td>{L(sd.wrapManager)}</td></tr>
              <tr><th>{L(tx.managingFirm)}</th><td>{L(sd.managingFirm)}</td></tr>
              <tr><th>{L(tx.managingAgent)}</th><td>{L(sd.managingAgent)}</td></tr>
              <tr><th>{L(tx.investTendency)}</th><td className={s.tar}>{L(sd.investTendency)}</td></tr>
              <tr><th>{L(tx.restriction)}</th><td className={s.tar}>{L(sd.restriction)}</td></tr>
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              <li>{L(tx.s1Note1)}</li>
              <li style={{ fontWeight: 500 }}>{L(tx.s1Note2)}</li>
            </ul>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s2Tit)}</h3>
          <div className={s.table5r1c}>
            <p className={s.contTitSub}>{L(tx.s2aTit)}</p>
            <span className={s.unit}>{L(tx.unitPercent)}</span>
            <table className={s.table5r1cTable}>
              <colgroup><col /><col style={{ width: '15%' }} /><col style={{ width: '15%' }} /><col style={{ width: '15%' }} /><col style={{ width: '15%' }} /></colgroup>
              <thead>
                <tr>
                  <th>{L(tx.col.division)}</th>
                  <th>{L(tx.col.m3)}</th>
                  <th>{L(tx.col.m6)}</th>
                  <th>{L(tx.col.m9)}</th>
                  <th>{L(tx.col.m12)}</th>
                  <th>{L(tx.col.cumulative)}</th>
                </tr>
              </thead>
              <tbody>
                {sd.periodReturns.map((row) => (
                  <tr key={L(row.division)}>
                    <td className={s.tal}>{L(row.division)}</td>
                    <td className={s.tar}>{row.m3.toFixed(2)}</td>
                    <td className={s.tar}>{row.m6.toFixed(2)}</td>
                    <td className={s.tar}>{row.m9.toFixed(2)}</td>
                    <td className={s.tar}>{row.m12.toFixed(2)}</td>
                    <td className={s.tar}>{row.cumulative.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.recent3mLineTit)}</h3>
          <div className={s.chartFigure}>
            <TrendLineChart data={sd.recent3mLine} />
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s3Tit)}</h3>
          <div className={s.table5r1c}>
            <p className={s.contTitSub}>{L(tx.s3aTit)}</p>
            <span className={s.unit}>{L(tx.unitWonPercent)}</span>
            <table className={s.table5r1cTable}>
              <colgroup><col /><col style={{ width: '20%' }} /><col style={{ width: '15%' }} /><col style={{ width: '20%' }} /><col style={{ width: '15%' }} /></colgroup>
              <thead>
                <tr>
                  <th rowSpan={2}>{L(tx.col.division)}</th>
                  <th colSpan={2}>{L(sd.assetTypeHeaderCurrent)}</th>
                  <th colSpan={2}>{L(sd.assetTypeHeaderPrior)}</th>
                </tr>
                <tr>
                  <th>{L(tx.evalAmount)}</th>
                  <th>{L(tx.weight)}</th>
                  <th>{L(tx.evalAmount)}</th>
                  <th>{L(tx.weight)}</th>
                </tr>
              </thead>
              <tbody>
                {sd.assetTypeRows.map((row) => (
                  <tr key={L(row.name)}>
                    <td className={s.tac}>{L(row.name)}</td>
                    <td className={s.tar}>{num(row.currentAmount)}</td>
                    <td className={s.tar}>{row.currentWeight.toFixed(2)}</td>
                    <td className={s.tar}>{num(row.priorAmount)}</td>
                    <td className={s.tar}>{row.priorWeight.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className={s.tdSum}>
                  <td className={s.tac}>{L(sd.assetTypeSum.name)}</td>
                  <td className={s.tar}>{num(sd.assetTypeSum.currentAmount)}</td>
                  <td className={s.tar}>{sd.assetTypeSum.currentWeight.toFixed(2)}</td>
                  <td className={s.tar}>{num(sd.assetTypeSum.priorAmount)}</td>
                  <td className={s.tar}>{sd.assetTypeSum.priorWeight.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.assetTypeWeightTit)}</h3>
          <div className={s.chartFigure}>
            <AssetDonutChart data={sd.assetTypeRows.map((r) => ({ name: L(r.name), value: r.currentWeight }))} />
          </div>

          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s3cTit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{d.totalPrefix}{sd.holdings.length}{d.totalSuffix}</p>
            <span className={s.unit}>{L(tx.unitWonSharesPercent)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.division)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.securityName)}</th>
                <th className={s.rowDivider}>{L(tx.col3.baseCurrency)}</th>
                <th className={s.rowDivider}>{L(tx.col3.holdingQty)}</th>
                <th className={s.rowDivider}>{L(tx.col3.returnRate)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col3.region)}</th>
                <th className={s.rowDivider}>{L(tx.col3.avgPrice)}</th>
                <th className={s.rowDivider}>{L(tx.col3.currentPrice)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.holdings.map((row) => (
                <Fragment key={L(row.name)}>
                  <tr>
                    <td rowSpan={2} className={`${s.tac} ${s.rowDivider}`}>{L(row.division)}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(row.name)}</td>
                    <td className={`${s.tac} ${s.rowDivider}`}>{L(row.currency)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.qty)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{row.returnRate.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className={`${s.tac} ${s.rowDivider}`}>{L(row.region)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.avgPrice)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.currentPrice)}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s4Tit)}</h3>
          <div className={s.txtBox}>
            <p>{L(sd.managementStatus)}</p>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s5Tit)}</h3>
          <div className={s.txtBox}>
            <p>{L(sd.managementPlan)}</p>
          </div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s6Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 15 }}>{L(tx.s6aTit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{d.totalPrefix}{sd.trades.length}{d.totalSuffix}</p>
            <span className={s.unit}>{L(tx.unitWonSharesUnits)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col4.division)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col4.securityName)}</th>
                <th className={s.rowDivider}>{L(tx.col4.qty)}</th>
                <th colSpan={2} className={s.rowDivider}>{L(tx.col4.tradeAmount)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col4.tradeDate)}</th>
                <th className={s.rowDivider}>{L(tx.col4.tradePrice)}</th>
                <th className={s.rowDivider}>{L(tx.col4.tradeFee)}</th>
                <th className={s.rowDivider}>{L(tx.col4.taxes)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.trades.map((row, i) => (
                <Fragment key={i}>
                  <tr>
                    <td className={`${s.tac} ${s.rowDivider}`}>{L(row.division)}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(row.name)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.qty)}</td>
                    <td colSpan={2} className={`${s.tar} ${s.rowDivider}`}>{num(row.amount)}</td>
                  </tr>
                  <tr>
                    <td className={`${s.tac} ${s.rowDivider}`}>{row.date}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.price)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.fee)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.tax)}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>

          <h3 className={s.contTitSub} style={{ margin: '15px 0' }}>{L(tx.s6bTit)}</h3>
          <div className={s.tableMoreHeadWrap}>
            <span className={s.unit}>{L(tx.unitWon)}</span>
          </div>
          <table className={s.table5r1cTable}>
            <thead>
              <tr>
                <th>{L(tx.col5.period)}</th>
                <th>{L(tx.col5.totalInvested)}</th>
                <th>{L(tx.col5.totalRedeemed)}</th>
                <th>{L(tx.col5.profitLoss)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.mmw.map((row, i) => (
                <tr key={i}>
                  <td className={s.tac}>{row.from} ~ {row.to}</td>
                  <td className={s.tar}>{num(row.totalInvested)}</td>
                  <td className={s.tar}>{num(row.totalRedeemed)}</td>
                  <td className={s.tar}>{num(row.profitLoss)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              <li>
                {L(tx.mmwNote1)}
                <p style={{ fontSize: 13, fontWeight: 300, marginTop: 4 }}>{L(tx.mmwNote1.sub)}</p>
              </li>
              <li>{L(tx.mmwNote2)}</li>
            </ul>
          </div>
        </section>

        <section className={s.table2r1c} style={{ padding: '0 24px' }}>
          <h3 className={s.contTit}>{L(tx.s7Tit)}</h3>
          <table className={s.table2r1cTable} style={{ marginBottom: 15 }}>
            <colgroup><col style={{ width: '40%' }} /><col style={{ width: '60%' }} /></colgroup>
            <tbody>
              <tr><th>{L(tx.buyAmount)}</th><td>{num(sd.buyAmount)} 원</td></tr>
              <tr><th>{L(tx.sellAmount)}</th><td>{num(sd.sellAmount)} 원</td></tr>
            </tbody>
          </table>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '60%' }} /><col style={{ width: '40%' }} /></colgroup>
            <thead>
              <tr><th colSpan={2} className={s.tac}>{L(tx.turnoverTit)}</th></tr>
            </thead>
            <tbody>
              <tr>
                <th className={s.bdr}>{L(tx.currentPeriod)}</th>
                <td rowSpan={2} className={s.tac}>{sd.turnoverCurrent.toFixed(2)}</td>
              </tr>
              <tr><th className={s.bdr}>{sd.turnoverCurrentFrom} ~ {sd.turnoverCurrentTo}</th></tr>
              <tr>
                <th className={s.bdr}>{L(tx.cumulativePeriod)}</th>
                <td rowSpan={2} className={s.tac}>{sd.turnoverCumulative.toFixed(2)}</td>
              </tr>
              <tr><th className={s.bdr}>{sd.turnoverCumulativeFrom} ~ {sd.turnoverCumulativeTo}</th></tr>
            </tbody>
          </table>
          <div className={s.info}>
            <ul><li>{L(tx.turnoverFormula)}</li></ul>
          </div>
        </section>

        <section className={s.table5r1c} style={{ padding: '0 24px' }}>
          <div className={s.tableMoreHeadWrap}>
            <h3 className={s.contTit}>{L(tx.s8Tit)}</h3>
            <span className={s.unit}>{L(tx.unitWon)}</span>
          </div>
          <table className={s.table5r1cTable}>
            <thead>
              <tr>
                <th></th>
                <th>{L(tx.col6.period)}</th>
                <th>{L(tx.col6.withdrawal)}</th>
                <th>{L(tx.col6.balance)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.deposits.map((row) => (
                <tr key={row.month}>
                  <td className={s.tac}>{row.month}</td>
                  <td className={s.tar}>{num(row.deposit)}</td>
                  <td className={s.tar}>{num(row.withdrawal)}</td>
                  <td className={s.tar}>{num(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px' }}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s9Tit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{d.totalPrefix}{sd.rights.length}{d.totalSuffix}</p>
            <span className={s.unit}>{L(tx.unitWon)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col7.division)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col7.securityName)}</th>
                <th className={s.rowDivider}>{L(tx.col7.detailDivision)}</th>
                <th className={s.rowDivider}>{L(tx.col7.rightQty)}</th>
                <th className={s.rowDivider}>{L(tx.col7.amount)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col7.rightDetails)}</th>
                <th className={s.rowDivider}>{L(tx.col7.baseRate)}</th>
                <th className={s.rowDivider}>{L(tx.col7.taxes)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.rights.map((row, i) => (
                <Fragment key={i}>
                  <tr>
                    <td rowSpan={2} className={`${s.tac} ${s.rowDivider}`}>{L(row.division)}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(row.name)}</td>
                    <td className={`${s.tac} ${s.rowDivider}`}>{L(row.detailDivision)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.rightQty)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.amount)}</td>
                  </tr>
                  <tr>
                    <td className={`${s.tac} ${s.rowDivider}`}>{L(row.rightDetails)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{row.baseRate}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(row.taxes)}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.inner}>
          <div className={s.titBeforeNum}>10. {L(tx.s10Tit)}</div>
          <div className={s.txtBox}><p>{L(sd.riskExposure)}</p></div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s11Tit)}</h3>
          <div className={s.txtBox}><p>{L(tx.s11Text)}</p></div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s12Tit)}</h3>
          <div className={s.txtBox}><p>{L(sd.advisoryFirm)}</p></div>
        </section>

        <section className={s.table2r1c} style={{ padding: '0 24px' }}>
          <h3 className={s.contTit}>{L(tx.s13Tit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '40%' }} /><col style={{ width: '60%' }} /></colgroup>
            <tbody>
              {sd.feeHistory.map((row, i) => (
                <Fragment key={i}>
                  <tr><th>{L(tx.period)}</th><td>{row.from} ~ {row.to}</td></tr>
                  <tr><th>{L(tx.discretionaryFee)}</th><td>{num(row.discretionaryFee)} 원</td></tr>
                  <tr><th>{L(tx.performanceFee)}</th><td>{num(row.performanceFee)} 원</td></tr>
                  <tr><th>{L(tx.otherTradeCost)}</th><td>{num(row.otherTradeCost)} 원</td></tr>
                  <tr><th>{L(tx.taxes)}</th><td>{num(row.taxes)} 원</td></tr>
                  <tr><th>{L(tx.otherCost)}</th><td>{num(row.otherCost)} 원</td></tr>
                  <tr style={{ borderBottom: '1px solid #111' }}><th>{L(tx.totalCost)}</th><td>{num(row.totalCost)} 원</td></tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s14Tit)}</h3>
          <div className={s.txtBox}><p>{L(sd.wrapFeeBasis)}</p></div>
        </section>

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s15Tit)}</h3>
          <div className={s.txtBox}><p>{L(sd.performanceFeeBasis)}</p></div>
        </section>

        <section className={s.table3r1c} style={{ padding: '0 24px' }}>
          <h3 className={s.contTit}>{L(tx.s16Tit)}</h3>
          <table>
            <colgroup><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /><col style={{ width: '60%' }} /></colgroup>
            <tbody>
              {sd.personnel.map((p, i) => (
                <Fragment key={i}>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.position)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(p.position)}</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.name)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(p.name)}</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.mgmtStartDate)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{p.startDate}</td></tr>
                  <tr>
                    <th rowSpan={2} className={s.bdr}>{L(tx.otherContracts)}</th>
                    <th className={s.bdr}>{L(tx.contractCount)}</th>
                    <td className={s.tal} style={{ paddingLeft: 6 }}>{num(p.contractCount)}{L(tx.contractCountUnit)}</td>
                  </tr>
                  <tr>
                    <th className={s.bdr}>{L(tx.scale)}</th>
                    <td className={s.tal} style={{ paddingLeft: 6 }}>{num(p.scale)}{L(tx.scaleUnit)}</td>
                  </tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.career)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(p.career)}</td></tr>
                  <tr><th colSpan={2} className={s.bdr}>{L(tx.contact)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(p.contact)}</td></tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.table3r1c} style={{ padding: '0 24px' }}>
          <h3 className={s.contTit}>{L(tx.s17Tit)}</h3>
          <table>
            <colgroup><col style={{ width: '15%' }} /><col style={{ width: '25%' }} /><col style={{ width: '60%' }} /></colgroup>
            <tbody>
              <tr><th colSpan={2} className={s.bdr}>{L(tx.recommenderInfo)}</th><td className={s.tar}>{L(sd.recommenderInfo)}</td></tr>
              <tr><th colSpan={2} className={s.bdr}>{L(tx.contact)}</th><td className={s.tar}>{L(sd.recommenderContact)}</td></tr>
            </tbody>
          </table>
          <div className={s.txtBox}>
            <ul><li style={{ fontWeight: 500, color: '#111' }}>{L(tx.s17Note)}</li></ul>
          </div>
        </section>

        <section className={s.yearSign}>
          <p className={s.yearSignDateOnly}>{sd.signDate}</p>
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
