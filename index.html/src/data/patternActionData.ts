export interface PatternNeurohack {
  name: string;
  category: 'somático' | 'cognitivo' | 'relacional';
  icon: string;
  tagline: string;
  instruction: string;
  phraseOrMantra?: string;
  timeNeeded: string;
}

export interface PatternActionKit {
  patternId: string;
  title: string;
  woundTitle: string;
  summary: string;
  video: {
    title: string;
    desc: string;
    videoId: string;
    duration: string;
  };
  meditation: {
    title: string;
    desc: string;
    videoId: string;
    duration: string;
  };
  neurohacks: PatternNeurohack[];
  whatToDoSteps: {
    stepNumber: number;
    title: string;
    action: string;
    toolLabel: string;
  }[];
}

export const PATTERN_ACTION_KITS: Record<string, PatternActionKit> = {
  conexion: {
    patternId: 'conexion',
    title: 'Conservar la conexión a costa de ti',
    woundTitle: 'Herida de Abandono y Miedo a la Desconexión',
    summary:
      'Tu sistema percibe la distancia o frialdad del otro como una amenaza de extinción vincular. Tiendes a sobre-explicar, ceder o buscar urgente reconexión para calmar la alarma interna.',
    video: {
      title: 'Momento de Sanación 1 · Comprender el miedo al abandono',
      desc: 'Cápsula audiovisual profunda para reconocer cómo el miedo a la soledad activa respuestas automáticas de apego ansioso y cómo empezar a habitarte a ti mismo/a.',
      videoId: 'Vy_PBmvwPns',
      duration: '4 min',
    },
    meditation: {
      title: 'Meditación · Camino de la Confianza',
      desc: 'Práctica guiada para construir un ancla de presencia en tu cuerpo, soltando la urgencia de buscar garantías en la otra persona.',
      videoId: 'mUy5HReCjdY',
      duration: '12 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Doble Contención en Pecho y Abdomen',
        category: 'somático',
        icon: '🤲',
        tagline: 'Estimulación del nervio vago y propiocepción de seguridad',
        instruction:
          'Coloca la mano derecha sobre el centro del pecho (esternón) y la mano izquierda sobre el vientre. Presiona con una firmeza suave y templada. Cierra los ojos e inhala en 4 segundos sintiendo tus manos, exhala en 6 segundos soltando el aire por la boca entreabierta.',
        phraseOrMantra: 'Estoy aquí conmigo. No me estoy abandonando.',
        timeNeeded: '60 segundos',
      },
      {
        name: 'Neurohack Cognitivo: La Regla de la Pausa de 20 Minutos',
        category: 'cognitivo',
        icon: '⏱️',
        tagline: 'Desactivar la dopamina urgente y el pico de cortisol',
        instruction:
          'Ante las ganas desesperadas de enviar un mensaje aclaratorio, llamar o preguntar si todo está bien: pon un temporizador de 20 minutos en tu teléfono. Levántate, toma agua fresca o camina. El 80% de la urgencia desaparecerá cuando descienda la adrenalina.',
        phraseOrMantra: 'El silencio del otro no es una prueba de que he dejado de existir.',
        timeNeeded: '20 minutos',
      },
      {
        name: 'Neurohack Relacional: Pasar de la Exigencia a la Vulnerabilidad',
        category: 'relacional',
        icon: '💬',
        tagline: 'Comunicar necesidad sin presionar ni reclamar',
        instruction:
          'En lugar de escribir en automático reproches o preguntas inquisitivas ("¿por qué estás así?", "¿te pasa algo conmigo?"), utiliza la frase de anclaje consciente.',
        phraseOrMantra:
          '“Noto que mi mente se inquieta con el silencio. Cuando tengas un ratito libre hoy, me encantaría que nos saludemos tranquilamente.”',
        timeNeeded: '1 minuto',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Regula tu fisiología primero',
        action: 'Aplica el Neurohack Somático de doble contención durante 60 segundos antes de enviar cualquier mensaje.',
        toolLabel: 'Neurohack Somático',
      },
      {
        stepNumber: 2,
        title: 'Comprende el detonante en video',
        action: 'Mira la cápsula de 4 minutos sobre la herida de abandono para desculpabilizarte y entender a tu niño/a interno.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Repara el vínculo contigo en meditación',
        action: 'Escucha la Meditación "Camino de la Confianza" para volver a tu centro y no mendigar validación.',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Reescribe tu respuesta con Alma (IA)',
        action: 'Pídele a Alma que analice el mensaje o situación exacta para encontrar una respuesta adulta y digna.',
        toolLabel: 'Conversar con Alma',
      },
    ],
  },

  aprobacion: {
    patternId: 'aprobacion',
    title: 'Buscar confirmación para sentir seguridad',
    woundTitle: 'Herida de Rechazo y Necesidad de Validación Externa',
    summary:
      'Tu tranquilidad depende de la aprobación ajena. Cuando no tienes certeza sobre lo que otros opinan o sienten sobre ti, tu mente deduce que algo hiciste mal o que no eres suficiente.',
    video: {
      title: 'Momento de Sanación 2 · Buscar aprobación',
      desc: 'Comprende qué sucede biológicamente cuando tu paz mental fluctúa según la respuesta o el silencio del otro.',
      videoId: '-Atgq9A-KRg',
      duration: '4 min',
    },
    meditation: {
      title: 'Meditación · Amor Propio y Centro',
      desc: 'Práctica profunda para reconocer tu dignidad inherente, liberándote de la necesidad constante de complacer para existir.',
      videoId: 'MBC5Ip4W18U',
      duration: '11 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Anclaje de Esternón y Respiración con Suspiro',
        category: 'somático',
        icon: '🫀',
        tagline: 'Devolver la atención del campo externo al centro propio',
        instruction:
          'Coloca la yema de tus dedos en el hueco entre las clavículas. Da 5 golpecitos suaves con la yema de los dedos y realiza un suspiro fisiológico: doble inhalación por nariz y exhalación sonora por la boca con un suave sonido "Ahhh".',
        phraseOrMantra: 'Mi valor no se negocia ni depende de la aprobación de nadie.',
        timeNeeded: '45 segundos',
      },
      {
        name: 'Neurohack Cognitivo: El Filtro de la Auto-Validación Previa',
        category: 'cognitivo',
        icon: '🔍',
        tagline: 'Detener la búsqueda refleja de aplauso o confirmación',
        instruction:
          'Antes de pedir opinión o reaseguro a otra persona ("¿qué tal lo hice?", "¿está bien así?"), escribe en una hoja o nota: "¿Qué opino yo de lo que hice? ¿A mí me parece honesto y suficiente?". Dale voz a tu propio criterio primero.',
        phraseOrMantra: 'Si yo apruebo mi intención, la opinión ajena es solo un dato, no una condena.',
        timeNeeded: '2 minutos',
      },
      {
        name: 'Neurohack Relacional: Renunciar a Disculparte por Existir',
        category: 'relacional',
        icon: '🛡️',
        tagline: 'Desactivar la sumisión y complacencia automática',
        instruction:
          'Elimina los "perdón por molestar" o "disculpa si te incomodo". Sustitúyelos por agradecimiento positivo o comunicación directa.',
        phraseOrMantra: 'Cambia “Perdón por la demora” por “Gracias por esperarme pacientemente”.',
        timeNeeded: 'Inmediato',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Detén la búsqueda de confirmación',
        action: 'Aplica el Neurohack de auto-validación previa antes de volver a preguntar si todo está bien.',
        toolLabel: 'Neurohack Cognitivo',
      },
      {
        stepNumber: 2,
        title: 'Observa la trampa de la aprobación',
        action: 'Mira el video de 4 minutos sobre cómo la necesidad de agradar desgasta tu energía vital.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Práctica de Amor Propio',
        action: 'Realiza la meditación de 11 minutos para sembrar firmeza y amabilidad interna incondicional.',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Entrena un límite en el Laboratorio',
        action: 'Practica responder a una situación donde temes el rechazo pero eliges sostenerte con respeto.',
        toolLabel: 'Laboratorio de Práctica',
      },
    ],
  },

  control: {
    patternId: 'control',
    title: 'Controlar para calmar la incertidumbre',
    woundTitle: 'Herida de Inseguridad Temprana e Hiperalerta Aprendida',
    summary:
      'Tu sistema nervioso asocia la falta de certeza con peligro inminente. Intentas prever, dirigir, revisar o exigir garantías para mitigar una angustia visceral que no tolera lo imprevisto.',
    video: {
      title: 'Momento de Sanación 3 · Soltar el control',
      desc: 'Aprende a diferenciar el cuidado responsable del control obsesivo impulsado por el miedo.',
      videoId: 'atn5g3XJnPw',
      duration: '5 min',
    },
    meditation: {
      title: 'Meditación · Camino de la Confianza',
      desc: 'Entrega suave de las cargas que no te corresponden. Regresa al momento presente y confía en tu capacidad de resolver cuando llegue el momento.',
      videoId: 'mUy5HReCjdY',
      duration: '12 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Relajación de Mandíbula y Sacudida de Muñecas',
        category: 'somático',
        icon: '💆',
        tagline: 'Desactivar la señal de lucha o huida en los maseteros',
        instruction:
          'Separa los dientes 1 centímetro, deja caer la mandíbula pesada y apoya la lengua relajada en el suelo de la boca. Sacude ambas muñecas como si te estuvieras secando gotas de agua durante 30 segundos.',
        phraseOrMantra: 'Suelto lo que no puedo controlar. Mi cuerpo está seguro en el ahora.',
        timeNeeded: '45 segundos',
      },
      {
        name: 'Neurohack Cognitivo: Los Dos Círculos de Epicteto',
        category: 'cognitivo',
        icon: '⭕',
        tagline: 'Separar lo que depende de ti de lo que no',
        instruction:
          'En un papel dibuja dos columnas: 1) "Lo que sí depende de mi acción hoy" (mi respiración, mi trato, mi trabajo). 2) "Lo que NO depende de mí" (lo que piensen otros, los imprevistos, el futuro). Tacha la segunda columna y quita tus manos de ella.',
        phraseOrMantra: 'Ocuparme, no pre-ocuparme. Hago mi 50% y suelto el 50% de la vida.',
        timeNeeded: '3 minutos',
      },
      {
        name: 'Neurohack Relacional: La Práctica de la Micro-Delegación',
        category: 'relacional',
        icon: '🤝',
        tagline: 'Entrenar al sistema nervioso en permitir que otros hagan a su manera',
        instruction:
          'Permite que otra persona realice una tarea cotidiana (lavar los platos, elegir una ruta, tomar una decisión) SIN corregirla, sin intervenir y sin rehacerla después. Tolera verla hecha diferente.',
        phraseOrMantra: 'Diferente no significa mal hecho. Mi paz vale más que tener la razón.',
        timeNeeded: 'En el acto',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Desactiva la mandíbula apretada',
        action: 'Haz el Neurohack somático de mandíbula y sacudida de muñecas para bajar la alarma cerebral.',
        toolLabel: 'Neurohack Somático',
      },
      {
        stepNumber: 2,
        title: 'Comprende el origen del control',
        action: 'Mira el video de 5 minutos sobre cómo la hipervigilancia infantil se convirtió en tu armadura.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Meditación para soltar el timón',
        action: 'Permítete 12 minutos de rendición compasiva con la meditación "Camino de la Confianza".',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Diseña un ancla con Alma (IA)',
        action: 'Conversa con Alma para crear una frase o ritual de entrega cuando la mente empiece a catastrofizar.',
        toolLabel: 'Conversar con Alma',
      },
    ],
  },

  evitacion: {
    patternId: 'evitacion',
    title: 'Alejarte para no sentirte vulnerable',
    woundTitle: 'Herida de Invasión y Miedo a la Exposición Emocional',
    summary:
      'Cuando una situación se vuelve íntima, conflictiva o abrumadora, tu mecanismo reflejo es huir, desconectarte, decir "no pasa nada" o aislarte detrás de un muro para no ser lastimado/a.',
    video: {
      title: 'Momento de Sanación 4 · La armadura de la evitación',
      desc: 'Observa por qué huir cansa más que quedarse y cómo abrir una pequeña rendija hacia la conexión real.',
      videoId: '-osCePH6STg',
      duration: '4 min',
    },
    meditation: {
      title: 'Meditación · Presencia y Calma',
      desc: 'Aprende a permanecer en tu cuerpo sin escapar de lo que sientes, respirando con suavidad y paciencia.',
      videoId: '2kFvMEmpyOg',
      duration: '10 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Mirada Panorámica y Pies a Tierra',
        category: 'somático',
        icon: '👀',
        tagline: 'Activar el sistema parasimpático ventral desenfocando la mirada de túnel',
        instruction:
          'Cuando sientas ganas de huir o congelarte: apoya ambos pies firmes en el suelo. Sin mover los ojos, ensancha tu campo visual hacia los lados hasta que puedas ver tus manos moviéndose por el rabillo del ojo. Esto le indica al cerebro reptiliano que no hay un depredador persiguiéndote.',
        phraseOrMantra: 'Puedo quedarme con lo que siento. Es solo una ola corporal pasajera.',
        timeNeeded: '60 segundos',
      },
      {
        name: 'Neurohack Cognitivo: La Diferencia entre Pausa y Abandono',
        category: 'cognitivo',
        icon: '🧠',
        tagline: 'Desactivar la fantasía de que desaparecer resuelve el dolor',
        instruction:
          'Reconoce la diferencia: huir en silencio crea resentimiento y agranda el conflicto. Tomar una pausa declarada te da seguridad y protege el vínculo.',
        phraseOrMantra: 'No estoy huyendo: me estoy regulando para poder responder con presencia.',
        timeNeeded: '30 segundos',
      },
      {
        name: 'Neurohack Relacional: La Frase del Tiempo Fuera Consciente',
        category: 'relacional',
        icon: '🚪',
        tagline: 'No desaparecer; avisar para cuidar la relación',
        instruction:
          'En vez de apagar el teléfono o marcharte sin hablar, usa esta frase protectora pero vinculante.',
        phraseOrMantra:
          '“Me siento abrumado/a y noto que me estoy cerrando. Me importa esta conversación, así que me tomo 20 minutos para calmarme y vuelvo contigo.”',
        timeNeeded: 'Inmediato',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Amplía tu campo visual',
        action: 'Aplica el Neurohack de mirada panorámica para salir del estado de congelamiento o huida.',
        toolLabel: 'Neurohack Somático',
      },
      {
        stepNumber: 2,
        title: 'Observa la trampa del aislamiento',
        action: 'Mira el video de 4 minutos sobre la armadura de la evitación y el costo del silencio.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Aprende a estar contigo',
        action: 'Escucha la Meditación "Presencia y Calma" para tolerar la incomodidad sin fugarte a la mente.',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Practica la frase de tiempo fuera',
        action: 'Ve al Laboratorio de Práctica para entrenar cómo comunicar que necesitas un respiro sin herir.',
        toolLabel: 'Laboratorio de Práctica',
      },
    ],
  },

  defensa: {
    patternId: 'defensa',
    title: 'Protegerte antes de ser herido/a',
    woundTitle: 'Herida de Crítica Temprana o Desvalorización',
    summary:
      'Percibes comentarios neutros o discrepancias como ataques personales directos a tu dignidad. Tu respuesta refleja es desenfundar la espada, justificarte o contraatacar antes de escuchar.',
    video: {
      title: 'Momento de Sanación 5 · Dejar la espada',
      desc: 'Descubre qué parte vulnerable de ti se sintió amenazada justo antes de levantar la guardia y cómo bajar la espada.',
      videoId: 'Fuduj04-rNQ',
      duration: '4 min',
    },
    meditation: {
      title: 'Meditación · Amor Propio y Compasión',
      desc: 'Práctica para reparar la herida de desvalorización y responderte con amabilidad antes de defenderte del mundo.',
      videoId: 'MBC5Ip4W18U',
      duration: '11 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Palmas Abiertas y Hombros Suaves',
        category: 'somático',
        icon: '👐',
        tagline: 'Incompatibilidad neuromuscular con el ataque',
        instruction:
          'Coloca las palmas de tus manos abiertas hacia arriba sobre tus muslos. Inhala profundo y al exhalar deja caer los hombros 2 centímetros hacia abajo. Es biológicamente imposible sostener el modo de ataque con las palmas abiertas y los hombros relajados.',
        phraseOrMantra: 'Bajo la espada. No estoy bajo ataque en este momento.',
        timeNeeded: '30 segundos',
      },
      {
        name: 'Neurohack Cognitivo: La Regla de los 3 Segundos de Silencio',
        category: 'cognitivo',
        icon: '⏳',
        tagline: 'Interrumpir el reflejo de justificación inmediata',
        instruction:
          'Cuando alguien te critique o señale un error, cuenta mentalmente "1... 2... 3..." antes de abrir la boca. En esos 3 segundos, recuérdate: "Lo que dice es información sobre su experiencia, no un juicio sobre todo mi valor como persona".',
        phraseOrMantra: 'Puedo escuchar sin tener que estar de acuerdo ni tener que justificarme.',
        timeNeeded: '3 segundos',
      },
      {
        name: 'Neurohack Relacional: Cambiar el Contraataque por Curiosidad',
        category: 'relacional',
        icon: '❓',
        tagline: 'Desarmar el ring de boxeo verbal',
        instruction:
          'En lugar de responder con "tú también hiciste..." o "lo hice porque tú...", responde con una pregunta honesta de indagación.',
        phraseOrMantra:
          '“¿A qué te refieres exactamente con eso? Cuéntame más para entender tu punto de vista.”',
        timeNeeded: 'Inmediato',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Abre las palmas de tus manos',
        action: 'Haz el Neurohack somático de palmas abiertas para frenar el reflejo muscular de defensa.',
        toolLabel: 'Neurohack Somático',
      },
      {
        stepNumber: 2,
        title: 'Mira cómo soltar la espada',
        action: 'Visualiza la cápsula de 4 minutos sobre por qué nos defendemos ferozmente y cómo sanar la crítica.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Cultiva compasión hacia ti',
        action: 'Haz la Meditación de Amor Propio para sanar la voz autocrítica que alimenta la defensiva externa.',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Analiza tu respuesta con Alma (IA)',
        action: 'Escríbele a Alma lo que te dijeron y ensaya cómo contestar con aplomo adulto sin agredir.',
        toolLabel: 'Conversar con Alma',
      },
    ],
  },

  autosuficiencia: {
    patternId: 'autosuficiencia',
    title: 'No necesitar a nadie para estar a salvo',
    woundTitle: 'Herida de Desconfianza Temprana e Hiperindependencia',
    summary:
      'Aprendiste que depender de alguien es peligroso o decepcionante. Llevas todo el peso sobre tus hombros, te cuesta pedir ayuda y consideras la vulnerabilidad como una falla de carácter.',
    video: {
      title: 'Momento de Sanación 6 · Abrirse a recibir',
      desc: 'Aprende a diferenciar la sana autonomía de la soledad defensiva que te agota y desconecta.',
      videoId: 'FlRsaZgSfpk',
      duration: '4 min',
    },
    meditation: {
      title: 'Meditación · Camino de la Autonomía',
      desc: 'Práctica para abrazar tu verdadera fortaleza interior sin necesidad de convertirte en una fortaleza inexpugnable.',
      videoId: 'Q1jU6dVukXo',
      duration: '11 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Entrega Dorsal en el Respaldo',
        category: 'somático',
        icon: '🪑',
        tagline: 'Permitir que algo externo sostenga tu peso físico',
        instruction:
          'Siéntate y apoya toda tu columna contra el respaldo de una silla sólida o contra la pared. Cierra los ojos y conscientemente quita el esfuerzo de sostenerte: deja que la estructura cargue tu peso durante 1 minuto entero.',
        phraseOrMantra: 'Está bien dejarme sostener. No tengo que cargarlo todo a solas.',
        timeNeeded: '1 minuto',
      },
      {
        name: 'Neurohack Cognitivo: Reencuadre de la Vulnerabilidad',
        category: 'cognitivo',
        icon: '💡',
        tagline: 'Desarmar la creencia de que pedir apoyo es debilidad',
        instruction:
          'Pregúntate: "¿Si un amigo o ser querido me pide ayuda, lo considero débil o una carga?". Tu respuesta será un "no" rotundo. Aplícate a ti misma/o la misma generosidad que le das a los demás.',
        phraseOrMantra: 'Pedir ayuda le da a otros el regalo de acompañarme.',
        timeNeeded: '1 minuto',
      },
      {
        name: 'Neurohack Relacional: La Micro-Petición sin Disculpas',
        category: 'relacional',
        icon: '🤲',
        tagline: 'Entrenar el músculo de recibir sin sentir deuda',
        instruction:
          'Pide hoy algo pequeño y cotidiano a alguien (que te alcancen algo, que te sostengan la puerta, que te recomienden algo). Cuando te lo den, solo di "Muchas gracias" con una sonrisa. Prohibido disculparte o apresurarte a compensar.',
        phraseOrMantra: '“¿Podrías ayudarme con esto un momento? Muchas gracias.”',
        timeNeeded: 'En el acto',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Descarga tu columna en el respaldo',
        action: 'Realiza el Neurohack somático de entrega dorsal para aflojar la rigidez muscular de autosuficiencia.',
        toolLabel: 'Neurohack Somático',
      },
      {
        stepNumber: 2,
        title: 'Aprende a abrirte a recibir',
        action: 'Mira el video de 4 minutos sobre cómo desmantelar la coraza de la soledad autosuficiente.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Meditación para una autonomía integrada',
        action: 'Practica la Meditación "Camino de la Autonomía" para reconocer tu valor sin aislarte.',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Explora tus frenos con Alma (IA)',
        action: 'Conversa con Alma sobre qué te da miedo que ocurra si muestras que no puedes con todo.',
        toolLabel: 'Conversar con Alma',
      },
    ],
  },

  limites: {
    patternId: 'limites',
    title: 'Ceder para evitar el conflicto',
    woundTitle: 'Herida de Rechazo y Miedo a la Confrontación o Ira Ajena',
    summary:
      'Cuando sientes que debes decir "no", anticipas que el otro se enojará o te retirará su cariño. Prefieres pagar el precio con tu propio agotamiento antes que soportar la incomodidad del límite.',
    video: {
      title: 'Momento de Sanación 7 · El coraje de poner un límite',
      desc: 'Comprende que un límite honesto no destruye la relación: la salva del resentimiento silencioso.',
      videoId: 'Y1pWULOsFFA',
      duration: '5 min',
    },
    meditation: {
      title: 'Meditación · Camino del Equilibrio',
      desc: 'Una práctica somática guiada para sostener tu centro y aprender a decir "no" desde la serenidad y no desde la culpa.',
      videoId: 'Mj_to__cejE',
      duration: '11 min',
    },
    neurohacks: [
      {
        name: 'Neurohack Somático: Presión en el Plexo Solar y Pies Enraizados',
        category: 'somático',
        icon: '⚡',
        tagline: 'Conectar con el centro de soberanía y fuerza personal',
        instruction:
          'Ponte de pie con los pies firmes separados al ancho de hombros. Coloca tu mano derecha 3 centímetros arriba de tu ombligo (plexo solar) ejerciendo una leve presión hacia adentro. Inhala sintiendo tu columna erguida y exhala con firmeza sintiendo la raíz de tus piernas.',
        phraseOrMantra: 'Decir no a esto es decirme sí a mí y a mi salud.',
        timeNeeded: '45 segundos',
      },
      {
        name: 'Neurohack Cognitivo: Tolerancia al Malestar Ajeno',
        category: 'cognitivo',
        icon: '🛡️',
        tagline: 'Desactivar la culpa refleja al decepcionar expectativas ajenas',
        instruction:
          'Repite este principio de oro: "La incomodidad temporal de la otra persona no es una emergencia que yo deba resolver traicionándome a mí". El otro tiene derecho a frustrarse y tú tienes derecho a tus límites.',
        phraseOrMantra: 'Puedo amar a alguien y al mismo tiempo no estar disponible para su petición.',
        timeNeeded: '30 segundos',
      },
      {
        name: 'Neurohack Relacional: La Frase Escudo de la Respuesta Aplazada',
        category: 'relacional',
        icon: '🛑',
        tagline: 'Nunca digas "sí" bajo presión inmediata',
        instruction:
          'Memoriza y utiliza siempre esta respuesta puente cuando te pidan un compromiso o favor inesperado.',
        phraseOrMantra:
          '“Déjame revisar mi energía y mis tiempos de hoy, y te confirmo más tarde si me es posible.”',
        timeNeeded: 'Inmediato',
      },
    ],
    whatToDoSteps: [
      {
        stepNumber: 1,
        title: 'Enraíza tu plexo y pies',
        action: 'Aplica el Neurohack somático de plexo solar para conectar con tu firmeza antes de responder.',
        toolLabel: 'Neurohack Somático',
      },
      {
        stepNumber: 2,
        title: 'Comprende el coraje del límite',
        action: 'Mira el video de 5 minutos sobre por qué decir no es el acto de amor propio más necesario.',
        toolLabel: 'Ver Video Guía',
      },
      {
        stepNumber: 3,
        title: 'Meditación para sostener el equilibrio',
        action: 'Escucha la Meditación "Camino del Equilibrio" para limpiar la culpa de poner frenos sanos.',
        toolLabel: 'Hacer Meditación',
      },
      {
        stepNumber: 4,
        title: 'Entrena tus frases de límites en el Laboratorio',
        action: 'Accede al Laboratorio de Práctica para redactar y ensayar tu "no" compasivo pero inquebrantable.',
        toolLabel: 'Laboratorio de Práctica',
      },
    ],
  },
};

import { ALMA_CASES, AlmaCase } from './almaCasesData';

export const getActionKitForPattern = (patternId: string): PatternActionKit => {
  if (PATTERN_ACTION_KITS[patternId]) {
    return PATTERN_ACTION_KITS[patternId];
  }
  // Fallback mappings
  if (patternId === 'certeza') return PATTERN_ACTION_KITS.aprobacion;
  return PATTERN_ACTION_KITS.conexion;
};

export const getMatchedCaseForPattern = (patternId: string): AlmaCase => {
  const mapping: Record<string, string> = {
    conexion: 'caso-celos',
    aprobacion: 'caso-complacencia',
    control: 'caso-delegar-control',
    evitacion: 'caso-compromiso',
    defensa: 'caso-necesidad-razon',
    autosuficiencia: 'caso-expectativas-ajenas',
    limites: 'caso-limites-familia',
    certeza: 'caso-impostor',
  };
  const targetId = mapping[patternId] || 'caso-celos';
  const found = ALMA_CASES.find((c) => c.id === targetId);
  return found || ALMA_CASES[0];
};
