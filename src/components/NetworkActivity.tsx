import React, { useState, useEffect } from 'react';
import { Activity, ArrowUp, ArrowDown, Globe } from 'lucide-react';

interface Connection {
  id: number;
  ip: string;
  port: number;
  status: 'ESTABLISHED' | 'LISTENING' | 'TIME_WAIT';
  protocol: 'TCP' | 'UDP';
  bytes: number;
}

const NetworkActivity: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [packetsPerSecond, setPacketsPerSecond] = useState(0);

  useEffect(() => {
    const initialConnections: Connection[] = [
      { id: 1, ip: '192.168.1.1', port: 80, status: 'ESTABLISHED', protocol: 'TCP', bytes: 1024 },
      { id: 2, ip: '10.0.0.1', port: 443, status: 'ESTABLISHED', protocol: 'TCP', bytes: 2048 },
      { id: 3, ip: '172.16.0.1', port: 22, status: 'LISTENING', protocol: 'TCP', bytes: 512 },
      { id: 4, ip: '8.8.8.8', port: 53, status: 'TIME_WAIT', protocol: 'UDP', bytes: 256 },
    ];
    setConnections(initialConnections);

    const interval = setInterval(() => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        bytes: conn.bytes + Math.floor(Math.random() * 100),
        status: Math.random() > 0.95 ? 
          (['ESTABLISHED', 'LISTENING', 'TIME_WAIT'] as const)[Math.floor(Math.random() * 3)] : 
          conn.status
      })));

      setTotalBytes(prev => prev + Math.floor(Math.random() * 500));
      setPacketsPerSecond(Math.floor(Math.random() * 50) + 10);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ESTABLISHED': return 'text-white';
      case 'LISTENING': return 'text-gray-400';
      case 'TIME_WAIT': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
      <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
        <Globe size={14} className="animate-pulse" />
        NETWORK.ACTIVITY
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <ArrowUp size={12} className="text-white" />
          <span className="text-gray-400">UP:</span>
          <span className="text-white font-mono">{Math.round(totalBytes / 1024)}KB</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDown size={12} className="text-white" />
          <span className="text-gray-400">DOWN:</span>
          <span className="text-white font-mono">{Math.round(totalBytes / 512)}KB</span>
        </div>
      </div>

      <div className="space-y-1 text-xs max-h-20 overflow-hidden">
        {connections.slice(0, 3).map((conn) => (
          <div key={conn.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-white" />
              <span className="text-gray-400 font-mono">{conn.ip}:{conn.port}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`${getStatusColor(conn.status)} text-xs`}>
                {conn.status}
              </span>
              <span className="text-white font-mono">{conn.bytes}B</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 pt-2 mt-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">PACKETS/SEC:</span>
          <span className="text-white font-mono">{packetsPerSecond}</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkActivity;