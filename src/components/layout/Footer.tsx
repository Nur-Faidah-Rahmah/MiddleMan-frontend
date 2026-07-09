import React from 'react';

export function Footer() {
  return (
    <footer
      style={{
        background: 'rgba(37,48,71,0.95)',
        borderTop: '1px solid rgba(58,158,158,0.2)',
        padding: '1.5rem 2.5rem',
        marginTop: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: '1.1rem',
            color: '#3a9e9e',
            letterSpacing: '0.06em',
          }}
        >
          Sidequest.com
        </div>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          © {new Date().getFullYear()} Sidequest. The realm's trusted micro-job board.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Rules', 'Support', 'Privacy'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#3a9e9e')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
