import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Wifi, Zap } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [diskUsage, setDiskUsage] = useState(0);
  const [networkSpeed, setNetworkSpeed] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [lastNetworkSample, setLastNetworkSample] = useState({ time: Date.now(), bytes: 0 });

  // Function to get browser memory usage if available
  const getMemoryInfo = () => {
    if ('memory' in performance) {
      // TypeScript doesn't know about the memory property by default
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        // Calculate memory usage percentage based on heap size
        const usedHeap = memoryInfo.usedJSHeapSize;
        const totalHeap = memoryInfo.jsHeapSizeLimit;
        return Math.min(Math.round((usedHeap / totalHeap) * 100), 100);
      }
    }
    // Fallback if memory API is not available
    return Math.round(45 + Math.sin(Date.now() * 0.0008) * 10);
  };

  // Function to estimate CPU usage based on frame timing
  const startCPUMonitoring = () => {
    let lastTime = performance.now();
    let frameCount = 0;
    let totalFrameTime = 0;
    
    const measureFrame = () => {
      const now = performance.now();
      const frameTime = now - lastTime;
      lastTime = now;
      
      // Skip outliers (e.g., when tab was inactive)
      if (frameTime < 100) {
        frameCount++;
        totalFrameTime += frameTime;
        
        // Calculate average frame time over last 30 frames
        if (frameCount > 30) {
          const avgFrameTime = totalFrameTime / frameCount;
          // Estimate CPU usage: higher frame time = higher CPU usage
          // 16.7ms is ideal for 60fps, so we use that as a baseline
          const estimatedUsage = Math.min(Math.round((avgFrameTime / 33.3) * 50), 100);
          setCpuUsage(estimatedUsage);
          
          // Reset for next batch
          frameCount = 0;
          totalFrameTime = 0;
        }
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
  };

  // Function to estimate network activity
  const monitorNetwork = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.downlink) {
        // Convert Mbps to MBps (divide by 8)
        return Math.round(connection.downlink / 8 * 10) / 10;
      }
    }
    
    // Fallback: estimate based on resource timing
    const resources = performance.getEntriesByType('resource');
    const now = Date.now();
    let totalBytes = 0;
    
    // Sum up bytes transferred in the last sample
    resources.forEach(resource => {
      if ((resource as any).transferSize && resource.startTime > lastNetworkSample.time) {
        totalBytes += (resource as any).transferSize;
      }
    });
    
    // Calculate MB/s
    const seconds = (now - lastNetworkSample.time) / 1000;
    const mbps = seconds > 0 ? (totalBytes / 1024 / 1024) / seconds : 0;
    
    // Update last sample
    setLastNetworkSample({ time: now, bytes: totalBytes });
    
    return Math.min(Math.round(mbps * 10) / 10, 100);
  };

  // Initialize and update metrics
  useEffect(() => {
    // Start CPU monitoring
    startCPUMonitoring();
    
    // Set initial uptime to 0
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      // Update memory usage
      setMemoryUsage(getMemoryInfo());
      
      // Update network speed
      setNetworkSpeed(monitorNetwork());
      
      // Update disk usage (simulated - can't access real disk info in browser)
      setDiskUsage(prev => {
        const target = 67 + Math.random() * 2;
        return prev + (target - prev) * 0.02;
      });
      
      // Update uptime (real time since component mounted)
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-black border bg-opacity-40 p-4 font-mono hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
      <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
        <span className="animate-pulse">~$</span> SYSTEM.MONITOR
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-white" />
            <span className="text-white text-xs">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-800 rounded-full h-1">
              <div
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${cpuUsage}%` }}
              />
            </div>
            <span className="text-white text-xs font-mono w-8">{Math.round(cpuUsage)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-white" />
            <span className="text-white text-xs">RAM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-800 rounded-full h-1">
              <div
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${memoryUsage}%` }}
              />
            </div>
            <span className="text-white text-xs font-mono w-8">{Math.round(memoryUsage)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-white" />
            <span className="text-white text-xs">NET</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-800 rounded-full h-1">
              <div
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(networkSpeed * 10, 100)}%` }}
              />
            </div>
            <span className="text-white text-xs font-mono w-8">{networkSpeed.toFixed(1)}MB/s</span>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-2 mt-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">UPTIME:</span>
            <span className="text-white font-mono">{formatUptime(uptime)}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-400">STATUS:</span>
            <span className="text-white animate-pulse">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;