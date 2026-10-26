// api/chat.js — Función serverless de Vercel
// Recibe los pedidos de la app, les agrega la API key (que queda oculta en el
// servidor) y los reenvía a la API de Anthropic.

// Límites para evitar que alguien use este endpoint como proxy gratuito
const MODELO_PERMITIDO = "claude-sonnet-5-5";
const MAX_TOKENS = 2000; // margen extra por si el modelo usa tokens para razonar
const MAX_CARACTERES = 6000;

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // --- AUTO-TEST ---
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

    const { messages } = body || {};

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
      max_tokens: MAX_TOKENS,
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

    // Los modelos nuevos pueden devolver primero un bloque de "razonamiento"
    // y recién después el bloque de texto. La app lee content[0].text, así que
    // acá dejamos SOLO el texto, en el primer lugar, siempre.
    const bloques = Array.isArray(data.content) ? data.content : [];
    const texto = bloques
      .filter((b) => b && b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("\n\n")
      .trim();

    if (!texto) {
      // Si no hay texto, devolvemos un aviso visible (en vez de una burbuja vacía)
      const tipos = bloques.map((b) => b && b.type).join(",") || "ninguno";
      console.error("Respuesta sin texto. stop_reason:", data.stop_reason, "tipos:", tipos);
      return res.status(200).json({
        content: [
          {
            type: "text",
            text: "No pude armar la respuesta (stop: " + data.stop_reason + ", bloques: " + tipos + "). Intentá de nuevo.",
          },
        ],
      });
    }

    return res.status(200).json({
      id: data.id,
      role: data.role,
      model: data.model,
      stop_reason: data.stop_reason,
      content: [{ type: "text", text: texto }],
    });
  } catch (e) {
    console.error("Error en /api/chat:", e);
    return res.status(500).json({ error: "Error interno del servidor", detalle: String(e) });
  }
}
