import styles from './demoShared.module.css';

export default function DetailModal({ detail, onClose, scale, closeLabel }) {
  if (!detail) return null;
  return (
    <>
      <div className={styles.dark} onClick={onClose} />
      <div className={styles.detailModal} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <h3 className={styles.detailModalTit}>{detail.title}</h3>
        <table className={styles.detailModalTable}>
          <tbody>
            {detail.rows.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className={styles.closeBtn} onClick={onClose}>{closeLabel}</button>
      </div>
    </>
  );
}
