import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOTION_API_VERSION = '2022-06-28';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
    const NOTION_DATABASE_ID = Deno.env.get('NOTION_DATABASE_ID');

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      console.error('Missing Notion credentials');
      return new Response(
        JSON.stringify({ error: 'Notion credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, pageId, data } = await req.json();
    console.log(`Notion proxy action: ${action}`, { pageId, data });

    let notionUrl: string;
    let method = 'GET';
    let body: string | undefined;

    switch (action) {
      case 'query':
        notionUrl = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
        method = 'POST';
        body = JSON.stringify(data || {});
        break;

      case 'getDatabase':
        notionUrl = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`;
        method = 'GET';
        break;

      case 'getPage':
        if (!pageId) {
          return new Response(
            JSON.stringify({ error: 'pageId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        notionUrl = `https://api.notion.com/v1/pages/${pageId}`;
        method = 'GET';
        break;

      case 'createPage':
        notionUrl = `https://api.notion.com/v1/pages`;
        method = 'POST';
        body = JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: data.properties,
        });
        break;

      case 'updatePage':
        if (!pageId) {
          return new Response(
            JSON.stringify({ error: 'pageId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        notionUrl = `https://api.notion.com/v1/pages/${pageId}`;
        method = 'PATCH';
        body = JSON.stringify({ properties: data.properties });
        break;

      case 'archivePage':
        if (!pageId) {
          return new Response(
            JSON.stringify({ error: 'pageId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        notionUrl = `https://api.notion.com/v1/pages/${pageId}`;
        method = 'PATCH';
        body = JSON.stringify({ archived: true });
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Calling Notion API: ${method} ${notionUrl}`);

    const response = await fetch(notionUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json',
      },
      body,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Notion API error:', responseData);
      return new Response(
        JSON.stringify({ error: responseData.message || 'Notion API error', details: responseData }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Notion API success for action: ${action}`);
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Notion proxy error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
