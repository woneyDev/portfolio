// 실제 고객 데이터가 아닌, 화면 구조를 보여주기 위한 예시(더미) 데이터입니다.
// BAA001(단품_국내, 154)과 문구가 거의 동일하여 공통 문구는 그대로 재사용합니다.
import { text as baseText } from './baa001Data';

export const text = {
  ...baseText,
  s3aTit: { ko: '자산 종류별 현황', en: 'Status by Asset Category' },
  securityWeightTit: { ko: '유가 증권별 비중', en: 'Weight by Security' },
  countryWeightTit: { ko: '국가별 자산 비중', en: 'Weight by Country' },
  s3cTit: { ko: '나. 자산 종목 보유 현황', en: 'b. Asset Holdings Status' },
};

export const sampleData = {
  baseDate: '2024-06-18',
  contractor: { ko: '류원희', en: 'Wonhee Ryu' },
  productName: { ko: '신한 마이더스 EMA 글로벌 랩', en: 'Shinhan Midas EMA Global Wrap' },
  accountNo: '70495823641',
  firstContractDate: '2023.04.03',
  investPeriod: 442,
  infoBaseDate: '2024.06.18',
  principal: 35000000,
  withdrawal: 0,
  fees: 241200,
  valuation: 39184600,
  cumulativeReturn: 11.96,
  annualizedReturn: 9.88,
  terminationDeduction: 85000,
  expectedTermination: 39099600,
  contractAmount: 35000000,
  reportValuation: 39184600,
  cumulativeProfit: 4184600,
  cumulativeReturnFrom: '23년04월03일',
  cumulativeReturnTo: '24년06월18일',
  cumulativeReturnPct: 11.96,
  quarterlyProfit: 398100,
  quarterlyReturnFrom: '24년03월18일',
  quarterlyReturnTo: '24년06월18일',
  quarterlyReturnPct: 1.03,
  wrapService: { ko: '신한 마이더스 EMA 글로벌 랩', en: 'Shinhan Midas EMA Global Wrap' },
  accountName: { ko: '류원희', en: 'Wonhee Ryu' },
  riskTendency: { ko: '적극투자형', en: 'Aggressive' },
  riskGrade: { ko: '2등급', en: 'Grade 2' },
  serviceRegDate: '2023.04.03',
  contractFrom: '2023.04.03',
  contractTo: '2028.04.03',
  overseasInvest: { ko: '해당', en: 'Yes' },
  benchmark: { ko: 'MSCI World', en: 'MSCI World' },
  expectedMaturity: '2028.04.03',
  wrapBranch: { ko: '해운대금융센터', en: 'Haeundae Finance Center' },
  wrapManager: { ko: '배수지', en: 'Suji Bae' },
  managingFirm: { ko: '신한자산운용', en: 'Shinhan Asset Management' },
  managingAgent: { ko: 'AI 알고리즘(EMA)', en: 'AI Algorithm (EMA)' },
  investTendency: { ko: '적극투자형', en: 'Aggressive' },
  restriction: { ko: '해당없음', en: 'None' },
  periodReturns: [
    { division: { ko: '수익률(%)', en: 'Return (%)' }, m3: 2.05, m6: 4.10, m9: 7.42, m12: 10.05, cumulative: 11.96 },
  ],
  cumulativeLine: [
    { date: '23.06', value: 1.0 }, { date: '23.09', value: 3.6 }, { date: '23.12', value: 6.5 },
    { date: '24.03', value: 9.8 }, { date: '24.06', value: 11.96 },
  ],
  recent3mLine: [
    { date: '04.01', value: 0.2 }, { date: '04.15', value: 0.4 }, { date: '05.01', value: 0.6 },
    { date: '05.15', value: 0.8 }, { date: '06.01', value: 0.9 }, { date: '06.18', value: 1.03 },
  ],
  returnComposition: [
    { assetClass: { ko: '해외주식(EMA)', en: 'Overseas Equity (EMA)' }, priorReturn: 1.8, currentReturn: 2.1, cumulativeReturn: 9.6, holding: { ko: '보유중', en: 'Held' }, currentWeight: 65, priorWeight: 58 },
    { assetClass: { ko: '외화유동성', en: 'FX Liquidity' }, priorReturn: 0.2, currentReturn: 0.2, cumulativeReturn: 1.1, holding: { ko: '보유중', en: 'Held' }, currentWeight: 35, priorWeight: 42 },
  ],
  securityHeaderCurrent: { ko: '당분기말', en: 'Current Quarter' },
  securityHeaderPrior: { ko: '전분기말', en: 'Prior Quarter' },
  securityRows: [
    { name: { ko: '글로벌주식ETF', en: 'Global Equity ETF' }, currentAmount: 25469990, currentWeight: 65.0, priorAmount: 20200000, priorWeight: 58.0 },
    { name: { ko: 'MMF(외화)', en: 'FX MMF' }, currentAmount: 13714610, currentWeight: 35.0, priorAmount: 14618000, priorWeight: 42.0 },
  ],
  countryRows: [
    { name: { ko: '미국', en: 'United States' }, weight: 72.0 },
    { name: { ko: '유럽', en: 'Europe' }, weight: 15.0 },
    { name: { ko: '일본', en: 'Japan' }, weight: 8.0 },
    { name: { ko: '기타', en: 'Other' }, weight: 5.0 },
  ],
  holdings: [
    { division: { ko: 'ETF', en: 'ETF' }, name: { ko: 'iShares MSCI World ETF', en: 'iShares MSCI World ETF' }, currency: { ko: 'USD', en: 'USD' }, region: { ko: '전세계', en: 'Global' }, qty: 320, avgPrice: 78.4, currentPrice: 86.9, returnRate: 10.84 },
  ],
  managementStatus: {
    ko: 'EMA 알고리즘이 분기 중 글로벌 증시 상승 신호에 따라 해외주식 비중을 확대했습니다.',
    en: 'This quarter, the EMA algorithm increased overseas equity weighting in response to global market upside signals.',
  },
  managementPlan: {
    ko: '다음 분기에도 알고리즘 신호에 따라 글로벌 자산배분을 동적으로 조정할 예정입니다.',
    en: 'Next quarter, global asset allocation will continue to be dynamically adjusted based on algorithmic signals.',
  },
  trades: [
    { division: { ko: '매수', en: 'Buy' }, name: { ko: 'iShares MSCI World ETF', en: 'iShares MSCI World ETF' }, date: '2024-05-06', qty: 40, price: 84.2, amount: 3368, fee: 5, tax: 0 },
  ],
  mmw: [
    { from: '2024.03.18', to: '2024.06.18', totalInvested: 156300000, totalRedeemed: 155900000, profitLoss: 26100 },
  ],
  buyAmount: 9820000,
  sellAmount: 9150000,
  turnoverCurrent: 12.6,
  turnoverCurrentFrom: '2024.03.18',
  turnoverCurrentTo: '2024.06.18',
  turnoverCumulative: 40.8,
  turnoverCumulativeFrom: '2023.04.03',
  turnoverCumulativeTo: '2024.06.18',
  deposits: [
    { month: '2024.06', deposit: 0, withdrawal: 0, balance: 0 },
  ],
  rights: [
    { division: { ko: '분배금', en: 'Distribution' }, name: { ko: 'iShares MSCI World ETF', en: 'iShares MSCI World ETF' }, detailDivision: { ko: '현금분배', en: 'Cash Distribution' }, rightDetails: { ko: '분배금 지급', en: 'Distribution Payment' }, rightQty: 320, baseRate: 1385.2, amount: 41000, taxes: 6314 },
  ],
  riskExposure: {
    ko: '해당 계좌는 EMA 알고리즘에 따라 해외주식·유동성 비중이 동적으로 조정되며, 환율 및 해외시장 변동성에 따라 평가금액이 변동될 수 있습니다.',
    en: 'This account’s overseas equity/liquidity weighting is dynamically adjusted by the EMA algorithm, and the valuation amount may fluctuate with exchange rates and overseas market volatility.',
  },
  advisoryFirm: { ko: '해당 사항 없음', en: 'Not applicable' },
  feeHistory: [
    { from: '2024.03.18', to: '2024.06.18', discretionaryFee: 88700, performanceFee: 0, otherTradeCost: 0, taxes: 8870, otherCost: 0, totalCost: 97570 },
  ],
  wrapFeeBasis: {
    ko: '랩수수료는 계약금액을 기준으로 연 0.85%를 분기별로 나누어 후취 방식으로 부과합니다.',
    en: 'The wrap fee is charged quarterly in arrears at an annual rate of 0.85% based on the contract amount.',
  },
  performanceFeeBasis: {
    ko: '별도의 성과보수는 부과하지 않습니다.',
    en: 'No separate performance fee is charged.',
  },
  personnel: [
    {
      position: { ko: '퀀트팀장', en: 'Quant Team Lead' },
      name: { ko: '배수지', en: 'Suji Bae' },
      startDate: '2020.02.01',
      contractCount: 154,
      scale: 52300,
      career: { ko: '신한자산운용 글로벌퀀트팀 10년 경력', en: '10 years at Shinhan Asset Management Global Quant Team' },
      contact: { ko: '02-1588-0365', en: '+82-2-1588-0365' },
    },
  ],
  recommenderInfo: { ko: '신한투자증권 해운대금융센터', en: 'Shinhan Investment Corp. Haeundae Finance Center' },
  recommenderContact: { ko: '02-1588-0365', en: '+82-2-1588-0365' },
  signDate: '2024년06월18일',
};
