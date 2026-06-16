import { useState } from 'react';

type Category = 'languages' | 'ide' | 'media' | 'os';

interface Skill {
  name: string;
  slug: string | null;
  category: Category;
  iconUrl?: string;
  iconFilter?: 'white' | 'grayscale';
  customIcon?: 'windows';
}

const skills: Skill[] = [
  { name: 'Python', slug: 'python', category: 'languages' },
  { name: 'Node.js', slug: 'nodedotjs', category: 'languages' },
  { name: 'JavaScript', slug: 'javascript', category: 'languages' },
  { name: 'HTML/CSS', slug: 'html5', category: 'languages' },
  { name: 'Lua', slug: 'lua', category: 'languages' },
  { name: 'TypeScript', slug: 'typescript', category: 'languages' },
  { name: 'AHK', slug: 'autohotkey', category: 'languages' },
  { name: 'VSCodium', slug: 'vscodium', category: 'ide' },
  {
    name: 'Visual Studio',
    slug: null,
    category: 'ide',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Visual_Studio_Icon_2022.svg',
    iconFilter: 'white',
  },
  { name: 'PyCharm', slug: 'pycharm', category: 'ide' },
  {
    name: 'Vegas Pro 18',
    slug: null,
    category: 'media',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Vegas_Pro_21_logo.svg',
    iconFilter: 'grayscale',
  },
  {
    name: 'After Effects',
    slug: null,
    category: 'media',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg',
    iconFilter: 'grayscale',
  },
  {
    name: 'Media Encoder',
    slug: null,
    category: 'media',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg',
    iconFilter: 'grayscale',
  },
  { name: 'Blender', slug: 'blender', category: 'media' },
  { name: 'Cinema 4D', slug: 'cinema4d', category: 'media' },
  { name: 'Arch Linux', slug: 'archlinux', category: 'os' },
  { name: 'Kali Linux', slug: 'kalilinux', category: 'os' },
  { name: 'Ubuntu', slug: 'ubuntu', category: 'os' },
  { name: 'Windows', slug: null, category: 'os', customIcon: 'windows' },
];

const groups: { cat: Category; label: string; jp: string }[] = [
  { cat: 'languages', label: 'Languages / Tools', jp: '言語' },
  { cat: 'ide', label: 'IDEs', jp: 'IDE' },
  { cat: 'media', label: 'Video, Media & 3D', jp: 'メディア' },
  { cat: 'os', label: 'OS', jp: 'OS' },
];

function Icon({ s }: { s: Skill }) {
  const [err, setErr] = useState(false);

  if (s.customIcon === 'windows') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="sk-icon" aria-hidden>
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    );
  }

  const src = s.iconUrl ?? (s.slug ? `https://cdn.simpleicons.org/${s.slug}/e5e5e5` : null);

  if (src && !err) {
    const filter =
      s.iconFilter === 'white'
        ? 'brightness(0) invert(1)'
        : s.iconFilter === 'grayscale'
        ? 'grayscale(1) brightness(2)'
        : undefined;
    return (
      <img
        src={src}
        alt=""
        className="sk-icon"
        style={{ filter }}
        onError={() => setErr(true)}
      />
    );
  }

  return <span style={{ fontSize: '0.48rem', opacity: 0.6 }}>{s.name[0]}</span>;
}

export default function SkillsMatrix() {
  return (
    <div>
      {groups.map(({ cat, label, jp }) => (
        <div key={cat} className="sk-group">
          <div className="sk-label">
            {jp} / {label}
          </div>
          <div className="sk-chips">
            {skills
              .filter(s => s.category === cat)
              .map(s => (
                <div key={s.name} className="sk-chip" title={s.name}>
                  <Icon s={s} />
                  {s.name}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
