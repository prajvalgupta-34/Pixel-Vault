import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENSEA_API_KEY = Deno.env.get('VITE_OPENSEA_API_KEY');
const OPENSEA_API_URL = 'https://api.opensea.io/api/v2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const { pathname, searchParams } = url;

    const cleanedPathname = pathname.replace('/functions/v1/opensea-proxy', '');
    const fetchUrl = `${OPENSEA_API_URL}${cleanedPathname}?${searchParams.toString()}`;

    const response = await fetch(fetchUrl, {
      headers: {
        'X-API-KEY': OPENSEA_API_KEY || '',
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: `OpenSea API error: ${response.status}`, details: errorText }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});