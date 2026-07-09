import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Zap, Building2, CreditCard } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const S = {
  /* ── overlay ── */
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'stretch',
    background: '#2e3a5a',
    animation: 'sqFadeIn 0.35s ease',
  },
  /* ── LEFT PANEL ── */
  left: {
    flex: '0 0 40%',
    background: 'linear-gradient(160deg, #1fc8a0 0%, #17a97f 60%, #0f8a64 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '2.5rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '3rem',
    flexShrink: 0,
  },
  headline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.15,
    marginBottom: '2.5rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.9rem',
    marginBottom: '1.4rem',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '0.9rem',
    color: '#ffffff',
    marginBottom: 2,
  },
  featureSub: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.4,
  },
  stats: {
    marginTop: 'auto',
    display: 'flex',
    gap: '2.5rem',
  },
  statVal: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '1.8rem',
    color: '#ffffff',
  },
  statLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  /* ── RIGHT PANEL ── */
  right: {
    flex: 1,
    background: '#2e3a5a',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 4rem',
    overflowY: 'auto' as const,
  },
  formWrap: {
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '0.4rem',
  },
  subtitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '2.2rem',
  },
  label: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    display: 'block',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '0.85rem 1.1rem',
    color: '#ffffff',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box' as const,
  },
  inputFocus: {
    borderColor: '#1fc8a0',
    background: 'rgba(31,200,160,0.06)',
  },
  inputWrap: {
    position: 'relative' as const,
    marginBottom: '1.4rem',
  },
  eyeBtn: {
    position: 'absolute' as const,
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  forgotLink: {
    position: 'absolute' as const,
    right: 0,
    top: '-1.6rem',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.78rem',
    color: '#1fc8a0',
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.8rem',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#1fc8a0',
    cursor: 'pointer',
  },
  checkLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.7)',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #1fc8a0, #17a97f)',
    border: 'none',
    borderRadius: 12,
    padding: '0.95rem',
    color: '#ffffff',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
    boxShadow: '0 4px 20px rgba(31,200,160,0.35)',
    marginBottom: '1.4rem',
  },
  switchRow: {
    textAlign: 'center' as const,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.83rem',
    color: 'rgba(255,255,255,0.4)',
  },
  switchLink: {
    color: '#1fc8a0',
    fontWeight: 700,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.83rem',
    textDecoration: 'none',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.12)',
    border: '1.5px solid rgba(239,68,68,0.4)',
    borderRadius: 10,
    padding: '0.7rem 1rem',
    color: '#fca5a5',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.82rem',
    marginBottom: '1.2rem',
  },
};

const features = [
  {
    icon: <Zap size={17} color="#fff" />,
    title: 'Instant Access',
    sub: 'Start bidding on jobs immediately after login',
  },
  {
    icon: <Building2 size={17} color="#fff" />,
    title: 'Real Opportunities',
    sub: 'Verified clients posting actual projects daily',
  },
  {
    icon: <CreditCard size={17} color="#fff" />,
    title: 'Transparent Payments',
    sub: 'No hidden fees, secure escrow protection',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes sqFadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .sq-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(31,200,160,0.45) !important; }
        .sq-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .sq-close-btn { position:fixed; top:1.2rem; right:1.4rem; z-index:1010; background:rgba(255,255,255,0.1); border:1.5px solid rgba(255,255,255,0.2); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.2s; }
        .sq-close-btn:hover { background:rgba(255,255,255,0.18); }
        .sq-left-deco { position:absolute; bottom:-80px; right:-80px; width:280px; height:280px; border-radius:50%; background:rgba(255,255,255,0.06); pointer-events:none; }
        .sq-left-deco2 { position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:rgba(255,255,255,0.05); pointer-events:none; }
      `}</style>

      {/* Close button */}
      <button className="sq-close-btn" onClick={onClose} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div style={S.overlay}>
        {/* ── LEFT PANEL ── */}
        <div style={S.left}>
          <div className="sq-left-deco" />
          <div className="sq-left-deco2" />

          {/* Logo */}
          <div style={S.logoCircle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>

          {/* Headline */}
          <h1 style={S.headline}>
            Launch Your<br />Freelance Empire
          </h1>

          {/* Features */}
          {features.map((f) => (
            <div key={f.title} style={S.featureItem}>
              <div style={S.featureIcon}>{f.icon}</div>
              <div>
                <div style={S.featureTitle}>{f.title}</div>
                <div style={S.featureSub}>{f.sub}</div>
              </div>
            </div>
          ))}

          {/* Stats */}
          <div style={S.stats}>
            {[{ val: '$1.2M', label: 'Earnings' }, { val: '45K+', label: 'Projects' }].map((s) => (
              <div key={s.label}>
                <div style={S.statVal}>{s.val}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.right}>
          <div style={S.formWrap}>
            <h2 style={S.title}>Welcome Back</h2>
            <p style={S.subtitle}>Sign in to access your jobs and earnings</p>

            {error && <div style={S.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Username / Email */}
              <label style={S.label} htmlFor="login-email">Username</label>
              <div style={{ marginBottom: '1.4rem' }}>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your username"
                  style={{ ...S.input, ...(emailFocus ? S.inputFocus : {}) }}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </div>

              {/* Password */}
              <label style={S.label} htmlFor="login-password">
                Password
                <button type="button" style={S.forgotLink}>Forgot?</button>
              </label>
              <div style={{ ...S.inputWrap, marginTop: '0.3rem' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{ ...S.input, paddingRight: '3rem', ...(pwFocus ? S.inputFocus : {}) }}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                />
                <button type="button" style={S.eyeBtn} onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember me */}
              <div style={S.checkRow}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={S.checkbox}
                />
                <label htmlFor="remember" style={S.checkLabel}>Remember me</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="sq-submit-btn"
                style={S.submitBtn}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Switch */}
            <p style={S.switchRow}>
              Don't have an account?{' '}
              <button style={S.switchLink} onClick={onSwitchToRegister}>
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
