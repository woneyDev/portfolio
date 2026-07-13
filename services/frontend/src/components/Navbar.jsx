import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import AccountMenu from './AccountMenu';

const NAVBAR_HEIGHT = 56;

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function animatedScrollTo(targetY, duration = 700) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function burst(e) {
  const colors = ['#2563eb', '#60a5fa', '#93c5fd', '#3b82f6', '#1d4ed8'];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'nav-particle';
    document.body.appendChild(p);
    const angle = (i / count) * 360;
    const dist = 28 + Math.random() * 22;
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    p.style.setProperty('--dx', `${Math.cos((angle * Math.PI) / 180) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin((angle * Math.PI) / 180) * dist}px`);
    p.style.background = colors[i % colors.length];
    setTimeout(() => p.remove(), 650);
  }
}

export function scrollToSection(e, id) {
  e.preventDefault();
  burst(e);
  const el = document.getElementById(id);
  if (!el) return;
  const targetY = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  animatedScrollTo(targetY);
}

export default function Navbar({ items = [], editLink }) {
  const { t } = useLanguage();

  return (
    <nav className="navbar">
      <span className="nav-brand">{t.nav.brand}</span>
      <div className="nav-right">
        <div className="nav-links">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)}>
              {item.label}
            </a>
          ))}
        </div>
        <AccountMenu editLink={editLink} />
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
