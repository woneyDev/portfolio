// 실제 고객 데이터가 아닌, 화면 구조를 보여주기 위한 예시(더미) 데이터입니다.

export const text = {
  screenName: { ko: '퇴직연금 가입자 법정교육(IRP형)', en: 'Retirement Pension Statutory Education (IRP Type)' },
  greetingAfter: { ko: ' 고객님, 신한투자증권을 이용해 주셔서 감사합니다.', en: ', thank you for using Shinhan Investment Corp.' },
  legalNotice: {
    ko: '이 자료는 근로자퇴직급여 보장법 제33조제5항 규정에 따라 퇴직연금사업자가 가입자에게 매년1회 이상 실시 하는 법정 교육자료입니다.',
    en: 'This material is statutory education provided at least once a year by the retirement pension provider to subscribers, per Article 33(5) of the Employee Retirement Benefit Security Act.',
  },
  subscriberName: { ko: '가입자명', en: 'Subscriber Name' },
  accountNo: { ko: '계좌번호', en: 'Account Number' },
  planStatusTit: { ko: '나의 퇴직연금제도 현황', en: 'My Retirement Pension Plan Status' },
  planLine1: { ko: '1. 퇴직연금제도 : 개인형퇴직연금(IRP)', en: '1. Plan Type: Individual Retirement Pension (IRP)' },
  contractDateLabel: { ko: '나의 가입일(계약일) : ', en: 'My Enrollment (Contract) Date: ' },
  planLine2: { ko: '2. 최근 3년간 나의 신한투자증권 개인형IRP에 납입한 금액', en: '2. Amount I contributed to my Shinhan Investment Corp. individual IRP over the last 3 years' },
  unitWon: { ko: '(단위 : 원)', en: '(Unit: KRW)' },
  col: {
    year: { ko: '납입연차', en: 'Contribution Year' },
    period: { ko: '납입기간', en: 'Payment Period' },
    amount: { ko: '납입금액', en: 'Amount' },
    details: { ko: '상세보기', en: 'Details' },
  },
  yearSuffix: { ko: '년차', en: '' },
  glossaryItems: [
    { term: { ko: '납입연차', en: 'Contribution Year' }, desc: { ko: '부담금 납입상황을 연단위로 표시(1년차, 2년차, 3년차)', en: 'Shows contribution status by year (Year 1, 2, 3).' } },
    { term: { ko: '납입기간', en: 'Payment Period' }, desc: { ko: '산출기준일 직전 3년 중 당해 납입연차(1년차, 2년차, 3년차)에 해당하는 기간 (도입기간이 3년 미달인 경우에는 해당기간)을 표시', en: 'Shows the period corresponding to each contribution year within the last 3 years from the base date.' } },
    { term: { ko: '납입금액', en: 'Amount' }, desc: { ko: '해당 납입기간에 납입된 퇴직금, 가입자부담금 및 계약이전금의 합계', en: 'The sum of severance pay, subscriber contributions, and transferred amounts paid during the period.' } },
    { term: { ko: '퇴직금', en: 'Severance Pay' }, desc: { ko: '퇴직소득세 과세이연 혜택을 받기 위해 개인형IRP에 납입한 세전 퇴직금', en: 'Pre-tax severance pay contributed to the individual IRP to receive retirement income tax deferral benefits.' } },
    { term: { ko: '가입자부담금', en: 'Subscriber Contribution' }, desc: { ko: '세액공제혜택을 받기 위해 가입자가 연간납입한도 이내에서 납입하는 부담금', en: 'The amount the subscriber contributes within the annual limit to receive tax deduction benefits.' } },
    { term: { ko: '계약이전금', en: 'Transferred Amount' }, desc: { ko: '계약이전(타 금융기관 IRP, 연금저축 → 신한투자증권 IRP)의 경우 타 금융기관에서 신한투자증권으로 이체된 총 금액', en: 'For contract transfers (from another institution’s IRP or pension savings to Shinhan Investment Corp. IRP), the total amount transferred.' } },
  ],
  closingLine1: { ko: '퇴직연금의 안정적 운용에 참고하시기 바라며,', en: 'Please refer to this for the stable management of your retirement pension,' },
  closingLine2: { ko: '자세한 내용이나 궁금하신 사항은 퇴직연금 전용 상담전화(1588-1122)나 홈페이지(www.shinhansec.com)를 이용해 주시기 바랍니다.', en: 'and for further details, please contact the Retirement Pension Hotline (1588-1122) or visit www.shinhansec.com.' },
  downloadBtn: { ko: '가입자 교육자료 다운로드', en: 'Download Subscriber Education Material' },
  detail: {
    period: { ko: '납입기간', en: 'Payment Period' },
    amount: { ko: '납입금액', en: 'Amount' },
    severancePay: { ko: '퇴직금', en: 'Severance Pay' },
    subscriberContribution: { ko: '가입자부담금', en: 'Subscriber Contribution' },
    transferredAmount: { ko: '계약이전금', en: 'Transferred Amount' },
  },
  customerCenter: { ko: '퇴직연금 고객센터(1588-1122)', en: 'Retirement Pension Center (1588-1122)' },
  close: { ko: '닫기', en: 'Close' },
};

export const sampleData = {
  subscriberName: { ko: '류원희', en: 'Wonhee Ryu' },
  accountNo: '38027461502',
  contractDate: { ko: '2020년 03월 15일', en: 'Mar 15, 2020' },
  contributions: [
    { year: 1, from: '2023.07.01', to: '2024.06.30', amount: 3600000, severancePay: 0, subscriberAmount: 3600000, transferredAmount: 0 },
    { year: 2, from: '2022.07.01', to: '2023.06.30', amount: 3600000, severancePay: 0, subscriberAmount: 3600000, transferredAmount: 0 },
    { year: 3, from: '2021.07.01', to: '2022.06.30', amount: 2400000, severancePay: 0, subscriberAmount: 2400000, transferredAmount: 0 },
  ],
};
