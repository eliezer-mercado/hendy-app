// api/generar-codigo.js — SOLO PARA VOS (dueño de Hendy)
// Genera un código de activación Pro firmado. Se usa así, desde una ventana de
// incógnito del navegador:
//   https://hendy-app.vercel.app/api/generar-codigo?clave=TU_ADMIN_CLAVE
// Respuesta: {"codigo":"HND-XXXX-XXXX-XXXX-XXXX", ...}
//
// El código no se guarda en ningún lado: se firma con tu ADMIN_CLAVE (variable de
// entorno de Vercel) y api/activar.js comprueba la firma. Vale por unos 3 días
// para canjearse; al canjearlo activa 30 días de Pro.

import crypto from "node:crypto";

const VALIDEZ_DIAS = 3;
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

  const secreto = process.env.ADMIN_CLAVE;
  if (!secreto || secreto.length < 12) {
    return res.status(500).json({
      error: "Falta ADMIN_CLAVE en Vercel (mínimo 12 caracteres)",
    });
  }

  const clave = String((req.query && req.query.clave) || "");
  if (!clave || !igual(clave, secreto)) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const dia = Math.floor(Date.now() / MS_DIA).toString(36).toUpperCase().padStart(4, "0");
  const azar = crypto.randomBytes(2).toString("hex").toUpperCase(); // 4 caracteres
  const payload = dia + azar; // 8 caracteres
  const raw = payload + firmar(payload, secreto); // 16 caracteres
  const codigo = "HND-" + raw.match(/.{4}/g).join("-");

  return res.status(200).json({
    codigo,
    canjeable_hasta: new Date(Date.now() + VALIDEZ_DIAS * MS_DIA).toISOString(),
    dias_de_pro: 30,
  });
}
