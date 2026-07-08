import { Fragment, useState } from 'react';
import sharedStyles from '../shared/demoShared.module.css';
import DemoScreenShell from '../shared/DemoScreenShell';
import DemoHeader from '../shared/DemoHeader';
import DemoFooter from '../shared/DemoFooter';
import Toast from '../shared/Toast';
import { useScaledWindow } from '../shared/useScaledWindow';
import { useToast } from '../shared/useToast';
import { useLanguage } from '../../../i18n/LanguageContext';
import { text as tx, sampleData as sd } from './mmwCmaReportData';

const s = sharedStyles;

function MultiLine({ text }) {
  return text.split('\n').map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

export default function MmwCmaReportScreen() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [termExpanded, setTermExpanded] = useState(false);

  const visibleTermReturns = termExpanded ? sd.termReturns : sd.termReturns.slice(0, 3);
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
            <div className={s.introGreeting}>
              <span className={s.name}>{L(sd.customerName)}</span>
              <span className={s.suffix}>{L(tx.greetingAfter)}</span>
            </div>
            <table className={s.introTable}>
              <colgroup><col style={{ width: '35%' }} /><col style={{ width: '65%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.accountNumber)}</th><td>{maskedAccountNo}</td></tr>
                <tr><th>{L(tx.accountName)}</th><td>{L(sd.customerName)}</td></tr>
                <tr><th>{L(tx.serviceStartDate)}</th><td>{sd.serviceStartDate}</td></tr>
                <tr><th>{L(tx.recommender)}</th><td>{L(sd.recommender)}</td></tr>
                <tr><th>{L(tx.reportPeriod)}</th><td>{sd.periodFrom} ~ {sd.periodTo}</td></tr>
                <tr><th>{L(tx.reportBaseDate)}</th><td>{sd.baseDate}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.content}>
          <h3 className={s.sectionTit}>{L(tx.resultTit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '30%' }} /><col style={{ width: '35%' }} /><col style={{ width: '35%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.tac}>{L(tx.col.date)}</th>
                <th className={s.tac}>{L(tx.col.evalAmount)}</th>
                <th className={s.tac}>{L(tx.col.profitLoss)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.results.length === 0 ? (
                <tr><td colSpan={3} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.results.map((row) => (
                <tr key={row.date}>
                  <td className={s.tac}>{row.date}</td>
                  <td className={s.tar}>{num(row.evalAmount)} 원</td>
                  <td className={s.tar}>{num(row.profitLoss)} 원</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.info}>
            <ul>
              <li>{L(tx.resultNote1)}</li>
              <li>{L(tx.resultNote2)}</li>
            </ul>
          </div>
        </section>

        <section className={s.content} style={{ marginTop: 25 }}>
          <h3 className={s.contTit}>{L(tx.demandTit)}</h3>
          <p className={s.contTitSub} style={{ marginBottom: 5 }}>{L(tx.demandSub)}</p>
          <span className={s.unit}>{L(tx.demandUnit)}</span>
          <table className={s.table2r1cTable}>
            <colgroup><col /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /><col /></colgroup>
            <thead>
              <tr>
                <th className={s.tac}>{L(tx.target)}</th>
                <th className={s.tac}>{L(tx.individual)}</th>
                <th className={s.tac}>{L(tx.corporate)}</th>
                <th className={s.tac}>{L(tx.note)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={s.tac}>{L(tx.investReturn)}</td>
                <td className={s.tac}>{sd.individualReturn} %</td>
                <td className={s.tac}>{sd.corporateReturn} %</td>
                <td className={s.tac} />
              </tr>
            </tbody>
          </table>
          <div className={s.info}>
            <ul><li>{L(tx.demandNote)}</li></ul>
          </div>
        </section>

        <section className={s.content} style={{ marginTop: 25 }}>
          <h3 className={s.contTit}>{L(tx.termTit)}</h3>
          <p className={s.contTitSub} style={{ marginBottom: 5 }}>{L(tx.demandSub)}</p>
          <span className={s.unit}>{L(tx.demandUnit)}</span>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
            <thead>
              <tr><th colSpan={2} className={s.tal}>{L(tx.depositPeriod)}</th></tr>
            </thead>
            <tbody>
              {visibleTermReturns.map((pct, i) => (
                <tr key={i}>
                  <th className={s.tal}>{i + 1}{L(tx.monthUnit)}</th>
                  <td className={s.tar} style={{ fontWeight: 500 }}>{pct.toFixed(2)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sd.termReturns.length > 3 && (
            termExpanded ? (
              <button type="button" className={s.lessBtn} onClick={() => setTermExpanded(false)}>{L(tx.less)}</button>
            ) : (
              <button type="button" className={s.moreBtn} onClick={() => setTermExpanded(true)}>{L(tx.more)}</button>
            )
          )}
          <div className={s.info}>
            <ul>
              <li>{L(tx.termNote1)}</li>
              <li>
                {L(tx.termNote2)}
                <ul className={s.guideSubList}>
                  <li>{L(tx.termNote2Sub1)}</li>
                  <li>{L(tx.termNote2Sub2)}</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        <section className={s.content} style={{ marginTop: 25 }}>
          <h3 className={s.sectionTit}>{L(tx.feeTit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '60%' }} /><col style={{ width: '20%' }} /><col style={{ width: '20%' }} /></colgroup>
            <thead>
              <tr>
                <th>{L(tx.col2.period)}</th>
                <th>{L(tx.col2.calcDays)}</th>
                <th>{L(tx.col2.feeIncurred)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.fees.map((row, i) => (
                <tr key={i}>
                  <td className={s.tac}>{row.from} ~ {row.to}</td>
                  <td className={s.tar}>{num(row.days)} 일</td>
                  <td className={s.tar}>{num(row.fee)} 원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.content} style={{ marginTop: 25 }}>
          <h3 className={s.sectionTit}>{L(tx.operationTit)}</h3>
          <div className={s.txtBox}>
            <ul>
              {tx.operationNotes.map((note) => (
                <li key={note.ko} style={{ color: '#10226A' }}>{L(note)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.content} style={{ marginTop: 25 }}>
          <h3 className={s.sectionTit}>{L(tx.termHistoryTit)}</h3>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '30%' }} /><col /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col3.tradeDate)}</th>
                <th className={s.rowDivider}>{L(tx.col3.securityName)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col3.tradeType)}</th>
                <th className={s.rowDivider}>{L(tx.col3.tradeAmount)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.termTrades.length === 0 ? (
                <tr><td colSpan={2} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.termTrades.map((row, i) => (
                <Fragment key={i}>
                  <tr>
                    <td className={`${s.tac} ${s.rowDivider}`} style={{ fontWeight: 500 }}>{row.date}</td>
                    <td className={`${s.tal} ${s.rowDivider}`} style={{ fontWeight: 500 }}>{L(row.name)}</td>
                  </tr>
                  <tr>
                    <td className={`${s.tac} ${s.rowDivider}`} style={{ fontWeight: 500 }}>{L(row.tradeType)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`} style={{ fontWeight: 500 }}>{num(row.amount)} 원</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>

        <section className={s.table2r1c} style={{ padding: '0 24px', marginTop: 25 }}>
          <h3 className={s.sectionTit}>{L(tx.advisorTit)}</h3>
          <table className={s.table2r1cTable}>
            <colgroup><col style={{ width: '40%' }} /><col /></colgroup>
            <tbody>
              <tr><th>{L(tx.fpInfo)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(sd.fpInfo)}</td></tr>
              <tr><th>{L(tx.contact)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(sd.contact)}</td></tr>
              <tr><th>{L(tx.managerInfo)}</th><td className={s.tal} style={{ paddingLeft: 6 }}>{L(sd.managerInfo)}</td></tr>
              <tr><th>{L(tx.career)}</th><td className={s.tal} style={{ paddingLeft: 6 }}><MultiLine text={L(sd.career)} /></td></tr>
            </tbody>
          </table>
          <div className={s.info}>
            <ul><li>{L(tx.advisorNote)}</li></ul>
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
