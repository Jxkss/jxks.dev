interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  githubGrey?: boolean;
  demo?: string;
  demoGrey?: boolean;
  preview?: string;
  discord?: string;
  status: string;
  discontinued?: boolean;
}

const projects: Project[] = [
  {
    title: 'Jxks0s1nt',
    description: 'Powerful OSINT toolkit for IP analysis',
    tech: ['Python', 'Async', 'APIs'],
    github: 'https://github.com/jxkss/jxks0s1nt/',
    demoGrey: true,
    status: 'ACTIVE',
  },
  {
    title: 'Eclipse - Selfbot',
    description: 'High end paid Discord Selfbot with Advanced GUI and 500+ Commands.',
    tech: ['Node.js', 'Javascript', 'HTML/CSS', 'Electron'],
    githubGrey: true,
    status: 'IN-WORK',
    preview: 'https://eclipse.jxks.dev',
  },
  {
    title: 'NextvibeRP - FiveM',
    description: 'French FiveM server focused on Roleplay. Extensive database.',
    tech: ['Lua', 'Javascript', 'HTML/CSS', 'SQL'],
    githubGrey: true,
    discord: 'https://discord.gg/ZSgeuQUHtT',
    status: 'IN-WORK',
    discontinued: true,
  },
];

export default function ProjectList() {
  return (
    <div className="proj-list">
      {projects.map((p, i) => (
        <div key={i} className={`proj-card${p.discontinued ? ' discontinued' : ''}`}>
          {p.discontinued && (
            <div className="proj-discontinued-badge">DISCONTINUED</div>
          )}

          <div className="proj-header">
            <span className="proj-name">{p.title}</span>
            {!p.discontinued && (
              <span className={`proj-status${p.status === 'ACTIVE' ? ' active' : ''}`}>
                [{p.status}]
              </span>
            )}
          </div>

          <p className="proj-desc">{p.description}</p>

          <div className="proj-techs">
            {p.tech.map(t => (
              <span key={t} className="proj-tech">{t}</span>
            ))}
          </div>

          <div className="proj-links">
            {p.github ? (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="proj-link">
                ▶ CODE
              </a>
            ) : p.githubGrey ? (
              <span className="proj-link disabled">▶ CODE</span>
            ) : null}

            {p.demo ? (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="proj-link">
                ▶ DEMO
              </a>
            ) : p.demoGrey ? (
              <span className="proj-link disabled">▶ DEMO</span>
            ) : null}

            {p.preview && (
              <a href={p.preview} target="_blank" rel="noopener noreferrer" className="proj-link">
                ▶ PREVIEW
              </a>
            )}

            {p.discord &&
              (p.discontinued ? (
                <span className="proj-link disabled">▶ DISCORD</span>
              ) : (
                <a href={p.discord} target="_blank" rel="noopener noreferrer" className="proj-link">
                  ▶ DISCORD
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
