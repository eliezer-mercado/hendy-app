// api/activar.js — La app llama acá cuando el usuario ingresa su código Pro.
// Comprueba la firma del código (hecha por api/generar-codigo.js con tu
// ADMIN_CLAVE) y, si es válido y no venció, responde cuánto dura el Pro.

import crypto from "node:crypto";

const VALIDEZ_DIAS = 3; // días que el código se puede canjear desde que se generó
const DIAS_PRO = 30; // días de Pro que da cada código
const MS_DIA = 86400000;

function firmar(payload, secreto) {
  return crypto.createHmac("sha256", secreto).update(payload).digest("hex").slice(0, 8).toUpperCase();
}

function igual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "metodo_no_permitido" });
  }

  const secreto = process.env.ADMIN_CLAVE;
  if (!secreto || secreto.length < 12) {
    return res.status(500).json({ error: "servidor_sin_configurar" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "pedido_invalido" });
    }
  }

  // Normalizamos: mayúsculas, sin guiones ni espacios, sin el prefijo HND
  let raw = String((body && body.codigo) || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (raw.startsWith("HND")) raw = raw.slice(3);
  if (raw.length !== 16) {
    return res.status(400).json({ error: "codigo_invalido" });
  }

  const payload = raw.slice(0, 8);
  const firma = raw.slice(8);
  if (!igual(firma, firmar(payload, secreto))) {
    return res.status(400).json({ error: "codigo_invalido" });
  }

  const diaEmision = parseInt(payload.slice(0, 4), 36);
  const hoy = Math.floor(Date.now() / MS_DIA);
  const edad = hoy - diaEmision;
  if (!Number.isFinite(diaEmision) || edad < 0 || edad > VALIDEZ_DIAS) {
    return res.status(400).json({ error: "codigo_vencido" });
  }

  return res.status(200).json({
    ok: true,
    dias: DIAS_PRO,
    hasta: Date.now() + DIAS_PRO * MS_DIA,
  });
}
