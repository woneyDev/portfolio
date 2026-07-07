import styles from './demoShared.module.css';
import logoF from '../../../assets/jsp-demo/logo_f.png';
// TODO: "신한알파" 전용 아이콘 파일을 받으면 이걸로 교체 (지금은 챗봇 아이콘으로 임시 대체)
import shinhanAlphaIcon from '../../../assets/jsp-demo/chatBotIcon.png';

export default function DemoFooter({ line1, line2, iconAlt, footerAlt, onLogoClick }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.aiPromo}>
        <span className={styles.aiPromoLine1}>{line1}</span>
        <span className={styles.aiPromoLine2}>
          {line2}
          <img className={styles.aiPromoIcon} src={shinhanAlphaIcon} alt={iconAlt} />
        </span>
      </div>
      <button type="button" className={styles.footerLogoBtn} onClick={onLogoClick}>
        <img className={styles.logoFooter} src={logoF} alt={footerAlt} />
      </button>
    </footer>
  );
}
