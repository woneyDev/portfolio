import { Fragment, useEffect, useRef, useState } from 'react';
import styles from './ShinhanMonthlyBalance.module.css';
import { feeRateText, sampleAccount } from './shinhanMonthlyBalanceData';
import { useLanguage } from '../../i18n/LanguageContext';
import logoH from '../../assets/jsp-demo/logo_h.png';
import logoF from '../../assets/jsp-demo/logo_f.png';
// TODO: "신한알파" 전용 아이콘 파일을 받으면 이걸로 교체 (지금은 챗봇 아이콘으로 임시 대체)
import shinhanAlphaIcon from '../../assets/jsp-demo/chatBotIcon.png';

// 새 창의 기본 크기(아이폰15 프로맥스)를 기준 삼아, 창을 늘리면 화면도 비례해서 커짐
const BASE_WIDTH = 430;

export default function ShinhanMonthlyBalance() {
  const { lang, t } = useLanguage();
  const d = t.shinhanDemo;
  const L = (field) => field[lang];
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);

  const [detail, setDetail] = useState(null); // { title, rows: [[label, value], ...] }
  const [toast, setToast] = useState('');
  const [balancesExpanded, setBalancesExpanded] = useState(false);

  const screenRef = useRef(null);
  const [scale, setScale] = useState(() => window.innerWidth / BASE_WIDTH);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => setScale(window.innerWidth / BASE_WIDTH);
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!screenRef.current) return undefined;
    const el = screenRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setNaturalHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(''), 1800);
  };

  const openBalanceDetail = (item) => {
    setDetail({
      title: L(item.name),
      rows: [
        [d.detail.product, L(item.type)],
        [d.detail.type, L(item.tradeType)],
        [d.detail.qty, item.qty.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')],
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
        [d.detail.unitsHeld, item.units.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')],
        [d.detail.evalBeforeTax, won(item.evalAmountBeforeTax)],
        [d.detail.netAssetTotal, won(item.netAssetTotal)],
        [d.detail.preTaxReturn, `${item.rateBeforeTax}%`],
        [d.detail.maturity, L(item.maturity)],
        [d.detail.legalNote, L(item.note)],
      ],
    });
  };

  const openTransactionDetail = (item) => {
    setDetail({
      title: L(item.name),
      rows: [
        [d.detail.date, item.date],
        [d.detail.tradeType, L(item.tradeType)],
        [d.detail.qty, item.qty.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')],
        [d.detail.unitPrice, won(item.price)],
        [d.detail.tradeAmount, won(item.amount)],
        [d.detail.fee, won(item.fee)],
        [d.detail.tax, won(item.tax)],
        [d.detail.changeAmount, won(item.changeAmount)],
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
  const visibleBalances = balancesExpanded ? acct.balances : acct.balances.slice(0, 3);

  return (
    <div className={styles.page}>
      <div
        className={styles.sizer}
        style={{ width: BASE_WIDTH * scale, height: naturalHeight * scale || undefined }}
      >
        <div
          ref={screenRef}
          className={styles.screen}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
        <header className={styles.topLogoArea}>
          <img className={styles.logoHeader} src={logoH} alt={d.logoAlt} />
        </header>

        <section className={styles.main}>
          <div className={styles.mainImg} />
          <div className={styles.inner}>
            <h2 className={styles.mainTit}>{d.screenName}</h2>
          </div>
        </section>

        <section className={styles.intro}>
          <div className={styles.introCard}>
            <div className={styles.introGreeting}>
              <span className={styles.name}>{d.greetingBefore}{L(acct.name)}</span>
              <span className={styles.suffix}>{d.greetingAfter}</span>
            </div>
            <table className={styles.introTable}>
              <colgroup>
                <col style={{ width: '30%' }} />
                <col style={{ width: '70%' }} />
              </colgroup>
              <tbody>
                <tr><th>{d.accountNumber}</th><td>{maskedAccountNo}</td></tr>
                <tr><th>{d.accountName}</th><td>{L(acct.name)}</td></tr>
                <tr><th>{d.balanceDate}</th><td>{L(acct.baseDate)}</td></tr>
                <tr><th>{d.period}</th><td>{L(acct.period)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.totalValue}>
          <h3 className={styles.totalValueTit}>{d.totalAssetValue}</h3>
          <p className={styles.totalValueNum}>{won(acct.totalValue)}</p>
        </section>

        <section className={styles.content}>
          <h3 className={styles.sectionTit}>{d.detailedValuation}</h3>

          <section className={styles.table2r1c}>
            <h3 className={styles.contTit}>{d.depositLoanStatus}</h3>
            <table className={styles.table2r1cTable}>
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
            <div className={styles.info}>
              <ul>
                <li>{d.depositNotes[0]}</li>
                <li>{d.depositNotes[1].replace('{feeRate}', L(feeRateText))}</li>
                <li>{d.depositNotes[2]}</li>
              </ul>
            </div>
          </section>

          <section className={styles.table2r1c}>
            <h3 className={styles.contTit}>{d.marginStatus}</h3>
            <table className={styles.table2r1cTable}>
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

          <section className={styles.tableMore}>
            <div className={styles.tableMoreHead}>
              <div className={styles.tableMoreHeadWrap}>
                <h3 className={styles.contTit}>{d.balanceStatus}</h3>
                <span className={styles.totalNum}>{d.totalPrefix}{acct.balances.length}{d.totalSuffix}</span>
              </div>
              <span className={styles.unit}>{d.unitWonPercent}</span>
            </div>
            <table className={styles.dataTable}>
              <colgroup><col /><col style={{ width: '15%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr>
                  <th rowSpan={2} className={styles.rowDivider}>{d.col.item}</th>
                  <th className={styles.rowDivider}>{d.col.product}</th>
                  <th className={styles.rowDivider}>{d.col.qty}</th>
                  <th className={styles.rowDivider}>{d.col.returnRate}</th>
                  <th rowSpan={2} className={`${styles.detailHeaderCell} ${styles.rowDivider}`}>{d.col.details}</th>
                </tr>
                <tr>
                  <th className={styles.rowDivider}>{d.col.type}</th>
                  <th className={styles.rowDivider}>{d.col.buyAmount}</th>
                  <th className={styles.rowDivider}>{d.col.evalAmount}</th>
                </tr>
              </thead>
              <tbody>
                {acct.balances.length === 0 ? (
                  <tr><td colSpan={5} className={styles.noResult}>{d.noResult}</td></tr>
                ) : visibleBalances.map((item) => (
                  <Fragment key={item.name.ko}>
                    <tr>
                      <td rowSpan={2} className={`${styles.tal} ${styles.rowDivider}`}>{L(item.name)}</td>
                      <td className={`${styles.tac} ${styles.rowDivider}`}>{L(item.type)}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.qty.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.rate}%</td>
                      <td rowSpan={2} className={`${styles.detailBtnCell} ${styles.rowDivider}`}>
                        <button type="button" className={styles.detailBtn} aria-label={d.col.details} onClick={() => openBalanceDetail(item)} />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.tac} ${styles.rowDivider}`}>{L(item.tradeType)}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.buyAmount.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.evalAmount.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            {acct.balances.length > 3 && (
              balancesExpanded ? (
                <button type="button" className={styles.lessBtn} onClick={() => setBalancesExpanded(false)}>{d.less}</button>
              ) : (
                <button type="button" className={styles.moreBtn} onClick={() => setBalancesExpanded(true)}>{d.more}</button>
              )
            )}
            {acct.balances.length > 0 && (
              <div className={styles.sumValue}>
                <h3 className={styles.sumValueTit}>{d.totalValuation}</h3>
                <p className={styles.sumValueNum}>{won(acct.balanceSum)}</p>
              </div>
            )}
            <div className={styles.info}>
              <ul>
                {d.balanceNotes.map((note) => (
                  <li key={note.text}>
                    {note.text}
                    {note.subItems && (
                      <ul className={styles.guideSubList}>
                        {note.subItems.map((sub) => <li key={sub}>{sub}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.tableMore}>
            <div className={styles.tableMoreHead}>
              <div className={styles.tableMoreHeadWrap}>
                <h3 className={styles.contTit}>{d.fundHoldingsStatus}</h3>
                <span className={styles.totalNum}>{d.totalPrefix}{acct.funds.length}{d.totalSuffix}</span>
              </div>
              <span className={styles.unit}>{d.unitUnitsWon}</span>
            </div>
            <table className={styles.dataTable}>
              <colgroup><col /><col style={{ width: '15%' }} /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr>
                  <th rowSpan={2} className={styles.rowDivider}>{d.col.fundName}</th>
                  <th rowSpan={2} className={styles.rowDivider}>{d.col.totalFeeRate}</th>
                  <th className={styles.rowDivider}>{d.col.unitsHeld}</th>
                  <th className={styles.rowDivider}>{d.col.purchasePrincipal}</th>
                  <th rowSpan={2} className={`${styles.detailHeaderCell} ${styles.rowDivider}`}>{d.col.details}</th>
                </tr>
                <tr>
                  <th className={styles.rowDivider}>{d.col.nav}</th>
                  <th className={styles.rowDivider}>{d.col.preTaxValuation}</th>
                </tr>
              </thead>
              <tbody>
                {acct.funds.length === 0 ? (
                  <tr><td colSpan={5} className={styles.noResult}>{d.noResult}</td></tr>
                ) : acct.funds.map((item) => (
                  <Fragment key={item.name.ko}>
                    <tr>
                      <td rowSpan={2} className={`${styles.tal} ${styles.rowDivider}`}>{L(item.name)}</td>
                      <td rowSpan={2} className={`${styles.tac} ${styles.rowDivider}`}>{item.feeRate}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.units.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.buyPrincipal.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td rowSpan={2} className={`${styles.detailBtnCell} ${styles.rowDivider}`}>
                        <button type="button" className={styles.detailBtn} aria-label={d.col.details} onClick={() => openFundDetail(item)} />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.basePrice.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.evalAmountBeforeTax.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            {acct.funds.length > 0 && (
              <div className={styles.sumValue}>
                <h3 className={styles.sumValueTit}>{d.totalValuation}</h3>
                <p className={styles.sumValueNum}>{won(acct.fundSum)}</p>
              </div>
            )}
            <div className={styles.info}>
              <ul>
                {d.fundNotes.map((note) => (
                  <li key={note.text}>
                    {note.text}
                    {note.subItems && (
                      <ul className={styles.guideSubList}>
                        {note.subItems.map((sub) => <li key={sub}>{sub}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.tableMore}>
            <div className={styles.tableMoreHead}>
              <div className={styles.tableMoreHeadWrap}>
                <h3 className={styles.contTit}>{d.transactionHistory}</h3>
                <span className={styles.totalNum}>{d.totalPrefix}{acct.transactions.length}{d.totalSuffix}</span>
              </div>
            </div>
            <table className={styles.dataTable}>
              <colgroup><col style={{ width: '15%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '25%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr>
                  <th rowSpan={2} className={styles.rowDivider}>{d.col.date}</th>
                  <th className={styles.rowDivider}>{d.col.securityName}</th>
                  <th className={styles.rowDivider}>{d.col.qty}</th>
                  <th rowSpan={2} className={styles.rowDivider}>{d.col.tradeAmount}</th>
                  <th rowSpan={2} className={`${styles.detailHeaderCell} ${styles.rowDivider}`}>{d.col.details}</th>
                </tr>
                <tr>
                  <th className={styles.rowDivider}>{d.col.tradeType}</th>
                  <th className={styles.rowDivider}>{d.col.unitPrice}</th>
                </tr>
              </thead>
              <tbody>
                {acct.transactions.length === 0 ? (
                  <tr><td colSpan={5} className={styles.noResult}>{d.noResult}</td></tr>
                ) : acct.transactions.map((item) => (
                  <Fragment key={`${item.date}-${item.name.ko}`}>
                    <tr>
                      <td rowSpan={2} className={`${styles.tac} ${styles.rowDivider}`}>{item.date}</td>
                      <td className={`${styles.tac} ${styles.rowDivider}`}>{L(item.name)}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.qty.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td rowSpan={2} className={`${styles.tar} ${styles.rowDivider}`}>{item.amount.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                      <td rowSpan={2} className={`${styles.detailBtnCell} ${styles.rowDivider}`}>
                        <button type="button" className={styles.detailBtn} aria-label={d.col.details} onClick={() => openTransactionDetail(item)} />
                      </td>
                    </tr>
                    <tr>
                      <td className={`${styles.tac} ${styles.rowDivider}`}>{L(item.tradeType)}</td>
                      <td className={`${styles.tar} ${styles.rowDivider}`}>{item.price.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            <div className={styles.info}>
              <ul>
                {d.transactionNotes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          </section>

          <section className={styles.tableMore}>
            <div className={styles.tableMoreHead}>
              <div className={styles.tableMoreHeadWrap}>
                <h3 className={styles.contTit}>{d.withholdingDetails}</h3>
                <span className={styles.totalNum}>{d.totalPrefix}{acct.withholdings.length}{d.totalSuffix}</span>
              </div>
              <span className={styles.unit}>{d.unitWon}</span>
            </div>
            <table className={styles.dataTable}>
              <colgroup><col style={{ width: '15%' }} /><col style={{ width: '20%' }} /><col /><col style={{ width: '20%' }} /><col style={{ width: '12%' }} /></colgroup>
              <thead>
                <tr className={styles.rowDivider}>
                  <th>{d.col.date}</th>
                  <th>{d.col.tradeType}</th>
                  <th>{d.col.securityName}</th>
                  <th>{d.col.taxableAmount}</th>
                  <th className={styles.detailHeaderCell}>{d.col.details}</th>
                </tr>
              </thead>
              <tbody>
                {acct.withholdings.length === 0 ? (
                  <tr><td colSpan={5} className={styles.noResult}>{d.noResult}</td></tr>
                ) : acct.withholdings.map((item) => (
                  <tr key={`${item.date}-${item.name.ko}`} className={styles.rowDivider}>
                    <td className={styles.tac}>{item.date}</td>
                    <td className={styles.tac}>{L(item.tradeType)}</td>
                    <td className={styles.tal}>{L(item.name)}</td>
                    <td className={styles.tar}>{item.taxBase.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')}</td>
                    <td className={styles.detailBtnCell}>
                      <button type="button" className={styles.detailBtn} aria-label={d.col.details} onClick={() => openWithholdingDetail(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.info}>
              <ul>
                {d.withholdingNotes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          </section>
        </section>

        <section className={styles.guide}>
          {d.guideSections.map((section) => (
            <div key={section.title}>
              <h3 className={styles.guideTit}>{section.title}</h3>
              <ul className={styles.guideCont}>
                {section.items.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={styles.btnArea}>
          <button type="button" className={styles.pdfBtn} onClick={() => showToast(d.toastPdf)}>
            {d.pdfDownload}
          </button>
          <p className={styles.infoRed}>{d.pdfPasswordNote}</p>
          <button type="button" className={styles.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {d.appLinkName}
          </button>
          <div className={styles.sectionBar} />
          <button type="button" className={styles.anotherApp} onClick={() => showToast(d.toastGeneric)}>
            {d.chatbotName}
          </button>
          <div className={styles.customer}>
            <button type="button" className={styles.customerBtn} onClick={() => showToast(d.toastGeneric)}>
              {d.customerCenter}
            </button>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.aiPromo}>
            <span className={styles.aiPromoLine1}>{d.aiPromoLine1}</span>
            <span className={styles.aiPromoLine2}>
              {d.aiPromoLine2}
              <img className={styles.aiPromoIcon} src={shinhanAlphaIcon} alt={d.aiPromoIconAlt} />
            </span>
          </div>
          <button type="button" className={styles.footerLogoBtn} onClick={() => showToast(d.toastGeneric)}>
            <img className={styles.logoFooter} src={logoF} alt={d.footerName} />
          </button>
        </footer>
        </div>
      </div>

      {detail && (
        <>
          <div className={styles.dark} onClick={() => setDetail(null)} />
          <div className={styles.detailModal} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
            <h3 className={styles.detailModalTit}>{detail.title}</h3>
            <table className={styles.detailModalTable}>
              <tbody>
                {detail.rows.map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className={styles.closeBtn} onClick={() => setDetail(null)}>{d.close}</button>
          </div>
        </>
      )}

      {toast && (
        <div className={styles.toast} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          {toast}
        </div>
      )}
    </div>
  );
}
