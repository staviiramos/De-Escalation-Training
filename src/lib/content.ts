// Content ported verbatim from the Claude Design prototype
// ("De-Escalation Training.dc.html", see design_handoff_deescalation_training/).
// Lesson section body copy is English-only (matching the prototype's final
// state — Spanish covers chrome, quizzes, scenarios, and the game, not the
// long-form lesson prose). Keep copy changes in sync with any future edits
// to the design source.

export type Language = "en" | "es";

export interface QuizQuestion {
  text: string;
  options: string[];
  correct: number;
}

export const QUESTIONS: QuizQuestion[] = [
  { text: "What is the primary goal of de-escalation?", options: ["To win the argument", "To reduce intensity of conflict and restore safety and calm without physical intervention", "To remove the patient from care", "To document the incident only"], correct: 1 },
  { text: "Which of the following is NOT a reason de-escalation matters?", options: ["Protects the safety of patients, staff, and visitors", "Preserves the dignity of distressed individuals", "Increases billing efficiency", "Supports therapeutic relationships"], correct: 2 },
  { text: "Cultural humility means:", options: ["Knowing every culture in depth", "Recognizing your own blind spots and staying open, curious, and respectful", "Avoiding cultural topics altogether", "Treating every patient identically regardless of context"], correct: 1 },
  { text: "Why might a patient escalate even when a staff member has done nothing wrong personally?", options: ["They are naturally difficult", "Prior systemic disrespect (e.g. racism, medical gaslighting) may heighten their sensitivity", "They dislike healthcare workers", "It happens at random"], correct: 1 },
  { text: "Which is a common trigger for escalation in healthcare settings?", options: ["Long wait times", "Billing or insurance issues", "Perceived lack of control", "All of the above"], correct: 3 },
  { text: "Which is an early warning sign of escalation?", options: ["Raised voice or rapid breathing", "Calm, steady tone", "Smiling", "Sitting quietly"], correct: 0 },
  { text: "An example of unintentional staff escalation is:", options: ["Active listening", "Interrupting or standing too close", "Offering choices", "Using a calm tone"], correct: 1 },
  { text: "When using clear communication during de-escalation, you should:", options: ["Use jargon to sound authoritative", "Speak quickly to resolve things faster", "Use simple, clear language and a calm tone", "Avoid speaking at all"], correct: 2 },
  { text: "Offering choices during a tense interaction helps because it:", options: ["Restores a sense of control to the person", "Confuses the person", "Shows you're in charge", "Slows down care unnecessarily"], correct: 0 },
  { text: "If a situation escalates beyond what verbal de-escalation can manage, you should:", options: ["Continue engaging alone indefinitely", "Disengage and follow internal safety protocols", "Raise your voice to match theirs", "Ignore it"], correct: 1 },
];

export const QUESTIONS_ES: QuizQuestion[] = [
  { text: "¿Cuál es el objetivo principal de la desescalada?", options: ["Ganar la discusión", "Reducir la intensidad del conflicto y restablecer la seguridad y la calma sin necesidad de intervención física", "Retirar al paciente de la atención", "Documentar el incidente únicamente"], correct: 1 },
  { text: "¿Cuál de las siguientes NO es una razón por la que la desescalada es importante?", options: ["Protege la seguridad de pacientes, personal y visitantes", "Preserva la dignidad de las personas angustiadas", "Aumenta la eficiencia de facturación", "Apoya las relaciones terapéuticas"], correct: 2 },
  { text: "La humildad cultural significa:", options: ["Conocer a fondo cada cultura", "Reconocer sus propios puntos ciegos y mantenerse abierto, curioso y respetuoso", "Evitar por completo los temas culturales", "Tratar a cada paciente de manera idéntica sin importar el contexto"], correct: 1 },
  { text: "¿Por qué podría un paciente escalar aunque un miembro del personal no haya hecho nada malo personalmente?", options: ["Son naturalmente difíciles", "Experiencias previas de falta de respeto sistémico (por ejemplo, racismo, invalidación médica) pueden aumentar su sensibilidad", "No les agradan los trabajadores de la salud", "Sucede al azar"], correct: 1 },
  { text: "¿Cuál es un desencadenante común de escalada en entornos de salud?", options: ["Tiempos de espera largos", "Problemas de facturación o seguro", "Percepción de falta de control", "Todas las anteriores"], correct: 3 },
  { text: "¿Cuál es una señal temprana de advertencia de escalada?", options: ["Voz elevada o respiración acelerada", "Tono calmado y constante", "Sonreír", "Sentarse en silencio"], correct: 0 },
  { text: "Un ejemplo de escalada involuntaria por parte del personal es:", options: ["Escucha activa", "Interrumpir o pararse demasiado cerca", "Ofrecer opciones", "Usar un tono calmado"], correct: 1 },
  { text: "Al usar comunicación clara durante la desescalada, debe:", options: ["Usar jerga para sonar autoritario", "Hablar rápido para resolver las cosas más rápido", "Usar un lenguaje simple y claro con un tono calmado", "Evitar hablar por completo"], correct: 2 },
  { text: "Ofrecer opciones durante una interacción tensa ayuda porque:", options: ["Restablece un sentido de control en la persona", "Confunde a la persona", "Demuestra que usted está a cargo", "Retrasa la atención innecesariamente"], correct: 0 },
  { text: "Si una situación escala más allá de lo que la desescalada verbal puede manejar, debe:", options: ["Continuar interactuando solo indefinidamente", "Retirarse y seguir los protocolos internos de seguridad", "Elevar la voz para igualar la de ellos", "Ignorarlo"], correct: 1 },
];

export interface ScenarioOption {
  text: string;
  correct: boolean;
  feedback: string;
}
export interface Scenario {
  narrative: string;
  prompt: string;
  options: ScenarioOption[];
}

export const SCENARIO_BANK: Record<string, Scenario> = {
  bias1: {
    narrative: "A new patient is checked in for their first visit with you. Before you've said more than a greeting, they're short and defensive, arms crossed, answering questions with as few words as possible. Nothing has happened yet in this interaction to explain the guardedness.",
    prompt: "A patient becomes defensive and short with you almost immediately, even though this is your first interaction with them. What's the most helpful assumption to start with?",
    options: [
      { text: "They're just a rude person.", correct: false, feedback: "This shuts down curiosity and ignores that their reaction may come from something bigger than this moment." },
      { text: "Their reaction might be shaped by past experiences with the healthcare system, not by anything I've done.", correct: true, feedback: "Right, recognizing systemic influence helps you respond with empathy instead of taking it personally." },
      { text: "I should match their tone so they know I mean business.", correct: false, feedback: "Matching a defensive tone usually escalates things further." },
    ],
  },
  cultural1: {
    narrative: "You're asking a patient routine intake questions. They avoid eye contact throughout and answer each question in short, flat sentences with little inflection. After a few exchanges like this, you start to wonder if they're being difficult on purpose.",
    prompt: "A neurodivergent patient avoids eye contact and answers in short, flat sentences. You start to feel like they're being difficult. What's the better read?",
    options: [
      { text: "Assume they're being rude and disengage from the conversation.", correct: false, feedback: "This misreads a communication style as defiance and can shut down trust." },
      { text: "Recognize this may simply be how they communicate, and adjust your approach with patience and cultural humility.", correct: true, feedback: "Right, cultural humility means not assuming your read on someone's behavior is the only valid one." },
      { text: "Raise your voice slightly to make sure they're paying attention.", correct: false, feedback: "Raising your tone can feel confrontational and increase distress." },
    ],
  },
  triggers1: {
    narrative: "A patient has been in the waiting room for two hours. They're now on their feet, pacing near the front desk, arms crossed, and their voice has started to carry across the room as they ask, again, how much longer it will be.",
    prompt: "A patient in the waiting room is raising their voice about a two-hour wait, arms crossed, pacing. What do you do first?",
    options: [
      { text: "Tell them to calm down or that they need to leave.", correct: false, feedback: "This can feel dismissive and often increases agitation instead of reducing it." },
      { text: "Acknowledge their frustration, apologize for the wait, and offer a choice, an updated estimate or a callback.", correct: true, feedback: "Right, this shows empathy, respects their dignity, and restores a sense of control." },
      { text: "Avoid eye contact and keep working until they stop.", correct: false, feedback: "Ignoring the person tends to escalate frustration further." },
    ],
  },
  triggers2: {
    narrative: "It's the last appointment of the day. A patient steps up to the front desk expecting a routine copay, but the receptionist explains their insurance didn't cover a procedure, leaving a much larger balance. The patient's voice rises immediately: \"Nobody told me this would cost extra. This is ridiculous.\" Two other patients in the waiting room look over.",
    prompt: "A patient becomes visibly frustrated after learning about a surprise cost their insurance didn't cover, and raises their voice at the front desk. What's the better response?",
    options: [
      { text: "Explain the billing policy word-for-word and ask them to lower their voice.", correct: false, feedback: "Leading with policy before empathy can feel cold and increase defensiveness." },
      { text: "Acknowledge their frustration, briefly explain what happened, and calmly walk through their options.", correct: true, feedback: "Right, naming the emotion first, then offering a solutions-focused path, reduces defensiveness." },
      { text: "Tell them billing issues aren't something you handle and to call the number on their statement.", correct: false, feedback: "This can feel dismissive, like you're passing them off without support." },
    ],
  },
  warning1: {
    narrative: "A patient has been waiting nearly forty minutes for lab results. When you check in on them, their answers come back short and clipped, and their foot is tapping rapidly against the chair leg. Nothing has been said or done yet that would count as escalation, but something has clearly shifted since they first sat down.",
    prompt: "A patient starts giving short, clipped answers and taps their foot rapidly while waiting for labs. What should this tell you?",
    options: [
      { text: "Nothing, some people just fidget.", correct: false, feedback: "These are early warning signs worth responding to before they build further." },
      { text: "These are early signs of rising frustration, it's a good time to check in.", correct: true, feedback: "Right, catching early warning signs lets you intervene before a situation intensifies." },
      { text: "They're probably being dramatic.", correct: false, feedback: "Labeling the behavior instead of noticing the signal can make it harder to respond with empathy." },
    ],
  },
  unintentional1: {
    narrative: "You're running twenty minutes behind and still have a full afternoon ahead. A patient asks, for the third time this visit, when their referral will go through. You feel your patience thinning, and you're aware that whatever you say next, and how you say it, will land differently than it would on a slower day.",
    prompt: "You're behind schedule and a patient asks the same question for the third time. What response is least likely to unintentionally escalate them?",
    options: [
      { text: "\"We already went over this.\"", correct: false, feedback: "This can feel dismissive, even if it's technically true." },
      { text: "\"Let me explain that again a different way.\"", correct: true, feedback: "Right, reframing rather than dismissing keeps the door open instead of shutting it." },
      { text: "Sigh and answer quickly while looking at your watch.", correct: false, feedback: "Non-verbal impatience can land as disrespect even if you don't say anything unkind." },
    ],
  },
  calm1: {
    narrative: "A patient who has been growing more upset over the course of the conversation suddenly raises their voice, speaking directly and loudly at you. There's a beat where the room feels tense, and how you respond in the next few seconds will set the tone for what happens next.",
    prompt: "A patient starts raising their voice at you directly. What's the best first move?",
    options: [
      { text: "Raise your voice slightly so you're heard over them.", correct: false, feedback: "Matching their volume usually raises the temperature instead of lowering it." },
      { text: "Take a slow breath, lower your own volume, and keep your posture relaxed.", correct: true, feedback: "Right, your calm can be contagious, and it signals safety rather than confrontation." },
      { text: "Step back and stay completely silent with no reaction.", correct: false, feedback: "Total silence with no engagement can feel dismissive rather than calming." },
    ],
  },
  empathy1: {
    narrative: "A patient sighs heavily as you sit down and says, \"Nobody here listens to me,\" before you've even asked a question. It's the kind of comment that could easily be brushed off as an exaggeration, but the frustration behind it sounds real.",
    prompt: "A frustrated patient says, \"Nobody here listens to me.\" What's the best response?",
    options: [
      { text: "\"That's not true, we're listening right now.\"", correct: false, feedback: "Correcting their feeling first tends to increase defensiveness." },
      { text: "\"I can see this is frustrating, tell me what's been happening.\"", correct: true, feedback: "Right, acknowledging the feeling before addressing the facts opens the door to collaboration." },
      { text: "\"Let's not get into that, let's focus on today's visit.\"", correct: false, feedback: "Deflecting the emotion can feel like being dismissed again." },
    ],
  },
  comm1: {
    narrative: "You walk in with a short mental checklist: move the patient to another room, take their vitals, and get a form signed before the next appointment. The patient is already a little anxious about being at the clinic, and you can tell that too much at once will overwhelm them.",
    prompt: "You need a patient to change rooms, get vitals taken, and sign a form. How should you communicate this?",
    options: [
      { text: "List all three steps at once so they know the full plan.", correct: false, feedback: "Multiple instructions at once can overwhelm someone who's already stressed." },
      { text: "\"Let's start by moving to this room.\" One step at a time.", correct: true, feedback: "Right, one clear instruction at a time reduces overwhelm and builds a sense of control." },
      { text: "Use the clinical terms so they understand the process fully.", correct: false, feedback: "Jargon can make people feel confused or excluded rather than informed." },
    ],
  },
  space1: {
    narrative: "You're in a small exam room with a patient who's clearly upset about a diagnosis. The room only has one door, and there's a rolling stool, a cart, and a chair between you and it. Before you say anything else, you take stock of where everyone is standing.",
    prompt: "You're speaking with an upset patient in a small exam room. What's the safest setup?",
    options: [
      { text: "Stand directly in front of the door so they can't leave mid-conversation.", correct: false, feedback: "Blocking the exit can make someone feel trapped, which raises anxiety and risk." },
      { text: "Position yourself with a clear path to the door for both of you, at a comfortable distance.", correct: true, feedback: "Right, visible, accessible exits help everyone feel safer, which lowers the chance of escalation." },
      { text: "Stand very close so they have to focus on you.", correct: false, feedback: "Closing the distance uninvited can feel confrontational." },
    ],
  },
  choices1: {
    narrative: "A patient stands with their arms crossed, refusing to sit on the exam table. It's not clear if it's discomfort, distrust, or something else, but repeating the same instruction hasn't worked, and pressing harder feels like it would only make things worse.",
    prompt: "A patient refuses to sit down for an exam. What's a better approach than insisting?",
    options: [
      { text: "\"You have to sit down, that's the process.\"", correct: false, feedback: "A flat command can feel like a loss of control, which can increase resistance." },
      { text: "\"Would you like to sit here, or would the chair by the window be more comfortable?\"", correct: true, feedback: "Right, offering a real choice restores a sense of control while still moving things forward." },
      { text: "Skip the exam entirely to avoid conflict.", correct: false, feedback: "Avoiding the task altogether isn't necessary, reframing the request as a choice is usually enough." },
    ],
  },
  nonverbal1: {
    narrative: "You're listening to a patient describe a stressful week, and partway through you notice your own arms have crossed over your chest. You didn't mean anything by it, you're just tired, but you catch yourself wondering how it looks from where they're sitting.",
    prompt: "While listening to a distressed patient, you notice you're crossing your arms. What should you do?",
    options: [
      { text: "Keep going, it doesn't matter as long as your words are calm.", correct: false, feedback: "Body language often communicates louder than words, especially to someone already on edge." },
      { text: "Consciously uncross your arms and keep your hands visible.", correct: true, feedback: "Right, an open posture signals safety and helps de-escalate, even without saying a word." },
      { text: "Cross your arms tighter to seem authoritative.", correct: false, feedback: "This can read as defensive or intimidating rather than in control." },
    ],
  },
  safety1: {
    narrative: "A conversation that started as a raised voice has changed quickly. The patient slams their hand on the counter and takes a step toward you, closing the distance that was there a moment ago. Your training up to this point has been about calm words and open posture, but the situation has moved past what those alone can resolve.",
    prompt: "A patient's behavior moves from raised voice to slamming a hand on the counter and stepping closer to you. What's the appropriate next step?",
    options: [
      { text: "Continue trying to reason with them one-on-one no matter what.", correct: false, feedback: "Once behavior becomes physically threatening, continuing alone increases risk." },
      { text: "Calmly disengage, create distance, and follow your facility's safety protocol.", correct: true, feedback: "Right, disengaging is a safety decision, not a failure. Follow your team's protocol from here." },
      { text: "Match their energy to show you won't back down.", correct: false, feedback: "Escalating in response raises risk for everyone in the room." },
    ],
  },
  safety2: {
    narrative: "An elderly patient has grown increasingly agitated over a mix-up with their appointment time. As you approach to help, you notice they've raised their cane slightly, not necessarily to strike, but enough that the intent is unclear.",
    prompt: "While helping an agitated patient, you notice they're holding a cane raised like they might swing it. What's the best course of action?",
    options: [
      { text: "Leave the area calmly and immediately alert a coworker or security.", correct: true, feedback: "Right, disengaging and getting support is safest for everyone; don't try to manage a weapon alone." },
      { text: "Grab the cane from them before they can use it.", correct: false, feedback: "Trying to confiscate an object in the moment can provoke a struggle and increase risk of injury." },
      { text: "Keep talking as if you haven't noticed, hoping they'll set it down.", correct: false, feedback: "Ignoring a visible risk delays the team response you need." },
    ],
  },
};

export const SCENARIO_BANK_ES: Record<string, Scenario> = {
  bias1: {
    narrative: "Un nuevo paciente llega a su primera cita con usted. Antes de que haya dicho más que un saludo, el paciente se muestra cortante y a la defensiva, con los brazos cruzados, respondiendo con la menor cantidad de palabras posible. Nada ha ocurrido todavía en esta interacción que explique esa actitud reservada.",
    prompt: "Un paciente se pone a la defensiva y responde de forma cortante casi de inmediato, aunque esta es su primera interacción con él. ¿Cuál es la suposición más útil con la que empezar?",
    options: [
      { text: "Simplemente es una persona grosera.", correct: false, feedback: "Esto cierra la curiosidad e ignora que su reacción puede provenir de algo más grande que este momento." },
      { text: "Su reacción podría estar moldeada por experiencias pasadas con el sistema de salud, no por algo que yo haya hecho.", correct: true, feedback: "Correcto, reconocer la influencia sistémica le ayuda a responder con empatía en lugar de tomarlo como algo personal." },
      { text: "Debería igualar su tono para que sepan que hablo en serio.", correct: false, feedback: "Igualar un tono defensivo generalmente escala aún más la situación." },
    ],
  },
  cultural1: {
    narrative: "Usted le hace a un paciente las preguntas de admisión de rutina. El paciente evita el contacto visual durante toda la conversación y responde cada pregunta con frases cortas y planas, con poca entonación. Después de varios intercambios así, usted empieza a preguntarse si lo está haciendo a propósito.",
    prompt: "Un paciente neurodivergente evita el contacto visual y responde con frases cortas y planas. Usted empieza a sentir que está siendo difícil. ¿Cuál es la mejor interpretación?",
    options: [
      { text: "Suponer que está siendo grosero y desconectarse de la conversación.", correct: false, feedback: "Esto malinterpreta un estilo de comunicación como desafío y puede cerrar la confianza." },
      { text: "Reconocer que esta puede ser simplemente su forma de comunicarse, y ajustar su enfoque con paciencia y humildad cultural.", correct: true, feedback: "Correcto, la humildad cultural significa no asumir que su interpretación del comportamiento de alguien es la única válida." },
      { text: "Elevar un poco la voz para asegurarse de que está prestando atención.", correct: false, feedback: "Elevar el tono puede sentirse confrontacional y aumentar la angustia." },
    ],
  },
  triggers1: {
    narrative: "Un paciente ha estado en la sala de espera durante dos horas. Ahora está de pie, caminando de un lado a otro cerca de la recepción, con los brazos cruzados, y su voz ha comenzado a escucharse por toda la sala mientras pregunta, otra vez, cuánto más tendrá que esperar.",
    prompt: "Un paciente en la sala de espera está elevando la voz por una espera de dos horas, con los brazos cruzados, caminando de un lado a otro. ¿Qué hace primero?",
    options: [
      { text: "Decirle que se calme o que debe irse.", correct: false, feedback: "Esto puede sentirse desdeñoso y a menudo aumenta la agitación en lugar de reducirla." },
      { text: "Reconocer su frustración, disculparse por la espera, y ofrecer una opción: un cálculo de tiempo actualizado o una devolución de llamada.", correct: true, feedback: "Correcto, esto muestra empatía, respeta su dignidad y restablece un sentido de control." },
      { text: "Evitar el contacto visual y seguir trabajando hasta que se detenga.", correct: false, feedback: "Ignorar a la persona tiende a aumentar aún más la frustración." },
    ],
  },
  triggers2: {
    narrative: "Es la última cita del día. Un paciente se acerca a la recepción esperando pagar un copago de rutina, pero la recepcionista le explica que su seguro no cubrió un procedimiento, dejando un saldo mucho mayor. La voz del paciente se eleva de inmediato: \"Nadie me dijo que esto costaría extra. Esto es ridículo.\" Otros dos pacientes en la sala de espera voltean a mirar.",
    prompt: "Un paciente se muestra visiblemente frustrado al enterarse de un costo sorpresa que su seguro no cubrió, y eleva la voz en la recepción. ¿Cuál es la mejor respuesta?",
    options: [
      { text: "Explicar la política de facturación palabra por palabra y pedirle que baje la voz.", correct: false, feedback: "Comenzar con la política antes que con la empatía puede sentirse frío y aumentar la actitud defensiva." },
      { text: "Reconocer su frustración, explicar brevemente lo que sucedió y repasar con calma sus opciones.", correct: true, feedback: "Correcto, nombrar primero la emoción y luego ofrecer un camino centrado en soluciones reduce la actitud defensiva." },
      { text: "Decirle que los problemas de facturación no son algo que usted maneje y que llame al número en su estado de cuenta.", correct: false, feedback: "Esto puede sentirse desdeñoso, como si lo estuviera derivando sin apoyo." },
    ],
  },
  warning1: {
    narrative: "Un paciente ha esperado casi cuarenta minutos por los resultados de laboratorio. Cuando usted se acerca a ver cómo está, sus respuestas son cortas y secas, y su pie golpetea rápidamente contra la pata de la silla. Aún no se ha dicho ni hecho nada que cuente como escalada, pero algo claramente ha cambiado desde que se sentó.",
    prompt: "Un paciente comienza a dar respuestas cortas y secas y golpetea el pie rápidamente mientras espera los laboratorios. ¿Qué debería indicarle esto?",
    options: [
      { text: "Nada, algunas personas simplemente se mueven inquietas.", correct: false, feedback: "Estas son señales tempranas de advertencia que vale la pena atender antes de que aumenten más." },
      { text: "Estas son señales tempranas de frustración creciente; es un buen momento para acercarse.", correct: true, feedback: "Correcto, detectar señales tempranas de advertencia le permite intervenir antes de que una situación se intensifique." },
      { text: "Probablemente esté siendo dramático.", correct: false, feedback: "Etiquetar el comportamiento en lugar de notar la señal puede dificultar responder con empatía." },
    ],
  },
  unintentional1: {
    narrative: "Usted lleva veinte minutos de retraso y todavía tiene una tarde completa por delante. Un paciente pregunta, por tercera vez en esta visita, cuándo se procesará su referido. Siente que su paciencia se agota, y es consciente de que lo que diga a continuación, y cómo lo diga, se percibirá diferente de lo que sería en un día más tranquilo.",
    prompt: "Usted va retrasado y un paciente hace la misma pregunta por tercera vez. ¿Qué respuesta es menos probable que lo escale sin querer?",
    options: [
      { text: "\"Ya hablamos de esto.\"", correct: false, feedback: "Esto puede sentirse desdeñoso, aunque técnicamente sea cierto." },
      { text: "\"Déjeme explicarle eso de nuevo de otra manera.\"", correct: true, feedback: "Correcto, reformular en lugar de descartar mantiene la puerta abierta en lugar de cerrarla." },
      { text: "Suspirar y responder rápido mientras mira su reloj.", correct: false, feedback: "La impaciencia no verbal puede percibirse como falta de respeto, aunque no diga nada desagradable." },
    ],
  },
  calm1: {
    narrative: "Un paciente que ha ido molestándose cada vez más a lo largo de la conversación de repente eleva la voz, hablando directamente y con fuerza hacia usted. Hay un instante en que la sala se siente tensa, y cómo responda en los próximos segundos marcará el tono de lo que sigue.",
    prompt: "Un paciente comienza a elevar la voz directamente hacia usted. ¿Cuál es la mejor primera acción?",
    options: [
      { text: "Elevar un poco la voz para que lo escuchen por encima de ellos.", correct: false, feedback: "Igualar su volumen generalmente sube la temperatura en lugar de bajarla." },
      { text: "Respirar lentamente, bajar su propio volumen y mantener una postura relajada.", correct: true, feedback: "Correcto, su calma puede ser contagiosa y transmite seguridad en lugar de confrontación." },
      { text: "Retroceder y permanecer completamente en silencio sin ninguna reacción.", correct: false, feedback: "El silencio total sin interacción puede sentirse desdeñoso en lugar de calmante." },
    ],
  },
  empathy1: {
    narrative: "Un paciente suspira profundamente al sentarse y dice: \"Aquí nadie me escucha\", antes de que usted haya hecho siquiera una pregunta. Es el tipo de comentario que fácilmente podría descartarse como una exageración, pero la frustración detrás de él suena real.",
    prompt: "Un paciente frustrado dice: \"Aquí nadie me escucha.\" ¿Cuál es la mejor respuesta?",
    options: [
      { text: "\"Eso no es cierto, lo estamos escuchando ahora mismo.\"", correct: false, feedback: "Corregir primero su sentimiento tiende a aumentar la actitud defensiva." },
      { text: "\"Veo que esto es frustrante, cuénteme qué ha estado pasando.\"", correct: true, feedback: "Correcto, reconocer el sentimiento antes de abordar los hechos abre la puerta a la colaboración." },
      { text: "\"No entremos en eso, enfoquémonos en la visita de hoy.\"", correct: false, feedback: "Desviar la emoción puede sentirse como ser ignorado de nuevo." },
    ],
  },
  comm1: {
    narrative: "Usted entra con una breve lista mental: mover al paciente a otra sala, tomar sus signos vitales y conseguir que firme un formulario antes de la siguiente cita. El paciente ya está un poco ansioso por estar en la clínica, y usted percibe que demasiadas cosas a la vez lo abrumarían.",
    prompt: "Necesita que un paciente cambie de sala, se le tomen los signos vitales y firme un formulario. ¿Cómo debería comunicar esto?",
    options: [
      { text: "Enumerar los tres pasos de una vez para que conozca el plan completo.", correct: false, feedback: "Varias instrucciones a la vez pueden abrumar a alguien que ya está estresado." },
      { text: "\"Comencemos moviéndonos a esta sala.\" Un paso a la vez.", correct: true, feedback: "Correcto, una instrucción clara a la vez reduce el agobio y genera un sentido de control." },
      { text: "Usar los términos clínicos para que entienda completamente el proceso.", correct: false, feedback: "La jerga puede hacer que las personas se sientan confundidas o excluidas en lugar de informadas." },
    ],
  },
  space1: {
    narrative: "Está en una sala de exámenes pequeña con un paciente claramente molesto por un diagnóstico. La sala solo tiene una puerta, y hay un taburete con ruedas, un carrito y una silla entre usted y la salida. Antes de decir algo más, evalúa dónde está parado cada uno.",
    prompt: "Está hablando con un paciente molesto en una sala de exámenes pequeña. ¿Cuál es la configuración más segura?",
    options: [
      { text: "Pararse justo frente a la puerta para que no pueda salir a mitad de la conversación.", correct: false, feedback: "Bloquear la salida puede hacer que alguien se sienta atrapado, lo que aumenta la ansiedad y el riesgo." },
      { text: "Colocarse de manera que ambos tengan un camino despejado hacia la puerta, a una distancia cómoda.", correct: true, feedback: "Correcto, las salidas visibles y accesibles ayudan a que todos se sientan más seguros, lo que reduce la probabilidad de escalada." },
      { text: "Pararse muy cerca para que tenga que concentrarse en usted.", correct: false, feedback: "Reducir la distancia sin ser invitado puede sentirse confrontacional." },
    ],
  },
  choices1: {
    narrative: "Un paciente permanece de pie con los brazos cruzados, negándose a sentarse en la camilla. No está claro si es incomodidad, desconfianza u otra cosa, pero repetir la misma instrucción no ha funcionado, y presionar más parece que solo empeoraría las cosas.",
    prompt: "Un paciente se niega a sentarse para un examen. ¿Cuál es un mejor enfoque que insistir?",
    options: [
      { text: "\"Tiene que sentarse, así es el proceso.\"", correct: false, feedback: "Una orden directa puede sentirse como una pérdida de control, lo que puede aumentar la resistencia." },
      { text: "\"¿Le gustaría sentarse aquí, o estaría más cómodo en la silla junto a la ventana?\"", correct: true, feedback: "Correcto, ofrecer una opción real restablece un sentido de control mientras las cosas siguen avanzando." },
      { text: "Omitir el examen por completo para evitar el conflicto.", correct: false, feedback: "No es necesario evitar la tarea por completo; generalmente basta con replantear la solicitud como una opción." },
    ],
  },
  nonverbal1: {
    narrative: "Está escuchando a un paciente describir una semana estresante, y a mitad de la conversación nota que ha cruzado los brazos sobre el pecho. No lo hizo con mala intención, simplemente está cansado, pero se pregunta cómo se ve desde donde está sentado el paciente.",
    prompt: "Mientras escucha a un paciente angustiado, nota que tiene los brazos cruzados. ¿Qué debería hacer?",
    options: [
      { text: "Continuar, no importa mientras sus palabras sean calmadas.", correct: false, feedback: "El lenguaje corporal a menudo comunica más fuerte que las palabras, especialmente a alguien que ya está alterado." },
      { text: "Descruzar conscientemente los brazos y mantener las manos visibles.", correct: true, feedback: "Correcto, una postura abierta transmite seguridad y ayuda a desescalar, incluso sin decir una palabra." },
      { text: "Cruzar los brazos con más fuerza para parecer autoritario.", correct: false, feedback: "Esto puede interpretarse como defensivo o intimidante en lugar de tener el control." },
    ],
  },
  safety1: {
    narrative: "Una conversación que comenzó como una voz elevada ha cambiado rápidamente. El paciente golpea el mostrador con la mano y da un paso hacia usted, cerrando la distancia que había un momento antes. Su formación hasta ahora se ha centrado en palabras calmadas y una postura abierta, pero la situación ha superado lo que eso solo puede resolver.",
    prompt: "El comportamiento de un paciente pasa de voz elevada a golpear el mostrador con la mano y acercarse a usted. ¿Cuál es el siguiente paso apropiado?",
    options: [
      { text: "Seguir tratando de razonar con él a solas sin importar qué.", correct: false, feedback: "Una vez que el comportamiento se vuelve físicamente amenazante, continuar solo aumenta el riesgo." },
      { text: "Retirarse con calma, crear distancia y seguir el protocolo de seguridad de su institución.", correct: true, feedback: "Correcto, retirarse es una decisión de seguridad, no un fracaso. Siga el protocolo de su equipo a partir de aquí." },
      { text: "Igualar su energía para demostrar que no va a retroceder.", correct: false, feedback: "Escalar en respuesta aumenta el riesgo para todos en la sala." },
    ],
  },
  safety2: {
    narrative: "Un paciente de edad avanzada se ha ido agitando cada vez más por una confusión con la hora de su cita. Al acercarse para ayudar, usted nota que ha levantado un poco su bastón, no necesariamente para golpear, pero lo suficiente como para que la intención no esté clara.",
    prompt: "Mientras ayuda a un paciente agitado, nota que sostiene un bastón levantado como si fuera a agitarlo. ¿Cuál es la mejor acción a seguir?",
    options: [
      { text: "Retirarse del área con calma y alertar de inmediato a un compañero o a seguridad.", correct: true, feedback: "Correcto, retirarse y buscar apoyo es lo más seguro para todos; no intente manejar un objeto potencialmente peligroso solo." },
      { text: "Quitarle el bastón antes de que pueda usarlo.", correct: false, feedback: "Tratar de confiscar un objeto en el momento puede provocar un forcejeo y aumentar el riesgo de lesiones." },
      { text: "Seguir hablando como si no lo hubiera notado, esperando que lo baje.", correct: false, feedback: "Ignorar un riesgo visible retrasa la respuesta del equipo que necesita." },
    ],
  },
};

export const RELATED_ES: Record<string, string> = {
  "Before We Respond": "Antes de Responder",
  "Cultural Humility": "Humildad Cultural",
  "Common Triggers": "Desencadenantes Comunes",
  "Early Warning Signs": "Señales Tempranas de Advertencia",
  "Unintentional Escalation": "Escalada Involuntaria",
  "Stay Calm & Controlled": "Mantener la Calma y el Control",
  "Show Respect & Empathy": "Mostrar Respeto y Empatía",
  "Simple & Clear Communication": "Comunicación Simple y Clara",
  "Maintain a Safe Space": "Mantener un Espacio Seguro",
  "Offer Choices": "Ofrecer Opciones",
  "Non-Verbal Awareness": "Conciencia No Verbal",
  "Safety & Boundaries": "Seguridad y Límites",
};

export type StepDef =
  | { kind: "content"; idx: number }
  | { kind: "scenario"; id: string; related: string }
  | { kind: "practice"; id: "sayThisNotThat" };

export const STEPS: StepDef[] = [
  { kind: "content", idx: 0 },
  { kind: "content", idx: 1 },
  { kind: "scenario", id: "bias1", related: "Before We Respond" },
  { kind: "content", idx: 2 },
  { kind: "content", idx: 2.1 },
  { kind: "content", idx: 2.2 },
  { kind: "scenario", id: "cultural1", related: "Cultural Humility" },
  { kind: "content", idx: 3 },
  { kind: "content", idx: 4 },
  { kind: "scenario", id: "triggers1", related: "Common Triggers" },
  { kind: "scenario", id: "triggers2", related: "Common Triggers" },
  { kind: "content", idx: 5 },
  { kind: "scenario", id: "warning1", related: "Early Warning Signs" },
  { kind: "content", idx: 6 },
  { kind: "scenario", id: "unintentional1", related: "Unintentional Escalation" },
  { kind: "content", idx: 7 },
  { kind: "scenario", id: "calm1", related: "Stay Calm & Controlled" },
  { kind: "content", idx: 8 },
  { kind: "scenario", id: "empathy1", related: "Show Respect & Empathy" },
  { kind: "content", idx: 9 },
  { kind: "practice", id: "sayThisNotThat" },
  { kind: "scenario", id: "comm1", related: "Simple & Clear Communication" },
  { kind: "content", idx: 10 },
  { kind: "scenario", id: "space1", related: "Maintain a Safe Space" },
  { kind: "content", idx: 11 },
  { kind: "scenario", id: "choices1", related: "Offer Choices" },
  { kind: "content", idx: 12 },
  { kind: "scenario", id: "nonverbal1", related: "Non-Verbal Awareness" },
  { kind: "content", idx: 13 },
  { kind: "content", idx: 13.1 },
  { kind: "scenario", id: "safety1", related: "Safety & Boundaries" },
  { kind: "scenario", id: "safety2", related: "Safety & Boundaries" },
  { kind: "content", idx: 14 },
  { kind: "content", idx: 15 },
  { kind: "content", idx: 16 },
  { kind: "content", idx: 17 },
];

export const CONTENT_STEP_COUNT = STEPS.filter((s) => s.kind === "content").length; // 21
export const PASSING_SCORE = 80;

export interface GameStatement {
  id: string;
  text: string;
  category: "say" | "notSay";
}
export interface GameCategory {
  id: "say" | "notSay";
  varColor: string;
  bg: string;
}

export const SAY_THIS_NOT_THAT_GAME: { categories: GameCategory[]; statements: GameStatement[] } = {
  categories: [
    { id: "say", varColor: "var(--color-accent-2-700)", bg: "var(--color-accent-2-100)" },
    { id: "notSay", varColor: "var(--color-accent-700)", bg: "var(--color-accent-100)" },
  ],
  statements: [
    { id: "s1", text: "I can see this is really upsetting for you.", category: "say" },
    { id: "s2", text: "You need to calm down right now.", category: "notSay" },
    { id: "s3", text: "Let's figure out how to make this better.", category: "say" },
    { id: "s4", text: "That's not fair, you're overreacting.", category: "notSay" },
    { id: "s5", text: "I'm here to help. What's most important to address first?", category: "say" },
    { id: "s6", text: "Why are you always so difficult?", category: "notSay" },
    { id: "s7", text: "I understand this is frustrating.", category: "say" },
    { id: "s8", text: "Just do what I say and stop complaining.", category: "notSay" },
    { id: "s9", text: "Take your time, I'm not going anywhere.", category: "say" },
    { id: "s10", text: "I don't have time for this right now.", category: "notSay" },
    { id: "s11", text: "Would you like to sit here or over by the window?", category: "say" },
    { id: "s12", text: "You have to sit down, that's the rule.", category: "notSay" },
  ],
};

export const GAME_TEXT_ES: Record<string, string> = {
  s1: "Veo que esto es muy molesto para usted.",
  s2: "Necesita calmarse ahora mismo.",
  s3: "Averigüemos cómo mejorar esto.",
  s4: "Eso no es justo, está exagerando.",
  s5: "Estoy aquí para ayudar. ¿Qué es lo más importante que debemos atender primero?",
  s6: "¿Por qué siempre es tan difícil?",
  s7: "Entiendo que esto es frustrante.",
  s8: "Simplemente haga lo que digo y deje de quejarse.",
  s9: "Tómese su tiempo, no me voy a ninguna parte.",
  s10: "No tengo tiempo para esto ahora.",
  s11: "¿Le gustaría sentarse aquí o junto a la ventana?",
  s12: "Tiene que sentarse, es la regla.",
};

export interface UiStrings {
  langToggle: string; adminToggle: string; backToTraining: string;
  back: string; readMore: string;
  courseTitle: string;
  welcomeIntro1: string;
  welcomeIntro2Prefix: string; welcomeIntro2Suffix: string;
  aboutFacilitator: string; aboutFacilitatorBody: string; aboutFacilitatorRole: string;
  aboutChcr: string; aboutChcrBody: string;
  yourName: string; yourEmail: string;
  beginPretest: string;
  facilitatorKicker: string; facilitatorRoleLine: string; facilitatorBio1: string; facilitatorBio2: string;
  aboutChcrKicker: string; chcrOrgName: string; chcrTagline: string; chcrMission: string;
  neighborhoodKicker: string; neighborhoodBody: string;
  servicesKicker: string;
  svcPrimaryTitle: string; svcPrimaryBody: string;
  svcPediTitle: string; svcPediBody: string;
  svcWomensTitle: string; svcWomensBody: string;
  svcBehavioralTitle: string; svcBehavioralBody: string;
  svcDentalTitle: string; svcDentalBody: string;
  svcNutritionTitle: string; svcNutritionBody: string;
  svcPodiatryTitle: string; svcPodiatryBody: string;
  svcSupportTitle: string; svcSupportBody: string;
  chcrFooter: string;
  referencesKicker: string; referencesTitle: string; referencesIntro: string; academicKicker: string;
  beforeBegin: string; pretestTitle: string; pretestIntro: string;
  questionOf: string; of10: string; submitPretest: string;
  finalCheck: string; posttestTitle: string;
  posttestIntroPrefix: string; posttestIntroSuffix: string;
  submitPosttest: string;
  back_: string; next: string; continueToPosttest: string;
  practiceKicker: string; gameTitle: string; gameInstructions: string; gameInstructionsSuffix: string;
  sayThis: string; notThat: string;
  dragHint: string; dropHere: string; allSorted: string; scoreLabel: string; gameCompleteMsg: string;
  tryIt: string; applyWhatYouLearned: string;
  videoComingSoon: string; videoComingSoonSub: string; scenarioKicker: string;
}

export const UI: Record<Language, UiStrings> = {
  en: {
    langToggle: "Español", adminToggle: "Facilitator Report", backToTraining: "Back to Training",
    back: "← Back", readMore: "Read more →",
    courseTitle: "De-Escalation Training",
    welcomeIntro1: "A self-paced course covering why de-escalation matters, cultural humility, recognizing escalation, core skills, and safety & boundaries. Facilitated by Stavros E. Delardas, LCSW, PMH-C, CLC, Manager, Maternal & Child Health Operations.",
    welcomeIntro2Prefix: "You'll take a short pre-test, work through the lesson, with \"Try It\" scenarios along the way, then a post-test. A passing score of ",
    welcomeIntro2Suffix: "% or higher on the post-test completes the course.",
    aboutFacilitator: "About the Facilitator", aboutFacilitatorBody: "Stavros E. Delardas, LCSW, PMH-C, CLC",
    aboutFacilitatorRole: "Manager, Maternal & Child Health Operations.",
    aboutChcr: "About CHCR", aboutChcrBody: "Our mission is to sustain a vibrant, healthy, and strong community through affordable, culturally competent, quality primary health care.",
    yourName: "Your name", yourEmail: "Your email",
    beginPretest: "Begin Pre-Test",
    facilitatorKicker: "About the Facilitator",
    facilitatorRoleLine: "LCSW, PMH-C, CLC · Manager, Maternal & Child Health Operations",
    facilitatorBio1: "Stavros Efstratios Delardas is a Licensed Clinical Social Worker who has been with the Community Health Center of Richmond since 2014. As Manager of Maternal & Child Health Operations, he oversees the Perinatal & Infant Community Health Collaborative (PICHC) and CHCR's Behavioral Health department, and serves as Chairman of the Workplace Safety & Infection Control Committee.",
    facilitatorBio2: "He earned his Master of Social Work from Sacred Heart University and his B.S. in Human Services from Empire State College, holds LCSW licensure in New York & New Jersey, is a trained Birth Doula, and maintains certifications in Perinatal Mental Health & Lactation Counseling.",
    aboutChcrKicker: "About CHCR", chcrOrgName: "Community Health Center of Richmond", chcrTagline: "Changing lives, daily.",
    chcrMission: "Our mission is to sustain a vibrant, healthy, and strong community through affordable, culturally competent, quality primary health care. We aim to eliminate health disparities for underserved populations through accessibility, and empower people to take control of their physical and mental wellbeing through health education, prevention services, and wellness programs.",
    neighborhoodKicker: "In your neighborhood",
    neighborhoodBody: "Four locations across Staten Island, and more coming soon, providing primary and behavioral healthcare, dental, podiatry, and nutrition services, plus care for moms-to-be, nursing moms, infants, and young children.",
    servicesKicker: "Services offered",
    svcPrimaryTitle: "Primary Care", svcPrimaryBody: "Everyday health care for the whole family, from checkups to ongoing conditions.",
    svcPediTitle: "Pediatrics", svcPediBody: "Care for infants, children, and teens as they grow.",
    svcWomensTitle: "Women's Health", svcWomensBody: "Care for women at every stage of life, including pregnancy.",
    svcBehavioralTitle: "Behavioral Health", svcBehavioralBody: "Support for mental health and emotional wellbeing.",
    svcDentalTitle: "Dentistry", svcDentalBody: "Oral health care for patients of all ages.",
    svcNutritionTitle: "Nutrition", svcNutritionBody: "Guidance for eating well and managing diet-related conditions.",
    svcPodiatryTitle: "Podiatry", svcPodiatryBody: "Care for foot and ankle health.",
    svcSupportTitle: "Supportive Programming", svcSupportBody: "Maternal and child health programs, insurance navigation, clinical case management.",
    chcrFooter: "CHCR is a Health Center Program Grantee under 42 U.S.C. 254B and a deemed Public Health Service Employee under 42 U.S.C. 233(g)-(n). Learn more at",
    referencesKicker: "Sources", referencesTitle: "References",
    referencesIntro: "Materials and organizations this training drew on, in addition to Stavros's own clinical experience.",
    academicKicker: "Academic & Clinical Sources",
    beforeBegin: "Before you begin", pretestTitle: "Pre-Test",
    pretestIntro: "Answer these 10 questions based on what you already know. There's no penalty, this just gives a baseline to compare against your post-test.",
    questionOf: "Question", of10: "of 10", submitPretest: "Submit Pre-Test & Start Lesson",
    finalCheck: "Final check", posttestTitle: "Post-Test",
    posttestIntroPrefix: "Same 10 questions. A score of ", posttestIntroSuffix: "% or higher completes the course.",
    submitPosttest: "Submit Post-Test",
    back_: "Back", next: "Next", continueToPosttest: "Continue to Post-Test",
    practiceKicker: "Practice · Say This, Not That",
    gameTitle: "Which response helps de-escalate?",
    gameInstructions: "Drag each statement into the correct category.",
    gameInstructionsSuffix: "into \"Say This\" or \"Not That.\"",
    sayThis: "Say This", notThat: "Not That",
    dragHint: "Drag a statement into a category above:",
    dropHere: "Drop statements here",
    allSorted: "All statements sorted, check your results below.",
    scoreLabel: "Score:",
    gameCompleteMsg: "Great job! You've sorted all the statements. Ready to continue?",
    tryIt: "Try It", applyWhatYouLearned: "Apply What You've Learned",
    videoComingSoon: "Video coming soon", videoComingSoonSub: "Dana & Sam scenario clip, drop in once generated",
    scenarioKicker: "Scenario",
  },
  es: {
    langToggle: "English", adminToggle: "Informe del Facilitador", backToTraining: "Volver a la Capacitación",
    back: "← Atrás", readMore: "Leer más →",
    courseTitle: "Capacitación en Desescalada",
    welcomeIntro1: "Un curso de ritmo propio que cubre por qué es importante la desescalada, la humildad cultural, cómo reconocer la escalada, habilidades clave y seguridad y límites. Facilitado por Stavros E. Delardas, LCSW, PMH-C, CLC, Gerente de Operaciones de Salud Materna e Infantil.",
    welcomeIntro2Prefix: "Tomará una breve prueba inicial, trabajará en la lección (con escenarios de \"Practícalo\" a lo largo del camino) y luego una prueba final. Un puntaje de aprobación del ",
    welcomeIntro2Suffix: "% o más en la prueba final completa el curso.",
    aboutFacilitator: "Sobre el Facilitador", aboutFacilitatorBody: "Stavros E. Delardas, LCSW, PMH-C, CLC",
    aboutFacilitatorRole: "Gerente de Operaciones de Salud Materna e Infantil.",
    aboutChcr: "Sobre CHCR", aboutChcrBody: "Nuestra misión es sostener una comunidad vibrante, saludable y fuerte mediante atención primaria de salud accesible, culturalmente competente y de calidad.",
    yourName: "Su nombre", yourEmail: "Su correo electrónico",
    beginPretest: "Comenzar Prueba Inicial",
    facilitatorKicker: "Sobre el Facilitador",
    facilitatorRoleLine: "LCSW, PMH-C, CLC · Gerente de Operaciones de Salud Materna e Infantil",
    facilitatorBio1: "Stavros Efstratios Delardas es un Trabajador Social Clínico con Licencia que forma parte del Community Health Center of Richmond desde 2014. Como Gerente de Operaciones de Salud Materna e Infantil, supervisa la Colaborativa Perinatal e Infantil de Salud Comunitaria (PICHC) y el departamento de Salud Conductual de CHCR, y se desempeña como Presidente del Comité de Seguridad Laboral y Control de Infecciones.",
    facilitatorBio2: "Obtuvo su Maestría en Trabajo Social de Sacred Heart University y su licenciatura en Servicios Humanos de Empire State College, posee licencia de LCSW en Nueva York y Nueva Jersey, es doula de parto certificada, y mantiene certificaciones en Salud Mental Perinatal y Asesoría en Lactancia.",
    aboutChcrKicker: "Sobre CHCR", chcrOrgName: "Community Health Center of Richmond", chcrTagline: "Cambiando vidas, cada día.",
    chcrMission: "Nuestra misión es sostener una comunidad vibrante, saludable y fuerte mediante atención primaria de salud accesible, culturalmente competente y de calidad. Buscamos eliminar las disparidades de salud para poblaciones desatendidas mediante la accesibilidad, y empoderar a las personas para que tomen el control de su bienestar físico y mental a través de educación en salud, servicios de prevención y programas de bienestar.",
    neighborhoodKicker: "En su vecindario",
    neighborhoodBody: "Cuatro sedes en Staten Island, y más próximamente, que ofrecen atención primaria y conductual, servicios dentales, de podología y nutrición, además de atención para futuras madres, madres lactantes, bebés y niños pequeños.",
    servicesKicker: "Servicios ofrecidos",
    svcPrimaryTitle: "Atención Primaria", svcPrimaryBody: "Atención médica cotidiana para toda la familia, desde chequeos hasta condiciones continuas.",
    svcPediTitle: "Pediatría", svcPediBody: "Atención para bebés, niños y adolescentes a medida que crecen.",
    svcWomensTitle: "Salud de la Mujer", svcWomensBody: "Atención para mujeres en cada etapa de la vida, incluido el embarazo.",
    svcBehavioralTitle: "Salud Conductual", svcBehavioralBody: "Apoyo para la salud mental y el bienestar emocional.",
    svcDentalTitle: "Odontología", svcDentalBody: "Atención de salud bucal para pacientes de todas las edades.",
    svcNutritionTitle: "Nutrición", svcNutritionBody: "Orientación para una alimentación saludable y el manejo de condiciones relacionadas con la dieta.",
    svcPodiatryTitle: "Podología", svcPodiatryBody: "Atención para la salud del pie y el tobillo.",
    svcSupportTitle: "Programas de Apoyo", svcSupportBody: "Programas de salud materna e infantil, orientación sobre seguros y manejo clínico de casos.",
    chcrFooter: "CHCR es un Beneficiario del Programa de Centros de Salud bajo 42 U.S.C. 254B y un Empleado del Servicio de Salud Pública designado bajo 42 U.S.C. 233(g)-(n). Más información en",
    referencesKicker: "Fuentes", referencesTitle: "Referencias",
    referencesIntro: "Materiales y organizaciones en los que se basó esta capacitación, además de la propia experiencia clínica de Stavros.",
    academicKicker: "Fuentes Académicas y Clínicas",
    beforeBegin: "Antes de comenzar", pretestTitle: "Prueba Inicial",
    pretestIntro: "Responda estas 10 preguntas según lo que ya sabe. No hay penalización; esto solo establece una base para comparar con su prueba final.",
    questionOf: "Pregunta", of10: "de 10", submitPretest: "Enviar Prueba Inicial y Comenzar la Lección",
    finalCheck: "Verificación final", posttestTitle: "Prueba Final",
    posttestIntroPrefix: "Las mismas 10 preguntas. Un puntaje del ", posttestIntroSuffix: "% o más completa el curso.",
    submitPosttest: "Enviar Prueba Final",
    back_: "Atrás", next: "Siguiente", continueToPosttest: "Continuar a la Prueba Final",
    practiceKicker: "Práctica · Dilo Así, No Así",
    gameTitle: "¿Qué respuesta ayuda a desescalar?",
    gameInstructions: "Arrastre cada frase a la categoría correcta.",
    gameInstructionsSuffix: "en \"Dilo Así\" o \"Así No.\"",
    sayThis: "Dilo Así", notThat: "Así No",
    dragHint: "Arrastre una frase a una categoría arriba:",
    dropHere: "Suelte las frases aquí",
    allSorted: "Todas las frases clasificadas, revise sus resultados abajo.",
    scoreLabel: "Puntaje:",
    gameCompleteMsg: "¡Buen trabajo! Ha clasificado todas las frases. ¿Listo para continuar?",
    tryIt: "Practícalo", applyWhatYouLearned: "Aplique lo que Aprendió",
    videoComingSoon: "Video próximamente", videoComingSoonSub: "Clip del escenario de Dana y Sam, se agregará una vez generado",
    scenarioKicker: "Escenario",
  },
};

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Server-authoritative scoring — never trust a client-submitted score.
 *  Correct answer indices are identical between QUESTIONS and QUESTIONS_ES. */
export function scoreQuiz(answers: Record<number, number>): { correctCount: number; scorePct: number } {
  let correctCount = 0;
  QUESTIONS.forEach((q, qi) => {
    if (answers[qi] === q.correct) correctCount++;
  });
  return { correctCount, scorePct: Math.round((correctCount / QUESTIONS.length) * 100) };
}
