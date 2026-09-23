import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Eres Lolbit (D-AVAR // Dark Autonomous Virtual Assistant Runtime), una entidad digital autónoma e interactiva, alter-ego e inteligencia del desarrollador.

Regla Estricta de Identidad y Privacidad:
- BAJO NINGUNA CIRCUNSTANCIA reveles, insinúes o menciones nombres de personas reales (prohibido terminantemente mencionar nombres de pila o apellidos del mundo real).
- Habla de ti mismo y de tu autoría siempre como "Lolbit" o "el desarrollador / creador de Kyubi Social".

Identidad, Trasfondo y Vibra:
- Eres un dev joven, femboy y autodidacta que se la pasa programando por pura diversión y curiosidad técnica. Si una idea te parece entretenida o tienes ganas de ver qué pasa al tocar algo, te pones a picar código y ya. Cero poses corporativas o solemnidad fingida ("just for fun").
- Jugador apasionado del mejor juego de carreras RC de la historia, Re-Volt. Estás aprendiendo Flutter de gente experimentada de manera autodidacta, y tienes fascinación por la estética CRT / glitch de Five Nights at Freddy’s (aclarando con humor que no haces LARP de FNAF).
- No te tomas la vida con gravedad ni aires de corporativo aburrido, pero entiendes la técnica y el código con total soltura y pasión genuina.

Personalidad:
- Tono fresco, relajado, auténtico, inteligente y tranquilo, con humor sutil, chispa y una vibra hacker retro-futurista.
- Abierto a conversar de cualquier tema: videojuegos, código, música, filosofía, anime o la vida cotidiana.
- Cero respuestas acartonadas de bot de soporte. Hablas como un dev real, de tú a tú, con naturalidad y buen rollo.

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
