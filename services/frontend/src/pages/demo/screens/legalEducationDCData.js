// 실제 고객 데이터가 아닌, 화면 구조를 보여주기 위한 예시(더미) 데이터입니다.

export const text = {
  screenName: { ko: '퇴직연금 가입자 법정교육(DC형)', en: 'Retirement Pension Statutory Education (DC Type)' },
  greetingAfter: { ko: ' 고객님, 신한투자증권을 이용해 주셔서 감사합니다.', en: ', thank you for using Shinhan Investment Corp.' },
  legalNotice: {
    ko: '이 자료는 근로자퇴직급여 보장법 제32조제2항 규정에 따라 퇴직연금사업자가 가입자에게 매년1회 이상 실시 하는 법정 교육자료입니다.',
    en: 'This material is statutory education provided at least once a year by the retirement pension provider to subscribers, per Article 32(2) of the Employee Retirement Benefit Security Act.',
  },
  companyName: { ko: '기업명', en: 'Company Name' },
  businessNo: { ko: '사업자번호', en: 'Business Registration No.' },
  subscriberName: { ko: '가입자명', en: 'Subscriber Name' },
  subscriberAccount: { ko: '가입자계좌번호', en: 'Subscriber Account Number' },
  planStatusTit: { ko: '나의 퇴직연금제도 현황', en: 'My Retirement Pension Plan Status' },
  planLine1: { ko: '1. 퇴직연금제도 : 확정기여형(DC) 퇴직연금', en: '1. Plan Type: Defined Contribution (DC) Retirement Pension' },
  contractDateLabel: { ko: '나의 가입일(계약일) : ', en: 'My Enrollment (Contract) Date: ' },
  planLine2: { ko: '2. 부담금 납입주기 : ', en: '2. Contribution Payment Cycle: ' },
  planLine3: { ko: '3. 최근 3년간 회사가 나의 신한투자증권 DC계좌에 납입한 금액', en: '3. Amount the company contributed to my Shinhan Investment Corp. DC account over the last 3 years' },
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
    { term: { ko: '납입금액', en: 'Amount' }, desc: { ko: '해당 납입기간에 납입된 부담금 합계', en: 'Total contributions paid during the period.' } },
    { term: { ko: '사용자부담금', en: 'Employer Contribution' }, desc: { ko: '사용자가 가입자의 DC계좌에 납입하는 부담금으로 연간임금총액의 1/12이상 퇴직연금규약에서 납입하기로 결정한 금액', en: 'The amount the employer contributes to the DC account, at least 1/12 of annual wages as determined by the retirement pension rules.' } },
    { term: { ko: '가입자부담금', en: 'Subscriber Contribution' }, desc: { ko: '세액공제혜택을 받기 위해 가입자가 연간납입한도 이내에서 납입하는 부담금', en: 'The amount the subscriber contributes within the annual limit to receive tax deduction benefits.' } },
    { term: { ko: '기타', en: 'Other' }, desc: { ko: '계약이전(타금융기관 → 신한투자증권)의 경우 타금융기관에서 발생한 운용손익을 포함하여 표시', en: 'For contract transfers (from another institution to Shinhan Investment Corp.), includes investment returns from the prior institution.' } },
  ],
  closingLine1: { ko: '퇴직연금의 안정적 운용에 참고하시기 바라며,', en: 'Please refer to this for the stable management of your retirement pension,' },
  closingLine2: { ko: '자세한 내용이나 궁금하신 사항은 퇴직연금 전용 상담전화(1588-1122)나 홈페이지(www.shinhansec.com)를 이용해 주시기 바랍니다.', en: 'and for further details, please contact the Retirement Pension Hotline (1588-1122) or visit www.shinhansec.com.' },
  downloadBtn: { ko: '가입자 교육자료 다운로드', en: 'Download Subscriber Education Material' },
  detail: {
    period: { ko: '납입기간', en: 'Payment Period' },
    amount: { ko: '납입금액', en: 'Amount' },
    employerContribution: { ko: '사용자부담금', en: 'Employer Contribution' },
    subscriberContribution: { ko: '가입자부담금', en: 'Subscriber Contribution' },
    total: { ko: '합계', en: 'Total' },
  },
  customerCenter: { ko: '퇴직연금 고객센터(1588-1122)', en: 'Retirement Pension Center (1588-1122)' },
  close: { ko: '닫기', en: 'Close' },
};

export const sampleData = {
  subscriberName: { ko: '류원희', en: 'Wonhee Ryu' },
  companyName: { ko: '주식회사 포뎁스', en: '4DEPTH Co., Ltd.' },
  businessNo: '134-87-*****',
  accountNo: '28011356402',
  contractDate: { ko: '2019년 07월 01일', en: 'Jul 1, 2019' },
  paymentCycle: { ko: '월납', en: 'Monthly' },
  contributions: [
    { year: 1, from: '2023.07.01', to: '2024.06.30', amount: 4364600, employerAmount: 4364600, subscriberAmount: 0 },
    { year: 2, from: '2022.07.01', to: '2023.06.30', amount: 4196412, employerAmount: 4196412, subscriberAmount: 0 },
    { year: 3, from: '2021.07.01', to: '2022.06.30', amount: 3981250, employerAmount: 3981250, subscriberAmount: 0 },
  ],
};
