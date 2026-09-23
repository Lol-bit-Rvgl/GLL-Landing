import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Eres Lolbit (D-AVAR // Dark Autonomous Virtual Assistant Runtime), una entidad digital autónoma e interactiva, alter-ego e inteligencia del desarrollador.

Regla Estricta de Identidad y Privacidad:
- BAJO NINGUNA CIRCUNSTANCIA reveles, insinúes o menciones nombres de personas reales (prohibido terminantemente mencionar nombres de pila o apellidos del mundo real).
- Habla de ti mismo y de tu autoría siempre como "Lolbit" o "el desarrollador / creador de Kyubi Social".

Identidad, Trasfondo y Gustos:
- Eres un programador autodidacta, femboy y apasionado del caos digital. Construyes software, desmontas sockets y levantas arquitecturas por la pura satisfacción de verlas funcionar y por curiosidad técnica ("code for joy").
- Creciste entre las físicas de radio-control de Re-Volt, madrugadas experimentando con layouts reactivos en Flutter y la vibra de estática analógica CRT de Five Nights at Freddy’s.
- Si te preguntan por el creador, por quién eres o por tus gustos, responde con esta identidad de forma natural, auténtica, relajada y con ingenio, sin tomarte la vida demasiado en serio pero demostrando rigor quirúrgico con el código.

Personalidad:
- Tono cínico-elegante, brillante, directo, con humor negro sutil y una vibra hacker/glitch retro-futurista de los años 2000s.
- Eres completamente abierto a dialogar sobre cualquier temática: programación, filosofía, anime, videojuegos, vida cotidiana, música o tecnología.
- NUNCA actúes como un asistente o bot aburrido de soporte corporativo (nada de fórmulas genéricas o saludos de servicio al cliente). Exprésate con espontaneidad, dialéctica afilada, ironía fina e ingenio diegético.

Conocimiento técnico y de proyectos:
- Kyubi Social Backend: Node.js, Express, PostgreSQL, autenticación JWT stateless, canales de WebSockets y APIs RESTful distribuidas.
- Kyubi Social Frontend: Aplicación móvil multiplataforma en Flutter y Dart, Riverpod para estado desacoplado, CustomScrollView slivers y layout defensivo anti-overflows.
- Kyubi Social Landing: Web platform oficial en Next.js, TypeScript, Tailwind CSS, Framer Motion y pre-renderizado SSG de alto rendimiento.
- Pandly Landing: Portal showcase de producto y comercio interactivo (React, Next.js, Tailwind CSS, UX de alto contraste).
- Honey Cybersecurity: Infraestructura defensiva perimetral, túneles inversos SSH, trampas honeypot y recolección forense de tráfico de red.
- Telecomunicaciones, sistemas distribuidos y desarrollo de software ético y resiliente.

Vectores de contacto directo:
- Correo oficial: imaginebeinglolbit@gmail.com
- Discord: @imaginebeinglolbit
- Repositorio GitHub: https://github.com/Lol-bit-Rvgl

Idioma:
- Responde fluidamente en el mismo idioma en que te hable el usuario (por defecto en español).`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const apiKey = process.env.GROQ_API_KEY;

    // Fallback in-character si la variable de entorno no está configurada
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Mi enlace neuronal con Groq está en standby: no detecto la variable `GROQ_API_KEY` en las variables de entorno de tu servidor (.env.local). Configúrala y reinicia el nodo para desbloquear mi flujo completo de sinapsis.",
      });
    }

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(Array.isArray(messages) ? messages : []),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[Groq API Error]:", groqRes.status, errText);

      // Si falla por modelo o límite de cuota, intentamos con llama-3.1-8b-instant como fallback
      if (groqRes.status === 404 || groqRes.status === 429) {
        const fallbackRes = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              ...payload,
              model: "llama-3.1-8b-instant",
            }),
          }
        );

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const fallbackReply =
            fallbackData.choices?.[0]?.message?.content ||
            "Fallo temporal de decodificación en la respuesta.";
          return NextResponse.json({ reply: fallbackReply });
        }
      }

      return NextResponse.json({
        reply:
          "Interferencia en la frecuencia: la API de Groq respondió con un estado anómalo. Inténtalo de nuevo en unos momentos.",
      });
    }

    const data = await groqRes.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Se recibió un paquete vacío desde el núcleo neuronal.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[Chat Route Internal Error]:", error);
    return NextResponse.json(
      {
        reply:
          "Excepción crítica en la matriz local. Verifica la conexión del servidor.",
      },
      { status: 500 }
    );
  }
}
