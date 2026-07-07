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
import { sampleAccount } from './aaa003Data';

const s = sharedStyles;

export default function AAA003HalfYearBalance() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => field[lang];
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const locale = lang === 'ko' ? 'ko-KR' : 'en-US';

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [detail, setDetail] = useState(null);

  const openBalanceDetail = (item) => {
    setDetail({
      title: L(item.name),
      rows: [
        [d.detail.product, L(item.type)],
        [d.detail.type, L(item.tradeType)],
        [d.detail.qty, item.qty.toLocaleString(locale)],
        [d.detail.buyAmount, won(item.buyAmount)],
        [d.detail.evalAmount, won(item.evalAmount)],
        [d.detail.profitLoss, won(item.profitLoss)],
        [d.detail.returnRate, `${item.rate}%`],
      ],
    });
  };

  const openFundDetail = (item) => {
    setDetail({
      title: L(item.name),
      rows: [
        [d.detail.fundSeqNo, item.seqNo],
        [d.detail.totalFeeRate, `${item.feeRate}%`],
        [d.detail.purchasePrincipal, won(item.buyPrincipal)],
        [d.detail.nav, won(item.basePrice)],
        [d.detail.originalPrincipal, won(item.originalPrincipal)],
        [d.detail.unitsHeld, item.units.toLocaleString(locale)],
        [d.detail.evalBeforeTax, won(item.evalAmountBeforeTax)],
        [d.detail.netAssetTotal, won(item.netAssetTotal)],
        [d.detail.preTaxReturn, `${item.rateBeforeTax}%`],
        [d.detail.maturity, L(item.maturity)],
        [d.detail.legalNote, L(item.note)],
      ],
    });
  };

  const openWithholdingDetail = (item) => {
    setDetail({
      title: L(item.name),
      rows: [
        [d.detail.date, item.date],
        [d.detail.tradeType, L(item.tradeType)],
        [d.detail.taxableAmount, won(item.taxBase)],
        [d.detail.corporateTax, won(item.corporateTax)],
        [d.detail.localTax, won(item.localTax)],
        [d.detail.specialTax, won(item.specialTax)],
        [d.detail.foreignTax, won(item.foreignTax)],
        [d.detail.total, won(item.total)],
      ],
    });
  };

  const acct = sampleAccount;
  const maskedAccountNo = `${acct.accountNo.slice(0, 3)}-${acct.accountNo.slice(3, 5)}-***${acct.accountNo.slice(8, 11)}`;
  const screenName = lang === 'ko' ? '반기잔고 현황' : 'Semi-Annual Balance Status';

  return (
    <>
      <DemoScreenShell screenRef={screenRef} scale={scale} naturalHeight={naturalHeight}>
        <DemoHeader alt={d.logoAlt} />

        <section className={s.main}>
          <div className={s.mainImg} />
          <div className={s.inner}>
            <h2 className={s.mainTit}>{screenName}</h2>
          </div>
        </section>

        <section className={s.intro}>
          <div className={s.introCard}>
            <div className={s.introGreeting}>
              <span className={s.name}>{d.greetingBefore}{L(acct.name)}</span>
              <span className={s.suffix}>{d.greetingAfter}</span>
            </div>
            <table className={s.introTable}>
              <colgroup><col style={{ width: '30%' }} /><col style={{ width: '70%' }} /></colgroup>
              <tbody>
                <tr><th>{d.accountNumber}</th><td>{maskedAccountNo}</td></tr>
                <tr><th>{d.accountName}</th><td>{L(acct.name)}</td></tr>
                <tr><th>{d.balanceDate}</th><td>{L(acct.baseDate)}</td></tr>
                <tr><th>{d.period}</th><td>{L(acct.period)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.totalValue}>
          <h3 className={s.totalValueTit}>{d.totalAssetValue}</h3>
          <p className={s.totalValueNum}>{won(acct.totalValue)}</p>
        </section>

        <section className={s.content}>
          <h3 className={s.sectionTit}>{d.detailedValuation}</h3>

          <section className={s.table2r1c}>
            <h3 className={s.contTit}>{d.depositLoanStatus}</h3>
            <table className={s.table2r1cTable}>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{d.deposit.entrustment}</th><td>{won(acct.deposit.entrustment)}</td></tr>
                <tr><th>{d.deposit.futuresOption}</th><td>{won(acct.deposit.futuresOption)}</td></tr>
                <tr><th>{d.deposit.savingsAccount}</th><td>{won(acct.deposit.savingsAccount)}</td></tr>
                <tr><th>{d.deposit.overseasFxMargin}</th><td>{won(acct.deposit.overseasFxMargin)}</td></tr>
                <tr><th>{d.deposit.foreignCurrency}</th><td>{won(acct.deposit.foreignCurrency)}</td></tr>
                <tr><th>{d.deposit.subscription}</th><td>{won(acct.deposit.subscription)}</td></tr>
                <tr><th>{d.deposit.spot}</th><td>{won(acct.deposit.spot)}</td></tr>
                <tr><th>{d.deposit.unpaid}</th><td>{won(acct.deposit.unpaid)}</td></tr>
                <tr><th>{d.deposit.rightsLimited}</th><td>{won(acct.deposit.rightsLimited)}</td></tr>
                <tr><th>{d.deposit.creditCollateral}</th><td>{won(acct.deposit.creditCollateral)}</td></tr>
                <tr><th>{d.deposit.loan}</th><td>{won(acct.deposit.loan)}</td></tr>
              </tbody>
            </table>
            {/* 반기잔고현황은 원본상 예수금 안내문구가 1줄만 존재(이용료율/계정과목 문구 없음) */}
            <div className={s.info}>
              <ul>
                <li>{d.depositNoteBankZero}</li>
              </ul>
            </div>
          </section>

          <section className={s.table2r1c}>
            <h3 className={s.contTit}>{d.marginStatus}</h3>
            <table className={s.table2r1cTable}>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{d.margin.totalDeposit}</th><td>{won(acct.margin.totalDeposit)}</td></tr>
                <tr><th>{d.margin.entrustmentMargin}</th><td>{won(acct.margin.entrustmentMargin)}</td></tr>
                <tr><th>{d.margin.additionalMargin}</th><td>{won(acct.margin.additionalMargin)}</td></tr>
                <tr><th>{d.margin.maintenanceMargin}</th><td>{won(acct.margin.maintenanceMargin)}</td></tr>
                <tr><th>{d.margin.additionalMarginCash}</th><td>{won(acct.margin.additionalMarginCash)}</td></tr>
              </tbody>
            </table>
          </section>

          <section className={s.tableMore}>
            <div className={s.tableMoreHead}>
              <div className={s.tableMoreHeadWrap}>
                <h3 className={s.contTit}>{d.balanceStatus}</h3>
                <span className={s.totalNum}>{d.totalPrefix}{acct.balances.length}{d.totalSuffix}</span>
              </div>
              <span className={s.unit}>{d.unitWonPercent}</span>
            </div>
            <table className={s.dataTable}>
              <colgroup><col /><col style={{ width: '15%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr>
                  <th rowSpan={2} className={s.rowDivider}>{d.col.item}</th>
                  <th className={s.rowDivider}>{d.col.product}</th>
                  <th className={s.rowDivider}>{d.col.qty}</th>
                  <th className={s.rowDivider}>{d.col.returnRate}</th>
                  <th rowSpan={2} className={`${s.detailHeaderCell} ${s.rowDivider}`}>{d.col.details}</th>
                </tr>
                <tr>
                  <th className={s.rowDivider}>{d.col.type}</th>
                  <th className={s.rowDivider}>{d.col.buyAmount}</th>
                  <th className={s.rowDivider}>{d.col.evalAmount}</th>
                </tr>
              </thead>
              <tbody>
                {acct.balances.length === 0 ? (
                  <tr><td colSpan={5} className={s.noResult}>{d.noResult}</td></tr>
                ) : acct.balances.map((item) => (
                  <Fragment key={item.name.ko}>
                    <tr>
                      <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(item.name)}</td>
                      <td className={`${s.tac} ${s.rowDivider}`}>{L(item.type)}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.qty.toLocaleString(locale)}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.rate}%</td>
                      <td rowSpan={2} className={`${s.detailBtnCell} ${s.rowDivider}`}>
                        <button type="button" className={s.detailBtn} aria-label={d.col.details} onClick={() => openBalanceDetail(item)} />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${s.tac} ${s.rowDivider}`}>{L(item.tradeType)}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.buyAmount.toLocaleString(locale)}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.evalAmount.toLocaleString(locale)}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            {acct.balances.length > 0 && (
              <div className={s.sumValue}>
                <h3 className={s.sumValueTit}>{d.totalValuation}</h3>
                <p className={s.sumValueNum}>{won(acct.balanceSum)}</p>
              </div>
            )}
            <div className={s.info}>
              <ul>
                {d.balanceNotes.map((note) => (
                  <li key={note.text}>
                    {note.text}
                    {note.subItems && (
                      <ul className={s.guideSubList}>
                        {note.subItems.map((sub) => <li key={sub}>{sub}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={s.tableMore}>
            <div className={s.tableMoreHead}>
              <div className={s.tableMoreHeadWrap}>
                <h3 className={s.contTit}>{d.fundHoldingsStatus}</h3>
                <span className={s.totalNum}>{d.totalPrefix}{acct.funds.length}{d.totalSuffix}</span>
              </div>
              <span className={s.unit}>{d.unitUnitsWon}</span>
            </div>
            <table className={s.dataTable}>
              <colgroup><col /><col style={{ width: '15%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr>
                  <th rowSpan={2} className={s.rowDivider}>{d.col.fundName}</th>
                  <th rowSpan={2} className={s.rowDivider}>{d.col.totalFeeRate}</th>
                  <th className={s.rowDivider}>{d.col.unitsHeld}</th>
                  <th className={s.rowDivider}>{d.col.purchasePrincipal}</th>
                  <th rowSpan={2} className={`${s.detailHeaderCell} ${s.rowDivider}`}>{d.col.details}</th>
                </tr>
                <tr>
                  <th className={s.rowDivider}>{d.col.nav}</th>
                  <th className={s.rowDivider}>{d.col.preTaxValuation}</th>
                </tr>
              </thead>
              <tbody>
                {acct.funds.length === 0 ? (
                  <tr><td colSpan={5} className={s.noResult}>{d.noResult}</td></tr>
                ) : acct.funds.map((item) => (
                  <Fragment key={item.name.ko}>
                    <tr>
                      <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(item.name)}</td>
                      <td rowSpan={2} className={`${s.tac} ${s.rowDivider}`}>{item.feeRate}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.units.toLocaleString(locale)}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.buyPrincipal.toLocaleString(locale)}</td>
                      <td rowSpan={2} className={`${s.detailBtnCell} ${s.rowDivider}`}>
                        <button type="button" className={s.detailBtn} aria-label={d.col.details} onClick={() => openFundDetail(item)} />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.basePrice.toLocaleString(locale)}</td>
                      <td className={`${s.tar} ${s.rowDivider}`}>{item.evalAmountBeforeTax.toLocaleString(locale)}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            {acct.funds.length > 0 && (
              <div className={s.sumValue}>
                <h3 className={s.sumValueTit}>{d.totalValuation}</h3>
                <p className={s.sumValueNum}>{won(acct.fundSum)}</p>
              </div>
            )}
            <div className={s.info}>
              <ul>
                {d.fundNotes.map((note) => (
                  <li key={note.text}>
                    {note.text}
                    {note.subItems && (
                      <ul className={s.guideSubList}>
                        {note.subItems.map((sub) => <li key={sub}>{sub}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={s.tableMore}>
            <div className={s.tableMoreHead}>
              <div className={s.tableMoreHeadWrap}>
                <h3 className={s.contTit}>{d.withholdingDetails}</h3>
                <span className={s.totalNum}>{d.totalPrefix}{acct.withholdings.length}{d.totalSuffix}</span>
              </div>
              <span className={s.unit}>{d.unitWon}</span>
            </div>
            <table className={s.dataTable}>
              <colgroup><col style={{ width: '15%' }} /><col style={{ width: '20%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr className={s.rowDivider}>
                  <th>{d.col.date}</th>
                  <th>{d.col.tradeType}</th>
                  <th>{d.col.securityName}</th>
                  <th>{d.col.taxableAmount}</th>
                  <th className={s.detailHeaderCell}>{d.col.details}</th>
                </tr>
              </thead>
              <tbody>
                {acct.withholdings.length === 0 ? (
                  <tr><td colSpan={5} className={s.noResult}>{d.noResult}</td></tr>
                ) : acct.withholdings.map((item) => (
                  <tr key={`${item.date}-${item.name.ko}`} className={s.rowDivider}>
                    <td className={s.tac}>{item.date}</td>
                    <td className={s.tac}>{L(item.tradeType)}</td>
                    <td className={s.tal}>{L(item.name)}</td>
                    <td className={s.tar}>{item.taxBase.toLocaleString(locale)}</td>
                    <td className={s.detailBtnCell}>
                      <button type="button" className={s.detailBtn} aria-label={d.col.details} onClick={() => openWithholdingDetail(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={s.info}>
              <ul>
                {d.withholdingNotes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          </section>
        </section>

        <section className={s.guide}>
          {d.guideSections.map((section) => (
            <div key={section.title}>
              <h3 className={s.guideTit}>{section.title}</h3>
              <ul className={s.guideCont}>
                {section.items.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          ))}
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
