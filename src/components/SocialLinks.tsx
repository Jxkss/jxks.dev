import { useState } from 'react';

const social = [
  {
    label: 'Discord',
    desc: 'chat directly',
    url: 'https://discord.com/users/1154446508238844026',
  },
  {
    label: 'GitHub',
    desc: 'repositories',
    url: 'https://github.com/Jxkss',
  },
  {
    label: 'Steam',
    desc: 'game with me',
    url: 'https://steamcommunity.com/id/jxksonsteam/',
  },
  {
    label: 'PayPal',
    desc: 'support my work',
    url: 'https://www.paypal.com/paypalme/JaksPrime',
  },
];

const crypto = [
  {
    label: 'BTC',
    desc: 'Bitcoin',
    addr: 'bc1qnj0hddqp7mfqt6q5wkgjt6mf8j2qyp320taamq',
  },
  {
    label: 'LTC',
    desc: 'Litecoin',
    addr: 'LdvDNuGg6w7qiawvFSc99FGs94X1dAzCk2',
  },
  {
    label: 'ETH',
    desc: 'Ethereum',
    addr: '0xD543B9324258235A13BA8031C9945200E5Ed8A0e',
  },
];

export default function SocialLinks({ vertical: _vertical }: { vertical?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (addr: string, key: string) => {
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div>
      <div className="social-section">
        <div className="social-section-title">SNS / SOCIAL</div>
        {social.map(s => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-item"
          >
            <span className="social-arrow">→</span>
            <span className="social-label">{s.label}</span>
            <span className="social-desc">{s.desc}</span>
          </a>
        ))}
      </div>

      <div className="social-section">
        <div className="social-section-title">寄付 / CRYPTO DONATE</div>
        {crypto.map(c => (
          <div key={c.label} className="crypto-item">
            <span className="social-arrow" style={{ color: 'rgba(255,255,255,0.2)' }}>◈</span>
            <div className="crypto-info">
              <div className="crypto-name">{c.label}</div>
              <div className="crypto-addr">{c.addr.slice(0, 18)}…</div>
            </div>
            <button
              className={`copy-btn${copied === c.label ? ' copied' : ''}`}
              onClick={() => copy(c.addr, c.label)}
            >
              {copied === c.label ? 'コピー済' : 'COPY'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
