import styles from './demoShared.module.css';

export default function Toast({ message, scale }) {
  if (!message) return null;
  return (
    <div className={styles.toast} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
      {message}
    </div>
  );
}
