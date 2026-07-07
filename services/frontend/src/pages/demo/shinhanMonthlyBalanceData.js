// 실제 고객 데이터가 아닌, 화면 구조를 보여주기 위한 예시(더미) 데이터입니다.
// 이름/종목명처럼 언어에 따라 달라지는 값은 { ko, en } 형태로 두고, 숫자는 언어와 무관하게 공유합니다.

export const feeRateText = { ko: '1.00% (단 50만원 미만은 0.10%)', en: '1.00% (0.10% for balances under 500,000 KRW)' };

// 아래 금액/수량은 실제 계좌를 특정할 수 없도록 임의로 무작위 생성한 예시 값입니다.
export const sampleAccount = {
  name: { ko: '류원희', en: 'Wonhee Ryu' },
  accountNo: '30928471563', // 309-28-***563 형태로 마스킹되어 표시됨
  baseDate: { ko: '2024년 05월 31일', en: 'May 31, 2024' },
  period: { ko: '2024년 05월 01일 ~ 2024년 05월 31일', en: 'May 1 – May 31, 2024' },
  totalValue: 856430210,
  deposit: {
    entrustment: 612000,
    futuresOption: 90000,
    savingsAccount: 45000,
    overseasFxMargin: 0,
    foreignCurrency: 133700,
    subscription: 0,
    spot: 268000,
    unpaid: 0,
    rightsLimited: 0,
    creditCollateral: 0,
    loan: 0,
  },
  margin: {
    totalDeposit: 1150000,
    entrustmentMargin: 480000,
    additionalMargin: 0,
    maintenanceMargin: 310000,
    additionalMarginCash: 0,
  },
  balances: [
    { name: { ko: '삼성전자', en: 'Samsung Electronics' }, type: { ko: '주식', en: 'Stock' }, tradeType: { ko: '현금매수', en: 'Cash Buy' }, qty: 62, buyAmount: 4340000, evalAmount: 4650000, profitLoss: 310000, rate: 7.14 },
    { name: { ko: 'NAVER', en: 'NAVER' }, type: { ko: '주식', en: 'Stock' }, tradeType: { ko: '현금매수', en: 'Cash Buy' }, qty: 6, buyAmount: 1230000, evalAmount: 1291500, profitLoss: 61500, rate: 5.0 },
    { name: { ko: '코스모신소재', en: 'Cosmo AM&T' }, type: { ko: '주식', en: 'Stock' }, tradeType: { ko: '현금매매', en: 'Cash Trade' }, qty: 31000, buyAmount: 1519000, evalAmount: 1955500, profitLoss: 436500, rate: 28.74 },
    { name: { ko: '엘앤에프', en: 'L&F' }, type: { ko: '주식', en: 'Stock' }, tradeType: { ko: '현금매매', en: 'Cash Trade' }, qty: 214000, buyAmount: 2033000, evalAmount: 2131700, profitLoss: 98700, rate: 4.86 },
    { name: { ko: '에코프로머티리얼즈', en: 'Ecopro Materials' }, type: { ko: '주식', en: 'Stock' }, tradeType: { ko: '현금매매', en: 'Cash Trade' }, qty: 34600000, buyAmount: 39560000, evalAmount: 55531600, profitLoss: 15971600, rate: 40.37 },
    { name: { ko: '카카오', en: 'Kakao' }, type: { ko: '주식', en: 'Stock' }, tradeType: { ko: '현금매매', en: 'Cash Trade' }, qty: 6100, buyAmount: 45750000, evalAmount: 50187600, profitLoss: 4437600, rate: 9.7 },
  ],
  balanceSum: 115747900,
  funds: [
    {
      seqNo: 1,
      name: { ko: '삼성 우량주 증권투자신탁', en: 'Samsung Blue-Chip Securities Investment Trust' },
      feeRate: 1.2,
      buyPrincipal: 1480000,
      basePrice: 1123.6,
      units: 1387.9,
      evalAmountBeforeTax: 1559200,
      rateBeforeTax: 5.35,
      maturity: { ko: '2031년 05월 31일', en: 'May 31, 2031' },
      originalPrincipal: 1480000,
      netAssetTotal: 318000000000,
      note: { ko: '자본시장법 / 해당없음', en: 'Capital Markets Act / N/A' },
    },
  ],
  fundSum: 1559200,
  transactions: [
    { date: '2024.05.20', tradeType: { ko: '매수', en: 'Buy' }, name: { ko: '삼성전자', en: 'Samsung Electronics' }, qty: 20, price: 70000, amount: 1400000, fee: 190, tax: 0, changeAmount: -1400190 },
  ],
  withholdings: [
    { date: '2024.05.12', tradeType: { ko: '이자', en: 'Interest' }, name: { ko: '정기예금', en: 'Time Deposit' }, taxBase: 52000, corporateTax: 8008, localTax: 800, specialTax: 520, foreignTax: 0, total: 9328 },
  ],
};
