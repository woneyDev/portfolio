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
import { text as tx, sampleData as sd } from './bbd001Data';

const s = sharedStyles;

export default function BBD001TrustReport() {
  const { lang, t } = useLanguage();
  const d = t.shinhanShared;
  const L = (field) => (field && typeof field === 'object' ? field[lang] : field);
  const won = (n) => (lang === 'ko' ? `${n.toLocaleString('ko-KR')} 원` : `₩${n.toLocaleString('en-US')}`);
  const num = (n) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');

  const { screenRef, scale, naturalHeight } = useScaledWindow();
  const { toast, showToast } = useToast();
  const [detail, setDetail] = useState(null);

  const openFundDetail = (item) => {
    setDetail({
      title: L(item.name),
      rows: [
        [L(tx.detail.seqNo), item.seqNo],
        [L(tx.detail.fundName), L(item.name)],
        [L(tx.detail.principalAmount), won(item.principal)],
        [L(tx.detail.operatingProfit), won(item.operatingProfit)],
        [L(tx.detail.trustFee), won(item.trustFee)],
        [L(tx.detail.tax), won(item.tax)],
        [L(tx.detail.afterTaxProfit), won(item.afterTaxProfit)],
        [L(tx.detail.contractMaturity), `${item.contractDate}/${item.maturityDate}`],
        [L(tx.detail.fundEvalMethod), L(item.evalMethod)],
        [L(tx.detail.settlementCurrency), L(item.settlementCurrency)],
      ],
    });
  };

  const openAssetDetail = (item) => {
    setDetail({
      title: L(item.securityName),
      rows: [
        [L(tx.detail.seqNo), item.seqNo],
        [L(tx.detail.fundName), L(item.fundName)],
        [L(tx.detail.assetDivision), L(item.assetDivision)],
        [L(tx.detail.securityName), L(item.securityName)],
        [L(tx.detail.buyAmount), won(item.buyAmount)],
        [L(tx.detail.evalAmount), won(item.evalAmount)],
        [L(tx.detail.buyReturn), `${item.buyReturn} %`],
        [L(tx.detail.marketReturn), `${item.marketReturn} %`],
        [L(tx.detail.creditRating), L(item.creditRating)],
      ],
    });
  };

  const introText = L(tx.introText).replace('{baseDate}', sd.baseDate).replace('{accountNo}', L(sd.accountNo));

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
            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 15, fontSize: 14, fontWeight: 300 }}>
              {introText}
            </div>
          </div>
        </section>

        <section className={s.content}>
          <h3 className={s.sectionTit}>{L(tx.accountProfitTit)}</h3>
          <div className={s.txtBox}>
            <table>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.principal)}</th><td>{won(sd.principal)}</td></tr>
                <tr><th>{L(tx.afterTaxProfitSum)}</th><td>{won(sd.afterTaxProfitSum)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px' }}>
          <div className={s.tableMoreHeadWrap}>
            <h3 className={s.contTit}>{L(tx.fundProfitTit)}</h3>
            <span className={s.totalNum}>{L(tx.totalPrefix)}{sd.funds.length}{L(tx.totalSuffix)}</span>
          </div>
          <span className={s.unit}>{L(tx.unitWon)}</span>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '10%' }} /><col style={{ width: '22%' }} /><col style={{ width: '22%' }} /><col style={{ width: '22%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col.seqNo)}</th>
                <th rowSpan={2} className={s.rowDivider}>{L(tx.col.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col.principalAmount)}</th>
                <th className={s.rowDivider}>{L(tx.col.operatingProfit)}</th>
                <th className={s.rowDivider}>{L(tx.col.contractDate)}</th>
                <th rowSpan={2} className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col.details)}</th>
              </tr>
              <tr>
                <th className={s.rowDivider}>{L(tx.col.fundEvalMethod)}</th>
                <th className={s.rowDivider}>{L(tx.col.afterTaxProfit)}</th>
                <th className={s.rowDivider}>{L(tx.col.maturityDate)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.funds.length === 0 ? (
                <tr><td colSpan={6} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.funds.map((item) => (
                <Fragment key={item.seqNo}>
                  <tr>
                    <td rowSpan={2} className={`${s.tac} ${s.rowDivider}`}>{item.seqNo}</td>
                    <td rowSpan={2} className={`${s.tal} ${s.rowDivider}`}>{L(item.name)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(item.principal)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(item.operatingProfit)}</td>
                    <td className={`${s.tac} ${s.rowDivider}`}>{item.contractDate}</td>
                    <td rowSpan={2} className={`${s.detailBtnCell} ${s.rowDivider}`}>
                      <button type="button" className={s.detailBtn} aria-label={L(tx.col.details)} onClick={() => openFundDetail(item)} />
                    </td>
                  </tr>
                  <tr>
                    <td className={`${s.tar} ${s.rowDivider}`}>{L(item.evalMethod)}</td>
                    <td className={`${s.tar} ${s.rowDivider}`}>{num(item.afterTaxProfit)}</td>
                    <td className={`${s.tac} ${s.rowDivider}`}>{item.maturityDate}</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>

          <div className={s.txtBox} style={{ marginBottom: 15 }}>
            <table>
              <colgroup><col style={{ width: '50%' }} /><col style={{ width: '50%' }} /></colgroup>
              <tbody>
                <tr><th>{L(tx.principalSum)}</th><td>{won(sd.principalSum)}</td></tr>
                <tr><th>{L(tx.trustFeeSum)}</th><td>{won(sd.trustFeeSum)}</td></tr>
                <tr><th>{L(tx.taxSum)}</th><td>{won(sd.taxSum)}</td></tr>
                <tr><th>{L(tx.operatingProfitSum)}</th><td>{won(sd.operatingProfitSum)}</td></tr>
                <tr><th>{L(tx.afterTaxSum)}</th><td>{won(sd.afterTaxSum)}</td></tr>
              </tbody>
            </table>
          </div>
          <p className={s.infoRed} style={{ position: 'static', paddingLeft: 25 }}>{L(tx.fxNote)}</p>
        </section>

        <section className={s.tableMore} style={{ padding: '0 24px' }}>
          <div className={s.tableMoreHeadWrap}>
            <h3 className={s.contTit}>{L(tx.assetTit)}</h3>
            <span className={s.totalNum}>{L(tx.totalPrefix)}{sd.assets.length}{L(tx.totalSuffix)}</span>
          </div>
          <span className={s.unit}>{L(tx.unitWon)}</span>
          <table className={s.dataTable}>
            <colgroup><col style={{ width: '10%' }} /><col /><col style={{ width: '25%' }} /><col style={{ width: '25%' }} /><col style={{ width: '12%' }} /></colgroup>
            <thead>
              <tr>
                <th className={s.rowDivider}>{L(tx.col2.seqNo)}</th>
                <th className={s.rowDivider}>{L(tx.col2.fundName)}</th>
                <th className={s.rowDivider}>{L(tx.col2.securityName)}</th>
                <th className={s.rowDivider}>{L(tx.col2.evalAmount)}</th>
                <th className={`${s.detailHeaderCell} ${s.rowDivider}`}>{L(tx.col2.details)}</th>
              </tr>
            </thead>
            <tbody>
              {sd.assets.length === 0 ? (
                <tr><td colSpan={5} className={s.noResult}>{L(tx.noResult)}</td></tr>
              ) : sd.assets.map((item) => (
                <tr key={item.seqNo} className={s.rowDivider}>
                  <td className={s.tac}>{item.seqNo}</td>
                  <td className={s.tal}>{L(item.fundName)}</td>
                  <td className={s.tal}>{L(item.securityName)}</td>
                  <td className={s.tar}>{num(item.evalAmount)}</td>
                  <td className={s.detailBtnCell}>
                    <button type="button" className={s.detailBtn} aria-label={L(tx.col2.details)} onClick={() => openAssetDetail(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <DetailModal detail={detail} onClose={() => setDetail(null)} scale={scale} closeLabel={d.close} />
      <Toast message={toast} scale={scale} />
    </>
  );
}
