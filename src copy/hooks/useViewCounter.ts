
import { useState, useEffect } from 'react';

interface ViewCountData {
  count: number;
  loading: boolean;
  error: boolean;
}

export const useViewCounter = (): ViewCountData => {
  const [viewData, setViewData] = useState<ViewCountData>({
    count: 0,
    loading: true,
    error: false
  });

  useEffect(() => {
    const registerView = async () => {
      try {
        const response = await fetch('/api/view-counter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to register view');
        }

        const data = await response.json();
        
        setViewData({
          count: data.count,
          loading: false,
          error: false
        });
      } catch (error) {
        console.error('Error registering view:', error);
        
        try {
          const currentTime = Date.now();
          
          const storedData = localStorage.getItem('jxks_view_data');
          let viewCount = 755;
          let lastVisit = 0;
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            viewCount = parsedData.count || viewCount;
            lastVisit = parsedData.lastVisit || 0;
          }
          
          const TEN_HOURS_MS = 10 * 60 * 60 * 1000;
          const isNewVisit = !lastVisit || (currentTime - lastVisit) > TEN_HOURS_MS;
          
          if (isNewVisit) {
            viewCount += 1;
            localStorage.setItem('jxks_view_data', JSON.stringify({
              count: viewCount,
              lastVisit: currentTime
            }));
          }
          
          setViewData({
            count: viewCount,
            loading: false,
            error: false
          });
        } catch (localError) {
          setViewData({
            count: 755,
            loading: false,
            error: true
          });
        }
      }
    };

    registerView();
  }, []);

  return viewData;
};