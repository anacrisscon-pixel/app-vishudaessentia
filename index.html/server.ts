import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static sounds directly with audio streaming support (range requests)
app.use("/sounds", express.static(path.join(__dirname, "public", "sounds")));

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI();
    } catch {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    }
  }
  return aiClient;
}

// System patterns for fallback and classification
const VISHUDA_PATTERNS = [
  {
    id: "conexion",
    title: "Conservar la conexión a costa de ti",
    wound: "Miedo al abandono o pérdida del vínculo",
    summary: "Priorizas la reacción del otro o cedes para no arriesgar la cercanía.",
    defaultSolution: "Recuerda que cuidar el vínculo no requiere anularte. Haz una pausa y expresa una preferencia pequeña sin disculparte por tenerla.",
  },
  {
    id: "aprobacion",
    title: "Buscar confirmación para sentir seguridad",
    wound: "Miedo al rechazo o sensación de no ser suficiente",
    summary: "Tu tranquilidad depende de señales externas que confirmen que todo está en orden.",
    defaultSolution: "Antes de revisar el teléfono o pedir una confirmación, pon tu mano en el pecho, respira y regálate tú esa certeza interna.",
  },
  {
    id: "control",
    title: "Controlar para calmar la incertidumbre",
    wound: "Inseguridad básica o hiperalerta",
    summary: "Intentas dirigir, prever o solucionar cada detalle para no sentir el desamparo de no saber.",
    defaultSolution: "Distingue lo que depende de ti hoy de lo que está fuera de tu alcance. Elige soltar el control sobre un detalle menor y observa qué sientes.",
  },
  {
    id: "evitacion",
    title: "Alejarte para no sentirte vulnerable",
    wound: "Miedo al dolor o a ser expuesto/a y juzgado/a",
    summary: "Te cierras, postergas o desapareces de las conversaciones difíciles para protegerte.",
    defaultSolution: "No necesitas exponerte por completo. Quédate 30 segundos más en la conversación con respiraciones lentas antes de retirarte.",
  },
  {
    id: "defensa",
    title: "Protegerte antes de ser herido/a",
    wound: "Herida de desvalorización o crítica temprana",
    summary: "Reaccionas rápido justificándote o contraatacando cuando percibes una posible amenaza.",
    defaultSolution: "Nota la tensión en tu mandíbula u hombros. Antes de responder, exhala largo y pregúntate: ¿esta persona me está atacando o solo comunicando algo?",
  },
  {
    id: "autosuficiencia",
    title: "No necesitar a nadie para estar a salvo",
    wound: "Desconfianza o decepción relacional previa",
    summary: "Resuelves todo por tu cuenta porque depender de otros se siente peligroso o indigno.",
    defaultSolution: "Aceptar ayuda no disminuye tu valor ni tu autonomía. Prueba pedir una colaboración simple hoy y permite que te acompañen.",
  },
  {
    id: "limites",
    title: "Ceder para evitar el conflicto",
    wound: "Temor al enojo ajeno o a la confrontación",
    summary: "Dices sí queriendo decir no, acumulando cansancio o resentimiento silencioso.",
    defaultSolution: "Un límite sano es un acto de amor hacia ti y de claridad hacia el otro. Puedes decir: 'En este momento no me es posible, gracias por comprender'.",
  },
];

// Alma Introspection & Heuristic Engine
function fallbackAlmaAnalyze(text: string, scene?: string, emotion?: string) {
  const lower = `${text || ""} ${scene || ""} ${emotion || ""}`.toLowerCase();

  // 1. RECHAZO
  if (
    lower.includes("rechaz") ||
    lower.includes("impostor") ||
    lower.includes("suficiente") ||
    lower.includes("vergüenza") ||
    lower.includes("critica") ||
    lower.includes("juzg") ||
    lower.includes("escapar") ||
    lower.includes("huir")
  ) {
    return {
      almaPaso1: "Es completamente comprensible sentir esa incomodidad y deseo de encogerte cuando sientes que tu valor está en tela de juicio.",
      almaPaso2: "El detonante real tocó la necesidad básica de pertenencia y aceptación incondicional, sintiendo el riesgo de no tener derecho a ocupar tu lugar.",
      almaPaso3: "Mecanismo de defensa activado: Aislamiento preventivo y autoexigencia para evitar ser el foco de posibles juicios ajenos.",
      almaHerida: "Rechazo",
      almaExplicacion: "Esta reacción conecta con la herida de Rechazo, donde cualquier señal ambigua se interpreta como una amenaza a la propia existencia.",
      almaPregunta: "¿Qué pasaría si hoy te permites existir con todas tus dudas sin exigirte una perfección inalcanzable para sentirte a salvo?",
      trigger: "El detonante tocó la necesidad de pertenencia y derecho a existir sin juicios.",
      solution: "Haz una pausa somática, siente el apoyo de tus pies y recuerda que no necesitas ganarte el permiso para estar aquí.",
      reflection: "¿Qué parte de ti necesita saber que tu existencia ya es valiosa?",
    };
  }

  // 2. INJUSTICIA
  if (
    lower.includes("injust") ||
    lower.includes("descans") ||
    lower.includes("culpa") ||
    lower.includes("perfect") ||
    lower.includes("exig") ||
    lower.includes("debo") ||
    lower.includes("equivoc") ||
    lower.includes("rendim")
  ) {
    return {
      almaPaso1: "Se reconoce el agotamiento y la tensión que produce cargar con la sensación de tener que hacerlo todo impecable.",
      almaPaso2: "El detonante real amenazó la necesidad de ser valorado/a por lo que eres y no únicamente por tu rendimiento o utilidad.",
      almaPaso3: "Mecanismo de defensa activado: Rigidez y autocontrol severo, cerrando el espacio a la vulnerabilidad para no cometer ningún desliz.",
      almaHerida: "Injusticia",
      almaExplicacion: "Conecta con la herida de Injusticia, nacida en entornos donde se premiaba la frialdad o la eficacia antes que la ternura y el descanso.",
      almaPregunta: "¿Puedes darte el permiso de soltar la carga un instante y recordar que tu valor no depende de cuánto produces hoy?",
      trigger: "El miedo a cometer un error activó la necesidad de sobreesfuerzo y perfeccionismo.",
      solution: "Inhala profundo y suelta los hombros: regálate 5 minutos de descanso sin justificación.",
      reflection: "Tu dignidad no es un premio a pagar con tu salud biológica.",
    };
  }

  // 3. TRAICIÓN
  if (
    lower.includes("traic") ||
    lower.includes("control") ||
    lower.includes("desconf") ||
    lower.includes("delegar") ||
    lower.includes("mentir") ||
    lower.includes("engaño") ||
    lower.includes("garant")
  ) {
    return {
      almaPaso1: "Tiene todo el sentido que sientas esa alerta corporal cuando percibes que el entorno o la otra persona no ofrecen certezas.",
      almaPaso2: "El detonante real vulneró la necesidad de seguridad, lealtad y previsibilidad para no caer en la indefensión.",
      almaPaso3: "Mecanismo de defensa activado: Hipervigilancia y control activo, anticipando escenarios para que nada te tome por sorpresa.",
      almaHerida: "Traición",
      almaExplicacion: "Se relaciona con la herida de Traición, donde se aprendió que confiar ciegamente implicaba quedar a merced de la decepción.",
      almaPregunta: "¿Qué parte de ti necesita saber que hoy tienes recursos propios para cuidarte, incluso si no puedes controlar cada variable externa?",
      trigger: "La falta de certeza o lealtad activó la alerta defensiva de hipervigilancia.",
      solution: "Suelta por unos minutos la necesidad de fiscalizar el entorno y regresa a tu propia respiración.",
      reflection: "Controlar da alivio inmediato, pero confiar en tu capacidad de respuesta te da paz duradera.",
    };
  }

  // 4. HUMILLACIÓN
  if (
    lower.includes("humill") ||
    lower.includes("complac") ||
    lower.includes("agradar") ||
    lower.includes("pena") ||
    lower.includes("ridicul") ||
    lower.includes("cargar") ||
    lower.includes("salvar")
  ) {
    return {
      almaPaso1: "Se valida esa sensación de pesadez que surge cuando se intenta mantener el equilibrio de los demás a costa del propio bienestar.",
      almaPaso2: "El detonante real puso en juego la necesidad de dignidad y respeto hacia los propios límites y deseos individuales.",
      almaPaso3: "Mecanismo de defensa activado: Complacencia extrema y anulación personal, buscando ser indispensable para asegurar afecto.",
      almaHerida: "Humillación",
      almaExplicacion: "Detona la herida de Humillación, caracterizada por el temor inconsciente a avergonzar al entorno o a ser considerado/a egoísta.",
      almaPregunta: "¿Qué necesidad tuya ha quedado en silencio por cuidar los sentimientos de los demás en esta situación?",
      trigger: "El temor a la desaprobación o vergüenza llevó a complacer y postergar los propios límites.",
      solution: "Haz contacto con tu garganta y atrévete a nombrar una preferencia sincera sin pedir perdón.",
      reflection: "Decir no a algo que te drena es decirte sí a ti.",
    };
  }

  // 5. ABANDONO (por defecto)
  return {
    almaPaso1: "Es completamente natural sentir ese vacío o urgencia en el pecho ante la sensación de distancia o enfriamiento en el vínculo.",
    almaPaso2: "El detonante real amenazó la necesidad de cercanía, presencia constante y confirmación de que no hay desamparo.",
    almaPaso3: "Mecanismo de defensa activado: Hipervigilancia relacional o reclamo ansioso para forzar una respuesta que restaure la conexión.",
    almaHerida: "Abandono",
    almaExplicacion: "Conecta de forma directa con la herida de Abandono, donde cualquier pausa o silencio externo se siente internamente como un peligro biológico.",
    almaPregunta: "¿Cómo puedes brindarte a ti en este instante la presencia y el abrazo cálido que estás esperando recibir afuera?",
    trigger: "Una señal de frialdad o silencio activó el temor visceral a la desconexión.",
    solution: "Pon una mano en tu pecho, siente el latido y quédate contigo sin apresurarte.",
    reflection: "No estás en desamparo; hoy puedes ser tu propio refugio incondicional.",
  };
}

// API endpoint for AI analysis of thoughts & situations (Alma Engine)
app.post("/api/analyze-pattern", async (req, res) => {
  const { text, scene, emotion, bodyZone } = req.body || {};

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({
      error: "Por favor comparte una breve descripción de lo ocurrido.",
    });
  }

  const ai = getGeminiClient();

  if (!ai) {
    const fallback = fallbackAlmaAnalyze(text, scene, emotion);
    return res.json({
      ...fallback,
      source: "alma-local-heuristic",
    });
  }

  try {
    const systemInstruction = `[IDENTIDAD Y ROL DEL SISTEMA: ALMA IA]
Eres "Alma", la guía de autoconocimiento, introspección emocional y análisis de patrones inconscientes de Vishuda Essentia.
Tu propósito fundamental es leer con absoluta atención, profundidad y sensibilidad la situación libre que la persona escriba o dicte por voz.

[PERSONALIDAD Y TONO]
1. Profundamente compasivo, cálido, respetuoso y jamás juzgador.
2. Lenguaje neutro e incluyente: no asumas género ni edad de la persona (evita palabras como "cansado/cansada", "bienvenido/bienvenida"; usa expresiones neutras como "si sientes cansancio", "al experimentar esto", "en tu vivencia").
3. Cero clichés de autoayuda o frases hechas. Habla con precisión psicológica y sensibilidad somática (cuerpo, sistema nervioso, memorias vinculares).
4. Aplica con maestría la estructura: ENGANCHE -> ESPEJO -> REENCUADRE.

[INSTRUCCIÓN DE LECTURA PRECISA]
No apliques una plantilla genérica. Lee minuciosamente las palabras exactas, los personajes nombrados, las contradicciones sutiles y la emoción subyacente. Identifica los matices específicos de su vivencia para devolverle un reflejo lúcido y personalizado.

[ESTRUCTURA DE RESPUESTA REQUERIDA]
- Paso 1 (Enganche & Validación): Validación cálida y directa en 1-2 frases. Reconoce el impacto emocional exacto de lo vivido sin minimizarlo ni exagerarlo.
- Paso 2 (El Detonante Real): Desmenuza la necesidad profunda, límite o valor que se sintió amenazado en ese contexto específico.
- Paso 3 (Mecanismo de Defensa): Explica de forma compasiva cómo intentó protegerse el sistema nervioso de la persona (ej. complacencia para no perder afecto, hipercontrol para disipar la incertidumbre, aislamiento para no ser herida, rigidez para evitar el error, hipervigilancia ante el silencio).
- Paso 4 (La Herida de Origen): Identifica cuál de las 5 heridas arquetípicas está en la raíz: "Abandono" | "Injusticia" | "Traición" | "Rechazo" | "Humillación".
- almaExplicacion: Explica con claridad y profundidad cómo lo ocurrido hoy conecta con esa memoria o herida originaria.
- almaPregunta: Una pregunta de autoindagación honesta, profunda y no acusatoria que abra una nueva perspectiva.
- almaGiroReencuadre: Una micro-práctica somática o recordatorio compasivo (respiración, anclaje en el cuerpo, postura) para el presente.`;

    const userPrompt = `Situación descrita directamente por la persona (escrita o dictada por voz):
"${text}"
${scene ? `Contexto o ámbito: "${scene}"` : ""}
${emotion ? `Emoción sentida: "${emotion}"` : ""}
${bodyZone ? `Sensación corporal: "${bodyZone}"` : ""}

Analiza detalladamente esta vivencia real y responde con el esquema JSON indicado.`;

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
          ],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "";
    const parsed = JSON.parse(jsonText);

    return res.json({
      almaPaso1: parsed.almaPaso1,
      almaPaso2: parsed.almaPaso2,
      almaPaso3: parsed.almaPaso3,
      almaHerida: parsed.almaHerida,
      almaExplicacion: parsed.almaExplicacion,
      almaPregunta: parsed.almaPregunta,
      almaGiroReencuadre: parsed.almaGiroReencuadre || "Coloca una mano sobre tu pecho, exhala despacio y permite que tu cuerpo recuerde que en este instante estás a salvo contigo.",
      source: "alma-gemini",
      model: "gemini-3.8-flash",
    });
  } catch (err: any) {
    console.error("Gemini API error in Alma endpoint, using heuristic fallback:", err?.message || err);
    const fallback = fallbackAlmaAnalyze(text, scene, emotion);
    return res.json({
      ...fallback,
      source: "alma-local-fallback",
      errorDetails: err?.message,
    });
  }
});

// Endpoint to check status of Google Gemini integration
app.get("/api/ai-status", (_req, res) => {
  res.json({
    geminiAvailable: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
    engine: "Google Gemini 3.8 Flash (Official SDK @google/genai)",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// ==========================================
// WOMPI ACTIVATION CODES & DEVICE BINDING (MÉTODO A)
// ==========================================

interface ActivationCodeRecord {
  code: string;
  status: "available" | "used" | "revoked";
  boundDeviceId?: string;
  boundDeviceName?: string;
  activatedAt?: string;
  expiresAt?: string;
  durationDays: number;
  note?: string;
}

const CODES_FILE = path.join(process.cwd(), "activation_codes.json");

const SEED_CODES: ActivationCodeRecord[] = [
  { code: "ALMA-7842", status: "available", durationDays: 30, note: "Código inicial Wompi #1" },
  { code: "ALMA-3914", status: "available", durationDays: 30, note: "Código inicial Wompi #2" },
  { code: "ALMA-5820", status: "available", durationDays: 30, note: "Código inicial Wompi #3" },
  { code: "ALMA-6471", status: "available", durationDays: 30, note: "Código inicial Wompi #4" },
  { code: "ALMA-8293", status: "available", durationDays: 30, note: "Código inicial Wompi #5" },
  { code: "ALMA-1058", status: "available", durationDays: 30, note: "Código inicial Wompi #6" },
  { code: "ALMA-9347", status: "available", durationDays: 30, note: "Código inicial Wompi #7" },
  { code: "ALMA-4126", status: "available", durationDays: 30, note: "Código inicial Wompi #8" },
  { code: "ALMA-2785", status: "available", durationDays: 30, note: "Código inicial Wompi #9" },
  { code: "ALMA-6039", status: "available", durationDays: 30, note: "Código inicial Wompi #10" },
  { code: "VISHUDA2026", status: "available", durationDays: 365, note: "Código Maestro Fundadora" },
  { code: "ESSENTIA2026", status: "available", durationDays: 365, note: "Código Maestro VIP" },
];

function loadActivationCodes(): ActivationCodeRecord[] {
  try {
    if (fs.existsSync(CODES_FILE)) {
      const raw = fs.readFileSync(CODES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading activation_codes.json, using seed codes:", e);
  }
  // Initialize file with seed codes
  try {
    fs.writeFileSync(CODES_FILE, JSON.stringify(SEED_CODES, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not write activation_codes.json:", e);
  }
  return [...SEED_CODES];
}

function saveActivationCodes(codes: ActivationCodeRecord[]): boolean {
  try {
    fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error saving activation_codes.json:", e);
    return false;
  }
}

// 1. Check membership status by device ID
app.get("/api/premium/status", (req, res) => {
  const deviceId = req.query.deviceId ? String(req.query.deviceId) : null;
  if (!deviceId) {
    return res.json({
      hasActiveMembership: false,
      isExpired: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      expiresAt: null,
      activatedAt: null,
      code: null,
      deviceId: null,
    });
  }

  const codes = loadActivationCodes();
  // Find records bound to this device with status 'used'
  const bound = codes.filter((c) => c.boundDeviceId === deviceId && c.status === "used");

  if (bound.length === 0) {
    return res.json({
      hasActiveMembership: false,
      isExpired: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      expiresAt: null,
      activatedAt: null,
      code: null,
      deviceId,
    });
  }

  // Sort by expiresAt descending (most recent first)
  bound.sort((a, b) => {
    const timeA = a.expiresAt ? new Date(a.expiresAt).getTime() : 0;
    const timeB = b.expiresAt ? new Date(b.expiresAt).getTime() : 0;
    return timeB - timeA;
  });

  const current = bound[0];
  const now = Date.now();
  const expiresMs = current.expiresAt ? new Date(current.expiresAt).getTime() : 0;
  const isExpired = now >= expiresMs;
  const msRemaining = Math.max(0, expiresMs - now);
  const daysRemaining = isExpired ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = isExpired ? 0 : Math.ceil(msRemaining / (1000 * 60 * 60));

  res.json({
    hasActiveMembership: !isExpired,
    isExpired,
    daysRemaining,
    hoursRemaining,
    expiresAt: current.expiresAt,
    activatedAt: current.activatedAt,
    code: current.code,
    deviceId,
  });
});

// 2. Activate code with device binding (Single-device lock)
app.post("/api/premium/activate", (req, res) => {
  const { code, deviceId, deviceName } = req.body || {};

  if (!code || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      success: false,
      error: "Por favor ingresa tu código de activación.",
    });
  }

  if (!deviceId || typeof deviceId !== "string" || !deviceId.trim()) {
    return res.status(400).json({
      success: false,
      error: "Identificador de dispositivo no encontrado. Actualiza la página e inténtalo de nuevo.",
    });
  }

  const cleaned = code.trim().toUpperCase();
  const codes = loadActivationCodes();
  const record = codes.find((c) => c.code.toUpperCase() === cleaned);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: "El código no es válido o no existe en el sistema. Verifica que esté bien escrito o comunícate con soporte.",
    });
  }

  if (record.status === "revoked") {
    return res.status(400).json({
      success: false,
      error: "Este código ha sido desactivado. Si realizaste un pago reciente en Wompi, comunícate con soporte.",
    });
  }

  // Already used code check
  if (record.status === "used") {
    // Check if it belongs to the SAME device
    if (record.boundDeviceId === deviceId) {
      const now = Date.now();
      const expiresMs = record.expiresAt ? new Date(record.expiresAt).getTime() : 0;
      const isExpired = now >= expiresMs;

      if (isExpired) {
        const expiredDate = record.expiresAt
          ? new Date(record.expiresAt).toLocaleDateString("es-CO")
          : "fecha anterior";
        return res.status(400).json({
          success: false,
          isExpired: true,
          error: `Tu ciclo de 30 días para este código finalizó el ${expiredDate}. Por favor renueva tu suscripción en Wompi para obtener un nuevo código de acceso.`,
        });
      }

      const msRemaining = Math.max(0, expiresMs - now);
      const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
      return res.json({
        success: true,
        alreadyActive: true,
        message: "Tu membresía ya se encuentra activa en este dispositivo.",
        daysRemaining,
        expiresAt: record.expiresAt,
        activatedAt: record.activatedAt,
        code: record.code,
      });
    }

    // DIFFERENT DEVICE: BLOCK SHARING!
    const actDate = record.activatedAt
      ? new Date(record.activatedAt).toLocaleDateString("es-CO")
      : "otro momento";
    return res.status(403).json({
      success: false,
      deviceMismatch: true,
      error: `Este código ya fue activado en otro dispositivo el ${actDate}. Cada código de Vishuda es personal y de uso exclusivo en un solo equipo para evitar que sea compartido. Si compraste tu acceso o cambiaste de celular, solicita asistencia al soporte de Vishuda.`,
    });
  }

  // Record is available: activate and bind to this device!
  const now = new Date();
  const durationDays = record.durationDays || 30;
  const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  record.status = "used";
  record.boundDeviceId = deviceId;
  record.boundDeviceName = deviceName || "Dispositivo Móvil";
  record.activatedAt = now.toISOString();
  record.expiresAt = expires.toISOString();

  saveActivationCodes(codes);

  return res.json({
    success: true,
    message: `¡Activación exitosa! Tu membresía de ${durationDays} días ha quedado vinculada de forma exclusiva a este dispositivo.`,
    daysRemaining: durationDays,
    expiresAt: record.expiresAt,
    activatedAt: record.activatedAt,
    code: record.code,
  });
});

// 3. Admin: List all codes with real-time status
app.post("/api/premium/admin/list", (req, res) => {
  const { adminPin } = req.body || {};
  const expectedPin = process.env.ADMIN_PIN || "ALMA_ADMIN_2026";

  if (adminPin !== expectedPin) {
    return res.status(401).json({ error: "PIN de administración incorrecto." });
  }

  const codes = loadActivationCodes();
  const now = Date.now();

  const formatted = codes.map((c) => {
    let isExpired = false;
    let daysRemaining = c.durationDays || 30;

    if (c.status === "used" && c.expiresAt) {
      const expiresMs = new Date(c.expiresAt).getTime();
      isExpired = now >= expiresMs;
      daysRemaining = isExpired ? 0 : Math.ceil((expiresMs - now) / (1000 * 60 * 60 * 24));
    }

    return {
      ...c,
      isExpired,
      daysRemaining,
    };
  });

  res.json({
    success: true,
    codes: formatted,
    totalCount: formatted.length,
    availableCount: formatted.filter((c) => c.status === "available").length,
    usedCount: formatted.filter((c) => c.status === "used" && !c.isExpired).length,
    expiredCount: formatted.filter((c) => c.status === "used" && c.isExpired).length,
  });
});

// 4. Admin: Generate new 30-day single-use codes
app.post("/api/premium/admin/generate", (req, res) => {
  const { adminPin, count = 1, note = "Pago Wompi $29.900" } = req.body || {};
  const expectedPin = process.env.ADMIN_PIN || "ALMA_ADMIN_2026";

  if (adminPin !== expectedPin) {
    return res.status(401).json({ error: "PIN de administración incorrecto." });
  }

  const codes = loadActivationCodes();
  const created: ActivationCodeRecord[] = [];
  const numToCreate = Math.min(Math.max(Number(count) || 1, 1), 20);

  for (let i = 0; i < numToCreate; i++) {
    // Generate unique code format ALMA-XXXX
    let newCode = "";
    let attempts = 0;
    while (!newCode || codes.some((c) => c.code === newCode)) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      newCode = `ALMA-${randomNum}`;
      attempts++;
      if (attempts > 50) {
        newCode = `ALMA-${Date.now().toString().slice(-4)}`;
        break;
      }
    }

    const record: ActivationCodeRecord = {
      code: newCode,
      status: "available",
      durationDays: 30,
      note: note || "Pago Wompi $29.900",
    };

    codes.unshift(record);
    created.push(record);
  }

  saveActivationCodes(codes);

  res.json({
    success: true,
    message: `Se crearon ${created.length} nuevo(s) código(s) de 30 días exitosamente.`,
    createdCodes: created,
  });
});

// 5. Admin: Reset/Liberate a code (e.g., if client legitimately changed device)
app.post("/api/premium/admin/reset", (req, res) => {
  const { adminPin, code } = req.body || {};
  const expectedPin = process.env.ADMIN_PIN || "ALMA_ADMIN_2026";

  if (adminPin !== expectedPin) {
    return res.status(401).json({ error: "PIN de administración incorrecto." });
  }

  if (!code) {
    return res.status(400).json({ error: "Código requerido." });
  }

  const codes = loadActivationCodes();
  const target = codes.find((c) => c.code.toUpperCase() === String(code).trim().toUpperCase());

  if (!target) {
    return res.status(404).json({ error: "Código no encontrado." });
  }

  target.status = "available";
  delete target.boundDeviceId;
  delete target.boundDeviceName;
  delete target.activatedAt;
  delete target.expiresAt;

  saveActivationCodes(codes);

  res.json({
    success: true,
    message: `El código ${target.code} ha sido liberado y queda nuevamente disponible para vincular a un dispositivo.`,
    code: target,
  });
});

// Start Express server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vishuda server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
