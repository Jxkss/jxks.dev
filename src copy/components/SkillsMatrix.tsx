import React, { useState } from 'react';
import { Video } from 'lucide-react';

type SkillItem = {
  name: string;
  slug: string | null;
  category: 'languages' | 'ide' | 'media' | 'os';
  customIcon?: 'video' | 'windows';
  /** Genuine logo URL (e.g. Wikimedia SVG); used instead of slug when set */
  iconUrl?: string;
  /** Filter for iconUrl: white = brightness(0) invert(1), grayscale = grayscale(100%) */
  iconFilter?: 'white' | 'grayscale';
};

const iconColor = 'e5e5e5';

// Windows logo SVG (standard 4-pane icon) - Simple Icons CDN may not have it
const WindowsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
);

const skills: SkillItem[] = [
  // Languages & tools
  { name: 'Python', slug: 'python', category: 'languages' },
  { name: 'Node.js', slug: 'nodedotjs', category: 'languages' },
  { name: 'JavaScript', slug: 'javascript', category: 'languages' },
  { name: 'HTML/CSS', slug: 'html5', category: 'languages' },
  { name: 'Lua', slug: 'lua', category: 'languages' },
  { name: 'TypeScript', slug: 'typescript', category: 'languages' },
  { name: 'AHK', slug: 'autohotkey', category: 'languages' },
  // IDEs
  { name: 'VSCodium', slug: 'vscodium', category: 'ide' },
  {
    name: 'Visual Studio',
    slug: 'visualstudio',
    category: 'ide',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Visual_Studio_Icon_2022.svg',
    iconFilter: 'white',
  },
  { name: 'PyCharm', slug: 'pycharm', category: 'ide' },
  // Video, Media & 3D (merged)
  {
    name: 'Vegas Pro 18',
    slug: null,
    category: 'media',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Vegas_Pro_21_logo.svg',
    iconFilter: 'grayscale',
  },
  {
    name: 'After Effects 2024',
    slug: 'adobeaftereffects',
    category: 'media',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg',
    iconFilter: 'grayscale',
  },
  {
    name: 'Media Encoder',
    slug: 'adobemediaencoder',
    category: 'media',
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Adobe_Media_Encoder_Icon.svg',
    iconFilter: 'grayscale',
  },
  { name: 'Blender', slug: 'blender', category: 'media' },
  { name: 'Cinema 4D', slug: 'cinema4d', category: 'media' },
  // OS
  { name: 'Arch Linux', slug: 'archlinux', category: 'os' },
  { name: 'Kali Linux', slug: 'kalilinux', category: 'os' },
  { name: 'Ubuntu', slug: 'ubuntu', category: 'os' },
  { name: 'Windows', slug: null, category: 'os', customIcon: 'windows' },
];

const categoryOrder: SkillItem['category'][] = ['languages', 'ide', 'media', 'os'];
const categoryLabels: Record<SkillItem['category'], string> = {
  languages: 'Languages / Tools',
  ide: 'IDEs',
  media: 'Video, Media & 3D',
  os: 'OS',
};

function SkillIcon({ skill }: { skill: SkillItem }) {
  const [failed, setFailed] = useState(false);

  if (skill.customIcon === 'windows') {
    return (
      <WindowsIcon className="w-4 h-4 flex-shrink-0 text-[#e5e5e5] opacity-90 group-hover:opacity-100" />
    );
  }
  if (skill.customIcon === 'video' || (!skill.slug && !skill.customIcon && !skill.iconUrl)) {
    return (
      <Video className="w-4 h-4 flex-shrink-0 text-white/70 group-hover:text-white/90" strokeWidth={2} aria-hidden />
    );
  }
  if (skill.iconUrl && !failed) {
    const filterClass =
      skill.iconFilter === 'white'
        ? '[filter:brightness(0)_invert(1)]'
        : skill.iconFilter === 'grayscale'
          ? 'grayscale'
          : '';
    return (
      <img
        src={skill.iconUrl}
        alt=""
        className={`w-4 h-4 flex-shrink-0 opacity-90 group-hover:opacity-100 object-contain ${filterClass}`}
        width={16}
        height={16}
        onError={() => setFailed(true)}
      />
    );
  }
  if (skill.slug && !failed) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${skill.slug}/${iconColor}`}
        alt=""
        className="w-4 h-4 flex-shrink-0 opacity-90 group-hover:opacity-100"
        width={16}
        height={16}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white/80 rounded border border-white/20 flex-shrink-0">
      {skill.name.charAt(0)}
    </span>
  );
}

const SkillsMatrix: React.FC = () => {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: skills.filter((s) => s.category === cat),
  }));

  return (
    <div className="space-y-4">
      {grouped.map(({ category, label, items }) => (
        <div key={category}>
          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2 font-bold border-b border-white/10 pb-1">
            {label}
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all duration-200 group"
                title={skill.name}
              >
                <SkillIcon skill={skill} />
                <span className="text-white text-xs font-medium min-w-0 max-w-[160px] break-words">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsMatrix;
