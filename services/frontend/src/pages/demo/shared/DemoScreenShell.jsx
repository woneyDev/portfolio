import styles from './demoShared.module.css';
import { BASE_WIDTH } from './useScaledWindow';

export default function DemoScreenShell({ screenRef, scale, naturalHeight, children }) {
  return (
    <div className={styles.page}>
      <div
        className={styles.sizer}
        style={{ width: BASE_WIDTH * scale, height: naturalHeight * scale || undefined }}
      >
        <div
          ref={screenRef}
          className={styles.screen}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
