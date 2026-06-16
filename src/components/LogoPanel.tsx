import { useState } from 'react';
import PixelLogo from './PixelLogo';

const SI = 'https://cdn.simpleicons.org';

const socials = [
  { src: `${SI}/discord`,  label: 'DISCORD', href: 'https://discord.com/users/1154446508238844026' },
  { src: `${SI}/github`,   label: 'GITHUB',  href: 'https://github.com/Jxkss' },
  { src: `${SI}/steam`,    label: 'STEAM',   href: 'https://steamcommunity.com/id/jxksonsteam/' },
  { src: `${SI}/paypal`,   label: 'PAYPAL',  href: 'https://www.paypal.com/paypalme/JaksPrime' },
];

const cryptos = [
  { src: `${SI}/bitcoin`,  label: 'BTC', addr: 'bc1qnj0hddqp7mfqt6q5wkgjt6mf8j2qyp320taamq' },
  { src: `${SI}/litecoin`, label: 'LTC', addr: 'LdvDNuGg6w7qiawvFSc99FGs94X1dAzCk2' },
  { src: `${SI}/ethereum`, label: 'ETH', addr: '0xD543B9324258235A13BA8031C9945200E5Ed8A0e' },
];

export default function LogoPanel() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (addr: string, key: string) => {
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <div className="logo-row">
      {socials.map((s, i) => (
        <PixelLogo
          key={s.label}
          src={s.src}
          label={s.label}
          href={s.href}
          wrapClassName="logo-float"
          wrapStyle={{ animationDelay: `${-(i * 0.9)}s` }}
        />
      ))}
      {cryptos.map((c, i) => (
        <PixelLogo
          key={c.label}
          src={c.src}
          label={copied === c.label ? 'COPIED!' : c.label}
          highlight={copied === c.label}
          onClick={() => copy(c.addr, c.label)}
          wrapClassName="logo-float"
          wrapStyle={{ animationDelay: `${-((i + socials.length) * 0.9)}s` }}
        />
      ))}
    </div>
  );
}
