import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api-client';
import './Admin.css';

const AFFILIATION_OPTIONS = ['구직자', '현직 개발자', '인사·채용담당자', '수강생', '그 외'];
const EMAIL_CHECK_DEBOUNCE_MS = 400;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState(null); // 'checking' | 'available' | 'taken' | null
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [affiliation, setAffiliation] = useState(AFFILIATION_OPTIONS[0]);
  const [affiliationDetail, setAffiliationDetail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!email || !email.includes('@')) {
      setEmailStatus(null);
      return;
    }

    setEmailStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const { available } = await api.checkEmailAvailability(email);
        setEmailStatus(available ? 'available' : 'taken');
      } catch {
        setEmailStatus(null);
      }
    }, EMAIL_CHECK_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [email]);

  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (emailStatus === 'taken') {
      setError('이미 사용 중인 이메일입니다.');
      return;
    }

    const finalAffiliation = affiliation === '그 외' ? affiliationDetail.trim() : affiliation;
    if (!finalAffiliation) {
      setError('소속을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await api.register(email, password, passwordConfirm, nickname, finalAffiliation);
      setDone(true);
    } catch (err) {
      setError(err.message ?? '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <h1 className="admin-login-title">가입 확인 이메일을 보냈습니다</h1>
          <p className="admin-notice">
            입력하신 이메일로 인증 링크를 보내드렸습니다.
            <br />
            메일함에서 인증을 완료한 뒤 로그인해주세요. (24시간 이내 유효)
          </p>
          <button className="admin-btn" onClick={() => navigate('/admin')}>
            로그인 화면으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1 className="admin-login-title">회원가입</h1>
        {error && <p className="admin-error">{error}</p>}

        <label className="admin-label">이메일 (아이디로 사용됩니다)</label>
        <input
          className="admin-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          required
        />
        {emailStatus === 'checking' && <p className="admin-hint">확인 중...</p>}
        {emailStatus === 'available' && <p className="admin-hint admin-hint-ok">사용 가능한 이메일입니다.</p>}
        {emailStatus === 'taken' && <p className="admin-hint admin-hint-bad">이미 사용 중인 이메일입니다.</p>}

        <label className="admin-label">비밀번호</label>
        <input
          className="admin-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <label className="admin-label">비밀번호 확인</label>
        <input
          className="admin-input"
          type="password"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />
        {passwordMismatch && <p className="admin-hint admin-hint-bad">비밀번호가 일치하지 않습니다.</p>}

        <label className="admin-label">닉네임</label>
        <input
          className="admin-input"
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={30}
          required
        />

        <label className="admin-label">소속</label>
        <select
          className="admin-input"
          value={affiliation}
          onChange={e => setAffiliation(e.target.value)}
        >
          {AFFILIATION_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {affiliation === '그 외' && (
          <input
            className="admin-input"
            type="text"
            placeholder="소속을 직접 입력해주세요"
            value={affiliationDetail}
            onChange={e => setAffiliationDetail(e.target.value)}
            maxLength={100}
            required
          />
        )}

        <button className="admin-btn" type="submit" disabled={loading || emailStatus === 'taken'}>
          {loading ? '가입 처리 중...' : '회원가입'}
        </button>
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => navigate('/admin')}>
          이미 계정이 있으신가요? 로그인
        </button>
      </form>
    </div>
  );
}
