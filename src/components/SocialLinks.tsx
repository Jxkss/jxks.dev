import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Copy, 
  Check, 
  Bitcoin, 
  DollarSign, 
  Gamepad2, 
  MessageSquare,
  LucideIcon
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

const SocialLinks: React.FC = () => {
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

  const links = [
    { 
      icon: MessageSquare, 
      label: 'Discord', 
      url: 'https://discord.com/users/1154446508238844026'
    },
    { 
      icon: Github, 
      label: 'GitHub', 
      url: 'https://github.com/Jxkss'
    },
    { 
      icon: Gamepad2, 
      label: 'Steam', 
      url: 'https://steamcommunity.com/id/jxksonsteam/'
    },
    { 
      icon: DollarSign, 
      label: 'PayPal', 
      url: 'https://www.paypal.com/paypalme/JaksPrime'
    },
    { 
      icon: Bitcoin, 
      label: 'BTC', 
      url: '#',
      isCrypto: true,
      cryptoAddress: 'bc1qnj0hddqp7mfqt6q5wkgjt6mf8j2qyp320taamq'
    },
    { 
      icon: Litecoin, 
      label: 'LTC', 
      url: '#',
      isCrypto: true,
      cryptoAddress: 'LdvDNuGg6w7qiawvFSc99FGs94X1dAzCk2'
    },
    { 
      icon: Ethereum, 
      label: 'ETH', 
      url: '#',
      isCrypto: true,
      cryptoAddress: '0xD543B9324258235A13BA8031C9945200E5Ed8A0e'
    },
  ];

  return (
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
      <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
        <span className="animate-pulse">~$</span> CONNECT.EXE
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {links.map((link, index) => (
          link.isCrypto ? (
            <button
              key={index}
              onClick={() => handleCopy(link.cryptoAddress!, link.label)}
              className="flex flex-col items-center p-3 bg-gray-900 bg-opacity-25 rounded border border-gray-800 border-opacity-25 transition-all duration-300 hover:border-white hover:scale-110 hover:shadow-md hover:shadow-white/30 group text-white relative"
            >
              <div className="relative">
                <link.icon size={20} />
                {copiedState[link.label] ? (
                  <Check size={12} className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5" />
                ) : (
                  <Copy size={12} className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              
              <div 
                className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 border border-white text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-all duration-300 ${
                  copiedState[link.label] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
                }`}
              >
                Address copied!
              </div>
            </button>
          ) : (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-3 bg-gray-900 bg-opacity-25 rounded border border-gray-800 border-opacity-25 transition-all duration-300 hover:border-white hover:scale-110 hover:shadow-md hover:shadow-white/30 group text-white"
            >
              <link.icon size={20} />
            </a>
          )
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;