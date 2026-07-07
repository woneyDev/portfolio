import { Fragment, useState } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import DetailModal from '../shared/DetailModal';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './bbd002Data';

const s = sharedStyles;

export default function BBD002TrustQuarterlyReport() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [detail, setDetail] = useState(null);

  const openTradeDetail = (item) => setDetail({
    title: L(item.securityName),
    rows: [
      [L(tx.col2.fundCode), item.fundCode],
      [L(tx.col.fundName), L(item.fundName)],
      [L(tx.col.tradeDate), item.tradeDate],
      [L(tx.col.securityName), L(item.securityName)],
      [L(tx.col.tradeType), L(item.tradeType)],
      [d.detail.qty, num(item.qty)],
      [d.detail.unitPrice, won(item.price)],
      [L(tx.col.tradeAmount), won(item.tradeAmount)],
      [d.detail.tax, won(item.tax)],
    ],
  });

  const openFlowDetail = (item) => setDetail({
    title: L(item.fundName),
    rows: [
      [L(tx.col3.tradeDate), item.tradeDate],
      [L(tx.col2.fundCode), item.fundCode],
      [L(tx.col.fundName), L(item.fundName)],
      [L(tx.col3.depositAmount), won(item.deposit)],
      [L(tx.col3.withdrawalAmount), won(item.withdrawal)],
      [d.detail.fee, won(item.fee)],
      [d.detail.tax, won(item.tax)],
      [L(tx.col3.note), L(item.note)],
    ],
  });

  const openPerformanceDetail = (item) => setDetail({
    title: L(item.fundName),
    rows: [
      [L(tx.col2.fundCode), item.fundCode],
      [L(tx.col.fundName), L(item.fundName)],
      [L(tx.col4.m3), `${item.m3} %`],
      [L(tx.col4.m6), `${item.m6} %`],
      [L(tx.col4.m9), `${item.m9} %`],
      [L(tx.col4.m12), `${item.m12} %`],
      [L(tx.col4.cumulative), `${item.cumulative} %`],
      [d.detail.riskGrade ?? '상품위험등급', L(item.riskGrade)],
      [L(tx.col.fundName), L(item.evalMethod)],
    ],
  });

  const openHoldingDetail = (item) => setDetail({
    title: L(item.securityName),
    rows: [
      [L(tx.col2.fundCode), item.fundCode],
      [L(tx.col5.fundName), L(item.fundName)],
      [L(tx.col5.division), L(item.division)],
      [L(tx.col5.securityName), L(item.securityName)],
      [d.detail.qty, num(item.qty)],
      [d.detail.buyAmount, won(item.buyPrice)],
      [d.detail.evalAmount, won(item.marketPrice)],
      [L(tx.col5.holdingBalance), won(item.holdingBalance)],
      [L(tx.col5.holdingWeight), `${item.holdingWeight} %`],
    ],
  });

  const openFeeDetail = (item) => setDetail({
    title: L(item.fundName),
    rows: [
      [L(tx.col2.fundCode), item.fundCode],
      [L(tx.col6.fundName), L(item.fundName)],
      [L(tx.col6.trustFee), won(item.trustFee)],
      [L(tx.col6.performanceFee), won(item.performanceFee)],
      [d.detail.fee, won(item.tradeCommission)],
      [L(tx.col6.tax), won(item.tax)],
      [d.detail.totalFeeRate ?? '보수율', `${item.feeRate} %`],
      [L(tx.col6.totalCost), won(item.totalCost)],
    ],
  });

  const openPersonnelDetail = (item) => setDetail({
    title: L(item.name),
    rows: [
      [L(tx.col7.position), L(item.position)],
      [L(tx.col7.name), L(item.name)],
      [L(tx.col7.mgmtStartDate), item.mgmtStartDate],
      [L(tx.col7.contractCount), `${num(item.contractCount)} 건`],
      [L(tx.col7.scale), `${num(item.scale)} 백만원`],
      [d.detail.legalNote ?? '주요 경력', L(item.career)],
      [d.contact ?? '연락처', L(item.contact)],
    ],
  });

  const openAdminDetail = (item) => setDetail({
    title: L(item.name),
    rows: [
      [L(tx.col2.fundCode), item.fundCode],
      [L(tx.col8.fundName), L(item.fundName)],
      [L(tx.col8.branch), L(item.branch)],
      [L(tx.col8.position), L(item.position)],
      [L(tx.col8.name), L(item.name)],
      [L(tx.col8.contact), L(item.contact)],
    ],
  });

  const maskedAccountNo = `${sd.accountNo.slice(0, 3)}-${sd.accountNo.slice(3, 5)}-***${sd.accountNo.slice(8, 11)}`;

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={`${s.main} ${s.mainShort}`}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>{L(tx.screenName)}</h2>
          </div>
        </section>

        <section className={s.inner} style={{ marginTop: 25 }}>
          <h3 className={s.contTit}>{L(tx.s1Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s1aTit)}</h3>
          <div className={s.tableLR}>
            <table>
              <colgroup><col style={{ width: '40%' }} /><col style={{ width: '60%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.contractor)}</th><td>{L(sd.contractor)}</td></tr>
                <tr><th>{L(tx.productName)}</th><td>{L(sd.productName)}</td></tr>
                <tr><th>{L(tx.accountNo)}</th><td>{maskedAccountNo}</td></tr>
                <tr><th>{L(tx.firstContractDate)}</th><td>{sd.firstContractDate}</td></tr>
                <tr><th>{L(tx.investPeriod)}</th><td>{L(sd.investPeriod)}</td></tr>
                <tr><th>{L(tx.infoBaseDate)}</th><td>{sd.infoBaseDate}</td></tr>
              </tbody>
            </table>
          </div>
          <div className={s.info}><ul><li>{L(tx.s1aNote)}</li></ul></div>

          <section className={s.table2r1c} style={{ marginTop: 15 }}>
            <h3 className={s.contTitSub} style={{ marginBottom: 17 }}>{L(tx.s1bTit)}</h3>
            <table className={s.table2r1cTable}>
              <colgroup><col style={{ width: '55%' }} /><col style={{ width: '45%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.principal)}</th><td>{won(sd.principal)}</td></tr>
                <tr><th>{L(tx.withdrawal)}</th><td>{won(sd.withdrawal)}</td></tr>
                <tr><th>{L(tx.trustBalance)}</th><td>{won(sd.trustBalance)}</td></tr>
                <tr><th>{L(tx.fees)}</th><td>{won(sd.fees)}</td></tr>
                <tr><th>{L(tx.prepaidTax)}</th><td>{won(sd.prepaidTax)}</td></tr>
                <tr><th>{L(tx.valuation)}</th><td>{won(sd.valuation)}</td></tr>
                <tr><th>{L(tx.cumulativeReturn)}</th><td>{sd.cumulativeReturn} %</td></tr>
                <tr><th>{L(tx.annualizedReturn)}</th><td>{sd.annualizedReturn} %</td></tr>
                <tr><th>{L(tx.terminationFeeTax)}</th><td>{won(sd.terminationFeeTax)}</td></tr>
                <tr><th>{L(tx.expectedTermination)}</th><td>{won(sd.expectedTermination)}</td></tr>
              </tbody>
            </table>
            <div className={s.info}>
              <ul>
                <li>{L(tx.s1bNote1)}</li>
                <li>{L(tx.s1bNote2)}</li>
              </ul>
            </div>
          </section>
        </section>

        <div className={s.sectionBar} />

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s2Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s2aTit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 25 }}><p>{L(sd.investTendency)}</p></div>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s2bTit)}</h3>
          <div className={s.txtBox}><p>{L(sd.restrictions)}</p></div>
        </section>

        <div className={s.sectionBar} />

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s3Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s3aTit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 25 }}><p>{L(sd.strategy)}</p></div>

          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s3bTit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.fundTrades.length}{L(tx.totalSuffix)}</p>
            <span className={s.unit}>{L(tx.unitWonSharesUnits)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '20%' }} /><col /><col style={{ width: '18%' }} /><col style={{ width: '22%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col.tradeDate)}</th>
                <th className={s.rowDivider}>{L(tx.col.securityName)}</th>
                <th className={s.rowDivider}>{L(tx.col.tradeType)}</th>
                <th className={s.rowDivider}>{L(tx.col.tradeAmount)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.fundTrades.length === 0 ? (
                <tr><td colSpan={6} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.fundTrades.map((item, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(item.fundName)}</td>
                  <td className={s.tac}>{item.tradeDate}</td>
                  <td className={s.tal}>{L(item.securityName)}</td>
                  <td className={s.tac}>{L(item.tradeType)}</td>
                  <td className={s.tar}>{num(item.tradeAmount)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col.details)} onClick={() => openTradeDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}><ul><li>{L(tx.s3bNote)}</li></ul></div>

          <h3 className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.s3cTit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.turnover.length}{L(tx.totalSuffix)}</p>
            <span className={s.unit}>{L(tx.unitWonPercent)}</span>
          </div>
          <table className={s.table5r1cTable}>
            <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '18%' }} /><col style={{ width: '18%' }} /><col style={{ width: '18%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2}>{L(tx.col2.fundCode)}</th>
                <th rowSpan={2}>{L(tx.col2.fundName)}</th>
                <th>{L(tx.col2.buyAmount)}</th>
                <th colSpan={2}>{L(tx.col2.turnover)}</th>
              </tr>
              <tr>
                <th>{L(tx.col2.sellAmount)}</th>
                <th>{L(tx.col2.currentPeriod)}</th>
                <th>{L(tx.col2.cumulativePeriod)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.turnover.map((item, i) => (
                <Fragment key={i}>
                  <tr>
                    <td rowSpan={2} className={s.tac}>{item.fundCode}</td>
                    <td rowSpan={2} className={s.tal}>{L(item.fundName)}</td>
                    <td className={s.tar}>{num(item.buyAmount)}</td>
                    <td rowSpan={2} className={s.tar}>{item.currentTurnover}</td>
                    <td rowSpan={2} className={s.tar}>{item.cumulativeTurnover}</td>
                  </tr>
                  <tr>
                    <td className={`${s.tar} ${s.bdr}`}>{num(item.sellAmount)}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              <li>{L(tx.s3cNote1)}<p style={{ fontSize: 13, fontWeight: 300 }}>{L(tx.s3cNote2)}</p></li>
              <li>{L(tx.s3cNote3)} ({L(sd.turnoverPeriod)})</li>
              <li>{L(tx.s3cNote4)}</li>
            </ul>
          </div>

          <h3 className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.s3dTit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.fundFlows.length}{L(tx.totalSuffix)}</p>
            <span className={s.unit}>{L(tx.unitWon)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '18%' }} /><col /><col style={{ width: '18%' }} /><col style={{ width: '15%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.tradeDate)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col3.depositAmount)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col3.note)}</th>
                <th rowSpan={2} className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col3.details)}</th>
              </tr>
              <tr><th className={s.rowDivider}>{L(tx.col3.withdrawalAmount)}</th></tr>
            </thead>
            <tbody>
              {sd.fundFlows.length === 0 ? (
                <tr><td colSpan={5} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.fundFlows.map((item, i) => (
                <Fragment key={i}>
                  <tr>
                    <td rowSpan={2} className={`${s.tac} ${s.rowDivider}`}>{item.tradeDate}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(item.fundName)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(item.deposit)}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(item.note)}</td>
                    <td rowSpan={2} className={`${s.detailBtnCell} ${s.rowDivider}`}>
                      <button type="button" className={s.detailBtn} aria-label={L(tx.col3.details)} onClick={() => openFlowDetail(item)} />
                    </td>
                  </tr>
                  <tr><td className={`${s.tar} ${s.rowDivider}`}>{num(item.withdrawal)}</td></tr>
                </Fragment>
              ))}
            </tbody>
          </table>

          <h3 className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.s3eTit)}</h3>
          <p className={s.noResult}>{L(tx.s3eNoResult)}</p>

          <h3 className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.s3fTit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 25 }}><p>{L(sd.riskExposure)}</p></div>

          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s3gTit)}</h3>
          <div className={s.txtBox}><p>{L(tx.s3gText)}</p></div>
        </section>

        <div className={s.sectionBar} />

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s4Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s4aTit)}</h3>
          <span className={s.unit}>{L(tx.unitPercent)}</span>
          <table className={s.table5r1cTable}>
            <colgroup><col /><col style={{ width: '14%' }} /><col style={{ width: '14%' }} /><col style={{ width: '14%' }} /><col style={{ width: '14%' }} /><col style={{ width: '14%' }} /></colgroup>
            <thead>
              <tr>
                <th>{L(tx.col4.fundName)}</th>
                <th>{L(tx.col4.m3)}</th>
                <th>{L(tx.col4.m6)}</th>
                <th>{L(tx.col4.m9)}</th>
                <th>{L(tx.col4.m12)}</th>
                <th>{L(tx.col4.cumulative)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.performance.map((item, i) => (
                <tr key={i}>
                  <td className={s.tac}>{L(item.fundName)}</td>
                  <td className={s.tar}>{item.m3}</td>
                  <td className={s.tar}>{item.m6}</td>
                  <td className={s.tar}>{item.m9}</td>
                  <td className={s.tar}>{item.m12}</td>
                  <td className={s.tar}>{item.cumulative}</td>
                </tr>
              ))}
              <tr className={s.tdSum}>
                <td className={s.tac}>{L(tx.benchmarkReturn)}</td>
                <td className={s.tar}>{sd.benchmark.m3}</td>
                <td className={s.tar}>{sd.benchmark.m6}</td>
                <td className={s.tar}>{sd.benchmark.m9}</td>
                <td className={s.tar}>{sd.benchmark.m12}</td>
                <td className={s.tar}>{sd.benchmark.cumulative}</td>
              </tr>
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              <li>{L(tx.s4aNote1)}</li>
              <li>{L(tx.s4aNote2)}</li>
            </ul>
          </div>

          <h3 className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.s4bTit)}</h3>
          <div className={s.numunitflex}>
            <p className={s.totalNum}>{L(tx.totalPrefix)}{sd.holdings.length}{L(tx.totalSuffix)}</p>
            <span className={s.unit}>{L(tx.unitWonPercent)}</span>
          </div>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '15%' }} /><col /><col style={{ width: '18%' }} /><col style={{ width: '14%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col5.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col5.division)}</th>
                <th className={s.rowDivider}>{L(tx.col5.securityName)}</th>
                <th className={s.rowDivider}>{L(tx.col5.holdingBalance)}</th>
                <th className={s.rowDivider}>{L(tx.col5.holdingWeight)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col5.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.holdings.map((item, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(item.fundName)}</td>
                  <td className={s.tac}>{L(item.division)}</td>
                  <td className={s.tal}>{L(item.securityName)}</td>
                  <td className={s.tac}>{num(item.holdingBalance)}</td>
                  <td className={s.tar}>{item.holdingWeight}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col5.details)} onClick={() => openHoldingDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.sumValue} style={{ marginTop: 15 }}>
            <h3 className={s.sumValueTit}>{L(tx.holdingSum)}</h3>
            <p className={s.sumValueNum}>{won(sd.holdingSum)}</p>
          </div>
        </section>

        <div className={s.sectionBar} />

        <section className={s.inner}>
          <h3 className={s.contTit}>{L(tx.s5Tit)}</h3>
          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s5aTit)}</h3>

          <p className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.currentPeriodTit)} <span style={{ color: '#888', fontSize: 12 }}>{L(sd.turnoverPeriod)}</span></p>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '20%' }} /><col style={{ width: '18%' }} /><col style={{ width: '15%' }} /><col style={{ width: '18%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col6.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col6.trustFee)}</th>
                <th className={s.rowDivider}>{L(tx.col6.performanceFee)}</th>
                <th className={s.rowDivider}>{L(tx.col6.tax)}</th>
                <th className={s.rowDivider}>{L(tx.col6.totalCost)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col6.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.feesCurrent.map((item, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(item.fundName)}</td>
                  <td className={s.tar}>{num(item.trustFee)}</td>
                  <td className={s.tar}>{num(item.performanceFee)}</td>
                  <td className={s.tar}>{num(item.tax)}</td>
                  <td className={s.tar}>{num(item.totalCost)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col6.details)} onClick={() => openFeeDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}><ul><li>{L(tx.s5aNote)}</li></ul></div>

          <p className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.cumulativePeriodTit)}</p>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '20%' }} /><col style={{ width: '18%' }} /><col style={{ width: '15%' }} /><col style={{ width: '18%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col6.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col6.trustFee)}</th>
                <th className={s.rowDivider}>{L(tx.col6.performanceFee)}</th>
                <th className={s.rowDivider}>{L(tx.col6.tax)}</th>
                <th className={s.rowDivider}>{L(tx.col6.totalCost)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col6.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.feesCumulative.map((item, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(item.fundName)}</td>
                  <td className={s.tar}>{num(item.trustFee)}</td>
                  <td className={s.tar}>{num(item.performanceFee)}</td>
                  <td className={s.tar}>{num(item.tax)}</td>
                  <td className={s.tar}>{num(item.totalCost)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col6.details)} onClick={() => openFeeDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className={s.contTitSub} style={{ margin: '15px 0 10px' }}>{L(tx.s5bTit)}</h3>
          <div className={s.txtBox} style={{ marginBottom: 25 }}><p>{L(sd.trustFeeBasis)}</p></div>

          <h3 className={s.contTitSub} style={{ marginBottom: 10 }}>{L(tx.s5cTit)}</h3>
          <div className={s.txtBox}><p>{L(sd.performanceFeeBasis)}</p></div>
        </section>

        <div className={s.sectionBar} />

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s6Tit)}</h3>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '15%' }} /><col style={{ width: '15%' }} /><col style={{ width: '20%' }} /><col style={{ width: '18%' }} /><col style={{ width: '20%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col7.position)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col7.name)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col7.mgmtStartDate)}</th>
                <th className={s.rowDivider}>{L(tx.col7.contractCount)}</th>
                <th rowSpan={2} className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col7.details)}</th>
              </tr>
              <tr><th className={s.rowDivider}>{L(tx.col7.scale)}</th></tr>
            </thead>
            <tbody>
              {sd.personnel.map((item, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tac}>{L(item.position)}</td>
                  <td className={s.tac}>{L(item.name)}</td>
                  <td className={s.tac}>{item.mgmtStartDate}</td>
                  <td className={s.tar}>{num(item.contractCount)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col7.details)} onClick={() => openPersonnelDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className={s.sectionBar} />

        <section className={s.inner}>
          <h3 className={s.contTit} style={{ marginBottom: 15 }}>{L(tx.s7Tit)}</h3>
          <table className={s.dataTable}>
            <colgroup><col /><col style={{ width: '18%' }} /><col style={{ width: '14%' }} /><col style={{ width: '14%' }} /><col style={{ width: '18%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col8.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col8.branch)}</th>
                <th className={s.rowDivider}>{L(tx.col8.position)}</th>
                <th className={s.rowDivider}>{L(tx.col8.name)}</th>
                <th className={s.rowDivider}>{L(tx.col8.contact)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col8.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.administrators.map((item, i) => (
                <tr key={i} className={s.rowDivider}>
                  <td className={s.tal}>{L(item.fundName)}</td>
                  <td className={s.tac}>{L(item.branch)}</td>
                  <td className={s.tac}>{L(item.position)}</td>
                  <td className={s.tac}>{L(item.name)}</td>
                  <td className={s.tac}>{L(item.contact)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col8.details)} onClick={() => openAdminDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className={s.sectionBar} />

        <section className={s.guide}>
          <div>
            <h3 className={s.guideTit}>{L(tx.s8Tit)}</h3>
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

      <DetailModal detail={detail} onClose={() => setDetail(null)} scale={scale} closeLabel={d.close} />
      <Toast message={toast} scale={scale} />
    </>
  );
}
