import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const TEN_HOURS_MS = 10 * 60 * 60 * 1000;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const ip = event.headers['x-forwarded-for'] || 
               event.headers['client-ip'] || 
               'unknown';
    
    const visitorIp = Array.isArray(ip) ? ip[0] : ip;
    const currentTime = Date.now();
    
    const { data: counter, error: counterError } = await supabase
      .from('counters')
      .select('*')
      .eq('id', 'page_views')
      .single();
    
    if (counterError && counterError.code !== 'PGRST116') {
      throw counterError;
    }
    
    if (!counter) {
      const { data: newCounter, error: createError } = await supabase
        .from('counters')
        .insert([
          { id: 'page_views', count: 1, visitors: { [visitorIp]: currentTime } }
        ])
        .select()
        .single();
      
      if (createError) throw createError;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ count: 1 })
      };
    }
    
    const visitors = counter.visitors || {};
    const lastVisit = visitors[visitorIp];
    const isNewVisit = !lastVisit || (currentTime - lastVisit) > TEN_HOURS_MS;
    
    if (isNewVisit) {
      const newCount = (counter.count || 0) + 1;
      visitors[visitorIp] = currentTime;
      
      const { error: updateError } = await supabase
        .from('counters')
        .update({ 
          count: newCount,
          visitors: visitors
        })
        .eq('id', 'page_views');
      
      if (updateError) throw updateError;
      
      return {
        statusCode: 200,
        body: JSON.stringify({ count: newCount })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ count: counter.count || 0 })
    };
  } catch (error) {
    console.error('Error processing view:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};