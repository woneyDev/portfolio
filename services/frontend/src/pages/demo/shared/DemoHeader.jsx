import styles from './demoShared.module.css';
import logoH from '../../../assets/jsp-demo/logo_h.png';

export default function DemoHeader({ alt }) {
  return (
    <header className={styles.topLogoArea}>
      <img className={styles.logoHeader} src={logoH} alt={alt} />
    </header>
  );
}
