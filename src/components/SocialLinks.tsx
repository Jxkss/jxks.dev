import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Copy, 
  Check, 
  Bitcoin, 
  DollarSign, 
  Gamepad2, 
  MessageSquare
} from 'lucide-react';

const Ethereum: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 2L8 16L16 21L24 16L16 2Z" />
    <path d="M8 18L16 30L24 18L16 23L8 18Z" />
  </svg>
);

const Litecoin: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 32 32" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="16" cy="16" r="14" />
    <path d="M10.5 19.5L8 22.5H24" />
    <path d="M14 8.5L11 18.5L18 15.5" />
  </svg>
);

interface SocialLinksProps {
  vertical?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ vertical = false }) => {
  const [copiedState, setCopiedState] = useState<{[key: string]: boolean}>({});
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  useEffect(() => {
    if (lastCopied) {
      const timer = setTimeout(() => {
        setCopiedState(prev => ({...prev, [lastCopied]: false}));
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lastCopied]);

  const handleCopy = (text: string, key: string) => {
    const newCopiedState = Object.keys(copiedState).reduce((acc, curr) => {
      acc[curr] = false;
      return acc;
    }, {} as {[key: string]: boolean});
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedState({...newCopiedState, [key]: true});
      setLastCopied(key);
    });
  };

  const socialLinks = [
    { 
      icon: MessageSquare, 
      label: 'Discord', 
      description: 'Chat with me directly',
      url: 'https://discord.com/users/1154446508238844026'
    },
    { 
      icon: Github, 
      label: 'GitHub', 
      description: 'Check out my repositories',
      url: 'https://github.com/Jxkss'
    },
    { 
      icon: Gamepad2, 
      label: 'Steam', 
      description: 'Game with me',
      url: 'https://steamcommunity.com/id/jxksonsteam/'
    },
    { 
      icon: DollarSign, 
      label: 'PayPal', 
      description: 'Support my work',
      url: 'https://www.paypal.com/paypalme/JaksPrime'
    },
  ];

  const cryptoLinks = [
    { 
      icon: Bitcoin, 
      label: 'BTC', 
      description: 'Bitcoin donation',
      url: '#',
      isCrypto: true,
      cryptoAddress: 'bc1qnj0hddqp7mfqt6q5wkgjt6mf8j2qyp320taamq'
    },
    { 
      icon: Litecoin, 
      label: 'LTC', 
      description: 'Litecoin donation',
      url: '#',
      isCrypto: true,
      cryptoAddress: 'LdvDNuGg6w7qiawvFSc99FGs94X1dAzCk2'
    },
    { 
      icon: Ethereum, 
      label: 'ETH', 
      description: 'Ethereum donation',
      url: '#',
      isCrypto: true,
      cryptoAddress: '0xD543B9324258235A13BA8031C9945200E5Ed8A0e'
    },
  ];

  if (vertical) {
    return (
      <div className="space-y-4">
        <div className="bg-black/10 border border-white/20 rounded-xl p-4 hover:border-white/35 transition-all duration-300">
          <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <span className="animate-pulse">~$</span> SOCIAL
          </h4>
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center group"
              >
                <div className="w-8 flex justify-center mr-2">
                  <link.icon size={20} className="text-white" />
                </div>
                <div className="flex-grow">
                  <div className="text-white">{link.label}</div>
                  <div className="text-gray-400 text-xs">{link.description}</div>
                </div>
                <div className="ml-2 text-gray-400 group-hover:text-white transition-colors">
                  →
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div className="bg-black/10 border border-white/20 rounded-xl p-4 hover:border-white/35 transition-all duration-300">
          <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <span className="animate-pulse">~$</span> CRYPTO.DONATE
          </h4>
          <div className="space-y-3">
            {cryptoLinks.map((link, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 flex justify-center mr-2">
                  <link.icon size={20} className="text-white" />
                </div>
                <div className="flex-grow">
                  <div className="text-white">{link.label}</div>
                  <div className="text-gray-400 text-xs">{link.description}</div>
                </div>
                <button
                  onClick={() => handleCopy(link.cryptoAddress!, link.label)}
                  className="ml-2 relative group"
                >
                  {copiedState[link.label] ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <Copy size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                  )}
                  
                  <div 
                    className={`absolute right-0 top-full mt-1 bg-black bg-opacity-50 border border-white text-white text-xs py-1 px-2 whitespace-nowrap transition-all duration-300 ${
                      copiedState[link.label] ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    Address copied!
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <div className="bg-black/10 border border-white/20 rounded-xl p-4 hover:border-white/35 transition-all duration-300 group">
        <h4 className="text-white font-bold text-sm mb-3">SOCIAL LINKS</h4>
        
        <div className="grid grid-cols-4 gap-2">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded"
            >
              <link.icon size={16} />
              <span className="text-xs mt-1">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
      
        <div className="bg-black/10 border border-white/20 rounded-xl p-4 hover:border-white/35 transition-all duration-300 group">
        <h4 className="text-white font-bold text-sm mb-3">CRYPTO DONATIONS</h4>
        
        <div className="grid grid-cols-3 gap-2">
          {cryptoLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleCopy(link.cryptoAddress!, link.label)}
              className="flex flex-col items-center p-2 bg-white/10 text-white hover:bg-white/20 transition-colors relative rounded"
            >
              <div className="relative">
                <link.icon size={16} />
                {copiedState[link.label] ? (
                  <Check size={12} className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5" />
                ) : (
                  <Copy size={12} className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <span className="text-xs mt-1">{link.label}</span>
              
              <div 
                className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 border border-white text-white text-xs py-1 px-2 whitespace-nowrap transition-all duration-300 ${
                  copiedState[link.label] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
                }`}
              >
                Address copied!
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;