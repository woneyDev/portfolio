import { lazy, Suspense, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// 실제로 "프로젝트 둘러보기"를 클릭했을 때만 모달 코드와 이미지가 로드되도록 지연 로딩
const ProjectDemoModal = lazy(() => import('./ProjectDemoModal'));

// ⚠️ 임시 조치 (정식 해결 아님): 실제 서버(DB)가 아직 프로젝트별 데모 화면 목록을 내려주지 않아서,
// "프로젝트 둘러보기" 버튼이 실제 서비스 화면에서는 항상 비활성화되는 문제를 우회하기 위해
// 제목으로 매칭해서 화면에서만 임시로 채워 넣는다. 나중에 DB화 작업을 하면 이 블록은 통째로 지운다.
const TEMP_DEMO_SCREENS_BY_TITLE = {
  '신한투자증권 고객통지업무 디지털화': {
    screens: [
      { screenName: '월간거래내역 및 잔고', routeKey: 'shinhan-monthly-balance', category: '고객업무혁신부' },
      { screenName: '반기잔고 현황', routeKey: 'shinhan-half-year-balance', category: '고객업무혁신부' },
      { screenName: '다수계좌 주문대리인 안내', routeKey: 'shinhan-agent-notice', category: '고객업무혁신부' },
      { screenName: '휴면성 증권자산 안내문', routeKey: 'shinhan-dormant-assets', category: '고객업무혁신부' },
      { screenName: '계좌통합관리서비스 약관 변경 안내', routeKey: 'shinhan-terms-change-notice', category: '고객업무혁신부' },
      { screenName: '일임형 종합자산관리계좌 성과보고서 (단품형·국내)', routeKey: 'shinhan-wrap-report-domestic-basic', category: '랩운용부' },
      { screenName: '일임형 종합자산관리계좌 성과보고서 (단품형·국내 간편)', routeKey: 'shinhan-wrap-report-domestic-simple', category: '랩운용부' },
      { screenName: '일임형 종합자산관리계좌 성과보고서 (단품형·해외)', routeKey: 'shinhan-wrap-report-overseas-basic', category: '랩운용부' },
      { screenName: '일임형 종합자산관리계좌 성과보고서 (자산배분형·해외)', routeKey: 'shinhan-wrap-report-overseas-asset', category: '랩운용부' },
      { screenName: '일임형 종합자산관리계좌 성과보고서 (EMA형·국내)', routeKey: 'shinhan-wrap-report-ema-domestic', category: '랩운용부' },
      { screenName: '일임형 종합자산관리계좌 성과보고서 (EMA형·해외)', routeKey: 'shinhan-wrap-report-ema-overseas', category: '랩운용부' },
      { screenName: 'MMW형 CMA 투자결과 보고서', routeKey: 'shinhan-mmw-cma-report', category: '랩운용부' },
      { screenName: '특정금전신탁 운용보고서', routeKey: 'shinhan-trust-report', category: '신탁부' },
      { screenName: '특정금전신탁 분기 운용보고서', routeKey: 'shinhan-trust-quarterly-report', category: '신탁부' },
      { screenName: '펀드 수익률 보고서', routeKey: 'shinhan-fund-return-report', category: '펀드상품부' },
      { screenName: '연금저축 수익률 보고서', routeKey: 'shinhan-pension-fund-report', category: '펀드상품부' },
      { screenName: '퇴직연금 적립금 운용현황보고서', routeKey: 'shinhan-retirement-pension-report', category: '연금사업부' },
      { screenName: '퇴직연금 가입자 법정교육(DC형)', routeKey: 'shinhan-legal-education-dc', category: '연금사업부' },
      { screenName: '퇴직연금 가입자 법정교육(IRP형)', routeKey: 'shinhan-legal-education-irp', category: '연금사업부' },
      { screenName: '금융소득 원천징수 명세서', routeKey: 'shinhan-withholding-statement', category: '자금관리부' },
      { screenName: '신한금융그룹 내 고객정보 제공내역 안내', routeKey: 'shinhan-customer-info-disclosure-notice', category: '정보보호센터' },
    ],
  },
};

export default function ProjectsSection({ data }) {
  const { t } = useLanguage();
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section className="section projects">
      <h2 className="section-title">{t.sectionTitles.projects}</h2>
      <div className="projects-grid">
        {data.map((rawProject) => {
          const project = { ...rawProject, demo: rawProject.demo ?? TEMP_DEMO_SCREENS_BY_TITLE[rawProject.title] };
          const hasDemoList = Boolean(project.demo?.screens?.length);
          return (
            <div key={project.title} className="project-card">
              <div className="project-period">{project.period}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="tech-stack">
                {project.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
              {project.hasDemo && (
                <div className="project-demo">
                  <button
                    type="button"
                    className="btn btn-outline project-demo-btn"
                    disabled={!hasDemoList}
                    title={hasDemoList ? undefined : t.projects.comingSoon}
                    onClick={hasDemoList ? () => setActiveProject(project) : undefined}
                  >
                    {t.projects.viewButton}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {activeProject && (
        <Suspense fallback={null}>
          <ProjectDemoModal project={activeProject} onClose={() => setActiveProject(null)} />
        </Suspense>
      )}
    </section>
  );
}
