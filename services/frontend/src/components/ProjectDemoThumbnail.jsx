import logoH from '../assets/jsp-demo/logo_h.png';
import mainBg from '../assets/jsp-demo/mainBg.png';
import mainImgShort from '../assets/jsp-demo/mainImg_short.png';

export default function ProjectDemoThumbnail({ screenName }) {
  return (
    <div className="jsp-thumb">
      <div className="jsp-thumb-header">
        <img src={logoH} alt="신한투자증권 로고" className="jsp-thumb-logo" />
      </div>
      <div className="jsp-thumb-main" style={{ backgroundImage: `url(${mainBg})` }}>
        <div className="jsp-thumb-mainimg" style={{ backgroundImage: `url(${mainImgShort})` }} />
        <p className="jsp-thumb-title">{screenName}</p>
      </div>
    </div>
  );
}
