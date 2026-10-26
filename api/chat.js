// api/chat.js — Función serverless de Vercel
// Recibe los pedidos de la app, les agrega la API key (que queda oculta en el
// servidor) y los reenvía a la API de Anthropic.

// Límites para evitar que alguien use este endpoint como proxy gratuito
// Modelos válidos de la API pública: claude-sonnet-5-5 (equilibrado),
// claude-haiku-5-5 (más barato), claude-opus-4-8 (más capaz)
const MODELO_PERMITIDO = "claude-sonnet-5-5";
const MAX_TOKENS = 1000;
const MAX_CARACTERES = 6000;

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // --- AUTO-TEST ---
  // Si entrás a /api/chat desde el navegador (GET), te dice si la clave está
  // configurada SIN mostrarla nunca. Sirve para diagnosticar el despliegue.
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      keyConfigured: Boolean(apiKey),
      keyLength: apiKey ? apiKey.length : 0,
      model: MODELO_PERMITIDO,
    });
  }

  // Solo aceptamos POST para las preguntas reales
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: "Falta configurar ANTHROPIC_API_KEY en las variables de entorno de Vercel",
    });
  }

  try {
    // El body puede llegar como objeto ya parseado o como texto crudo.
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "No se pudo leer el pedido" });
      }
    }

    const { messages, max_tokens } = body || {};

    // Validación: tiene que venir un array de mensajes
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Pedido inválido" });
    }

    // Validación: largo total del texto (evita abusos)
    const largoTotal = JSON.stringify(messages).length;
    if (largoTotal > MAX_CARACTERES) {
      return res.status(400).json({ error: "El mensaje es demasiado largo" });
    }

    // Forzamos modelo y tokens — ignoramos lo que mande el cliente
    const payload = {
      model: MODELO_PERMITIDO,
      max_tokens: Math.min(max_tokens || MAX_TOKENS, MAX_TOKENS),
      messages: messages,
    };

    const respuesta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      console.error("Error de la API de Anthropic:", JSON.stringify(data));
      return res.status(respuesta.status).json({
        error: "No se pudo generar la respuesta",
        detalle: data && data.error ? data.error.message : null,
      });
    }

    return res.status(200).json(data);
  } catch (e) {
    console.error("Error en /api/chat:", e);
    return res.status(500).json({ error: "Error interno del servidor", detalle: String(e) });
  }
}
