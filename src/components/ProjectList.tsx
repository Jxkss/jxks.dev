import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const ProjectList: React.FC = () => {
  const projects = [
    {
      title: 'Jxks0s1nt',
      description: 'Powerful OSINT toolkit for IP analysis',
      tech: ['Python', 'Async', 'APIs'],
      github: 'https://github.com/jxkss/jxks0s1nt/',
      demo: 'https://jxks0s1nt.jxks.dev',
      status: 'ACTIVE'
    },
    {
      title: 'JBot - Discord Selfbot',
      description: 'High end paid Discord Selfbot with an Advanced GUI and 500+ Commands.',
      tech: ['Node.js', 'Javascript', 'HTML/CSS', 'Electron'],
      githubGrey: true,
      status: 'IN-WORK',
      preview: 'https://jbot.jxks.dev'
    },
    {
      title: 'NextvibeRP - FiveM',
      description: 'French FiveM server focused on Roleplay. Extensive database.',
      tech: ['Lua', 'Javascript', 'HTML/CSS', 'SQL'],
      githubGrey: true,
      discord: 'https://discord.gg/QCcKAZQ96A',
      status: 'IN-WORK',
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
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
      <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
        <span className="animate-pulse">🗀</span> PROJECTS.DIR
      </h3>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border border-gray-400 p-4 hover:border-white transition-all duration-300 hover:shadow-md hover:shadow-white/20 group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-white font-bold text-sm group-hover:text-gray-200 transition-colors">{project.title}</h4>
              <span className={`text-xs ${getStatusColor(project.status)} font-bold`}>
                [{project.status}]
              </span>
            </div>
            
            <p className="text-gray-400 text-xs mb-3 leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="bg-gray-900 bg-opacity-25 text-white px-2 py-1 rounded text-xs font-mono hover:bg-opacity-0 transition-colors"
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
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white hover:text-gray-300 text-xs transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink size={14} />
                  DEMO
                </a>
              )}
                {project.discord && (
                  <a
                    href={project.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white hover:text-gray-300 text-xs transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink size={14} />
                  DISCORD
                </a>
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
        ))}
      </div>
    </div>
  );
};

export default ProjectList;