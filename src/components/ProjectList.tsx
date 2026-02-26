import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

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

const ProjectList: React.FC = () => {
  const projects: Project[] = [
    {
      title: 'Jxks0s1nt',
      description: 'Powerful OSINT toolkit for IP analysis',
      tech: ['Python', 'Async', 'APIs'],
      github: 'https://github.com/jxkss/jxks0s1nt/',
      demoGrey: true,
      status: 'ACTIVE'
    },
    {
      title: 'Eclipse - Selfbot',
      description: 'High end paid Discord Selfbot with an Advanced GUI and 500+ Commands.',
      tech: ['Node.js', 'Javascript', 'HTML/CSS', 'Electron'],
      githubGrey: true,
      status: 'IN-WORK',
      preview: 'https://eclipse.jxks.dev'
    },
    {
      title: 'NextvibeRP - FiveM',
      description: 'French FiveM server focused on Roleplay. Extensive database.',
      tech: ['Lua', 'Javascript', 'HTML/CSS', 'SQL'],
      githubGrey: true,
      discord: 'https://discord.gg/ZSgeuQUHtT',
      status: 'IN-WORK',
      discontinued: true,
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-white';
      case 'BETA': return 'text-gray-300';
      case 'PRIVATE': return 'text-gray-500';
      case 'IN-WORK': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div
          key={index}
          className={`relative overflow-hidden bg-black/10 border border-white/20 rounded-xl p-4 hover:border-white/35 transition-all duration-300 group ${project.discontinued ? 'opacity-75' : ''}`}
        >
          {project.discontinued && (
            <>
              <div
                className="absolute top-2 right-2 pointer-events-none z-20 origin-top-right"
                aria-hidden
              >
                <span
                  className="inline-block text-white/50 font-bold text-xs tracking-[0.2em] border border-white/30 px-3 py-1 rounded rotate-12 bg-black/30"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  DISCONTINUED
                </span>
              </div>
              <div className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center" aria-hidden>
                <svg className="w-full h-full text-white/10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </>
          )}
          <div className={project.discontinued ? 'relative z-0' : ''}>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-white font-bold text-sm group-hover:text-gray-200 transition-colors">{project.title}</h4>
            {!project.discontinued && (
            <span className={`text-xs ${getStatusColor(project.status)} font-bold`}>
              [{project.status}]
            </span>
            )}
          </div>
          
          <p className="text-gray-400 text-xs mb-3 leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="bg-white/10 text-white px-2 py-1 rounded text-xs font-mono hover:bg-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex gap-2">
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white hover:text-gray-300 text-xs transition-all duration-200 hover:scale-105"
              >
                <Github size={14} />
                CODE
              </a>
            ) : project.githubGrey && (
              <span className="flex items-center gap-1 text-gray-500 text-xs cursor-not-allowed opacity-60">
                <Github size={14} />
                CODE
              </span>
            )}
              {project.demo ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-gray-300 text-xs transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink size={14} />
                  DEMO
                </a>
              ) : project.demoGrey && (
                <span className="flex items-center gap-1 text-gray-500 text-xs cursor-not-allowed opacity-60">
                  <ExternalLink size={14} />
                  DEMO
                </span>
              )}
              {project.discord && (
                project.discontinued ? (
                  <span className="flex items-center gap-1 text-gray-500 text-xs cursor-not-allowed opacity-60">
                    <ExternalLink size={14} />
                    DISCORD
                  </span>
                ) : (
                  <a
                    href={project.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white hover:text-gray-300 text-xs transition-all duration-200 hover:scale-105"
                  >
                    <ExternalLink size={14} />
                    DISCORD
                  </a>
                )
              )}
              {project.preview && (
                <a
                  href={project.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-gray-300 text-xs transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink size={14} />
                  PREVIEW
                </a>
              )}
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;