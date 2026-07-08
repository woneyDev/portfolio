// 실제 고객 데이터가 아닌, 화면 구조를 보여주기 위한 예시(더미) 데이터입니다.
// 금액/수량은 실제 계좌를 특정할 수 없도록 임의로 무작위 생성했습니다.

export const sampleAccount = {
  name: { ko: '류원희', en: 'Wonhee Ryu' },
  accountNo: '18374602951', // 183-74-***951 형태로 마스킹되어 표시됨
  baseDate: { ko: '2024년 12월 31일', en: 'Dec 31, 2024' },
  period: { ko: '2024년 07월 01일 ~ 2024년 12월 31일', en: 'Jul 1 – Dec 31, 2024' },
  totalValue: 42176300,
  deposit: {
    entrustment: 0,
    futuresOption: 0,
    savingsAccount: 0,
    overseasFxMargin: 0,
    foreignCurrency: 0,
    subscription: 0,
    spot: 0,
    unpaid: 0,
    rightsLimited: 0,
    creditCollateral: 0,
    loan: 0,
  },
  margin: {
    totalDeposit: 0,
    entrustmentMargin: 0,
    additionalMargin: 0,
    maintenanceMargin: 0,
    additionalMarginCash: 0,
  },
  balances: [
    { name: { ko: '신한 CMA', en: 'Shinhan CMA' }, type: { ko: '종합계좌', en: 'Comprehensive Account' }, tradeType: { ko: 'RP(개인)', en: 'RP (Individual)' }, qty: 312, buyAmount: 312000, evalAmount: 312000, profitLoss: 0, rate: 0 },
  ],
  balanceSum: 312000,
  funds: [
    {
      seqNo: 1,
      name: { ko: '한국투자 밸런스 증권투자신탁', en: 'Korea Investment Balanced Securities Investment Trust' },
      feeRate: 0.987,
      buyPrincipal: 38500000,
      basePrice: 1084.2,
      units: 38620000,
      evalAmountBeforeTax: 41864300,
      rateBeforeTax: 8.74,
      maturity: { ko: '해당없음', en: 'N/A' },
      originalPrincipal: 38500000,
      netAssetTotal: 612000000000,
      note: { ko: '자본시장법 / 해당없음', en: 'Capital Markets Act / N/A' },
    },
  ],
  fundSum: 41864300,
  withholdings: [
    { date: '2024.11.15', tradeType: { ko: '이자', en: 'Interest' }, name: { ko: '정기예금', en: 'Time Deposit' }, taxBase: 38000, corporateTax: 5852, localTax: 585, specialTax: 380, foreignTax: 0, total: 6817 },
  ],
};
