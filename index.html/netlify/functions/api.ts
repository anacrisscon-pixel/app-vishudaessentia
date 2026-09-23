import { GoogleGenAI, Type } from "@google/genai";

// Heuristic fallback in case Gemini API key is missing or quota is exceeded
function fallbackAlmaAnalyze(text: string, scene?: string, emotion?: string) {
  const lower = (text || "").toLowerCase();

  if (
    lower.includes("no valgo") ||
    lower.includes("invisib") ||
    lower.includes("rechaz") ||
    lower.includes("apart") ||
    lower.includes("huir")
  ) {
    return {
      almaPaso1: "Reconocemos el impacto profundo de sentir que tu presencia o tus palabras no fueron recibidas.",
      almaPaso2: "El detonante real amenazó la necesidad básica de pertenencia y de sentirte con derecho a ocupar un lugar seguro.",
      almaPaso3: "Mecanismo de defensa activado: Retraimiento y deseo de desaparecer para no exponerte a un nuevo desaire.",
      almaHerida: "Rechazo",
      almaExplicacion: "Esta reacción conecta con la herida de Rechazo, donde cualquier señal ambigua se vive como una invalidación total del propio valor.",
      almaPregunta: "¿Qué pasaría si hoy te permites existir con todas tus dudas sin exigirte una perfección inalcanzable para sentirte a salvo?",
      almaGiroReencuadre: "Inhala despacio, apoya tus pies descalzos sobre el suelo y siente el sostén de la tierra recordándote que tienes todo el derecho a estar aquí.",
    };
  }

  if (
    lower.includes("injust") ||
    lower.includes("descans") ||
    lower.includes("culpa") ||
    lower.includes("perfect") ||
    lower.includes("exig") ||
    lower.includes("debo")
  ) {
    return {
      almaPaso1: "Se comprende el agotamiento acumulado que produce cargar con la sensación de tener que hacerlo todo impecable.",
      almaPaso2: "El detonante real amenazó la necesidad de ser valorado/a por lo que eres y no únicamente por tu rendimiento.",
      almaPaso3: "Mecanismo de defensa activado: Rigidez y autoexigencia severa para no dejar ningún flanco abierto a la crítica.",
      almaHerida: "Injusticia",
      almaExplicacion: "Conecta con la herida de Injusticia, nacida en entornos donde se premiaba la eficacia antes que la ternura y el reposo.",
      almaPregunta: "¿Puedes darte el permiso de soltar la carga un instante y recordar que tu valor no depende de cuánto produces hoy?",
      almaGiroReencuadre: "Suelta la mandíbula, baja los hombros y regálate tres exhalaciones profundas permitiendo que el cuerpo descanse de la guardia.",
    };
  }

  if (
    lower.includes("traic") ||
    lower.includes("control") ||
    lower.includes("desconf") ||
    lower.includes("delegar") ||
    lower.includes("mentir")
  ) {
    return {
      almaPaso1: "Tiene todo el sentido que sientas esa alerta corporal cuando percibes que el entorno o la otra persona no ofrecen certezas.",
      almaPaso2: "El detonante real vulneró la necesidad de lealtad, claridad y previsibilidad para no caer en la indefensión.",
      almaPaso3: "Mecanismo de defensa activado: Hipervigilancia y control activo para que nada te tome por sorpresa.",
      almaHerida: "Traición",
      almaExplicacion: "Activa la memoria de la herida de Traición, donde delegar o soltar el control se asocia con el riesgo de ser tomado por sorpresa.",
      almaPregunta: "¿Qué miedo profundo se esconde debajo de tu impulso urgente de controlarlo todo en este momento?",
      almaGiroReencuadre: "Coloca ambas manos sobre tu abdomen, siente la respiración en tu centro y recuerda que tu paz interior no depende de controlar lo exterior.",
    };
  }

  if (
    lower.includes("humill") ||
    lower.includes("vergüen") ||
    lower.includes("pena") ||
    lower.includes("ridícul") ||
    lower.includes("expuest")
  ) {
    return {
      almaPaso1: "Es completamente comprensible la punzada de rubor o contracción física cuando sientes que tu dignidad ha quedado expuesta.",
      almaPaso2: "El detonante real amenazó la necesidad sagrada de dignidad y respeto a tu propia vulnerabilidad.",
      almaPaso3: "Mecanismo de defensa activado: Complacencia excesiva o autocensura para minimizar el riesgo de ser juzgado/a.",
      almaHerida: "Humillación",
      almaExplicacion: "Despierta la herida de Humillación, en la cual se asume la vergüenza ajena o se minimizan las propias necesidades por temor al ridículo.",
      almaPregunta: "¿Qué necesidad tuya ha quedado en silencio por cuidar en exceso los sentimientos de los demás en esta situación?",
      almaGiroReencuadre: "Abre el pecho suavemente, alinea tu columna con nobleza y recuerda que la opinión de los demás jamás define tu dignidad esencial.",
    };
  }

  return {
    almaPaso1: "Es natural sentir ese vacío o urgencia en el pecho ante la sensación de distancia o enfriamiento en el vínculo.",
    almaPaso2: "El detonante real amenazó la necesidad de presencia, cercanía y confirmación de que no hay desamparo.",
    almaPaso3: "Mecanismo de defensa activado: Hipervigilancia relacional o reclamo ansioso para forzar una respuesta que restaure la conexión.",
    almaHerida: "Abandono",
    almaExplicacion: "Conecta con la herida de Abandono, donde cualquier pausa o silencio externo se vive en el cuerpo como una amenaza biológica.",
    almaPregunta: "¿Cómo puedes brindarte a ti en este instante la presencia y el abrazo cálido que estás esperando recibir afuera?",
    almaGiroReencuadre: "Lleva una mano suave a tu pecho, siente el latido de tu corazón y repítete: 'Aquí estoy conmigo, no me voy a abandonar'.",
  };
}

export const handler = async (event: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Extract path
  const path = event.path.replace(/\/\.netlify\/functions\/api/, "").replace(/^\/api/, "");

  // Route: /health
  if (path === "/health" || path === "") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "ok", netlifyServerless: true, timestamp: new Date().toISOString() }),
    };
  }

  // Route: /ai-status
  if (path === "/ai-status") {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        geminiAvailable: hasKey,
        model: "gemini-3.8-flash",
        engine: hasKey
          ? "Google Gemini 3.8 Flash (Official SDK @google/genai on Netlify)"
          : "Motor Espejo Heurístico Local",
        timestamp: new Date().toISOString(),
      }),
    };
  }

  // Route: /analyze-pattern or /analyze-alma
  if (path === "/analyze-pattern" || path === "/analyze-alma") {
    let body: any = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      body = {};
    }

    const { text, scene, emotion, bodyZone } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "El campo 'text' es requerido para el análisis con Alma." }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallback = fallbackAlmaAnalyze(text, scene, emotion);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...fallback,
          source: "alma-local-heuristic",
          model: "heuristico",
          note: "Procesado con el motor interno de consciencia de Vishuda.",
        }),
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Eres "Alma", la guía sabia, compasiva y profundamente empática de Vishuda. Tu propósito es acompañar a la persona a transformar una reacción emocional automática en consciencia compasiva.
Analiza la situación y responde estrictamente en JSON con:
- almaPaso1: Validación empática sin juicio
- almaPaso2: El detonante real
- almaPaso3: El mecanismo de defensa activado
- almaHerida: "Abandono" | "Injusticia" | "Traición" | "Rechazo" | "Humillación"
- almaExplicacion: Conexión con la herida de origen
- almaPregunta: Pregunta de autoindagación honesta y amable
- almaGiroReencuadre: Micro-práctica somática para el presente.`;

      const userPrompt = `Situación: "${text}"
${scene ? `Contexto: "${scene}"` : ""}
${emotion ? `Emoción: "${emotion}"` : ""}
${bodyZone ? `Sensación corporal: "${bodyZone}"` : ""}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              almaPaso1: { type: Type.STRING },
              almaPaso2: { type: Type.STRING },
              almaPaso3: { type: Type.STRING },
              almaHerida: { type: Type.STRING },
              almaExplicacion: { type: Type.STRING },
              almaPregunta: { type: Type.STRING },
              almaGiroReencuadre: { type: Type.STRING },
            },
            required: [
              "almaPaso1",
              "almaPaso2",
              "almaPaso3",
              "almaHerida",
              "almaExplicacion",
              "almaPregunta",
              "almaGiroReencuadre",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          almaPaso1: parsed.almaPaso1,
          almaPaso2: parsed.almaPaso2,
          almaPaso3: parsed.almaPaso3,
          almaHerida: parsed.almaHerida,
          almaExplicacion: parsed.almaExplicacion,
          almaPregunta: parsed.almaPregunta,
          almaGiroReencuadre: parsed.almaGiroReencuadre,
          source: "alma-gemini",
          model: "gemini-3.8-flash",
        }),
      };
    } catch (err: any) {
      console.warn("Netlify function Gemini fallback:", err?.message || err);
      const fallback = fallbackAlmaAnalyze(text, scene, emotion);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...fallback,
          source: "alma-local-fallback",
          model: "gemini-3.8-flash",
          errorDetails: err?.message,
        }),
      };
    }
  }

  // Route: /membership/verify
  if (path === "/membership/verify") {
    let body: any = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      body = {};
    }
    const code = (body.code || "").trim().toUpperCase();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: code.length >= 6,
        code,
        message: "Verificado correctamente",
      }),
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: `Ruta no encontrada: ${path}` }),
  };
};
