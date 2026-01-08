import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOTION_API_VERSION = '2022-06-28';

const extractNotionId = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Accept plain UUID (with or without hyphens)
  if (/^[0-9a-fA-F]{32}$/.test(trimmed)) return trimmed;
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(trimmed)) {
    return trimmed;
  }

  // Accept full Notion URL: extract the 32-hex ID anywhere in the string
  const match32 = trimmed.match(/[0-9a-fA-F]{32}/);
  if (match32) return match32[0];

  const matchUuid = trimmed.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  if (matchUuid) return matchUuid[0];

  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
    const NOTION_DATABASE_ID_RAW = Deno.env.get('NOTION_DATABASE_ID');

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID_RAW) {
      console.error('Missing Notion credentials');
      return new Response(
        JSON.stringify({ error: 'Notion credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const NOTION_DATABASE_ID = extractNotionId(NOTION_DATABASE_ID_RAW);
    if (!NOTION_DATABASE_ID) {
      console.error('Invalid NOTION_DATABASE_ID format');
      return new Response(
        JSON.stringify({
          error:
            'NOTION_DATABASE_ID inválido. Use o ID do database (32 caracteres) ou cole o link completo do database.',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
