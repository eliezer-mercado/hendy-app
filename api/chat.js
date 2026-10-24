export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Falta la configuración de OPENAI_API_KEY' });
    }

    const response = await fetch('https://openai.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Sos Hendy Coach, un asistente financiero experto con IA. Brindás respuestas claras, dinámicas, precisas y personalizadas sobre finanzas.' },
          ...(history || []),
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ response: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno en el servidor del Coach' });
  }
}
