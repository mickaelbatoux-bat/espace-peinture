// functions/api/data.js
// Endpoint GET  /api/data  → lit les données depuis KV
// Endpoint POST /api/data  → écrit les données dans KV
// Le namespace KV est lié sous le nom ESPACE_PEINTURE_KV dans Cloudflare Pages Settings

const KV_KEY = "btpcfa_state";
const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export async function onRequestGet({ env }) {
  try {
    const raw = await env.ESPACE_PEINTURE_KV.get(KV_KEY);
    if (!raw) {
      return new Response(JSON.stringify({ ok: true, data: null }), {
        headers: CORS,
      });
    }
    return new Response(JSON.stringify({ ok: true, data: JSON.parse(raw) }), {
      headers: CORS,
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: CORS,
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    await env.ESPACE_PEINTURE_KV.put(KV_KEY, JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: CORS,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
