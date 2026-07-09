import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Check } from 'lucide-react';

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const S = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'stretch',
    background: '#2e3a5a',
    animation: 'sqFadeIn 0.35s ease',
  },
  left: {
    flex: '0 0 30%',
    background: 'linear-gradient(160deg, #6fa3c0 0%, #4a7fa0 50%, #3a6a8a 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '2.5rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#ffffff',
    letterSpacing: '0.04em',
    marginBottom: '4rem',
  },
  headline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.2,
    marginBottom: '1rem',
  },
  description: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.6,
    marginBottom: 'auto',
  },
  checkItems: {
    marginTop: '2.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.9rem',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  /* RIGHT PANEL */
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
    marginBottom: '2rem',
  },
  fieldGroup: {
    marginBottom: '1.2rem',
  },
  label: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    display: 'block',
    marginBottom: '0.45rem',
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
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    margin: '1.2rem 0 1.8rem',
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#1fc8a0',
    cursor: 'pointer',
  },
  checkLabel: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.65)',
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
    color: '#d4a843',
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
  roleBtn: (active: boolean) => ({
    flex: 1,
    padding: '0.65rem',
    borderRadius: 10,
    border: active ? '2px solid #1fc8a0' : '1.5px solid rgba(255,255,255,0.1)',
    background: active ? 'rgba(31,200,160,0.12)' : 'rgba(255,255,255,0.05)',
    color: active ? '#1fc8a0' : 'rgba(255,255,255,0.55)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.18s',
    textAlign: 'center' as const,
  }),
};

const perks = ['Freelance jobs in one place', 'Simple & fast hiring', 'Trusted community'];

export const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('2');
  const [agreed, setAgreed] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // focus states
  const [emailF, setEmailF] = useState(false);
  const [nameF, setNameF] = useState(false);
  const [pwF, setPwF] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('You must agree to the Terms of Service.'); return; }
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, role_id: parseInt(roleId) });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        .sq-reg-deco { position:absolute; bottom:-60px; right:-60px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.06); pointer-events:none; }
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
          <div className="sq-reg-deco" />

          <div style={S.logoText}>Sidequest.com</div>

          <h1 style={S.headline}>Find your next<br />side gig.</h1>
          <p style={S.description}>
            Connect with clients, showcase your skills, and get hired for projects that matter.
          </p>

          {/* Perk list */}
          <div style={S.checkItems}>
            {perks.map((p) => (
              <div key={p} style={S.checkItem}>
                <div style={S.checkIcon}>
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
                <span style={S.checkText}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.right}>
          <div style={S.formWrap}>
            <h2 style={S.title}>Create Account</h2>
            <p style={S.subtitle}>Join Sidequest and start exploring</p>

            {error && <div style={S.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={S.fieldGroup}>
                <label style={S.label} htmlFor="reg-email">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ ...S.input, ...(emailF ? S.inputFocus : {}) }}
                  onFocus={() => setEmailF(true)}
                  onBlur={() => setEmailF(false)}
                />
              </div>

              {/* Username */}
              <div style={S.fieldGroup}>
                <label style={S.label} htmlFor="reg-name">Username</label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Pick a username"
                  style={{ ...S.input, ...(nameF ? S.inputFocus : {}) }}
                  onFocus={() => setNameF(true)}
                  onBlur={() => setNameF(false)}
                />
              </div>

              {/* Password */}
              <div style={S.fieldGroup}>
                <label style={S.label} htmlFor="reg-password">Password</label>
                <div style={S.inputWrap}>
                  <input
                    id="reg-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a strong password"
                    style={{ ...S.input, paddingRight: '3rem', ...(pwF ? S.inputFocus : {}) }}
                    onFocus={() => setPwF(true)}
                    onBlur={() => setPwF(false)}
                  />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div style={S.fieldGroup}>
                <label style={S.label}>I want to...</label>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="button" style={S.roleBtn(roleId === '2')} onClick={() => setRoleId('2')}>
                    Post Jobs
                  </button>
                  <button type="button" style={S.roleBtn(roleId === '3')} onClick={() => setRoleId('3')}>
                    Take Jobs
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div style={S.checkRow}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={S.checkbox}
                />
                <label htmlFor="terms" style={S.checkLabel}>
                  I agree to the{' '}
                  <span style={{ color: '#1fc8a0', fontWeight: 600 }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color: '#1fc8a0', fontWeight: 600 }}>Privacy Policy</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !agreed}
                className="sq-submit-btn"
                style={S.submitBtn}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Switch to login */}
            <p style={S.switchRow}>
              Already have an account?{' '}
              <button style={S.switchLink} onClick={onSwitchToLogin}>
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
