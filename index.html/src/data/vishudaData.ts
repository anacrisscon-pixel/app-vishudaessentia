import {
  Pattern,
  SomaticExercise,
  LifeSituation,
  MediaResource,
  AnchorItem,
  CaseDetail,
} from '../types';

export const SCENES: Array<{ icon: string; label: string }> = [
  { icon: '❤️', label: 'Mis relaciones' },
  { icon: '🛡️', label: 'Mis límites' },
  { icon: '😔', label: 'Mis emociones' },
  { icon: '💼', label: 'Trabajo y dinero' },
  { icon: '👤', label: 'Mi relación conmigo' },
  { icon: '🔄', label: 'Algo que se repite' },
];

export const MOODS = [
  { id: 'alegria', emoji: '😊', label: 'Alegría', color: '#f6df9d' },
  { id: 'calma', emoji: '😌', label: 'Calma', color: '#b9dcd4' },
  { id: 'ansiedad', emoji: '😟', label: 'Ansiedad', color: '#cbd8ec' },
  { id: 'enojo', emoji: '😠', label: 'Enojo', color: '#efb0a9' },
  { id: 'tristeza', emoji: '😔', label: 'Tristeza', color: '#b9c7e0' },
];

export const EMOTIONS = [
  'En calma',
  'Tristeza',
  'Miedo',
  'Ansiedad',
  'Enojo',
  'Frustración',
  'Vergüenza',
  'Soledad',
  'Confusión',
];

export const BODY_ZONES = [
  { id: 'todo', label: '✨ Todo el cuerpo', desc: 'Sensación general o difusa' },
  { id: 'cabeza', label: '🧠 Cabeza', desc: 'Presión, rumiación o dolor de sienes' },
  { id: 'garganta', label: '🗣️ Garganta', desc: 'Nudo, dificultad para tragar o hablar' },
  { id: 'pecho', label: '❤️ Pecho', desc: 'Opresión, taquicardia o pesadez' },
  { id: 'abdomen', label: '🫃 Abdomen / Estómago', desc: 'Vacío, mariposas o dolor punzante' },
  { id: 'brazos', label: '👐 Brazos y manos', desc: 'Tensión, puños cerrados o inquietud' },
  { id: 'piernas', label: '🦵 Piernas', desc: 'Impulso de huir, pesadez o temblor' },
];

export const PROTECTIONS = [
  { id: 'cerrar', label: '🫥 Me cierro', desc: 'Cuando algo me duele, prefiero ocultarlo o aislarme.' },
  { id: 'aprobar', label: '🤝 Busco aprobación', desc: 'Necesito sentir que hice lo correcto para el otro.' },
  { id: 'defender', label: '⚔️ Me defiendo', desc: 'Ante la crítica, respondo rápido, justifico o ataco.' },
  { id: 'evitar', label: '🏃 Evito', desc: 'Prefiero posponer, evadir o alejarme de lo incómodo.' },
  { id: 'controlar', label: '🎛️ Intento controlar', desc: 'Si organizo y preveo todo, siento que nada malo pasará.' },
  { id: 'adaptar', label: '🫶 Me adapto', desc: 'Cambio lo que necesito para que la relación funcione.' },
];

export const NEEDS = [
  { id: 'calma', label: '🌿 Calma', desc: 'Bajar la alerta de mi sistema nervioso' },
  { id: 'conexion', label: '❤️ Conexión', desc: 'Sentirme visto/a y recibido/a' },
  { id: 'seguridad', label: '🛡️ Seguridad', desc: 'Saber que no corro peligro ni seré abandonado/a' },
  { id: 'expresion', label: '🗣️ Expresarme', desc: 'Decir mi verdad sin temor a la censura' },
  { id: 'limite', label: '🚪 Poner un límite', desc: 'Proteger mi espacio sin culpa' },
  { id: 'descanso', label: '🤍 Descansar', desc: 'Pausar la exigencia y soltar el rendimiento' },
  { id: 'reconocimiento', label: '✨ Reconocimiento', desc: 'Validar mi esfuerzo y existencia' },
  { id: 'autonomia', label: '🧭 Autonomía', desc: 'Tomar mis propias decisiones con libertad' },
];

export const INTERPRETATIONS = [
  '“Si digo lo que necesito, puedo perder al otro.”',
  '“Quizás hice algo mal.”',
  '“No soy suficiente.”',
  '“Si no lo controlo, algo malo puede pasar.”',
  '“Si digo que no, se pueden molestar conmigo.”',
  '“Tengo que resolverlo por mi cuenta.”',
  '“Necesito saber que todo está bien antes de poder estar tranquilo/a.”',
  '“Si muestro lo que siento, pueden juzgarme.”',
];

export const INTERP_REFLECTIONS: Record<string, string> = {
  '“Si digo lo que necesito, puedo perder al otro.”':
    'Esa creencia protege el vínculo a costa de ti. Puedes probar expresar una necesidad pequeña y notar qué sucede en la realidad, en vez de asumir el desenlace.',
  '“Quizás hice algo mal.”':
    'Buscar qué hiciste mal es un intento mental de recuperar control. Pero no todo lo que el otro siente o hace depende de tus acciones.',
  '“No soy suficiente.”':
    'Esa frase suele nacer mucho antes del hecho actual. Es una herida antigua proyectándose en este instante. Tu valor intrínseco no está a prueba.',
  '“Si no lo controlo, algo malo puede pasar.”':
    'El control busca protegerte de la incertidumbre, pero cobra una cuota alta de agotamiento. Prueba soltar un detalle mínimo hoy y observa qué se siente.',
  '“Si digo que no, se pueden molestar conmigo.”':
    'El enojo del otro ante un límite tuyo es su propia gestión emocional, no una prueba de que hiciste algo incorrecto.',
  '“Tengo que resolverlo por mi cuenta.”':
    'La autosuficiencia extrema te cuidó cuando no había apoyo confiable. Hoy puedes darte el permiso de recibir sin perder tu dignidad.',
  '“Necesito saber que todo está bien antes de poder estar tranquilo/a.”':
    'La tranquilidad no puede vivir exclusivamente en la confirmación externa. Puedes empezar a dártela tú en este momento, respirando profundo.',
  '“Si muestro lo que siento, pueden juzgarme.”':
    'El juicio ajeno habla de la capacidad del otro de sostener la vulnerabilidad, no de tu derecho a sentir lo que sientes.',
};

export const PROTECTION_REFLECTIONS: Record<string, string> = {
  '🫥 Me cierro':
    'Cerrarte te protegió alguna vez. Hoy puedes elegir abrir solo una rendija con quien ha demostrado cuidar de tu confianza.',
  '🤝 Busco aprobación':
    'Tu valor no depende de que alguien más te lo firme. Practica notar cuándo actúas para agradar y cuándo actúas en sintonía contigo.',
  '⚔️ Me defiendo':
    'Defenderte es válido. La pregunta compasiva es si esa armadura tan pesada todavía te permite escuchar y respirar.',
  '🏃 Evito':
    'Evitar da un alivio inmediato de minutos, pero mantiene la herida intacta. ¿Qué pasaría si te quedas 30 segundos más con la incomodidad?',
  '🎛️ Intento controlar':
    'El control es miedo con un plan de acción. Intenta delegar o soltar una sola cosa pequeña hoy.',
  '🫶 Me adapto':
    'Adaptarte tiene un límite saludable: el punto exacto donde dejas de reconocerte a ti misma o a ti mismo.',
};

export const PATTERNS: Pattern[] = [
  {
    id: 'conexion',
    title: 'Conservar la conexión a costa de ti',
    desc: 'Cuando aparece riesgo de rechazo o distancia, tiendes a dejar tus propias necesidades en segundo plano para sentir que el vínculo está a salvo.',
    signs: [
      'Te cuesta decir no',
      'Priorizas la reacción del otro antes que la tuya',
      'Solo te calmas cuando confirmas que no están molestos contigo',
    ],
    question: '¿Qué parte de ti estás dejando de escuchar para que la otra persona permanezca?',
    wound: 'Herida de abandono y miedo a la desconexión',
    tests: {
      need: ['❤️ Conexión', '🛡️ Seguridad', '✨ Reconocimiento'],
      protection: ['🤝 Busco aprobación', '🫶 Me adapto', '🏃 Evito'],
      interpret: [
        '“Si digo lo que necesito, puedo perder al otro.”',
        '“Si digo que no, se pueden molestar conmigo.”',
        '“Quizás hice algo mal.”',
      ],
    },
  },
  {
    id: 'aprobacion',
    title: 'Buscar confirmación para sentir seguridad',
    desc: 'Cuando no tienes certeza sobre lo que la otra persona piensa o siente, buscas señales externas urgentes que confirmen que eres aceptado/a.',
    signs: [
      'Revisas repetidamente mensajes o señales',
      'Preguntas con frecuencia si todo está bien',
      'Tu paz mental sube y baja según la respuesta ajena',
    ],
    question: '¿Qué certeza estás buscando afuera que podrías empezar a construir dentro de ti?',
    wound: 'Herida de rechazo y necesidad de validación externa',
    tests: {
      need: ['🛡️ Seguridad', '✨ Reconocimiento', '🌿 Calma'],
      protection: ['🤝 Busco aprobación'],
      interpret: [
        '“Quizás hice algo mal.”',
        '“Necesito saber que todo está bien antes de poder estar tranquilo/a.”',
      ],
    },
  },
  {
    id: 'control',
    title: 'Controlar para calmar la incertidumbre',
    desc: 'Ante lo desconocido o la falta de garantías, intentas dirigir, revisar o prever todo lo que ocurre para recuperar sensación de seguridad.',
    signs: [
      'Dificultad extrema para delegar',
      'Anticipación constante de catástrofes o fallas',
      'Incapacidad para relajarte sin tener todo resuelto',
    ],
    question: '¿Qué estás intentando controlar porque tu cuerpo aún no tolera no saber?',
    wound: 'Inseguridad temprana e hiperalerta aprendida',
    tests: {
      need: ['🛡️ Seguridad', '🌿 Calma', '🧭 Autonomía'],
      protection: ['🎛️ Intento controlar'],
      interpret: [
        '“Si no lo controlo, algo malo puede pasar.”',
        '“Necesito saber que todo está bien antes de poder estar tranquilo/a.”',
      ],
    },
  },
  {
    id: 'evitacion',
    title: 'Alejarte para no sentirte vulnerable',
    desc: 'Cuando algo duele, abruma o parece amenazante, tomas distancia emocional, cierras la conversación o huyes para proteger tu intimidad.',
    signs: [
      'Desapareces o guardas silencio ante el conflicto',
      'Dices “no pasa nada” cuando sientes dolor',
      'Postergas conversaciones esenciales por temor a la exposición',
    ],
    question: '¿Qué sentirías en tu cuerpo si te quedaras un momento más en vez de retirarte?',
    wound: 'Miedo a ser invadido/a, herido/a o juzgado/a',
    tests: {
      need: ['🌿 Calma', '🛡️ Seguridad', '❤️ Conexión'],
      protection: ['🏃 Evito', '🫥 Me cierro'],
      interpret: [
        '“Si muestro lo que siento, pueden juzgarme.”',
        '“Tengo que resolverlo por mi cuenta.”',
      ],
    },
  },
  {
    id: 'defensa',
    title: 'Protegerte antes de ser herido/a',
    desc: 'Cuando percibes crítica, rechazo o injusticia, reaccionas desde la defensa inmediata, la justificación o el contraataque antes de validar lo que pasa.',
    signs: [
      'Te justificas rápidamente',
      'Sientes ataque personal donde puede haber información neutral',
      'Necesidad urgente de demostrar que tienes la razón',
    ],
    question: '¿Qué parte tierna o herida de ti se sintió amenazada justo antes de poner la espada?',
    wound: 'Herida de desvalorización o crítica temprana',
    tests: {
      need: ['✨ Reconocimiento', '🛡️ Seguridad'],
      protection: ['⚔️ Me defiendo'],
      interpret: ['“No soy suficiente.”', '“Si muestro lo que siento, pueden juzgarme.”'],
    },
  },
  {
    id: 'autosuficiencia',
    title: 'No necesitar a nadie para estar a salvo',
    desc: 'Cuando depender de alguien se siente riesgoso o frágil, respondes intentando resolverlo absolutamente todo en soledad, sin pedir apoyo.',
    signs: [
      'Cargas todo el peso y pides ayuda solo al colapsar',
      'Te incomoda recibir regalos, elogios o atenciones',
      'La vulnerabilidad se siente como debilidad',
    ],
    question: '¿Qué podría pasar si permitieras que alguien te acompañe sin perder tu independencia?',
    wound: 'Desconfianza o decepción relacional previa',
    tests: {
      need: ['🧭 Autonomía', '🌿 Calma', '🤍 Descansar'],
      protection: ['🫥 Me cierro', '🏃 Evito'],
      interpret: ['“Tengo que resolverlo por mi cuenta.”'],
    },
  },
  {
    id: 'limites',
    title: 'Ceder para evitar el conflicto',
    desc: 'Cuando necesitas poner un freno o decir no, priorizas la comodidad o la aprobación del otro por encima de tu propia salud y límites.',
    signs: [
      'Dices sí sintiendo un no interno',
      'Te adaptas para no generar incomodidad',
      'Sientes resentimiento o cansancio acumulado después de ceder',
    ],
    question: '¿Puedes permitir que el otro se sienta temporalmente incómodo sin que sea tu culpa?',
    wound: 'Miedo al rechazo o a la ira ajena',
    tests: {
      need: ['🚪 Poner un límite', '❤️ Conexión', '✨ Reconocimiento'],
      protection: ['🫶 Me adapto', '🏃 Evito', '🤝 Busco aprobación'],
      interpret: [
        '“Si digo que no, se pueden molestar conmigo.”',
        '“Si digo lo que necesito, puedo perder al otro.”',
      ],
    },
  },
];

export const LIFE_SITUATIONS: LifeSituation[] = [
  {
    id: 'sit-1',
    ico: '💬',
    title: 'Cuando alguien tarda en responder',
    desc: 'Empiezas a imaginar que hiciste algo mal, revisas el teléfono con frecuencia o buscas una señal que confirme que todo sigue bien.',
    patternId: 'aprobacion',
  },
  {
    id: 'sit-2',
    ico: '🚪',
    title: 'Cuando quieres decir NO',
    desc: 'Aceptas compromisos o favores que no deseas porque anticipas que la otra persona se va a molestar, decepcionar o alejar.',
    patternId: 'limites',
  },
  {
    id: 'sit-3',
    ico: '❤️',
    title: 'Cuando tu pareja se distancia',
    desc: 'Sientes ansiedad, necesitas acercarte, explicar, preguntar o hacer algo urgente para recuperar la conexión.',
    patternId: 'conexion',
  },
  {
    id: 'sit-4',
    ico: '⚡',
    title: 'Cuando te hacen una crítica',
    desc: 'Tu cuerpo se activa de inmediato y sientes la urgencia de defenderte, justificarte o demostrar que tienes la razón.',
    patternId: 'defensa',
  },
  {
    id: 'sit-5',
    ico: '📱',
    title: 'Cuando no tienes respuesta inmediata',
    desc: 'Tu mente llena el silencio con escenarios negativos y necesitas revisar, insistir o controlar para calmar la alarma interna.',
    patternId: 'control',
  },
  {
    id: 'sit-6',
    ico: '🏃',
    title: 'Cuando una conversación se vuelve incómoda',
    desc: 'Prefieres retirarte, callar, cambiar de tema o desconectarte antes que sentirte expuesto/a o vulnerable.',
    patternId: 'evitacion',
  },
  {
    id: 'sit-7',
    ico: '🧱',
    title: 'Cuando necesitas pedir ayuda',
    desc: 'Te cuesta hacerlo porque sientes que deberías poder resolverlo todo por tu cuenta sin ser una carga para nadie.',
    patternId: 'autosuficiencia',
  },
  {
    id: 'sit-8',
    ico: '💼',
    title: 'Cuando cometes un error en el trabajo',
    desc: 'Tu mente lo convierte rápidamente en una prueba de que no eres suficiente o de que podrías perder tu lugar.',
    patternId: 'defensa',
  },
  {
    id: 'sit-9',
    ico: '👨‍👩‍👧',
    title: 'Cuando tu familia desaprueba tu decisión',
    desc: 'Modificas lo que querías hacer o buscas convencerlos incansablemente para evitar sentir el rechazo del clan.',
    patternId: 'conexion',
  },
  {
    id: 'sit-10',
    ico: '💰',
    title: 'Cuando el dinero se vuelve incierto',
    desc: 'Intentas controlar cada detalle, anticipar catástrofes y sientes que no puedes descansar hasta tener garantías absolutas.',
    patternId: 'control',
  },
  {
    id: 'sit-11',
    ico: '🫥',
    title: 'Cuando necesitas mostrar lo que sientes',
    desc: 'Te guardas el dolor o la tristeza porque temes ser juzgado/a, parecer débil o generar un problema a los demás.',
    patternId: 'evitacion',
  },
  {
    id: 'sit-12',
    ico: '🤝',
    title: 'Cuando alguien te necesita demasiado',
    desc: 'Te adaptas, cargas con lo del otro y después sientes agotamiento físico, irritabilidad o resentimiento silencioso.',
    patternId: 'limites',
  },
  {
    id: 'sit-13',
    ico: '🙇‍♀️',
    title: 'Pedir perdón antes de hablar o existir',
    desc: 'Dices "perdón" al entrar a una habitación, al hacer una pregunta básica en el trabajo o al ocupar un asiento para no incomodar.',
    patternId: 'aprobacion',
  },
  {
    id: 'sit-14',
    ico: '🛋️',
    title: 'Culpa intensa cuando intentas descansar',
    desc: 'Te sientas en el sillón a reposar y una voz interna te acusa de holgazanería o te empuja a levantarte a limpiar o avanzar tareas.',
    patternId: 'autosuficiencia',
  },
  {
    id: 'sit-15',
    ico: '🦎',
    title: 'Convertirte en camaleón para agradar',
    desc: 'Cambias tus gustos, tus opiniones y tus horarios para coincidir exactamente con los de la persona que te gusta por pánico a que se vaya.',
    patternId: 'conexion',
  },
  {
    id: 'sit-16',
    ico: '🔍',
    title: 'Pánico a que encuentren un detalle imperfecto',
    desc: 'Revisas un correo, informe o presentación diez veces porque crees que un error mínimo destruirá tu credibilidad.',
    patternId: 'defensa',
  },
  {
    id: 'sit-17',
    ico: '🦾',
    title: '"Si no lo hago yo, nadie lo hace bien"',
    desc: 'Te niegas a delegar en la casa o en el trabajo, asumes toda la carga física y mental y terminas con burnout e ira sorda.',
    patternId: 'control',
  },
  {
    id: 'sit-18',
    ico: '🍽️',
    title: 'El "Sí" automático a planes que te drenan',
    desc: 'Aceptas cenas, salidas o favores familiares aunque tu cuerpo esté exhausto, por pánico a la culpa de decepcionarlos.',
    patternId: 'limites',
  },
  {
    id: 'sit-19',
    ico: '🛍️',
    title: 'Llenar el vacío del silencio con compras o redes',
    desc: 'Al llegar a casa a solas, el silencio activa una angustia indefinida que intentas adormecer con comida, scrolleo infinito o compras.',
    patternId: 'conexion',
  },
  {
    id: 'sit-20',
    ico: '❄️',
    title: 'Hacer ley del hielo tras un desacuerdo',
    desc: 'Te encierras en un mutismo gélido, dejas de hablarle al otro o te vas de la habitación para castigar o para no estallar.',
    patternId: 'evitacion',
  },
  {
    id: 'sit-21',
    ico: '🙈',
    title: 'Incomodidad o vergüenza al recibir un halago',
    desc: 'Cuando alguien reconoce tu belleza, tu esfuerzo o tu talento, minimizas el elogio de inmediato diciendo "no fue nada" o cambiando de tema.',
    patternId: 'aprobacion',
  },
  {
    id: 'sit-22',
    ico: '🎯',
    title: 'Exigirte tener la vida resuelta ya',
    desc: 'Te comparas con estándares ajenos en redes y sientes que vas tarde en la vida, castigándote por no estar en un punto perfecto.',
    patternId: 'defensa',
  },
];

export const CASE_DETAILS: Record<string, CaseDetail> = {
  conexion: {
    wound: 'Herida de abandono / miedo a perder el vínculo',
    video: [
      'Comprender el miedo al abandono',
      'Observa cómo el miedo a perder la conexión puede activar respuestas automáticas de apego ansioso.',
      'Vy_PBmvwPns',
    ],
    med: [
      'Meditación · Camino de la Confianza',
      'Vuelve a ti, habita tu cuerpo y practica seguridad interna sin depender del estado del otro.',
      'mUy5HReCjdY',
    ],
  },
  aprobacion: {
    wound: 'Herida de rechazo / necesidad de validación externa',
    video: [
      'Comprender la necesidad de aprobación',
      'Observa qué ocurre cuando tu tranquilidad depende de una respuesta o validación externa.',
      '-Atgq9A-KRg',
    ],
    med: [
      'Meditación · Amor Propio y Centro',
      'Practica regresar a tu propio valor sin tener que complacer ni pedir permiso para existir.',
      'MBC5Ip4W18U',
    ],
  },
  control: {
    wound: 'Herida de inseguridad básica / dificultad para confiar',
    video: [
      'Comprender la necesidad de control',
      'Observa cómo la incertidumbre activa la hipervigilancia en el sistema nervioso.',
      'atn5g3XJnPw',
    ],
    med: [
      'Meditación · Camino de la Confianza',
      'Suelta por unos momentos la necesidad de tener garantías y regresa al presente.',
      'mUy5HReCjdY',
    ],
  },
  evitacion: {
    wound: 'Herida de invasión / miedo a la vulnerabilidad',
    video: [
      'Comprender la evitación emocional',
      'Observa cómo alejarte te protege del malestar pero te desconecta de la intimidad profunda.',
      '-osCePH6STg',
    ],
    med: [
      'Meditación · Presencia y Calma',
      'Permanece contigo sin escapar de lo que sientes, respirando con compasión.',
      '2kFvMEmpyOg',
    ],
  },
  defensa: {
    wound: 'Herida de crítica temprana / desvalorización',
    video: [
      'Comprender la defensa automática',
      'Observa qué parte tierna de ti intenta protegerse antes de ser juzgada o atacada.',
      'Fuduj04-rNQ',
    ],
    med: [
      'Meditación · Amor Propio y Compasión',
      'Practica responderte con amabilidad antes de levantar la espada hacia el mundo.',
      'MBC5Ip4W18U',
    ],
  },
  autosuficiencia: {
    wound: 'Herida de desconfianza / dificultad para recibir',
    video: [
      'Comprender la autosuficiencia extrema',
      'Observa cuándo hacerlo todo solo/a se convierte en una armadura solitaria.',
      'FlRsaZgSfpk',
    ],
    med: [
      'Meditación · Camino de la Autonomía',
      'Aprende a diferenciar la verdadera autonomía del aislamiento defensivo.',
      'Q1jU6dVukXo',
    ],
  },
  limites: {
    wound: 'Herida de rechazo / miedo a la confrontación',
    video: [
      'Comprender por qué cuesta poner límites',
      'Observa cómo el miedo a la reacción del otro puede hacerte ceder y abandonarte.',
      'Y1pWULOsFFA',
    ],
    med: [
      'Meditación · Camino del Equilibrio',
      'Cuida el vínculo sin abandonarte: aprende a sostener un límite con serenidad.',
      'Mj_to__cejE',
    ],
  },
};

export const SOMATIC_EXERCISES: SomaticExercise[] = [
  {
    id: '478',
    ico: '🌬️',
    tit: 'Respiración 4-7-8',
    breathe: true,
    desc: 'Activa el nervio vago y devuelve la calma a tu sistema nervioso en pocos minutos.',
    pasos: [
      'Exhala completamente el aire por la boca produciendo un suave silbido.',
      'Cierra la boca e inhala tranquilamente por la nariz contando mentalmente hasta 4.',
      'Retén la respiración y sostén el aire contando hasta 7.',
      'Exhala profundamente por la boca contando hasta 8.',
      'Repite el ciclo 4 veces consecutivas con atención a tus sensaciones.',
    ],
  },
  {
    id: 'gro',
    ico: '🌿',
    tit: 'Grounding 5-4-3-2-1',
    desc: 'Ancla tu mente al espacio presente cuando la ansiedad o rumiación te sobrepase.',
    pasos: [
      'Mira a tu alrededor y nombra 5 cosas que puedes VER.',
      'Nota y toca 4 cosas que puedes SENTIR con tu piel o manos.',
      'Presta atención a 3 sonidos distintos que puedes ESCUCHAR.',
      'Identifica 2 aromas o cosas que puedes OLER.',
      'Reconoce 1 sabor presente en tu boca.',
    ],
  },
  {
    id: 'tap',
    ico: '✋',
    tit: 'Toques de calma (Tapping)',
    desc: 'Estimulación bilateral suave con la yema de tus dedos para desactivar la alarma cerebral.',
    pasos: [
      'Di con voz serena: "Aunque siento esta incomodidad, me acepto y estoy a salvo aquí".',
      'Da 7 toques suaves en el borde lateral de tu mano (punto de karate).',
      'Toca suavemente 7 veces el inicio de tu ceja, el lateral del ojo y bajo tu ojo.',
      'Da toques bajo tu nariz, en tu mentón y sobre tu clavícula.',
      'Coloca ambas manos en tu pecho y toma 3 respiraciones profundas.',
    ],
  },
  {
    id: 'sha',
    ico: '🐝',
    tit: 'Sacudida neurogénica',
    desc: 'El cuerpo de los mamíferos libera el estrés acumulado mediante el temblor natural.',
    pasos: [
      'Ponte de pie con los pies firmes y separados al ancho de tus caderas.',
      'Flexiona levemente las rodillas y comienza a sacudir los talones contra el suelo.',
      'Permite que el temblor ascienda por tus pantorrillas, muslos, pelvis y hombros.',
      'Sacude las manos y los brazos durante 2 a 3 minutos liberando sonidos con la exhalación.',
      'Detén el movimiento lentamente y quédate en quietud percibiendo el cosquilleo.',
    ],
  },
  {
    id: 'hor',
    ico: '🌙',
    tit: 'Ritmo y regulación del cortisol',
    desc: 'Hábitos somáticos simples que reducen la inflamación por estrés crónico.',
    pasos: [
      'Recibe luz solar directa en los ojos los primeros 20 minutos tras despertar.',
      'Evita cafeína durante los primeros 90 minutos de la mañana para estabilizar la adenosina.',
      'Incorpora una comida con proteína de calidad y grasas saludables antes del mediodía.',
      'Apaga pantallas o activa luz cálida al menos una hora antes de ir a dormir.',
      'Duerme en una habitación oscura y fresca durante 7 a 8 horas.',
    ],
  },
  {
    id: 'cue',
    ico: '💆',
    tit: 'Liberar cuello y hombros',
    desc: 'La postura de alerta encoge el trapecio. Suéltala con microestiramientos conscientes.',
    pasos: [
      'Inclina lentamente la cabeza hacia tu hombro derecho durante 30 segundos sin forzar.',
      'Cambia suavemente hacia el hombro izquierdo durante otros 30 segundos.',
      'Lleva tu barbilla hacia el pecho sintiendo el estiramiento en la base del cráneo.',
      'Realiza 3 círculos lentos con la cabeza en cada dirección.',
      'Eleva ambos hombros hasta las orejas al inhalar y déjalos caer de golpe al exhalar (5 veces).',
    ],
  },
];

export const MEDIA_RESOURCES: MediaResource[] = [
  {
    title: 'Meditación · Camino del Equilibrio',
    desc: 'Una práctica somática guiada para volver a tu centro cuando te sientas desbordado/a.',
    videoId: 'Mj_to__cejE',
    category: 'med',
  },
  {
    title: 'Meditación · Camino de la Confianza',
    desc: 'Cultiva una sensación interna de seguridad y confianza en tus propios recursos.',
    videoId: 'mUy5HReCjdY',
    category: 'med',
  },
  {
    title: 'Meditación · Camino de la Autonomía',
    desc: 'Una pausa profunda para reconocer tu fuerza sin caer en el aislamiento defensivo.',
    videoId: 'Q1jU6dVukXo',
    category: 'med',
  },
  {
    title: 'Meditación · Sanación del Alma',
    desc: 'Espacio íntimo de presencia, compasión y conexión con tu esencia auténtica.',
    videoId: 'ZWuDUvMHVqY',
    category: 'med',
  },
  {
    title: 'Meditación · Presencia y Calma',
    desc: 'Aprende a quedarte con lo que sientes en el momento presente sin juzgarlo.',
    videoId: '2kFvMEmpyOg',
    category: 'med',
  },
  {
    title: 'Meditación · Amor Propio',
    desc: 'Una práctica transformadora de cuidado interno, afecto y reparación de la crítica.',
    videoId: 'MBC5Ip4W18U',
    category: 'med',
  },
  {
    title: 'Momento de Sanación 1 · Herida de abandono',
    desc: 'Cápsula breve para recordar que la presencia que buscas empieza en ti.',
    videoId: 'Vy_PBmvwPns',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 2 · Buscar aprobación',
    desc: 'Un recordatorio de que tu valor no fluctúa según el aplauso ajeno.',
    videoId: '-Atgq9A-KRg',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 3 · Soltar el control',
    desc: 'La paz llega cuando dejas de exigirle garantías absolutas a la vida.',
    videoId: 'atn5g3XJnPw',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 4 · La armadura de la evitación',
    desc: 'Por qué huir cansa más que quedarse a escuchar con compasión.',
    videoId: '-osCePH6STg',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 5 · Dejar la espada',
    desc: 'Cómo responder desde tu centro en lugar de reaccionar desde la defensa.',
    videoId: 'Fuduj04-rNQ',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 6 · Abrirse a recibir',
    desc: 'La autosuficiencia extrema se disuelve cuando te permites ser sostenido/a.',
    videoId: 'FlRsaZgSfpk',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 7 · El coraje de poner un límite',
    desc: 'Un límite claro es el puente hacia relaciones honestas y duraderas.',
    videoId: 'Y1pWULOsFFA',
    category: 'short',
  },
  {
    title: 'Momento de Sanación 8 · Sacar virtud del caos',
    desc: 'Honra cada paso de tu proceso: sanar no es lineal y está bien así.',
    videoId: 'Qt7wH259L3U',
    category: 'short',
  },
];

export const ANCHORS_MORNING: AnchorItem[] = [
  {
    id: 'cama',
    icon: '🛏️',
    title: 'Tender la cama',
    desc: 'Marca el inicio consciente y ordenado de tu día.',
  },
  {
    id: 'mov',
    icon: '🏃',
    title: 'Mover el cuerpo 10 minutos',
    desc: 'Caminar, estirar o bailar: despierta tu circulación somática.',
  },
  {
    id: 'med',
    icon: '🧘',
    title: 'Respirar o meditar 5 minutos',
    desc: 'Conecta con tu respiración antes de encender pantallas.',
  },
  {
    id: 'sc',
    icon: '☀️',
    title: 'Sin celular la primera media hora',
    desc: 'Permite que tu mente despierte a su propio ritmo.',
  },
];

export const ANCHORS_AFTERNOON: AnchorItem[] = [
  {
    id: 'pausa',
    icon: '🌬️',
    title: 'Una pausa consciente',
    desc: 'Detente 2 minutos, toma 3 respiraciones y mira el horizonte.',
  },
  {
    id: 'comer',
    icon: '🍽️',
    title: 'Comer sin pantallas',
    desc: 'Saborea cada bocado y siente la textura de tu alimento.',
  },
  {
    id: 'crear',
    icon: '🎨',
    title: '10 minutos de creatividad o lectura',
    desc: 'Nutre tu curiosidad sin metas de productividad.',
  },
];

export const ANCHORS_NIGHT: AnchorItem[] = [
  {
    id: 'sc2',
    icon: '🌙',
    title: 'Sin pantallas 45 minutos antes de dormir',
    desc: 'Facilita la secreción natural de melatonina y descanso profundo.',
  },
  {
    id: '3cosas',
    icon: '💛',
    title: '3 cosas que agradeces de ti hoy',
    desc: 'Reconoce tu esfuerzo diario, aunque el día haya sido desafiante.',
  },
  {
    id: 'prep',
    icon: '🌅',
    title: 'Dejar un detalle listo para mañana',
    desc: 'Reduce la ansiedad anticipatoria de la mañana siguiente.',
  },
];

export const INTENTION_CARDS: string[] = [
  'Hoy, la calma te elige a ti. Recíbela sin condiciones.',
  'Confía en el paso pequeño que diste hoy. Todo suma.',
  'No huyas de lo que ya empezaste a sanar. Estás a salvo.',
  'Tu intuición sabe más de lo que crees hoy. Escucha tu cuerpo.',
  'Suelta el control por este instante. El universo también sostiene.',
  'Hoy se te invita a descansar sin culpa. El descanso es sagrado.',
  'Una puerta se abre cuando dejas de forzarla con ansiedad.',
  'Tu voz merece ocupar espacio hoy. Dila con serenidad.',
  'Lo que buscas afuera con urgencia ya vive sembrado en ti.',
  'Hoy elige la versión honesta de ti antes que la perfecta.',
  'No necesitas apurarte para llegar a donde ya estás yendo.',
  'Permítete sentir sin apresurarte a explicar lo que sientes.',
  'Hoy es un día propicio para empezar de nuevo con ternura.',
  'Tu cuerpo tiene algo valioso que decirte: dale unos minutos.',
  'Lo que sueltas con amor deja espacio para lo que realmente resuena.',
  'Eres bienvenido/a en este mundo tal como llegas hoy.',
  'No todo necesita una respuesta inmediata. Dale tiempo al silencio.',
  'Hoy practica mirarte al espejo sin emitir ningún juicio.',
  'Algo sabio en ti ya sabe exactamente cómo sanar esto.',
  'Date el permiso de no encajar con expectativas que no son tuyas.',
  'Tu descanso también es productivo para tu alma.',
  'Hoy elige un límite pequeño y sostenlo con amor propio.',
  'La paciencia contigo misma/o es tu mayor acto de generosidad.',
  'No necesitas la aprobación de nadie más para validar tu camino.',
  'Hoy deja que algo viejo y pesado se quede atrás.',
  'Tu presencia, tal cual es hoy, ya tiene un valor infinito.',
  'Respira antes de reaccionar: en esa pausa habita tu libertad.',
  'Confía un poco más en los tiempos de tu propio proceso.',
  'Hoy es un buen día para agradecerte todo lo que has superado.',
  'Lo que sientes en este momento también es información de valor.',
];

export const DAILY_PHRASES: string[] = [
  'Hoy no necesitas tenerlo todo resuelto. Solo necesitas observar.',
  'Tu presencia ya es suficiente, incluso en un día difícil.',
  'Puedes ir despacio y aun así estar avanzando hacia tu paz.',
  'No todo lo que sientes hoy es una verdad permanente.',
  'Date permiso de empezar de nuevo, aunque sea la tercera vez hoy.',
  'Lo que hoy te cuesta, mañana lo sabrás sostener mejor.',
  'Respirar profundo tres veces también cuenta como cuidarte.',
  'No tienes que cargarlo todo tú solo/a.',
  'Un pequeño paso consciente vale más que diez automáticos.',
  'Está bien no saber qué sientes todavía. Dale tiempo.',
  'Tu ritmo es válido, aunque no sea el de los demás.',
  'Hoy puedes elegir una respuesta distinta a la de siempre.',
  'Mereces la misma paciencia que le das a otros.',
  'Lo que te repites en silencio, tu cuerpo lo escucha.',
  'No estás retrocediendo, estás integrando.',
  'Puedes soltar algo hoy sin culpa.',
  'Tu historia no termina en el patrón que acabas de notar.',
  'Sanar no es lineal, y tampoco tiene que serlo hoy.',
  'Eres más que la reacción que tuviste hoy.',
  'Cuidarte también es decir que no a tiempo.',
  'Hoy es un buen día para escucharte con más calma.',
  'No necesitas resolverlo todo, solo dar el siguiente paso pequeño.',
  'El descanso también es parte del proceso.',
  'Puedes estar en paz sin tener que entenderlo todo.',
  'Tu valor no sube ni baja según lo productivo/a que seas hoy.',
  'Está bien pedir ayuda antes de llegar al límite.',
  'Cada vez que te observas con calma, tu patrón pierde fuerza.',
  'Hoy puedes elegir la versión más amable de ti mismo/a.',
  'No tienes que convencer a nadie de tu proceso, ni siquiera a ti.',
  'Ser constante no significa ser perfecto/a.',
];

export const BELONGING_ROADMAP = [
  {
    icon: '🔍',
    title: 'Observar el miedo a ser visto/a',
    desc: 'Notar cuándo me callo o me empequeñezco por miedo al qué dirán.',
  },
  {
    icon: '🗣️',
    title: 'Reclamar mi voz auténtica',
    desc: 'Practicar expresar una opinión sin pedir disculpas por tenerla.',
  },
  {
    icon: '🌳',
    title: 'Habitar mi cuerpo con dignidad',
    desc: 'Sentirme cómodo/a ocupando mi lugar en cualquier espacio.',
  },
];

export const BELONGING_PATTERNS = [
  {
    icon: '🙅',
    title: 'El "No" antes del "No"',
    desc: 'Rechazas una invitación o te alejas de alguien por miedo a que te rechacen primero.',
  },
  {
    icon: '🙏',
    title: 'Pedir perdón por existir',
    desc: 'Dices "perdón" al entrar, al hacer una pregunta o por ocupar un asiento legítimo.',
  },
  {
    icon: '💯',
    title: 'El perfeccionismo como escudo',
    desc: 'Crees que si no eres perfecto/a no eres digno/a de amor. Un error se siente catastrófico.',
  },
  {
    icon: '👻',
    title: 'Hacerte invisible para no molestar',
    desc: 'Te vistes neutro, guardas silencio y evitas tus preferencias para no incomodar.',
  },
  {
    icon: '🏃',
    title: 'La máscara del huidizo/a',
    desc: 'Cuando una conversación se vuelve emocional o profunda, sientes ganas de escapar.',
  },
];

export const BELONGING_CHECKS = [
  { icon: '🙏', label: 'Agradecer' },
  { icon: '📚', label: 'Aprender algo' },
  { icon: '🛋️', label: 'Descansar' },
  { icon: '🏃', label: 'Moverme' },
  { icon: '🐢', label: 'Ir a mi ritmo' },
  { icon: '🌬️', label: 'No presionarme' },
  { icon: '🌤️', label: 'Tomar aire fresco' },
  { icon: '🧘', label: 'Meditar' },
];
