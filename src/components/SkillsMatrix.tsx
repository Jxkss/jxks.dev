import React from 'react';

const SkillsMatrix: React.FC = () => {
  const skills = [
    { name: 'Python', level: 95, category: 'Backend' },
    { name: 'Node.js', level: 92, category: 'Backend' },
    { name: 'JavaScript', level: 92, category: 'Frontend' },
    { name: 'HTML/CSS', level: 88, category: 'Frontend' },
    { name: 'Lua', level: 85, category: 'Frontend' },
    { name: 'Typescript', level: 80, category: 'Frontend' },
    { name: 'AHK', level: 75, category: 'Automation' },
  ];

  return (
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
      <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
        <span className="animate-pulse">~$</span> SKILLS.SYS
      </h3>
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="space-y-1 group">
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-bold group-hover:text-gray-200 transition-colors">{skill.name}</span>
              <span className="text-white text-xs font-mono">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-white/50"
                style={{ 
                  width: `${skill.level}%`,
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                }}
              />
            </div>
            <div className="text-gray-500 text-xs">{skill.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsMatrix;