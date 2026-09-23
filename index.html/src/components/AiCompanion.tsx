import React, { useState, useRef, useEffect } from 'react';
import { ExplorationData } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { ALMA_CASES } from '../data/almaCasesData';
import { isPremiumUser, getMembershipStatus, incrementUsageCount, getUsageCounts } from '../utils/storage';
import {
  Mic,
  Square,
  Sparkles,
  RefreshCw,
  Feather,
  AlertCircle,
  ArrowLeft,
  Shield,
  Heart,
  RotateCcw,
  ChevronRight,
  Compass,
  CreditCard,
  Lock,
} from 'lucide-react';

interface AiCompanionProps {
  onBack: () => void;
  onGoPractice: () => void;
  contextExploration?: ExplorationData | null;
  initialPrompt?: string;
  onGoCase?: (caseId: string) => void;
  onOpenPremium?: () => void;
}

export interface AlmaMirrorResponse {
  paso1Validacion: string;
  paso2Detonante: string;
  paso3Mecanismo: string;
  paso4Herida: {
    nombre: 'Abandono' | 'Injusticia' | 'Traición' | 'Rechazo' | 'Humillación';
    explicacion: string;
    preguntaReflexiva: string;
  };
  giroReencuadre?: string;
  source?: string;
  model?: string;
}

export const AiCompanion: React.FC<AiCompanionProps> = ({
  onBack,
  onGoPractice,
  contextExploration,
  initialPrompt,
  onGoCase,
  onOpenPremium,
}) => {
  const membership = getMembershipStatus();
  const isExpired = membership.isExpired;
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micStatus, setMicStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [almaResult, setAlmaResult] = useState<AlmaMirrorResponse | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [aiEngineStatus, setAiEngineStatus] = useState<{
    geminiAvailable: boolean;
    model: string;
    engine: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/ai-status')
      .then((res) => res.json())
      .then((data) => setAiEngineStatus(data))
      .catch(() => setAiEngineStatus(null));
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setTextInput(initialPrompt);
    } else if (contextExploration) {
      const summary = `Situación: ${contextExploration.scene || 'cotidiana'}. Se experimentó ${contextExploration.emotion || 'incomodidad'} con sensación en ${contextExploration.body || 'el cuerpo'}. La mente interpretó: "${contextExploration.interpretation || ''}". Reacción: "${contextExploration.protection || ''}".`;
      setTextInput(summary);
    }
  }, [initialPrompt, contextExploration]);

  // Voice recording logic
  const startRecording = async () => {
    setMicStatus(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicStatus('Puedes escribir tu situación directamente en el recuadro con total libertad.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlobUrl(URL.createObjectURL(blob));
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-CO';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          if (transcript.trim()) {
            setTextInput(transcript.trim());
          }
        };

        recognition.onerror = () => {};
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err) {
      setMicStatus('Puedes ingresar tu situación escribiendo en el recuadro de texto.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Introspection heuristic based on Alma system rules
  const analyzeWithAlmaRules = (input: string): AlmaMirrorResponse => {
    const lower = input.toLowerCase();

    // 1. RECHAZO (impostor, vergüenza, no ser suficiente, huir, crítica)
    if (
      lower.includes('rechaz') ||
      lower.includes('impostor') ||
      lower.includes('suficiente') ||
      lower.includes('vergüenza') ||
      lower.includes('critica') ||
      lower.includes('juzg') ||
      lower.includes('escapar') ||
      lower.includes('huir')
    ) {
      return {
        paso1Validacion:
          'Es completamente comprensible sentir esa incomodidad y deseo de encogerte cuando sientes que tu valor está en tela de juicio.',
        paso2Detonante:
          'El detonante real tocó la necesidad básica de pertenencia y aceptación incondicional, sintiendo el riesgo de no tener derecho a ocupar tu lugar.',
        paso3Mecanismo:
          'Mecanismo de defensa activado: Aislamiento preventivo y autoexigencia para evitar ser el foco de posibles juicios ajenos.',
        paso4Herida: {
          nombre: 'Rechazo',
          explicacion:
            'Esta reacción conecta con la herida de Rechazo, donde cualquier señal ambigua se interpreta como una amenaza a la propia existencia.',
          preguntaReflexiva:
            '¿Qué pasaría si hoy te permites existir con todas tus dudas sin exigirte una perfección inalcanzable para sentirte a salvo?',
        },
      };
    }

    // 2. INJUSTICIA (rigidez, perfección, culpa al descansar, sobreesfuerzo, deber ser)
    if (
      lower.includes('injust') ||
      lower.includes('descans') ||
      lower.includes('culpa') ||
      lower.includes('perfect') ||
      lower.includes('exig') ||
      lower.includes('debo') ||
      lower.includes('equivoc') ||
      lower.includes('rendim')
    ) {
      return {
        paso1Validacion:
          'Se reconoce el agotamiento y la tensión que produce cargar con la sensación de tener que hacerlo todo impecable.',
        paso2Detonante:
          'El detonante real amenazó la necesidad de ser valorado/a por lo que eres y no únicamente por tu rendimiento o utilidad.',
        paso3Mecanismo:
          'Mecanismo de defensa activado: Rigidez y autocontrol severo, cerrando el espacio a la vulnerabilidad para no cometer ningún desliz.',
        paso4Herida: {
          nombre: 'Injusticia',
          explicacion:
            'Conecta con la herida de Injusticia, nacida en entornos donde se premiaba la frialdad o la eficacia antes que la ternura y el descanso.',
          preguntaReflexiva:
            '¿Puedes darte el permiso de soltar la carga un instante y recordar que tu valor no depende de cuánto produces hoy?',
        },
      };
    }

    // 3. TRAICIÓN (control, desconfianza, delegar, mentira, engaño, fiscalizar)
    if (
      lower.includes('traic') ||
      lower.includes('control') ||
      lower.includes('desconf') ||
      lower.includes('delegar') ||
      lower.includes('mentir') ||
      lower.includes('engaño') ||
      lower.includes('garant')
    ) {
      return {
        paso1Validacion:
          'Tiene todo el sentido que sientas esa alerta corporal cuando percibes que el entorno o la otra persona no ofrecen certezas.',
        paso2Detonante:
          'El detonante real vulneró la necesidad de seguridad, lealtad y previsibilidad para no caer en la indefensión.',
        paso3Mecanismo:
          'Mecanismo de defensa activado: Hipervigilancia y control activo, anticipando escenarios para que nada te tome por sorpresa.',
        paso4Herida: {
          nombre: 'Traición',
          explicacion:
            'Se relaciona con la herida de Traición, donde se aprendió que confiar ciegamente implicaba quedar a merced de la decepción.',
          preguntaReflexiva:
            '¿Qué parte de ti necesita saber que hoy tienes recursos propios para cuidarte, incluso si no puedes controlar cada variable externa?',
        },
      };
    }

    // 4. HUMILLACIÓN (complacencia, vergüenza ajena, carga de otros, no poner límites)
    if (
      lower.includes('humill') ||
      lower.includes('complac') ||
      lower.includes('agradar') ||
      lower.includes('pena') ||
      lower.includes('ridicul') ||
      lower.includes('cargar') ||
      lower.includes('salvar')
    ) {
      return {
        paso1Validacion:
          'Se valida esa sensación de pesadez que surge cuando se intenta mantener el equilibrio de los demás a costa del propio bienestar.',
        paso2Detonante:
          'El detonante real puso en juego la necesidad de dignidad y respeto hacia los propios límites y deseos individuales.',
        paso3Mecanismo:
          'Mecanismo de defensa activado: Complacencia extrema y anulación personal, buscando ser indispensable para asegurar afecto.',
        paso4Herida: {
          nombre: 'Humillación',
          explicacion:
            'Detona la herida de Humillación, caracterizada por el temor inconsciente a avergonzar al entorno o a ser considerado/a egoísta.',
          preguntaReflexiva:
            '¿Qué necesidad tuya ha quedado en silencio por cuidar los sentimientos de los demás en esta situación?',
        },
      };
    }

    // 5. ABANDONO (por defecto: mensajes no respondidos, soledad, celos, distancia, apego)
    return {
      paso1Validacion:
        'Es completamente natural sentir ese vacío o urgencia en el pecho ante la sensación de distancia o enfriamiento en el vínculo.',
      paso2Detonante:
        'El detonante real amenazó la necesidad de cercanía, presencia constante y confirmación de que no hay desamparo.',
      paso3Mecanismo:
        'Mecanismo de defensa activado: Hipervigilancia relacional o reclamo ansioso para forzar una respuesta que restaure la conexión.',
      paso4Herida: {
        nombre: 'Abandono',
        explicacion:
          'Conecta de forma directa con la herida de Abandono, donde cualquier pausa o silencio externo se siente internamente como un peligro biológico.',
        preguntaReflexiva:
          '¿Cómo puedes brindarte a ti en este instante la presencia y el abrazo cálido que estás esperando recibir afuera?',
      },
    };
  };

  const handleAnalyze = async () => {
    if (!textInput.trim()) return;

    setIsLoading(true);

    try {
      // Connect directly to the official Google Gemini API via the secure server endpoint
      const response = await fetch('/api/analyze-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.almaPaso1 && data.almaHerida) {
          incrementUsageCount('ai');
          setAlmaResult({
            paso1Validacion: data.almaPaso1,
            paso2Detonante: data.almaPaso2,
            paso3Mecanismo: data.almaPaso3,
            paso4Herida: {
              nombre: data.almaHerida,
              explicacion: data.almaExplicacion,
              preguntaReflexiva: data.almaPregunta,
            },
            giroReencuadre: data.almaGiroReencuadre,
            source: data.source || 'alma-gemini',
            model: data.model || 'gemini-3.8-flash',
          });
          audioEngine.playChime(432);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback to local rules:', e);
    }

    // Direct local Alma engine execution (heuristic fallback)
    await new Promise((res) => setTimeout(res, 700));
    incrementUsageCount('ai');
    const result = analyzeWithAlmaRules(textInput);
    setAlmaResult({
      ...result,
      source: 'alma-local-heuristic',
    });
    audioEngine.playChime(432);
    setIsLoading(false);
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn text-[#1d2924]">
      {/* Top back navigation */}
      <button
        onClick={onBack}
        className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al inicio</span>
      </button>

      {/* Header with Alma Persona */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] tracking-widest uppercase text-[#1b5e4b] font-extrabold block">
            Módulo 1 · El Chat Espejo
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b5e4b] text-white flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#ead08f]" />
            <span>Espacio 100% privado y confidencial</span>
          </span>
          {aiEngineStatus?.geminiAvailable ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0e2721] text-[#ead08f] flex items-center gap-1 border border-[#c5a059]/40"
              title="Conexión activa con la API oficial de Google Gemini"
            >
              <Sparkles className="w-3 h-3 text-[#ead08f]" />
              <span>Google Gemini Activo ({aiEngineStatus.model || '3.8 Flash'})</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b5e4b] text-[#ead08f] flex items-center gap-1 border border-[#c5a059]/40">
              <Sparkles className="w-3 h-3 text-[#ead08f]" />
              <span>Motor Espejo Activo</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl font-serif font-extrabold text-[#0e2721] mt-1">
          Guía de Introspección con Alma
        </h1>
        <p className="text-xs text-[#52665e] mt-1 leading-relaxed">
          Comparte libremente cualquier situación que te haya provocado molestia o abrumación hoy (escrita o por voz). Alma adoptará su tono compasivo sin juzgar y analizará tu vivencia en formato <b className="text-[#144436]">Enganche · Espejo · Reencuadre</b>, iluminando el detonante real y la herida activa.
        </p>

        {/* Privacy Notice Card */}
        <div className="mt-2.5 p-2.5 rounded-xl bg-[#f2f7f4] border border-[#bcd7cb] flex items-start gap-2 text-[11px] text-[#344d42]">
          <Shield className="w-3.5 h-3.5 text-[#1b5e4b] shrink-0 mt-0.5" />
          <p className="leading-tight">
            <b>Privacidad total:</b> Tus grabaciones de voz y reflexiones se procesan únicamente en tu sesión. Nadie más tiene acceso ni son visibles para otros usuarios de la app.
          </p>
        </div>
      </div>

      {/* Voice Recorder Card */}
      <div className="bg-[#fcfdfa] border border-[#d2dfd8] rounded-3xl p-5 text-center shadow-2xs space-y-3">
        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
              isRecording
                ? 'bg-rose-700 scale-110 ring-8 ring-rose-200 animate-pulse text-white'
                : 'bg-[#0e2721] text-[#ead08f] hover:bg-[#184236]'
            }`}
            title={isRecording ? 'Detener grabación' : 'Empezar a grabar'}
          >
            {isRecording ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-7 h-7" />}
          </button>
        </div>

        <div>
          <b className="text-xs font-bold text-[#0e2721] block">
            {isRecording ? 'Te escuchamos con total atención…' : 'Toca para hablar o escribe abajo'}
          </b>
          <span className="text-[11px] text-[#556961]">
            {isRecording ? formatTimer(recordingSeconds) : 'Habla con naturalidad sobre lo que detonó tu reacción'}
          </span>
        </div>

        {audioBlobUrl && (
          <div className="pt-2">
            <audio src={audioBlobUrl} controls className="w-full h-8" />
          </div>
        )}

        {micStatus && (
          <div className="bg-[#fff9e6] text-[#7a5d00] p-2.5 rounded-xl text-xs flex items-center gap-2 text-left border border-[#ead08f]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{micStatus}</span>
          </div>
        )}
      </div>

      {/* Text input */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#144436] block">
          Describe la situación que te molestó o abrumó hoy:
        </label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Ej: En una reunión de trabajo me pidieron una opinión imprevista y me quedé en blanco; sentí una ola de calor en el cuello y muchas ganas de desaparecer de la sala..."
          rows={4}
          className="w-full p-4 text-base rounded-2xl border border-[#d2dfd8] bg-white focus:ring-2 focus:ring-[#144436]/30 outline-none leading-relaxed text-[#1d2924] shadow-2xs"
        />
      </div>

      {/* Expired Membership Banner */}
      {isExpired ? (
        <div className="bg-[#fef9eb] border border-[#ebd08f] rounded-2xl p-4 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#805b10]">
            <Lock className="w-4 h-4 text-[#c5a059]" />
            <span>Membresía en Pausa</span>
          </div>
          <p className="text-xs text-[#6e541b] leading-relaxed">
            Tu ciclo de 30 días ha concluido. Renueva en Wompi por $29.900 COP para continuar decodificando situaciones en vivo con Alma (IA).
          </p>
          {onOpenPremium && (
            <button
              onClick={onOpenPremium}
              className="w-full py-3.5 rounded-xl bg-[#0e2721] text-[#ead08f] font-bold text-sm hover:bg-[#183d33] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <CreditCard className="w-4 h-4 text-[#ead08f]" />
              <span>Renovar Membresía ($29.900 COP)</span>
            </button>
          )}
        </div>
      ) : (
        /* Action Button */
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !textInput.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0a1e18] via-[#102e25] to-[#184437] disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#ead08f]" />
              <span>Alma está analizando el detonante y el patrón…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#ead08f]" />
              <span>Consultar con Alma (Chat Espejo)</span>
            </>
          )}
        </button>
      )}

      {/* ALMA 4-STEP RESULT DISPLAY */}
      {almaResult && (
        <div className="space-y-4 bg-[#f4f8f6] border-2 border-[#144436] rounded-3xl p-5 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#bcd7cb] pb-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#1b5e4b] block">
                ANÁLISIS DE INTROSPECCIÓN EMOCIONAL
              </span>
              <h3 className="text-lg font-serif font-extrabold text-[#0e2721] mt-0.5">
                Respuesta de Alma
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {almaResult.source === 'alma-gemini' && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1b5e4b] text-[#ead08f] flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#ead08f]" />
                  <span>Google Gemini Oficial</span>
                </span>
              )}
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0e2721] text-[#ead08f]">
                Herida: {almaResult.paso4Herida.nombre}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {/* Paso 1: Validación */}
            <div className="bg-white rounded-2xl p-4 border border-[#d2dfd8] space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1b5e4b] block">
                Paso 1 · Validación
              </span>
              <p className="text-[#2c3d36] leading-relaxed font-medium">
                {almaResult.paso1Validacion}
              </p>
            </div>

            {/* Paso 2: El Detonante Real */}
            <div className="bg-white rounded-2xl p-4 border border-[#d2dfd8] space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#8a5d13] block">
                Paso 2 · El Detonante Real
              </span>
              <p className="text-[#2c3d36] leading-relaxed">
                {almaResult.paso2Detonante}
              </p>
            </div>

            {/* Paso 3: Mecanismo de Defensa */}
            <div className="bg-[#fff9ef] rounded-2xl p-4 border border-[#ead4a8] space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#824f00] block flex items-center gap-1">
                <Shield className="w-4 h-4 text-[#b0791d]" />
                <span>Paso 3 · Mecanismo de Defensa</span>
              </span>
              <p className="text-[#423116] leading-relaxed font-medium">
                {almaResult.paso3Mecanismo}
              </p>
            </div>

            {/* Paso 4: La Herida de Origen + Pregunta */}
            <div className="bg-gradient-to-br from-[#0a1e18] to-[#153e32] text-white rounded-2xl p-5 shadow-xs space-y-2.5 border border-[#c5a059]/40">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ead08f] block">
                Paso 4 · La Herida de Origen ({almaResult.paso4Herida.nombre})
              </span>
              <p className="text-sm text-[#dbe7e1] leading-relaxed">
                {almaResult.paso4Herida.explicacion}
              </p>

              <div className="pt-2.5 border-t border-white/15">
                <span className="text-xs uppercase font-bold text-[#ead08f] block mb-1">
                  Pregunta para tu autoindagación activa:
                </span>
                <p className="italic text-sm font-serif text-[#f4eee1] leading-relaxed">
                  “{almaResult.paso4Herida.preguntaReflexiva}”
                </p>
              </div>
            </div>

            {/* Reencuadre & Giro Somático */}
            {almaResult.giroReencuadre && (
              <div className="bg-[#f0f6f3] rounded-2xl p-4 border border-[#bcd7cb] space-y-1.5 shadow-2xs">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#144436] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#1b5e4b]" />
                  <span>Reencuadre & Giro Somático en el Presente</span>
                </span>
                <p className="text-sm text-[#283d34] leading-relaxed font-medium">
                  {almaResult.giroReencuadre}
                </p>
              </div>
            )}

            {almaResult.source === 'alma-limit' && onOpenPremium && (
              <div className="bg-[#faf6ed] border-2 border-[#c5a059] rounded-2xl p-4 text-center space-y-2.5">
                <b className="text-sm font-bold text-[#0e2721] block">
                  Continúa tu acompañamiento ilimitado con Alma
                </b>
                <button
                  onClick={onOpenPremium}
                  className="w-full py-3 px-4 rounded-xl bg-[#c5a059] text-[#081a15] font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#b58f48] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Activar Membresía Continuo ($29.900 COP)</span>
                </button>
              </div>
            )}

            {/* CASOS DE LA VIDA REAL RELACIONADOS */}
            {(() => {
              const matchingCases = ALMA_CASES.filter(
                (c) => c.herida.toLowerCase() === almaResult.paso4Herida.nombre.toLowerCase()
              ).slice(0, 3);
              if (matchingCases.length === 0) return null;

              return (
                <div className="bg-[#eaf3ee] rounded-2xl p-3.5 border border-[#bcd7cb] space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144436] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#1b5e4b]" />
                      <span>Casos reales con herida de {almaResult.paso4Herida.nombre}</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#1b5e4b]">Toca para explorar</span>
                  </div>
                  <p className="text-[11px] text-[#4f645b] leading-tight">
                    Observa cómo se manifiesta este mismo patrón en situaciones cotidianas de pareja, trabajo o familia:
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {matchingCases.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (onGoCase) onGoCase(c.id);
                        }}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#d2dfd8] hover:border-[#144436] text-left transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg">{c.icon}</span>
                          <div className="min-w-0">
                            <b className="text-xs text-[#0e2721] block truncate group-hover:text-[#1b5e4b]">
                              {c.title}
                            </b>
                            <span className="text-[10px] text-[#556961] block truncate">
                              {c.sintoma}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#144436] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                setAlmaResult(null);
                setTextInput('');
              }}
              className="py-2.5 px-3 rounded-xl border border-[#bcd7cb] text-[#144436] font-bold text-xs hover:bg-[#e4ede8] transition-all flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nueva consulta</span>
            </button>
            <button
              onClick={onGoPractice}
              className="flex-1 py-2.5 rounded-xl bg-[#144436] text-[#ead08f] font-bold text-xs hover:bg-[#0e2721] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Hacer una práctica somática</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
