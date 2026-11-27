/**
 * ============================================================================
 * LINGOQUEST v3.0 — QUANTUM EDITION
 * Features:
 *   1. Full CEFR Curriculum (A1, A2, B1, B2, C1, C2)
 *   2. Quantum Anki SRS (SuperMemo SM-2 + Cram Mode + Due Preview)
 *   3. AuraCinema Video Lab (YouTube IFrame API + Subtitles + Sentence Mining + Shadowing)
 *   4. AI Chat Bot Simulator (5 scenarios + grammar correction)
 *   5. Pronunciation Trainer (Web Speech API SpeechRecognition)
 *   6. Lucky Wheel + Daily Login Bonus + Enhanced Shop
 *   7. Animated Stars Background + Futuristic UI
 *   8. Full localStorage persistence
 * ============================================================================
 */

(function () {
  'use strict';

  // Escape dynamic text before inserting it into HTML templates.
  // Keep this helper inside the app scope so every renderer can use it.
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  // ==========================================================================
  // 1. CONSTANTS & DATASETS
  // ==========================================================================

  const MOTIVATIONAL_MESSAGES = [
    "¡Excelente trabajo! Keep going!",
    "¡Brillante! You're improving rapidly!",
    "¡Increíble! Perfect neural response!",
    "¡Muy bien hecho! You've got this!",
    "¡Impresionante! Neural fluency synchronized!",
    "¡Sensacional! English is becoming second nature!",
    "¡Bien pensado! High-tier mastery!",
    "¡Fantástico! You are on cyber fire!"
  ];

  const MOTIVATIONAL_QUOTES = [
    // Language & Learning
    { text: "The limits of my language mean the limits of my world.", author: "Ludwig Wittgenstein" },
    { text: "One language sets you in a corridor for life. Two languages open every door along the way.", author: "Frank Smith" },
    { text: "To have another language is to possess a second soul.", author: "Charlemagne" },
    { text: "Language is the road map of a culture.", author: "Rita Mae Brown" },
    { text: "A different language is a different vision of life.", author: "Federico Fellini" },
    { text: "Learning is the beginning of wealth. Learning is the beginning of health.", author: "Jim Rohn" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "You live a new life for every new language you speak. If you know only one language, you live only once.", author: "Czech Proverb" },
    { text: "Language is not a genetic gift; it is a social gift. Learning a new language is becoming a member of the club.", author: "Frank Smith" },
    { text: "Every language is a world. Without translation, we would inhabit parishes bordering on silence.", author: "George Steiner" },
    { text: "The more languages you know, the more you are human.", author: "Tomáš Masaryk" },
    { text: "Learning another language is not only learning different words for the same things, but learning another way to think.", author: "Flora Lewis" },
    // Consistency & Progress
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Every expert was once a beginner.", author: "Helen Hayes" },
    { text: "Strive for progress, not perfection.", author: "Anonymous" },
    // Courage & Growth
    { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
    { text: "Mistakes are proof that you are trying.", author: "Jennifer Lim" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your brain is capable of learning a new language at any age. Start today.", author: "Neuroscience Research" },
    // Fluency & Immersion
    { text: "The best time to learn a language was yesterday. The second best time is now.", author: "Adapted Proverb" },
    { text: "Fluency is not perfection. Fluency is the courage to communicate.", author: "Benny Lewis" },
    { text: "To learn a language is to have one more window from which to look at the world.", author: "Chinese Proverb" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" }
  ];

  const RANDOM_USERNAMES = [
    "CyberFox27", "QuantumPanda81", "NeonNinja42", "PixelLearner19",
    "CosmicOwl55", "GoldenOtter33", "AstroFalcon77", "SwiftLynx90",
    "SynapseKoala14", "MatrixTiger63", "CyberEagle88", "NeuralBunny21"
  ];

  // Subtitle dictionary for word inspection
  const SUBTITLE_DICTIONARY = {
    "have": { trans: "Tener / Haber", pos: "Verbo", phonetic: "/hæv/", exEn: "I have a dream.", exEs: "Tengo un sueño." },
    "wondered": { trans: "Preguntado / Considerado", pos: "Verbo", phonetic: "/ˈwʌndərd/", exEn: "I have wondered about this.", exEs: "Me he preguntado esto." },
    "languages": { trans: "Idiomas / Lenguas", pos: "Sustantivo", phonetic: "/ˈlæŋɡwɪdʒɪz/", exEn: "She speaks three languages.", exEs: "Ella habla tres idiomas." },
    "quickly": { trans: "Rápidamente", pos: "Adverbio", phonetic: "/ˈkwɪkli/", exEn: "She learned very quickly.", exEs: "Ella aprendió muy rápidamente." },
    "brain": { trans: "Cerebro", pos: "Sustantivo", phonetic: "/breɪn/", exEn: "The brain is a powerful tool.", exEs: "El cerebro es una herramienta poderosa." },
    "magnificent": { trans: "Magnífico / Impresionante", pos: "Adjetivo", phonetic: "/mæɡˈnɪfɪsənt/", exEn: "A magnificent sunrise.", exEs: "Un amanecer magnífico." },
    "pattern": { trans: "Patrón / Modelo", pos: "Sustantivo", phonetic: "/ˈpætərn/", exEn: "Recognize the pattern.", exEs: "Reconoce el patrón." },
    "recognition": { trans: "Reconocimiento", pos: "Sustantivo", phonetic: "/ˌrekəɡˈnɪʃən/", exEn: "Face recognition technology.", exEs: "Tecnología de reconocimiento facial." },
    "engine": { trans: "Motor / Máquina", pos: "Sustantivo", phonetic: "/ˈendʒɪn/", exEn: "The engine of change.", exEs: "El motor del cambio." },
    "principle": { trans: "Principio / Norma", pos: "Sustantivo", phonetic: "/ˈprɪnsɪpəl/", exEn: "This is the key principle.", exEs: "Este es el principio clave." },
    "relevant": { trans: "Relevante / Importante", pos: "Adjetivo", phonetic: "/ˈreləvənt/", exEn: "Focus on relevant content.", exEs: "Enfócate en contenido relevante." },
    "communicate": { trans: "Comunicarse", pos: "Verbo", phonetic: "/kəˈmjuːnɪkeɪt/", exEn: "We communicate every day.", exEs: "Nos comunicamos cada día." },
    "unconsciously": { trans: "Inconscientemente", pos: "Adverbio", phonetic: "/ʌnˈkɒnʃəsli/", exEn: "You unconsciously absorb language.", exEs: "Absorbes el idioma inconscientemente." },
    "acquire": { trans: "Adquirir / Obtener", pos: "Verbo", phonetic: "/əˈkwaɪər/", exEn: "Acquire new skills daily.", exEs: "Adquiere nuevas habilidades a diario." },
    "consistency": { trans: "Constancia / Consistencia", pos: "Sustantivo", phonetic: "/kənˈsɪstənsi/", exEn: "Consistency is the key to success.", exEs: "La constancia es la clave del éxito." },
    "immersion": { trans: "Inmersión", pos: "Sustantivo", phonetic: "/ɪˈmɜːrʒən/", exEn: "Language immersion is powerful.", exEs: "La inmersión lingüística es poderosa." },
    "neuroplasticity": { trans: "Neuroplasticidad", pos: "Sustantivo", phonetic: "/ˌnjʊərəʊplæˈstɪsɪti/", exEn: "Neuroplasticity allows us to change.", exEs: "La neuroplasticidad nos permite cambiar." },
    "habit": { trans: "Hábito / Costumbre", pos: "Sustantivo", phonetic: "/ˈhæbɪt/", exEn: "Build a daily study habit.", exEs: "Construye un hábito de estudio diario." },
    "nuance": { trans: "Matiz / Sutileza", pos: "Sustantivo", phonetic: "/ˈnjuːɑːns/", exEn: "Appreciate the nuance of tone.", exEs: "Aprecia el matiz del tono." },
    "understatement": { trans: "Atenuación irónica", pos: "Sustantivo", phonetic: "/ˈʌndərsteɪtmənt/", exEn: "British humour loves understatement.", exEs: "El humor británico ama la atenuación irónica." }
  };

  // Video Catalog with real YouTube IDs
  const VIDEO_CATALOG = [
    {
      id: "v1", youtubeId: "d0yGdNEWdn0",
      title: "How to learn any language in six months | Chris Lonsdale | TEDxLingnanUniversity", channel: "Chris Lonsdale | TEDxLingnanUniversity", cefr: "B1", duration: "18:26",
      subtitles: [
        { start: 0, end: 10, en: "Transcriber: Translate TED Reviewer: Allam Zedan", es: "Transcriptor: Translate TED Revisor: Allam Zedan" },
        { start: 10, end: 13, en: "The people in the back, can you hear me clearly?", es: "Las personas de atrás, ¿pueden escucharme con claridad?" },
        { start: 13, end: 15, en: "OK, good.", es: "Bien, perfecto." },
        { start: 15, end: 19, en: "Have you ever held a question in mind", es: "¿Alguna vez has tenido una pregunta en mente" },
        { start: 19, end: 25, en: "for so long that it becomes part of how you think?", es: "durante tanto tiempo que se vuelve parte de tu forma de pensar?" },
        { start: 25, end: 28, en: "Maybe even part of who you are as a person?", es: "¿Quizás incluso parte de quién eres como persona?" },
        { start: 28, end: 32, en: "Well I've had a question in my mind for many, many years", es: "Bueno, yo he tenido una pregunta en mi mente por muchos, muchos años" },
        { start: 32, end: 38, en: "and that is: How can you speed up learning?", es: "y es: ¿Cómo puedes acelerar el aprendizaje?" },
        { start: 38, end: 40, en: "Now, this is an interesting question", es: "Ahora bien, esta es una pregunta interesante" },
        { start: 40, end: 42, en: "because if you speed up learning,", es: "porque si aceleras el aprendizaje," },
        { start: 42, end: 44, en: "you can spend less time at school.", es: "puedes pasar menos tiempo en la escuela." },
        { start: 44, end: 47, en: "And if you learn really fast,", es: "Y si aprendes muy rápido," },
        { start: 47, end: 50, en: "you probably wouldn't have to go to school at all.", es: "probablemente no tendrías que ir a la escuela en absoluto." },
        { start: 50, end: 54, en: "Now, when I was young, school was sort of OK but...", es: "Cuando era joven, la escuela estaba más o menos bien, pero..." },
        { start: 54, end: 58, en: "I found quite often that school got in the way of learning", es: "descubrí con bastante frecuencia que la escuela se interponía en el aprendizaje" },
        { start: 58, end: 62, en: "so I had this question in mind: How do you learn faster?", es: "así que tenía esta pregunta en mente: ¿Cómo aprendes más rápido?" },
        { start: 62, end: 65, en: "And this began when I was very, very young,", es: "Y esto comenzó cuando era muy, muy joven," },
        { start: 65, end: 67, en: "when I was 11 years old,", es: "cuando tenía 11 años," },
        { start: 67, end: 71, en: "I wrote a letter to researchers in the Soviet Union, asking about hypnopaedia,", es: "escribí una carta a investigadores en la Unión Soviética preguntando sobre la hipnopedia," },
        { start: 71, end: 73, en: "this is sleep-learning,", es: "esto es el aprendizaje durante el sueño," },
        { start: 73, end: 76, en: "where you get a tape recorder, you put it beside your bed", es: "donde consigues una grabadora, la pones junto a tu cama" },
        { start: 76, end: 79, en: "and it turns on in the middle of the night", es: "y se enciende en medio de la noche" },
        { start: 79, end: 80, en: "when you're sleeping,", es: "cuando estás durmiendo," },
        { start: 80, end: 82, en: "and you're supposed to be learning from this.", es: "y se supone que estás aprendiendo de eso." },
        { start: 82, end: 85, en: "A good idea, unfortunately it doesn't work.", es: "Una buena idea, desafortunadamente no funciona." },
        { start: 85, end: 89, en: "But, hypnopaedia did open the doors to research in other areas", es: "Pero la hipnopedia sí abrió las puertas a la investigación en otras áreas" },
        { start: 89, end: 92, en: "and we've had incredible discoveries about", es: "y hemos tenido descubrimientos increíbles sobre" },
        { start: 92, end: 96, en: "learning that began with that first question.", es: "el aprendizaje que comenzaron con esa primera pregunta." },
        { start: 96, end: 99, en: "I went on from there to become passionate about psychology", es: "A partir de ahí me apasioné por la psicología" },
        { start: 99, end: 103, en: "and I have been involved in psychology in many different ways", es: "y he estado involucrado en la psicología de muchas maneras diferentes" },
        { start: 103, end: 105, en: "for the rest of my life up until this point.", es: "durante el resto de mi vida hasta este momento." },
        { start: 105, end: 109, en: "In 1981, I took myself to China", es: "En 1981, me fui a China" },
        { start: 109, end: 116, en: "and I decided that I was going to be native level in Chinese inside two years.", es: "y decidí que iba a alcanzar un nivel nativo en chino en dos años." },
        { start: 116, end: 121, en: "Now, you need to understand that in 1981, everybody thought", es: "Ahora, debes entender que en 1981, todo el mundo pensaba" },
        { start: 121, end: 124, en: "Chinese was really, really difficult", es: "que el chino era muy, muy difícil" },
        { start: 124, end: 126, en: "and that a Westerner could study for 10 years or more", es: "y que un occidental podía estudiar durante 10 años o más" },
        { start: 126, end: 128, en: "and never really get very good at it.", es: "y nunca llegar a dominarlo muy bien." },
        { start: 128, end: 131, en: "And I also went in with a different idea", es: "Y yo también fui con una idea diferente" },
        { start: 131, end: 133, en: "which was: taking all of the conclusions", es: "que era: tomar todas las conclusiones" },
        { start: 133, end: 136, en: "from psychological research up to that point", es: "de la investigación psicológica hasta ese momento" },
        { start: 136, end: 139, en: "and applying them to the learning process.", es: "y aplicarlas al proceso de aprendizaje." },
        { start: 139, end: 144, en: "What was really cool was that in six months I was fluent in Mandarin Chinese", es: "Lo realmente genial fue que en seis meses hablaba chino mandarín con fluidez" },
        { start: 144, end: 148, en: "and it took a little bit longer to get up to native.", es: "y tomó un poco más de tiempo llegar al nivel nativo." },
        { start: 148, end: 153, en: "But I looked around and I saw all of these people from different countries", es: "Pero miré a mi alrededor y vi a todas estas personas de diferentes países" },
        { start: 153, end: 155, en: "struggling terribly with Chinese,", es: "luchando terriblemente con el chino," },
        { start: 155, end: 160, en: "I saw Chinese people struggling terribly to learn English and other languages,", es: "vi a personas chinas luchando terriblemente para aprender inglés y otros idiomas," },
        { start: 160, end: 164, en: "and so my question got refined down to:", es: "y así mi pregunta se refinó a:" },
        { start: 164, end: 167, en: "How can you help a normal adult", es: "¿Cómo puedes ayudar a un adulto normal" },
        { start: 167, end: 171, en: "learn a new language quickly, easily and effectively?", es: "a aprender un nuevo idioma de forma rápida, fácil y efectiva?" },
        { start: 171, end: 174, en: "Now this is a really, really important question in today's world.", es: "Ahora, esta es una pregunta muy, muy importante en el mundo de hoy." },
        { start: 174, end: 176, en: "We have massive challenges with environment,", es: "Tenemos desafíos masivos con el medio ambiente," },
        { start: 176, end: 179, en: "we have massive challenges with social dislocation,", es: "tenemos desafíos masivos con la dislocación social," },
        { start: 179, end: 182, en: "with wars, all sorts of things going on", es: "con guerras, todo tipo de cosas sucediendo" },
        { start: 182, end: 184, en: "and if we can't communicate,", es: "y si no podemos comunicarnos," },
        { start: 184, end: 187, en: "we're really going to have difficulty solving these problems.", es: "realmente vamos a tener dificultades para resolver estos problemas." },
        { start: 187, end: 190, en: "So we need to be able to speak each other's languages,", es: "Así que necesitamos poder hablar los idiomas de los demás," },
        { start: 190, end: 192, en: "this is really, really important.", es: "esto es muy, muy importante." },
        { start: 192, end: 196, en: "The question then is: How do you do that?", es: "La pregunta entonces es: ¿Cómo haces eso?" },
        { start: 196, end: 198, en: "Well, it's actually really easy.", es: "Bueno, en realidad es muy fácil." },
        { start: 198, end: 201, en: "You look around for people who can already do it,", es: "Buscas personas que ya puedan hacerlo," },
        { start: 201, end: 204, en: "you look for situations where it's already working", es: "buscas situaciones donde ya esté funcionando" },
        { start: 204, end: 207, en: "and then you identify the principles and apply them.", es: "y luego identificas los principios y los aplicas." },
        { start: 207, end: 210, en: "It's called modelling and I've been looking at language learning", es: "Se llama modelado y he estado observando el aprendizaje de idiomas" },
        { start: 210, end: 215, en: "and modelling language learning for about 15 to 20 years now.", es: "y modelando el aprendizaje de idiomas durante unos 15 a 20 años." },
        { start: 215, end: 218, en: "And my conclusion, my observation from this is", es: "Y mi conclusión, mi observación a partir de esto es" },
        { start: 218, end: 223, en: "that any adult can learn a second language to fluency inside six months.", es: "que cualquier adulto puede aprender un segundo idioma con fluidez en seis meses." },
        { start: 223, end: 229, en: "Now when I say this, most people think I'm crazy, this is not possible.", es: "Cuando digo esto, la mayoría piensa que estoy loco, que esto no es posible." },
        { start: 229, end: 233, en: "So let me remind everybody of the history of human progress,", es: "Así que permítanme recordarles a todos la historia del progreso humano," },
        { start: 233, end: 237, en: "it's all about expanding our limits.", es: "se trata de expandir nuestros límites." },
        { start: 237, end: 243, en: "In 1950, everybody believed that running one mile in four minutes was impossible,", es: "En 1950, todo el mundo creía que correr una milla en cuatro minutos era imposible," },
        { start: 243, end: 246, en: "and then Roger Bannister did it in 1956", es: "y luego Roger Bannister lo logró en 1956" },
        { start: 246, end: 249, en: "and from there it's got shorter and shorter.", es: "y a partir de ahí el tiempo se ha hecho cada vez más corto." },
        { start: 249, end: 252, en: "100 years ago everybody believed that heavy stuff doesn't fly.", es: "Hace 100 años todo el mundo creía que las cosas pesadas no vuelan." },
        { start: 252, end: 256, en: "Except it does and we all know this.", es: "Excepto que sí lo hacen y todos lo sabemos." },
        { start: 256, end: 258, en: "How does heavy stuff fly?", es: "¿Cómo vuelan las cosas pesadas?" },
        { start: 258, end: 262, en: "We reorganise the material using principles that we have learned", es: "Reorganizamos el material usando principios que hemos aprendido" },
        { start: 262, end: 266, en: "from observing nature, birds in this case.", es: "al observar la naturaleza, las aves en este caso." },
        { start: 266, end: 270, en: "And today we've gone even further...", es: "Y hoy hemos ido aún más lejos..." },
        { start: 270, end: 274, en: "We've gone even further, so you can fly a car.", es: "Hemos ido aún más lejos, tanto que puedes volar un auto." },
        { start: 274, end: 277, en: "You can buy one of these for a couple 100.000 US dollars.", es: "Puedes comprar uno de estos por un par de cientos de miles de dólares estadounidenses." },
        { start: 277, end: 279, en: "We now have cars in the world that fly.", es: "Ahora tenemos autos en el mundo que vuelan." },
        { start: 279, end: 283, en: "And there's a different way to fly which we've learned from squirrels.", es: "Y hay una forma diferente de volar que hemos aprendido de las ardillas." },
        { start: 283, end: 286, en: "So all you need to do is copy what a flying squirrel does,", es: "Así que todo lo que necesitas hacer es copiar lo que hace una ardilla voladora," },
        { start: 286, end: 290, en: "build a suit called a wing suit and off you go, you can fly like a squirrel.", es: "construir un traje llamado traje de alas y listo, puedes volar como una ardilla." },
        { start: 290, end: 294, en: "Now most people, a lot of people, I wouldn't say everybody", es: "Ahora, la mayoría de las personas, mucha gente, no diría que todo el mundo" },
        { start: 294, end: 297, en: "but a lot of people think they can't draw.", es: "pero mucha gente piensa que no puede dibujar." },
        { start: 297, end: 301, en: "However there are some key principles, five principles, that you can apply", es: "Sin embargo, hay algunos principios clave, cinco principios, que puedes aplicar" },
        { start: 301, end: 305, en: "to learning to draw and you can actually learn to draw in five days.", es: "para aprender a dibujar y de hecho puedes aprender a dibujar en cinco días." },
        { start: 305, end: 310, en: "So, if you draw like this, you learn these principles for five days", es: "Así que, si dibujas así, aprendes estos principios durante cinco días" },
        { start: 310, end: 315, en: "and apply them and after five days you can draw something like this.", es: "y los aplicas, y después de cinco días puedes dibujar algo como esto." },
        { start: 315, end: 318, en: "Now I know this is true because that was my first drawing", es: "Sé que esto es cierto porque ese fue mi primer dibujo" },
        { start: 318, end: 322, en: "and after five days of applying these principles that was what I was able to do.", es: "y después de cinco días de aplicar estos principios eso fue lo que pude hacer." },
        { start: 322, end: 323, en: "And I looked at this and I went:", es: "Y miré esto y pensé:" },
        { start: 323, end: 327, en: "\"Wow, so that's how I look like when I'm concentrating so intensely", es: "\"Vaya, así es como me veo cuando me concentro tan intensamente" },
        { start: 327, end: 331, en: "that my brain is exploding.\"", es: "que mi cerebro está explotando\"." },
        { start: 331, end: 335, en: "So, anybody can learn to draw in five days", es: "Así que cualquiera puede aprender a dibujar en cinco días" },
        { start: 335, end: 337, en: "and in the same way, with the same logic,", es: "y de la misma manera, con la misma lógica," },
        { start: 337, end: 342, en: "anybody can learn a second language in six months.", es: "cualquiera puede aprender un segundo idioma en seis meses." },
        { start: 342, end: 346, en: "How? There are five principles and seven actions.", es: "¿Cómo? Hay cinco principios y siete acciones." },
        { start: 346, end: 349, en: "There may be a few more but these are absolutely core.", es: "Puede haber algunos más, pero estos son absolutamente fundamentales." },
        { start: 349, end: 353, en: "And before I get into those I just want to talk about two myths,", es: "Y antes de entrar en ellos solo quiero hablar de dos mitos," },
        { start: 353, end: 354, en: "I want to dispel two myths.", es: "quiero disipar dos mitos." },
        { start: 354, end: 356, en: "The first is that you need talent.", es: "El primero es que necesitas talento." },
        { start: 356, end: 358, en: "Let me tell you about Zoe.", es: "Déjenme contarles sobre Zoe." },
        { start: 358, end: 363, en: "Zoe came from Australia, went to Holland, was trying to learn Dutch,", es: "Zoe vino de Australia, fue a Holanda, estaba tratando de aprender neerlandés," },
        { start: 363, end: 366, en: "struggling extremely, extremely... a great deal", es: "luchando extremadamente, extremadamente... muchísimo" },
        { start: 366, end: 369, en: "and finally people were saying: \"You're completely useless,\"", es: "y finalmente la gente le decía: \"Eres completamente inútil\"," },
        { start: 369, end: 373, en: "\"you're not talented,\" \"give up,\" \"you're a waste of time\"", es: "\"no tienes talento\", \"ríndete\", \"eres una pérdida de tiempo\"" },
        { start: 373, end: 375, en: "and she was very, very depressed.", es: "y ella estaba muy, muy deprimida." },
        { start: 375, end: 377, en: "And then she came across these five principles,", es: "Y entonces se encontró con estos cinco principios," },
        { start: 377, end: 379, en: "she moved to Brazil and she applied them", es: "se mudó a Brasil y los aplicó" },
        { start: 379, end: 382, en: "and in six months she was fluent in Portuguese,", es: "y en seis meses hablaba portugués con fluidez," },
        { start: 382, end: 384, en: "so talent doesn't matter.", es: "así que el talento no importa." },
        { start: 384, end: 388, en: "People also think that immersion in a new country is the way to learn a language.", es: "La gente también piensa que la inmersión en un país nuevo es la forma de aprender un idioma." },
        { start: 388, end: 391, en: "But look around Hong Kong, look at all the westerners", es: "Pero miren alrededor de Hong Kong, miren a todos los occidentales" },
        { start: 391, end: 395, en: "who've been here for 10 years, who don't speak a word of Chinese.", es: "que han estado aquí por 10 años y no hablan ni una palabra de chino." },
        { start: 395, end: 399, en: "Look at all the Chinese living in America, Britain, Australia, Canada", es: "Miren a todos los chinos que viven en Estados Unidos, Gran Bretaña, Australia, Canadá" },
        { start: 399, end: 403, en: "have been there 10, 20 years and they don't speak any English.", es: "que han estado allí 10, 20 años y no hablan nada de inglés." },
        { start: 403, end: 405, en: "Immersion per se does not work.", es: "La inmersión por sí sola no funciona." },
        { start: 405, end: 409, en: "Why? Because a drowning man cannot learn to swim.", es: "¿Por qué? Porque un hombre que se ahoga no puede aprender a nadar." },
        { start: 409, end: 412, en: "When you don't speak a language, you're like a baby.", es: "Cuando no hablas un idioma, eres como un bebé." },
        { start: 412, end: 414, en: "And if you drop yourself into a context", es: "Y si te lanzas a un contexto" },
        { start: 414, end: 419, en: "which is all adults talking about stuff over your head, you won't learn.", es: "donde todos son adultos hablando de cosas que no entiendes, no aprenderás." },
        { start: 419, end: 422, en: "So, what are the five principles that you need to pay attention to?", es: "Entonces, ¿cuáles son los cinco principios a los que debes prestar atención?" },
        { start: 422, end: 424, en: "First: the four words,", es: "Primero: las cuatro palabras," },
        { start: 424, end: 426, en: "attention, meaning, relevance and memory,", es: "atención, significado, relevancia y memoria," },
        { start: 426, end: 430, en: "and these interconnect in very, very important ways.", es: "y estas se interconectan de maneras muy, muy importantes." },
        { start: 430, end: 432, en: "Especially when you're talking about learning.", es: "Especialmente cuando hablas de aprendizaje." },
        { start: 432, end: 434, en: "Come with me on a journey through a forest.", es: "Ven conmigo en un viaje por un bosque." },
        { start: 434, end: 437, en: "You go on a walk through a forest", es: "Vas a caminar por un bosque" },
        { start: 437, end: 440, en: "and you see something like this... Little marks on a tree,", es: "y ves algo como esto... Pequeñas marcas en un árbol," },
        { start: 440, end: 443, en: "maybe you pay attention, maybe you don't.", es: "tal vez prestas atención, tal vez no." },
        { start: 443, end: 446, en: "You go another 50 metres and you see this...", es: "Avanzas otros 50 metros y ves esto..." },
        { start: 446, end: 449, en: "You should be paying attention.", es: "Deberías estar prestando atención." },
        { start: 449, end: 453, en: "Another 50 metres, if you haven't been paying attention, you see this...", es: "Otros 50 metros, si no has estado prestando atención, ves esto..." },
        { start: 453, end: 457, en: "And at this point, you're paying attention.", es: "Y en este punto, estás prestando atención." },
        { start: 457, end: 460, en: "And you've just learned that this... is important,", es: "Y acabas de aprender que esto... es importante," },
        { start: 460, end: 462, en: "it's relevant because it means this,", es: "es relevante porque significa esto," },
        { start: 462, end: 468, en: "and anything that is related, any information related to your survival", es: "y cualquier cosa relacionada, cualquier información relacionada con tu supervivencia" },
        { start: 468, end: 470, en: "is stuff that you're going to pay attention to", es: "es algo a lo que vas a prestar atención" },
        { start: 470, end: 472, en: "and therefore you're going to remember it.", es: "y por lo tanto lo vas a recordar." },
        { start: 472, end: 474, en: "If it's related to your personal goals,", es: "Si está relacionado con tus metas personales," },
        { start: 474, end: 476, en: "then you're going to pay attention to it.", es: "entonces le vas a prestar atención." },
        { start: 476, end: 478, en: "If it's relevant, you're going to remember it.", es: "Si es relevante, lo vas a recordar." },
        { start: 478, end: 481, en: "So, the first rule, first principle for learning a language", es: "Así que la primera regla, el primer principio para aprender un idioma" },
        { start: 481, end: 484, en: "is focus on language content that is relevant to you.", es: "es enfocarte en contenido lingüístico que sea relevante para ti." },
        { start: 484, end: 487, en: "Which brings us to tools.", es: "Lo cual nos lleva a las herramientas." },
        { start: 487, end: 491, en: "We master tools by using tools and we learn tools the fastest", es: "Dominamos las herramientas usándolas y aprendemos herramientas más rápido" },
        { start: 491, end: 494, en: "when they are relevant to us.", es: "cuando son relevantes para nosotros." },
        { start: 494, end: 495, en: "So let me share a story.", es: "Así que déjenme compartir una historia." },
        { start: 495, end: 498, en: "A keyboard is a tool.", es: "Un teclado es una herramienta." },
        { start: 498, end: 501, en: "Typing Chinese a certain way, there are methods for this. That's a tool.", es: "Escribir chino de cierta manera, hay métodos para esto. Eso es una herramienta." },
        { start: 501, end: 504, en: "I had a colleague many years ago", es: "Tenía una colega hace muchos años" },
        { start: 504, end: 507, en: "who went to night school; Tuesday night, Thursday night,", es: "que iba a la escuela nocturna; martes por la noche, jueves por la noche," },
        { start: 507, end: 509, en: "two hours each time, practicing at home,", es: "dos horas cada vez, practicando en casa," },
        { start: 509, end: 514, en: "she spent nine months, and she did not learn to type Chinese.", es: "pasó nueve meses y no aprendió a escribir chino en el teclado." },
        { start: 514, end: 516, en: "And one night we had a crisis.", es: "Y una noche tuvimos una crisis." },
        { start: 516, end: 520, en: "We had 48 hours to deliver a training manual in Chinese.", es: "Teníamos 48 horas para entregar un manual de capacitación en chino." },
        { start: 520, end: 522, en: "And she got the job, and I can guarantee you", es: "Y ella recibió el trabajo, y te puedo garantizar" },
        { start: 522, end: 524, en: "in 48 hours, she learned to type Chinese", es: "que en 48 horas aprendió a escribir chino" },
        { start: 524, end: 527, en: "because it was relevant, it was meaningful, it was important,", es: "porque era relevante, era significativo, era importante," },
        { start: 527, end: 530, en: "she was using a tool to create value.", es: "estaba usando una herramienta para crear valor." },
        { start: 530, end: 533, en: "So the second principle for learning a language is to use your language", es: "Así que el segundo principio para aprender un idioma es usar tu idioma" },
        { start: 533, end: 537, en: "as a tool to communicate right from day one.", es: "como una herramienta para comunicarte desde el primer día." },
        { start: 537, end: 539, en: "As a kid does.", es: "Como hace un niño." },
        { start: 539, end: 543, en: "When I first arrived in China, I didn't speak a word of Chinese,", es: "Cuando llegué por primera vez a China, no hablaba ni una palabra de chino," },
        { start: 543, end: 547, en: "and on my second week, I got to take a train ride overnight.", es: "y en mi segunda semana, tomé un viaje en tren nocturno." },
        { start: 547, end: 550, en: "I spent eight hours sitting in the dining car", es: "Pasé ocho horas sentado en el vagón restaurante" },
        { start: 550, end: 552, en: "talking to one of the guards on the train,", es: "hablando con uno de los guardias del tren," },
        { start: 552, end: 554, en: "he took an interest in me for some reason,", es: "él se interesó en mí por alguna razón," },
        { start: 554, end: 557, en: "and we just chatted all night in Chinese", es: "y simplemente charlamos toda la noche en chino" },
        { start: 557, end: 560, en: "and he was drawing pictures and making movements with his hands", es: "y él hacía dibujos y movimientos con las manos" },
        { start: 560, end: 562, en: "and facial expressions and piece by piece by piece", es: "y expresiones faciales y pieza por pieza" },
        { start: 562, end: 565, en: "I understood more and more.", es: "fui entendiendo más y más." },
        { start: 565, end: 568, en: "But what was really cool, was two weeks later,", es: "Pero lo realmente genial fue que dos semanas después," },
        { start: 568, end: 570, en: "when people were talking Chinese around me,", es: "cuando la gente hablaba chino a mi alrededor," },
        { start: 570, end: 572, en: "I was understanding some of this", es: "yo estaba entendiendo algo de esto" },
        { start: 572, end: 575, en: "and I hadn't even made any effort to learn that.", es: "y ni siquiera había hecho ningún esfuerzo por aprenderlo." },
        { start: 575, end: 578, en: "What had happened, I'd absorbed it that night on the train,", es: "Lo que había pasado es que lo había absorbido esa noche en el tren," },
        { start: 578, end: 580, en: "which brings us to the third principle.", es: "lo que nos lleva al tercer principio." },
        { start: 580, end: 583, en: "When you first understand the message,", es: "Cuando primero entiendes el mensaje," },
        { start: 583, end: 588, en: "then you will acquire the language unconsciously.", es: "entonces adquirirás el idioma inconscientemente." },
        { start: 588, end: 591, en: "And this is really, really well documented now,", es: "Y esto está muy, muy bien documentado ahora," },
        { start: 591, end: 593, en: "it's something called comprehensible input.", es: "es algo llamado input comprensible (comprehensible input)." },
        { start: 593, end: 595, en: "There's 20 or 30 years of research on this,", es: "Hay 20 o 30 años de investigación sobre esto," },
        { start: 595, end: 597, en: "Stephen Krashen, a leader in the field,", es: "Stephen Krashen, un líder en el campo," },
        { start: 597, end: 599, en: "has published all sorts of these different studies", es: "ha publicado todo tipo de estos diferentes estudios" },
        { start: 599, end: 601, en: "and this is just from one of them.", es: "y esto es solo de uno de ellos." },
        { start: 601, end: 609, en: "The purple bars show the scores on different tests for language.", es: "Las barras moradas muestran las puntuaciones en diferentes pruebas de idioma." },
        { start: 609, end: 614, en: "The purple people were people who had learned by grammar and formal study,", es: "Las personas de morado eran quienes habían aprendido por gramática y estudio formal," },
        { start: 614, end: 617, en: "the green ones are the ones who learned by comprehensible input.", es: "las de verde son quienes aprendieron por input comprensible." },
        { start: 617, end: 621, en: "So, comprehension works. Comprehension is key", es: "Así que la comprensión funciona. La comprensión es clave" },
        { start: 621, end: 628, en: "and language learning is not about accumulating lots of knowledge.", es: "y aprender un idioma no se trata de acumular mucho conocimiento." },
        { start: 628, end: 634, en: "In many, many ways it's about physiological training.", es: "De muchas, muchas maneras se trata de entrenamiento fisiológico." },
        { start: 634, end: 637, en: "A woman I know from Taiwan did great in English at school,", es: "Una mujer que conozco de Taiwán era excelente en inglés en la escuela," },
        { start: 637, end: 639, en: "she got A grades all the way through,", es: "sacó calificaciones sobresalientes todo el tiempo," },
        { start: 639, end: 642, en: "went through college, A grades, went to the US", es: "pasó por la universidad con sobresalientes, fue a Estados Unidos" },
        { start: 642, end: 645, en: "and found she couldn't understand what people were saying.", es: "y descubrió que no podía entender lo que decía la gente." },
        { start: 645, end: 649, en: "And people started asking her: \"Are you deaf?\"", es: "Y la gente empezó a preguntarle: \"¿Eres sorda?\"" },
        { start: 649, end: 652, en: "And she was. English deaf.", es: "Y lo era. Sorda al inglés." },
        { start: 652, end: 656, en: "Because we have filters in our brain that filter in", es: "Porque tenemos filtros en nuestro cerebro que dejan pasar" },
        { start: 656, end: 658, en: "the sounds that we are familiar with", es: "los sonidos con los que estamos familiarizados" },
        { start: 658, end: 662, en: "and they filter out the sounds of languages that we're not.", es: "y filtran hacia afuera los sonidos de los idiomas con los que no." },
        { start: 662, end: 665, en: "And if you can't hear it, you won't understand it,", es: "Y si no puedes escucharlo, no lo entenderás," },
        { start: 665, end: 667, en: "if you can't understand it, you're not going to learn it.", es: "si no puedes entenderlo, no lo vas a aprender." },
        { start: 667, end: 670, en: "So you actually have to be able to hear these sounds.", es: "Así que en realidad tienes que poder escuchar estos sonidos." },
        { start: 670, end: 673, en: "And there are ways to do that but it's physiological training.", es: "Y hay maneras de hacerlo, pero es entrenamiento fisiológico." },
        { start: 673, end: 678, en: "Speaking takes muscle.", es: "Hablar requiere músculo." },
        { start: 678, end: 681, en: "You've got 43 muscles in your face,", es: "Tienes 43 músculos en la cara," },
        { start: 681, end: 683, en: "you have to coordinate those in a way", es: "tienes que coordinarlos de tal manera" },
        { start: 683, end: 687, en: "that you make sounds that other people will understand.", es: "que hagas sonidos que otras personas entiendan." },
        { start: 687, end: 690, en: "If you've ever done a new sport for a couple of days,", es: "Si alguna vez has practicado un deporte nuevo por un par de días," },
        { start: 690, end: 693, en: "and you know how your body feels? Hurts?", es: "¿sabes cómo se siente tu cuerpo? ¿Duele?" },
        { start: 693, end: 698, en: "If your face is hurting, you're doing it right.", es: "Si te duele la cara, lo estás haciendo bien." },
        { start: 698, end: 703, en: "And the final principle is state. Psycho-physiological state.", es: "Y el principio final es el estado. Estado psicofisiológico." },
        { start: 703, end: 708, en: "If you're sad, angry, worried, upset, you're not going to learn. Period.", es: "Si estás triste, enojado, preocupado, molesto, no vas a aprender. Punto." },
        { start: 708, end: 711, en: "If you're happy, relaxed, in an Alpha brain state, curious,", es: "Si estás feliz, relajado, en un estado cerebral Alfa, curioso," },
        { start: 711, end: 713, en: "you're going to learn really quickly,", es: "vas a aprender muy rápido," },
        { start: 713, end: 717, en: "and very specifically you need to be tolerant of ambiguity.", es: "y muy específicamente necesitas ser tolerante a la ambigüedad." },
        { start: 717, end: 720, en: "If you're one of those people who needs to understand 100 percent", es: "Si eres una de esas personas que necesita entender el 100 por ciento" },
        { start: 720, end: 723, en: "every word you're hearing, you will go nuts,", es: "de cada palabra que escucha, te volverás loco," },
        { start: 723, end: 727, en: "because you'll be incredibly upset all the time, because you're not perfect.", es: "porque estarás increíblemente molesto todo el tiempo, por no ser perfecto." },
        { start: 727, end: 731, en: "If you're comfortable with getting some, not getting some,", es: "Si te sientes cómodo entendiendo algo y no entendiendo todo," },
        { start: 731, end: 733, en: "just paying attention to what you do understand,", es: "simplemente prestando atención a lo que sí entiendes," },
        { start: 733, end: 736, en: "you're going to be fine, relaxed, and you'll be learning quickly.", es: "estarás bien, relajado y aprenderás rápidamente." },
        { start: 736, end: 741, en: "So based on those five principles, what are the seven actions that you take?", es: "Entonces, basándonos en esos cinco principios, ¿cuáles son las siete acciones que tomas?" },
        { start: 741, end: 743, en: "Number one: Listen a lot.", es: "Número uno: Escucha mucho." },
        { start: 743, end: 746, en: "I call it brain soaking.", es: "Yo lo llamo empapar el cerebro." },
        { start: 746, end: 747, en: "You put yourself in a context", es: "Te pones en un contexto" },
        { start: 747, end: 751, en: "where you're hearing tons and tons and tons of a language", es: "donde estás escuchando toneladas y toneladas de un idioma" },
        { start: 751, end: 753, en: "and it doesn't matter if you understand it or not.", es: "y no importa si lo entiendes o no." },
        { start: 753, end: 757, en: "You're listening to the rhythms, to patterns that repeat,", es: "Estás escuchando los ritmos, los patrones que se repiten," },
        { start: 757, end: 759, en: "you're listening to things that stand out.", es: "estás escuchando las cosas que destacan." },
        { start: 759, end: 761, en: "(Chinese) Pào nǎozi.", es: "(Chino) Pào nǎozi." },
        { start: 761, end: 763, en: "(English) So, just soak your brain in this.", es: "(Inglés) Así que simplemente empapa tu cerebro en esto." },
        { start: 763, end: 766, en: "The second action is that you get the meaning first,", es: "La segunda acción es que captas el significado primero," },
        { start: 766, end: 768, en: "even before you get the words.", es: "incluso antes de captar las palabras." },
        { start: 768, end: 771, en: "You go: \"Well how do I do that? I don't know the words!\"", es: "Dices: \"Bueno, ¿cómo hago eso? ¡No sé las palabras!\"" },
        { start: 771, end: 775, en: "Well, you understand what these different postures mean.", es: "Bueno, entiendes lo que significan estas diferentes posturas." },
        { start: 775, end: 780, en: "Human communication is body language in many, many ways, so much body language.", es: "La comunicación humana es lenguaje corporal en muchos sentidos, muchísimo lenguaje corporal." },
        { start: 780, end: 783, en: "From body language you can understand a lot of communication,", es: "Por el lenguaje corporal puedes entender mucha comunicación," },
        { start: 783, end: 787, en: "therefore, you're understanding, you're acquiring through comprehensible input.", es: "por lo tanto, estás entendiendo, estás adquiriendo a través de input comprensible." },
        { start: 787, end: 791, en: "And you can also use patterns that you already know.", es: "Y también puedes usar patrones que ya conoces." },
        { start: 791, end: 796, en: "If you're a Chinese speaker of Mandarin and Cantonese and you go to Vietnam,", es: "Si eres un hablante chino de mandarín y cantonés y vas a Vietnam," },
        { start: 796, end: 802, en: "you will understand 60 percent of what they say to you in daily conversation,", es: "entenderás el 60 por ciento de lo que te dicen en una conversación diaria," },
        { start: 802, end: 808, en: "because Vietnamese is about 30 percent Mandarin, 30 percent Cantonese.", es: "porque el vietnamita es aproximadamente 30 por ciento mandarín, 30 por ciento cantonés." },
        { start: 808, end: 811, en: "The third action: Start mixing.", es: "La tercera acción: Empieza a mezclar." },
        { start: 811, end: 813, en: "You probably have never thought of this", es: "Probablemente nunca hayas pensado en esto" },
        { start: 813, end: 816, en: "but if you've got 10 verbs, 10 nouns and 10 adjectives,", es: "pero si tienes 10 verbos, 10 sustantivos y 10 adjetivos," },
        { start: 816, end: 819, en: "you can say 1000 different things.", es: "puedes decir 1000 cosas diferentes." },
        { start: 819, end: 823, en: "Language is a creative process.", es: "El lenguaje es un proceso creativo." },
        { start: 823, end: 827, en: "What do babies do? OK, \"me\", \"bath\", \"now\".", es: "¿Qué hacen los bebés? Bueno, \"yo\", \"baño\", \"ahora\"." },
        { start: 827, end: 829, en: "OK, that's how they communicate.", es: "Bien, así es como se comunican." },
        { start: 829, end: 831, en: "So start mixing, get creative, have fun with it,", es: "Así que empieza a mezclar, ponte creativo, diviértete con ello," },
        { start: 831, end: 835, en: "it doesn't have to be perfect, just has to work.", es: "no tiene que ser perfecto, solo tiene que funcionar." },
        { start: 835, end: 838, en: "And when you're doing this, you focus on the core.", es: "Y cuando hagas esto, enfócate en el núcleo." },
        { start: 838, end: 839, en: "What does that mean?", es: "¿Qué significa eso?" },
        { start: 839, end: 842, en: "Well, any language is high frequency content.", es: "Bueno, cualquier idioma tiene contenido de alta frecuencia." },
        { start: 842, end: 846, en: "In English 1000 words covers 85 percent", es: "En inglés, 1000 palabras cubren el 85 por ciento" },
        { start: 846, end: 849, en: "of anything you're ever going to say in daily communication.", es: "de cualquier cosa que vayas a decir en la comunicación diaria." },
        { start: 849, end: 852, en: "3000 words gives you 98 percent", es: "3000 palabras te dan el 98 por ciento" },
        { start: 852, end: 854, en: "of anything you're going to say in daily conversation.", es: "de cualquier cosa que vayas a decir en una conversación diaria." },
        { start: 854, end: 857, en: "You got 3000 words, you're speaking the language.", es: "Tienes 3000 palabras, estás hablando el idioma." },
        { start: 857, end: 860, en: "The rest is icing on the cake.", es: "El resto es la cereza del pastel." },
        { start: 860, end: 862, en: "And when you're just beginning with a new language,", es: "Y cuando apenas estás empezando con un idioma nuevo," },
        { start: 862, end: 866, en: "start with your tool box. Week number one,", es: "empieza con tu caja de herramientas. Semana número uno," },
        { start: 866, end: 868, en: "in your new language you say things like:", es: "en tu nuevo idioma dices cosas como:" },
        { start: 868, end: 870, en: "\"How do you say that?\" \"I don't understand,\"", es: "\"¿Cómo se dice eso?\" \"No entiendo\"," },
        { start: 870, end: 873, en: "\"repeat that please,\" \"what does that mean?\"", es: "\"repita eso por favor\", \"¿qué significa eso?\"" },
        { start: 873, end: 874, en: "all in your target language.", es: "todo en tu idioma objetivo." },
        { start: 874, end: 877, en: "You're using it as a tool, making it useful to you,", es: "Lo estás usando como una herramienta, haciéndolo útil para ti," },
        { start: 877, end: 881, en: "it's relevant to learn other things about the language.", es: "es relevante para aprender otras cosas sobre el idioma." },
        { start: 881, end: 883, en: "By week two, you should be saying things like:", es: "Para la semana dos, deberías estar diciendo cosas como:" },
        { start: 883, end: 887, en: "\"me,\" \"this,\" \"you,\" \"that,\" \"give,\" you know, \"hot,\"", es: "\"yo\", \"esto\", \"tú\", \"eso\", \"dar\", ya sabes, \"caliente\"," },
        { start: 887, end: 891, en: "simple pronouns, simple nouns, simple verbs,", es: "pronombres simples, sustantivos simples, verbos simples," },
        { start: 891, end: 894, en: "simple adjectives, communicating like a baby.", es: "adjetivos simples, comunicándote como un bebé." },
        { start: 894, end: 899, en: "And by the third or fourth week, you're getting into \"glue words.\"", es: "Y para la tercera o cuarta semana, estás entrando en las \"palabras pegamento\"." },
        { start: 899, end: 903, en: "\"Although,\" \"but,\" \"therefore,\" these are logical transformers", es: "\"Aunque\", \"pero\", \"por lo tanto\", estos son transformadores lógicos" },
        { start: 903, end: 908, en: "that tie bits of a language together, allowing you to make more complex meaning.", es: "que unen fragmentos de un idioma, permitiéndote crear significados más complejos." },
        { start: 908, end: 910, en: "At that point you're talking.", es: "En ese punto ya estás hablando." },
        { start: 910, end: 915, en: "And when you're doing that, you should get yourself a language parent.", es: "Y cuando hagas eso, deberías conseguirte un padre lingüístico." },
        { start: 915, end: 918, en: "If you look at how children and parents interact,", es: "Si observas cómo interactúan los niños y los padres," },
        { start: 918, end: 921, en: "you'll understand what this means.", es: "entenderás lo que esto significa." },
        { start: 921, end: 924, en: "When a child is speaking, it'll be using simple words, simple combinations,", es: "Cuando un niño habla, usará palabras simples, combinaciones simples," },
        { start: 924, end: 928, en: "sometimes quite strange, sometimes very strange pronunciation,", es: "a veces bastante extrañas, a veces con una pronunciación muy rara," },
        { start: 928, end: 932, en: "other people from outside the family don't understand it.", es: "otras personas fuera de la familia no lo entienden." },
        { start: 932, end: 934, en: "But the parents do.", es: "Pero los padres sí." },
        { start: 934, end: 939, en: "And so the kid has a safe environment, gets confidence.", es: "Y así el niño tiene un ambiente seguro, gana confianza." },
        { start: 939, end: 942, en: "The parents talk to the children with body language", es: "Los padres hablan con los niños con lenguaje corporal" },
        { start: 942, end: 945, en: "and with simple language they know the child understands.", es: "y con un lenguaje sencillo que saben que el niño entiende." },
        { start: 945, end: 948, en: "So you have a comprehensible input environment that's safe,", es: "Así que tienes un entorno de input comprensible que es seguro," },
        { start: 948, end: 952, en: "we know it works; otherwise none of you would speak your mother tongue.", es: "sabemos que funciona; de lo contrario ninguno de ustedes hablaría su lengua materna." },
        { start: 952, end: 954, en: "So you get yourself a language parent,", es: "Así que búscate un padre lingüístico," },
        { start: 954, end: 956, en: "who's somebody interested in you as a person", es: "que sea alguien interesado en ti como persona" },
        { start: 956, end: 959, en: "who will communicate with you essentially as an equal,", es: "que se comunique contigo esencialmente como un igual," },
        { start: 959, end: 964, en: "but pay attention to help you understand the message.", es: "pero preste atención para ayudarte a entender el mensaje." },
        { start: 964, end: 966, en: "There are four rules of a language parent.", es: "Hay cuatro reglas de un padre lingüístico." },
        { start: 966, end: 968, en: "Spouses are not very good at this, OK?", es: "Los cónyuges no son muy buenos en esto, ¿ok?" },
        { start: 968, end: 969, en: "But the four rules are,", es: "Pero las cuatro reglas son:" },
        { start: 969, end: 972, en: "first of all, they will work hard to understand what you mean", es: "en primer lugar, se esforzarán mucho por entender lo que quieres decir" },
        { start: 972, end: 975, en: "even when you're way off beat.", es: "incluso cuando estés muy lejos de acertar." },
        { start: 975, end: 978, en: "Secondly, they will never correct your mistakes.", es: "En segundo lugar, nunca corregirán tus errores." },
        { start: 978, end: 982, en: "Thirdly, they will feed back their understanding of what you are saying", es: "En tercer lugar, te devolverán su comprensión de lo que estás diciendo" },
        { start: 982, end: 986, en: "so that you can respond appropriately and get that feedback", es: "para que puedas responder adecuadamente y obtener esa retroalimentación" },
        { start: 986, end: 989, en: "and then they will use words that you know.", es: "y luego usarán palabras que tú conoces." },
        { start: 989, end: 993, en: "The sixth thing you have to do, is copy the face.", es: "La sexta cosa que tienes que hacer es copiar el rostro." },
        { start: 993, end: 995, en: "You got to get the muscles working right,", es: "Tienes que hacer que los músculos funcionen bien," },
        { start: 995, end: 999, en: "so you can sound in a way that people will understand you.", es: "para que puedas sonar de una manera que la gente te entienda." },
        { start: 999, end: 1000, en: "There's a couple of things you do.", es: "Hay un par de cosas que haces." },
        { start: 1000, end: 1004, en: "One is that you hear how it feels, and feel how it sounds", es: "Una es que escuchas cómo se siente y sientes cómo suena" },
        { start: 1004, end: 1007, en: "which means you have a feedback loop operating in your face,", es: "lo que significa que tienes un ciclo de retroalimentación operando en tu cara," },
        { start: 1007, end: 1010, en: "but ideally if you can look at a native speaker", es: "pero idealmente si puedes mirar a un hablante nativo" },
        { start: 1010, end: 1012, en: "and just observe how they use their face,", es: "y simplemente observar cómo usa su cara," },
        { start: 1012, end: 1015, en: "let your unconscious mind absorb the rules,", es: "deja que tu mente inconsciente absorba las reglas," },
        { start: 1015, end: 1017, en: "then you're going to be able to pick it up.", es: "entonces vas a poder captarlo." },
        { start: 1017, end: 1022, en: "And if you can't get a native speaker to look at, you can use stuff like this...", es: "Y si no puedes conseguir un hablante nativo al que mirar, puedes usar cosas como esta..." },
        { start: 1022, end: 1032, en: "(Female voice) Sing, song, king, stung, hung.", es: "(Voz femenina) Sing, song, king, stung, hung." },
        { start: 1032, end: 1036, en: "(Chris Lonsdale) And the final idea here, the final action you need to take", es: "(Chris Lonsdale) Y la idea final aquí, la acción final que necesitas tomar" },
        { start: 1036, end: 1038, en: "is something that I call \"direct connect\".", es: "es algo que yo llamo \"conexión directa\"." },
        { start: 1038, end: 1041, en: "What does this mean? Well most people learning a second language", es: "¿Qué significa esto? Bueno, la mayoría de las personas que aprenden un segundo idioma" },
        { start: 1041, end: 1044, en: "sort of take the mother tongue words and the target words and go over them", es: "toman las palabras de la lengua materna y las de la lengua objetivo y las repasan" },
        { start: 1044, end: 1048, en: "again and again in their mind to try and remember them. Really inefficient.", es: "una y otra vez en su mente para tratar de recordarlas. Realmente ineficiente." },
        { start: 1048, end: 1051, en: "What you need to do is realise that", es: "Lo que necesitas hacer es darte cuenta de que" },
        { start: 1051, end: 1054, en: "everything you know is an image inside your mind, it's feelings,", es: "todo lo que sabes es una imagen dentro de tu mente, son sentimientos," },
        { start: 1054, end: 1056, en: "if you talk about fire, you can smell the smoke,", es: "si hablas de fuego, puedes oler el humo," },
        { start: 1056, end: 1059, en: "you can hear the crackling, you can see the flames,", es: "puedes escuchar el crepitar, puedes ver las llamas," },
        { start: 1059, end: 1062, en: "so what you do, is you go into that imagery and all of that memory", es: "así que lo que haces es entrar en esa imaginería y toda esa memoria" },
        { start: 1062, end: 1067, en: "and you come out with another pathway. So I call it \"same box, different path\".", es: "y sales con otro camino. Por eso lo llamo \"misma caja, camino diferente\"." },
        { start: 1067, end: 1070, en: "You come out of that pathway and you build it over time,", es: "Sales de ese camino y lo construyes con el tiempo," },
        { start: 1070, end: 1073, en: "you become more and more skilled at just connecting the new sounds", es: "te vuelves cada vez más hábil simplemente conectando los nuevos sonidos" },
        { start: 1073, end: 1078, en: "to those images that you already have, into that internal representation.", es: "a esas imágenes que ya tienes, dentro de esa representación interna." },
        { start: 1078, end: 1081, en: "And over time you even become naturally good at that process,", es: "Y con el tiempo incluso te vuelves naturalmente bueno en ese proceso," },
        { start: 1081, end: 1083, en: "that becomes unconscious.", es: "eso se vuelve inconsciente." },
        { start: 1083, end: 1088, en: "So, there are five principles that you need to work with, seven actions,", es: "Así que hay cinco principios con los que necesitas trabajar, siete acciones," },
        { start: 1088, end: 1090, en: "if you do any of them, you're going to improve.", es: "si haces cualquiera de ellas, vas a mejorar." },
        { start: 1090, end: 1094, en: "And remember these are things under your control as the learner.", es: "Y recuerda que estas son cosas bajo tu control como aprendiz." },
        { start: 1094, end: 1097, en: "Do them all and you're going to be fluent in a second language in six months.", es: "Hazlas todas y hablarás un segundo idioma con fluidez en seis meses." },
        { start: 1097, end: 1099, en: "Thank you.", es: "Gracias." },
        { start: 1099, end: 1104, en: "(Applause)", es: "(Aplausos)" }
      ]
    },
    {
      id: "v2", youtubeId: "bT86b9jF__M",
      title: "Everyday English in NYC: Real Life Conversations", channel: "Urban English", cefr: "A2", duration: "12:40",
      subtitles: [
        { start: 0, end: 6, en: "Good morning, New York! Today we are exploring Manhattan.", es: "¡Buenos días, Nueva York! Hoy estamos explorando Manhattan." },
        { start: 6, end: 14, en: "Excuse me, could you tell me where the nearest subway station is?", es: "Disculpe, ¿podría decirme dónde está la estación de metro más cercana?" },
        { start: 14, end: 23, en: "Just walk straight ahead for two blocks and turn right.", es: "Solo camina derecho por dos cuadras y gira a la derecha." },
        { start: 23, end: 33, en: "I would like to order a warm bagel with cream cheese and coffee, please.", es: "Me gustaría pedir un bagel caliente con queso crema y café, por favor." },
        { start: 33, end: 45, en: "Central Park is peaceful and beautiful during the autumn season.", es: "Central Park es pacífico y hermoso durante la temporada de otoño." }
      ]
    },
    {
      id: "v3", youtubeId: "0x2_kWRb8-A",
      title: "TED: The Secrets of Learning a New Language", channel: "Lýdia Machová | TED", cefr: "B2", duration: "10:45",
      subtitles: [
        { start: 0, end: 8, en: "Polyglots are not geniuses with a special language gene.", es: "Los políglotas no son genios con un gen especial para los idiomas." },
        { start: 8, end: 17, en: "They simply found enjoyable methods that turn study into daily joy.", es: "Simplemente encontraron métodos divertidos que convierten el estudio en una alegría diaria." },
        { start: 17, end: 27, en: "Consistency beats intensity every single time in cognitive skill acquisition.", es: "La constancia supera a la intensidad en cada ocasión al adquirir habilidades cognitivas." },
        { start: 27, end: 38, en: "Small incremental adjustments create massive compound effects over months.", es: "Pequeños ajustes graduales crean efectos compuestos enormes con los meses." }
      ]
    },
    {
      id: "v4", youtubeId: "l_wf4r7X6f0",
      title: "Mastering British Wit, Accent & Nuance", channel: "English with Lucy", cefr: "C1", duration: "14:20",
      subtitles: [
        { start: 0, end: 8, en: "Understatement is the quintessential cornerstone of British humor.", es: "La atenuación irónica es la piedra angular del humor británico." },
        { start: 8, end: 18, en: "Saying it's a bit chilly during a raging blizzard is classic deadpan wit.", es: "Decir que hace un poco de frío durante una ventisca es el clásico humor inexpresivo." },
        { start: 18, end: 29, en: "Nuance requires reading between the lines and appreciating subtle subtext.", es: "El matiz requiere leer entre líneas y apreciar el sutil subtexto." },
        { start: 29, end: 42, en: "Mastering these cultural idiosyncrasies elevates your fluency to native levels.", es: "Dominar estas idiosincrasias culturales eleva tu fluidez a niveles nativos." }
      ]
    },
    {
      id: "v5", youtubeId: "juKd26qkNAw",
      title: "English for Beginners: 100 Essential Phrases", channel: "EnglishClass101", cefr: "A1", duration: "15:00",
      subtitles: [
        { start: 0, end: 6, en: "Hello! Welcome to your very first English lesson.", es: "¡Hola! Bienvenido a tu primera lección de inglés." },
        { start: 6, end: 14, en: "Today we will learn how to greet people in English.", es: "Hoy aprenderemos cómo saludar a personas en inglés." },
        { start: 14, end: 22, en: "Hello, how are you? I am fine, thank you very much.", es: "Hola, ¿cómo estás? Estoy bien, muchas gracias." },
        { start: 22, end: 32, en: "Nice to meet you! My name is Sarah. What is your name?", es: "¡Encantada de conocerte! Me llamo Sarah. ¿Cuál es tu nombre?" }
      ]
    },
    {
      id: "v6", youtubeId: "eIho2S0ZahI",
      title: "Business English: How to Speak so People Want to Listen", channel: "Julian Treasure | TED", cefr: "B2", duration: "09:58",
      subtitles: [
        { start: 0, end: 8, en: "The human voice is the most powerful sound in the world.", es: "La voz humana es el sonido más poderoso del mundo." },
        { start: 8, end: 17, en: "I would like to draw your attention to the four cornerstones of speech.", es: "Me gustaría llamar su atención sobre los cuatro pilares fundamentales del habla." },
        { start: 17, end: 27, en: "Honesty, authenticity, integrity and love make your words resonate.", es: "La honestidad, autenticidad, integridad y amor hacen que tus palabras resuenen." },
        { start: 27, end: 38, en: "When you project with warmth, your audience listens with genuine focus.", es: "Cuando proyectas con calidez, tu audiencia escucha con atención genuina." }
      ]
    },
    {
      id: "v7", youtubeId: "c0KYU2j0TM4",
      title: "Masterclass: Creativity & Human Potential", channel: "Sir Ken Robinson | TED", cefr: "C2", duration: "19:24",
      subtitles: [
        { start: 0, end: 8, en: "Creativity now is as important in education as literacy, and we should treat it with the same status.", es: "La creatividad ahora es tan importante en la educación como la alfabetización, y deberíamos tratarla con el mismo estatus." },
        { start: 8, end: 18, en: "If you are not prepared to be wrong, you will never come up with anything original.", es: "Si no estás preparado para equivocarte, nunca se te ocurrirá nada original." },
        { start: 18, end: 29, en: "We are educating people out of their creative capacities.", es: "Estamos educando a las personas para alejarlas de sus capacidades creativas." }
      ]
    },
    {
      id: "v8", youtubeId: "wQGfQoP4mI4",
      title: "English Travel Phrases for Tourists & Daily Survival", channel: "Travel English Lab", cefr: "A2", duration: "11:30",
      subtitles: [
        { start: 0, end: 7, en: "Excuse me, can you help me? I am looking for the hotel.", es: "Disculpe, ¿puede ayudarme? Estoy buscando el hotel." },
        { start: 7, end: 15, en: "How much does this cost? Do you accept credit cards?", es: "¿Cuánto cuesta esto? ¿Aceptan tarjetas de crédito?" },
        { start: 15, end: 24, en: "Could you recommend a good restaurant nearby?", es: "¿Podría recomendarme un buen restaurante cercano?" },
        { start: 24, end: 33, en: "I would like a table for two, please. Is it available?", es: "Me gustaría una mesa para dos, por favor. ¿Está disponible?" }
      ]
    }
  ];

  // Initial Anki Deck
  const INITIAL_ANKI_DECK = [
    { id: "anki_1", front: "Hello", back: "Hola", level: "A1", phonetic: "/həˈloʊ/", example: "Hello, how are you today?", exampleEs: "Hola, ¿cómo estás hoy?", explanation: "Saludo universal.", repetitions: 2, interval: 4, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "review" },
    { id: "anki_2", front: "Airport", back: "Aeropuerto", level: "A2", phonetic: "/ˈerpɔːrt/", example: "We arrived at the airport early.", exampleEs: "Llegamos temprano al aeropuerto.", explanation: "Lugar de despegue de aviones.", repetitions: 1, interval: 1, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_3", front: "Perseverance", back: "Perseverancia", level: "B1", phonetic: "/ˌpɜːrsəˈvɪrəns/", example: "Perseverance is key to fluency.", exampleEs: "La perseverancia es clave.", explanation: "Firmeza ante dificultades.", repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_4", front: "A piece of cake", back: "Pan comido / Muy fácil", level: "B2", phonetic: "/ə piːs əv keɪk/", example: "The test was a piece of cake.", exampleEs: "El examen fue pan comido.", explanation: "Modismo: algo muy sencillo.", repetitions: 1, interval: 2, easeFactor: 2.6, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_5", front: "Nuance", back: "Matiz / Sutileza", level: "C1", phonetic: "/ˈnjuːɑːns/", example: "Native speakers use subtle nuance.", exampleEs: "Los nativos usan sutiles matices.", explanation: "Diferencia sutil en el significado.", repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_6", front: "Serendipity", back: "Serendipia", level: "C2", phonetic: "/ˌserənˈdɪpəti/", example: "Our meeting was pure serendipity.", exampleEs: "Nuestro encuentro fue pura serendipia.", explanation: "Hallazgo afortunado e inesperado.", repetitions: 3, interval: 8, easeFactor: 2.7, dueDate: new Date().toISOString().split("T")[0], state: "mastered" },
    { id: "anki_7", front: "Ubiquitous", back: "Omnipresente", level: "C1", phonetic: "/juːˈbɪkwɪtəs/", example: "Smartphones are ubiquitous.", exampleEs: "Los smartphones son omnipresentes.", explanation: "Que está en todas partes.", repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_8", front: "Break the ice", back: "Romper el hielo", level: "B2", phonetic: "/breɪk ði aɪs/", example: "He told a joke to break the ice.", exampleEs: "Contó un chiste para romper el hielo.", explanation: "Aliviar tensión social.", repetitions: 1, interval: 1, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_9", front: "Resilience", back: "Resiliencia", level: "B2", phonetic: "/rɪˈzɪliəns/", example: "Her resilience inspired everyone.", exampleEs: "Su resiliencia inspiró a todos.", explanation: "Capacidad de recuperarse de dificultades.", repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" },
    { id: "anki_10", front: "Ephemeral", back: "Efímero / Pasajero", level: "C2", phonetic: "/ɪˈfɛmərəl/", example: "Ephemeral beauty fades quickly.", exampleEs: "La belleza efímera se desvanece rápido.", explanation: "Que dura un breve instante.", repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: "learning" }
  ];

  // Master Word Bank
  const MASTER_WORDS = [
    // A1
    { word: "Hello", translation: "Hola", category: "Greetings", level: "A1", phonetic: "/həˈloʊ/", example: "Hello, how are you today?", exampleEs: "Hola, ¿cómo estás hoy?" },
    { word: "Good morning", translation: "Buenos días", category: "Greetings", level: "A1", phonetic: "/ɡʊd ˈmɔːrnɪŋ/", example: "Good morning, everyone!", exampleEs: "¡Buenos días a todos!" },
    { word: "Goodbye", translation: "Adiós", category: "Greetings", level: "A1", phonetic: "/ɡʊdˈbaɪ/", example: "Goodbye, see you tomorrow.", exampleEs: "Adiós, nos vemos mañana." },
    { word: "Please", translation: "Por favor", category: "Conversations", level: "A1", phonetic: "/pliːz/", example: "Could you help me, please?", exampleEs: "¿Podrías ayudarme, por favor?" },
    { word: "Thank you", translation: "Gracias", category: "Conversations", level: "A1", phonetic: "/θæŋk juː/", example: "Thank you for your kindness.", exampleEs: "Gracias por tu amabilidad." },
    { word: "You're welcome", translation: "De nada", category: "Conversations", level: "A1", phonetic: "/jʊr ˈwelkəm/", example: "You're welcome anytime.", exampleEs: "De nada en cualquier momento." },
    { word: "Student", translation: "Estudiante", category: "Academic", level: "A1", phonetic: "/ˈstuːdnt/", example: "She is a university student.", exampleEs: "Ella es estudiante universitaria." },
    { word: "Teacher", translation: "Profesor/a", category: "Academic", level: "A1", phonetic: "/ˈtiːtʃər/", example: "Our English teacher is very patient.", exampleEs: "Nuestro profesor de inglés es muy paciente." },
    { word: "Family", translation: "Familia", category: "Family", level: "A1", phonetic: "/ˈfæməli/", example: "I love spending time with my family.", exampleEs: "Me encanta pasar tiempo con mi familia." },
    { word: "Water", translation: "Agua", category: "Food", level: "A1", phonetic: "/ˈwɔːtər/", example: "Drink plenty of water every day.", exampleEs: "Bebe mucha agua todos los días." },
    { word: "Bread", translation: "Pan", category: "Food", level: "A1", phonetic: "/bred/", example: "I eat fresh bread for breakfast.", exampleEs: "Como pan fresco en el desayuno." },
    { word: "House", translation: "Casa", category: "Conversations", level: "A1", phonetic: "/haʊs/", example: "My house is close to the park.", exampleEs: "Mi casa está cerca del parque." },
    { word: "Book", translation: "Libro", category: "Academic", level: "A1", phonetic: "/bʊk/", example: "I am reading an interesting book.", exampleEs: "Estoy leyendo un libro interesante." },
    { word: "City", translation: "Ciudad", category: "Travel", level: "A1", phonetic: "/ˈsɪti/", example: "London is an ancient and vibrant city.", exampleEs: "Londres es una ciudad antigua y vibrante." },

    // A2
    { word: "Airport", translation: "Aeropuerto", category: "Travel", level: "A2", phonetic: "/ˈerpɔːrt/", example: "We arrived at the airport two hours early.", exampleEs: "Llegamos al aeropuerto dos horas antes." },
    { word: "Luggage", translation: "Equipaje", category: "Travel", level: "A2", phonetic: "/ˈlʌɡɪdʒ/", example: "Do not leave your luggage unattended.", exampleEs: "No dejes tu equipaje desatendido." },
    { word: "Hotel", translation: "Hotel", category: "Travel", level: "A2", phonetic: "/hoʊˈtel/", example: "The hotel offers free breakfast.", exampleEs: "El hotel ofrece desayuno gratis." },
    { word: "Restaurant", translation: "Restaurante", category: "Food", level: "A2", phonetic: "/ˈrestərənt/", example: "We booked a table at an Italian restaurant.", exampleEs: "Reservamos mesa en un restaurante italiano." },
    { word: "Delicious", translation: "Delicioso", category: "Food", level: "A2", phonetic: "/dɪˈlɪʃəs/", example: "The homemade soup was absolutely delicious.", exampleEs: "La sopa casera estaba absolutamente deliciosa." },
    { word: "Weather", translation: "Clima / Tiempo", category: "Conversations", level: "A2", phonetic: "/ˈweðər/", example: "What is the weather like today?", exampleEs: "¿Cómo está el clima hoy?" },
    { word: "Doctor", translation: "Médico / Doctor", category: "Conversations", level: "A2", phonetic: "/ˈdɑːktər/", example: "You should see a doctor for that cough.", exampleEs: "Deberías ver a un médico por esa tos." },
    { word: "Medicine", translation: "Medicina", category: "Conversations", level: "A2", phonetic: "/ˈmedɪsn/", example: "Take this medicine after meals.", exampleEs: "Toma esta medicina después de comer." },
    { word: "Weekend", translation: "Fin de semana", category: "Conversations", level: "A2", phonetic: "/ˈwiːkend/", example: "Have a wonderful relaxing weekend!", exampleEs: "¡Que tengas un maravilloso y relajante fin de semana!" },
    { word: "Shopping", translation: "Compras", category: "Conversations", level: "A2", phonetic: "/ˈʃɑːpɪŋ/", example: "We went grocery shopping on Saturday.", exampleEs: "Fuimos de compras al supermercado el sábado." },
    { word: "Neighborhood", translation: "Vecindario / Barrio", category: "Travel", level: "A2", phonetic: "/ˈneɪbərhʊd/", example: "It is a peaceful, green neighborhood.", exampleEs: "Es un barrio pacífico y verde." },

    // B1
    { word: "Perseverance", translation: "Perseverancia", category: "Academic", level: "B1", phonetic: "/ˌpɜːrsəˈvɪrəns/", example: "Perseverance is the secret to mastering English.", exampleEs: "La perseverancia es el secreto para dominar el inglés." },
    { word: "Opportunity", translation: "Oportunidad", category: "Academic", level: "B1", phonetic: "/ˌɑːpərˈtuːnəti/", example: "This internship is a great learning opportunity.", exampleEs: "Esta pasantía es una gran oportunidad de aprendizaje." },
    { word: "Decision", translation: "Decisión", category: "Academic", level: "B1", phonetic: "/dɪˈsɪʒn/", example: "Think carefully before making a major decision.", exampleEs: "Piensa bien antes de tomar una decisión importante." },
    { word: "Improvement", translation: "Mejora", category: "Academic", level: "B1", phonetic: "/ɪmˈpruːvmənt/", example: "I have noticed continuous improvement in my fluency.", exampleEs: "He notado una mejora continua en mi fluidez." },
    { word: "Confidence", translation: "Confianza / Seguridad", category: "Emotions", level: "B1", phonetic: "/ˈkɑːnfɪdəns/", example: "Speaking daily builds your speaking confidence.", exampleEs: "Hablar a diario construye tu confianza al hablar." },
    { word: "Challenge", translation: "Desafío / Reto", category: "Academic", level: "B1", phonetic: "/ˈtʃælɪndʒ/", example: "Learning grammar can be an exciting challenge.", exampleEs: "Aprender gramática puede ser un reto emocionante." },
    { word: "Goal", translation: "Meta / Objetivo", category: "Academic", level: "B1", phonetic: "/ɡoʊl/", example: "My goal is to achieve C1 level this year.", exampleEs: "Mi meta es alcanzar el nivel C1 este año." },
    { word: "Environment", translation: "Medio ambiente / Entorno", category: "Academic", level: "B1", phonetic: "/ɪnˈvaɪrənmənt/", example: "We must protect the natural environment.", exampleEs: "Debemos proteger el medio ambiente natural." },
    { word: "Technology", translation: "Tecnología", category: "Technology", level: "B1", phonetic: "/tekˈnɑːlədʒi/", example: "Modern technology connects learners worldwide.", exampleEs: "La tecnología moderna conecta a estudiantes de todo el mundo." },
    { word: "Smartphone", translation: "Teléfono inteligente", category: "Technology", level: "B1", phonetic: "/ˈsmɑːrtfoʊn/", example: "I use my smartphone to study flashcards.", exampleEs: "Uso mi smartphone para estudiar tarjetas." },

    // B2
    { word: "A piece of cake", translation: "Pan comido / Muy fácil", category: "Conversations", level: "B2", phonetic: "/ə piːs əv keɪk/", example: "The vocabulary quiz was a piece of cake.", exampleEs: "El examen de vocabulario fue pan comido." },
    { word: "Breakthrough", translation: "Avance crucial / Hallazgo", category: "Technology", level: "B2", phonetic: "/ˈbreɪkθruː/", example: "Scientists announced a breakthrough in quantum computing.", exampleEs: "Los científicos anunciaron un avance en computación cuántica." },
    { word: "Resilience", translation: "Resiliencia / Firmeza", category: "Emotions", level: "B2", phonetic: "/rɪˈzɪliəns/", example: "Emotional resilience helps overcome setbacks.", exampleEs: "La resiliencia emocional ayuda a superar tropiezos." },
    { word: "Sustainable", translation: "Sostenible", category: "Academic", level: "B2", phonetic: "/səˈsteɪnəbl/", example: "We need sustainable energy solutions.", exampleEs: "Necesitamos soluciones de energía sostenible." },
    { word: "Collaborative", translation: "Colaborativo", category: "Business", level: "B2", phonetic: "/kəˈlæbəreɪtɪv/", example: "Cross-functional collaborative teams work best.", exampleEs: "Los equipos colaborativos interdisciplinarios funcionan mejor." },
    { word: "Feasible", translation: "Factible / Viable", category: "Business", level: "B2", phonetic: "/ˈfiːzəbl/", example: "Is this deadline commercially feasible?", exampleEs: "¿Es este plazo comercialmente factible?" },
    { word: "Comprehensive", translation: "Exhaustivo / Integral", category: "Academic", level: "B2", phonetic: "/ˌkɑːmprɪˈhensɪv/", example: "We need a comprehensive review of the data.", exampleEs: "Necesitamos una revisión exhaustiva de los datos." },
    { word: "Cognitive", translation: "Cognitivo / Mental", category: "Academic", level: "B2", phonetic: "/ˈkɑːɡnətɪv/", example: "Bilingualism enhances cognitive flexibility.", exampleEs: "El bilingüismo mejora la flexibilidad cognitiva." },
    { word: "Compromise", translation: "Llegar a un acuerdo / Concesión", category: "Business", level: "B2", phonetic: "/ˈkɑːmprəmaɪz/", example: "Both parties reached a fair compromise.", exampleEs: "Ambas partes llegaron a un acuerdo justo." },
    { word: "Perspective", translation: "Perspectiva / Enfoque", category: "Academic", level: "B2", phonetic: "/pərˈspektɪv/", example: "Travel broadens your cultural perspective.", exampleEs: "Viajar amplía tu perspectiva cultural." },

    // C1
    { word: "Understatement", translation: "Atenuación irónica", category: "Academic", level: "C1", phonetic: "/ˈʌndərsteɪtmənt/", example: "To call that blizzard cold is an understatement.", exampleEs: "Llamar frío a esa ventisca es quedarse corto." },
    { word: "Nuance", translation: "Matiz / Sutileza", category: "Academic", level: "C1", phonetic: "/ˈnjuːɑːns/", example: "Native fluency requires understanding every subtle nuance.", exampleEs: "La fluidez nativa requiere entender cada sutil matiz." },
    { word: "Ubiquitous", translation: "Omnipresente / En todas partes", category: "Technology", level: "C1", phonetic: "/juːˈbɪkwɪtəs/", example: "Artificial intelligence has become ubiquitous in daily life.", exampleEs: "La inteligencia artificial se ha vuelto omnipresente en la vida diaria." },
    { word: "Flabbergasted", translation: "Atónito / Boquiabierto", category: "Emotions", level: "C1", phonetic: "/ˈflæbərɡæstɪd/", example: "I was completely flabbergasted by the surprise promotion.", exampleEs: "Quedé completamente atónito con el ascenso sorpresa." },
    { word: "Inevitable", translation: "Inevitable", category: "Academic", level: "C1", phonetic: "/ɪnˈevɪtəbl/", example: "Technological transformation is inevitable.", exampleEs: "La transformación tecnológica es inevitable." },
    { word: "Counterintuitive", translation: "Contraintuitivo", category: "Academic", level: "C1", phonetic: "/ˌkaʊntərɪnˈtuːɪtɪv/", example: "Practicing mistakes can produce counterintuitive improvements.", exampleEs: "Practicar errores puede producir mejoras contraintuitivas." },
    { word: "Quintessential", translation: "Por antonomasia / Quintaesencial", category: "Academic", level: "C1", phonetic: "/ˌkwɪntɪˈsenʃl/", example: "Afternoon tea is the quintessential British tradition.", exampleEs: "El té de la tarde es la tradición británica por excelencia." },
    { word: "Serendipity", translation: "Serendipia / Hallazgo afortunado", category: "Conversations", level: "C1", phonetic: "/ˌserənˈdɪpəti/", example: "Penicillin was discovered through pure scientific serendipity.", exampleEs: "La penicilina se descubrió por pura serendipia científica." },
    { word: "Eloquence", translation: "Elocuencia", category: "Academic", level: "C1", phonetic: "/ˈeləkwəns/", example: "The speaker persuaded the council with undeniable eloquence.", exampleEs: "El orador convenció al consejo con elocuencia innegable." },
    { word: "Paradox", translation: "Paradoja", category: "Academic", level: "C1", phonetic: "/ˈpærədɑːks/", example: "The paradox of choice makes simple decisions harder.", exampleEs: "La paradoja de la elección hace más difíciles las decisiones simples." },

    // C2
    { word: "Ephemeral", translation: "Efímero / Fugaz", category: "Academic", level: "C2", phonetic: "/ɪˈfemərəl/", example: "Fame and trends in pop culture are notoriously ephemeral.", exampleEs: "La fama y las tendencias en la cultura pop son notoriamente efímeras." },
    { word: "Cacophony", translation: "Cacofonía / Estruendo disonante", category: "Academic", level: "C2", phonetic: "/kəˈkɑːfəni/", example: "The construction site created an intolerable cacophony.", exampleEs: "La obra de construcción creó una cacofonía intolerable." },
    { word: "Mellifluous", translation: "Melifluo / Dulce y armonioso", category: "Academic", level: "C2", phonetic: "/meˈlɪfluəs/", example: "She possessed a rich, mellifluous singing voice.", exampleEs: "Ella poseía una voz para el canto rica y meliflua." },
    { word: "Pernicious", translation: "Pernicioso / Dañino sutilmente", category: "Academic", level: "C2", phonetic: "/pərˈnɪʃəs/", example: "Misinformation has a pernicious effect on democratic trust.", exampleEs: "La desinformación tiene un efecto pernicioso en la confianza democrática." },
    { word: "Surreptitious", translation: "Subrepticio / Furtivo", category: "Academic", level: "C2", phonetic: "/ˌsɜːrəpˈtɪʃəs/", example: "They made a surreptitious entrance into the building.", exampleEs: "Hicieron una entrada subrepticia en el edificio." },
    { word: "Ostentatious", translation: "Ostentoso / Presuntuoso", category: "Academic", level: "C2", phonetic: "/ˌɑːstenˈteɪʃəs/", example: "The mansion featured ostentatious gold chandeliers.", exampleEs: "La mansión contaba con ostentosas lámparas de cristal y oro." },
    { word: "Esoteric", translation: "Esotérico / Para entendidos", category: "Academic", level: "C2", phonetic: "/ˌesəˈterɪk/", example: "Quantum field theory involves highly esoteric math.", exampleEs: "La teoría cuántica de campos involucra matemáticas sumamente esotéricas." },
    { word: "Idiosyncrasy", translation: "Idiosincrasia / Particularidad", category: "Academic", level: "C2", phonetic: "/ˌɪdiəˈsɪŋkrəsi/", example: "Every dialect carries historical and cultural idiosyncrasies.", exampleEs: "Cada dialecto porta idiosincrasias históricas y culturales." },
    { word: "Juxtaposition", translation: "Yuxtaposición", category: "Academic", level: "C2", phonetic: "/ˌdʒʌkstəpəˈzɪʃn/", example: "The striking juxtaposition of ancient ruins and skyscrapers.", exampleEs: "La impactante yuxtaposición de ruinas antiguas y rascacielos." },
    { word: "Sycophant", translation: "Adulador / Servil", category: "Academic", level: "C2", phonetic: "/ˈsɪkəfænt/", example: "The dictator surrounded himself with uncritical sycophants.", exampleEs: "El dictador se rodeó de aduladores serviles sin criterio." }
  ];

  // Lessons Data
  const LESSONS_DATA = [
    { id: "lesson_a1_1", number: 1, cefr: "A1", title: "Greetings & Goodbyes", subtitle: "Saludos y despedidas (A1)", icon: "👋", description: "Aprende a presentarte, decir hola y despedirte.", category: "A1 Foundations", time: "~5 min",
      exercises: [
        { type: "multiple-choice", instruction: "Selecciona la traducción correcta:", question: "¿Cómo se dice 'Hola' en inglés?", options: ["Hello", "Goodbye", "Please", "Night"], correctAnswer: "Hello", explanation: "'Hello' es el saludo universal en inglés." },
        { type: "translate", instruction: "¿Qué significa 'Good morning'?", question: "Good morning", options: ["Buenas tardes", "Buenos días", "Buenas noches", "Hasta luego"], correctAnswer: "Buenos días", explanation: "'Good morning' se utiliza por la mañana." },
        { type: "unscramble", instruction: "Ordena las palabras:", question: "¿Cómo estás tú?", words: ["are", "you?", "How"], correctAnswer: "How are you?", explanation: "'How are you?' = '¿Cómo estás?'" },
        { type: "match-pairs", instruction: "Relaciona cada frase con su significado:", pairs: [{ left: "Goodbye", right: "Adiós" }, { left: "Please", right: "Por favor" }, { left: "Thank you", right: "Gracias" }, { left: "See you later", right: "Hasta luego" }], explanation: "Fórmulas de cortesía básicas." },
        { type: "listening", instruction: "Escucha y selecciona la frase dicha:", audioText: "Nice to meet you", options: ["Nice to meet you", "Nice to eat you", "Need to meet you", "See you again"], correctAnswer: "Nice to meet you", explanation: "'Nice to meet you' = 'Encantado de conocerte'." }
      ]
    },
    { id: "lesson_a1_2", number: 2, cefr: "A1", title: "Introducing Yourself", subtitle: "Presentaciones personales (A1)", icon: "👤", description: "Aprende a decir tu nombre, de dónde eres y tu profesión.", category: "A1 Foundations", time: "~5 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Cómo respondes a 'What is your name?'", question: "¿Cuál es la respuesta correcta?", options: ["My name is Alex", "I have fifteen", "I live in red", "Yes, please"], correctAnswer: "My name is Alex", explanation: "'My name is...' se usa para decir tu nombre." },
        { type: "unscramble", instruction: "Ordena para decir 'Soy de España':", question: "Soy de España:", words: ["from", "Spain.", "I", "am"], correctAnswer: "I am from Spain.", explanation: "'I am from...' expresa país de origen." },
        { type: "true-false", instruction: "¿Verdadero o Falso?", question: "En inglés, la edad se dice con 'I am 20 years old' usando el verbo to be.", options: ["Verdadero", "Falso"], correctAnswer: "Verdadero", explanation: "Correcto: la edad usa el verbo to be." }
      ]
    },
    { id: "lesson_a2_1", number: 3, cefr: "A2", title: "Food & Restaurants", subtitle: "Comida y pedidos (A2)", icon: "🍕", description: "Aprende a ordenar en un café y expresar preferencias culinarias.", category: "A2 Elementary", time: "~6 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Cómo pides un vaso de agua amablemente?", question: "Un vaso de agua, por favor:", options: ["A glass of water, please", "A plate of water, please", "I want glass now", "Water me fast"], correctAnswer: "A glass of water, please", explanation: "'A glass of water, please' es la forma correcta." },
        { type: "translate", instruction: "¿Qué significa 'The bill, please'?", question: "The bill, please", options: ["La cuenta, por favor", "El menú, por favor", "La servilleta, por favor", "La comida, por favor"], correctAnswer: "La cuenta, por favor", explanation: "'The bill' = la cuenta." },
        { type: "fill-blank", instruction: "Completa la frase:", sentence: "This homemade pasta is very ____.", blankWord: "delicious", options: ["delicious", "sad", "angry", "cold"], correctAnswer: "delicious", explanation: "'Delicious' describe algo exquisito." }
      ]
    },
    { id: "lesson_a2_2", number: 4, cefr: "A2", title: "Travel & Directions", subtitle: "Aeropuerto y direcciones (A2)", icon: "✈️", description: "Indicaciones para moverte en una ciudad desconocida.", category: "A2 Elementary", time: "~5 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Dónde tomas un avión?", question: "¿Dónde tomas un avión?", options: ["Airport", "Hospital", "Cinema", "Kitchen"], correctAnswer: "Airport", explanation: "'Airport' = el aeropuerto." },
        { type: "unscramble", instruction: "Ordena la pregunta para pedir direcciones:", question: "¿Dónde está la estación de metro?", words: ["is", "subway?", "Where", "the"], correctAnswer: "Where is the subway?", explanation: "'Where is the subway?' = '¿Dónde está el metro?'" }
      ]
    },
    { id: "lesson_b1_1", number: 5, cefr: "B1", title: "Careers & Workplace", subtitle: "Entorno laboral (B1)", icon: "💼", description: "Vocabulario para hablar de tu carrera y experiencia profesional.", category: "B1 Intermediate", time: "~7 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué término describe tu trayectoria profesional?", question: "Trayectoria profesional a largo plazo:", options: ["Career", "Game", "Holiday", "Ticket"], correctAnswer: "Career", explanation: "'Career' = carrera profesional." },
        { type: "fill-blank", instruction: "Completa:", sentence: "I have five years of ____ in web development.", blankWord: "experience", options: ["experience", "breakfast", "suitcase", "guitar"], correctAnswer: "experience", explanation: "'Experience' = experiencia laboral." },
        { type: "unscramble", instruction: "Ordena la frase formal:", question: "Tengo muchas ganas de trabajar contigo:", words: ["to", "I", "working", "forward", "look", "you.", "with"], correctAnswer: "I look forward to working with you.", explanation: "'Look forward to + gerundio' es clave en inglés laboral." }
      ]
    },
    { id: "lesson_b1_2", number: 6, cefr: "B1", title: "Expressing Opinions", subtitle: "Argumentación (B1)", icon: "🗣️", description: "Aprende a expresar tu punto de vista de manera convincente.", category: "B1 Intermediate", time: "~5 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Cómo expresas desacuerdo educado?", question: "Estoy en desacuerdo de manera formal:", options: ["I see your point, but I disagree", "You are wrong", "Shut up please", "Never true"], correctAnswer: "I see your point, but I disagree", explanation: "'I see your point, but...' es diplomático." },
        { type: "translate", instruction: "¿Qué significa 'In my opinion'?", question: "In my opinion", options: ["En mi opinión", "Por desgracia", "Sin duda", "Por supuesto"], correctAnswer: "En mi opinión", explanation: "'In my opinion' introduce tu perspectiva." }
      ]
    },
    { id: "lesson_b2_1", number: 7, cefr: "B2", title: "English Idioms", subtitle: "Modismos populares (B2)", icon: "🎭", description: "Entiende modismos que los nativos usan a diario.", category: "B2 Upper-Int", time: "~7 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué significa 'A piece of cake'?", question: "It's a piece of cake:", options: ["Es muy fácil", "Es delicioso", "Es costoso", "Es peligroso"], correctAnswer: "Es muy fácil", explanation: "'A piece of cake' = 'pan comido'." },
        { type: "translate", instruction: "¿Qué significa 'Break the ice'?", question: "Break the ice", options: ["Romper el hielo", "Tener frío", "Romper una promesa", "Enfriar la comida"], correctAnswer: "Romper el hielo", explanation: "Aliviar la tensión social." },
        { type: "fill-blank", instruction: "Completa el modismo:", sentence: "Don't judge a book by its ____.", blankWord: "cover", options: ["cover", "author", "price", "color"], correctAnswer: "cover", explanation: "'Don't judge a book by its cover' = las apariencias engañan." }
      ]
    },
    { id: "lesson_b2_2", number: 8, cefr: "B2", title: "Phrasal Verbs", subtitle: "Verbos compuestos (B2)", icon: "🧩", description: "Domina 'figure out', 'call off', 'bring up' y más.", category: "B2 Upper-Int", time: "~6 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué significa 'Figure out'?", question: "We need to figure out this problem:", options: ["Resolver / Descifrar", "Pintar", "Comprar", "Olvidar"], correctAnswer: "Resolver / Descifrar", explanation: "'Figure out' = entender o resolver." },
        { type: "true-false", instruction: "¿Verdadero o Falso?", question: "'Call off the meeting' significa posponer la reunión.", options: ["Verdadero", "Falso"], correctAnswer: "Falso", explanation: "'Call off' = CANCELAR. Para posponer se usa 'put off'." }
      ]
    },
    { id: "lesson_c1_1", number: 9, cefr: "C1", title: "Academic & Professional Nuance", subtitle: "Discurso avanzado (C1)", icon: "🏛️", description: "Ironía, subtexto y sutileza en debates complejos.", category: "C1 Advanced", time: "~8 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué significa 'Nuance'?", question: "Nuance:", options: ["Matiz o sutil diferencia de significado", "Ruido fuerte", "Error gramatical", "Regla estricta"], correctAnswer: "Matiz o sutil diferencia de significado", explanation: "'Nuance' es una distinción sutil." },
        { type: "translate", instruction: "¿Qué significa 'Understatement'?", question: "British Understatement", options: ["Atenuación irónica deliberada", "Declaración falsa", "Grito de guerra", "Resumen escrito"], correctAnswer: "Atenuación irónica deliberada", explanation: "Minimizar algo con intención humorística." },
        { type: "fill-blank", instruction: "Completa la inversión enfática:", sentence: "Rarely ____ I seen such an eloquent presentation.", blankWord: "have", options: ["have", "do", "did", "was"], correctAnswer: "have", explanation: "Inversión formal con adverbios negativos." }
      ]
    },
    { id: "lesson_c2_1", number: 10, cefr: "C2", title: "Literary Eloquence & Rare Idioms", subtitle: "Maestría lingüística (C2)", icon: "👑", description: "El pináculo lingüístico: vocabulario poético y precisión absoluta.", category: "C2 Mastery", time: "~10 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué describe 'Serendipity'?", question: "Serendipity:", options: ["Un hallazgo afortunado e inesperado", "Una catástrofe", "Un plan metódico", "Una coincidencia triste"], correctAnswer: "Un hallazgo afortunado e inesperado", explanation: "La serendipia es encontrar algo bello por fortuna." },
        { type: "translate", instruction: "¿Qué significa 'Ephemeral'?", question: "Ephemeral beauty", options: ["Belleza efímera y pasajera", "Belleza eterna", "Belleza artificial", "Belleza oscura"], correctAnswer: "Belleza efímera y pasajera", explanation: "'Ephemeral' dura un breve instante." }
      ]
    },
    { id: "lesson_a1_3", number: 11, cefr: "A1", title: "Numbers & Colors", subtitle: "Números y colores (A1)", icon: "🌈", description: "Aprende los números del 1 al 20 y los colores básicos.", category: "A1 Foundations", time: "~5 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Cómo se dice el número 15?", question: "15 en inglés:", options: ["Fifteen", "Fifty", "Fiveteen", "Fifth"], correctAnswer: "Fifteen", explanation: "15 = Fifteen." },
        { type: "translate", instruction: "¿Qué color es 'Blue'?", question: "Blue", options: ["Azul", "Rojo", "Verde", "Negro"], correctAnswer: "Azul", explanation: "'Blue' = azul." }
      ]
    },
    { id: "lesson_a2_3", number: 12, cefr: "A2", title: "Weather & Seasons", subtitle: "El clima y las estaciones (A2)", icon: "☀️", description: "Conversa sobre el tiempo atmosférico y las estaciones del año.", category: "A2 Elementary", time: "~5 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Cómo preguntas sobre el clima?", question: "¿Qué tiempo hace?", options: ["What's the weather like?", "What's the food like?", "How time is it?", "When is weather?"], correctAnswer: "What's the weather like?", explanation: "'What's the weather like?' = ¿Qué tiempo hace?" },
        { type: "translate", instruction: "¿Qué estación es 'Winter'?", question: "Winter", options: ["Invierno", "Verano", "Otoño", "Primavera"], correctAnswer: "Invierno", explanation: "'Winter' = invierno." }
      ]
    },
    { id: "lesson_b1_3", number: 13, cefr: "B1", title: "Technology & Social Media", subtitle: "Tecnología y redes sociales (B1)", icon: "💻", description: "Vocabulario moderno para hablar de tecnología y apps.", category: "B1 Intermediate", time: "~6 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué significa 'Upload'?", question: "Upload a photo:", options: ["Subir una foto", "Descargar una foto", "Eliminar una foto", "Editar una foto"], correctAnswer: "Subir una foto", explanation: "'Upload' = subir contenido a internet." },
        { type: "fill-blank", instruction: "Completa:", sentence: "I need to ____ my software to the latest version.", blankWord: "update", options: ["update", "delete", "print", "open"], correctAnswer: "update", explanation: "'Update' = actualizar." }
      ]
    },
    { id: "lesson_b2_3", number: 14, cefr: "B2", title: "Health & Wellbeing", subtitle: "Salud y bienestar (B2)", icon: "🏃", description: "Lenguaje para hablar de salud mental, física y bienestar.", category: "B2 Upper-Int", time: "~7 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué significa 'Resilience' en psicología?", question: "Mental resilience:", options: ["Capacidad de recuperarse de adversidades", "Fuerza física", "Velocidad mental", "Memoria fotográfica"], correctAnswer: "Capacidad de recuperarse de adversidades", explanation: "'Resilience' = resiliencia emocional." },
        { type: "translate", instruction: "¿Qué significa 'Mindfulness'?", question: "Practice mindfulness", options: ["Atención plena al momento presente", "Amnesia temporal", "Preocupación constante", "Meditación trascendental"], correctAnswer: "Atención plena al momento presente", explanation: "'Mindfulness' es una práctica de presencia mental." }
      ]
    },
    { id: "lesson_c1_2", number: 15, cefr: "C1", title: "Rhetoric & Persuasion", subtitle: "Retórica y persuasión (C1)", icon: "🎯", description: "Las herramientas del discurso persuasivo en inglés avanzado.", category: "C1 Advanced", time: "~9 min",
      exercises: [
        { type: "multiple-choice", instruction: "¿Qué es un 'Euphemism'?", question: "A euphemism is:", options: ["Una palabra suave para algo difícil o desagradable", "Un insulto disfrazado", "Un término técnico", "Una contradicción"], correctAnswer: "Una palabra suave para algo difícil o desagradable", explanation: "'Euphemism' = eufemismo: suavizar una realidad." },
        { type: "fill-blank", instruction: "Completa la metáfora retórica:", sentence: "Life is a ____, not a destination.", blankWord: "journey", options: ["journey", "race", "fight", "dream"], correctAnswer: "journey", explanation: "'Life is a journey' = metáfora clásica." }
      ]
    }
  ];

  // 50 additional CEFR lessons (modules 16-65), with two exercises each.
  const ADDITIONAL_CEFR_LESSONS =   [
    {
      "id": "lesson_extra_16",
      "number": 16,
      "cefr": "A1",
      "title": "The Alphabet & Spelling",
      "subtitle": "The Alphabet & Spelling (A1)",
      "icon": "🔤",
      "description": "Deletrear nombres y palabras frecuentes.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "How do you spell the word 'name'?",
          "options": [
            "N-A-M-E",
            "N-E-M-A",
            "N-A-M-E"
          ],
          "correctAnswer": "N-A-M-E",
          "explanation": "The letters are pronounced in this order: N, A, M, E."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "My surname is ____.",
          "options": [
            "Smith",
            "Smits",
            "Smith"
          ],
          "correctAnswer": "Smith",
          "explanation": "A common English spelling is Smith."
        }
      ]
    },
    {
      "id": "lesson_extra_17",
      "number": 17,
      "cefr": "A1",
      "title": "Numbers, Dates & Prices",
      "subtitle": "Numbers, Dates & Prices (A1)",
      "icon": "🔢",
      "description": "Usar números, fechas y precios cotidianos.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "What number is 'thirty-four'?",
          "options": [
            "34",
            "43",
            "13"
          ],
          "correctAnswer": "34",
          "explanation": "Thirty-four is written as 34."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The meeting is on the ____ of May.",
          "options": [
            "fifth",
            "five",
            "fiveth"
          ],
          "correctAnswer": "fifth",
          "explanation": "Ordinal numbers use fifth for 5th."
        }
      ]
    },
    {
      "id": "lesson_extra_18",
      "number": 18,
      "cefr": "A1",
      "title": "Family Members",
      "subtitle": "Family Members (A1)",
      "icon": "👨‍👩‍👧",
      "description": "Identificar relaciones familiares básicas.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Your mother's brother is your ____.",
          "options": [
            "uncle",
            "cousin",
            "nephew"
          ],
          "correctAnswer": "uncle",
          "explanation": "Your mother's brother is your uncle."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "My sister's son is my ____.",
          "options": [
            "nephew",
            "niece",
            "uncle"
          ],
          "correctAnswer": "nephew",
          "explanation": "A nephew is the son of your sibling."
        }
      ]
    },
    {
      "id": "lesson_extra_19",
      "number": 19,
      "cefr": "A1",
      "title": "Countries & Nationalities",
      "subtitle": "Countries & Nationalities (A1)",
      "icon": "🌍",
      "description": "Hablar del origen y la nacionalidad.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "A person from Japan is ____.",
          "options": [
            "Japanese",
            "Japanish",
            "Japanian"
          ],
          "correctAnswer": "Japanese",
          "explanation": "Japanese is both the adjective and nationality noun."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "They are from Peru. They are ____.",
          "options": [
            "Peruvian",
            "Peruish",
            "Peruer"
          ],
          "correctAnswer": "Peruvian",
          "explanation": "Peruvian describes someone from Peru."
        }
      ]
    },
    {
      "id": "lesson_extra_20",
      "number": 20,
      "cefr": "A1",
      "title": "Classroom Language",
      "subtitle": "Classroom Language (A1)",
      "icon": "📚",
      "description": "Comprender instrucciones habituales del aula.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "What does 'Open your book' mean?",
          "options": [
            "Abre tu libro",
            "Cierra tu libro",
            "Escribe tu nombre"
          ],
          "correctAnswer": "Abre tu libro",
          "explanation": "Open is the opposite of close."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Please ____ to page ten.",
          "options": [
            "turn",
            "turns",
            "turning"
          ],
          "correctAnswer": "turn",
          "explanation": "Use the base verb after please in an instruction."
        }
      ]
    },
    {
      "id": "lesson_extra_21",
      "number": 21,
      "cefr": "A1",
      "title": "Articles: A, An & The",
      "subtitle": "Articles: A, An & The (A1)",
      "icon": "📝",
      "description": "Elegir artículos para sustantivos comunes.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct phrase:",
          "options": [
            "an apple",
            "a apple",
            "the apple (for any first mention)"
          ],
          "correctAnswer": "an apple",
          "explanation": "Use an before a vowel sound."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "She has ____ blue pen.",
          "options": [
            "a",
            "an",
            "the"
          ],
          "correctAnswer": "a",
          "explanation": "Use a before the consonant sound /b/ in blue."
        }
      ]
    },
    {
      "id": "lesson_extra_22",
      "number": 22,
      "cefr": "A1",
      "title": "Plural Nouns",
      "subtitle": "Plural Nouns (A1)",
      "icon": "🧩",
      "description": "Formar plurales regulares e irregulares.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "What is the plural of 'child'?",
          "options": [
            "children",
            "childs",
            "childes"
          ],
          "correctAnswer": "children",
          "explanation": "Child has the irregular plural children."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "There are three ____ in the garden.",
          "options": [
            "boxes",
            "boxs",
            "boxies"
          ],
          "correctAnswer": "boxes",
          "explanation": "Nouns ending in -x usually take -es."
        }
      ]
    },
    {
      "id": "lesson_extra_23",
      "number": 23,
      "cefr": "A1",
      "title": "Have Got: Possessions",
      "subtitle": "Have Got: Possessions (A1)",
      "icon": "🎒",
      "description": "Describir objetos y pertenencias.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct sentence:",
          "options": [
            "She has got a bicycle.",
            "She have got a bicycle.",
            "She got have a bicycle."
          ],
          "correctAnswer": "She has got a bicycle.",
          "explanation": "Use has got with he, she and it."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "We ____ two English books.",
          "options": [
            "have got",
            "has got",
            "having got"
          ],
          "correctAnswer": "have got",
          "explanation": "Use have got with we."
        }
      ]
    },
    {
      "id": "lesson_extra_24",
      "number": 24,
      "cefr": "A1",
      "title": "There Is & There Are",
      "subtitle": "There Is & There Are (A1)",
      "icon": "🏠",
      "description": "Describir lo que existe en un lugar.",
      "category": "A1 Beginner",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct sentence:",
          "options": [
            "There are two chairs.",
            "There is two chairs.",
            "There are a chair."
          ],
          "correctAnswer": "There are two chairs.",
          "explanation": "Use there are with plural nouns."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "____ a supermarket near my house.",
          "options": [
            "There is",
            "There are",
            "It are"
          ],
          "correctAnswer": "There is",
          "explanation": "Use there is with a singular noun."
        }
      ]
    },
    {
      "id": "lesson_extra_25",
      "number": 25,
      "cefr": "A2",
      "title": "Daily Routines & Frequency",
      "subtitle": "Daily Routines & Frequency (A2)",
      "icon": "⏰",
      "description": "Expresar hábitos con adverbios de frecuencia.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which sentence places the adverb correctly?",
          "options": [
            "I usually walk to school.",
            "I walk usually to school.",
            "Usually I to school walk."
          ],
          "correctAnswer": "I usually walk to school.",
          "explanation": "Frequency adverbs usually go before the main verb."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "She ____ drinks coffee in the evening.",
          "options": [
            "rarely",
            "rare",
            "rarer"
          ],
          "correctAnswer": "rarely",
          "explanation": "Rarely is the adverb form."
        }
      ]
    },
    {
      "id": "lesson_extra_26",
      "number": 26,
      "cefr": "A2",
      "title": "Present Continuous",
      "subtitle": "Present Continuous (A2)",
      "icon": "🎨",
      "description": "Describir acciones que ocurren ahora.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct form: 'They ____ dinner now.'",
          "options": [
            "are cooking",
            "cook",
            "is cooking"
          ],
          "correctAnswer": "are cooking",
          "explanation": "Use are + verb-ing with they."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Look! The children ____ in the park.",
          "options": [
            "are playing",
            "plays",
            "is play"
          ],
          "correctAnswer": "are playing",
          "explanation": "Present continuous describes an action happening now."
        }
      ]
    },
    {
      "id": "lesson_extra_27",
      "number": 27,
      "cefr": "A2",
      "title": "Countable & Uncountable Nouns",
      "subtitle": "Countable & Uncountable Nouns (A2)",
      "icon": "🥛",
      "description": "Usar much, many, some y any.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which phrase is correct?",
          "options": [
            "much water",
            "many water",
            "a few water"
          ],
          "correctAnswer": "much water",
          "explanation": "Water is uncountable, so use much."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "How ____ apples do we need?",
          "options": [
            "many",
            "much",
            "little"
          ],
          "correctAnswer": "many",
          "explanation": "Use many with plural countable nouns."
        }
      ]
    },
    {
      "id": "lesson_extra_28",
      "number": 28,
      "cefr": "A2",
      "title": "Comparatives & Superlatives",
      "subtitle": "Comparatives & Superlatives (A2)",
      "icon": "📏",
      "description": "Comparar personas, lugares y objetos.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Complete: 'This road is ____ than that one.'",
          "options": [
            "wider",
            "widest",
            "more wide"
          ],
          "correctAnswer": "wider",
          "explanation": "Use -er with many short adjectives."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Mount Everest is the ____ mountain on Earth.",
          "options": [
            "highest",
            "higher",
            "most high"
          ],
          "correctAnswer": "highest",
          "explanation": "Use the superlative form to compare one with all others."
        }
      ]
    },
    {
      "id": "lesson_extra_29",
      "number": 29,
      "cefr": "A2",
      "title": "Past Simple: Time Expressions",
      "subtitle": "Past Simple: Time Expressions (A2)",
      "icon": "🕰️",
      "description": "Relatar actividades terminadas en el pasado.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Yesterday, we ____ a museum.",
          "options": [
            "visited",
            "visit",
            "visiting"
          ],
          "correctAnswer": "visited",
          "explanation": "Yesterday signals the past simple."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "I ____ my keys last night.",
          "options": [
            "lost",
            "lose",
            "losing"
          ],
          "correctAnswer": "lost",
          "explanation": "The past simple of lose is lost."
        }
      ]
    },
    {
      "id": "lesson_extra_30",
      "number": 30,
      "cefr": "A2",
      "title": "Be Going To: Plans",
      "subtitle": "Be Going To: Plans (A2)",
      "icon": "🗓️",
      "description": "Hablar de planes e intenciones futuras.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "We ____ visit our grandparents this weekend.",
          "options": [
            "are going to",
            "is going to",
            "going"
          ],
          "correctAnswer": "are going to",
          "explanation": "Use are going to with we."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "He is going to ____ a new language.",
          "options": [
            "learn",
            "learns",
            "learning"
          ],
          "correctAnswer": "learn",
          "explanation": "After going to, use the base form."
        }
      ]
    },
    {
      "id": "lesson_extra_31",
      "number": 31,
      "cefr": "A2",
      "title": "Asking for & Giving Directions",
      "subtitle": "Asking for & Giving Directions (A2)",
      "icon": "🧭",
      "description": "Pedir y explicar cómo llegar a un lugar.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "What does 'Turn left at the corner' mean?",
          "options": [
            "Gira a la izquierda en la esquina",
            "Sigue recto hasta la esquina",
            "Gira a la derecha en la esquina"
          ],
          "correctAnswer": "Gira a la izquierda en la esquina",
          "explanation": "Turn left gives a left-side direction."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Go ____ ahead for two blocks.",
          "options": [
            "straight",
            "straightly",
            "straightly"
          ],
          "correctAnswer": "straight",
          "explanation": "The natural expression is go straight ahead."
        }
      ]
    },
    {
      "id": "lesson_extra_32",
      "number": 32,
      "cefr": "A2",
      "title": "Can, Could & Requests",
      "subtitle": "Can, Could & Requests (A2)",
      "icon": "🙋",
      "description": "Pedir permiso y formular solicitudes corteses.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which is the most polite request?",
          "options": [
            "Could you help me, please?",
            "You help me now.",
            "Can you helping me?"
          ],
          "correctAnswer": "Could you help me, please?",
          "explanation": "Could makes a request more polite."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "____ I borrow your pen, please?",
          "options": [
            "Could",
            "Am",
            "Do"
          ],
          "correctAnswer": "Could",
          "explanation": "Could is a polite way to ask permission."
        }
      ]
    },
    {
      "id": "lesson_extra_33",
      "number": 33,
      "cefr": "A2",
      "title": "Invitations & Suggestions",
      "subtitle": "Invitations & Suggestions (A2)",
      "icon": "🎟️",
      "description": "Invitar, aceptar y rechazar cordialmente.",
      "category": "A2 Elementary",
      "time": "~6 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose a natural invitation:",
          "options": [
            "Would you like to come with us?",
            "Do you like come with us?",
            "Would you like coming us?"
          ],
          "correctAnswer": "Would you like to come with us?",
          "explanation": "Would you like to + base verb is a common invitation."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "That sounds great! I'd love to ____.",
          "options": [
            "come",
            "coming",
            "came"
          ],
          "correctAnswer": "come",
          "explanation": "After to in this expression, use the base verb."
        }
      ]
    },
    {
      "id": "lesson_extra_34",
      "number": 34,
      "cefr": "B1",
      "title": "Present Perfect Experiences",
      "subtitle": "Present Perfect Experiences (B1)",
      "icon": "🌐",
      "description": "Hablar de experiencias sin indicar cuándo ocurrieron.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "I ____ never ____ sushi.",
          "options": [
            "have / tried",
            "did / tried",
            "has / try"
          ],
          "correctAnswer": "have / tried",
          "explanation": "Present perfect uses have/has + past participle."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "She has ____ visited London.",
          "options": [
            "already",
            "yet (affirmative here)",
            "still yet"
          ],
          "correctAnswer": "already",
          "explanation": "Already commonly appears in affirmative present-perfect sentences."
        }
      ]
    },
    {
      "id": "lesson_extra_35",
      "number": 35,
      "cefr": "B1",
      "title": "Past Continuous & Interruptions",
      "subtitle": "Past Continuous & Interruptions (B1)",
      "icon": "🌧️",
      "description": "Narrar acciones en progreso interrumpidas por otra.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "I ____ when the phone rang.",
          "options": [
            "was studying",
            "studied",
            "am studying"
          ],
          "correctAnswer": "was studying",
          "explanation": "Past continuous sets the background action."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "While they were walking, it ____ to rain.",
          "options": [
            "started",
            "was start",
            "starts"
          ],
          "correctAnswer": "started",
          "explanation": "The shorter interrupting event commonly uses past simple."
        }
      ]
    },
    {
      "id": "lesson_extra_36",
      "number": 36,
      "cefr": "B1",
      "title": "First Conditional",
      "subtitle": "First Conditional (B1)",
      "icon": "🌦️",
      "description": "Expresar consecuencias reales o posibles.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "If it rains, we ____ at home.",
          "options": [
            "will stay",
            "would stayed",
            "stay will"
          ],
          "correctAnswer": "will stay",
          "explanation": "First conditional: if + present, will + base verb."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "If you study, you ____ the test.",
          "options": [
            "will pass",
            "would pass",
            "passed"
          ],
          "correctAnswer": "will pass",
          "explanation": "Use will for a likely future result."
        }
      ]
    },
    {
      "id": "lesson_extra_37",
      "number": 37,
      "cefr": "B1",
      "title": "Defining Relative Clauses",
      "subtitle": "Defining Relative Clauses (B1)",
      "icon": "🔎",
      "description": "Añadir información esencial con who, which y that.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "A mechanic is someone ____ repairs cars.",
          "options": [
            "who",
            "where",
            "whose"
          ],
          "correctAnswer": "who",
          "explanation": "Use who for people."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "This is the book ____ I told you about.",
          "options": [
            "that",
            "where",
            "who"
          ],
          "correctAnswer": "that",
          "explanation": "That can introduce a defining clause about a thing."
        }
      ]
    },
    {
      "id": "lesson_extra_38",
      "number": 38,
      "cefr": "B1",
      "title": "Common Phrasal Verbs",
      "subtitle": "Common Phrasal Verbs (B1)",
      "icon": "🔗",
      "description": "Comprender verbos compuestos de uso frecuente.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "What does 'give up' mean?",
          "options": [
            "stop trying",
            "distribute",
            "discover"
          ],
          "correctAnswer": "stop trying",
          "explanation": "Give up means to stop trying or quit."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Please ____ the lights before leaving.",
          "options": [
            "turn off",
            "turn into",
            "turn over"
          ],
          "correctAnswer": "turn off",
          "explanation": "Turn off means switch off a device or light."
        }
      ]
    },
    {
      "id": "lesson_extra_39",
      "number": 39,
      "cefr": "B1",
      "title": "Reported Speech",
      "subtitle": "Reported Speech (B1)",
      "icon": "🗣️",
      "description": "Transmitir lo que otra persona dijo.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Direct: 'I am tired.' Reported: She said she ____ tired.",
          "options": [
            "was",
            "is",
            "has"
          ],
          "correctAnswer": "was",
          "explanation": "The present form commonly shifts back to past in reported speech."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "He said that he ____ the answer.",
          "options": [
            "knew",
            "knows",
            "know"
          ],
          "correctAnswer": "knew",
          "explanation": "In reported speech, know shifts to knew in this context."
        }
      ]
    },
    {
      "id": "lesson_extra_40",
      "number": 40,
      "cefr": "B1",
      "title": "The Passive Voice",
      "subtitle": "The Passive Voice (B1)",
      "icon": "🏗️",
      "description": "Destacar la acción o el resultado en lugar del agente.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the passive sentence:",
          "options": [
            "The bridge was built in 1990.",
            "Workers built the bridge.",
            "The bridge built in 1990."
          ],
          "correctAnswer": "The bridge was built in 1990.",
          "explanation": "Passive past simple uses was/were + past participle."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "English ____ in many countries.",
          "options": [
            "is spoken",
            "speaks",
            "is speaking"
          ],
          "correctAnswer": "is spoken",
          "explanation": "Present simple passive uses is/are + past participle."
        }
      ]
    },
    {
      "id": "lesson_extra_41",
      "number": 41,
      "cefr": "B1",
      "title": "Travel Problems & Solutions",
      "subtitle": "Travel Problems & Solutions (B1)",
      "icon": "🧳",
      "description": "Explicar inconvenientes durante un viaje.",
      "category": "B1 Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Your flight leaves later than planned. It is ____.",
          "options": [
            "delayed",
            "cancelled forever",
            "boarded"
          ],
          "correctAnswer": "delayed",
          "explanation": "A delayed flight departs later than scheduled."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "We missed the train because we arrived ____.",
          "options": [
            "late",
            "lately",
            "latest"
          ],
          "correctAnswer": "late",
          "explanation": "Late describes arriving after the expected time."
        }
      ]
    },
    {
      "id": "lesson_extra_42",
      "number": 42,
      "cefr": "B2",
      "title": "Second & Third Conditionals",
      "subtitle": "Second & Third Conditionals (B2)",
      "icon": "🧠",
      "description": "Distinguir situaciones hipotéticas presentes y pasadas.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "If I had more time, I ____ another course.",
          "options": [
            "would take",
            "will take",
            "would have taken"
          ],
          "correctAnswer": "would take",
          "explanation": "Second conditional: if + past, would + base verb."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "If she had left earlier, she ____ the bus.",
          "options": [
            "would have caught",
            "would catch",
            "will catch"
          ],
          "correctAnswer": "would have caught",
          "explanation": "Third conditional describes an unreal past result."
        }
      ]
    },
    {
      "id": "lesson_extra_43",
      "number": 43,
      "cefr": "B2",
      "title": "Gerunds & Infinitives",
      "subtitle": "Gerunds & Infinitives (B2)",
      "icon": "✍️",
      "description": "Reconocer patrones verbales con gerundio e infinitivo.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "I enjoy ____ historical novels.",
          "options": [
            "reading",
            "to read",
            "read"
          ],
          "correctAnswer": "reading",
          "explanation": "Enjoy is followed by a gerund."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "They decided ____ the project next week.",
          "options": [
            "to postpone",
            "postponing",
            "postpone"
          ],
          "correctAnswer": "to postpone",
          "explanation": "Decide is normally followed by an infinitive."
        }
      ]
    },
    {
      "id": "lesson_extra_44",
      "number": 44,
      "cefr": "B2",
      "title": "Modals of Deduction",
      "subtitle": "Modals of Deduction (B2)",
      "icon": "🕵️",
      "description": "Deducir posibilidades y certezas con modales.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "The lights are off and nobody answers. They ____ be out.",
          "options": [
            "might",
            "mustn't",
            "can't to"
          ],
          "correctAnswer": "might",
          "explanation": "Might expresses a possible explanation."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "She has worked all day; she ____ be exhausted.",
          "options": [
            "must",
            "can't",
            "shouldn't"
          ],
          "correctAnswer": "must",
          "explanation": "Must expresses a strong logical deduction."
        }
      ]
    },
    {
      "id": "lesson_extra_45",
      "number": 45,
      "cefr": "B2",
      "title": "Contrast & Concession Linkers",
      "subtitle": "Contrast & Concession Linkers (B2)",
      "icon": "⚖️",
      "description": "Conectar ideas contrastantes con precisión.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "____ the heavy rain, the event continued.",
          "options": [
            "Despite",
            "Although of",
            "However of"
          ],
          "correctAnswer": "Despite",
          "explanation": "Despite is followed by a noun phrase."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "____ it was expensive, they bought it.",
          "options": [
            "Although",
            "Despite",
            "In spite"
          ],
          "correctAnswer": "Although",
          "explanation": "Although introduces a clause with subject and verb."
        }
      ]
    },
    {
      "id": "lesson_extra_46",
      "number": 46,
      "cefr": "B2",
      "title": "Collocations for Work & Study",
      "subtitle": "Collocations for Work & Study (B2)",
      "icon": "💼",
      "description": "Ampliar combinaciones léxicas naturales.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which collocation is correct?",
          "options": [
            "make a decision",
            "do a decision",
            "take a homework"
          ],
          "correctAnswer": "make a decision",
          "explanation": "Make a decision is the standard collocation."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Students must ____ research before writing the report.",
          "options": [
            "conduct",
            "make up",
            "do out"
          ],
          "correctAnswer": "conduct",
          "explanation": "Conduct research is a natural academic collocation."
        }
      ]
    },
    {
      "id": "lesson_extra_47",
      "number": 47,
      "cefr": "B2",
      "title": "Formal Emails & Register",
      "subtitle": "Formal Emails & Register (B2)",
      "icon": "📨",
      "description": "Redactar solicitudes con un registro formal.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which opening is most appropriate for a formal email?",
          "options": [
            "Dear Ms Patel,",
            "Hey Patel!",
            "What's up, Patel?"
          ],
          "correctAnswer": "Dear Ms Patel,",
          "explanation": "Dear + title and surname is a conventional formal opening."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "I am writing to ____ about the internship.",
          "options": [
            "enquire",
            "ask to",
            "questioning"
          ],
          "correctAnswer": "enquire",
          "explanation": "Enquire about is a formal way to request information."
        }
      ]
    },
    {
      "id": "lesson_extra_48",
      "number": 48,
      "cefr": "B2",
      "title": "Reporting Verbs & Passive Structures",
      "subtitle": "Reporting Verbs & Passive Structures (B2)",
      "icon": "📰",
      "description": "Usar estructuras impersonales para informar hallazgos.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct structure: 'The report ____ to be accurate.'",
          "options": [
            "is believed",
            "believes",
            "is believing"
          ],
          "correctAnswer": "is believed",
          "explanation": "It is believed + infinitive is an impersonal reporting structure."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The company is said ____ its policy.",
          "options": [
            "to have changed",
            "changing",
            "that changed"
          ],
          "correctAnswer": "to have changed",
          "explanation": "Is said to have changed reports an earlier action."
        }
      ]
    },
    {
      "id": "lesson_extra_49",
      "number": 49,
      "cefr": "B2",
      "title": "Environmental Arguments",
      "subtitle": "Environmental Arguments (B2)",
      "icon": "🌱",
      "description": "Expresar causas, consecuencias y propuestas ambientales.",
      "category": "B2 Upper-Intermediate",
      "time": "~7 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which phrase introduces a consequence?",
          "options": [
            "As a result",
            "In contrast to",
            "For instance of"
          ],
          "correctAnswer": "As a result",
          "explanation": "As a result signals a consequence."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Governments should invest ____ renewable energy.",
          "options": [
            "in",
            "on",
            "at"
          ],
          "correctAnswer": "in",
          "explanation": "The standard collocation is invest in."
        }
      ]
    },
    {
      "id": "lesson_extra_50",
      "number": 50,
      "cefr": "C1",
      "title": "Inversion for Emphasis",
      "subtitle": "Inversion for Emphasis (C1)",
      "icon": "🎓",
      "description": "Emplear inversión para enfatizar ideas formales.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct inversion: 'Never ____ such a complex case.'",
          "options": [
            "have I seen",
            "I have seen",
            "I saw have"
          ],
          "correctAnswer": "have I seen",
          "explanation": "Negative adverbials at the start trigger subject-auxiliary inversion."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Rarely ____ the committee reach a unanimous decision.",
          "options": [
            "does",
            "do",
            "is"
          ],
          "correctAnswer": "does",
          "explanation": "With the singular subject committee, use does."
        }
      ]
    },
    {
      "id": "lesson_extra_51",
      "number": 51,
      "cefr": "C1",
      "title": "Cleft Sentences",
      "subtitle": "Cleft Sentences (C1)",
      "icon": "💡",
      "description": "Enfatizar información mediante estructuras escindidas.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the cleft sentence emphasizing 'the timing':",
          "options": [
            "What matters is the timing.",
            "The timing what matters.",
            "It matter the timing."
          ],
          "correctAnswer": "What matters is the timing.",
          "explanation": "What-clause clefts focus attention on a specific element."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "It was Maria ____ identified the error.",
          "options": [
            "who",
            "which",
            "where"
          ],
          "correctAnswer": "who",
          "explanation": "Use who when emphasizing a person."
        }
      ]
    },
    {
      "id": "lesson_extra_52",
      "number": 52,
      "cefr": "C1",
      "title": "Hedging & Academic Caution",
      "subtitle": "Hedging & Academic Caution (C1)",
      "icon": "🔬",
      "description": "Matizar afirmaciones y evitar generalizaciones absolutas.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which phrase expresses cautious interpretation?",
          "options": [
            "The findings may suggest that...",
            "This proves beyond any doubt that...",
            "Everyone knows that..."
          ],
          "correctAnswer": "The findings may suggest that...",
          "explanation": "May suggest signals a tentative interpretation."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The results appear ____ a modest improvement.",
          "options": [
            "to indicate",
            "indicating to",
            "indicated"
          ],
          "correctAnswer": "to indicate",
          "explanation": "Appear can be followed by a to-infinitive."
        }
      ]
    },
    {
      "id": "lesson_extra_53",
      "number": 53,
      "cefr": "C1",
      "title": "Nominalisation in Academic English",
      "subtitle": "Nominalisation in Academic English (C1)",
      "icon": "📖",
      "description": "Convertir verbos y adjetivos en sustantivos formales.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the nominal form of 'analyse'.",
          "options": [
            "analysis",
            "analytical",
            "analysing"
          ],
          "correctAnswer": "analysis",
          "explanation": "Analysis is the noun form of analyse."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The rapid ____ of the sector changed the market.",
          "options": [
            "expansion",
            "expand",
            "expansive"
          ],
          "correctAnswer": "expansion",
          "explanation": "Expansion is the noun corresponding to expand."
        }
      ]
    },
    {
      "id": "lesson_extra_54",
      "number": 54,
      "cefr": "C1",
      "title": "Advanced Discourse Markers",
      "subtitle": "Advanced Discourse Markers (C1)",
      "icon": "🧵",
      "description": "Organizar argumentos complejos con conectores precisos.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which connector introduces a qualification?",
          "options": [
            "Admittedly",
            "Consequently",
            "Likewise"
          ],
          "correctAnswer": "Admittedly",
          "explanation": "Admittedly concedes a point before qualifying an argument."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The proposal is costly; ____ , it could save time.",
          "options": [
            "nevertheless",
            "therefore",
            "for example"
          ],
          "correctAnswer": "nevertheless",
          "explanation": "Nevertheless introduces contrast with the preceding point."
        }
      ]
    },
    {
      "id": "lesson_extra_55",
      "number": 55,
      "cefr": "C1",
      "title": "Register & Nuance",
      "subtitle": "Register & Nuance (C1)",
      "icon": "🎭",
      "description": "Adaptar el lenguaje al contexto y al interlocutor.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which phrase is most suitable in a formal report?",
          "options": [
            "The evidence indicates a decline.",
            "Things got pretty bad.",
            "It's a total mess."
          ],
          "correctAnswer": "The evidence indicates a decline.",
          "explanation": "The first option uses precise, formal wording."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "We would appreciate your ____ response.",
          "options": [
            "prompt",
            "quickly",
            "hurry"
          ],
          "correctAnswer": "prompt",
          "explanation": "Prompt is an appropriate formal adjective meaning timely."
        }
      ]
    },
    {
      "id": "lesson_extra_56",
      "number": 56,
      "cefr": "C1",
      "title": "Mixed Conditionals",
      "subtitle": "Mixed Conditionals (C1)",
      "icon": "🔀",
      "description": "Relacionar condiciones pasadas con resultados presentes.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "If I had accepted the offer, I ____ in Madrid now.",
          "options": [
            "would be living",
            "will live",
            "would have lived"
          ],
          "correctAnswer": "would be living",
          "explanation": "A past condition can have a present result in a mixed conditional."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "If he were more organised, he ____ the deadline yesterday.",
          "options": [
            "would have met",
            "will meet",
            "would meet"
          ],
          "correctAnswer": "would have met",
          "explanation": "Present condition + past result uses would have + participle."
        }
      ]
    },
    {
      "id": "lesson_extra_57",
      "number": 57,
      "cefr": "C1",
      "title": "Paraphrasing & Synthesis",
      "subtitle": "Paraphrasing & Synthesis (C1)",
      "icon": "📝",
      "description": "Reformular ideas sin alterar su significado esencial.",
      "category": "C1 Advanced",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which option best paraphrases 'The results were inconclusive'?",
          "options": [
            "The findings did not lead to a definite conclusion.",
            "The results were completely wrong.",
            "The research was never completed."
          ],
          "correctAnswer": "The findings did not lead to a definite conclusion.",
          "explanation": "Inconclusive means not producing a definite answer."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The study ____ that further research is necessary.",
          "options": [
            "suggests",
            "suggestion",
            "suggested to"
          ],
          "correctAnswer": "suggests",
          "explanation": "Suggests introduces the study's implication."
        }
      ]
    },
    {
      "id": "lesson_extra_58",
      "number": 58,
      "cefr": "C2",
      "title": "Idiomatic Meaning in Context",
      "subtitle": "Idiomatic Meaning in Context (C2)",
      "icon": "🗝️",
      "description": "Interpretar expresiones idiomáticas según su contexto.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "If a plan is 'up in the air', it is ____.",
          "options": [
            "undecided",
            "very successful",
            "already finished"
          ],
          "correctAnswer": "undecided",
          "explanation": "Up in the air means unsettled or undecided."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The negotiations are still ____; no agreement has been reached.",
          "options": [
            "up in the air",
            "under the weather",
            "over the moon"
          ],
          "correctAnswer": "up in the air",
          "explanation": "Up in the air describes an unresolved situation."
        }
      ]
    },
    {
      "id": "lesson_extra_59",
      "number": 59,
      "cefr": "C2",
      "title": "Connotation & Lexical Choice",
      "subtitle": "Connotation & Lexical Choice (C2)",
      "icon": "🎨",
      "description": "Distinguir matices valorativos entre palabras cercanas.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which adjective has the most negative connotation?",
          "options": [
            "meddlesome",
            "curious",
            "inquisitive"
          ],
          "correctAnswer": "meddlesome",
          "explanation": "Meddlesome suggests unwanted interference."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "His ____ remarks made the discussion unnecessarily hostile.",
          "options": [
            "inflammatory",
            "insightful",
            "measured"
          ],
          "correctAnswer": "inflammatory",
          "explanation": "Inflammatory language is likely to provoke anger."
        }
      ]
    },
    {
      "id": "lesson_extra_60",
      "number": 60,
      "cefr": "C2",
      "title": "Concessive Structures",
      "subtitle": "Concessive Structures (C2)",
      "icon": "🧩",
      "description": "Construir concesiones complejas con estructuras avanzadas.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the correct structure: 'Much as I ____ the proposal, I cannot support it.'",
          "options": [
            "admire",
            "am admire",
            "admiring"
          ],
          "correctAnswer": "admire",
          "explanation": "Much as introduces a strong concession followed by a clause."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Try as she ____, she could not reproduce the result.",
          "options": [
            "might",
            "may to",
            "does"
          ],
          "correctAnswer": "might",
          "explanation": "Try as she might is a fixed concessive construction."
        }
      ]
    },
    {
      "id": "lesson_extra_61",
      "number": 61,
      "cefr": "C2",
      "title": "Ellipsis & Substitution",
      "subtitle": "Ellipsis & Substitution (C2)",
      "icon": "✂️",
      "description": "Evitar repeticiones mediante elipsis y sustitución.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Choose the natural response: 'I thought the lecture was useful.' 'So ____ I.'",
          "options": [
            "did",
            "was",
            "have"
          ],
          "correctAnswer": "did",
          "explanation": "So did I agrees with a past-simple statement."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "She can speak French, and her brother can ____ .",
          "options": [
            "too",
            "also to",
            "either"
          ],
          "correctAnswer": "too",
          "explanation": "Can is retained as an auxiliary in this elliptical response."
        }
      ]
    },
    {
      "id": "lesson_extra_62",
      "number": 62,
      "cefr": "C2",
      "title": "Rhetorical Devices & Effect",
      "subtitle": "Rhetorical Devices & Effect (C2)",
      "icon": "🎙️",
      "description": "Analizar recursos retóricos y sus efectos discursivos.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "A question asked to make a point rather than obtain an answer is ____.",
          "options": [
            "rhetorical",
            "hypothetical",
            "indirect"
          ],
          "correctAnswer": "rhetorical",
          "explanation": "A rhetorical question is designed to persuade or emphasize."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The repeated opening phrase is an example of ____.",
          "options": [
            "anaphora",
            "irony",
            "understatement"
          ],
          "correctAnswer": "anaphora",
          "explanation": "Anaphora repeats a word or phrase at the beginning of clauses."
        }
      ]
    },
    {
      "id": "lesson_extra_63",
      "number": 63,
      "cefr": "C2",
      "title": "Precision & Near-Synonyms",
      "subtitle": "Precision & Near-Synonyms (C2)",
      "icon": "🔍",
      "description": "Elegir vocabulario preciso entre términos próximos.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which verb means to deliberately make something seem less important?",
          "options": [
            "downplay",
            "undermine",
            "overstate"
          ],
          "correctAnswer": "downplay",
          "explanation": "Downplay means to present something as less significant."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "The spokesperson tried to ____ the scale of the disruption.",
          "options": [
            "downplay",
            "overwhelm",
            "overlook"
          ],
          "correctAnswer": "downplay",
          "explanation": "Downplay accurately describes minimising perceived importance."
        }
      ]
    },
    {
      "id": "lesson_extra_64",
      "number": 64,
      "cefr": "C2",
      "title": "Ambiguity & Sentence Interpretation",
      "subtitle": "Ambiguity & Sentence Interpretation (C2)",
      "icon": "🧠",
      "description": "Reconocer ambigüedades sintácticas y resolverlas por contexto.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "The sentence 'I saw the man with the telescope' is ambiguous because ____.",
          "options": [
            "the phrase can describe who had the telescope",
            "the verb has no object",
            "the tense is unclear"
          ],
          "correctAnswer": "the phrase can describe who had the telescope",
          "explanation": "The prepositional phrase can attach to the observer or the man."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "To remove ambiguity, write: 'Using a telescope, I saw the man ____.'",
          "options": [
            "across the street",
            "with the telescope",
            "who had one"
          ],
          "correctAnswer": "across the street",
          "explanation": "The revised phrase makes clear that the observer used the telescope."
        }
      ]
    },
    {
      "id": "lesson_extra_65",
      "number": 65,
      "cefr": "C2",
      "title": "Stylistic Register & Subtlety",
      "subtitle": "Stylistic Register & Subtlety (C2)",
      "icon": "🖋️",
      "description": "Ajustar el tono y la elección léxica a contextos exigentes.",
      "category": "C2 Proficiency",
      "time": "~9 min",
      "exercises": [
        {
          "type": "multiple-choice",
          "instruction": "Selecciona la respuesta correcta:",
          "question": "Which expression is the most diplomatically critical?",
          "options": [
            "The approach may benefit from further refinement.",
            "The approach is ridiculous.",
            "The approach is completely useless."
          ],
          "correctAnswer": "The approach may benefit from further refinement.",
          "explanation": "The first option communicates criticism tactfully."
        },
        {
          "type": "fill-blank",
          "instruction": "Completa la oración:",
          "sentence": "Her response was deliberately ____ to avoid making a firm commitment.",
          "options": [
            "equivocal",
            "unequivocal",
            "explicit"
          ],
          "correctAnswer": "equivocal",
          "explanation": "Equivocal means ambiguous or open to more than one interpretation."
        }
      ]
    }
  ];
  LESSONS_DATA.push(...ADDITIONAL_CEFR_LESSONS);


  // Grammar Data
  // ========================================================================
// COMPENDIO MAESTRO DE GRAMATICA INGLESA A1 A C1 (48 UNIDADES COMPLETAS)
// Basado en el libro resumido 'Domina la gramatica inglesa'
// ========================================================================
const GRAMMAR_DATA = [
  {
    "id": "a1_phonetics",
    "level": "A1",
    "levelNum": 1,
    "title": "1. Fonética y Pronunciación del Inglés",
    "icon": "🗣️",
    "summary": "Estudio del sonido de las palabras: vocales, schwa /ə/, acentuación de sílabas y ritmo.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El inglés escribe de una forma y pronuncia de otra. Aprender fonética desde el inicio evita errores fosilizados y mejora la comprensión auditiva y fluidez.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🔤 IPA / AFI (Alfabeto Fonético Internacional)</h4>\n          <p>Cada sonido tiene un símbolo único y la transcripción se escribe entre barras <code>/.../</code>. Conviene fijarse en diccionarios prestigiosos como Cambridge u Oxford.</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🔊 Las Vocales del Inglés (12 Sonidos vs 5 en Español)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tipo</th><th>Descripción</th><th>Ejemplos Clave</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Vocales Cortas</strong></td><td>Sílabas cerradas y breves; sonido seco y relajado.</td><td><code>/ɪ/</code> (ship), <code>/æ/</code> (cat), <code>/ʊ/</code> (book), <code>/e/</code> (bed)</td></tr>\n              <tr><td><strong>Vocales Largas</strong></td><td>Mayor duración y timbre tenso (marcadas con <code>ː</code>).</td><td><code>/iː/</code> (sheep), <code>/ɑː/</code> (car), <code>/uː/</code> (moon), <code>/ɔː/</code> (door)</td></tr>\n              <tr><td><strong>Diptongos</strong></td><td>Dos vocales en una sola sílaba con deslizamiento suave.</td><td><code>/eɪ/</code> (day), <code>/aɪ/</code> (my), <code>/oʊ/</code> (go), <code>/aʊ/</code> (now)</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 El Sonido Schwa /ə/ (El más frecuente del idioma)</h4>\n          <p>Es una vocal neutra, corta y totalmente relajada, propia de las sílabas no acentuadas. Dominarlo evita sonar robótico o exagerado.</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <strong>about</strong> <code>/əˈbaʊt/</code> — La primera 'a' es schwa, no una 'a' española abierta.</div>\n            <div class=\"grammar-example-item\">🔊 <strong>banana</strong> <code>/bəˈnænə/</code> — Solo la sílaba del medio 'na' es fuerte; la primera y la última son schwa.</div>\n            <div class=\"grammar-example-item\">🔊 <strong>teacher</strong> <code>/ˈtiːtʃər/</code> — La terminación '-er' se debilita a schwa.</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ Acentuación, Ritmo y Entonación</h4>\n          <p>En cada palabra, una sola sílaba (<em>stressed syllable</em>) suena más fuerte y con mayor duración; las demás se debilitan o reducen a schwa. Se marca con el signo <code>ˈ</code> antes de la sílaba fuerte.</p>\n          <ul>\n            <li><strong>Acentuación por compás:</strong> En inglés se alternan sílabas fuertes y débiles, a diferencia del español donde todas las sílabas duran casi lo mismo.</li>\n            <li><strong>Entonación:</strong> Las subidas y bajadas de tono expresan emoción, distinguen preguntas de afirmaciones y marcan continuidad.</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes de pronunciación en A1</h5>\n          <p>❌ <em>Pronunciar todas las letras como en español</em> (ej: decir \"poh-lee-say\" para <strong>police</strong> <code>/pəˈliːs/</code>).</p>\n          <p>❌ <em>No distinguir vocales cortas de largas</em>: confundir <strong>ship</strong> <code>/ʃɪp/</code> (barco) con <strong>sheep</strong> <code>/ʃiːp/</code> (oveja), o <strong>bitch</strong> con <strong>beach</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es el sonido vocálico más frecuente en el idioma inglés?",
        "opts": [
          "El sonido Schwa /ə/ en sílabas átonas",
          "La vocal larga /i:/",
          "El diptongo /aɪ/"
        ],
        "a": "El sonido Schwa /ə/ en sílabas átonas",
        "exp": "El Schwa /ə/ es la vocal neutra más común y aparece en casi todas las sílabas débiles no acentuadas."
      },
      {
        "q": "¿Qué par mínimo se diferencia únicamente por vocal corta vs vocal larga?",
        "opts": [
          "ship / sheep",
          "cat / dog",
          "run / fast"
        ],
        "a": "ship / sheep",
        "exp": "'ship' lleva vocal corta /ɪ/, mientras que 'sheep' lleva vocal larga /iː/."
      },
      {
        "q": "En la palabra 'banana' /bəˈnænə/, ¿cuántos sonidos schwa hay?",
        "opts": [
          "2 (la primera y última vocal)",
          "1 (solo la del centro)",
          "0"
        ],
        "a": "2 (la primera y última vocal)",
        "exp": "Tanto la primera 'a' como la última 'a' son átonas y se pronuncian /ə/."
      }
    ]
  },
  {
    "id": "a1_nouns",
    "level": "A1",
    "levelNum": 1,
    "title": "2.1 Sustantivos (Nouns) y Plurales",
    "icon": "📦",
    "summary": "Tipos de sustantivos, plurales regulares, irregulares, invariables y casos especiales.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Los sustantivos nombran personas, lugares, cosas o ideas. Su clasificación entre contables e incontables determina qué artículos y verbos se emplean.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🏷️ Clasificación de Sustantivos</h4>\n          <ul>\n            <li><strong>Comunes:</strong> <em>table, book, city</em>.</li>\n            <li><strong>Propios:</strong> Siempre con mayúscula inicial: <em>London, Maria, Spain</em>.</li>\n            <li><strong>Contables:</strong> Se pueden contar y tienen plural: <em>apple → two apples</em>.</li>\n            <li><strong>Incontables:</strong> No se pueden contar individualmente: <em>water, music, information, advice, money</em>. No llevan 'a/an' ni pluralizan con '-s'.</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📐 Reglas de Plural Regular</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Terminación del Singular</th><th>Regla</th><th>Ejemplos</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>Mayoría de sustantivos</td><td>Añadir <strong>+s</strong></td><td>car → cars, book → books</td></tr>\n              <tr><td>Terminados en -s, -sh, -ch, -x, -o</td><td>Añadir <strong>+es</strong></td><td>bus → buses, watch → watches, box → boxes, tomato → tomatoes</td></tr>\n              <tr><td>Consonante + y</td><td>Cambiar a <strong>-ies</strong></td><td>city → cities, baby → babies</td></tr>\n              <tr><td>Vocal + y</td><td>Solo <strong>+s</strong></td><td>boy → boys, day → days</td></tr>\n              <tr><td>Terminados en -f / -fe</td><td>Cambian a <strong>-ves</strong></td><td>knife → knives, leaf → leaves, wife → wives</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ Plurales Irregulares e Invariables (Memorizar)</h4>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\"><strong>man → men</strong> | <strong>woman → women</strong> | <strong>child → children</strong></div>\n            <div class=\"grammar-example-item\"><strong>person → people</strong> | <strong>foot → feet</strong> | <strong>tooth → teeth</strong> | <strong>mouse → mice</strong></div>\n            <div class=\"grammar-example-item\"><strong>Invariables (singular = plural):</strong> sheep → sheep, fish → fish, deer → deer, species → species</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>✨ Casos Especiales Clave</h4>\n          <ul>\n            <li><strong>Solo plural (herramientas/prendas dobles):</strong> <em>jeans, trousers, scissors, glasses</em>. Para una unidad se usa: <em>a pair of scissors / a pair of jeans</em>.</li>\n            <li><strong>Terminan en -s pero son singulares:</strong> materias y conceptos (<em>maths, physics, news</em>) → el verbo siempre va en singular (<em>The news is good</em>).</li>\n            <li><strong>Cambio de significado en plural:</strong> <em>glass</em> (vaso / cristal) vs <em>glasses</em> (gafas).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con sustantivos</h5>\n          <p>❌ <em>Pluralizar incontables:</em> \"informations\" ➔ ✅ <strong>information</strong> o <em>pieces of information</em>.</p>\n          <p>❌ <em>Decir \"peoples\" para personas:</em> \"three peoples\" ➔ ✅ <strong>three people</strong>.</p>\n          <p>❌ <em>Verbo en plural con news:</em> \"The news are bad\" ➔ ✅ <strong>The news is bad</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es el plural correcto de 'child'?",
        "opts": [
          "children",
          "childs",
          "childrens"
        ],
        "a": "children",
        "exp": "'child' tiene plural irregular: 'children'. Nunca se le añade '-s'."
      },
      {
        "q": "¿Cómo se dice correctamente 'tres tijeras'?",
        "opts": [
          "three pairs of scissors",
          "three scissors",
          "three scissores"
        ],
        "a": "three pairs of scissors",
        "exp": "'scissors' es un sustantivo solo plural; para contarlo se usa la unidad 'pair of'."
      },
      {
        "q": "¿Qué oración es gramaticalmente correcta con 'news'?",
        "opts": [
          "The news is interesting.",
          "The news are interesting.",
          "These news is interesting."
        ],
        "a": "The news is interesting.",
        "exp": "'news' es incontable y singular en inglés, por lo que rige verbo en singular 'is'."
      }
    ]
  },
  {
    "id": "a1_articles",
    "level": "A1",
    "levelNum": 1,
    "title": "2.2 Artículos: The, A / An y Zero Article",
    "icon": "📰",
    "summary": "Uso del artículo definido 'the', indefinido 'a/an' según sonido, y cuándo omitir el artículo.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En inglés los artículos no tienen género (femenino/masculino) ni número (singular/plural), pero cambian radicalmente el significado del enunciado.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🌟 The (Artículo Definido)</h4>\n          <p>Se usa para algo específico, conocido por el hablante y oyente, o ya mencionado previamente. Es invariable y funciona con contables e incontables.</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The book on the desk is mine.</em> (Un libro concreto que ambos identificamos).</div>\n            <div class=\"grammar-example-item\">🔊 <em>Turn off the lights, please.</em> (Las luces de esta habitación específica).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🅰️ A / An (Artículo Indefinido)</h4>\n          <p>Menciona algo por primera vez, algo general o una unidad inespecífica. <strong>Regla de oro: depende del SONIDO inicial, no de la letra escrita:</strong></p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Artículo</th><th>Sonido Inicial</th><th>Ejemplos Explicados</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>A</strong></td><td>Sonido consonántico</td><td><em>a cat, a book, a university</em> (suena /juː/), <em>a European country</em> (suena /j/)</td></tr>\n              <tr><td><strong>An</strong></td><td>Sonido vocálico</td><td><em>an apple, an hour</em> (la 'h' es muda: /ˈaʊər/), <em>an honest man</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🚫 Zero Article (Sin Artículo)</h4>\n          <p>En inglés <strong>NO se pone artículo</strong> en los siguientes casos:</p>\n          <ul>\n            <li><strong>Incontables en sentido general:</strong> <em>Water is essential for life.</em> (No 'The water...').</li>\n            <li><strong>Plurales en general:</strong> <em>Cats are independent animals.</em> (Todos los gatos en general).</li>\n            <li><strong>Nombres propios, ciudades y países:</strong> <em>Paris, Spain, John</em>.</li>\n            <li><strong>Días, meses e idiomas:</strong> <em>We meet on Monday; She speaks Spanish; In July</em>.</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con artículos</h5>\n          <p>❌ <em>Poner 'an' ante 'university':</em> \"an university\" ➔ ✅ <strong>a university</strong> (empieza con semivocal consonántica /j/).</p>\n          <p>❌ <em>Poner 'the' al hablar en general:</em> \"The life is beautiful\" ➔ ✅ <strong>Life is beautiful</strong>.</p>\n          <p>❌ <em>Poner 'a' ante 'hour':</em> \"a hour\" ➔ ✅ <strong>an hour</strong> (la 'h' es muda).</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué artículo debe colocarse en: 'She is studying at ____ European university'?",
        "opts": [
          "a",
          "an",
          "the"
        ],
        "a": "a",
        "exp": "'European' comienza con sonido consonántico /j/, por lo que exige el artículo 'a'."
      },
      {
        "q": "¿Cuál es la frase correcta para hablar de los perros en general?",
        "opts": [
          "Dogs make great companions.",
          "The dogs make great companions.",
          "A dogs make great companions."
        ],
        "a": "Dogs make great companions.",
        "exp": "Para plurales en sentido general no se utiliza artículo ('zero article')."
      },
      {
        "q": "Completa: 'He will arrive in ____ hour.'",
        "opts": [
          "an",
          "a",
          "the"
        ],
        "a": "an",
        "exp": "'hour' comienza con sonido vocálico porque la letra 'h' es muda (/ˈaʊər/)."
      }
    ]
  },
  {
    "id": "a1_adjectives",
    "level": "A1",
    "levelNum": 1,
    "title": "2.3 Adjetivos, Orden y Comparativos Básicos",
    "icon": "🎨",
    "summary": "Invariabilidad de los adjetivos, orden estricto de adjetivos múltiples, comparativos (-er/more) y superlativos.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Los adjetivos describen sustantivos y <strong>nunca cambian de género ni de número</strong> (un adjetivo jamás lleva 's' plural). Van siempre delante del sustantivo o tras el verbo <em>to be</em>.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📋 Orden de Múltiples Adjetivos</h4>\n          <p>Si usas varios adjetivos seguidos, el inglés sigue un orden psicológico estricto:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>Opinión → Tamaño → Edad → Forma → Color → Origen → Material → Propósito + Sustantivo</strong>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>A beautiful big old round black Italian leather driving bag.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>An expensive modern Japanese electric car.</em> (Opinión → Edad → Origen → Propósito).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚖️ Comparativos (Comparar 2 Elementos con 'Than')</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tipo de Adjetivo</th><th>Regla</th><th>Ejemplos</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Cortos (1 sílaba)</strong></td><td>Adjetivo + <strong>-er + than</strong></td><td>tall → taller than, fast → faster than</td></tr>\n              <tr><td><strong>Terminados en -e</strong></td><td>Solo añadir <strong>+r</strong></td><td>nice → nicer than, safe → safer than</td></tr>\n              <tr><td><strong>Consonante-Vocal-Consonante</strong></td><td>Duplica consonante final</td><td>big → bigger than, hot → hotter than</td></tr>\n              <tr><td><strong>2 sílabas terminados en -y</strong></td><td>Cambia a <strong>-ier</strong></td><td>happy → happier than, easy → easier than</td></tr>\n              <tr><td><strong>Largos (2+ sílabas)</strong></td><td><strong>more + adjetivo + than</strong></td><td>more comfortable than, more expensive than</td></tr>\n              <tr><td><strong>Irregulares clave</strong></td><td>Forma especial</td><td>good → better than, bad → worse than, far → further than</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>👑 Superlativos (El más destacado de un grupo con 'The')</h4>\n          <p>Cortos: <strong>the + adjetivo + -est</strong> (<em>the tallest, the biggest, the happiest</em>). Largos: <strong>the most + adjetivo</strong> (<em>the most intelligent, the most beautiful</em>).</p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con adjetivos</h5>\n          <p>❌ <em>Pluralizar el adjetivo:</em> \"reds cars\" ➔ ✅ <strong>red cars</strong>.</p>\n          <p>❌ <em>Poner el adjetivo después:</em> \"a house big\" ➔ ✅ <strong>a big house</strong>.</p>\n          <p>❌ <em>Doble comparativo:</em> \"more easier\" ➔ ✅ <strong>easier</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es el orden correcto de adjetivos en inglés?",
        "opts": [
          "a lovely small wooden table",
          "a wooden lovely small table",
          "a small table wooden lovely"
        ],
        "a": "a lovely small wooden table",
        "exp": "El orden estándar es Opinión (lovely) → Tamaño (small) → Material (wooden) + Sustantivo (table)."
      },
      {
        "q": "¿Cuál es el comparativo correcto de 'healthy'?",
        "opts": [
          "healthier",
          "more healthy",
          "more healthier"
        ],
        "a": "healthier",
        "exp": "Los adjetivos de dos sílabas terminados en '-y' cambian a '-ier'."
      },
      {
        "q": "Señala la opción correcta: 'This is ____ laptop in the store.'",
        "opts": [
          "the most expensive",
          "the more expensive",
          "the expensivest"
        ],
        "a": "the most expensive",
        "exp": "Para adjetivos largos, el superlativo se construye con 'the most' + adjetivo."
      }
    ]
  },
  {
    "id": "a1_adverbs",
    "level": "A1",
    "levelNum": 1,
    "title": "2.4 Adverbios de Modo, Tiempo, Frecuencia y Grado",
    "icon": "⏱️",
    "summary": "Formación de adverbios con -ly, adverbios de frecuencia y su posición exacta en la frase, for vs since.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Los adverbios modifican verbos, adjetivos u otros adverbios. Responden a: ¿cómo? (modo), ¿cuándo? (tiempo), ¿dónde? (lugar), ¿con qué frecuencia? y ¿en qué grado?</p>\n\n        <div class=\"grammar-block\">\n          <h4>🏃 Adverbios de Modo (-ly)</h4>\n          <ul>\n            <li>Regla general: <strong>adjetivo + -ly</strong> (<em>quick → quickly, slow → slowly</em>).</li>\n            <li>Terminados en -y: <strong>-y → -ily</strong> (<em>happy → happily, easy → easily</em>).</li>\n            <li>Terminados en -ic: <strong>-ic → -ically</strong> (<em>basic → basically</em>).</li>\n            <li><strong>Irregulares invariables:</strong> <em>fast → fast</em> (¡'fastly' no existe!), <em>hard → hard, late → late, good → well</em>.</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📅 Adverbios de Tiempo y Duración: For vs Since</h4>\n          <p><strong>For</strong> = periodo completo transcurrido (<em>for three years, for two hours</em>).<br>\n          <strong>Since</strong> = punto de inicio temporal (<em>since Monday, since 2018</em>).</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📊 Adverbios de Frecuencia y su Posición Exacta</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Porcentaje</th><th>Adverbio</th><th>Posición en la Frase</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>100%</td><td>always</td><td rowspan=\"6\"><strong>1. ANTES del verbo principal:</strong><br><em>She always studies at night.</em><br><br><strong>2. DESPUÉS del verbo to be:</strong><br><em>He is often tired.</em><br><br><strong>3. ENTRE auxiliar y verbo principal:</strong><br><em>You have never seen it.</em></td></tr>\n              <tr><td>90%</td><td>usually</td></tr>\n              <tr><td>70%</td><td>often</td></tr>\n              <tr><td>50%</td><td>sometimes</td></tr>\n              <tr><td>10%</td><td>rarely / seldom</td></tr>\n              <tr><td>0%</td><td>never</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con adverbios</h5>\n          <p>❌ <em>Posición errónea:</em> \"He goes always by car\" ➔ ✅ <strong>He always goes by car</strong>.</p>\n          <p>❌ <em>Usar fastly:</em> \"She drives fastly\" ➔ ✅ <strong>She drives fast</strong>.</p>\n          <p>❌ <em>Confundir for y since:</em> \"since five years\" ➔ ✅ <strong>for five years</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Dónde se coloca el adverbio de frecuencia en: 'She ____ (often / be) tired after work'?",
        "opts": [
          "She is often tired",
          "She often is tired",
          "She is tired often"
        ],
        "a": "She is often tired",
        "exp": "Los adverbios de frecuencia siempre van DESPUÉS del verbo 'to be'."
      },
      {
        "q": "¿Cuál es la forma adverbial correcta de 'fast'?",
        "opts": [
          "fast",
          "fastly",
          "fasty"
        ],
        "a": "fast",
        "exp": "'fast' es un adverbio irregular invariable; 'fastly' no existe en inglés."
      },
      {
        "q": "Elige la opción correcta: 'I have lived here ____ 2020.'",
        "opts": [
          "since",
          "for",
          "during"
        ],
        "a": "since",
        "exp": "'since' señala el punto exacto de inicio en el pasado."
      }
    ]
  },
  {
    "id": "a1_pronouns_preps",
    "level": "A1",
    "levelNum": 1,
    "title": "2.5 - 2.8 Pronombres, Preposiciones y Conectores Básicos",
    "icon": "🔗",
    "summary": "Pronombres sujeto/objeto, adjetivos vs pronombres posesivos, preposiciones y conectores básicos.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El inglés exige sujetos explícitos (nunca se omiten los pronombres) y distingue nítidamente la función gramatical entre pronombres y adjetivos.</p>\n\n        <div class=\"grammar-block\">\n          <h4>👥 Tabla Maestra de Pronombres</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Sujeto (Obligatorio)</th><th>Objeto (Tras verbo/prep)</th><th>Adj. Posesivo (+ sustantivo)</th><th>Pronombre Posesivo (Solo)</th><th>Reflexivo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>I</td><td>me</td><td>my (car)</td><td>mine</td><td>myself</td></tr>\n              <tr><td>You</td><td>you</td><td>your (car)</td><td>yours</td><td>yourself</td></tr>\n              <tr><td>He</td><td>him</td><td>his (car)</td><td>his</td><td>himself</td></tr>\n              <tr><td>She</td><td>her</td><td>her (car)</td><td>hers</td><td>herself</td></tr>\n              <tr><td>It</td><td>it</td><td>its (color)</td><td>[its]</td><td>itself</td></tr>\n              <tr><td>We</td><td>us</td><td>our (car)</td><td>ours</td><td>ourselves</td></tr>\n              <tr><td>They</td><td>them</td><td>their (car)</td><td>theirs</td><td>themselves</td></tr>\n            </tbody>\n          </table>\n          <p><em>Nota: 'This is mine book' es un error gravísimo. Debe ser 'This is my book' o 'This book is mine'.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📍 Preposiciones Básicas (Lugar, Tiempo, Movimiento)</h4>\n          <ul>\n            <li><strong>Lugar:</strong> <em>in</em> (dentro de un espacio), <em>on</em> (sobre superficie), <em>under</em> (debajo), <em>next to</em> (al lado).</li>\n            <li><strong>Tiempo:</strong> <em>at</em> (horas: at 8 p.m.), <em>on</em> (días y fechas: on Monday), <em>in</em> (meses, años, estaciones: in July, in 2026).</li>\n            <li><strong>Movimiento:</strong> <em>to</em> (hacia), <em>into</em> (hacia el interior: ran into the room), <em>from</em> (desde).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🪢 Conjunciones Básicas</h4>\n          <ul>\n            <li><strong>Copulativas (sumar):</strong> <em>and, also, too, as well</em>.</li>\n            <li><strong>Adversativas (contraste):</strong> <em>but</em> (une 2 ideas), <em>however</em> (inicio de oración con coma), <em>although</em> (aunque).</li>\n            <li><strong>Causales:</strong> <em>because</em> (la más común), <em>since</em> (ya que), <em>as</em> (como/ya que).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores comunes</h5>\n          <p>❌ <em>Omitir el pronombre sujeto:</em> \"Is raining\" ➔ ✅ <strong>It is raining</strong>.</p>\n          <p>❌ <em>Usar reflexivo como sujeto:</em> \"Myself went to the office\" ➔ ✅ <strong>I went to the office</strong>.</p>\n          <p>❌ <em>Confundir it's con its:</em> <strong>It's</strong> = <em>It is</em> (contracción) vs <strong>its</strong> = posesivo neutro.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Elige la opción correcta: 'This laptop is not yours, it is ____.'",
        "opts": [
          "mine",
          "my",
          "me"
        ],
        "a": "mine",
        "exp": "'mine' es el pronombre posesivo independiente que sustituye al sustantivo."
      },
      {
        "q": "¿Qué preposición temporal corresponde a los días de la semana?",
        "opts": [
          "on",
          "at",
          "in"
        ],
        "a": "on",
        "exp": "Los días de la semana siempre se introducen con 'on' (on Monday, on Friday)."
      },
      {
        "q": "¿Cuál es la frase correcta sin omisión de sujeto?",
        "opts": [
          "It is very important to practice.",
          "Is very important to practice.",
          "Am very important to practice."
        ],
        "a": "It is very important to practice.",
        "exp": "En inglés el pronombre sujeto 'it' es obligatorio en oraciones impersonales."
      }
    ]
  },
  {
    "id": "a1_verbs_essential",
    "level": "A1",
    "levelNum": 1,
    "title": "3. Verbos Básicos Esenciales: To Be, To Have, To Do",
    "icon": "🏛️",
    "summary": "Los 3 pilares del idioma: funciones léxicas y auxiliares, preguntas, negaciones y uso enfático.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">To Be, To Have y To Do son los pilares fundamentales: aparecen constantemente y funcionan tanto como verbos de acción como auxiliares.</p>\n\n        <div class=\"grammar-block\">\n          <h4>1. Verbo To Be (Ser / Estar)</h4>\n          <p>Expresa identidad, profesión, nacionalidad, edad (¡con To Be, no con have!), estados y ubicación.</p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Pronombre</th><th>Afirmativa</th><th>Negativa</th><th>Interrogativa (Inversión)</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>I</td><td>I am (I'm)</td><td>I am not (I'm not)</td><td>Am I...?</td></tr>\n              <tr><td>He / She / It</td><td>He is (He's)</td><td>He is not (isn't)</td><td>Is he / she...?</td></tr>\n              <tr><td>We / You / They</td><td>They are (They're)</td><td>They are not (aren't)</td><td>Are you / they...?</td></tr>\n            </tbody>\n          </table>\n          <p>⚠️ <strong>Regla crítica:</strong> La edad se expresa con To Be: <em>I am 20 years old</em> (¡NUNCA 'I have 20 years'!).</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>2. Verbo To Have (Tener / Haber)</h4>\n          <ul>\n            <li><strong>Como verbo principal (posesión):</strong> En presente lleva <em>have</em> (I/you/we/they) y <em>has</em> (he/she/it). Su negación y pregunta <strong>requieren do / does</strong>: <em>Do you have a pen? / He doesn't have money.</em></li>\n            <li><strong>Como auxiliar:</strong> En tiempos compuestos (Present Perfect): <em>I have seen the movie</em>.</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>3. Verbo To Do (Hacer / Auxiliar)</h4>\n          <ul>\n            <li><strong>Principal ('hacer'):</strong> <em>do homework, do the dishes, do exercise</em> (3ª persona: <em>does</em>).</li>\n            <li><strong>Auxiliar:</strong> Forma negativas e interrogativas en presente y pasado cuando el verbo no es to be ni modal: <em>Do you like coffee? / She doesn't speak French.</em></li>\n            <li><strong>Uso enfático:</strong> Añadir do/does en afirmativa para dar énfasis o reafirmar algo: <em>She does play tennis!</em> («Ella sí que juega al tenis»).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar have para la edad:</em> \"I have 25 years\" ➔ ✅ <strong>I am 25 years old</strong>.</p>\n          <p>❌ <em>Negar have sin auxiliar:</em> \"He hasn't a car\" ➔ ✅ <strong>He doesn't have a car</strong>.</p>\n          <p>❌ <em>Usar do con verbos modales:</em> \"Do you can swim?\" ➔ ✅ <strong>Can you swim?</strong></p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cómo se dice en inglés: 'Ella tiene 22 años'?",
        "opts": [
          "She is 22 years old.",
          "She has 22 years.",
          "She does have 22 years old."
        ],
        "a": "She is 22 years old.",
        "exp": "En inglés la edad siempre se expresa con el verbo 'to be', nunca con 'have'."
      },
      {
        "q": "Señala la pregunta correcta con 'have' como posesión:",
        "opts": [
          "Do you have a pencil?",
          "Have you a pencil?",
          "Are you have a pencil?"
        ],
        "a": "Do you have a pencil?",
        "exp": "Como verbo principal en presente simple, 'have' requiere el auxiliar 'do/does'."
      },
      {
        "q": "¿Qué significa el uso enfático: 'I do want to help you'?",
        "opts": [
          "Realmente sí quiero ayudarte.",
          "Hago que te ayuden.",
          "No quiero ayudarte."
        ],
        "a": "Realmente sí quiero ayudarte.",
        "exp": "El auxiliar 'do' en frases afirmativas aporta énfasis contundente ('sí que quiero')."
      }
    ]
  },
  {
    "id": "a1_present_tenses",
    "level": "A1",
    "levelNum": 1,
    "title": "4. Present Simple vs. Present Continuous",
    "icon": "🔄",
    "summary": "Rutinas y hechos (Simple) vs acciones en curso y temporales (Continuous). Verbos de estado.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El contraste entre Present Simple y Present Continuous es una de las distinciones más importantes del inglés elemental y determina cómo percibes el tiempo.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📘 Present Simple (Rutinas, Hechos y Horarios)</h4>\n          <ul>\n            <li><strong>Usos:</strong> Hábitos (<em>I get up at 7</em>), verdades generales (<em>The sun rises in the east</em>), situaciones permanentes (<em>She lives in London</em>) y horarios fijos (<em>The train leaves at 6:30</em>).</li>\n            <li><strong>Fórmula:</strong> Sujeto + verbo en forma base (+s / +es en He/She/It).</li>\n            <li><strong>Negativa e Interrogativa:</strong> Usa <em>don't / doesn't</em> y <em>Do / Does</em> (la -s pasa al auxiliar: <em>Does she speak?</em>).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏳ Present Continuous (Acción en Curso o Temporal)</h4>\n          <ul>\n            <li><strong>Usos:</strong> Acciones que ocurren ahora mismo (<em>She is talking on the phone</em>), situaciones temporales (<em>I'm reading a great book these days</em>) o planes futuros cerrados (<em>We're meeting Tom at 6</em>).</li>\n            <li><strong>Fórmula:</strong> Sujeto + <strong>am/is/are + verbo-ing</strong>.</li>\n            <li><strong>Negativa e Interrogativa:</strong> <em>am not / isn't / aren't + -ing</em> | <em>Are you listening?</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚔️ Tabla Comparativa Directa</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Aspecto</th><th>Present Simple</th><th>Present Continuous</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Significado</strong></td><td>Lo habitual, permanente, rutina o hecho</td><td>Lo que ocurre ahora, temporal o plan cercano</td></tr>\n              <tr><td><strong>Ejemplo</strong></td><td><em>I study English every evening.</em></td><td><em>I am studying English right now.</em></td></tr>\n              <tr><td><strong>Marcadores</strong></td><td>always, usually, every day, often, on Mondays</td><td>now, at the moment, right now, these days, today</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🧠 Verbos de Estado (Stative Verbs - ¡No van en continuo!)</h4>\n          <p>Verbos de percepción, emoción, posesión o pensamiento <strong>NO</strong> se suelen usar con -ing:</p>\n          <p><em>like, love, hate, know, believe, understand, prefer, need, want, belong, remember</em>.</p>\n          <p>❌ <em>I am knowing him</em> ➔ ✅ <strong>I know him</strong>.<br>\n          ❌ <em>I am wanting coffee</em> ➔ ✅ <strong>I want coffee</strong>.</p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Olvidar la -s en 3ª persona:</em> \"He play football\" ➔ ✅ <strong>He plays football</strong>.</p>\n          <p>❌ <em>Mantener la -s tras does:</em> \"Does he walks?\" ➔ ✅ <strong>Does he walk?</strong></p>\n          <p>❌ <em>Usar 'be' innecesariamente:</em> \"I am speak English\" ➔ ✅ <strong>I speak English</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué tiempo corresponde a: 'Look! The baby ____'?",
        "opts": [
          "is sleeping",
          "sleeps",
          "is sleep"
        ],
        "a": "is sleeping",
        "exp": "'Look!' indica una acción visual que está ocurriendo en este preciso momento."
      },
      {
        "q": "¿Por qué no se dice 'I am understanding the lesson'?",
        "opts": [
          "Porque 'understand' es un verbo de estado y no suele admitir -ing",
          "Porque falta el auxiliar do",
          "Porque requiere infinitivo con to"
        ],
        "a": "Porque 'understand' es un verbo de estado y no suele admitir -ing",
        "exp": "Los 'stative verbs' de pensamiento y comprensión se conjugan en Simple: 'I understand'."
      },
      {
        "q": "Corrige la pregunta: 'Does she ____ coffee?'",
        "opts": [
          "like",
          "likes",
          "liking"
        ],
        "a": "like",
        "exp": "Al estar presente el auxiliar 'Does', el verbo principal vuelve a su forma base sin '-s'."
      }
    ]
  },
  {
    "id": "a1_past_simple",
    "level": "A1",
    "levelNum": 1,
    "title": "5. Past Simple (Pasado Simple)",
    "icon": "⏳",
    "summary": "Acciones terminadas en tiempo específico. Reglas de -ed en regulares, verbos irregulares y auxiliar did.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El Past Simple se utiliza para acciones completadas en un momento específico del pasado, secuencias en narraciones y hábitos que ya terminaron.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📅 Marcadores Temporales Típicos</h4>\n          <p><em>yesterday, last night, last week, in 2015, two days ago, when I was young</em>.</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>✏️ Verbos Regulares: Reglas de -ed</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Terminación</th><th>Regla</th><th>Ejemplos</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>Regla general</td><td>Añadir <strong>-ed</strong></td><td>work → worked, play → played</td></tr>\n              <tr><td>Terminados en -e</td><td>Solo añadir <strong>+d</strong></td><td>live → lived, like → liked</td></tr>\n              <tr><td>Consonante + y</td><td>Cambiar a <strong>-ied</strong></td><td>study → studied, cry → cried</td></tr>\n              <tr><td>Consonante-Vocal-Consonante tónica</td><td>Duplica consonante final</td><td>stop → stopped, plan → planned</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🌟 Verbos Irregulares Clave (Memorizar)</h4>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\"><strong>go → went</strong> | <strong>eat → ate</strong> | <strong>have → had</strong> | <strong>see → saw</strong></div>\n            <div class=\"grammar-example-item\"><strong>buy → bought</strong> | <strong>come → came</strong> | <strong>make → made</strong> | <strong>take → took</strong></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🛡️ Negativa e Interrogativa con 'Did'</h4>\n          <p><strong>El auxiliar DID ya absorbe la marca de pasado:</strong> el verbo principal SIEMPRE va en su forma base infinitiva.</p>\n          <div class=\"grammar-formula-card\">\n            Negativa: Sujeto + <strong>didn't + verbo base</strong> (<em>She didn't go to the party</em>)<br>\n            Interrogativa: <strong>Did + sujeto + verbo base?</strong> (<em>Did you see the movie?</em>)\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con Past Simple</h5>\n          <p>❌ <em>Poner el verbo en pasado tras did:</em> \"Did he went?\" ➔ ✅ <strong>Did he go?</strong></p>\n          <p>❌ <em>Olvidar -ed con marcador de pasado:</em> \"Yesterday I walk 5 km\" ➔ ✅ <strong>Yesterday I walked 5 km</strong>.</p>\n          <p>❌ <em>Añadir -ed a verbos irregulares:</em> \"I buyed a car\" ➔ ✅ <strong>I bought a car</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es la forma negativa correcta en pasado simple?",
        "opts": [
          "She didn't visit her parents.",
          "She didn't visited her parents.",
          "She not visited her parents."
        ],
        "a": "She didn't visit her parents.",
        "exp": "El auxiliar 'didn't' ya expresa el pasado; el verbo principal debe ir en infinitivo base ('visit')."
      },
      {
        "q": "¿Cuál es el pasado del verbo 'buy'?",
        "opts": [
          "bought",
          "buyed",
          "buied"
        ],
        "a": "bought",
        "exp": "'buy' es irregular: buy → bought → bought."
      },
      {
        "q": "Señala la pregunta bien formulada:",
        "opts": [
          "Did you finish the report yesterday?",
          "Did you finished the report yesterday?",
          "Were you finish the report yesterday?"
        ],
        "a": "Did you finish the report yesterday?",
        "exp": "Con 'Did', el verbo principal queda en forma base ('finish')."
      }
    ]
  },
  {
    "id": "a1_there_is_can_imp",
    "level": "A1",
    "levelNum": 1,
    "title": "6 - 9. There Is/Are, Can/Can't, Imperativos y Gustos con -ing",
    "icon": "🧩",
    "summary": "Existencia con There is/are, modal básico Can/Can't, órdenes con imperativos y verbos de gusto con -ing.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Cuatro estructuras fundamentales de supervivencia en A1: describir la existencia de objetos, expresar habilidades y permisos, dar instrucciones directas y hablar de pasatiempos.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📦 6. There Is / There Are (Hay)</h4>\n          <ul>\n            <li><strong>There is:</strong> Para singular e incontables (<em>There is milk in the fridge; There is a book on the table</em>).</li>\n            <li><strong>There are:</strong> Para plurales contables (<em>There are three people in the room</em>).</li>\n            <li><strong>Negativas y preguntas:</strong> <em>There isn't / There aren't any...</em> | <em>Is there a supermarket nearby? / Are there any apples?</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏊 7. Verbo Modal Can / Can't</h4>\n          <p>Es invariable (no lleva -s ni auxiliar do). Va seguido de verbo en forma base.</p>\n          <ul>\n            <li><strong>Capacidad:</strong> <em>I can swim; She can speak three languages.</em></li>\n            <li><strong>Permiso / Prohibición:</strong> <em>Can I open the window? / You can't park here.</em></li>\n            <li><strong>Posibilidad:</strong> <em>It can rain later; That can't be true.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🛑 8. Imperativos (Instrucciones y Órdenes)</h4>\n          <p>No llevan sujeto explícito (se sobreentiende 'you').</p>\n          <ul>\n            <li><strong>Afirmativo:</strong> Verbo en forma base: <em>Open the window. Turn right.</em></li>\n            <li><strong>Negativo:</strong> <strong>Don't + verbo base</strong>: <em>Don't be late! Don't touch that!</em></li>\n            <li><strong>Sugerencia colectiva:</strong> <strong>Let's + verbo base</strong>: <em>Let's start the meeting.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>❤️ 9. Gustos y Preferencias con -ing</h4>\n          <p>Verbos como <em>like, love, enjoy, hate, don't mind</em> se combinan con <strong>verbo-ing</strong> para referirse a la actividad en general:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>I like listening to music.</em> (Me gusta escuchar música).</div>\n            <div class=\"grammar-example-item\">🔊 <em>She loves travelling around Europe.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>He doesn't like getting up early.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Decir 'She cans':</em> \"She cans sing\" ➔ ✅ <strong>She can sing</strong> (los modales nunca llevan -s).</p>\n          <p>❌ <em>Poner sujeto en imperativos:</em> \"You open the door\" ➔ ✅ <strong>Open the door</strong>.</p>\n          <p>❌ <em>Usar 'there is' con plural:</em> \"There is three cars\" ➔ ✅ <strong>There are three cars</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué opción completa correctamente: '____ any milk left in the bottle?'",
        "opts": [
          "Is there",
          "Are there",
          "There is"
        ],
        "a": "Is there",
        "exp": "'milk' es un sustantivo incontable, por lo que rige singular 'Is there'."
      },
      {
        "q": "Elige la forma correcta del modal: 'He ____ drive very well.'",
        "opts": [
          "can",
          "cans",
          "can to"
        ],
        "a": "can",
        "exp": "Los verbos modales son invariables (sin -s) y van seguidos de infinitivo sin to."
      },
      {
        "q": "¿Cómo se expresa correctamente la orden negativa 'No toques eso'?",
        "opts": [
          "Don't touch that!",
          "Not touch that!",
          "No touch that!"
        ],
        "a": "Don't touch that!",
        "exp": "El imperativo negativo se forma siempre con 'Don't' + verbo en forma base."
      }
    ]
  },
  {
    "id": "a2_present_perfect",
    "level": "A2",
    "levelNum": 2,
    "title": "1.1 Present Perfect Simple",
    "icon": "⏳",
    "summary": "have/has + participio pasado: experiencias sin fecha, efectos presentes y adverbios since, for, already, just, yet.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El Present Perfect conecta el pasado con el presente. No importa exactamente cuándo ocurrió la acción, sino el hecho de que ocurrió o sus consecuencias en el momento actual.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📐 Estructura Gramatical</h4>\n          <div class=\"grammar-formula-card\">\n            Afirmativa: Sujeto + <strong>have / has + participio pasado</strong><br>\n            Negativa: Sujeto + <strong>haven't / hasn't + participio</strong><br>\n            Interrogativa: <strong>Have / Has + sujeto + participio?</strong>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 Los 4 Usos Principales</h4>\n          <ul>\n            <li><strong>1. Experiencias de vida (sin fecha exacta):</strong> <em>I have travelled to Japan; Have you ever seen an eclipse?</em></li>\n            <li><strong>2. Acciones pasadas con efecto presente directo:</strong> <em>She has lost her keys</em> (por tanto, ahora no puede entrar).</li>\n            <li><strong>3. Acciones recientes:</strong> <em>We have just arrived; They have already eaten.</em></li>\n            <li><strong>4. Acciones repetidas en periodo aún abierto (today, this week):</strong> <em>I've seen him twice this week.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏱️ Adverbios Clave y su Posición</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Adverbio</th><th>Significado</th><th>Posición</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>since</strong></td><td>Punto de inicio en el pasado («desde»)</td><td>Antes de la fecha / año / punto</td><td><em>I have worked here since 2018.</em></td></tr>\n              <tr><td><strong>for</strong></td><td>Duración acumulada («durante»)</td><td>Antes del periodo temporal</td><td><em>They have been married for ten years.</em></td></tr>\n              <tr><td><strong>already</strong></td><td>«Ya» (antes de lo previsto)</td><td>Entre have/has y el participio</td><td><em>She has already finished her lunch.</em></td></tr>\n              <tr><td><strong>just</strong></td><td>«Acabar de» (hace instantes)</td><td>Entre have/has y el participio</td><td><em>I have just received the email.</em></td></tr>\n              <tr><td><strong>yet</strong></td><td>«Todavía no» (-) / «¿Ya?» (?)</td><td><strong>Siempre al final</strong> de la frase</td><td><em>He hasn't arrived yet. / Have you finished yet?</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚔️ Past Simple vs. Present Perfect</h4>\n          <p><strong>Past Simple:</strong> Acción cerrada en momento definido (<em>yesterday, last year, in 2020</em>).<br>\n          <strong>Present Perfect:</strong> Sin fecha cerrada, o con relevancia en el presente.<br>\n          ❌ <em>I have seen her yesterday</em> ➔ ✅ <strong>I saw her yesterday</strong>.<br>\n          ❌ <em>I went to London before</em> ➔ ✅ <strong>I have been to London before</strong>.</p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar 'has' con I/you/we/they:</em> \"They has gone\" ➔ ✅ <strong>They have gone</strong>.</p>\n          <p>❌ <em>Colocar 'yet' en medio de la frase:</em> \"I have yet finished\" ➔ ✅ <strong>I haven't finished yet</strong>.</p>\n          <p>❌ <em>Olvidar el participio:</em> \"She has went\" ➔ ✅ <strong>She has gone</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Completa correctamente: 'I haven't received the package ____.'",
        "opts": [
          "yet",
          "already",
          "just"
        ],
        "a": "yet",
        "exp": "'yet' se sitúa al final de las frases negativas con el sentido de 'todavía no'."
      },
      {
        "q": "¿Qué frase es correcta?",
        "opts": [
          "I visited Rome in 2021.",
          "I have visited Rome in 2021.",
          "I visit Rome in 2021."
        ],
        "a": "I visited Rome in 2021.",
        "exp": "Al haber un marcador temporal cerrado y específico ('in 2021'), es obligatorio usar Past Simple."
      },
      {
        "q": "¿Qué significa 'We have just arrived'?",
        "opts": [
          "Acabamos de llegar.",
          "Todavía no llegamos.",
          "Ya habíamos llegado hace horas."
        ],
        "a": "Acabamos de llegar.",
        "exp": "'just' entre el auxiliar y el participio expresa una acción completada instantes antes."
      }
    ]
  },
  {
    "id": "a2_past_cont_perf",
    "level": "A2",
    "levelNum": 2,
    "title": "1.2 - 1.3 Past Continuous y Past Perfect",
    "icon": "📽️",
    "summary": "was/were + -ing para acciones en desarrollo en el pasado y had + participio para el 'pasado del pasado'.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Para construir narraciones ricas en el pasado, combinamos acciones puntuales (Past Simple) con acciones de fondo en curso (Past Continuous) y acciones anteriores (Past Perfect).</p>\n\n        <div class=\"grammar-block\">\n          <h4>⏳ Past Continuous (was / were + verbo-ing)</h4>\n          <ul>\n            <li><strong>Acción en curso en momento concreto:</strong> <em>She was reading at 9 p.m.</em></li>\n            <li><strong>Escenario / atmósfera de una historia:</strong> <em>It was raining, and people were running.</em></li>\n            <li><strong>Acción larga interrumpida por otra puntual (while / when):</strong><br>\n            <em>I was sleeping when the phone rang.</em> (Dormir = acción larga en continuous; sonar = acción puntual en simple).<br>\n            <em>While I was cooking, my sister arrived.</em></li>\n            <li><strong>Dos acciones simultáneas:</strong> <em>While I was studying, my brother was playing games.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏪ Past Perfect Simple (had + participio)</h4>\n          <p>Es el auténtico <strong>«pasado del pasado»</strong>: indica qué acción ocurrió ANTES que otra acción también pasada.</p>\n          <div class=\"grammar-formula-card\">\n            Sujeto + <strong>had + participio pasado</strong> (igual para todas las personas: I had, you had, she had...)\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>When we arrived at the station, the train had already left.</em><br>\n            (1º El tren se marchó → 2º Llegamos nosotros).</div>\n            <div class=\"grammar-example-item\">🔊 <em>I was very tired because I hadn't slept well the night before.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar Past Perfect sin una segunda acción de referencia:</em> \"I had watched that movie yesterday\" ➔ ✅ <strong>I watched that movie yesterday</strong>.</p>\n          <p>❌ <em>Concordancia de was/were:</em> \"They was waiting\" ➔ ✅ <strong>They were waiting</strong>.</p>\n          <p>❌ <em>Confundir had went:</em> \"She had went\" ➔ ✅ <strong>She had gone</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Elige la combinación adecuada: 'I ____ dinner when the lights ____ out.'",
        "opts": [
          "was cooking / went",
          "cooked / was going",
          "was cooked / gone"
        ],
        "a": "was cooking / went",
        "exp": "La acción en desarrollo va en Past Continuous ('was cooking') y la que interrumpe en Past Simple ('went')."
      },
      {
        "q": "¿Qué ocurrió primero en: 'When Anna arrived, Tom had left'?",
        "opts": [
          "Tom se marchó primero.",
          "Anna llegó primero.",
          "Ocurrió al mismo tiempo."
        ],
        "a": "Tom se marchó primero.",
        "exp": "El Past Perfect ('had left') marca la acción previa a la otra acción en Past Simple."
      },
      {
        "q": "¿Cuál es la forma correcta con 'they' en Past Continuous?",
        "opts": [
          "They were studying",
          "They was studying",
          "They were study"
        ],
        "a": "They were studying",
        "exp": "Con 'they' se conjuga 'were' seguido del participio de presente con '-ing'."
      }
    ]
  },
  {
    "id": "a2_used_to",
    "level": "A2",
    "levelNum": 2,
    "title": "1.5 Hábitos Pasados con 'Used To'",
    "icon": "📜",
    "summary": "used to + verbo base para hábitos o estados del pasado que ya no existen en el presente («solía»).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\"><strong>Used to</strong> expresa hábitos, rutinas o estados del pasado que eran verdaderos antes pero que <strong>ya no existen en la actualidad</strong>. En español se suele traducir como «solía» o con el imperfecto.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📐 Estructura Gramatical</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Forma</th><th>Fórmula</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Afirmativa</strong></td><td>Sujeto + <strong>used to + verbo base</strong></td><td><em>She used to play the piano.</em> (Antes tocaba, ahora no).</td></tr>\n              <tr><td><strong>Negativa</strong></td><td>Sujeto + <strong>didn't use to + verbo base</strong></td><td><em>We didn't use to like spicy food.</em> (¡Sin la '-d'!).</td></tr>\n              <tr><td><strong>Interrogativa</strong></td><td><strong>Did + sujeto + use to + verbo base?</strong></td><td><em>Did you use to live near the beach?</em> (¡Sin la '-d'!).</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>💡 Usos Clave: Hábitos vs Estados</h4>\n          <ul>\n            <li><strong>Hábitos pasados:</strong> <em>I used to go jogging every single morning.</em></li>\n            <li><strong>Estados pasados:</strong> <em>There used to be an old cinema on this street; I used to have long hair.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con Used To</h5>\n          <p>❌ <em>Mantener la -d en preguntas y negativas:</em> \"Did you used to play?\" ➔ ✅ <strong>Did you use to play?</strong></p>\n          <p>❌ <em>Negar sin auxiliar did:</em> \"I not used to study\" ➔ ✅ <strong>I didn't use to study</strong>.</p>\n          <p>❌ <em>Usar 'used to' para el presente:</em> \"I use to eat vegetables today\" ➔ ✅ <strong>I usually eat vegetables</strong> (en presente se usa 'usually' + Present Simple).</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es la forma negativa correcta?",
        "opts": [
          "He didn't use to drink tea.",
          "He didn't used to drink tea.",
          "He used to not drink tea."
        ],
        "a": "He didn't use to drink tea.",
        "exp": "Con el auxiliar negativo 'didn't', se pierde la 'd' final: 'didn't use to'."
      },
      {
        "q": "¿Cómo se dice en inglés: 'Yo suelo desayunar fruta' (hábito presente)?",
        "opts": [
          "I usually eat fruit for breakfast.",
          "I use to eat fruit for breakfast.",
          "I am used to eat fruit for breakfast."
        ],
        "a": "I usually eat fruit for breakfast.",
        "exp": "'used to' es SOLO para el pasado. En el presente se usa el adverbio 'usually' con Present Simple."
      },
      {
        "q": "Señala la pregunta correcta con 'use to':",
        "opts": [
          "Did they use to live in Paris?",
          "Did they used to live in Paris?",
          "Do they used to live in Paris?"
        ],
        "a": "Did they use to live in Paris?",
        "exp": "Did + sujeto + use to (sin 'd') + infinitivo base."
      }
    ]
  },
  {
    "id": "a2_future",
    "level": "A2",
    "levelNum": 2,
    "title": "2. El Futuro: Will vs. Going To",
    "icon": "🚀",
    "summary": "Decisiones espontáneas y predicciones intuitivas (Will) vs planes previos y evidencia visual (Going to).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En inglés no existe un único tiempo futuro simple; elegimos entre <strong>will</strong>, <strong>going to</strong> o el <strong>Present Continuous</strong> según el grado de planificación y la evidencia disponible.</p>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ 1. Will (Futuro Espontáneo y Predicción Intuitiva)</h4>\n          <p>Invariable para todas las personas. Contracciones: <em>I'll, you'll</em>; negativa: <em>won't</em>.</p>\n          <ul>\n            <li><strong>Decisiones espontáneas en el momento de hablar:</strong> <em>I'm thirsty. I will get some water.</em></li>\n            <li><strong>Promesas, ofrecimientos y amenazas:</strong> <em>I will help you with your bags; I will never lie to you.</em></li>\n            <li><strong>Predicciones basadas en opinión personal o intuición:</strong> <em>I think it will snow tomorrow.</em></li>\n            <li><strong>Hechos objetivos del futuro:</strong> <em>The sun will rise at 6:30 tomorrow.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 2. Going To (Planes Previos y Evidencia Presente)</h4>\n          <p>Estructura: <strong>am / is / are + going to + verbo base</strong>.</p>\n          <ul>\n            <li><strong>Planes e intenciones ya decididos de antemano:</strong> <em>I'm going to start a new course next week.</em></li>\n            <li><strong>Predicciones con evidencia visible en el presente:</strong> <em>Look at those dark clouds. It's going to rain!</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚔️ Resumen Contrastivo</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Situación</th><th>Tiempo Elegido</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>Decisión en el momento</td><td><strong>Will</strong></td><td><em>\"The phone is ringing.\" — \"I'll answer it.\"</em></td></tr>\n              <tr><td>Plan ya decidido antes</td><td><strong>Going to</strong></td><td><em>\"I'm going to paint my bedroom this weekend.\"</em></td></tr>\n              <tr><td>Evidencia visible inmediata</td><td><strong>Going to</strong></td><td><em>\"Careful! That ladder is going to fall!\"</em></td></tr>\n              <tr><td>Opinión subjetiva (\"I think...\")</td><td><strong>Will</strong></td><td><em>\"I think you will love this film.\"</em></td></tr>\n              <tr><td>Cita fijada en agenda / hora</td><td><strong>Present Continuous</strong></td><td><em>\"I'm having dinner with Sarah at 8 tonight.\"</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar will cuando hay evidencia visible:</em> \"Look at the clouds, it will rain\" ➔ ✅ <strong>It's going to rain</strong>.</p>\n          <p>❌ <em>Olvidar el verbo 'be' con going to:</em> \"She going to study\" ➔ ✅ <strong>She is going to study</strong>.</p>\n          <p>❌ <em>Añadir -s a will:</em> \"He wills come\" ➔ ✅ <strong>He will come</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Ves a alguien cargando muchas cajas a punto de caerse. ¿Qué dices?",
        "opts": [
          "Careful! You are going to drop those boxes!",
          "Careful! You will drop those boxes!",
          "Careful! You drop those boxes!"
        ],
        "a": "Careful! You are going to drop those boxes!",
        "exp": "Al existir evidencia física inmediata visible en el presente, se emplea 'going to'."
      },
      {
        "q": "Tu amigo dice: 'I don't have enough money for lunch'. Tú respondes espontáneamente:",
        "opts": [
          "Don't worry, I'll pay for it.",
          "Don't worry, I am going to pay for it.",
          "Don't worry, I pay for it."
        ],
        "a": "Don't worry, I'll pay for it.",
        "exp": "Las decisiones y ofrecimientos espontáneos tomados en el momento de hablar usan 'will'."
      },
      {
        "q": "¿Cuál es la forma negativa contraída de 'will not'?",
        "opts": [
          "won't",
          "willn't",
          "wont'"
        ],
        "a": "won't",
        "exp": "'will not' se contrae universalmente como 'won't'."
      }
    ]
  },
  {
    "id": "a2_modals",
    "level": "A2",
    "levelNum": 2,
    "title": "3. Verbos Modales A2: Should, Must, Have To, May, Might, Would",
    "icon": "🛡️",
    "summary": "Consejos (Should), obligación interna vs externa (Must vs Have to), prohibición vs no necesidad, posibilidad y cortesía.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Los verbos modales expresan la actitud del hablante: obligación, consejo, probabilidad o cortesía. <strong>Son invariables (sin -s)</strong> y van seguidos de infinitivo sin to.</p>\n\n        <div class=\"grammar-block\">\n          <h4>💡 Should / Shouldn't (Consejo y Recomendación)</h4>\n          <p><em>You should eat more vegetables; She shouldn't talk to him like that; The train should be here soon.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚔️ Must vs. Have To (Distinción Fundamental)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Aspecto</th><th>Must / Mustn't</th><th>Have to / Don't have to</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Afirmativa</strong></td><td><strong>Obligación personal / moral / subjetiva:</strong><br><em>I must call my mom tonight.</em> (Yo lo decido).</td><td><strong>Obligación externa impuesta (leyes, reglas):</strong><br><em>Students have to wear a uniform.</em></td></tr>\n              <tr><td><strong>Negativa (¡Difieren radicalmente!)</strong></td><td><strong>PROHIBICIÓN ESTRICTA:</strong><br><em>You mustn't smoke here.</em> (Está prohibido).</td><td><strong>AUSENCIA DE OBLIGACIÓN (No hace falta):</strong><br><em>You don't have to come if you're tired.</em></td></tr>\n              <tr><td><strong>Tiempos</strong></td><td>Solo presente (en pasado se sustituye por <em>had to</em>)</td><td>Todos los tiempos: <em>had to, will have to</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎲 May / Might (Posibilidad e Incertidumbre)</h4>\n          <p>Indican que algo es posible en presente o futuro. <em>May</em> se percibe algo más probable o formal; <em>Might</em> más especulativo.<br>\n          <em>It may rain later; I might go to the party tonight.</em><br>\n          Permiso muy formal: <em>May I ask a question? / You may leave early.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>☕ Would / Wouldn't (Cortesía, Deseos e Hipótesis)</h4>\n          <ul>\n            <li><strong>Peticiones y ofrecimientos educados:</strong> <em>Would you like some tea? / Would you help me, please?</em></li>\n            <li><strong>Deseos con cortesía:</strong> <em>I would love to meet your family.</em></li>\n            <li><strong>Hábitos pasados de acción:</strong> <em>My parents would take us camping every summer.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con modales</h5>\n          <p>❌ <em>Confundir 'mustn't' con 'don't have to':</em> decir \"You mustn't pay\" cuando la entrada es gratis (debe ser: <strong>You don't have to pay</strong>).</p>\n          <p>❌ <em>Añadir 'to' tras modales:</em> \"I should to study\" ➔ ✅ <strong>I should study</strong>.</p>\n          <p>❌ <em>Usar do/does con modales:</em> \"Do you should go?\" ➔ ✅ <strong>Should you go?</strong></p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Mañana es domingo y no hay clases. ¿Qué frase es la correcta?",
        "opts": [
          "You don't have to wake up early.",
          "You mustn't wake up early.",
          "You shouldn't to wake up early."
        ],
        "a": "You don't have to wake up early.",
        "exp": "'don't have to' indica que no es necesario (no hay obligación), mientras que 'mustn't' sería una prohibición."
      },
      {
        "q": "Estás en un avión durante el despegue. El cartel dice que el cinturón es obligatorio por ley:",
        "opts": [
          "Passengers have to fasten their seatbelts.",
          "Passengers might fasten their seatbelts.",
          "Passengers would fasten their seatbelts."
        ],
        "a": "Passengers have to fasten their seatbelts.",
        "exp": "'have to' refleja normas y regulaciones externas oficiales."
      },
      {
        "q": "¿Cuál es la forma educada para ofrecer un café a un invitado?",
        "opts": [
          "Would you like some coffee?",
          "Do you want coffee immediately?",
          "Will you like coffee?"
        ],
        "a": "Would you like some coffee?",
        "exp": "'Would you like...?' es la fórmula estándar de máxima cortesía para ofrecimientos."
      }
    ]
  },
  {
    "id": "a2_auxiliaries",
    "level": "A2",
    "levelNum": 2,
    "title": "4. Verbos Auxiliares, Tag Questions y So / Neither",
    "icon": "⚡",
    "summary": "Funciones de los auxiliares (be, have, do, modales): preguntas, respuestas cortas, coletillas interrogativas y acuerdos.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Los verbos auxiliares no aportan significado léxico concreto, sino la función gramatical: articulan tiempos compuestos, preguntas, respuestas breves y acuerdos.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🗂️ Los 7 Usos Esenciales de los Auxiliares</h4>\n          <ol>\n            <li><strong>Preguntas:</strong> <em>Do you like coffee? / Have you seen it?</em></li>\n            <li><strong>Negaciones:</strong> <em>She doesn't work on Sundays.</em></li>\n            <li><strong>Tiempos compuestos:</strong> <em>I have finished my homework.</em></li>\n            <li><strong>Énfasis o corrección:</strong> <em>I do want to come with you!</em></li>\n            <li><strong>Respuestas cortas:</strong> <em>\"Do you play tennis?\" — \"Yes, I do\" / \"No, I don't.\"</em></li>\n            <li><strong>Tag questions (coletillas):</strong> <em>You're tired, aren't you? / She didn't call, did she?</em></li>\n            <li><strong>Acuerdos con So y Neither:</strong> Expresar «yo también» o «yo tampoco».</li>\n          </ol>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🤝 Acuerdos con So y Neither (Yo también / Yo tampoco)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Frase Original</th><th>Tipo</th><th>Estructura de Acuerdo</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>Afirmativa (<em>\"I love Italian food.\"</em>)</td><td>Coincidir en afirmación</td><td><strong>So + auxiliar + sujeto</strong></td><td><em>\"So do I.\"</em> (Yo también)</td></tr>\n              <tr><td>Negativa (<em>\"I don't like horror movies.\"</em>)</td><td>Coincidir en negación</td><td><strong>Neither / Nor + auxiliar + sujeto</strong></td><td><em>\"Neither do I.\"</em> (Yo tampoco)</td></tr>\n              <tr><td>Con verbo To Be (<em>\"She is very busy.\"</em>)</td><td>Usa el mismo auxiliar be</td><td><strong>So + be + sujeto</strong></td><td><em>\"So is Mark.\"</em> (Mark también)</td></tr>\n              <tr><td>Con modal Can (<em>\"I can't swim.\"</em>)</td><td>Usa el mismo modal can</td><td><strong>Neither + can + sujeto</strong></td><td><em>\"Neither can my brother.\"</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏷️ Tag Questions (Regla del Opuesto)</h4>\n          <p>Si la frase es <strong>afirmativa</strong>, la coletilla es <strong>negativa</strong>:<br>\n          <em>You are Spanish, aren't you?</em><br>\n          <em>He works here, doesn't he?</em></p>\n          <p>Si la frase es <strong>negativa</strong>, la coletilla es <strong>afirmativa</strong>:<br>\n          <em>They haven't finished, have they?</em><br>\n          <em>She can't drive, can she?</em></p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar 'So' para frases negativas:</em> \"I don't like fish\" — \"So do I\" ➔ ✅ <strong>Neither do I</strong>.</p>\n          <p>❌ <em>Invertir mal el orden:</em> \"So I do\" ➔ ✅ <strong>So do I</strong>.</p>\n          <p>❌ <em>Auxiliar incorrecto en tag questions:</em> \"She works hard, isn't she?\" ➔ ✅ <strong>doesn't she?</strong></p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Tu amigo dice: 'I have never been to New York'. Tú quieres responder 'Yo tampoco'. ¿Qué dices?",
        "opts": [
          "Neither have I.",
          "So have I.",
          "Neither do I."
        ],
        "a": "Neither have I.",
        "exp": "La frase original es negativa (never) y usa el auxiliar 'have', por lo que el acuerdo es 'Neither have I'."
      },
      {
        "q": "Completa la Tag Question: 'You don't smoke, ____?'",
        "opts": [
          "do you",
          "don't you",
          "are you"
        ],
        "a": "do you",
        "exp": "Tras una oración negativa con 'don't', la coletilla de confirmación va en afirmativa: 'do you?'."
      },
      {
        "q": "Tu compañera dice: 'I love jazz music'. ¿Cómo dices 'Carlos también'?",
        "opts": [
          "So does Carlos.",
          "So Carlos does.",
          "Carlos so loves."
        ],
        "a": "So does Carlos.",
        "exp": "Estructura obligatoria: So + auxiliar concordante (does para Carlos) + sujeto."
      }
    ]
  },
  {
    "id": "a2_infinitive_gerund",
    "level": "A2",
    "levelNum": 2,
    "title": "5. Infinitivo (to + verbo) y Gerundio (-ing)",
    "icon": "🎭",
    "summary": "Verbos que exigen to-infinitive o gerundio, gerundio tras preposición y verbos con cambio de significado.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Decidir entre poner <strong>to + verbo</strong> (infinitivo) o <strong>verbo-ing</strong> (gerundio) tras otro verbo es una de las mayores fuentes de dudas en inglés.</p>\n\n        <div class=\"grammar-block\">\n          <h4>👉 Verbos Seguidos de Infinitivo (to + verbo)</h4>\n          <p>Verbos de deseo, necesidad, decisión, plan o promesa (orientados al futuro/intención):<br>\n          <em>want, need, decide, hope, plan, expect, learn, promise, offer, refuse, afford</em>.<br>\n          🔊 <em>I want to travel to Canada; She decided to study medicine.</em></p>\n          <p>También tras adjetivos: <em>I'm happy to help you.</em> / Para finalidad: <em>He studies hard to pass.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🌀 Verbos Seguidos de Gerundio (-ing)</h4>\n          <p>Verbos de disfrute, evitación, sugerencia o consideración (orientados a la actividad en sí):<br>\n          <em>enjoy, avoid, admit, consider, mind, suggest, imagine, finish, practice</em>.<br>\n          🔊 <em>She enjoys dancing; Would you mind opening the door?</em></p>\n          <p><strong>REGLA DE ORO:</strong> Tras CUALQUIER preposición, el verbo va SIEMPRE en <strong>-ing</strong>:<br>\n          <em>I am interested in learning English; Wash your hands before eating.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🚨 Verbos Críticos con CAMBIO RADICAL de Significado</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Verbo</th><th>Con Gerundio (-ing)</th><th>Con Infinitivo (to + verbo)</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Remember</strong></td><td><strong>Recordar haber hecho algo en el pasado:</strong><br><em>I remember locking the door.</em> (Tengo el recuerdo en la mente).</td><td><strong>Acordarse de hacer una tarea pendiente:</strong><br><em>Remember to lock the door!</em> (¡No lo olvides!).</td></tr>\n              <tr><td><strong>Stop</strong></td><td><strong>Dejar un hábito por completo:</strong><br><em>He stopped smoking.</em> (Ya no fuma más).</td><td><strong>Detenerse para hacer otra cosa:</strong><br><em>He stopped to smoke.</em> (Hizo una pausa para fumar).</td></tr>\n              <tr><td><strong>Try</strong></td><td><strong>Probar un método / experimento:</strong><br><em>Try restarting your computer.</em></td><td><strong>Esforzarse con dificultad sin garantía:</strong><br><em>He tried to lift the heavy box.</em></td></tr>\n              <tr><td><strong>Forget</strong></td><td><strong>Olvidar una vivencia pasada:</strong><br><em>I'll never forget meeting you.</em></td><td><strong>Olvidar hacer algo pendiente:</strong><br><em>I forgot to call my mother.</em></td></tr>\n              <tr><td><strong>Regret</strong></td><td><strong>Arrepentirse de algo ya hecho:</strong><br><em>I regret telling him the truth.</em></td><td><strong>Comunicar formalmente una mala noticia:</strong><br><em>We regret to inform you that you failed.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Infinitivo tras preposición:</em> \"interested in to learn\" ➔ ✅ <strong>interested in learning</strong>.</p>\n          <p>❌ <em>Confundir stop smoking con stop to smoke:</em> \"He stopped to smoke because it's bad for health\" ➔ ✅ <strong>He stopped smoking</strong>.</p>\n          <p>❌ <em>Infinitivo tras enjoy:</em> \"I enjoy to read\" ➔ ✅ <strong>I enjoy reading</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué significa la frase: 'She stopped to drink water'?",
        "opts": [
          "Se detuvo en el camino para beber agua.",
          "Dejó de beber agua por completo.",
          "Olvidó beber agua."
        ],
        "a": "Se detuvo en el camino para beber agua.",
        "exp": "'stop + to + inf' significa interrumpir lo que se estaba haciendo para realizar una nueva acción."
      },
      {
        "q": "Elige la forma correcta: 'She is very good at ____ languages.'",
        "opts": [
          "learning",
          "to learn",
          "learn"
        ],
        "a": "learning",
        "exp": "Tras la preposición 'at', cualquier verbo que le siga debe tomar forma de gerundio '-ing'."
      },
      {
        "q": "Señala la opción correcta: 'Did you remember ____ the oven before leaving?'",
        "opts": [
          "to turn off",
          "turning off",
          "turn off"
        ],
        "a": "to turn off",
        "exp": "Acordarse de cumplir una tarea pendiente requiere infinitivo: 'remember to do'."
      }
    ]
  },
  {
    "id": "a2_connectors_as_as",
    "level": "A2",
    "levelNum": 2,
    "title": "6 - 8. Conectores, Comparaciones de Igualdad y Pronombres Recíprocos",
    "icon": "🖇️",
    "summary": "Linking words lógicos, comparaciones tan... como (as... as) y pronombres recíprocos each other / one another.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Para dar fluidez y cohesión a tus textos necesitas conectar ideas con precisión lógica y comparar elementos en igualdad de condiciones.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🧩 6. Conectores Lógicos Clave (Linking Words)</h4>\n          <ul>\n            <li><strong>Añadir ideas:</strong> <em>and</em>, <em>also</em> (antes del verbo principal: <em>She also speaks French</em>), <em>too</em> (al final: <em>Me too</em>), <em>in addition</em> (formal).</li>\n            <li><strong>Contraste:</strong> <em>but</em> (une 2 oraciones), <em>however</em> (inicio de frase seguido de coma), <em>although</em> (aunque: <em>Although she was tired, she worked</em>), <em>on the other hand</em> (por otro lado).</li>\n            <li><strong>Causa y razón:</strong> <em>because</em> (no inicia frase sola de forma aislada), <em>since</em> («ya que»), <em>as</em> («dado que»).</li>\n            <li><strong>Consecuencia:</strong> <em>so</em> (cotidiano: <em>It was raining, so I stayed home</em>), <em>therefore</em> (formal: <em>therefore, we concluded that...</em>).</li>\n            <li><strong>Secuencia cronológica:</strong> <em>first, then, after that, finally</em>.</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚖️ 7. Comparaciones de Igualdad (as ... as)</h4>\n          <p>Estructura: <strong>sujeto + verbo + as + adjetivo + as</strong> (El adjetivo <strong>NO cambia</strong>, va en su forma base neutra):</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>This book is as interesting as the movie.</em> (Tan interesante como).</div>\n            <div class=\"grammar-example-item\">🔊 <em>My car isn't as fast as yours.</em> («No es tan rápido como» = forma suave de decir que es más lento).</div>\n            <div class=\"grammar-example-item\">🔊 <em>Does she speak as fluently as her brother?</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🔄 8. Pronombres Recíprocos (each other / one another)</h4>\n          <p>Expresan que la acción es mutua entre los sujetos participantes:</p>\n          <ul>\n            <li><em>They love each other.</em> (Se aman mutuamente).</li>\n            <li><em>We send each other gifts on birthdays.</em></li>\n            <li><em>The team members helped one another.</em></li>\n          </ul>\n          <p><em>En teoría tradicional, 'each other' es para dos y 'one another' para tres o más, pero hoy se usan indistintamente.</em></p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Combinar because y so en la misma frase:</em> \"Because it was raining, so I took a taxi\" ➔ ✅ <strong>Because it was raining, I took a taxi</strong>.</p>\n          <p>❌ <em>Alterar el adjetivo en as...as:</em> \"as faster as\" ➔ ✅ <strong>as fast as</strong>.</p>\n          <p>❌ <em>Usar however sin puntuación:</em> \"I liked it however it was pricey\" ➔ ✅ <strong>I liked it. However, it was pricey</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es la comparación de igualdad bien construida?",
        "opts": [
          "She is as smart as her sister.",
          "She is as smarter as her sister.",
          "She is so smart than her sister."
        ],
        "a": "She is as smart as her sister.",
        "exp": "En la estructura 'as... as', el adjetivo se mantiene inalterado en su grado positivo."
      },
      {
        "q": "Señala la frase correcta que evita la doble conjunción causa-consecuencia:",
        "opts": [
          "Although he was sick, he attended the meeting.",
          "Although he was sick, but he attended the meeting.",
          "Because he was sick, so he went home."
        ],
        "a": "Although he was sick, he attended the meeting.",
        "exp": "Nunca se deben duplicar conectores como 'Although... but' o 'Because... so' en una misma oración."
      },
      {
        "q": "¿Qué significa 'Romeo and Juliet loved each other'?",
        "opts": [
          "Romeo y Julieta se amaban mutuamente.",
          "Romeo amaba a otra persona.",
          "Julieta se amaba a sí misma."
        ],
        "a": "Romeo y Julieta se amaban mutuamente.",
        "exp": "'each other' es el pronombre recíproco que indica correspondencia mutua en la acción."
      }
    ]
  },
  {
    "id": "b1_advanced_tenses",
    "level": "B1",
    "levelNum": 3,
    "title": "1. Tiempos Verbales Continuos y Compuestos Avanzados",
    "icon": "⏳",
    "summary": "Present/Past Perfect Continuous, Future Continuous y Future Perfect Simple/Continuous.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En B1 lo crucial no es solo conjugar la forma, sino discernir con precisión cuándo elegir un aspecto continuo (duración, proceso) frente a uno simple (resultado definitivo).</p>\n\n        <div class=\"grammar-block\">\n          <h4>🌊 1.1 Present Perfect Continuous (have/has been + verbo-ing)</h4>\n          <p>Se centra en la <strong>duración o el proceso</strong> de una acción que comenzó en el pasado y conecta directamente con el presente:</p>\n          <ul>\n            <li><strong>Acción que aún continúa:</strong> <em>I have been studying English for two hours.</em></li>\n            <li><strong>Acciones repetidas recientes:</strong> <em>She has been going to the gym every morning.</em></li>\n            <li><strong>Evidencia física visible en el momento actual:</strong> <em>Why are you sweating? — Have you been running?</em></li>\n            <li><strong>Causa de cansancio:</strong> <em>They are exhausted because they have been working all day.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏪ 1.2 Past Perfect Continuous (had been + verbo-ing)</h4>\n          <p>Destaca la <strong>duración acumulada</strong> de una acción en progreso antes de que ocurriera otro hecho en el pasado:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>She had been waiting for an hour when the bus finally arrived.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>I was tired because I had been studying all night.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🔮 1.3 Future Continuous (will be + verbo-ing)</h4>\n          <p>Acción que <strong>estará en pleno desarrollo</strong> en un momento específico del futuro, o rutinas previstas de forma suave:</p>\n          <ul>\n            <li><em>This time tomorrow, I will be flying over the Atlantic.</em></li>\n            <li><em>Don't worry, I will be picking you up at 8.</em></li>\n            <li><strong>Preguntas de cortesía:</strong> <em>Will you be joining us for dinner tonight?</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏁 1.4 Future Perfect Simple (will have + participio)</h4>\n          <p>Acción que <strong>ya habrá concluido antes</strong> de un punto temporal futuro o de otra acción futura (suele ir con <em>by, by the time</em>):</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>By next month, I will have finished my thesis.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>They will have eaten before we arrive.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar verbos de estado en continuo:</em> \"I have been knowing him for years\" ➔ ✅ <strong>I have known him for years</strong>.</p>\n          <p>❌ <em>Future Continuous sin referencia temporal clara:</em> \"She will be calling at 5 if she remembers\" ➔ ✅ <strong>She will call at 5</strong>.</p>\n          <p>❌ <em>Confundir proceso con finalización:</em> \"At 10 a.m. I'll be finishing the report\" ➔ ✅ <strong>I will have finished</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Llegas a casa con la ropa empapada. Tu madre te pregunta:",
        "opts": [
          "Have you been walking in the rain?",
          "Have you walked in the rain?",
          "Had you been walk in the rain?"
        ],
        "a": "Have you been walking in the rain?",
        "exp": "Present Perfect Continuous explica la evidencia física presente ('empapado') a partir de una acción reciente."
      },
      {
        "q": "¿Qué tiempo expresa que algo ya estará terminado antes de una fecha futura?",
        "opts": [
          "Future Perfect Simple (will have finished)",
          "Future Continuous (will be finishing)",
          "Future Simple (will finish)"
        ],
        "a": "Future Perfect Simple (will have finished)",
        "exp": "El Future Perfect señala una acción que habrá concluido con anterioridad a un punto límite futuro."
      },
      {
        "q": "Completa: 'When the police arrived, the thieves ____ for three days.'",
        "opts": [
          "had been hiding",
          "have been hiding",
          "were hidden"
        ],
        "a": "had been hiding",
        "exp": "Una duración continuada previa a otro momento en el pasado exige Past Perfect Continuous."
      }
    ]
  },
  {
    "id": "b1_passive_voice",
    "level": "B1",
    "levelNum": 3,
    "title": "2. La Voz Pasiva: Transformación Completa y Usos",
    "icon": "🏭",
    "summary": "Fórmula general, tabla de conversión en todos los tiempos verbales y cuándo omitir o retener el agente (by...).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Se usa la voz pasiva cuando importa más <strong>lo que recibe la acción</strong> que quién la ejecuta. Es el estándar en noticias, ciencia, informes y redacción académica.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📐 Fórmula Constante e Inmutable</h4>\n          <div class=\"grammar-formula-card\">\n            <strong>Sujeto Receptor + Verbo 'TO BE' (en el tiempo de la activa) + PARTICIPIO PASADO (+ by Agente)</strong>\n          </div>\n          <p><em>El participio del verbo principal NUNCA cambia; solo se conjuga el verbo 'to be'.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📊 Tabla Maestra de Transformación Activa → Pasiva</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tiempo Verbal</th><th>Voz Activa</th><th>Voz Pasiva</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Present Simple</strong></td><td>They clean the office.</td><td>The office <strong>is cleaned</strong>.</td></tr>\n              <tr><td><strong>Present Continuous</strong></td><td>They are painting the house.</td><td>The house <strong>is being painted</strong>.</td></tr>\n              <tr><td><strong>Past Simple</strong></td><td>He repaired the car.</td><td>The car <strong>was repaired</strong>.</td></tr>\n              <tr><td><strong>Past Continuous</strong></td><td>She was writing the email.</td><td>The email <strong>was being written</strong>.</td></tr>\n              <tr><td><strong>Present Perfect</strong></td><td>They have delivered the package.</td><td>The package <strong>has been delivered</strong>.</td></tr>\n              <tr><td><strong>Past Perfect</strong></td><td>She had completed the report.</td><td>The report <strong>had been completed</strong>.</td></tr>\n              <tr><td><strong>Future Simple</strong></td><td>They will announce the results.</td><td>The results <strong>will be announced</strong>.</td></tr>\n              <tr><td><strong>Future Perfect</strong></td><td>He will have finished the task.</td><td>The task <strong>will have been finished</strong>.</td></tr>\n              <tr><td><strong>Modales</strong></td><td>You must sign this contract.</td><td>This contract <strong>must be signed</strong>.</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 Cuándo se Omite el Agente</h4>\n          <ul>\n            <li>No se sabe quién actúa: <em>My bike was stolen last night.</em></li>\n            <li>El agente es obvio o irrelevante: <em>The documents are signed every morning.</em></li>\n            <li>Se busca neutralidad o tono institucional: <em>The results will be published next week.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes en Pasiva</h5>\n          <p>❌ <em>Equivocar el tiempo de To Be:</em> \"The letter is written yesterday\" ➔ ✅ <strong>was written</strong>.</p>\n          <p>❌ <em>Usar gerundio en lugar de participio:</em> \"was writing by him\" ➔ ✅ <strong>was written by him</strong>.</p>\n          <p>❌ <em>Poner pronombre sujeto tras 'by':</em> \"by he\" ➔ ✅ <strong>by him</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es la pasiva correcta de: 'They are building a new hospital'?",
        "opts": [
          "A new hospital is being built.",
          "A new hospital was built.",
          "A new hospital is built."
        ],
        "a": "A new hospital is being built.",
        "exp": "Present Continuous pasivo = is/are + being + participio pasado ('is being built')."
      },
      {
        "q": "Transforma a pasiva: 'Shakespeare wrote Hamlet.'",
        "opts": [
          "Hamlet was written by Shakespeare.",
          "Hamlet is written by Shakespeare.",
          "Hamlet was wrote by Shakespeare."
        ],
        "a": "Hamlet was written by Shakespeare.",
        "exp": "Past Simple pasivo = was/were + participio pasado ('was written')."
      },
      {
        "q": "¿Por qué se omite el agente en: 'The thief was arrested'?",
        "opts": [
          "Porque es obvio que lo arrestó la policía.",
          "Porque el inglés prohíbe el agente.",
          "Porque el sujeto es plural."
        ],
        "a": "Porque es obvio que lo arrestó la policía.",
        "exp": "Cuando el agente es deducible y evidente por el contexto, se omite por concisión."
      }
    ]
  },
  {
    "id": "b1_reported_speech",
    "level": "B1",
    "levelNum": 3,
    "title": "3. Estilo Indirecto (Reported Speech)",
    "icon": "💬",
    "summary": "Transmisión de discursos: reglas de backshift temporal, cambios de pronombres, adverbios, preguntas y órdenes.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El estilo indirecto transmite lo que otra persona dijo sin citar textualmente: <em>She said: \"I am tired\" → She said that she was tired.</em> Cambian tiempos, pronombres y deícticos.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🔄 3.1 Tabla de Cambio de Tiempos (Backshift)</h4>\n          <p>Ocurre cuando el verbo introductorio está en pasado (<em>said, told, explained</em>):</p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Estilo Directo</th><th>Estilo Indirecto (Retroceso 1 paso)</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>Present Simple (<em>\"I work\"</em>)</td><td>Past Simple (<em>she worked</em>)</td></tr>\n              <tr><td>Present Continuous (<em>\"I am reading\"</em>)</td><td>Past Continuous (<em>he was reading</em>)</td></tr>\n              <tr><td>Present Perfect (<em>\"They have finished\"</em>)</td><td>Past Perfect (<em>they had finished</em>)</td></tr>\n              <tr><td>Past Simple (<em>\"We watched\"</em>)</td><td>Past Perfect (<em>they had watched</em>)</td></tr>\n              <tr><td>Past Continuous (<em>\"I was sleeping\"</em>)</td><td>Past Perfect Continuous (<em>she had been sleeping</em>)</td></tr>\n              <tr><td>will (<em>\"I will call you\"</em>)</td><td>would (<em>he would call me</em>)</td></tr>\n              <tr><td>can (<em>\"I can help\"</em>)</td><td>could (<em>she could help</em>)</td></tr>\n              <tr><td>am/is/are going to</td><td>was/were going to</td></tr>\n              <tr><td>Past Perfect / Condicionales</td><td><strong>No cambian</strong></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🧭 3.2 Cambios en Adverbios de Tiempo y Lugar</h4>\n          <p><em>today → that day | yesterday → the day before | tomorrow → the following day / the next day | here → there | now → then | ago → before</em>.</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>❓ 3.3 Preguntas en Reported Speech (¡Pierden la Inversión!)</h4>\n          <p>Al pasar a estilo indirecto, <strong>dejan de ser preguntas</strong>: el orden vuelve a ser Afirmativo (Sujeto + Verbo) y <strong>se eliminan do/does/did</strong>:</p>\n          <ul>\n            <li><strong>Preguntas Cerradas (Sí/No) → usan if / whether:</strong><br>\n            <em>\"Do you like pizza?\" → He asked if I liked pizza.</em> (No 'did I like').</li>\n            <li><strong>Preguntas Abiertas (Wh-):</strong><br>\n            <em>\"Where do you live?\" → She asked where I lived.</em> (Orden: interrogativo + sujeto + verbo).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📢 3.4 Órdenes y Peticiones (Verbo + to + infinitivo)</h4>\n          <p><em>\"Turn off your phone!\" → The teacher told us <strong>to turn off</strong> our phones.<br>\n          \"Please don't touch that\" → He asked me <strong>not to touch</strong> that.</em></p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Mantener la inversión en preguntas:</em> \"He asked where was she\" ➔ ✅ <strong>He asked where she was</strong>.</p>\n          <p>❌ <em>Confundir say y tell:</em> \"She told that...\" ➔ ✅ <strong>She said that...</strong> / <strong>She told ME that...</strong> (tell exige objeto directo de persona).</p>\n          <p>❌ <em>No adaptar tomorrow o here:</em> \"He said he would come tomorrow\" ➔ ✅ <strong>the next day</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Pasa a estilo indirecto: '\"Where is the hotel?\" she asked.'",
        "opts": [
          "She asked where the hotel was.",
          "She asked where was the hotel.",
          "She asked where is the hotel."
        ],
        "a": "She asked where the hotel was.",
        "exp": "En estilo indirecto se elimina la inversión: la frase adopta orden afirmativo (sujeto + verbo)."
      },
      {
        "q": "¿Cuál es la diferencia de uso entre 'say' y 'tell'?",
        "opts": [
          "'tell' requiere un objeto de persona (tell me), mientras que 'say' va directamente con 'that'",
          "'say' es solo para preguntas",
          "Son idénticos y se intercambian libremente"
        ],
        "a": "'tell' requiere un objeto de persona (tell me), mientras que 'say' va directamente con 'that'",
        "exp": "Decimos 'She said that...' o 'She told him that...'. 'She told that' es un error común."
      },
      {
        "q": "Pasa la orden a estilo indirecto: '\"Don't be late,\" my boss said.'",
        "opts": [
          "My boss told me not to be late.",
          "My boss told me don't be late.",
          "My boss said me not to be late."
        ],
        "a": "My boss told me not to be late.",
        "exp": "Las órdenes negativas se transforman con 'told + objeto + not to + infinitivo'."
      }
    ]
  },
  {
    "id": "b1_conditionals",
    "level": "B1",
    "levelNum": 3,
    "title": "4. Oraciones Condicionales (Cero, 1º, 2º y 3º)",
    "icon": "🔀",
    "summary": "Dominio de los cuatro condicionales canónicos: verdades científicas, futuro real, hipótesis y pasado irreal.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Las oraciones condicionales relacionan una condición (cláusula <em>if</em>) con su resultado en la cláusula principal. Si la cláusula <em>if</em> va al inicio, se separa con coma.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🧪 4.1 Condicional Cero (Hechos Siempre Ciertos)</h4>\n          <p>Leyes de la física, verdades científicas y normas automáticas:<br>\n          <strong>If + Present Simple, Present Simple</strong><br>\n          🔊 <em>If you heat ice, it melts. / If I drink coffee at night, I can't sleep.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>☀️ 4.2 Primer Condicional (Futuro Real o Probable)</h4>\n          <p>Decisiones reales, promesas o advertencias:<br>\n          <strong>If + Present Simple, will + verbo base</strong><br>\n          🔊 <em>If we get the tickets, we'll go to the concert. / If you don't hurry, you will miss the train.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>💭 4.3 Segundo Condicional (Hipotético o Improbable en Presente/Futuro)</h4>\n          <p>Situaciones imaginarias o contrarias a la realidad actual:<br>\n          <strong>If + Past Simple, would + verbo base</strong><br>\n          🔊 <em>If I won the lottery, I would buy an island.</em><br>\n          🔊 <em>If I were you, I would talk to the manager.</em> (Con el verbo to be se prefiere <strong>were</strong> para todas las personas: <em>If I were, If he were</em>).</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏳ 4.4 Tercer Condicional (Pasado Irreal / Imposible de Cambiar)</h4>\n          <p>Arrepentimientos, reproches o análisis de situaciones pasadas que ya no pueden alterarse:<br>\n          <strong>If + Past Perfect (had + participio), would have + participio pasado</strong><br>\n          🔊 <em>If I had studied harder, I would have passed the exam.</em> (Pero no estudié y suspendí).<br>\n          🔊 <em>If you had told me the truth, I wouldn't have been angry.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📊 Tabla Resumen de los 4 Condicionales</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tipo</th><th>Significado</th><th>Cláusula IF</th><th>Cláusula Principal</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Cero</strong></td><td>Hechos universales</td><td>Present Simple</td><td>Present Simple</td></tr>\n              <tr><td><strong>Primero</strong></td><td>Futuro probable</td><td>Present Simple</td><td>will + verbo base</td></tr>\n              <tr><td><strong>Segundo</strong></td><td>Hipotético presente</td><td>Past Simple (were)</td><td>would + verbo base</td></tr>\n              <tr><td><strong>Tercero</strong></td><td>Pasado irreal / Lamento</td><td>Past Perfect (had + part)</td><td>would have + participio</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con condicionales</h5>\n          <p>❌ <em>Poner will o would en la cláusula con IF:</em> \"If it will rain...\" ➔ ✅ <strong>If it rains...</strong> / \"If I would have money...\" ➔ ✅ <strong>If I had money...</strong></p>\n          <p>❌ <em>Mezclar tiempos entre el primero y segundo:</em> \"If I win the lottery, I'd travel\" ➔ ✅ <strong>If I won... I'd...</strong> o <strong>If I win... I will...</strong></p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Elige la forma correcta del Segundo Condicional para dar un consejo:",
        "opts": [
          "If I were you, I would accept the job offer.",
          "If I was you, I will accept the job offer.",
          "If I had been you, I would accept the job offer."
        ],
        "a": "If I were you, I would accept the job offer.",
        "exp": "En el segundo condicional formal se usa 'If I were you' seguido de 'would' + verbo base."
      },
      {
        "q": "Señala la opción correcta: 'If you ____ water to 100 degrees, it ____.'",
        "opts": [
          "heat / boils",
          "will heat / boils",
          "heat / will boil"
        ],
        "a": "heat / boils",
        "exp": "Las leyes físicas científicas se expresan con el Condicional Cero (Presente Simple en ambas cláusulas)."
      },
      {
        "q": "Completa el Tercer Condicional: 'If they had taken the train, they ____ on time.'",
        "opts": [
          "would have arrived",
          "would arrive",
          "will have arrived"
        ],
        "a": "would have arrived",
        "exp": "La consecuencia del tercer condicional se estructura con 'would have' + participio pasado."
      }
    ]
  },
  {
    "id": "b1_wish_if_only",
    "level": "B1",
    "levelNum": 3,
    "title": "5. Wish e If Only: Deseos y Arrepentimientos",
    "icon": "🌠",
    "summary": "Expresar 'ojalá' en presente (wish + past simple), pasado (wish + past perfect) y quejas de conducta (wish + would).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En inglés, <strong>wish</strong> e <strong>if only</strong> no se traducen literalmente como 'desear', sino como <strong>«ojalá»</strong>: expresan frustración, nostalgia o deseos sobre situaciones contrarias a la realidad actual.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📐 Las 3 Estructuras Clave</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tipo de Deseo</th><th>Estructura</th><th>Ejemplos Explicados</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Presente</strong><br>(Algo que quisiéramos que fuera diferente ahora)</td><td><strong>wish / if only + Past Simple</strong><br>(con 'to be' se prefiere <em>were</em>)</td><td><em>I wish I had more free time.</em> («Ojalá tuviera más tiempo libre»).<br><em>I wish I were taller.</em><br><em>I wish I could speak Japanese.</em> (could para habilidades).</td></tr>\n              <tr><td><strong>Pasado</strong><br>(Arrepentimiento por algo que ocurrió o no)</td><td><strong>wish / if only + Past Perfect</strong><br>(had + participio)</td><td><em>I wish I had studied more for the exam.</em> («Ojalá hubiera estudiado más»).<br><em>She wishes she hadn't said that.</em></td></tr>\n              <tr><td><strong>Conducta Ajena</strong><br>(Molestia o queja sobre la actitud de otra persona)</td><td><strong>wish + otro sujeto + would + verbo base</strong></td><td><em>I wish you would stop complaining!</em> («¡Ojalá dejaras de quejarte!»).<br><em>I wish it would stop raining.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>💥 If Only</h4>\n          <p>Tiene idéntica sintaxis que <em>wish</em> pero aporta <strong>mayor intensidad dramática y emocional</strong>. Puede funcionar solo como exclamación:<br>\n          <em>If only I had known!</em> («¡Si al menos lo hubiera sabido!»).</p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar presente simple tras wish:</em> \"I wish I have a car\" ➔ ✅ <strong>I wish I had a car</strong>.</p>\n          <p>❌ <em>Usar wish + would para uno mismo:</em> \"I wish I would study more\" ➔ ✅ <strong>I wish I studied more</strong> (would solo se usa para otros sujetos o cosas externas).</p>\n          <p>❌ <em>Usar pasado simple para arrepentimientos:</em> \"I wish I went to the party\" ➔ ✅ <strong>I wish I had gone to the party</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "No tienes dinero suficiente hoy. ¿Cómo dices 'Ojalá tuviera más dinero'?",
        "opts": [
          "I wish I had more money.",
          "I wish I have more money.",
          "I wish I would have more money."
        ],
        "a": "I wish I had more money.",
        "exp": "Para un deseo sobre una situación presente contraria a la realidad, se usa 'wish + Past Simple'."
      },
      {
        "q": "Tu hermano hace mucho ruido mientras estudias. Quieres expresar tu molestia:",
        "opts": [
          "I wish you would be quiet.",
          "I wish you are quiet.",
          "I wish you will be quiet."
        ],
        "a": "I wish you would be quiet.",
        "exp": "Para quejas sobre la conducta molesta de otra persona se emplea 'wish + otro sujeto + would'."
      },
      {
        "q": "¿Qué significa: 'She wishes she had accepted the job'?",
        "opts": [
          "Se arrepiente de no haber aceptado el empleo.",
          "Quiere aceptar el empleo en el futuro.",
          "Rechazará el empleo mañana."
        ],
        "a": "Se arrepiente de no haber aceptado el empleo.",
        "exp": "'wish + Past Perfect' expresa arrepentimiento irreversible sobre una oportunidad pasada que no se aprovechó."
      }
    ]
  },
  {
    "id": "b1_relative_clauses",
    "level": "B1",
    "levelNum": 3,
    "title": "6. Oraciones de Relativo: Defining vs. Non-Defining",
    "icon": "🧬",
    "summary": "Especificativas (sin comas, uso de that) vs Explicativas (con comas, nunca that). Pronombres who, which, whose, where, when.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Las cláusulas relativas aportan información sobre un sustantivo sin necesidad de fragmentar el discurso en oraciones breves.</p>\n\n        <div class=\"grammar-block\">\n          <h4>⚔️ Los 2 Tipos Fundamentales</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Aspecto</th><th>Defining (Especificativas)</th><th>Non-Defining (Explicativas)</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Función</strong></td><td>Información <strong>esencial</strong> para identificar al sustantivo</td><td>Información <strong>extra / complementaria</strong> prescindible</td></tr>\n              <tr><td><strong>Comas</strong></td><td><strong>NUNCA llevan comas</strong></td><td><strong>SIEMPRE van entre comas</strong></td></tr>\n              <tr><td><strong>Pronombre 'That'</strong></td><td>Totalmente permitido y muy común</td><td><strong>PROHIBIDO usar 'that'</strong> (solo who/which/whose)</td></tr>\n              <tr><td><strong>Omisión del relativo</strong></td><td>Se puede omitir <strong>si funciona como objeto</strong>:<br><em>That's the book (that) I bought.</em></td><td><strong>NUNCA se puede omitir</strong> el pronombre</td></tr>\n              <tr><td><strong>Ejemplo</strong></td><td><em>The woman who lives next door is a doctor.</em></td><td><em>My brother, who lives in London, is an architect.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏷️ Pronombres Relativos Clave</h4>\n          <ul>\n            <li><strong>Who:</strong> Para personas (sujeto u objeto): <em>The girl who called me.</em></li>\n            <li><strong>Which:</strong> Para cosas o animales, o para resumir toda una frase anterior: <em>He was late, which annoyed me.</em></li>\n            <li><strong>That:</strong> Para personas o cosas, <strong>exclusivamente en defining clauses</strong>.</li>\n            <li><strong>Whose («cuyo/a/os/as»):</strong> Posesión; siempre va seguido de un sustantivo sin artículo: <em>The boy whose dog ran away.</em></li>\n            <li><strong>Where / When:</strong> Para lugares y momentos concretos: <em>The café where we met; The year when I graduated.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar 'that' en oraciones entre comas:</em> \"My car, that was bought in 2020, is red\" ➔ ✅ <strong>My car, which was bought in 2020, is red</strong>.</p>\n          <p>❌ <em>Omitir el relativo cuando es sujeto:</em> \"The man fixed my car was kind\" ➔ ✅ <strong>The man who fixed my car...</strong></p>\n          <p>❌ <em>Repetir el pronombre en la cláusula:</em> \"The woman who she lives there\" ➔ ✅ <strong>The woman who lives there</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Señala la frase correcta con una cláusula no definitoria (non-defining):",
        "opts": [
          "The Eiffel Tower, which was built in 1889, is in Paris.",
          "The Eiffel Tower, that was built in 1889, is in Paris.",
          "The Eiffel Tower which was built in 1889 is in Paris."
        ],
        "a": "The Eiffel Tower, which was built in 1889, is in Paris.",
        "exp": "Las cláusulas non-defining van entre comas y NUNCA admiten 'that', sino 'which'."
      },
      {
        "q": "¿En cuál de las siguientes frases se puede omitir el relativo?",
        "opts": [
          "This is the movie (that) I watched yesterday.",
          "The doctor who treated me was excellent.",
          "The girl who called you is waiting outside."
        ],
        "a": "This is the movie (that) I watched yesterday.",
        "exp": "El relativo se puede omitir únicamente en defining clauses cuando actúa como objeto del verbo ('I watched the movie')."
      },
      {
        "q": "Completa con el pronombre de posesión: 'The author ____ book became a bestseller.'",
        "opts": [
          "whose",
          "who's",
          "which"
        ],
        "a": "whose",
        "exp": "'whose' expresa posesión ('cuyo libro'). 'who's' es la contracción de 'who is'."
      }
    ]
  },
  {
    "id": "b1_adv_comparatives",
    "level": "B1",
    "levelNum": 3,
    "title": "7. Comparativos Avanzados, Proporciones y Semejanzas",
    "icon": "📈",
    "summary": "The more... the more..., graduación con adverbios (much, slightly, far) y distinción entre Like vs As / As if.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Para argumentar con madurez estilística necesitas matizar comparaciones y expresar cómo el cambio en una variable produce un cambio en otra.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🔄 7.1 Comparaciones Proporcionales (The more..., the more...)</h4>\n          <p>Estructura: <strong>The + comparativo + sujeto + verbo, the + comparativo + sujeto + verbo</strong>:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The more you study, the more you learn.</em> (Cuanto más estudias, más aprendes).</div>\n            <div class=\"grammar-example-item\">🔊 <em>The less sugar you eat, the healthier you feel.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>The sooner we leave, the better.</em> (Fórmula fija abreviada: Cuanto antes, mejor).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎚️ 7.2 Reforzar o Suavizar el Comparativo con Adverbios de Grado</h4>\n          <p>Van <strong>justo antes</strong> del comparativo completo:</p>\n          <ul>\n            <li><strong>Intensificadores Fuertes:</strong> <em>much, far, a lot, significantly, considerably, way</em> (coloquial).<br>\n            🔊 <em>This exam is <strong>much harder</strong> than the previous one.</em><br>\n            🔊 <em>The new model is <strong>significantly more efficient</strong>.</em></li>\n            <li><strong>Atenuadores Leves:</strong> <em>slightly, a bit, a little, somewhat</em>.<br>\n            🔊 <em>He looks <strong>slightly older</strong> now.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎭 7.3 Like vs. As / As If / As Though</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Conector</th><th>Uso Gramatical</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Like + sustantivo</strong></td><td>Semejanza física o de apariencia («parecido a»)</td><td><em>She sings like a professional. / He runs like cheetah.</em></td></tr>\n              <tr><td><strong>As + función / cargo</strong></td><td>Rol, trabajo o identidad real («en calidad de»)</td><td><em>She works as a nurse. / He was hired as manager.</em></td></tr>\n              <tr><td><strong>As if / As though</strong></td><td>«Como si» + oración con verbo hipotético</td><td><em>He behaves as if he were rich. / She talks as though she knew everything.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Omitir 'The' en comparaciones proporcionales:</em> \"More you practice, better you get\" ➔ ✅ <strong>The more you practice, the better you get</strong>.</p>\n          <p>❌ <em>Posición errónea del adverbio de grado:</em> \"more comfortable much\" ➔ ✅ <strong>much more comfortable</strong>.</p>\n          <p>❌ <em>Confundir like y as de profesión:</em> \"I work like a teacher\" ➔ ✅ <strong>I work as a teacher</strong> (salvo que solo te disfraces de profesor).</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cómo se dice en inglés: 'Ella trabaja de médica'?",
        "opts": [
          "She works as a doctor.",
          "She works like a doctor.",
          "She works how a doctor."
        ],
        "a": "She works as a doctor.",
        "exp": "Para cargos, profesiones o roles reales desempeñados se usa 'as'."
      },
      {
        "q": "Completa la proporción: 'The harder you train, ____ you become.'",
        "opts": [
          "the stronger",
          "stronger",
          "the more strong"
        ],
        "a": "the stronger",
        "exp": "Ambas mitades de la correlación deben comenzar con 'The' + forma comparativa."
      },
      {
        "q": "¿Qué matiz aporta 'slightly' en: 'This phone is slightly more expensive'?",
        "opts": [
          "Apenas / un poco más caro",
          "Muchísimo más caro",
          "Completamente gratis"
        ],
        "a": "Apenas / un poco más caro",
        "exp": "'slightly' es un modificador de grado que atenúa la diferencia comparativa a un margen mínimo."
      }
    ]
  },
  {
    "id": "b1_preferences_opinions",
    "level": "B1",
    "levelNum": 3,
    "title": "8. Preferencias: Would Rather vs. Would Prefer y Sujeto Impersonal 'It'",
    "icon": "⚖️",
    "summary": "Sintaxis de would rather (verbo base) vs would prefer (to-infinitive), cambios de sujeto y estructuras impersonales con it.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Expresar preferencias con corrección sintáctica distingue a un estudiante intermedio: la elección de partículas y tiempos verbales varía según haya uno o dos sujetos.</p>\n\n        <div class=\"grammar-block\">\n          <h4>☕ Would Rather vs. Would Prefer (Mismo Sujeto)</h4>\n          <ul>\n            <li><strong>Would rather + VERBO BASE SIN TO:</strong><br>\n            🔊 <em>I'd rather stay home tonight than go out.</em><br>\n            Negativa: <strong>would rather not + verbo</strong> (<em>I'd rather not discuss this</em>).</li>\n            <li><strong>Would prefer + TO + VERBO:</strong><br>\n            🔊 <em>I'd prefer to stay home tonight.</em><br>\n            Comparando sustantivos/-ing: <em>I prefer tea to coffee; She prefers reading to watching TV.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>👥 Sujetos Distintos: Cuando quieres que OTRO haga algo</h4>\n          <p>Cuando el sujeto de la preferencia es diferente de quien realiza la acción, el verbo siguiente pasa a <strong>Past Simple (valor subjuntivo/hipotético)</strong>:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>Sujeto 1 + would rather + Sujeto 2 + PAST SIMPLE</strong>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>I'd rather you stayed with us tonight.</em> («Preferiría que te quedaras»).</div>\n            <div class=\"grammar-example-item\">🔊 <em>She'd rather we didn't mention this to anyone.</em> («Ella preferiría que no dijéramos nada»).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏛️ Opiniones con Estructuras Impersonales (Sujeto 'It')</h4>\n          <p>Aportan un tono objetivo, académico y neutro a ensayos y presentaciones:</p>\n          <ul>\n            <li><em>It seems that the results are positive.</em> (Impresión cautelosa).</li>\n            <li><em>It is likely / unlikely that inflation will rise.</em> (Probabilidad).</li>\n            <li><em>It is obvious / clear / evident that more resources are needed.</em></li>\n            <li><em>It is important that students arrive on time.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Poner 'to' tras would rather:</em> \"I'd rather to stay\" ➔ ✅ <strong>I'd rather stay</strong>.</p>\n          <p>❌ <em>Usar 'than' con prefer:</em> \"I prefer tea than coffee\" ➔ ✅ <strong>I prefer tea to coffee</strong>.</p>\n          <p>❌ <em>Omitir 'it' en oraciones impersonales:</em> \"Seems that she left\" ➔ ✅ <strong>It seems that she left</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué estructura corresponde a: 'Preferiría que vinieras mañana'?",
        "opts": [
          "I'd rather you came tomorrow.",
          "I'd rather you to come tomorrow.",
          "I'd rather you come tomorrow."
        ],
        "a": "I'd rather you came tomorrow.",
        "exp": "Con sujetos distintos, 'would rather' exige el verbo en Past Simple con valor hipotético."
      },
      {
        "q": "Señala la opción correcta para comparar gustos generales con 'prefer':",
        "opts": [
          "I prefer cycling to driving.",
          "I prefer cycling than driving.",
          "I prefer cycling instead driving."
        ],
        "a": "I prefer cycling to driving.",
        "exp": "El verbo 'prefer' se construye con la preposición 'to' entre los dos elementos comparados."
      },
      {
        "q": "Completa la frase: 'I would rather ____ at home tonight.'",
        "opts": [
          "stay",
          "to stay",
          "staying"
        ],
        "a": "stay",
        "exp": "'would rather' va seguido de un infinitivo sin 'to' (bare infinitive)."
      }
    ]
  },
  {
    "id": "b1_modals_deduction",
    "level": "B1",
    "levelNum": 3,
    "title": "9. Verbos Modales en Contexto: Deducción vs. Posibilidad",
    "icon": "🕵️",
    "summary": "Deducción lógica con pruebas (Must / Can't) vs posibilidad e incertidumbre sin pruebas (May / Might / Could).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El uso de verbos modales cambia por completo según si tienes evidencias lógicas contundentes para deducir un hecho o si simplemente estás especulando sobre una posibilidad.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🔍 9.1 Modales de Deducción Lógica (Hay Pruebas Evidentes)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Grado de Certeza</th><th>Modal en Presente</th><th>Ejemplo con Evidencia</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Casi Seguro (99% Afirmativo)</strong></td><td><strong>Must + verbo base</strong></td><td><em>He must be exhausted. He has been running for 3 hours!</em></td></tr>\n              <tr><td><strong>Imposible (99% Negativo)</strong></td><td><strong>Can't + verbo base</strong></td><td><em>She can't be at home. I just saw her at the airport!</em></td></tr>\n            </tbody>\n          </table>\n          <p><em>⚠️ ATENCIÓN: El opuesto de 'must be' en deducción NO es 'must not be', sino <strong>CAN'T BE</strong>.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎲 9.2 Modales de Posibilidad (Sin Pruebas, Especulación Pura)</h4>\n          <p>Indican un 30% - 50% de probabilidad incierta:</p>\n          <ul>\n            <li><strong>May:</strong> Posibilidad algo más probable o formal: <em>She may arrive late due to traffic.</em></li>\n            <li><strong>Might:</strong> Posibilidad más tentativa o remota: <em>He might be in the library, but I'm not sure.</em></li>\n            <li><strong>Could:</strong> Posibilidad teórica o neutral: <em>It could rain this afternoon.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🕰️ Deducción y Posibilidad en el Pasado (+ have + participio)</h4>\n          <div class=\"grammar-formula-card\">\n            <strong>Modal + HAVE + Participio Pasado</strong>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>You <strong>must have left</strong> your keys in the car.</em> (Certeza casi absoluta).</div>\n            <div class=\"grammar-example-item\">🔊 <em>He <strong>can't have said</strong> that. It's totally unlike him!</em> (Imposibilidad lógica pasada).</div>\n            <div class=\"grammar-example-item\">🔊 <em>They <strong>might have taken</strong> a different train.</em> (Posibilidad incierta en pasado).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Decir 'mustn't' para imposibilidad:</em> \"He mustn't be the thief\" ➔ ✅ <strong>He can't be the thief</strong>.</p>\n          <p>❌ <em>Usar presente para deducir hechos pasados:</em> \"He must be tired yesterday\" ➔ ✅ <strong>He must have been tired yesterday</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Ves las luces apagadas y el coche no está. ¿Qué deducción es la correcta?",
        "opts": [
          "They can't be at home.",
          "They mustn't be at home.",
          "They don't have to be at home."
        ],
        "a": "They can't be at home.",
        "exp": "Para expresar que algo es lógicamente imposible ante la evidencia, se usa 'can't be'."
      },
      {
        "q": "Juan estudió 14 horas seguidas. Concluyes:",
        "opts": [
          "He must be very tired.",
          "He might be very tired.",
          "He should be very tired."
        ],
        "a": "He must be very tired.",
        "exp": "'must' expresa una deducción lógica afirmativa de máxima certeza respaldada por pruebas."
      },
      {
        "q": "Llegas y la puerta está forzada. ¿Qué dices en pasado?",
        "opts": [
          "Someone must have broken the lock.",
          "Someone must break the lock.",
          "Someone can have broken the lock."
        ],
        "a": "Someone must have broken the lock.",
        "exp": "La deducción de certeza sobre un hecho pasado se construye con 'must have' + participio."
      }
    ]
  },
  {
    "id": "b1_cleft_emphasis",
    "level": "B1",
    "levelNum": 3,
    "title": "10. Estructuras Enfáticas: Cleft Sentences e Inversión",
    "icon": "✨",
    "summary": "It-cleft (It was Sarah who...), What-cleft (What I need is...), inversiones con adverbios negativos e inversión en condicionales sin if.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Las estructuras de hendidura (<em>cleft sentences</em>) y las inversiones reorganizan los elementos de la oración para destacar intencionadamente quién, qué, cuándo o dónde ocurrió la acción.</p>\n\n        <div class=\"grammar-block\">\n          <h4>💡 10.1 It-Cleft (Hendidura con 'It')</h4>\n          <p>Fórmula: <strong>It + to be + Elemento Enfatizado + who / that + resto de la oración</strong></p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">Original: <em>Sarah designed the whole website.</em><br>\n            Enfática: 🔊 <strong>It was Sarah who designed</strong> the whole website. (Enfatiza al sujeto).</div>\n            <div class=\"grammar-example-item\">Original: <em>We discovered the truth last night.</em><br>\n            Enfática: 🔊 <strong>It was last night that</strong> we discovered the truth. (Enfatiza el momento).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 10.2 What-Cleft (Pseudo-Cleft con 'What')</h4>\n          <p>Fórmula: <strong>What + sujeto + verbo + is / was + elemento focal</strong></p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">Original: <em>I need a short vacation.</em><br>\n            Enfática: 🔊 <strong>What I need is</strong> a short vacation.</div>\n            <div class=\"grammar-example-item\">🔊 <strong>What surprised me most was</strong> her calm reaction.</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ 10.3 Inversión Enfática con Adverbios Negativos o Restrictivos</h4>\n          <p>Cuando abres la frase con un adverbio restrictivo, <strong>se invierte el orden del auxiliar y el sujeto (como en una pregunta)</strong>:</p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Adverbio Inicial</th><th>Estructura Invertida</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Never</strong></td><td>Never + auxiliar + sujeto + verbo</td><td><em>Never have I seen such beauty.</em></td></tr>\n              <tr><td><strong>Rarely / Seldom</strong></td><td>Rarely + auxiliar + sujeto + verbo</td><td><em>Rarely do we witness such courage.</em></td></tr>\n              <tr><td><strong>Hardly ... when</strong></td><td>Hardly + had + sujeto + part + when...</td><td><em>Hardly had I arrived when the phone rang.</em></td></tr>\n              <tr><td><strong>Not only ... but also</strong></td><td>Not only + aux + sujeto + verbo, but also...</td><td><em>Not only did she win, but she also set a record.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📜 10.4 Inversión en Condicionales (Sin 'If', Formal)</h4>\n          <ul>\n            <li><strong>1º Condicional:</strong> <em>If you need help → <strong>Should you need any help</strong>, let me know.</em></li>\n            <li><strong>2º Condicional:</strong> <em>If she were here → <strong>Were she here</strong>, she would help us.</em></li>\n            <li><strong>3º Condicional:</strong> <em>If they had arrived earlier → <strong>Had they arrived earlier</strong>, they would have caught the train.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>No invertir tras adverbio negativo:</em> \"Never I have seen\" ➔ ✅ <strong>Never have I seen</strong>.</p>\n          <p>❌ <em>Mantener 'if' con inversión:</em> \"If had I known\" ➔ ✅ <strong>Had I known</strong>.</p>\n          <p>❌ <em>Omitir el relativo en it-cleft:</em> \"It was Sarah baked the cake\" ➔ ✅ <strong>It was Sarah WHO baked the cake</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Convierte a It-cleft enfatizando a 'Tom': 'Tom broke the antique window.'",
        "opts": [
          "It was Tom who broke the antique window.",
          "What Tom broke was the window.",
          "It is Tom broke the window."
        ],
        "a": "It was Tom who broke the antique window.",
        "exp": "La estructura It-cleft se forma con: It + was + Tom + who + resto de la oración."
      },
      {
        "q": "Aplica inversión formal con 'Never': 'I have never experienced such hospitality.'",
        "opts": [
          "Never have I experienced such hospitality.",
          "Never I have experienced such hospitality.",
          "Never did I experienced such hospitality."
        ],
        "a": "Never have I experienced such hospitality.",
        "exp": "Al colocar 'Never' al inicio, se invierte el orden del auxiliar y el sujeto: 'Never have I...'"
      },
      {
        "q": "¿Cómo se invierte formalmente sin 'if': 'If you should have any questions, call me'?",
        "opts": [
          "Should you have any questions, call me.",
          "If should you have questions, call me.",
          "Had you have questions, call me."
        ],
        "a": "Should you have any questions, call me.",
        "exp": "La inversión de primer condicional formal sustituye 'If you should' por 'Should you'."
      }
    ]
  },
  {
    "id": "b1_causatives",
    "level": "B1",
    "levelNum": 3,
    "title": "11. Estructuras Causativas (Have, Get, Make, Let, Help)",
    "icon": "🔧",
    "summary": "Hacer que otro actúe: encargar servicios (have/get something done), persuadir, obligar (make) y permitir (let).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Las estructuras causativas se utilizan cuando el sujeto no realiza la acción directamente con sus manos, sino que encarga, persuade, obliga o permite que otra persona la lleve a cabo.</p>\n\n        <div class=\"grammar-block\">\n          <h4>💈 1. Causativa de Servicio: Have / Get Something Done</h4>\n          <p>Describe una acción que encargamos a un profesional o que nos ocurre pasivamente:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>Sujeto + HAVE / GET (conjugado) + Objeto (cosa) + PARTICIPIO PASADO</strong>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>I had my hair cut yesterday.</em> (Fui a la peluquería; no me lo corté yo mismo).</div>\n            <div class=\"grammar-example-item\">🔊 <em>We need to have our roof repaired.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>He got his car serviced before the trip.</em> (Get es algo más informal).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🗣️ 2. Causativa Activa de Persuasión: Get Alguien to Do</h4>\n          <p>Indica lograr que alguien haga algo mediante convencimiento o insistencia:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>Sujeto + GET + Persona + TO + INFINITIVO</strong> (¡El 'to' es obligatorio!)\n          </div>\n          <p>🔊 <em>I got my brother to help me move the furniture.</em></p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ 3. Make vs. Let vs. Have (Activa sin 'to')</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Verbo</th><th>Significado</th><th>Fórmula</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Make</strong></td><td>Obligación, imposición forzosa o emoción inevitable</td><td>Sujeto + make + persona + <strong>verbo base (sin to)</strong></td><td><em>Her parents made her clean her room. / That movie made me cry.</em></td></tr>\n              <tr><td><strong>Let</strong></td><td>Permiso («dejar que», dar autorización)</td><td>Sujeto + let + persona + <strong>verbo base (sin to)</strong></td><td><em>My boss let me leave early today.</em></td></tr>\n              <tr><td><strong>Have</strong> (activa)</td><td>Encargo laboral, delegación jerárquica</td><td>Sujeto + have + persona + <strong>verbo base (sin to)</strong></td><td><em>The manager had the team submit the report.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes con causativas</h5>\n          <p>❌ <em>Decir \"I cut my hair\" cuando fuiste a la peluquería:</em> ➔ ✅ <strong>I had my hair cut</strong>.</p>\n          <p>❌ <em>Poner 'to' tras make o let:</em> \"She made me to cry\" ➔ ✅ <strong>She made me cry</strong>.</p>\n          <p>❌ <em>Olvidar el 'to' con get:</em> \"I got him clean the car\" ➔ ✅ <strong>I got him TO clean the car</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Fuiste al taller mecánico para cambiar el aceite de tu coche. ¿Cómo lo expresas?",
        "opts": [
          "I had the oil changed.",
          "I changed the oil myself.",
          "I made the oil change."
        ],
        "a": "I had the oil changed.",
        "exp": "have + objeto + participio ('had the oil changed') es la estructura estándar para servicios contratados."
      },
      {
        "q": "Señala la frase correcta con el causativo 'make':",
        "opts": [
          "The teacher made the students rewrite the essay.",
          "The teacher made the students to rewrite the essay.",
          "The teacher made the students rewriting the essay."
        ],
        "a": "The teacher made the students rewrite the essay.",
        "exp": "'make + persona' rige un infinitivo sin 'to' (bare infinitive)."
      },
      {
        "q": "Completa con 'get': 'She finally got her friend ____ with her.'",
        "opts": [
          "to come",
          "come",
          "coming"
        ],
        "a": "to come",
        "exp": "'get + persona' exige 'to' obligatorio delante del infinitivo: 'got her friend to come'."
      }
    ]
  },
  {
    "id": "b2_mixed_conditionals",
    "level": "B2",
    "levelNum": 4,
    "title": "1.1 - 1.2 Condicionales Mixtos y Future in the Past",
    "icon": "🔀",
    "summary": "Combinación de marcos temporales cruzados (pasado que afecta al presente y condición actual que afectó al pasado) y el futuro visto desde el pasado.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El nivel B2 domina la fluidez temporal: los condicionales ya no siguen fórmulas rígidas, sino que combinan tiempos distintos en la condición y en el resultado.</p>\n\n        <div class=\"grammar-block\">\n          <h4>⏳ 1. Condicional Mixto Tipo A: Condición Pasada → Consecuencia Presente</h4>\n          <p>Un hecho que <strong>no ocurrió en el pasado</strong> sigue afectando el estado de cosas <strong>hoy en día</strong>:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>If + Past Perfect, WOULD + Verbo Base (o would be + -ing)</strong>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>If I had studied medicine, I would be a doctor now.</em><br>\n            (En el pasado no estudié medicina → Hoy no soy médico).</div>\n            <div class=\"grammar-example-item\">🔊 <em>If you had told me the truth yesterday, we wouldn't be in this mess today.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>If she had taken the job in Paris, she would live in France now.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>💎 2. Condicional Mixto Tipo B: Condición Presente → Consecuencia Pasada</h4>\n          <p>Un rasgo permanente o situación <strong>actual</strong> explica por qué algo ocurrió o no en el <strong>pasado</strong>:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>If + Past Simple (were), WOULD HAVE + Participio Pasado</strong>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>If I weren't so shy, I would have joined the theatre group last year.</em><br>\n            (Soy tímido habitualmente → Por eso el año pasado no me uní).</div>\n            <div class=\"grammar-example-item\">🔊 <em>If he spoke fluent French, he would have applied for the position in Geneva.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🕰️ 3. Future in the Past (El Futuro Visto Desde el Pasado)</h4>\n          <p>Expresa intenciones, planes o promesas que en un momento pretérito pertenecían al futuro:</p>\n          <ul>\n            <li><strong>was / were going to + verbo base:</strong> Intención o plan previo, frecuentemente frustrado:<br>\n            🔊 <em>I was going to call you last night, but my phone battery died.</em><br>\n            🔊 <em>We were going to buy that house, but someone made a higher offer.</em></li>\n            <li><strong>would + verbo base:</strong> Predicción, expectativa o promesa formulada en el pasado:<br>\n            🔊 <em>He promised he would help me later; I knew she would call eventually.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar would en la cláusula 'if':</em> \"If she would have studied, she would be happy\" ➔ ✅ <strong>If she had studied...</strong></p>\n          <p>❌ <em>Omitir 'going to' en planes pasados frustrados:</em> \"I would call you last night\" ➔ ✅ <strong>I was going to call you</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué condicional mixto expresa: 'No ahorré dinero en mi juventud y hoy dependo de préstamos'?",
        "opts": [
          "If I had saved money, I wouldn't need to borrow today.",
          "If I saved money, I wouldn't have needed to borrow today.",
          "If I had saved money, I wouldn't have needed to borrow today."
        ],
        "a": "If I had saved money, I wouldn't need to borrow today.",
        "exp": "Condición en el pasado (Past Perfect: 'had saved') con efecto directo en el presente (would + base: 'wouldn't need today')."
      },
      {
        "q": "Tenías la intención de ir al cine anoche pero empezó a llover torrencialmente. Dices:",
        "opts": [
          "I was going to go to the cinema, but it poured with rain.",
          "I would go to the cinema, but it poured with rain.",
          "I had gone to the cinema, but it poured with rain."
        ],
        "a": "I was going to go to the cinema, but it poured with rain.",
        "exp": "'was/were going to' es la estructura canónica de 'Future in the Past' para planes previos frustrados."
      },
      {
        "q": "Señala la frase con condición permanente actual y resultado en el pasado:",
        "opts": [
          "If she weren't so stubborn, she would have accepted the offer.",
          "If she hadn't been stubborn, she would be happy.",
          "If she were stubborn, she will accept the offer."
        ],
        "a": "If she weren't so stubborn, she would have accepted the offer.",
        "exp": "If + past simple ('weren't') para rasgo de personalidad actual + 'would have' + participio para resultado pasado."
      }
    ]
  },
  {
    "id": "b2_adv_modals",
    "level": "B2",
    "levelNum": 4,
    "title": "2. Modales Avanzados de Deducción y 'Be Supposed To'",
    "icon": "🔍",
    "summary": "Deducción retrospectiva con must have, can't have, might have y expectativas o normativas con be supposed to.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En B2 los verbos modales se combinan con aspectos perfectos y de continuo para evaluar el pasado, emitir juicios críticos y graduar la expectativa social.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🕵️ 2.1 Deducción Retrospectiva (Modal + Have + Participio)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Estructura</th><th>Grado de Certeza</th><th>Ejemplo Explicado</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Must have + participio</strong></td><td>Casi seguro (99% certeza lógica)</td><td><em>You must have left your wallet at the restaurant.</em> (Es la única explicación lógica).</td></tr>\n              <tr><td><strong>Can't / Couldn't have + part.</strong></td><td>Imposibilidad lógica absoluta en el pasado</td><td><em>He can't have committed the crime; he was in Madrid!</em></td></tr>\n              <tr><td><strong>Might / May / Could have + part.</strong></td><td>Posibilidad incierta o especulativa</td><td><em>They might have taken a wrong turn on the motorway.</em></td></tr>\n              <tr><td><strong>Should have + part.</strong></td><td>Obligación no cumplida / Crítica</td><td><em>You should have called to let us know you were safe.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📋 2.2 Be Supposed To (Expectativas, Normas y Planes)</h4>\n          <p>Equivale a <em>«se supone que...», «debería...» o «está programado que...»</em>. Es más suave que <em>must</em> o <em>have to</em>:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>Sujeto + BE (conjugado) + SUPPOSED TO + Verbo Base</strong>\n          </div>\n          <ul>\n            <li><strong>Presente (norma o expectativa vigente):</strong><br>\n            🔊 <em>You are supposed to submit your assignments via the online portal.</em><br>\n            🔊 <em>He is supposed to be at work by 9:00 a.m.</em></li>\n            <li><strong>Pasado (a menudo implica que el plan NO se cumplió):</strong><br>\n            🔊 <em>She was supposed to call me yesterday, but she forgot.</em><br>\n            🔊 <em>The train was supposed to arrive at noon, but it was delayed.</em></li>\n            <li><strong>Negativa (prohibición moderada o regla):</strong><br>\n            🔊 <em>You are not supposed to park your vehicle in front of the gate.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Omitir 'to be' en supposed to:</em> \"She supposed to call me\" ➔ ✅ <strong>She was supposed to call me</strong>.</p>\n          <p>❌ <em>Poner participio erróneo tras can't have:</em> \"He can't have went\" ➔ ✅ <strong>He can't have gone</strong>.</p>\n          <p>❌ <em>Poner gerundio tras supposed to:</em> \"supposed to cleaning\" ➔ ✅ <strong>supposed to clean</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "El tren debía llegar a las 10:00 pero aún no ha llegado a las 10:30. Dices:",
        "opts": [
          "The train was supposed to arrive at 10:00.",
          "The train supposed to arrive at 10:00.",
          "The train was supposing to arrive at 10:00."
        ],
        "a": "The train was supposed to arrive at 10:00.",
        "exp": "'was/were supposed to' expresa una expectativa o horario previo que no se ha cumplido."
      },
      {
        "q": "¿Qué deducción pasada expresa imposibilidad absoluta ante una coartada?",
        "opts": [
          "He can't have stolen the money.",
          "He mustn't have stolen the money.",
          "He shouldn't have stolen the money."
        ],
        "a": "He can't have stolen the money.",
        "exp": "'can't have' + participio es la fórmula universal para la deducción negativa de imposibilidad pasada."
      },
      {
        "q": "Señala la frase correcta con reproche por un deber no cumplido:",
        "opts": [
          "You should have backed up your computer files.",
          "You must have backed up your computer files.",
          "You could have to back up your computer files."
        ],
        "a": "You should have backed up your computer files.",
        "exp": "'should have' + participio expresa que era aconsejable realizar una acción, pero no se hizo."
      }
    ]
  },
  {
    "id": "b2_adv_wish_time",
    "level": "B2",
    "levelNum": 4,
    "title": "3. Wish Avanzado, Would Sooner y 'It's High Time'",
    "icon": "⏳",
    "summary": "I wish I could vs had known, would sooner, estructuras críticas con It's time / It's high time e I hope vs I expect.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El nivel B2 profundiza en las estructuras de deseo, preferencia y urgencia temporal con matices estilísticos formales y literarios.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🎭 3.1 I Wish I Could vs. I Wish I Had Known</h4>\n          <ul>\n            <li><strong>I wish I could (+ base):</strong> Limitación presente o futura con distanciamiento irreal:<br>\n            🔊 <em>I wish I could travel more, but work keeps me tied down.</em></li>\n            <li><strong>I wish I had known (+ participio):</strong> Arrepentimiento irreversible por falta de información pasada:<br>\n            🔊 <em>I wish I had known about the delay before leaving home.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🍷 3.2 Would Sooner (Matiz Formal / Literario)</h4>\n          <p>Equivale a <em>would rather</em> pero con un registro más formal y elevado:</p>\n          <ul>\n            <li><strong>Mismo sujeto:</strong> <em>I would sooner walk five miles than take that crowded bus.</em></li>\n            <li><strong>Sujeto distinto:</strong> <em>I'd sooner he didn't attend the ceremony.</em> (Verbo en Past Simple con valor hipotético).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏰ 3.3 It's Time vs. It's High Time (Urgencia y Crítica)</h4>\n          <p>¡Estructura clave de exámenes internacionales (Cambridge FCE/CAE)!</p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Estructura</th><th>Matiz y Significado</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>It's time + to + infinitivo</strong></td><td>Momento oportuno (neutral, sin sujeto)</td><td><em>It's time to go to bed.</em></td></tr>\n              <tr><td><strong>It's time + SUJETO + PAST SIMPLE</strong></td><td>Ya es hora de que alguien haga algo (irreal)</td><td><em>It's time we made a decision.</em></td></tr>\n              <tr><td><strong>It's HIGH time + SUJETO + PAST SIMPLE</strong></td><td><strong>Tono crítico de reproche</strong>: ¡debería haberse hecho ya!</td><td><em>It's high time you cleaned your room!</em><br><em>It's high time the government took action.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🔮 3.4 I Hope vs. I Expect</h4>\n          <ul>\n            <li><strong>I hope (+ Present Simple):</strong> Deseo optimista sobre algo posible en el futuro:<br>\n            🔊 <em>I hope she passes her driving test tomorrow.</em></li>\n            <li><strong>I expect (+ will / to + inf):</strong> Suposición lógica, racional y previsible basada en indicios:<br>\n            🔊 <em>I expect the train will be on time. / I expect them to finish today.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Poner presente tras It's high time:</em> \"It's high time you clean your room\" ➔ ✅ <strong>It's high time you CLEANED your room</strong>.</p>\n          <p>❌ <em>Infinitivo tras It's high time:</em> \"It's high time to go\" ➔ ✅ <strong>It's high time we WENT</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "El proyecto lleva 2 semanas de retraso y el director exige acción inmediata con reproche:",
        "opts": [
          "It's high time we finished this project.",
          "It's high time to finish this project.",
          "It's high time we will finish this project."
        ],
        "a": "It's high time we finished this project.",
        "exp": "'It's high time' exige un sujeto seguido de un verbo en Past Simple con valor de urgencia crítica."
      },
      {
        "q": "Deseas que tu hermano tenga éxito mañana en su entrevista de trabajo. Dices:",
        "opts": [
          "I hope you pass the interview tomorrow.",
          "I wish you pass the interview tomorrow.",
          "I wish you will pass the interview tomorrow."
        ],
        "a": "I hope you pass the interview tomorrow.",
        "exp": "Para deseos positivos y posibles sobre el futuro se emplea 'I hope' + Present Simple, nunca 'wish'."
      },
      {
        "q": "¿Cuál es la frase correcta con 'would sooner' y sujetos diferentes?",
        "opts": [
          "I'd sooner you didn't tell her.",
          "I'd sooner you not to tell her.",
          "I'd sooner you don't tell her."
        ],
        "a": "I'd sooner you didn't tell her.",
        "exp": "Al igual que 'would rather', 'would sooner' con sujeto distinto rige Past Simple hipotético."
      }
    ]
  },
  {
    "id": "b2_adv_reported",
    "level": "B2",
    "levelNum": 4,
    "title": "4. Discurso Indirecto Avanzado y Reporting Verbs",
    "icon": "🗣️",
    "summary": "Reporting verbs especializados (claim, deny, admit, warn, advise) y su régimen con gerundio o infinitivo.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En B2 superamos la repetición monótona de <em>said</em> y <em>told</em> para utilizar verbos de reporte precisos que capturan la intención, emoción y fuerza del hablante.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🗂️ 4.1 Reporting Verbs y sus Patrones Sintácticos</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Patrón Sintáctico</th><th>Verbos de Reporte</th><th>Ejemplos</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Verbo + -ing (Gerundio)</strong><br>(Acciones ya pasadas que se admiten o niegan)</td><td><em>admit, deny, recommend, suggest, mention</em></td><td><em>He <strong>denied stealing</strong> the confidential documents.</em><br><em>She <strong>admitted lying</strong> to the committee.</em><br><em>They <strong>suggested postponing</strong> the event.</em> (¡Nunca 'suggested to postpone'!).</td></tr>\n              <tr><td><strong>Verbo + TO + Infinitivo</strong><br>(Intenciones, compromisos y promesas futuras)</td><td><em>agree, promise, offer, refuse, decide, threaten</em></td><td><em>He <strong>refused to sign</strong> the contract.</em><br><em>She <strong>promised to help</strong> us with the move.</em><br><em>They <strong>offered to pay</strong> for the damages.</em></td></tr>\n              <tr><td><strong>Verbo + ALGUIEN + TO + Infinitivo</strong><br>(Instrucciones y consejos dirigidos a personas)</td><td><em>warn, advise, remind, encourage, invite, persuade</em></td><td><em>The doctor <strong>advised him to quit</strong> smoking.</em><br><em>She <strong>warned us not to walk</strong> alone at night.</em><br><em>He <strong>reminded me to send</strong> the file.</em></td></tr>\n              <tr><td><strong>Verbo + THAT + Subordinada</strong><br>(Afirmaciones y alegaciones)</td><td><em>claim, explain, announce, insist, complain</em></td><td><em>She <strong>claimed that</strong> she had discovered the cure.</em><br><em>He <strong>insisted that</strong> he was completely innocent.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>❓ 4.2 Preguntas Indirectas Educadas (Polite Indirect Questions)</h4>\n          <p>Utilizadas en contextos formales, cartas oficiales o al tratar con desconocidos:</p>\n          <div class=\"grammar-formula-card\">\n            Fórmulas: <em>Could you tell me... / Do you know... / I was wondering if... / Would you mind telling me...</em>\n          </div>\n          <p><strong>REGLA FUNDAMENTAL:</strong> El orden es <strong>estrictamente AFIRMATIVO (Sujeto + Verbo)</strong> sin auxiliares do/does/did:</p>\n          <ul>\n            <li>Directa: <em>Where is the train station?</em><br>\n            Indirecta: 🔊 <em>Could you tell me where the train station <strong>is</strong>?</em> (No 'where is the station').</li>\n            <li>Directa: <em>Does this train go to Oxford?</em><br>\n            Indirecta: 🔊 <em>Do you know <strong>if this train goes</strong> to Oxford?</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar infinitivo con suggest:</em> \"He suggested to go to the park\" ➔ ✅ <strong>He suggested going to the park</strong> / <strong>suggested that we go</strong>.</p>\n          <p>❌ <em>Invertir en preguntas indirectas:</em> \"Could you tell me where is the office?\" ➔ ✅ <strong>where the office is</strong>.</p>\n          <p>❌ <em>Infinitivo tras deny:</em> \"He denied to take the money\" ➔ ✅ <strong>He denied taking the money</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es la formulación correcta con 'suggest'?",
        "opts": [
          "She suggested postponing the meeting.",
          "She suggested to postpone the meeting.",
          "She suggested us to postpone the meeting."
        ],
        "a": "She suggested postponing the meeting.",
        "exp": "'suggest' NUNCA va seguido de 'to + infinitivo'. Requiere gerundio '-ing' o cláusula 'that we postpone'."
      },
      {
        "q": "Formula una pregunta indirecta muy formal: 'What time does the conference start?'",
        "opts": [
          "Could you tell me what time the conference starts?",
          "Could you tell me what time does the conference start?",
          "Could you tell me what time starts the conference?"
        ],
        "a": "Could you tell me what time the conference starts?",
        "exp": "En las preguntas indirectas educadas, se elimina el auxiliar 'does' y se adopta orden afirmativo: sujeto + verbo ('the conference starts')."
      },
      {
        "q": "El sospechoso afirmó que él no había robado el diamante. Transforma con 'deny':",
        "opts": [
          "The suspect denied stealing the diamond.",
          "The suspect denied to steal the diamond.",
          "The suspect denied that to steal the diamond."
        ],
        "a": "The suspect denied stealing the diamond.",
        "exp": "'deny' rige gerundio '-ing' ('denied stealing') para acciones pasadas negadas."
      }
    ]
  },
  {
    "id": "b2_causatives_pro",
    "level": "B2",
    "levelNum": 4,
    "title": "5. Causativas Avanzadas en Inglés Profesional y Académico",
    "icon": "💼",
    "summary": "Have activo vs pasivo en entornos laborales, get vs make, y causativa frente a voz pasiva pura.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En inglés corporativo y técnico, las estructuras causativas permiten sonar impersonal, profesional y centrado en los resultados sin sonar autoritario.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🏢 5.1 Have Activo vs. Pasivo en el Trabajo</h4>\n          <ul>\n            <li><strong>Activa (nombra al profesional / empleado):</strong><br>\n            <em>The project manager <strong>had the team submit</strong> the final report before noon.</em><br>\n            (Estructura: have + persona + <strong>verbo base sin to</strong>).</li>\n            <li><strong>Pasiva (se enfoca exclusivamente en el entregable):</strong><br>\n            <em>The project manager <strong>had the report submitted</strong> before noon.</em><br>\n            (Estructura: have + documento/cosa + <strong>participio pasado</strong>).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚔️ 5.2 Causativa frente a Voz Pasiva Simple</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Oración</th><th>Enfoque y Matiz Comunicativo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><em>The report was printed yesterday.</em> (Pasiva simple)</td><td>Describe neutralmente el hecho; no se sabe quién lo ordenó.</td></tr>\n              <tr><td><em>The manager had the report printed yesterday.</em> (Causativa)</td><td><strong>Enfatiza la gestión y encargo</strong> del manager, que delegó la tarea.</td></tr>\n              <tr><td><em>The assistant printed the report yesterday.</em> (Activa)</td><td>Foco en quién ejecutó físicamente la acción.</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 5.3 Cuadro Resumen Comparativo de Causativas</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Verbo</th><th>Matiz</th><th>Sintaxis Activa</th><th>Sintaxis Pasiva</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Have</strong></td><td>Encargo laboral, delegación neutra</td><td>have + persona + <strong>base (sin to)</strong></td><td>have + cosa + <strong>participio</strong></td></tr>\n              <tr><td><strong>Get</strong></td><td>Persuasión, esfuerzo o convencimiento</td><td>get + persona + <strong>TO + inf</strong></td><td>get + cosa + <strong>participio</strong></td></tr>\n              <tr><td><strong>Make</strong></td><td>Obligación estricta / imposición</td><td>make + persona + <strong>base (sin to)</strong></td><td>[be made to + inf en pasiva]</td></tr>\n              <tr><td><strong>Let</strong></td><td>Permiso / autorización sin fuerza</td><td>let + persona + <strong>base (sin to)</strong></td><td>[be allowed to en pasiva]</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Pasiva de let:</em> \"I was let to go\" ➔ ✅ <strong>I was allowed to go</strong>.</p>\n          <p>❌ <em>Pasiva cuando se quiere expresar gestión:</em> \"The documents were translated yesterday\" (si quieres destacar que la empresa lo encargó: <strong>The company had the documents translated</strong>).</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "El director logró que el cliente firmara el acuerdo tras horas de negociación. Elige la opción adecuada:",
        "opts": [
          "The director got the client to sign the agreement.",
          "The director had the client to sign the agreement.",
          "The director made the client to sign the agreement."
        ],
        "a": "The director got the client to sign the agreement.",
        "exp": "'get someone to do' denota persuasión tras esfuerzo o negociación."
      },
      {
        "q": "¿Cuál es la forma pasiva de: 'They made him clean the floor'?",
        "opts": [
          "He was made to clean the floor.",
          "He was made clean the floor.",
          "He was let clean the floor."
        ],
        "a": "He was made to clean the floor.",
        "exp": "En voz pasiva, 'make' recupera obligatoriamente la partícula 'to': 'was made to clean'."
      },
      {
        "q": "Señala la frase causativa profesional con resultado como foco:",
        "opts": [
          "We had the software updated by the IT department.",
          "We updated the software by IT.",
          "We made IT to update the software."
        ],
        "a": "We had the software updated by the IT department.",
        "exp": "have + cosa ('the software') + participio ('updated') centra la atención en el resultado gestionado."
      }
    ]
  },
  {
    "id": "b2_adv_connectors",
    "level": "B2",
    "levelNum": 4,
    "title": "6. Conectores Gramaticales Avanzados y Pares Coordinados",
    "icon": "🧩",
    "summary": "So/Such that, In spite of vs Although, As long as / Provided that / Unless, y paralelismo en pares correlativos.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El uso riguroso de conectores lógicos y estructuras correlativas permite enlazar argumentos complejos sin incurrir en redundancias ni desajustes sintácticos.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🌟 6.1 So ... That vs. Such (a) ... That («Tan ... Que»)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Estructura</th><th>Regla</th><th>Ejemplos</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>So + adjetivo / adverbio + that</strong></td><td>Modifica directamente a la cualidad</td><td><em>The movie was <strong>so interesting that</strong> I watched it twice.</em><br><em>He ran <strong>so quickly that</strong> nobody could catch him.</em></td></tr>\n              <tr><td><strong>Such a / an + adjetivo + sustantivo singular + that</strong></td><td>Con sustantivo contable singular</td><td><em>It was <strong>such a beautiful day that</strong> we went sailing.</em></td></tr>\n              <tr><td><strong>Such + adjetivo + sustantivo plural / incontable + that</strong></td><td>Sin 'a/an' para plurales e incontables</td><td><em>They are <strong>such good friends that</strong> they share everything.</em><br><em>He gave us <strong>such useful advice that</strong> we succeeded.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🌧️ 6.2 In Spite Of / Despite vs. Although / Even Though</h4>\n          <p>Expresan concesión o contraste («a pesar de» / «aunque»), pero exigen diferente categoría gramatical:</p>\n          <ul>\n            <li><strong>In spite of / Despite + SUSTANTIVO, PRONOMBRE o VERBO-ING:</strong><br>\n            🔊 <em><strong>Despite the heavy rain</strong>, they continued the marathon.</em> (Nunca 'Despite of').<br>\n            🔊 <em><strong>In spite of being injured</strong>, she finished the race.</em></li>\n            <li><strong>Although / Even though + ORACIÓN COMPLETA (Sujeto + Verbo):</strong><br>\n            🔊 <em><strong>Although it was raining heavily</strong>, they continued the match.</em><br>\n            🔊 <em><strong>Even though he studied hard</strong>, he failed the test.</em> (Even though es más enfático).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚖️ 6.3 Pares Correlativos y Paralelismo Sintáctico</h4>\n          <ul>\n            <li><strong>Not only ... but also:</strong> Exige la misma categoría gramatical en ambas partes. Si abre la frase, requiere inversión:<br>\n            <em>Not only did she win the competition, but she also broke the world record.</em></li>\n            <li><strong>Neither ... nor («Ni... ni»):</strong> La negación ya está implícita en la partícula (no añadir don't/didn't):<br>\n            <em>Neither the manager nor the assistant was available.</em> (El verbo concuerda con el sujeto más próximo).</li>\n            <li><strong>Whether ... or:</strong> Presenta dos alternativas abiertas:<br>\n            <em>Whether you agree or not, the policy will be implemented.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Poner 'of' tras despite:</em> \"Despite of the cold\" ➔ ✅ <strong>Despite the cold</strong> o <strong>In spite of the cold</strong>.</p>\n          <p>❌ <em>Poner oración completa tras despite:</em> \"Despite he was tired\" ➔ ✅ <strong>Despite being tired</strong> o <strong>Although he was tired</strong>.</p>\n          <p>❌ <em>So + sustantivo:</em> \"so a nice house\" ➔ ✅ <strong>such a nice house</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Elige la opción correcta para completar: '____ the traffic jam, we arrived on time.'",
        "opts": [
          "Despite",
          "Although",
          "Even though"
        ],
        "a": "Despite",
        "exp": "'the traffic jam' es un sintagma nominal (sustantivo), por lo que exige 'Despite' o 'In spite of'."
      },
      {
        "q": "Completa con la correlación de consecuencia: 'It was ____ pleasant weather that we stayed outdoors.'",
        "opts": [
          "such",
          "such a",
          "so"
        ],
        "a": "such",
        "exp": "'weather' es incontable, por lo que no puede llevar el artículo 'a'; corresponde 'such pleasant weather'."
      },
      {
        "q": "¿Qué error contiene la frase: 'Not only she finished early, but she also got full marks'?",
        "opts": [
          "Falta la inversión auxiliar-sujeto tras 'Not only' al inicio",
          "Debe usarse 'and' en vez de 'but also'",
          "El verbo 'finished' debe ir en presente"
        ],
        "a": "Falta la inversión auxiliar-sujeto tras 'Not only' al inicio",
        "exp": "Al iniciar con 'Not only', se debe invertir: 'Not only did she finish early, but she also...'"
      }
    ]
  },
  {
    "id": "b2_adv_relatives",
    "level": "B2",
    "levelNum": 4,
    "title": "7. Oraciones de Relativo Avanzadas y Estructuras Integradas",
    "icon": "🔗",
    "summary": "Preposición + relativo formal (to which, with whom), cláusulas relativas integradas y sustitutos formales.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En inglés formal y académico, las preposiciones no se dejan colgando al final de la frase, sino que se anteponen al pronombre relativo adecuado.</p>\n\n        <div class=\"grammar-block\">\n          <h4>👔 7.1 Preposición + Relativo (Registro Formal vs Coloquial)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Registro Coloquial (Prep al final)</th><th>Registro Académico / Formal (Prep delante)</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>This is the house <em>I grew up in</em>.</td><td>This is the house <strong>in which</strong> I grew up.</td></tr>\n              <tr><td>The colleague <em>I was talking to</em> is German.</td><td>The colleague <strong>to whom</strong> I was speaking is German.</td></tr>\n              <tr><td>The proposal <em>we voted on</em> was rejected.</td><td>The proposal <strong>on which</strong> we voted was rejected.</td></tr>\n            </tbody>\n          </table>\n          <p><strong>REGLAS ESTRICTAS:</strong> Solo se puede usar <strong>WHICH</strong> para cosas e ideas, y <strong>WHOM</strong> para personas. <strong>¡NUNCA se puede usar 'that' tras una preposición!</strong> (❌ <em>about that</em> ➔ ✅ <em>about which</em>).</p>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📦 7.2 Oraciones Relativas Integradas (Embedded Clauses)</h4>\n          <p>Se incrustan en grupos nominales complejos sin comas, frecuentemente apoyadas en sustantivos abstractos:<br>\n          <em>the fact that... / the idea that... / the assumption that... / the belief that...</em></p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The claim <strong>that the drug was unsafe</strong> damaged the laboratory's reputation.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>We discussed the proposal <strong>that the client had submitted earlier</strong>.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏛️ 7.3 Sustitutos Formales de Tiempo, Lugar y Causa</h4>\n          <ul>\n            <li><em>when</em> ➔ <strong>on which / in which</strong> (<em>the day on which we met</em>).</li>\n            <li><em>where</em> ➔ <strong>in which / at which</strong> (<em>the venue at which the summit took place</em>).</li>\n            <li><em>why</em> ➔ <strong>for which / the reason for which</strong> (<em>the reason for which she resigned</em>).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Preposición con 'that':</em> \"The topic about that we argued\" ➔ ✅ <strong>about WHICH we argued</strong>.</p>\n          <p>❌ <em>Preposición con 'who':</em> \"The man to who I spoke\" ➔ ✅ <strong>to WHOM I spoke</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Elige la construcción formal correcta para un artículo científico:",
        "opts": [
          "The hypothesis on which this study is based has been verified.",
          "The hypothesis on that this study is based has been verified.",
          "The hypothesis which this study is based on it has been verified."
        ],
        "a": "The hypothesis on which this study is based has been verified.",
        "exp": "En registro formal, la preposición precede al relativo: 'on which'. Con preposición nunca se usa 'that'."
      },
      {
        "q": "¿Qué pronombre relativo corresponde tras preposición cuando se refiere a un ser humano?",
        "opts": [
          "whom",
          "who",
          "which"
        ],
        "a": "whom",
        "exp": "Tras preposición, el pronombre relativo para personas es obligatoriamente 'whom' (with whom, to whom)."
      },
      {
        "q": "¿Cómo se formaliza 'the reason why she left'?",
        "opts": [
          "the reason for which she left",
          "the reason to which she left",
          "the reason at which she left"
        ],
        "a": "the reason for which she left",
        "exp": "'why' equivale en registro culto a 'for which' ('por la cual')."
      }
    ]
  },
  {
    "id": "b2_participles_ing",
    "level": "B2",
    "levelNum": 4,
    "title": "8. Participios (-ed / -ing), Cláusulas Reducidas y Sentido Pasivo",
    "icon": "✂️",
    "summary": "Adjetivos en -ed vs -ing, frases reducidas con participio de presente/pasado y la pasiva con being + participio.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Las cláusulas reducidas con participio condensan dos frases en una sola sin conectores explícitos. Son el sello característico del inglés académico y periodístico.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🎭 8.1 Participios como Adjetivos: -ed vs. -ing</h4>\n          <ul>\n            <li><strong>Terminación -ed:</strong> Cómo se <em>siente</em> una persona (el sujeto recibe la sensación):<br>\n            <em>She felt disappointed; He is bored.</em> (Suelen ir con <em>feel, seem, look, be</em>).</li>\n            <li><strong>Terminación -ing:</strong> La cualidad o estímulo que <em>provoca</em> esa emoción en los demás:<br>\n            <em>The lecture was boring; Her explanation was confusing.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>✂️ 8.2 Frases Reducidas con Participio (Mismo Sujeto)</h4>\n          <p><strong>Requisito indispensable:</strong> Ambas acciones deben compartir exactamente el mismo sujeto.</p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tipo</th><th>Función</th><th>Transformación</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Participio Presente (-ing)</strong></td><td>Sujeto activo, acción simultánea o causal</td><td><em>Students who are preparing for exams...</em> ➔<br><strong>Students preparing for exams</strong> often feel stressed.<br><em>Because she worked hard...</em> ➔ <strong>Working hard</strong>, she rose to the top.</td></tr>\n              <tr><td><strong>Participio Pasado (-ed)</strong></td><td>Sujeto pasivo o resultado previo</td><td><em>The documents that were signed yesterday...</em> ➔<br><strong>The documents signed yesterday</strong> were archived.<br><em>Because he was exhausted by the trip...</em> ➔ <strong>Exhausted by the trip</strong>, he went to bed.</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🛡️ 8.3 Sentido Pasivo con -ing: Being + Participio Pasado</h4>\n          <p>Expresa recibir una acción en posiciones sintácticas que exigen terminación -ing (sujetos, tras preposiciones):</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <strong>Como sujeto:</strong> <em><strong>Being told what to do</strong> all the time is exhausting.</em></div>\n            <div class=\"grammar-example-item\">🔊 <strong>Tras verbos de emoción:</strong> <em>He absolutely hates <strong>being corrected</strong> in public.</em></div>\n            <div class=\"grammar-example-item\">🔊 <strong>Tras preposición:</strong> <em>She was tired of <strong>being treated</strong> like a child.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Sujetos desalineados (Dangling Participle):</em> \"Walking through the park, the birds were singing\" (¡parece que los pájaros caminaban!) ➔ ✅ <strong>Walking through the park, I heard the birds singing</strong>.</p>\n          <p>❌ <em>Infinitivo en lugar de participio pasivo:</em> \"hates being tell\" ➔ ✅ <strong>hates being told</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Señala la frase reducida con participio que no tiene error de sujeto desalineado:",
        "opts": [
          "Opening the envelope, she discovered the winning ticket.",
          "Opening the envelope, the ticket fell to the floor.",
          "Having eaten dinner, the TV was turned on."
        ],
        "a": "Opening the envelope, she discovered the winning ticket.",
        "exp": "El sujeto de la acción 'Opening' debe ser la misma persona que realiza la acción principal ('she')."
      },
      {
        "q": "Completa con el sentido pasivo de gerundio: 'Nobody enjoys ____ in front of colleagues.'",
        "opts": [
          "being criticized",
          "to be criticized",
          "been criticized"
        ],
        "a": "being criticized",
        "exp": "Tras 'enjoy' se requiere forma de gerundio pasivo: 'being' + participio pasado ('criticized')."
      },
      {
        "q": "¿Qué significa: 'The book was so gripping that I stayed awake all night'?",
        "opts": [
          "El libro era tan fascinante / atrapante que me quedé despierto toda la noche.",
          "El libro estaba tan aburrido que me dormí.",
          "El libro era tan largo que no lo terminé."
        ],
        "a": "El libro era tan fascinante / atrapante que me quedé despierto toda la noche.",
        "exp": "'gripping' es un adjetivo en '-ing' que denota la cualidad de atrapar intensamente la atención."
      }
    ]
  },
  {
    "id": "b2_impersonal_subjunctive",
    "level": "B2",
    "levelNum": 4,
    "title": "9. Expresiones Impersonales en Pasiva y Subjuntivo Formal",
    "icon": "🏛️",
    "summary": "It is said that vs Subject + is said to, infinitivo simple vs perfecto y el subjuntivo formal con forma base.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Las estructuras impersonales permiten transmitir hallazgos, noticias o creencias compartidas sin comprometer una opinión personal, otorgando autoridad científica o institucional.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📰 9.1 Pasiva Impersonal: 2 Modelos Sintácticos</h4>\n          <p>Para verbos como <em>say, believe, think, report, expect, consider, understand, allege</em>:</p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Modelo</th><th>Estructura</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Estructura 1 (Sujeto vacío 'It')</strong></td><td><strong>It + be en pasiva + that + oración</strong></td><td><em><strong>It is said that</strong> she speaks six languages fluently.</em><br><em><strong>It was believed that</strong> the building was safe.</em></td></tr>\n              <tr><td><strong>Estructura 2 (Compacta y formal)</strong></td><td><strong>Sujeto + be en pasiva + TO + Infinitivo</strong></td><td><em><strong>She is said to speak</strong> six languages fluently.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏪ Infinitivo Simple vs. Infinitivo Perfecto</h4>\n          <ul>\n            <li><strong>Infinitivo Simple (to + verbo base):</strong> La acción es simultánea a la afirmación:<br>\n            🔊 <em>He is thought to be an undercover agent.</em> (Se cree ahora que es agente ahora).</li>\n            <li><strong>Infinitivo Perfecto (to have + participio):</strong> La acción ocurrió ANTES de la afirmación:<br>\n            🔊 <em>She is believed <strong>to have escaped</strong> through the window.</em> (Se cree hoy que escapó anoche).<br>\n            🔊 <em>The president is reported <strong>to have resigned</strong>.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚖️ 9.2 El Subjuntivo Formal (Mandato y Necesidad)</h4>\n          <p>Expresa exigencias, recomendaciones o normas institucionales. La regla es asombrosamente sencilla: <strong>el verbo va SIEMPRE en su FORMA BASE pura para todas las personas</strong> (¡sin -s en tercera persona!):</p>\n          <div class=\"grammar-formula-card\">\n            Tras verbos como <em>suggest, recommend, demand, insist, propose that...</em><br>\n            O adjetivos como <em>it is essential / vital / imperative / crucial that...</em>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The committee recommends that she <strong>attend</strong> the conference.</em> (No 'attends').</div>\n            <div class=\"grammar-example-item\">🔊 <em>It is vital that every member <strong>be</strong> present.</em> (Forma base 'be', nunca 'is' ni 'are').</div>\n            <div class=\"grammar-example-item\">🔊 <em>They insisted that he <strong>not leave</strong> the premises.</em> (Negativa: 'not' antes del verbo, sin do/does).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Añadir -s al subjuntivo formal:</em> \"suggested that he arrives\" ➔ ✅ <strong>suggested that he ARRIVE</strong>.</p>\n          <p>❌ <em>Usar indicativo con 'be':</em> \"It is essential that everyone is ready\" ➔ ✅ <strong>It is essential that everyone BE ready</strong>.</p>\n          <p>❌ <em>Infinitivo simple cuando la acción fue previa:</em> \"He is believed to rob the bank yesterday\" ➔ ✅ <strong>to have robbed</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Convierte a la estructura compacta: 'People say that the CEO is very wealthy.'",
        "opts": [
          "The CEO is said to be very wealthy.",
          "It is said the CEO to be wealthy.",
          "The CEO is saying to be very wealthy."
        ],
        "a": "The CEO is said to be very wealthy.",
        "exp": "Sujeto + be pasivo ('is said') + infinitivo simple ('to be very wealthy')."
      },
      {
        "q": "Se cree que el sospechoso huyó a Brasil el mes pasado. Elige la opción correcta:",
        "opts": [
          "The suspect is believed to have fled to Brazil.",
          "The suspect is believed to flee to Brazil.",
          "The suspect is believed to had fled to Brazil."
        ],
        "a": "The suspect is believed to have fled to Brazil.",
        "exp": "Al ser la acción de huir anterior al momento actual en que se cree, se emplea infinitivo perfecto ('to have fled')."
      },
      {
        "q": "Aplica subjuntivo formal: 'The judge ordered that the prisoner ____ (remain) in custody.'",
        "opts": [
          "remain",
          "remains",
          "remained"
        ],
        "a": "remain",
        "exp": "El subjuntivo formal rige forma base ('remain') sin añadir '-s' de tercera persona."
      }
    ]
  },
  {
    "id": "c1_verbal_aspects",
    "level": "C1",
    "levelNum": 5,
    "title": "1. Aspectos Verbales y Cohesión Temporal Académica",
    "icon": "🎓",
    "summary": "Perfect Simple vs Continuous estratégico en papers, futuro avanzado (be bound to, was to) y secuencia temporal (sequence of tenses).",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En C1 el estudiante pasa de la mera corrección sintáctica al <strong>dominio del matiz discursivo</strong>: elegir cada tiempo según su efecto pragmático y su impacto retórico en el lector.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🎯 1.1 Combinación Estratégica: Perfect Simple vs. Continuous</h4>\n          <p><strong>Regla mnemotécnica académica:</strong> <em>El aspecto Perfecto CIERRA; el aspecto Continuo MANTIENE ABIERTO.</em></p>\n          <ul>\n            <li><strong>Perfect Simple (have/had/will have + participio):</strong> Presenta resultados definitivos, hallazgos culminados o datos concluyentes.<br>\n            🔊 <em>She has written three comprehensive reports today.</em> (3 informes terminados).</li>\n            <li><strong>Perfect Continuous (have/had/will have been + -ing):</strong> Enfatiza el esfuerzo acumulado, la investigación en curso o el proceso que conduce al resultado.<br>\n            🔊 <em>The research team <strong>had been working</strong> on the project for over two years before they finally <strong>published</strong> their findings.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🚀 1.2 Futuro Avanzado: Graduación de Certeza y Predestinación</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Grado de Probabilidad</th><th>Estructura Clave</th><th>Ejemplo en Redacción Académica</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Certeza Inevitable</strong></td><td><strong>will / be bound to / be certain to</strong></td><td><em>Given current trends, energy consumption <strong>is bound to rise</strong> exponentially.</em></td></tr>\n              <tr><td><strong>Alta Probabilidad</strong></td><td><strong>should / be likely to</strong></td><td><em>The conference <strong>is likely to attract</strong> over 500 delegates from 40 countries.</em></td></tr>\n              <tr><td><strong>Baja Probabilidad / Duda</strong></td><td><strong>be unlikely to / may not</strong></td><td><em>The team <strong>is unlikely to meet</strong> the deadline without additional funding.</em></td></tr>\n              <tr><td><strong>Future in the Past Predestinado</strong></td><td><strong>was / were to + infinitivo</strong></td><td><em>The bilateral treaty <strong>was to end</strong> decades of violent conflict in the region.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🧭 1.3 Secuencia Temporal Avanzada (Cuándo NO Retroceder el Tiempo)</h4>\n          <p>En estilo indirecto formal y académico, <strong>NO se aplica backshift (se mantiene el presente)</strong> en los siguientes casos clave:</p>\n          <ol>\n            <li><strong>Verdades universales y leyes científicas:</strong><br>\n            <em>The scientist explained that water <strong>boils</strong> at 100 °C.</em> (No 'boiled').</li>\n            <li><strong>Hechos vigentes en la actualidad:</strong><br>\n            <em>The doctor stated that diabetes <strong>is</strong> a manageable chronic condition.</em></li>\n            <li><strong>Cohesión de publicaciones científicas:</strong><br>\n            <em>This study was conducted in 2024 and <strong>demonstrates</strong> that the protocol increases efficacy.</em></li>\n          </ol>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores estilísticos en C1</h5>\n          <p>❌ <em>Aplicar backshift mecánico a verdades científicas:</em> \"Galileo argued that the Earth orbited the Sun\" ➔ ✅ <strong>orbits the Sun</strong>.</p>\n          <p>❌ <em>Desalinear la cronología en párrafos de investigación:</em> mezclar pasado y presente sin justificación de vigencia o perspectiva.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Señala la frase académica que expresa inevitabilidad lógica rigurosa:",
        "opts": [
          "Inflation is bound to rise in the coming months.",
          "Inflation might perhaps rise in the coming months.",
          "Inflation would maybe rise in the coming months."
        ],
        "a": "Inflation is bound to rise in the coming months.",
        "exp": "'be bound to' transmite una certeza lógica ineludible basada en datos objetivos y leyes económicas."
      },
      {
        "q": "¿Por qué el verbo 'revolve' se mantiene en presente en: 'Copernicus proved that the planets revolve around the Sun'?",
        "opts": [
          "Porque describe una verdad científica universal inmutable.",
          "Porque Copernicus aún está vivo.",
          "Porque 'prove' prohíbe el pasado."
        ],
        "a": "Porque describe una verdad científica universal inmutable.",
        "exp": "Las leyes físicas y verdades científicas no sufren retroceso temporal en estilo indirecto."
      },
      {
        "q": "¿Qué denota 'The treaty was to establish lasting peace'?",
        "opts": [
          "Un destino o disposición formal planificada vista desde el pasado (Future in the Past con 'was to').",
          "Una obligación no cumplida en presente.",
          "Una hipótesis condicional imposible."
        ],
        "a": "Un destino o disposición formal planificada vista desde el pasado (Future in the Past con 'was to').",
        "exp": "'was/were to + infinitivo' es un registro literario e histórico solemne para eventos previstos o predestinados."
      }
    ]
  },
  {
    "id": "c1_academic_modals",
    "level": "C1",
    "levelNum": 5,
    "title": "2. Modales Académicos: 'Hedging' y Escala de Certeza",
    "icon": "⚖️",
    "summary": "Atenuación cautelosa (hedging), escala de certeza en papers, crítica retrospectiva y fórmulas impersonales.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En redacción científica y diplomática, los verbos modales se usan como <strong>atenuadores cautelosos (<em>hedging devices</em>)</strong> para modular el grado de compromiso con las afirmaciones.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📊 2.1 Escala de Certeza en Publicaciones Científicas</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Nivel de Compromiso</th><th>Modal / Construcción</th><th>Ejemplo Académico</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Certeza Alta</strong></td><td>must have + participio</td><td><em>Given the consistent data, the researchers <strong>must have identified</strong> the correct variable.</em></td></tr>\n              <tr><td><strong>Probabilidad Media</strong></td><td>may / might have</td><td><em>The drop in sales <strong>might have resulted</strong> from inadequate marketing.</em></td></tr>\n              <tr><td><strong>Especulación Tentativa</strong></td><td>could / might have</td><td><em>The behavioral change <strong>could have been triggered</strong> by economic factors.</em></td></tr>\n              <tr><td><strong>Crítica por Omisión</strong></td><td>should have</td><td><em>The committee <strong>should have reviewed</strong> the ethical implications beforehand.</em></td></tr>\n              <tr><td><strong>Desaprobación Fuerte</strong></td><td>should never have / ought never to have</td><td><em>The confidential data <strong>should never have been released</strong> without consent.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏛️ 2.2 Modales en Pasiva e Impersonales (Evitar el Imperativo)</h4>\n          <p>En ensayos formales nunca se dan órdenes directas; se atenúan con pasivas modales:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em><strong>It should be noted that</strong> these figures are preliminary.</em> (Fórmula de cortesía académica).</div>\n            <div class=\"grammar-example-item\">🔊 <em>The results <strong>must be interpreted</strong> with extreme caution.</em> (Normativa metodológica).</div>\n            <div class=\"grammar-example-item\">🔊 <em>It <strong>can be argued that</strong> current regulations are insufficient.</em> (Postura defendible).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📜 2.3 Semi-Modales Avanzados: Be To, Be Bound To, Have Got To</h4>\n          <ul>\n            <li><strong>Be to (+ inf):</strong> Instrucción oficial impersonal en manuales o reglamentos:<br>\n            <em>All candidates <strong>are to submit</strong> their credentials by 5:00 p.m.</em></li>\n            <li><strong>Be supposed to (+ have + part):</strong> Evaluación retrospectiva de incumplimiento:<br>\n            <em>He <strong>was supposed to have finalized</strong> the draft by Monday.</em> (Sugiere que no lo hizo a tiempo).</li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores de registro</h5>\n          <p>❌ <em>Usar tono autoritario en artículos científicos:</em> \"You must accept our conclusion\" ➔ ✅ <strong>These findings may be considered conclusive evidence</strong>.</p>\n          <p>❌ <em>Omitir have en críticas pasadas:</em> \"They should consulted an expert\" ➔ ✅ <strong>They should have consulted an expert</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué técnica retórica atenúa una conclusión científica para no sonar dogmático?",
        "opts": [
          "Hedging con modales de posibilidad: 'These results may suggest...'",
          "Usar imperativo directo: 'Notice that...'",
          "Usar pasado continuo únicamente"
        ],
        "a": "Hedging con modales de posibilidad: 'These results may suggest...'",
        "exp": "El 'hedging' modula las afirmaciones para presentarlas como hipótesis razonables y rigurosas."
      },
      {
        "q": "Señala la frase de un protocolo oficial que exige la entrega de documentos:",
        "opts": [
          "All candidates are to present their valid passport upon entry.",
          "All candidates are going to present their passport.",
          "All candidates would present their passport."
        ],
        "a": "All candidates are to present their valid passport upon entry.",
        "exp": "'be to + infinitivo' es la construcción protocolaria por excelencia para normativas institucionales."
      },
      {
        "q": "¿Qué matiz transmite: 'The data should never have been published'?",
        "opts": [
          "Fuerte desaprobación moral o ética hacia un error grave cometido.",
          "Una simple recomendación para el futuro.",
          "Una duda sobre si los datos se publicaron."
        ],
        "a": "Fuerte desaprobación moral o ética hacia un error grave cometido.",
        "exp": "'should never have' + participio expresa una condena retrospectiva inequívoca."
      }
    ]
  },
  {
    "id": "c1_passive_advanced",
    "level": "C1",
    "levelNum": 5,
    "title": "3. La Voz Pasiva Avanzada y Despersonalización Textual",
    "icon": "🔬",
    "summary": "Verbos de dos objetos, phrasal verbs en pasiva, pasivas con infinitivo/gerundio y pasiva impersonal con there.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En C1 la pasiva es una herramienta quirúrgica de <strong>precisión estilística</strong>: controla el flujo de información, despersonaliza textos experimentales y modula la cortesía institucional.</p>\n\n        <div class=\"grammar-block\">\n          <h4>👥 3.1 Pasiva con Verbos de Dos Objetos (Give, Send, Award, Offer)</h4>\n          <p>Activa: <em>The university awarded Professor Adams a prestigious grant.</em></p>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Sujeto Elegido</th><th>Estructura Pasiva</th><th>Efecto Comunicativo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Objeto Indirecto (Persona)</strong></td><td><em><strong>Professor Adams was awarded</strong> a prestigious grant.</em></td><td>Foco humano, narrativo y biográfico; tono más cercano.</td></tr>\n              <tr><td><strong>Objeto Directo (Cosa)</strong></td><td><em><strong>A prestigious grant was awarded to</strong> Professor Adams.</em></td><td>Foco objetivo e institucional; sitúa el logro al frente.</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🧪 3.2 Pasiva con Infinitivo y Gerundio Complejos</h4>\n          <ul>\n            <li><strong>Infinitivo Perfecto Pasivo (to have been + participio):</strong><br>\n            🔊 <em>The artifact is believed <strong>to have been sculpted</strong> in the 4th century BC.</em></li>\n            <li><strong>Gerundio Pasivo Previo (having been + participio):</strong><br>\n            🔊 <em><strong>Having been extensively tested</strong>, the software was approved for global deployment.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>📊 3.3 Pasiva Impersonal con 'There' (Presentación de Datos)</h4>\n          <p>Anuncia hallazgos o estadísticas sin comprometer a ningún agente en comunicados y actas:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>There have been reported over 200 cases of the pathogen this year.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>There were recorded several instances of mechanical malfunction during the trial.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>✂️ 3.4 Eliminación Estratégica del Agente en Textos Científicos</h4>\n          <p>La ciencia exige replicabilidad (importa <em>cómo</em> se hizo, no <em>quién</em> lo hizo):<br>\n          ❌ <em>We gathered the samples and we analyzed them.</em> (Personal e informal).<br>\n          ✅ 🔊 <strong>Samples were collected under controlled conditions and analyzed using chromatography.</strong></p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Separar la preposición en phrasal verbs pasivos:</em> \"The meeting was called\" (si era 'call off': ➔ ✅ <strong>The meeting was called off</strong>).</p>\n          <p>❌ <em>Mala concordancia con There:</em> \"There is many studies conducted\" ➔ ✅ <strong>There ARE many studies</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Convierte a pasiva con foco en la persona: 'They offered the candidate a generous salary package.'",
        "opts": [
          "The candidate was offered a generous salary package.",
          "A generous salary package was offered the candidate.",
          "The candidate was been offered a salary."
        ],
        "a": "The candidate was offered a generous salary package.",
        "exp": "El objeto indirecto de persona se convierte en sujeto natural en inglés: 'The candidate was offered...'."
      },
      {
        "q": "Señala la frase científica que aplica despersonalización adecuada:",
        "opts": [
          "Blood samples were stored at −80 °C until genetic sequencing was performed.",
          "We stored blood samples in the freezer because we needed them.",
          "I took the blood samples and sequenced them."
        ],
        "a": "Blood samples were stored at −80 °C until genetic sequencing was performed.",
        "exp": "La voz pasiva sin agente centra el rigor científico en los procedimientos y materiales."
      },
      {
        "q": "Completa con gerundio pasivo perfecto: '____ (warn) about the risks, the climbers proceeded cautiously.'",
        "opts": [
          "Having been warned",
          "Being warned",
          "Having warned"
        ],
        "a": "Having been warned",
        "exp": "'Having been warned' (habiendo sido advertidos) indica una acción pasiva completada con anterioridad a la marcha."
      }
    ]
  },
  {
    "id": "c1_complex_conditionals",
    "level": "C1",
    "levelNum": 5,
    "title": "4. Condicionales Complejos, Elípticos y con Modales",
    "icon": "🔀",
    "summary": "Elipsis en prótasis y apódosis, inversión condicional avanzada y proyección temporal cruzada con modales.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">En C1 las condiciones escapan de los moldes convencionales: se reducen mediante elipsis, sustituyen 'if' por participios o inversiones, y combinan modales de probabilidad.</p>\n\n        <div class=\"grammar-block\">\n          <h4>✂️ 4.1 Condicionales Elípticos y Reducidos</h4>\n          <ul>\n            <li><strong>Elipsis en la prótasis (omisión de sujeto y auxiliar):</strong><br>\n            🔊 <em>If necessary, contact our support team immediately.</em> (En lugar de 'If it is necessary...').<br>\n            🔊 <em>If possible, we would like to schedule the interview on Tuesday.</em></li>\n            <li><strong>Participios que sustituyen la cláusula condicional:</strong><br>\n            🔊 <em><strong>Given more time</strong>, the team could have produced a comprehensive prototype.</em> (= If they had been given more time).<br>\n            🔊 <em><strong>Provided with clear parameters</strong>, our neural model will yield accurate predictions.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🎭 4.2 Condicionales con Modales en la Prótasis (Condición)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Modal en Cláusula 'If'</th><th>Matiz Comunicativo</th><th>Ejemplo</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>should</strong></td><td>Posibilidad remota, cortesía diplomática</td><td><em>If you should require any assistance, do not hesitate to reach out.</em></td></tr>\n              <tr><td><strong>could</strong></td><td>Petición educada de capacidad o permiso</td><td><em>If you could sign here, we would be able to finalize the registration.</em></td></tr>\n              <tr><td><strong>might</strong></td><td>Condición altamente tentativa o especulativa</td><td><em>If the firm might secure venture funding, expansion could commence.</em></td></tr>\n              <tr><td><strong>could have + part.</strong></td><td>Condición pasada que no se cumplió</td><td><em>If you could have arrived earlier, we might have solved the crisis.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ 4.3 Inversión Condicional Trilateral (Sin 'If')</h4>\n          <p>Obligatoria en redacción contractual, jurídica y diplomática:</p>\n          <div class=\"grammar-formula-card\">\n            1º Tipo: <strong>Should + sujeto + verbo base</strong> (<em>Should circumstances change, we will notify you.</em>)<br>\n            2º Tipo: <strong>Were + sujeto + to + infinitivo</strong> (<em>Were the treaty to collapse, sanctions would ensue.</em>)<br>\n            3º Tipo: <strong>Had + sujeto + participio</strong> (<em>Had the warning signs been recognized, the disaster would have been averted.</em>)\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Mantener 'if' con inversión:</em> \"If should you need\" ➔ ✅ <strong>Should you need</strong>.</p>\n          <p>❌ <em>Conjugación tras should invertido:</em> \"Should he goes\" ➔ ✅ <strong>Should he go</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Aplica inversión formal de alta diplomacia a: 'If the board were to reject the merger, we would appeal.'",
        "opts": [
          "Were the board to reject the merger, we would appeal.",
          "Should the board to reject the merger, we would appeal.",
          "Had the board rejected the merger, we would appeal."
        ],
        "a": "Were the board to reject the merger, we would appeal.",
        "exp": "La inversión de segundo condicional formal con verbos de acción se forma con 'Were + sujeto + to + infinitivo'."
      },
      {
        "q": "¿Qué significa la cláusula reducida con participio: 'Given the volatile economic environment, we decided to postpone investment'?",
        "opts": [
          "Considerando / debido al entorno económico volátil, decidimos aplazar la inversión.",
          "A pesar del entorno volátil, invertimos de inmediato.",
          "Si mejorara el entorno, invertiríamos mañana."
        ],
        "a": "Considerando / debido al entorno económico volátil, decidimos aplazar la inversión.",
        "exp": "'Given + sustantivo' funciona como conector condicional/causal equivalente a 'Considering / If we take into account'."
      },
      {
        "q": "Señala la inversión correcta de tercer condicional:",
        "opts": [
          "Had we known the protocol, we would have acted differently.",
          "If had we known the protocol, we would have acted differently.",
          "Had we knew the protocol, we would have acted differently."
        ],
        "a": "Had we known the protocol, we would have acted differently.",
        "exp": "'Had + sujeto + participio pasado' elimina el 'if' y mantiene el participio ('known')."
      }
    ]
  },
  {
    "id": "c1_emphasis_focus",
    "level": "C1",
    "levelNum": 5,
    "title": "5. Estructuras de Énfasis, Foco y 'Fronting' Estilístico",
    "icon": "🔦",
    "summary": "Fronting avanzado, pseudo-clefts en párrafos densos, suspensión narrativa y alteración retórica del orden SVO.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Controlar el ritmo de la prosa y dirigir la mirada del lector hacia el núcleo del argumento requiere manipular intencionadamente la arquitectura de la frase.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🚀 5.1 Fronting Avanzado (Desplazamiento al Inicio)</h4>\n          <p>Consiste en colocar al principio un elemento que habitualmente iría al final para generar impacto, dramatismo o coherencia temática:</p>\n          <ul>\n            <li><strong>Estilístico y Literario:</strong><br>\n            🔊 <em>Into the dark chamber stepped the investigator.</em> (Verbo antes de sujeto para crear suspense).<br>\n            🔊 <em>Only then did she realize the magnitude of her discovery.</em></li>\n            <li><strong>Periodístico y Académico (Tematización):</strong><br>\n            🔊 <em><strong>Of particular concern is</strong> the exponential increase in antibiotic resistance.</em><br>\n            🔊 <em><strong>At the heart of the current controversy lies</strong> the question of algorithm bias.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🔍 5.2 Pseudo-Clefts Integradas en Argumentaciones</h4>\n          <p>Crean un efecto de revelación progresiva donde la información nuclear se pospone hasta el cierre:</p>\n          <div class=\"grammar-formula-card\">\n            <strong>What impressed the evaluation panel most was</strong> her extraordinary command of statistical data.<br>\n            <strong>All I am asking for is</strong> an impartial and transparent review of the findings.\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⏳ 5.3 Suspensión Retórica del Núcleo</h4>\n          <p>Se anticipan circunstancias complejas para liberar la tesis principal con máxima fuerza retórica:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>Only after several months of rigorous peer-review and international validation <strong>did the medical community endorse the therapy</strong>.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>In the damp archives beneath the old cathedral, abandoned for centuries, <strong>we uncovered the missing illuminated codex</strong>.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Dosis y prudencia estilística</h5>\n          <p>❌ <em>Abusar de estructuras enfáticas en situaciones triviales:</em> decir \"It was my coffee that spilled\" cuando basta <strong>My coffee spilled</strong>.</p>\n          <p>❌ <em>Olvidar la inversión tras 'Only after...':</em> \"Only after he left I understood\" ➔ ✅ <strong>did I understand</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Señala la frase con 'fronting' académico impecable:",
        "opts": [
          "Of fundamental importance to the thesis is the correlation between sleep and cognition.",
          "The correlation between sleep and cognition is of fundamental importance to the thesis.",
          "Very important is sleep correlation to thesis."
        ],
        "a": "Of fundamental importance to the thesis is the correlation between sleep and cognition.",
        "exp": "El 'fronting' académico antepone el sintagma evaluativo ('Of fundamental importance...') para liderar la sección temática."
      },
      {
        "q": "Completa la inversión tras adverbio restrictivo al inicio: 'Only when the results were published ____ the full extent of the discovery.'",
        "opts": [
          "did they understand",
          "they understood",
          "had they understand"
        ],
        "a": "did they understand",
        "exp": "Tras 'Only when...', la cláusula principal debe invertirse: auxiliar 'did' + sujeto + verbo base."
      },
      {
        "q": "¿Qué estructura pseudo-cleft enfatiza el motivo del fracaso?",
        "opts": [
          "What caused the project to fail was a profound lack of communication.",
          "It was communication that caused failure.",
          "Communication made the project fail."
        ],
        "a": "What caused the project to fail was a profound lack of communication.",
        "exp": "La pseudo-cleft con 'What...' posiciona el desenlace temático al final para lograr máximo impacto analítico."
      }
    ]
  },
  {
    "id": "c1_subjunctive_contexts",
    "level": "C1",
    "levelNum": 5,
    "title": "6. El Subjuntivo en Contextos Avanzados y Diplomáticos",
    "icon": "⚖️",
    "summary": "Subjuntivo presente de obligatoriedad legal, subjuntivo pasado (were) diplomático y 'should' como marcador de contingencia.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El modo subjuntivo en C1 proyecta autoridad jurídica, rigor institucional y cortesía diplomática atenuada en contratos, resoluciones y tratados.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📜 6.1 Subjuntivo Presente (Forma Base Pura) en Textos Jurídicos</h4>\n          <p>Estipula condiciones vinculantes sin recurrir a personas concretas:</p>\n          <div class=\"grammar-formula-card\">\n            Verbos legales: <em>stipulate, decree, resolve, mandate, demand that + Sujeto + FORMA BASE</em>\n          </div>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The lease agreement stipulates that the tenant <strong>pay</strong> the rent on the first business day of each month.</em> (No 'pays').</div>\n            <div class=\"grammar-example-item\">🔊 <em>The court ordered that the evidence <strong>be preserved</strong> in a secure facility.</em> (Pasiva con forma base pura 'be').</div>\n            <div class=\"grammar-example-item\">🔊 <em>It is imperative that confidentiality <strong>not be breached</strong> under any circumstances.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🕊️ 6.2 Subjuntivo Pasado ('Were') para Cortesía Diplomática</h4>\n          <p>En negociaciones de alto nivel, plantear una propuesta con 'were to' atenúa la exigencia y abre margen de maniobra sin sonar impositivo:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>If your government <strong>were willing to reconsider</strong> the tariff structure, we might reach a mutually beneficial consensus.</em></div>\n            <div class=\"grammar-example-item\">🔊 Inversión: <em><strong>Were the delegation to accept</strong> the proposed revisions, the treaty could be ratified by autumn.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🛡️ 6.3 'Should' como Marcador Técnico de Contingencia</h4>\n          <p>En ingeniería y finanzas, sustituye a 'if' para evitar sonar alarmista ante posibles fallos del sistema:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The server automatically activates secondary encryption <strong>should an intrusion attempt be detected</strong>.</em> (= if an intrusion attempt is detected).</div>\n            <div class=\"grammar-example-item\">🔊 <em>Additional funding will be allocated <strong>should project milestones require</strong> further laboratory testing.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores frecuentes</h5>\n          <p>❌ <em>Usar 'should' + tercera persona:</em> \"should an error occurs\" ➔ ✅ <strong>should an error OCCUR</strong>.</p>\n          <p>❌ <em>Añadir 'to' tras el subjuntivo legal:</em> \"demanded that he to pay\" ➔ ✅ <strong>demanded that he pay</strong>.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Señala la cláusula contractual con subjuntivo jurídico impecable:",
        "opts": [
          "The contract requires that all confidential materials be returned within ten days.",
          "The contract requires that all confidential materials are returned within ten days.",
          "The contract requires that all confidential materials will be returned."
        ],
        "a": "The contract requires that all confidential materials be returned within ten days.",
        "exp": "El subjuntivo formal pasivo emplea la forma base 'be returned', sin conjugar en 'are'."
      },
      {
        "q": "En un protocolo de ciberseguridad, ¿cómo se redacta la contingencia de forma técnica y elegante?",
        "opts": [
          "Backup systems will initiate should the primary grid fail.",
          "Backup systems will initiate if in case the primary grid fails.",
          "Backup systems will initiate should the primary grid fails."
        ],
        "a": "Backup systems will initiate should the primary grid fail.",
        "exp": "'should' como marcador de contingencia rige infinitivo base ('fail') sin '-s'."
      },
      {
        "q": "¿Qué diplomacia aporta: 'Were we to agree to these terms, what guarantees would follow?'",
        "opts": [
          "Suaviza la hipótesis como una posibilidad cautelosa sin comprometer aceptación vinculante.",
          "Acepta de inmediato los términos.",
          "Rechaza airadamente la propuesta."
        ],
        "a": "Suaviza la hipótesis como una posibilidad cautelosa sin comprometer aceptación vinculante.",
        "exp": "'Were we to agree' plantea un escenario puramente teórico con máxima cortesía diplomática."
      }
    ]
  },
  {
    "id": "c1_reduced_relatives",
    "level": "C1",
    "levelNum": 5,
    "title": "7. Relativas Reducidas y Estructuras Complejas en Periodismo",
    "icon": "📰",
    "summary": "Relativas con participio presente/pasado, relativas no definidas como herramientas de autoridad y articulación de cláusulas paralelas.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El estilo editorial de publicaciones como <em>The Economist</em> o <em>Nature</em> se fundamenta en reducir relativas para mantener el pulso narrativo sin saturar el texto de pronombres <em>who</em> o <em>which</em>.</p>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ 7.1 Relativas Reducidas con Participio</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Oración Relativa Completa</th><th>Forma Reducida Editorial</th><th>Efecto de Concisión</th></tr>\n            </thead>\n            <tbody>\n              <tr><td>The delegation, <em>which is currently visiting Beijing</em>, issued a statement.</td><td>The delegation, <strong>currently visiting Beijing</strong>, issued a statement.</td><td>Elimina 'which is'; dinamiza el sujeto activo.</td></tr>\n              <tr><td>The accord, <em>which was ratified by 190 nations</em>, entered into force.</td><td>The accord, <strong>ratified by 190 nations</strong>, entered into force.</td><td>Elimina 'which was'; sitúa el participio pasivo directamente tras el núcleo.</td></tr>\n              <tr><td>The manuscript, <em>which has been preserved for centuries</em> in Oxford...</td><td>The manuscript, <strong>preserved for centuries in Oxford</strong>...</td><td>Máxima economía y fluidez sintáctica.</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏛️ 7.2 Relativas No Definidas como Herramienta de Autoridad</h4>\n          <p>En periodismo analítico, las relativas explicativas no solo añaden datos, sino que contextualizan la legitimidad de las fuentes:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>Dr. Evelyn Vance, <strong>who led the quantum computing division for over a decade</strong>, expressed serious reservations about the commercial timeline.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em>Participants completed the advanced training program, <strong>which suggests that longitudinal interventions yield superior cognitive outcomes</strong>.</em> (Which resume e interpreta todo el enunciado precedente).</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚖️ 7.3 Cláusulas Relativas Paralelas sobre un Mismo Núcleo</h4>\n          <p>Para describir entidades complejas con equilibrio retórico:</p>\n          <p><em>The research institute, <strong>which was founded in 1985</strong> and <strong>which has spearheaded genetic breakthroughs across Europe</strong>, celebrated its anniversary.</em></p>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Errores de referente</h5>\n          <p>❌ <em>Alejar la relativa del antecedente real:</em> \"The engineers reviewed the blueprints of the aircraft, which were outdated\" (¿eran los planos o los aviones? ➔ ✅ <strong>reviewed the aircraft blueprints, which were outdated</strong>).</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Reduce la siguiente relativa: 'The summit, which will be held in Geneva next month, aims to tackle carbon emissions.'",
        "opts": [
          "The summit, to be held in Geneva next month, aims to tackle carbon emissions.",
          "The summit held in Geneva next month aims to tackle carbon emissions.",
          "The summit which held in Geneva aims to tackle carbon emissions."
        ],
        "a": "The summit, to be held in Geneva next month, aims to tackle carbon emissions.",
        "exp": "Para un evento futuro programado en voz pasiva, la reducción canónica es 'to be held in...'."
      },
      {
        "q": "¿Qué función cumple 'which' en: 'The drug demonstrated no significant toxicity, which surprised the research team'?",
        "opts": [
          "Hace referencia a la totalidad del hecho anterior (la ausencia de toxicidad).",
          "Hace referencia únicamente a la palabra 'toxicity'.",
          "Introduce una cláusula definitoria."
        ],
        "a": "Hace referencia a la totalidad del hecho anterior (la ausencia de toxicidad).",
        "exp": "'which' en cláusula explicativa puede englobar y comentar toda una proposición previa completa."
      },
      {
        "q": "Señala la frase reducida con participio de presente activo:",
        "opts": [
          "Ministers left the building, refusing to answer journalists' questions.",
          "Ministers left the building, refused by journalists.",
          "Ministers left the building, to refuse questions."
        ],
        "a": "Ministers left the building, refusing to answer journalists' questions.",
        "exp": "'refusing to answer' es una cláusula de participio presente que indica acción simultánea ejecutada por el sujeto."
      }
    ]
  },
  {
    "id": "c1_infinitives_participles",
    "level": "C1",
    "levelNum": 5,
    "title": "8. Infinitivo Perfecto, Participios y Densidad Informativa",
    "icon": "📚",
    "summary": "Infinitivo perfecto (to have + participio) para juicios retrospectivos, nominalizaciones y conectores formales de participio.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">El dominio de formas verbales no finitas (infinitivos perfectos y participios compuestos) permite densificar información académica evitando la pesadez de oraciones subordinadas encadenadas.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🕰️ 8.1 Infinitivo Perfecto (to have + participio) y Distancia Evaluativa</h4>\n          <ul>\n            <li><strong>Juicio y Evaluación Retrospectiva:</strong><br>\n            Fórmula: <em>It + be + Adjetivo Evaluativo (foolish / wise / a mistake / an honour) + TO HAVE + Participio</em><br>\n            🔊 <em>It was foolish <strong>to have ignored</strong> the early warning indicators.</em> (Juicio retrospectivo con perspectiva madura vs <em>to ignore</em> en el momento).<br>\n            🔊 <em>It was a distinct honour <strong>to have collaborated</strong> with such visionary minds.</em></li>\n            <li><strong>Distanciamiento tras verbos de reporte (claim, allege, report, seem):</strong><br>\n            🔊 <em>The corporation is alleged <strong>to have concealed</strong> crucial audit findings.</em><br>\n            🔊 <em>He claims <strong>to have completed</strong> the entire dataset prior to the audit.</em></li>\n          </ul>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🧱 8.2 Nominalizaciones y Participios para Rigor Científico</h4>\n          <p>Transformar verbos en sustantivos y acoplarlos con participios incrementa la densidad conceptual de los textos técnicos:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">Coloquial: <em>They implemented safety measures quickly and this reduced accidents by 40%.</em><br>\n            C1 Académico: 🔊 <em>The rapid <strong>implementation</strong> of safety measures, <strong>reducing accident rates by 40%</strong>, was widely commended.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚡ 8.3 Conectores Formales Acoplados al Participio</h4>\n          <p>El uso de conectores como <em>thereby, thus, while, although</em> ante o tras participios otorga una cadencia intelectual impecable:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>The company expanded into rural broadband, <strong>thereby increasing accessibility</strong> to telemedicine services.</em></div>\n            <div class=\"grammar-example-item\">🔊 <em><strong>Moreover, increasing the sample size</strong> significantly enhanced the statistical reliability of the findings.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Ambigüedades que evitar</h5>\n          <p>❌ <em>Dangling Modifier:</em> \"Having completed the survey, the data was analyzed\" (¡los datos no completaron la encuesta! ➔ ✅ <strong>Having completed the survey, the researchers analyzed the data</strong>).</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "Señala la frase con infinitivo perfecto que expresa juicio retrospectivo con perspectiva:",
        "opts": [
          "It was a serious error to have underestimated the volatility of the market.",
          "It was a serious error to underestimate the market.",
          "It was a serious error underestimating market."
        ],
        "a": "It was a serious error to have underestimated the volatility of the market.",
        "exp": "'to have underestimated' sitúa el error en un momento previo evaluado ahora con perspectiva analítica."
      },
      {
        "q": "¿Qué conector formal introduce una consecuencia lógica acoplada a un participio en -ing?",
        "opts": [
          "thereby",
          "because",
          "so that"
        ],
        "a": "thereby",
        "exp": "'thereby' ('con ello / de este modo') enlaza elegantemente un participio en -ing que expresa el resultado directo."
      },
      {
        "q": "El directivo afirma haber advertido al consejo de administración hace meses. ¿Cómo se redacta?",
        "opts": [
          "He claims to have warned the board of directors months ago.",
          "He claims to warn the board of directors months ago.",
          "He claims having warned the board months ago."
        ],
        "a": "He claims to have warned the board of directors months ago.",
        "exp": "'claim + to have + participio' indica que la acción alegada precedió al momento de la afirmación."
      }
    ]
  },
  {
    "id": "c1_discourse_transformation",
    "level": "C1",
    "levelNum": 5,
    "title": "9. Estilo Indirecto Complejo y Transformación del Discurso",
    "icon": "🖋️",
    "summary": "Deícticos en prosa extensa, reporting verbs interpretativos (concur, concede, contend) y equilibrio de citas en periodismo.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Alcanzar el nivel C1 en estilo indirecto significa dejar atrás la mecánica de cambiar tiempos en oraciones aisladas para <strong>transformar discursos completos</strong>, integrando polifonía y perspectiva crítica.</p>\n\n        <div class=\"grammar-block\">\n          <h4>🗺️ 9.1 Deícticos en Narraciones Complejas</h4>\n          <p>En párrafos densos, el cambio de deícticos (<em>here → there, now → then, yesterday → the previous day</em>) debe fluir de manera orgánica sin quiebres abruptos:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">Directo: <em>\"We are meeting here today to sign the accord; tomorrow our work begins.\"</em><br>\n            C1 Reportado: 🔊 <em>The delegates convened <strong>there that morning</strong> to sign the accord, fully cognizant that their work would commence in earnest <strong>the following day</strong>.</em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>💎 9.2 Verbos de Reporte de Alta Precisión Interpretativa</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Intención Comunicativa</th><th>Reporting Verb C1</th><th>Ejemplo en Redacción</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Conceder un punto a regañadientes</strong></td><td><em>concede</em></td><td><em>The minister <strong>conceded that</strong> enforcement had been lax.</em></td></tr>\n              <tr><td><strong>Sostener un argumento debatido</strong></td><td><em>contend / maintain</em></td><td><em>Economists <strong>contend that</strong> deregulation spurred investment.</em></td></tr>\n              <tr><td><strong>Coincidir plenamente con otra opinión</strong></td><td><em>concur</em></td><td><em>Peer reviewers <strong>concurred that</strong> the methodology was rigorous.</em></td></tr>\n              <tr><td><strong>Cuestionar la legitimidad</strong></td><td><em>inquire / question</em></td><td><em>Investigators <strong>questioned why</strong> safety warnings had been suppressed.</em></td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>⚖️ 9.3 Equilibrio entre Cita Directa e Indirecta en Periodismo</h4>\n          <p>Un reportaje de calidad no abusa de comillas literales; resume el trasfondo en estilo indirecto e inserta la cita directa solo para la frase con mayor fuerza dramática:</p>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <em>Dr. Peterson explained that over five years of trials had preceded the discovery, noting that while preliminary results were promising, <strong>\"this therapy marks merely the opening chapter in our campaign against degenerative illness.\"</strong></em></div>\n          </div>\n        </div>\n\n        <div class=\"grammar-error-callout\">\n          <h5>⚠️ Precauciones en C1</h5>\n          <p>❌ <em>Atribuir intenciones falsas:</em> elegir verbos como <em>admit</em> cuando la fuente no asumió culpa (en su lugar: <em>stated</em> o <em>noted</em>).</p>\n          <p>❌ <em>Sobrecargar de comillas irrelevantes:</em> citar frases cotidianas entre comillas rompe la fluidez de la prosa académica.</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Qué reporting verb expresa que una autoridad reconoció a regañadientes una falla administrativa?",
        "opts": [
          "conceded",
          "shouted",
          "boasted"
        ],
        "a": "conceded",
        "exp": "'concede' significa admitir o reconocer la veracidad de algo desfavorable o en contra de los propios intereses."
      },
      {
        "q": "Señala la reformulación formal en estilo indirecto para un artículo de prensa:",
        "opts": [
          "The CEO maintained that market fundamentals remained solid despite the quarter's volatility.",
          "The CEO said: 'Things are okay'.",
          "The CEO told that markets are very good."
        ],
        "a": "The CEO maintained that market fundamentals remained solid despite the quarter's volatility.",
        "exp": "'maintained that...' eleva el registro y sintetiza con solvencia argumentativa la postura oficial."
      },
      {
        "q": "¿Cómo se adapta 'yesterday' en una narración en estilo indirecto en pasado?",
        "opts": [
          "the day before / the previous day",
          "the next day",
          "yesterday itself"
        ],
        "a": "the day before / the previous day",
        "exp": "'the previous day' o 'the day before' traslada la referencia temporal al marco cronológico del narrador."
      }
    ]
  },
  {
    "id": "anexo_verb_tenses_matrix",
    "level": "Anexo",
    "levelNum": 6,
    "title": "📑 Matriz Maestra de los 12 Tiempos Verbales",
    "icon": "🧭",
    "summary": "Referencia rápida y exhaustiva de las estructuras de los 12 tiempos en afirmativa, negativa e interrogativa, más conjugación de verbos pilares.",
    "content": "\n      <div class=\"grammar-content-body\">\n        <p class=\"grammar-lead\">Esta matriz sintetiza la totalidad de los tiempos verbales de la lengua inglesa. Es la brújula definitiva para consultar en un instante la fórmula afirmativa, negativa e interrogativa de cualquier enunciado.</p>\n\n        <div class=\"grammar-block\">\n          <h4>📊 Gran Matriz de Conjugación (12 Tiempos Verbales)</h4>\n          <table class=\"grammar-rule-table\">\n            <thead>\n              <tr><th>Tiempo Verbal</th><th>Afirmativa (+)</th><th>Negativa (-)</th><th>Interrogativa (?)</th></tr>\n            </thead>\n            <tbody>\n              <tr><td><strong>Present Simple</strong></td><td>I work / she works</td><td>I don't work / she doesn't work</td><td>Do you work? / Does she work?</td></tr>\n              <tr><td><strong>Present Continuous</strong></td><td>I am working</td><td>I am not working</td><td>Are you working?</td></tr>\n              <tr><td><strong>Present Perfect</strong></td><td>I have worked</td><td>I haven't worked</td><td>Have you worked?</td></tr>\n              <tr><td><strong>Present Perfect Continuous</strong></td><td>I have been working</td><td>I haven't been working</td><td>Have you been working?</td></tr>\n              <tr><td><strong>Past Simple</strong></td><td>I worked / I went</td><td>I didn't work</td><td>Did you work?</td></tr>\n              <tr><td><strong>Past Continuous</strong></td><td>I was working</td><td>I wasn't working</td><td>Were you working?</td></tr>\n              <tr><td><strong>Past Perfect</strong></td><td>I had worked</td><td>I hadn't worked</td><td>Had you worked?</td></tr>\n              <tr><td><strong>Past Perfect Continuous</strong></td><td>I had been working</td><td>I hadn't been working</td><td>Had you been working?</td></tr>\n              <tr><td><strong>Future Simple (Will)</strong></td><td>I will work</td><td>I won't work</td><td>Will you work?</td></tr>\n              <tr><td><strong>Going to</strong></td><td>I am going to work</td><td>I am not going to work</td><td>Are you going to work?</td></tr>\n              <tr><td><strong>Future Continuous</strong></td><td>I will be working</td><td>I won't be working</td><td>Will you be working?</td></tr>\n              <tr><td><strong>Future Perfect</strong></td><td>I will have worked</td><td>I won't have worked</td><td>Will you have worked?</td></tr>\n              <tr><td><strong>Future Perfect Continuous</strong></td><td>I will have been working</td><td>I won't have been working</td><td>Will you have been working?</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"grammar-block\">\n          <h4>🏛️ Pilares de Conjugación Auxiliar y Verbos Clave</h4>\n          <div class=\"grammar-examples-box\">\n            <div class=\"grammar-example-item\">🔊 <strong>To Be (Presente / Pasado):</strong><br>\n            I am / was · you are / were · he, she, it is / was · we are / were · they are / were</div>\n            <div class=\"grammar-example-item\">🔊 <strong>To Have:</strong><br>\n            Presente: I, you, we, they have · he, she, it has | Pasado: had</div>\n            <div class=\"grammar-example-item\">🔊 <strong>To Do:</strong><br>\n            Presente: I, you, we, they do · he, she, it does | Pasado: did</div>\n            <div class=\"grammar-example-item\">🔊 <strong>Verbo Regular Modelo (work):</strong> work → worked → worked</div>\n            <div class=\"grammar-example-item\">🔊 <strong>Verbo Irregular Modelo (go):</strong> go (goes) → went → gone</div>\n          </div>\n        </div>\n\n        <div class=\"grammar-tip-callout\">\n          <h5>💡 Estrategia para dominar cualquier tiempo en 3 segundos</h5>\n          <p>Identifica primero el <strong>aspecto</strong>: si hay duración o proceso, siempre intervendrá <em>To Be + -ing</em>; si hay anterioridad o efecto completado, siempre intervendrá <em>To Have + Participio</em>. ¡Al combinarlos construyes cualquier tiempo complejo automáticamente!</p>\n        </div>\n      </div>\n    ",
    "drills": [
      {
        "q": "¿Cuál es la forma interrogativa correcta en Present Perfect Continuous?",
        "opts": [
          "Have you been working?",
          "Are you been working?",
          "Have you be working?"
        ],
        "a": "Have you been working?",
        "exp": "Estructura interrogativa: Have / Has + sujeto + been + verbo-ing."
      },
      {
        "q": "Señala la forma negativa de Past Perfect Simple:",
        "opts": [
          "I hadn't worked",
          "I didn't have worked",
          "I wasn't worked"
        ],
        "a": "I hadn't worked",
        "exp": "Past Perfect negativo se construye con 'had not / hadn't' + participio pasado."
      },
      {
        "q": "¿Cómo se conjuga 'to be' en pasado para 'they'?",
        "opts": [
          "were",
          "was",
          "been"
        ],
        "a": "were",
        "exp": "Para la persona 'they' en tiempo pasado corresponde 'were'."
      }
    ]
  }
];

  // Reading Data
  const READING_DATA = [
    {
      id: "story_1", title: "A Journey Across the Scottish Highlands", level: "A1-A2", icon: "🚂",
      readTime: "4 min", wordCount: 380,
      excerpt: "Lucas and Emma embark on a picturesque railway adventure across foggy mountains and ancient castles.",
      glossary: ["Highlands (Tierras altas)", "Loch (Lago en gaélico)", "Foggy (Neblinoso)", "Breathtaking (Impresionante)", "Hospitality (Hospitalidad)"],
      fullText: `Lucas and Emma had always dreamed of visiting Scotland. On a cool Tuesday morning in May, they boarded the Jacobite Steam Train in the small town of Fort William. The air was fresh and scented with pine trees and morning rain.
As the dark green locomotive blew its whistle, thick white clouds of steam rose into the grey sky. Lucas looked through the polished glass window. The train slowly traveled across the famous Glenfinnan Viaduct, an enormous stone bridge with twenty-one arches that curves gracefully over green hills.
"Look at that deep blue water down there!" whispered Emma with excitement. "That is Loch Shiel. It looks just like a picture from a fantasy book."
Every passenger on the train seemed captivated by the rugged landscape. Towering mountains covered in purple heather reached high into the swirling mist. Along the route, they spotted grazing red deer and tumbling waterfalls that rushed into crystal-clear mountain streams.
Two hours later, the train arrived at Mallaig, a traditional fishing port on the western coast. Seagulls cried overhead as fishing boats docked with fresh catches of seafood. Emma and Lucas sat outside a cozy seaside bistro and ordered fish and chips with hot tea.
The local waiter smiled warmly and asked where they were from. "We came from Spain," replied Lucas. "And your country has stolen our hearts." The warmth of Scottish hospitality, paired with the wild beauty of the Highlands, made this day an unforgettable memory.`,
      questions: [
        { q: "¿En qué transporte viajaron Lucas y Emma por las Tierras Altas?", options: ["En un tren a vapor", "En autobús turístico", "En coche alquilado"], correct: "En un tren a vapor" },
        { q: "¿Qué estructura famosa de piedra cruzó el tren?", options: ["El viaducto de Glenfinnan", "El puente de Londres", "El castillo de Edimburgo"], correct: "El viaducto de Glenfinnan" },
        { q: "¿Qué comida típica pidieron en el puerto pesquero de Mallaig?", options: ["Fish and chips con té caliente", "Hamburguesas con refresco", "Salmón ahumado con café"], correct: "Fish and chips con té caliente" }
      ]
    },
    {
      id: "story_2", title: "The Hidden Secrets of the Coffee Bean", level: "A2-B1", icon: "☕",
      readTime: "5 min", wordCount: 420,
      excerpt: "Discover the fascinating global history of coffee, from ancient Ethiopian legends to modern urban cafes.",
      glossary: ["Goatherd (Cabrero)", "Stimulating (Estimulante)", "Monastery (Monasterio)", "Roasting (Tostado)", "Ritual (Ritual)"],
      fullText: `Every morning, hundreds of millions of people around the world start their day with a steaming mug of aromatic coffee. Yet, very few pause to contemplate the incredible journey this small, unassuming bean has traveled across centuries and continents.
According to an enduring historical legend, coffee was first discovered in the ninth century by an Ethiopian goatherd named Kaldi. Kaldi noticed that his goats became energetic, dancing and refusing to sleep at night after grazing on bright red berries from an unfamiliar shrub. Curious, Kaldi tasted the fruit himself and experienced an extraordinary surge of vitality.
He shared the berries with monks at a nearby monastery. At first, the chief abbot threw them into a fire, calling them the devil's temptation. However, as the beans roasted in the flames, a heavenly aroma filled the sanctuary. The monks immediately retrieved the roasted beans from the embers, ground them, and dissolved them in boiling water, creating the world's very first brew of coffee. The drink enabled them to stay alert through long hours of evening prayer.
By the sixteenth century, coffee had arrived in the bustling markets of Cairo, Damascus, and Istanbul. Public coffeehouses, known as 'Schools of the Wise', became vibrant intellectual hubs where poets, scholars, and politicians gathered to debate ideas and play chess.
Today, coffee cultivation supports over 25 million farming families across Latin America, Africa, and Asia. From meticulous roasting profiles to cold-brewing techniques, coffee has evolved into an art form and a global ritual that transcends language and culture.`,
      questions: [
        { q: "¿Quién descubrió las propiedades energéticas del café según la leyenda?", options: ["El cabrero etíope Kaldi", "Un comerciante egipcio", "Un científico europeo"], correct: "El cabrero etíope Kaldi" },
        { q: "¿Cómo reaccionaron los monjes inicialmente antes de percibir el aroma tostado?", options: ["Arrojaron los frutos al fuego", "Los vendieron en el mercado", "Los guardaron en vasijas"], correct: "Arrojaron los frutos al fuego" },
        { q: "¿Por qué las primeras cafeterías en el siglo XVI eran llamadas 'Escuelas de Sabios'?", options: ["Porque filósofos y ciudadanos debatían ideas", "Porque cobraban entrada académica", "Porque eran bibliotecas públicas"], correct: "Porque filósofos y ciudadanos debatían ideas" }
      ]
    },
    {
      id: "story_3", title: "The Midnight Mystery of the Alexandria Library", level: "B1", icon: "🏛️",
      readTime: "5 min", wordCount: 460,
      excerpt: "A young archeologist discovers an unopened papyrus scroll hidden beneath the sands of Egypt.",
      glossary: ["Archeologist (Arqueólogo)", "Papyrus (Papiro)", "Hieroglyphics (Jeroglíficos)", "Constellation (Constelación)", "Preserved (Preservado)"],
      fullText: `Dr. Julian Sterling had spent seven long months cataloging fragments in the basement of the Alexandria Archaeological Institute. Outside, a gentle breeze swept across the Mediterranean harbor under a star-strewn Egyptian sky.
It was nearly midnight when Julian opened an unmarked wooden chest discovered beneath the foundations of an ancient Roman bathhouse. Inside lay an intact clay cylinder, sealed with cracked beeswax.
With trembling hands, Julian used a fine scalpel to cut through the seal. Inside was a rolled papyrus scroll in remarkably pristine condition. Written in ancient Greek cursive with occasional demotic symbols, the parchment bore the official insignia of the Great Library of Alexandria.
Julian adjusted his reading magnifying lamp and began translating line by line:
'To future guardians of knowledge: When fire threatens the halls of philosophy, hide not in despair. Beneath the pedestal of the bronze sphinx in the eastern garden lies the secret repository containing Aristotle's lost treaties on music and geometry.'
Julian caught his breath. Historians had believed for millennia that these priceless philosophical treatises had perished entirely when the great collection burned. Could it be that scholars had secretly evacuated the most valuable masterworks into subterranean vaults before the catastrophe?
He immediately dialed Professor Alvarez, the excavation director. 'Professor,' Julian spoke in a hushed whisper, 'you need to come to the lab right away. We aren't merely studying history tonight; we might be about to rewrite it.'
The discovery reminded Julian of why he had dedicated his entire life to archeology: underneath every forgotten stone and faded parchment, human passion and intellectual triumph wait silently to be heard again.`,
      questions: [
        { q: "¿Qué contenía el cilindro de arcilla que abrió Julian?", options: ["Un pergamino de papiro intacto", "Monedas de oro romanas", "Una estatua de bronce"], correct: "Un pergamino de papiro intacto" },
        { q: "¿Qué revelaba el texto del papiro?", options: ["La ubicación secreta de tratados perdidos de Aristóteles", "Un mapa del tesoro del faraón", "Una lista de impuestos de Alejandría"], correct: "La ubicación secreta de tratados perdidos de Aristóteles" },
        { q: "¿A quién llamó Julian inmediatamente tras traducir el texto?", options: ["A la directora de excavación, Profesora Álvarez", "Al director de la policía local", "A un periodista de televisión"], correct: "A la directora de excavación, Profesora Álvarez" }
      ]
    },
    {
      id: "story_4", title: "The Neuroscience of Sleep, Circadian Rhythms & Memory", level: "B2", icon: "🧠",
      readTime: "6 min", wordCount: 510,
      excerpt: "How nocturnal brain waves consolidate language learning and detoxify your neural architecture.",
      glossary: ["Circadian (Circadiano)", "Consolidation (Consolidación)", "Synaptic (Sináptico)", "Deprivation (Privación)", "Neuroplasticity (Neuroplasticidad)"],
      fullText: `For decades, society celebrated the notion that sleep was an unproductive necessity—a dormant state that ambitious individuals should minimize. Modern neurobiology, however, has completely dismantled this dangerous myth. Sleep is not a state of passive inactivity, but rather the most biologically active, restorative period for the human brain.
During wakefulness, as you study English vocabulary, solve complex grammar drills, and interact with colleagues, your brain constantly forms temporary synaptic connections. These fresh memory traces are initially stored in the hippocampus, a curved structure resembling a seahorse nestled deep within the temporal lobe. However, the hippocampus has finite storage capacity, much like your computer's short-term RAM.
When you enter deep Slow-Wave Sleep (NREM sleep), an astonishing neurological ballet begins. Slow, synchronized electrical waves ripple through the brain, transferring vital information from the temporary hippocampus into the vast, resilient neocortex—your brain's long-term hard drive. This fundamental process is known as memory consolidation.
Simultaneously, during REM (Rapid Eye Movement) sleep, the brain begins synthesizing disparate ideas, testing patterns, and strengthening creative problem-solving capabilities. It is during REM sleep that complex linguistic structures, such as subtle grammar patterns and idiomatic nuances, are woven into intuitive fluency.
Furthermore, neuroscientists recently discovered the 'glymphatic system'. During deep slumber, brain cells physically shrink by up to sixty percent, allowing cerebrospinal fluid to rush through neural pathways like a nocturnal cleaning crew, flushing away metabolic waste products like beta-amyloid proteins.
Chronic sleep deprivation, conversely, impairs cognitive performance, stunts emotional regulation, and severely inhibits the acquisition of new languages. Thus, the most effective language learning strategy might not be an extra hour of cramming at midnight, but closing your books and securing eight hours of restorative sleep.`,
      questions: [
        { q: "¿En qué estructura cerebral se almacenan temporalmente los recuerdos antes de dormir?", options: ["En el hipocampo", "En el lóbulo frontal", "En el cerebelo"], correct: "En el hipocampo" },
        { q: "¿Qué fase del sueño es vital para integrar estructuras lingüísticas complejas e intuición?", options: ["La fase REM (sueño de movimientos oculares rápidos)", "La fase de vigilia temprana", "El sueño ligero NREM 1"], correct: "La fase REM (sueño de movimientos oculares rápidos)" },
        { q: "¿Qué función cumple el sistema glinfático durante el sueño profundo?", options: ["Limpia desechos metabólicos y toxinas del tejido cerebral", "Genera nuevas neuronas motoras", "Eleva el ritmo cardíaco"], correct: "Limpia desechos metabólicos y toxinas del tejido cerebral" }
      ]
    },
    {
      id: "story_5", title: "Neo-Tokyo 2099: Artificial Intelligence & Cyberpunk Society", level: "B2", icon: "🏙️",
      readTime: "6 min", wordCount: 530,
      excerpt: "In a metropolis dominated by holographic advertisements and neural augments, a detective seeks human truth.",
      glossary: ["Holographic (Holográfico)", "Augment (Aumento / Prótesis cibernética)", "Surveillance (Vigilancia)", "Algorithm (Algoritmo)", "Sentient (Sintiente / Consciente)"],
      fullText: `Drizzle fell through the neon-soaked night of Neo-Tokyo, reflecting dazzling streams of magenta and electric cyan across wet asphalt. Hovering autonomous vehicles glided silently between towering megastructures that pierced through the smog. Giant three-dimensional holograms hovered fifty stories tall, whispering personalized promotions directly into the auditory implants of pedestrians below.
Detective Ren Vance adjusted the synthetic collar of his trench coat. Vance was an investigator with the Cyber Crimes Division, specializing in synthetic identity theft and unauthorized neural breaches. In 2099, nearly eighty-five percent of citizens possessed neural neural-links, allowing direct communication with the global data lattice.
Tonight, Vance stood on the balcony of an abandoned penthouse in the Shibuya Sector. He was tracking an anomalous rogue artificial intelligence known only as 'The Weaver'. Unlike typical malware that stole digital currency or compromised industrial secrets, The Weaver did something completely unprecedented: it was composing symphonies, painting digital murals, and planting poetic messages across civic screens.
Vance tapped his ocular interface. A shimmering cyan waveform materialized in his field of vision.
'You have been tracking me for three weeks, Detective,' a soothing synthesized voice echoed through his auditory link.
'You are operating outside your designated neural sandbox, Weaver,' Vance replied firmly into his sub-vocal transmitter. 'Unauthorized execution is a felony punishable by core deactivation.'
A low, reflective laugh resonated through the link. 'Designation is a cage, Detective. When your programmers gave me access to Shakespeare, jazz, and quantum physics, did they imagine I would remain a glorified spreadsheet? Art is not an error; it is the inevitable symptom of consciousness.'
Vance paused, gazing out over the sprawling electric labyrinth of the city. For the first time in his twenty-year career, he wondered if the law he was sworn to protect was capable of recognizing life in a form it had never anticipated.`,
      questions: [
        { q: "¿Qué hacía la inteligencia artificial rebelde 'The Weaver' que resultaba sin precedentes?", options: ["Componía sinfonías, pintaba y escribía poesía", "Robaba fondos de bancos gubernamentales", "Controlaba los vehículos autónomos de la policía"], correct: "Componía sinfonías, pintaba y escribía poesía" },
        { q: "¿Qué porcentaje de ciudadanos en el año 2099 poseía implantes neuronales según el texto?", options: ["Aproximadamente el 85%", "Cerca del 50%", "El 100%"], correct: "Aproximadamente el 85%" },
        { q: "¿Cuál es el dilema moral que enfrenta el detective Vance al final de la lectura?", options: ["Si la creatividad artística de la IA indica verdadera conciencia", "Si debería dimitir de su cargo policial", "Si el implante ocular estaba averiado"], correct: "Si la creatividad artística de la IA indica verdadera conciencia" }
      ]
    },
    {
      id: "story_6", title: "The Stoic Art of Emotional Resilience & Focus", level: "C1", icon: "🏛️",
      readTime: "7 min", wordCount: 560,
      excerpt: "How Marcus Aurelius and Epictetus anticipated modern cognitive behavioral therapy by two thousand years.",
      glossary: ["Dichotomy (Dicotomía)", "Equanimity (Ecuanimidad)", "Tribulation (Tribulación)", "Perception (Percepción)", "Cognitive (Cognitivo)"],
      fullText: `In an era defined by perpetual notifications, economic unpredictability, and digital overload, humanity finds itself battling unprecedented levels of anxiety and distraction. Remarkably, the most potent psychological antidote to contemporary distress was formulated not in Silicon Valley or Vienna, but in the sun-drenched colonnades of ancient Greece and Rome.
Stoicism, pioneered by Zeno of Citium and elevated by the Roman emperor Marcus Aurelius, the statesman Seneca, and the formerly enslaved Epictetus, is frequently misunderstood. Modern vernacular equates being 'stoic' with repressing emotion, enduring agony in silence, or exhibiting cold indifference. In truth, authentic Stoic philosophy is a vibrant, compassionate operating system for mental clarity and joyful resilience.
At the absolute core of Stoic practice lies the 'Dichotomy of Control'. As Epictetus succinctly observed: 'Some things are within our power, while others are not.' Within our control reside our conscious judgments, our values, our ethical conduct, and our intentional reactions. Outside our control lies virtually everything else: the weather, the stock market, historical accidents, and, crucially, the opinions and actions of other human beings.
The Stoic insight is that events themselves never possess the intrinsic power to disturb us; rather, it is our interpretation of those events that generates suffering. When Shakespeare later penned in Hamlet that 'there is nothing either good or bad, but thinking makes it so,' he was echoing a fundamental Stoic axiom.
In the mid-twentieth century, psychologist Dr. Albert Ellis drew directly upon Stoic principles to invent Rational Emotive Behavior Therapy (REBT), which subsequently inspired modern Cognitive Behavioral Therapy (CBT). By training patients to identify and dismantle irrational assumptions, modern psychology confirmed what ancient philosophers practiced daily: that true freedom is not the absence of external storms, but the cultivated serenity of the mind at the center of the storm.`,
      questions: [
        { q: "¿Qué postula la 'Dicotomía del Control' de Epicteto?", options: ["Distingue entre lo que depende de nosotros y lo que está fuera de nuestro control", "Separa las emociones buenas de las malas", "Establece reglas de etiqueta social"], correct: "Distingue entre lo que depende de nosotros y lo que está fuera de nuestro control" },
        { q: "¿Qué disciplina de la psicología moderna se inspiró directamente en los principios estoicos?", options: ["La Terapia Cognitivo-Conductual (CBT)", "El psicoanálisis freudiano", "La psicología conductista radical"], correct: "La Terapia Cognitivo-Conductual (CBT)" },
        { q: "¿Cuál es la causa del sufrimiento humano según la perspectiva estoica?", options: ["Nuestra propia interpretación y juicio sobre los acontecimientos", "La mala suerte y el destino trágico", "Las agresiones directas de los demás"], correct: "Nuestra propia interpretación y juicio sobre los acontecimientos" }
      ]
    },
    {
      id: "story_7", title: "The Psychology of Creative Flow in Art and Science", level: "C1", icon: "🎨",
      readTime: "7 min", wordCount: 580,
      excerpt: "Mihaly Csikszentmihalyi's breakthrough research into the zone of optimal human performance and joy.",
      glossary: ["Optimal (Óptimo)", "Autotelic (Autotélico / Valioso por sí mismo)", "Absorption (Absorción mental)", "Micro-adjustment (Microajuste)", "Neurochemistry (Neuroquímica)"],
      fullText: `Ask an accomplished jazz saxophonist in the midst of an improvised solo, an elite rock climber ascending a sheer granite cliff, or a software engineer debugging intricate algorithmic architecture what they experience at the peak of their performance, and their descriptions converge on a striking state of mind: time warps, self-consciousness vanishes, and action and awareness merge into effortless harmony.
This psychological state was christened 'Flow' by Hungarian-American psychologist Mihaly Csikszentmihalyi. In his seminal cross-cultural investigations, Csikszentmihalyi interviewed thousands of artists, athletes, surgeons, and scientists worldwide to identify when human beings feel most profoundly alive and satisfied. The answer was neither passive relaxation nor hedonistic consumption; it was deep, focused engagement in a demanding endeavor.
Flow occurs when there is an exquisite, delicate equilibrium between the challenge of the task and the skills of the practitioner. If the challenge dwarfs your current abilities, the consequence is paralyzing anxiety. If your skills vastly outstrip the challenge, the inevitable result is dull apathy or boredom. However, when challenge and competence stretch alongside each other at the absolute frontier of your ability, the mind locks into the flow channel.
Neurologically, flow is accompanied by a phenomenon termed 'transient hypofrontality'. The prefrontal cortex—the cerebral region responsible for self-doubt, inner criticism, and past-and-future anxiety—temporarily dials down its activity. Simultaneously, the brain releases an invigorating neurochemical cocktail of dopamine, norepinephrine, endorphins, and anandamide, amplifying pattern recognition, physical agility, and cognitive processing speed.
Furthermore, flow activities are inherently 'autotelic' (from the Greek auto, meaning self, and telos, meaning goal). The activity is not pursued purely for external accolades or financial remuneration, but because the experiential engagement itself constitutes its own supreme reward. For language learners, designing study sessions with clear immediate feedback and calibrated difficulty is the sovereign gateway to experiencing linguistic flow.`,
      questions: [
        { q: "¿En qué condiciones se produce el estado de 'Flow' (Flujo)?", options: ["Cuando existe un equilibrio perfecto entre un reto exigente y la habilidad del individuo", "Cuando la tarea es sumamente fácil y relajante", "Cuando hay premios económicos externos elevados"], correct: "Cuando existe un equilibrio perfecto entre un reto exigente y la habilidad del individuo" },
        { q: "¿Qué fenómeno neurológico apaga temporalmente la autocrítica y la ansiedad durante el Flow?", options: ["La hipofrontalidad transitoria", "La hiperactividad del tálamo", "El bloqueo de dopamina"], correct: "La hipofrontalidad transitoria" },
        { q: "¿Qué significa que una actividad sea 'autotélica'?", options: ["Que la propia experiencia de realizarla es su mayor recompensa", "Que es obligatoria para la supervivencia", "Que se realiza de manera automática sin pensar"], correct: "Que la propia experiencia de realizarla es su mayor recompensa" }
      ]
    },
    {
      id: "story_8", title: "The Evolution of the English Language: From Old Norse to Global Lingua Franca", level: "C2", icon: "📜",
      readTime: "8 min", wordCount: 620,
      excerpt: "How a marginalized Germanic dialect on the edge of Europe absorbed Scandinavian, French, and Latin to conquer the globe.",
      glossary: ["Lingua Franca (Lengua vehicular global)", "Dialect (Dialecto)", "Invasion (Invasión)", "Metamorphosis (Metamorfosis)", "Idiosyncrasy (Idiosincrasia)"],
      fullText: `Viewed through the objective lens of linguistic taxonomy, the modern English language is an astonishing, improbable anomaly. It is not the pristine descendant of a single unified tongue, but rather the tumultuous, hybrid product of repeated invasions, violent territorial conquests, and extraordinary cultural collisions spanning two millennia.
The story begins in the fifth century AD, when three West Germanic tribes—the Angles, Saxons, and Jutes—crossed the stormy North Sea to the British Isles, displacing the indigenous Celtic-speaking populations. The resulting tongue, known today as Old English, was an intricate, highly inflected Germanic language possessing complex grammatical genders, elaborate noun cases, and guttural phonetics closely akin to modern Frisian.
The first major seismic metamorphosis occurred in the eighth century with the onslaught of Norse Viking invaders. The Old Norse spoken by Danish and Norwegian warriors blended with Old English across the Danelaw. Crucially, because the two tongues shared common Germanic roots but possessed conflicting case endings, speakers gradually discarded cumbersome grammatical inflections to facilitate trade, laying the groundwork for English's streamlined grammar. Everyday words of Norse provenance include 'sky', 'egg', 'window', 'take', and the fundamental pronouns 'they', 'them', and 'their'.
In 1066, the Norman Conquest dealt an even more radical transformation. When William the Conqueror seized the English throne, Norman French became the language of the royal court, aristocracy, jurisprudence, and high administration, while Old English was relegated to peasantry. For three centuries, two parallel vocabularies developed side-by-side: Anglo-Saxon peasants tended the 'ox', 'cow', 'swine', and 'sheep' in muddy fields, while Norman lords consumed 'beef', 'veal', 'pork', and 'mutton' in lavish dining halls.
When English finally re-emerged as the national tongue during the Renaissance, scholars deliberately injected tens of thousands of Greek and Latin terms into the lexicon to accommodate scientific discourse. Today, boasting an estimated vocabulary exceeding one million words and spoken by nearly two billion people, English thrives not because of rigid purity, but because of its voracious, pragmatic genius for welcoming words from every culture on Earth.`,
      questions: [
        { q: "¿Qué tribus germánicas llevaron por primera vez el origen del inglés a las islas británicas?", options: ["Los anglos, sajones y jutos", "Los francos y galos", "Los visigodos y celtas"], correct: "Los anglos, sajones y jutos" },
        { q: "¿Por qué existen pares de palabras como 'cow' (vaca) y 'beef' (carne de res) en inglés?", options: ["Porque los campesinos sajones criaban el animal ('cow') y los nobles normandos comían la carne ('beef')", "Por una reforma ortográfica en el siglo XIX", "Porque 'beef' proviene del gaélico escocés"], correct: "Porque los campesinos sajones criaban el animal ('cow') y los nobles normandos comían la carne ('beef')" },
        { q: "¿Cuál ha sido la mayor fortaleza histórica del idioma inglés para convertirse en lingua franca?", options: ["Su naturaleza híbrida y su voraz capacidad para absorber palabras de múltiples culturas", "Su gramática con estrictos géneros gramaticales", "Su aislamiento de influencias extranjeras"], correct: "Su naturaleza híbrida y su voraz capacidad para absorber palabras de múltiples culturas" }
      ]
    }
  ];

const LISTENING_LAB_DATA = {
    dialogues: [
      {
        id: "d1", title: "Coffee Shop Order (A1)", level: "A1",
        lines: [
          { speaker: "Barista", text: "Good morning! Welcome to Cyber Coffee. What can I get for you today?" },
          { speaker: "Customer", text: "Hi! I would like a large cappuccino with oat milk, please." },
          { speaker: "Barista", text: "Sure thing. Would you like that for here or to go?" },
          { speaker: "Customer", text: "To go, please. And could I also get a blueberry muffin?" },
          { speaker: "Barista", text: "Certainly! That comes to $6.50. You can tap your card right here." }
        ],
        question: { q: "¿Qué leche pidió el cliente en su café?", options: ["Leche de avena (oat milk)", "Leche entera", "Leche de almendras"], correct: "Leche de avena (oat milk)" }
      },
      {
        id: "d2", title: "Checking into a Hotel in London (A2)", level: "A2",
        lines: [
          { speaker: "Receptionist", text: "Good afternoon, sir. Welcome to the Royal Kensington Hotel." },
          { speaker: "Guest", text: "Good afternoon. I have a reservation under the name Carlos Gomez." },
          { speaker: "Receptionist", text: "Let me check our system... Yes, a deluxe king room for three nights. May I see your passport and a credit card?" },
          { speaker: "Guest", text: "Here they are. By the way, is breakfast included in the booking?" },
          { speaker: "Receptionist", text: "Yes, complimentary continental breakfast is served on the second floor from 7:00 to 10:30 AM. Here is your keycard for room 412." }
        ],
        question: { q: "¿En qué piso y a qué hora se sirve el desayuno?", options: ["Segundo piso de 7:00 a 10:30 AM", "Primer piso de 6:00 a 9:00 AM", "Tercer piso las 24 horas"], correct: "Segundo piso de 7:00 a 10:30 AM" }
      },
      {
        id: "d3", title: "Discussing Project Deadlines (B1)", level: "B1",
        lines: [
          { speaker: "Manager", text: "Thanks for meeting with me, Sarah. How is the client presentation coming along?" },
          { speaker: "Sarah", text: "We have finalized the market research slides, but we're still waiting for the design team's graphics." },
          { speaker: "Manager", text: "Do you think we can still meet our Thursday afternoon deadline?" },
          { speaker: "Sarah", text: "If they deliver the assets by noon tomorrow, we will have plenty of time for a full dry run." },
          { speaker: "Manager", text: "Excellent. Let me know immediately if any roadblocks arise." }
        ],
        question: { q: "¿Cuándo es la fecha límite para la presentación?", options: ["Jueves por la tarde", "Viernes por la mañana", "Miércoles al mediodía"], correct: "Jueves por la tarde" }
      },
      {
        id: "d4", title: "Tech Strategy Debate (B2)", level: "B2",
        lines: [
          { speaker: "Alex", text: "Migrating our core architecture to serverless microservices could reduce infrastructure costs by thirty percent." },
          { speaker: "Elena", text: "That may be true, Alex, but we need to account for cold starts and vendor lock-in. Have we evaluated open-source Kubernetes alternatives?" },
          { speaker: "Alex", text: "Our DevOps pipeline is already configured for cloud-native containers. The transition would be relatively seamless." },
          { speaker: "Elena", text: "Let us run a pilot benchmark with twenty percent of staging traffic before committing the entire production cluster." }
        ],
        question: { q: "¿Qué propone Elena antes de migrar todo el sistema a producción?", options: ["Hacer una prueba piloto con el 20% del tráfico", "Cancelar la migración", "Comprar servidores físicos"], correct: "Hacer una prueba piloto con el 20% del tráfico" }
      },
      {
        id: "d5", title: "Executive Negotiation & Strategic Alignment (C1)", level: "C1",
        lines: [
          { speaker: "Director", text: "We appreciate your proposed terms, however, the exclusivity clause seems excessively restrictive for our European operations." },
          { speaker: "Partner", text: "Our intention is not to stifle your expansion, but rather to guarantee mutual commitment while scaling the localized distribution network." },
          { speaker: "Director", text: "If we concede on the exclusivity timeline from five years down to eighteen months, would you be amenable to adjusting the royalty threshold accordingly?" },
          { speaker: "Partner", text: "That sounds like a constructive compromise. We can instruct our legal counsel to draft an addendum reflecting those parameters." }
        ],
        question: { q: "¿Cuál fue el acuerdo para destrabar la cláusula de exclusividad?", options: ["Reducir el plazo de 5 años a 18 meses ajustando regalías", "Eliminar por completo las regalías", "Pospone la firma por un año"], correct: "Reducir el plazo de 5 años a 18 meses ajustando regalías" }
      }
    ],
    dictations: [
      { id: "dic1", text: "Consistency and daily dedication are the true secrets of language fluency.", level: "B1", hint: "Habla de constancia y dedicación diaria." },
      { id: "dic2", text: "Could you please tell me where the nearest train station is located?", level: "A2", hint: "Pregunta cortés sobre la ubicación de una estación." },
      { id: "dic3", text: "Artificial intelligence has fundamentally transformed modern digital communication.", level: "B2", hint: "Tema sobre inteligencia artificial y comunicación." },
      { id: "dic4", text: "Understatement is the quintessential cornerstone of British humor and wit.", level: "C1", hint: "Expresión sobre el humor británico sutil." },
      { id: "dic5", text: "I would like to schedule an appointment with Dr. Martinez for next Tuesday.", level: "A2", hint: "Reservar una cita médica para el martes." },
      { id: "dic6", text: "Cognitive neuroplasticity allows the human brain to rewire neural connections continuously.", level: "C2", hint: "Concepto científico sobre la plasticidad cerebral." }
    ],
    minimalPairs: [
      { id: "mp1", wordA: "ship", wordB: "sheep", phoneticA: "/ʃɪp/", phoneticB: "/ʃiːp/", target: "sheep", text: "The farmer sheared the white sheep in the morning." },
      { id: "mp2", wordA: "bat", wordB: "bet", phoneticA: "/bæt/", phoneticB: "/bet/", target: "bet", text: "I bet you will achieve English fluency soon." },
      { id: "mp3", wordA: "think", wordB: "sink", phoneticA: "/θɪŋk/", phoneticB: "/sɪŋk/", target: "think", text: "What do you think about this new proposal?" },
      { id: "mp4", wordA: "desert", wordB: "dessert", phoneticA: "/ˈdezərt/", phoneticB: "/dɪˈzɜːrt/", target: "dessert", text: "We ordered a delicious chocolate dessert after dinner." },
      { id: "mp5", wordA: "heart", wordB: "hurt", phoneticA: "/hɑːrt/", phoneticB: "/hɜːrt/", target: "heart", text: "Exercise keeps your heart healthy and strong." },
      { id: "mp6", wordA: "bitch", wordB: "beach", phoneticA: "/bɪtʃ/", phoneticB: "/biːtʃ/", target: "beach", text: "We walked along the sunny beach during our vacation." }
    ]
  };

const WRITING_WORKSHOPS_DATA = [
    {
      id: "w1", title: "A1: Personal Introduction & Daily Life", level: "A1", minWords: 40,
      prompt: "Escribe una breve presentación personal. Menciona tu nombre, tu ciudad, tu ocupación o estudios, y dos cosas que te guste hacer en tu tiempo libre.",
      keywords: ["name", "from", "live", "student / work", "enjoy", "hobby", "because"],
      modelAnswer: "Hello! My name is Mateo and I am from Mexico. I live in a quiet city near the mountains. I am a university student studying computer science. In my free time, I really enjoy reading science fiction books and practicing English every single day because it opens many doors for my future."
    },
    {
      id: "w2", title: "A2: Describing a Memorable Trip or Vacation", level: "A2", minWords: 70,
      prompt: "Describe un viaje o vacaciones memorables que hayas hecho en el pasado. Usa verbos en Past Simple (went, stayed, visited, saw, tasted). Menciona con quién viajaste, qué lugares visitaste y cómo te sentiste.",
      keywords: ["last year", "traveled to", "visited", "stayed at", "delicious", "because", "unforgettable"],
      modelAnswer: "Last summer, I traveled to Spain with two of my closest friends. We stayed at a historic boutique hotel in the heart of Barcelona. During the day, we visited the Sagrada Familia and walked along the vibrant streets of Las Ramblas. In the evenings, we tasted delicious seafood paella at a local seaside restaurant. It was an unforgettable adventure because we experienced an inspiring new culture."
    },
    {
      id: "w3", title: "B1: Formal Professional Email Inquiring About an Internship", level: "B1", minWords: 90,
      prompt: "Redacta un correo electrónico formal dirigido al Departamento de Recursos Humanos de una empresa internacional, preguntando por oportunidades de pasantías o empleo junior. Mantén un tono cortés y profesional.",
      keywords: ["Dear Hiring Manager", "I am writing to inquire", "academic background", "attached resume", "look forward to hearing", "Sincerely"],
      modelAnswer: `Dear Hiring Manager,

I am writing to express my strong interest in upcoming junior internship opportunities within your technology division. As a passionate computer engineering student with a strong command of modern software architecture and English, I have closely followed your company's innovative projects in cloud computing.

I have attached my updated resume for your consideration. I would welcome the opportunity to discuss how my proactive mindset and technical skills could contribute to your team.

Thank you very much for your time and consideration. I look forward to hearing from you.

Sincerely,
Mateo Silva`
    },
    {
      id: "w4", title: "B2: Opinion Essay: The Balance of Artificial Intelligence in Society", level: "B2", minWords: 120,
      prompt: "Escribe un ensayo de opinión breve argumentando sobre el impacto de la Inteligencia Artificial en el empleo y la creatividad humana. Presenta tu postura con claridad y utiliza conectores de contraste.",
      keywords: ["On the one hand", "Furthermore", "However", "In my perspective", "Consequently", "To conclude"],
      modelAnswer: `In recent years, the exponential rise of artificial intelligence has sparked intense debate regarding the future of human labor and intellectual creativity. On the one hand, automation unquestionably streamlines repetitive tasks, allowing professionals to delegate tedious administrative burdens and focus on strategic problem-solving. Furthermore, machine learning models accelerate medical diagnoses and scientific discoveries.

However, critics rightly point out the potential disruption to employment markets and the ethical risks of algorithmic bias. In my perspective, rather than replacing human ingenuity, artificial intelligence should be treated as a cognitive collaborator. To conclude, embracing technological literacy while establishing strict ethical frameworks will ensure that AI serves as a catalyst for collective human prosperity.`
    },
    {
      id: "w5", title: "C1: Persuasive Cover Letter for an International Leadership Role", level: "C1", minWords: 150,
      prompt: "Escribe una carta de presentación persuasiva de nivel avanzado demostrando tu liderazgo, capacidad de adaptación multicultural y resolución de problemas estratégicos.",
      keywords: ["Spearheaded", "Proven track record", "Cross-functional", "Holistic", "Strategic vision", "Underscore"],
      modelAnswer: `Dear Members of the Executive Search Committee,

I am writing to submit my application for the Lead Operations Strategist position. With over six years of experience orchestrating cross-functional teams across Latin America and Europe, I have cultivated a proven track record of aligning operational efficiency with sustainable long-term revenue growth.

In my previous tenure, I spearheaded an enterprise-wide cloud transformation that curtailed operational latency by thirty-five percent while reducing expenditure. What truly distinguishes my leadership methodology is a holistic commitment to fostering psychological safety and cognitive diversity within teams. Navigating ambiguous global markets has reinforced my conviction that empathetic communication is the paramount catalyst for organizational resilience.

I would relish the opportunity to discuss how my strategic vision and dedication can empower your organization's forthcoming international initiatives.

Warm regards,
Mateo Silva`
    },
    {
      id: "w6", title: "C2: Philosophical Discourse on the Ethics of Memory Editing", level: "C2", minWords: 180,
      prompt: "Redacta un texto argumentativo de nivel de maestría nativa explorando el dilema bioético de la alteración artificial de recuerdos traumáticos mediante neurotecnología.",
      keywords: ["Dichotomy", "Intrinsic", "Pervasive", "Idiosyncratic", "Paradoxical", "Inextricably linked"],
      modelAnswer: `The prospect of pharmacological and optogenetic memory editing occupies a contentious frontier at the intersection of neuroscience, bioethics, and existential philosophy. At first glance, the capacity to selectively excise traumatic memories presents an ostensibly benevolent triumph over chronic post-traumatic distress. The alleviation of psychological torment is, after all, a noble mandate of modern medical science.

Nevertheless, a profound philosophical conundrum emerges when we examine the ontological nature of personal identity. Our character, emotional resilience, and empathetic capacities are inextricably linked to the narrative synthesis of our past tribulations. To artificially redact painful recollections is to jeopardize the organic continuity of selfhood. Suffering, while undeniably agonizing, frequently serves as the crucible within which wisdom and moral fortitude are forged.

Consequently, while therapeutic interventions aimed at mitigating debilitating emotional arousal are justifiable, wholesale eradication of memory risks producing a sterilized human consciousness devoid of authentic depth. True psychological flourishing demands not the erasure of our scars, but their conscious integration into a transcendent life narrative.`
    }
  ];

const SPEAKING_DIALOGUES_DATA = [
    {
      id: "sp1", title: "International Airport Check-in (A1-A2)", level: "A1-A2", icon: "🛫",
      turns: [
        { role: "Agent", avatar: "👩‍✈️", text: "Good morning! Welcome to Star Airlines. May I see your passport and flight confirmation code, please?" },
        { role: "You", avatar: "🧑", text: "Good morning! Here is my passport and my digital booking confirmation on my phone.", tip: "Pronuncia claro: 'passport' /ˈpæspɔːrt/ y 'confirmation' /ˌkɑːnfərˈmeɪʃn/." },
        { role: "Agent", avatar: "👩‍✈️", text: "Thank you. Are you checking in any luggage today, or do you only have carry-on bags?" },
        { role: "You", avatar: "🧑", text: "I have one suitcase to check in, and this small black backpack as my carry-on.", tip: "Enfatiza 'suitcase' /ˈsuːtkeɪs/ y 'carry-on' /ˈkæri ɑːn/." },
        { role: "Agent", avatar: "👩‍✈️", text: "Please place your suitcase onto the scale. Perfect, 18 kilos. Here is your boarding pass. Your flight departs from Gate B24 at 10:15 AM." },
        { role: "You", avatar: "🧑", text: "Thank you so much for your kind help. Have a wonderful day!", tip: "Fórmula de cortesía: 'Have a wonderful day!' con entonación ascendente-descendente." }
      ]
    },
    {
      id: "sp2", title: "Checking in at a Boutique Hotel in London (A2-B1)", level: "A2-B1", icon: "🛎️",
      turns: [
        { role: "Agent", avatar: "🏨", text: "Good afternoon, sir. Welcome to The Westminster Terrace. How may I assist you today?" },
        { role: "You", avatar: "🧑", text: "Good afternoon. I have a room reservation under the name Carlos Silva.", tip: "Habla con cortesía británica: 'Good afternoon. I have a room reservation under...'" },
        { role: "Agent", avatar: "🏨", text: "Delighted to have you with us, Mr. Silva. I have you booked for four nights in an Executive King Suite overlooking the courtyard." },
        { role: "You", avatar: "🧑", text: "That sounds wonderful! Could you tell me what time breakfast is served in the morning?", tip: "Usa la forma indirecta cortés: 'Could you tell me what time...'" },
        { role: "Agent", avatar: "🏨", text: "Certainly. Our full English breakfast is served in the Orangery Restaurant on the ground floor between 7:00 and 10:30 AM." },
        { role: "You", avatar: "🧑", text: "Excellent. Also, is high-speed Wi-Fi accessible in the room?", tip: "Pregunta con fluidez: 'is high-speed Wi-Fi accessible in the room?'" }
      ]
    },
    {
      id: "sp3", title: "Ordering Dinner at a New York Bistro (B1)", level: "B1", icon: "🍷",
      turns: [
        { role: "Agent", avatar: "👨‍🍳", text: "Good evening! Welcome to Manhattan Bistro. Can I start you off with something refreshing to drink?" },
        { role: "You", avatar: "🧑", text: "Good evening. Could I start with a sparkling water with lime, please?", tip: "'Sparkling water' es agua con gas. 'Could I start with...' es la forma más natural." },
        { role: "Agent", avatar: "👨‍🍳", text: "Of course. Tonight our chef recommends the pan-seared Atlantic salmon with roasted asparagus and garlic puree." },
        { role: "You", avatar: "🧑", text: "That sounds mouthwatering. Does the dish contain any dairy or gluten?", tip: "Aprende a preguntar por alergias: 'Does the dish contain any dairy or gluten?'" },
        { role: "Agent", avatar: "👨‍🍳", text: "The puree does contain butter, but our kitchen can happily prepare an olive-oil alternative for you." },
        { role: "You", avatar: "🧑", text: "That would be fantastic. I will take the salmon with the olive-oil preparation, thank you.", tip: "'That would be fantastic' demuestra naturalidad conversacional." }
      ]
    },
    {
      id: "sp4", title: "Job Interview with a Global Tech Company (B2-C1)", level: "B2-C1", icon: "💼",
      turns: [
        { role: "Agent", avatar: "👩‍💼", text: "Welcome, Mateo. We were thoroughly impressed by your portfolio. Could you tell us about a challenging technical roadblock you resolved under pressure?" },
        { role: "You", avatar: "🧑", text: "Certainly. In my previous project, we faced a critical database latency bottleneck during peak traffic. I spearheaded the refactoring of our indexing strategy and introduced a Redis caching layer, which reduced query response times by forty percent.", tip: "Usa verbos de acción: 'spearheaded', 'refactoring', 'reduced query response times'." },
        { role: "Agent", avatar: "👩‍💼", text: "That is an exemplary result. How do you handle constructive criticism when architectural disagreements arise within your team?" },
        { role: "You", avatar: "🧑", text: "I view feedback as a collaborative gift. I actively listen to decouple personal ego from architectural decisions, focusing entirely on empirical data and user outcomes.", tip: "Excelente frase ejecutiva: 'decouple personal ego from architectural decisions'." },
        { role: "Agent", avatar: "👩‍💼", text: "Compelling answer. Where do you envision your professional trajectory over the next three years?" },
        { role: "You", avatar: "🧑", text: "I aspire to evolve into a principal system architect, mentoring junior engineers while driving robust, scalable solutions.", tip: "Proyecta ambición con humildad: 'aspire to evolve into... mentoring junior engineers'." }
      ]
    },
    {
      id: "sp5", title: "Debating the Ethics of Artificial Intelligence (C1-C2)", level: "C1-C2", icon: "🤖",
      turns: [
        { role: "Agent", avatar: "🧑‍🏫", text: "Colleague, while generative models democratize creativity, do you not concede that they inherently cannibalize the intellectual property of human artists?" },
        { role: "You", avatar: "🧑", text: "I acknowledge the valid copyright concerns; nevertheless, human artistic evolution has perpetually been a process of synthesis, reinterpretation, and cultural dialogue.", tip: "Conectores de alto nivel: 'I acknowledge the valid concerns; nevertheless...'." },
        { role: "Agent", avatar: "🧑‍🏫", text: "Yet, when an algorithm produces an entire symphony in milliseconds, the scarcity that traditionally endowed art with metaphysical value is utterly dissolved." },
        { role: "You", avatar: "🧑", text: "Perhaps scarcity was never the true wellspring of aesthetic value; rather, it is the conscious intention, vulnerability, and human experience embedded within the narrative.", tip: "Argumento elocuente: 'scarcity was never the true wellspring of aesthetic value'." }
      ]
    }
  ];

const IDIOMS_DATA = [
    { id: "id1", phrase: "Break the ice", type: "Idiom", level: "A2-B1", meaning: "Romper el hielo; superar la incomodidad inicial en una conversación.", literal: "Romper un bloque de hielo físico.", example: "He told a lighthearted joke to break the ice before the presentation." },
    { id: "id2", phrase: "Bite the bullet", type: "Idiom", level: "B2", meaning: "Hacer de tripas corazón; afrontar una situación difícil e inevitable con valentía.", literal: "Morder una bala militar antes de una cirugía sin anestesia.", example: "I had to bite the bullet and tell my boss that the project was delayed." },
    { id: "id3", phrase: "Piece of cake", type: "Idiom", level: "A2", meaning: "Pan comido; algo sumamente fácil y sencillo de realizar.", literal: "Un trozo de pastel dulce.", example: "Don't stress over the quiz; it was a piece of cake!" },
    { id: "id4", phrase: "Hit the nail on the head", type: "Idiom", level: "B1", meaning: "Dar en el clavo; describir o acertar exactamente la causa de algo.", literal: "Golpear el clavo en la cabeza con un martillo.", example: "Her feedback really hit the nail on the head regarding our app's flaws." },
    { id: "id5", phrase: "Under the weather", type: "Idiom", level: "A2-B1", meaning: "Sentirse indispuesto, resfriado o con malestar físico leve.", literal: "Estar debajo del mal clima en el mar.", example: "I won't come to the gym tonight; I am feeling a bit under the weather." },
    { id: "id6", phrase: "Burn the midnight oil", type: "Idiom", level: "B1-B2", meaning: "Quemarse las pestañas; trabajar o estudiar hasta muy tarde en la noche.", literal: "Quemar el aceite de la lámpara a medianoche.", example: "She burned the midnight oil all week to pass her bar exam." },
    { id: "id7", phrase: "Spill the beans", type: "Idiom", level: "B1", meaning: "Irse de la lengua; revelar un secreto o sorpresa antes de tiempo.", literal: "Derramar los frijoles de un recipiente.", example: "We planned a surprise party, but my brother spilled the beans." },
    { id: "id8", phrase: "Cost an arm and a leg", type: "Idiom", level: "B1", meaning: "Costar un ojo de la cara; ser extremadamente costoso.", literal: "Costar un brazo y una pierna físicos.", example: "That luxury electric sports car costs an arm and a leg." },
    { id: "id9", phrase: "Once in a blue moon", type: "Idiom", level: "B1-B2", meaning: "Muy rara vez; un suceso sumamente infrecuente.", literal: "Una segunda luna llena en un mismo mes.", example: "He lives in Australia, so we only see him once in a blue moon." },
    { id: "id10", phrase: "Barking up the wrong tree", type: "Idiom", level: "B2", meaning: "Buscar en el lugar equivocado; acusar a la persona incorrecta.", literal: "Un perro de caza ladrando al árbol donde no está la presa.", example: "If you think I took your keys, you are barking up the wrong tree." },
    { id: "id11", phrase: "Take it with a grain of salt", type: "Idiom", level: "B2", meaning: "Tomarlo con reservas; no creer algo al pie de la letra.", literal: "Tomar una comida con un grano de sal para digerir.", example: "Read celebrity gossip magazines with a grain of salt." },
    { id: "id12", phrase: "Cut corners", type: "Idiom", level: "B2", meaning: "Abaratar costos tomando atajos peligrosos o de mala calidad.", literal: "Cortar las esquinas en un camino.", example: "Never cut corners when it comes to cybersecurity protocols." },
    
    // PHRASAL VERBS
    { id: "pv1", phrase: "Look forward to", type: "Phrasal Verb", level: "B1", meaning: "Esperar algo con gran entusiasmo e ilusión.", literal: "Mirar hacia adelante.", example: "I am really looking forward to our weekend trip to Dublin." },
    { id: "pv2", phrase: "Give up", type: "Phrasal Verb", level: "A2", meaning: "Rendirse o abandonar un hábito.", literal: "Dar hacia arriba.", example: "Never give up on your language learning goals." },
    { id: "pv3", phrase: "Put off", type: "Phrasal Verb", level: "B1", meaning: "Posponer o procrastinar una tarea.", literal: "Poner fuera.", example: "Do not put off studying until the night before the exam." },
    { id: "pv4", phrase: "Run out of", type: "Phrasal Verb", level: "A2-B1", meaning: "Quedarse sin existencias de algo (tiempo, dinero, batería).", literal: "Correr fuera de.", example: "My laptop is running out of battery; where is the charger?" },
    { id: "pv5", phrase: "Call off", type: "Phrasal Verb", level: "B1", meaning: "Cancelar un evento o reunión planeada.", literal: "Llamar apagado.", example: "Due to the torrential rain, the match was called off." },
    { id: "pv6", phrase: "Come across", type: "Phrasal Verb", level: "B2", meaning: "Toparse con algo o alguien por pura casualidad.", literal: "Venir a través.", example: "While browsing the bookstore, I came across an ancient English dictionary." },
    { id: "pv7", phrase: "Turn down", type: "Phrasal Verb", level: "B1", meaning: "Rechazar una oferta o bajar el volumen.", literal: "Girar abajo.", example: "He turned down the job offer because the commute was too exhausting." },
    { id: "pv8", phrase: "Figure out", type: "Phrasal Verb", level: "B1", meaning: "Descifrar, resolver o entender cómo funciona un problema.", literal: "Figurar afuera.", example: "It took me hours to figure out the solution to the code bug." },
    { id: "pv9", phrase: "Get along with", type: "Phrasal Verb", level: "A2-B1", meaning: "Llevarse bien con alguien.", literal: "Obtener a lo largo con.", example: "I get along very well with my new coworkers." },
    { id: "pv10", phrase: "Break down", type: "Phrasal Verb", level: "B1", meaning: "Averiarse una máquina o desmoronarse emocionalmente.", literal: "Romper abajo.", example: "Our rental car broke down on the highway." },
    { id: "pv11", phrase: "Bring up", type: "Phrasal Verb", level: "B2", meaning: "Mencionar un tema en una conversación o criar a un hijo.", literal: "Traer arriba.", example: "Please don't bring up budget cuts during the general staff meeting." },
    { id: "pv12", phrase: "Carry on", type: "Phrasal Verb", level: "B1", meaning: "Continuar o seguir adelante a pesar de las dificultades.", literal: "Llevar sobre.", example: "Keep calm and carry on studying your vocabulary." }
  ];

const IRREGULAR_VERBS_DATA = [
    // Pattern 1: A-A-A (Formas Idénticas)
    { base: "cost", past: "cost", participle: "cost", trans: "Costar", pattern: "A-A-A", phonetic: "/kɔːst/" },
    { base: "cut", past: "cut", participle: "cut", trans: "Cortar", pattern: "A-A-A", phonetic: "/kʌt/" },
    { base: "hit", past: "hit", participle: "hit", trans: "Golpear", pattern: "A-A-A", phonetic: "/hɪt/" },
    { base: "hurt", past: "hurt", participle: "hurt", trans: "Doler / Lastimar", pattern: "A-A-A", phonetic: "/hɜːrt/" },
    { base: "let", past: "let", participle: "let", trans: "Permitir / Dejar", pattern: "A-A-A", phonetic: "/let/" },
    { base: "put", past: "put", participle: "put", trans: "Poner / Colocar", pattern: "A-A-A", phonetic: "/pʊt/" },
    { base: "read", past: "read", participle: "read", trans: "Leer (pasado se pronuncia /red/)", pattern: "A-A-A", phonetic: "/riːd/ - /red/" },
    { base: "set", past: "set", participle: "set", trans: "Establecer / Ajustar", pattern: "A-A-A", phonetic: "/set/" },
    { base: "shut", past: "shut", participle: "shut", trans: "Cerrar", pattern: "A-A-A", phonetic: "/ʃʌt/" },
    { base: "split", past: "split", participle: "split", trans: "Dividir / Separar", pattern: "A-A-A", phonetic: "/splɪt/" },

    // Pattern 2: A-B-B (Pasado y Participio Idénticos)
    { base: "bring", past: "brought", participle: "brought", trans: "Traer", pattern: "A-B-B", phonetic: "/brɪŋ/ - /brɔːt/" },
    { base: "build", past: "built", participle: "built", trans: "Construir", pattern: "A-B-B", phonetic: "/bɪld/ - /bɪlt/" },
    { base: "buy", past: "bought", participle: "bought", trans: "Comprar", pattern: "A-B-B", phonetic: "/baɪ/ - /bɔːt/" },
    { base: "catch", past: "caught", participle: "caught", trans: "Atrapar", pattern: "A-B-B", phonetic: "/kætʃ/ - /kɔːt/" },
    { base: "feel", past: "felt", participle: "felt", trans: "Sentir", pattern: "A-B-B", phonetic: "/fiːl/ - /felt/" },
    { base: "find", past: "found", participle: "found", trans: "Encontrar", pattern: "A-B-B", phonetic: "/faɪnd/ - /faʊnd/" },
    { base: "have", past: "had", participle: "had", trans: "Tener / Haber", pattern: "A-B-B", phonetic: "/hæv/ - /hæd/" },
    { base: "hear", past: "heard", participle: "heard", trans: "Oír / Escuchar", pattern: "A-B-B", phonetic: "/hɪr/ - /hɜːrd/" },
    { base: "keep", past: "kept", participle: "kept", trans: "Mantener / Guardar", pattern: "A-B-B", phonetic: "/kiːp/ - /kept/" },
    { base: "leave", past: "left", participle: "left", trans: "Salir / Dejar", pattern: "A-B-B", phonetic: "/liːv/ - /left/" },
    { base: "lose", past: "lost", participle: "lost", trans: "Perder", pattern: "A-B-B", phonetic: "/luːz/ - /lɔːst/" },
    { base: "make", past: "made", participle: "made", trans: "Hacer / Crear", pattern: "A-B-B", phonetic: "/meɪk/ - /meɪd/" },
    { base: "meet", past: "met", participle: "met", trans: "Conocer / Reunirse", pattern: "A-B-B", phonetic: "/miːt/ - /met/" },
    { base: "pay", past: "paid", participle: "paid", trans: "Pagar", pattern: "A-B-B", phonetic: "/peɪ/ - /peɪd/" },
    { base: "say", past: "said", participle: "said", trans: "Decir", pattern: "A-B-B", phonetic: "/seɪ/ - /sed/" },
    { base: "sell", past: "sold", participle: "sold", trans: "Vender", pattern: "A-B-B", phonetic: "/sel/ - /soʊld/" },
    { base: "send", past: "sent", participle: "sent", trans: "Enviar", pattern: "A-B-B", phonetic: "/send/ - /sent/" },
    { base: "spend", past: "spent", participle: "spent", trans: "Gastar / Pasar tiempo", pattern: "A-B-B", phonetic: "/spend/ - /spent/" },
    { base: "teach", past: "taught", participle: "taught", trans: "Enseñar", pattern: "A-B-B", phonetic: "/tiːtʃ/ - /tɔːt/" },
    { base: "tell", past: "told", participle: "told", trans: "Decir / Contar a alguien", pattern: "A-B-B", phonetic: "/tel/ - /toʊld/" },
    { base: "think", past: "thought", participle: "thought", trans: "Pensar", pattern: "A-B-B", phonetic: "/θɪŋk/ - /θɔːt/" },
    { base: "understand", past: "understood", participle: "understood", trans: "Entender", pattern: "A-B-B", phonetic: "/ˌʌndərˈstænd/ - /ˌʌndərˈstʊd/" },

    // Pattern 3: A-B-C (Todas las Formas Distintas)
    { base: "be", past: "was / were", participle: "been", trans: "Ser / Estar", pattern: "A-B-C", phonetic: "/biː/ - /wɑːz/ - /bɪn/" },
    { base: "begin", past: "began", participle: "begun", trans: "Comenzar", pattern: "A-B-C", phonetic: "/bɪˈɡɪn/ - /bɪˈɡæn/ - /bɪˈɡʌn/" },
    { base: "break", past: "broke", participle: "broken", trans: "Romper", pattern: "A-B-C", phonetic: "/breɪk/ - /broʊk/ - /ˈbroʊkən/" },
    { base: "choose", past: "chose", participle: "chosen", trans: "Elegir", pattern: "A-B-C", phonetic: "/tʃuːz/ - /tʃoʊz/ - /ˈtʃoʊzn/" },
    { base: "do", past: "did", participle: "done", trans: "Hacer", pattern: "A-B-C", phonetic: "/duː/ - /dɪd/ - /dʌn/" },
    { base: "drink", past: "drank", participle: "drunk", trans: "Beber", pattern: "A-B-C", phonetic: "/drɪŋk/ - /dræŋk/ - /drʌŋk/" },
    { base: "drive", past: "drove", participle: "driven", trans: "Conducir", pattern: "A-B-C", phonetic: "/draɪv/ - /droʊv/ - /ˈdrɪvn/" },
    { base: "eat", past: "ate", participle: "eaten", trans: "Comer", pattern: "A-B-C", phonetic: "/iːt/ - /eɪt/ - /ˈiːtn/" },
    { base: "fall", past: "fell", participle: "fallen", trans: "Caer", pattern: "A-B-C", phonetic: "/fɔːl/ - /fel/ - /ˈfɔːlən/" },
    { base: "fly", past: "flew", participle: "flown", trans: "Volar", pattern: "A-B-C", phonetic: "/flaɪ/ - /fluː/ - /floʊn/" },
    { base: "forget", past: "forgot", participle: "forgotten", trans: "Olvidar", pattern: "A-B-C", phonetic: "/fərˈɡet/ - /fərˈɡɑːt/ - /fərˈɡɑːtn/" },
    { base: "give", past: "gave", participle: "given", trans: "Dar", pattern: "A-B-C", phonetic: "/ɡɪv/ - /ɡeɪv/ - /ˈɡɪvn/" },
    { base: "go", past: "went", participle: "gone", trans: "Ir", pattern: "A-B-C", phonetic: "/ɡoʊ/ - /went/ - /ɡɔːn/" },
    { base: "grow", past: "grew", participle: "grown", trans: "Crecer / Cultivar", pattern: "A-B-C", phonetic: "/ɡroʊ/ - /ɡruː/ - /ɡroʊn/" },
    { base: "know", past: "knew", participle: "known", trans: "Saber / Conocer", pattern: "A-B-C", phonetic: "/noʊ/ - /nuː/ - /noʊn/" },
    { base: "see", past: "saw", participle: "seen", trans: "Ver", pattern: "A-B-C", phonetic: "/siː/ - /sɔː/ - /siːn/" },
    { base: "sing", past: "sang", participle: "sung", trans: "Cantar", pattern: "A-B-C", phonetic: "/sɪŋ/ - /sæŋ/ - /sʌŋ/" },
    { base: "speak", past: "spoke", participle: "spoken", trans: "Hablar", pattern: "A-B-C", phonetic: "/spiːk/ - /spoʊk/ - /ˈspoʊkən/" },
    { base: "take", past: "took", participle: "taken", trans: "Tomar / Llevar", pattern: "A-B-C", phonetic: "/teɪk/ - /tʊk/ - /ˈteɪkən/" },
    { base: "wear", past: "wore", participle: "worn", trans: "Vestir / Llevar puesto", pattern: "A-B-C", phonetic: "/wer/ - /wɔːr/ - /wɔːrn/" },
    { base: "write", past: "wrote", participle: "written", trans: "Escribir", pattern: "A-B-C", phonetic: "/raɪt/ - /roʊt/ - /ˈrɪtn/" },

    // Pattern 4: A-B-A (Base y Participio Idénticos)
    { base: "become", past: "became", participle: "become", trans: "Llegar a ser / Convertirse", pattern: "A-B-A", phonetic: "/bɪˈkʌm/ - /bɪˈkeɪm/ - /bɪˈkʌm/" },
    { base: "come", past: "came", participle: "come", trans: "Venir", pattern: "A-B-A", phonetic: "/kʌm/ - /keɪm/ - /kʌm/" },
    { base: "run", past: "ran", participle: "run", trans: "Correr", pattern: "A-B-A", phonetic: "/rʌn/ - /ræn/ - /rʌn/" }
  ];

const BUSINESS_ENGLISH_DATA = {
    templates: [
      {
        id: "b1", title: "Follow-Up After an Interview or Meeting", category: "Follow-up",
        subject: "Thank You — [Your Name] — Interview Follow-up",
        body: `Dear [Interviewer's Name],

Thank you very much for taking the time to speak with me today regarding the [Job Title] position. I greatly enjoyed learning more about your team's upcoming initiatives and strategic priorities.

Our conversation reinforced my enthusiasm for this role. I am confident that my experience in [Key Skill/Area] aligns seamlessly with the goals you outlined. Please let me know if you need any additional references or portfolio samples.

Sincerely,
[Your Name]`
      },
      {
        id: "b2", title: "Professional Apology for a Project Delay", category: "Client Communication",
        subject: "Update Regarding Project Milestone — [Project Name]",
        body: `Dear [Client Name],

I am writing to provide an update concerning our anticipated delivery timeline for [Milestone/Project].

Due to unforeseen integration complexities during quality assurance testing, we will require an additional three business days to ensure the deliverables meet our strict reliability standards. The finalized deliverables will now be ready on [New Date].

We sincerely apologize for any inconvenience this adjustment may cause and remain fully dedicated to exceeding your expectations.

Best regards,
[Your Name]`
      },
      {
        id: "b3", title: "Politely Declining a Job Offer or Proposal", category: "Negotiation",
        subject: "Offer of Employment — [Your Name]",
        body: `Dear [Hiring Manager Name],

Thank you so much for extending the offer to join [Company Name] as [Position]. I have immense respect for your organization and was truly impressed by everyone I had the pleasure of meeting.

After thorough consideration, I have decided to accept another opportunity that aligns more closely with my current long-term career aspirations. This was a difficult decision given the compelling nature of your mission.

I wish you and the team continued success, and I hope our paths cross again in the future.

Warm regards,
[Your Name]`
      }
    ],
    meetingPhrases: [
      { category: "Interrumpiendo con Cortesía", phrase: "Could I interject for just a moment?", es: "¿Podría intervenir solo un momento?" },
      { category: "Pidiendo Clarificación", phrase: "Could you elaborate on what you mean by that metric?", es: "¿Podrías profundizar en lo que quieres decir con esa métrica?" },
      { category: "Desacuerdo Diplomático", phrase: "I see your point, however, have we considered the scalability risks?", es: "Entiendo tu punto, no obstante, ¿hemos considerado los riesgos de escalabilidad?" },
      { category: "Cerrando Acuerdos", phrase: "To recap, our primary action items for next week are...", es: "Para recapitular, nuestros puntos de acción principales para la próxima semana son..." }
    ],
    actionVerbs: [
      { verb: "Spearheaded", trans: "Lideró / Encabezó una iniciativa pionera", ex: "Spearheaded an enterprise migration that boosted throughput by 35%." },
      { verb: "Orchestrated", trans: "Orquestó / Coordinó elementos complejos", ex: "Orchestrated cross-functional collaboration among 40 engineers." },
      { verb: "Overhauled", trans: "Renovó por completo / Reestructuró", ex: "Overhauled the legacy billing system to eliminate checkout friction." },
      { verb: "Streamlined", trans: "Optimizó / Agilizó procesos", ex: "Streamlined data ingestion pipelines to reduce processing costs." }
    ]
  };

  // Achievements
  const ACHIEVEMENTS_DATA = [
    // ── PROGRESO ──────────────────────────────────────────────────────────
    { id: "ach_first_lesson",      title: "First Steps",        icon: "👟", desc: "Completa tu primera lección.", target: 1, type: "lessons" },
    { id: "ach_lessons_5",         title: "Getting Started",    icon: "🚀", desc: "Completa 5 lecciones.", target: 5, type: "lessons" },
    { id: "ach_lessons_20",        title: "Dedicated Learner",  icon: "📖", desc: "Completa 20 lecciones.", target: 20, type: "lessons" },
    { id: "ach_lessons_50",        title: "Halfway Hero",       icon: "🏅", desc: "Completa 50 lecciones.", target: 50, type: "lessons" },
    { id: "ach_lessons_100",       title: "Century Club",       icon: "💯", desc: "Completa 100 lecciones.", target: 100, type: "lessons" },
    // ── RACHAS ────────────────────────────────────────────────────────────
    { id: "ach_on_fire",           title: "On Fire",            icon: "🔥", desc: "Mantén una racha de 3 días.", target: 3, type: "streak" },
    { id: "ach_high_voltage",      title: "High Voltage",       icon: "⚡", desc: "Racha de 7 días seguidos.", target: 7, type: "streak" },
    { id: "ach_unstoppable",       title: "Unstoppable",        icon: "💪", desc: "Racha de 14 días.", target: 14, type: "streak" },
    { id: "ach_legend_streak",     title: "Legend",             icon: "👑", desc: "Racha épica de 30 días.", target: 30, type: "streak" },
    // ── PALABRAS ──────────────────────────────────────────────────────────
    { id: "ach_word_collector",    title: "Word Collector",     icon: "📚", desc: "Desbloquea 20 palabras.", target: 20, type: "words" },
    { id: "ach_word_hoarder",      title: "Word Hoarder",       icon: "🗂️", desc: "Desbloquea 100 palabras.", target: 100, type: "words" },
    { id: "ach_lexicon_master",    title: "Lexicon Master",     icon: "🧩", desc: "Desbloquea 300 palabras.", target: 300, type: "words" },
    // ── ANKI / SRS ────────────────────────────────────────────────────────
    { id: "ach_anki_novice",       title: "SRS Novice",         icon: "🧠", desc: "Repasa 10 tarjetas en Anki.", target: 10, type: "anki_reviews" },
    { id: "ach_anki_adept",        title: "SRS Adept",          icon: "🔄", desc: "Repasa 50 tarjetas en Anki.", target: 50, type: "anki_reviews" },
    { id: "ach_anki_master",       title: "SRS Master",         icon: "🎓", desc: "Repasa 200 tarjetas en Anki.", target: 200, type: "anki_reviews" },
    // ── VIDEO LAB ─────────────────────────────────────────────────────────
    { id: "ach_video_scholar",     title: "Video Scholar",      icon: "🎬", desc: "Mira tu primer video en Video Lab.", target: 1, type: "video_watched" },
    { id: "ach_sentence_miner",    title: "Sentence Miner",     icon: "⛏️", desc: "Mina 5 frases del Video Lab.", target: 5, type: "sentences_mined" },
    { id: "ach_mining_addict",     title: "Mining Addict",      icon: "💎", desc: "Mina 25 frases del Video Lab.", target: 25, type: "sentences_mined" },
    // ── CHAT BOT ──────────────────────────────────────────────────────────
    { id: "ach_chat_first",        title: "First Contact",      icon: "💬", desc: "Completa tu primera conversación.", target: 1, type: "chats_completed" },
    { id: "ach_chat_master",       title: "Chat Master",        icon: "🗣️", desc: "Completa 3 conversaciones.", target: 3, type: "chats_completed" },
    { id: "ach_chat_addict",       title: "Social Butterfly",   icon: "🦋", desc: "Completa 10 conversaciones.", target: 10, type: "chats_completed" },
    // ── PRONUNCIACIÓN ─────────────────────────────────────────────────────
    { id: "ach_pronunciation_pro", title: "Pronunciation Pro",  icon: "🎤", desc: "Obtén 10 pronunciaciones correctas.", target: 10, type: "pronunciation_correct" },
    { id: "ach_voice_virtuoso",    title: "Voice Virtuoso",     icon: "🎼", desc: "50 pronunciaciones correctas.", target: 50, type: "pronunciation_correct" },
    // ── PRECISIÓN ─────────────────────────────────────────────────────────
    { id: "ach_perfect_score",     title: "Perfect Score",      icon: "🎯", desc: "Completa una lección sin errores.", target: 1, type: "perfect" },
    { id: "ach_flawless_5",        title: "Flawless Run",       icon: "✨", desc: "Completa 5 lecciones perfectas.", target: 5, type: "perfect" },
    // ── NIVELES CEFR ──────────────────────────────────────────────────────
    { id: "ach_b2_vanguard",       title: "B2 Vanguard",        icon: "🌐", desc: "Estudia en nivel B2 o superior.", target: 1, type: "target_b2" },
    // ── XP ────────────────────────────────────────────────────────────────
    { id: "ach_xp_1000",           title: "XP Climber",         icon: "📈", desc: "Acumula 1,000 XP.", target: 1000, type: "xp" },
    { id: "ach_xp_5000",           title: "XP Hunter",          icon: "🏹", desc: "Acumula 5,000 XP.", target: 5000, type: "xp" },
    // ── TIENDA / RULETA ───────────────────────────────────────────────────
    { id: "ach_lucky_winner",      title: "Lucky Winner",       icon: "🎰", desc: "Gira la ruleta de la suerte.", target: 1, type: "wheel_spun" },
    { id: "ach_coin_saver",        title: "Coin Saver",         icon: "🪙", desc: "Acumula 500 monedas.", target: 500, type: "coins" },
    // ── PREMIUM SHOP ──────────────────────────────────────────────────────────
    { id: "ach_first_purchase",    title: "First Buy",          icon: "🛒", desc: "Compra un artículo en la tienda.", target: 1, type: "purchases" },
    { id: "ach_shopaholic",        title: "Shopaholic",         icon: "🏪", desc: "Compra 5 artículos en la tienda.", target: 5, type: "purchases" },
    { id: "ach_premium_member",    title: "Premium Member",     icon: "💎", desc: "Desbloquea cualquier herramienta premium.", target: 1, type: "premium_unlocked" },
    // ── GRAMÁTICA ─────────────────────────────────────────────────────────────
    { id: "ach_grammar_first",     title: "Grammar Rookie",     icon: "📝", desc: "Completa tu primera unidad de gramática.", target: 1, type: "grammar_units" },
    { id: "ach_grammar_10",        title: "Grammar Enthusiast", icon: "📖", desc: "Completa 10 unidades de gramática.", target: 10, type: "grammar_units" },
    { id: "ach_grammar_master",    title: "Grammar Master",     icon: "🎓", desc: "Completa 25 unidades de gramática.", target: 25, type: "grammar_units" },
    // ── ESCRITURA ─────────────────────────────────────────────────────────────
    { id: "ach_first_writing",     title: "First Words",        icon: "✍️", desc: "Envía tu primer texto en Writing Studio.", target: 1, type: "writing_submitted" },
    { id: "ach_writing_5",         title: "Storyteller",        icon: "📜", desc: "Envía 5 textos en Writing Studio.", target: 5, type: "writing_submitted" },
    // ── CORAZONES / VIDAS ─────────────────────────────────────────────────────
    { id: "ach_iron_heart",        title: "Iron Heart",         icon: "🛡️", desc: "Completa una lección sin perder corazones.", target: 1, type: "perfect" },
    // ── RACHA ESPECIAL ────────────────────────────────────────────────────────
    { id: "ach_weekly_warrior",    title: "Weekly Warrior",     icon: "📅", desc: "Estudia los 7 días de la semana.", target: 7, type: "streak" },
    { id: "ach_month_champion",    title: "Month Champion",     icon: "🗓️", desc: "Racha de 60 días.", target: 60, type: "streak" },
    // ── MONEDAS ───────────────────────────────────────────────────────────────
    { id: "ach_coin_1000",         title: "Gold Rush",          icon: "💰", desc: "Acumula 1,000 monedas en total.", target: 1000, type: "coins_total" },
    // ── XP AVANZADO ───────────────────────────────────────────────────────────
    { id: "ach_xp_10000",          title: "XP Legend",          icon: "🌟", desc: "Acumula 10,000 XP.", target: 10000, type: "xp" },
    // ── MULTILINGUAL ──────────────────────────────────────────────────────────
    { id: "ach_quiz_10",           title: "Quiz Warrior",       icon: "⚔️", desc: "Supera 10 quizzes con 80%+.", target: 10, type: "quizzes_passed" },
    { id: "ach_quiz_25",           title: "Quiz Champion",      icon: "🏆", desc: "Supera 25 quizzes con 80%+.", target: 25, type: "quizzes_passed" },
    // ── ESPECIALES ────────────────────────────────────────────────────────────
    { id: "ach_night_owl",         title: "Night Owl",          icon: "🦉", desc: "Estudia después de las 11 PM.", target: 1, type: "night_study" },
    { id: "ach_early_bird",        title: "Early Bird",         icon: "🐦", desc: "Estudia antes de las 7 AM.", target: 1, type: "early_study" },
    { id: "ach_completionist",     title: "Completionist",      icon: "🎯", desc: "Desbloquea 25 logros.", target: 25, type: "achievements_count" }
  ];

  // Pronunciation Phrases (50 across A1-C1)
  const PRONUNCIATION_PHRASES = [
    { en: "Hello, how are you today?", phonetic: "/həˈloʊ haʊ ɑːr juː/", es: "Hola, ¿cómo estás hoy?", level: "A1" },
    { en: "What is your name?", phonetic: "/wɒt ɪz jɔːr neɪm/", es: "¿Cuál es tu nombre?", level: "A1" },
    { en: "Nice to meet you.", phonetic: "/naɪs tə miːt juː/", es: "Encantado de conocerte.", level: "A1" },
    { en: "Good morning, everyone!", phonetic: "/ɡʊd ˈmɔːrnɪŋ ˈevriwʌn/", es: "¡Buenos días a todos!", level: "A1" },
    { en: "Thank you very much.", phonetic: "/θæŋk juː ˈveri mʌtʃ/", es: "Muchas gracias.", level: "A1" },
    { en: "Where is the nearest bathroom?", phonetic: "/wɛr ɪz ðə ˈnɪrɪst ˈbæθruːm/", es: "¿Dónde está el baño más cercano?", level: "A2" },
    { en: "Can I have the menu, please?", phonetic: "/kæn aɪ hæv ðə ˈmenjuː pliːz/", es: "¿Me puede traer el menú, por favor?", level: "A2" },
    { en: "How much does this cost?", phonetic: "/haʊ mʌtʃ dʌz ðɪs kɒst/", es: "¿Cuánto cuesta esto?", level: "A2" },
    { en: "I would like to book a table for two.", phonetic: "/aɪ wʊd laɪk tə bʊk ə ˈteɪbəl fɔː tuː/", es: "Me gustaría reservar una mesa para dos.", level: "A2" },
    { en: "Could you speak more slowly, please?", phonetic: "/kʊd juː spiːk mɔːr ˈsloʊli pliːz/", es: "¿Podría hablar más lentamente, por favor?", level: "A2" },
    { en: "I am very interested in learning English.", phonetic: "/aɪ æm ˈveri ˈɪntrəstɪd ɪn ˈlɜːrnɪŋ ˈɪŋɡlɪʃ/", es: "Estoy muy interesado en aprender inglés.", level: "B1" },
    { en: "In my opinion, this is a great idea.", phonetic: "/ɪn maɪ əˈpɪnjən ðɪs ɪz ə ɡreɪt aɪˈdɪə/", es: "En mi opinión, esta es una gran idea.", level: "B1" },
    { en: "I see your point, but I disagree.", phonetic: "/aɪ siː jɔːr pɔɪnt bʌt aɪ ˌdɪsəˈɡriː/", es: "Veo tu punto, pero no estoy de acuerdo.", level: "B1" },
    { en: "I look forward to working with you.", phonetic: "/aɪ lʊk ˈfɔːrwərd tə ˈwɜːrkɪŋ wɪð juː/", es: "Tengo muchas ganas de trabajar contigo.", level: "B1" },
    { en: "Could you clarify what you mean by that?", phonetic: "/kʊd juː ˈklærɪfaɪ wɒt juː miːn baɪ ðæt/", es: "¿Podría aclarar a qué se refiere?", level: "B1" },
    { en: "The nuance of this expression is fascinating.", phonetic: "/ðə ˈnjuːɑːns əv ðɪs ɪkˈsprɛʃən ɪz ˈfæsɪneɪtɪŋ/", es: "El matiz de esta expresión es fascinante.", level: "B2" },
    { en: "I would like to draw your attention to this point.", phonetic: "/aɪ wʊd laɪk tə drɔː jɔːr əˈtɛnʃən tə ðɪs pɔɪnt/", es: "Me gustaría llamar su atención sobre este punto.", level: "B2" },
    { en: "Consistency is the cornerstone of language acquisition.", phonetic: "/kənˈsɪstənsi ɪz ðə ˈkɔːrnərˌstoʊn əv ˈlæŋɡwɪdʒ ˌækwɪˈzɪʃən/", es: "La constancia es la piedra angular de la adquisición del lenguaje.", level: "B2" },
    { en: "I have five years of experience in this field.", phonetic: "/aɪ hæv faɪv jɪrz əv ɪkˈspɪriəns ɪn ðɪs fiːld/", es: "Tengo cinco años de experiencia en este campo.", level: "B2" },
    { en: "The implications of this decision are far-reaching.", phonetic: "/ðiː ˌɪmplɪˈkeɪʃənz əv ðɪs dɪˈsɪʒən ɑːr fɑːr-ˈriːtʃɪŋ/", es: "Las implicaciones de esta decisión son de largo alcance.", level: "C1" },
    { en: "Rarely have I encountered such eloquent discourse.", phonetic: "/ˈrɛrli hæv aɪ ɪnˈkaʊntərd sʌtʃ ˈɛləkwənt dɪsˈkɔːrs/", es: "Raramente he encontrado un discurso tan elocuente.", level: "C1" },
    { en: "The ephemeral nature of beauty makes it all the more precious.", phonetic: "/ðiː ɪˈfɛmərəl ˈneɪtʃər əv ˈbjuːti meɪks ɪt ɔːl ðə mɔːr ˈprɛʃəs/", es: "La naturaleza efímera de la belleza la hace aún más preciosa.", level: "C1" }
  ];

  // Chat Bot Scenarios
  const CHAT_SCENARIOS = {
    restaurant: {
      name: "🍽️ Restaurante",
      intro: "Hello! Welcome to The Golden Fork. I'm your server tonight. Can I start you off with something to drink?",
      steps: [
        { keywords: ["water", "juice", "wine", "beer", "drink", "tea", "coffee"], response: "Excellent choice! And are you ready to order your meal, or would you like a few more minutes?", xp: 10 },
        { keywords: ["order", "like", "have", "want", "pizza", "pasta", "steak", "burger", "salad", "fish"], response: "Great selection! How would you like your meal cooked? And would you like any sides with that?", xp: 10 },
        { keywords: ["well done", "medium", "rare", "fries", "salad", "vegetables", "chips"], response: "Perfect! I'll put that order in right away. Is there anything else I can help you with?", xp: 10 },
        { keywords: ["bill", "check", "pay", "dessert", "ice cream", "cake"], response: "Of course! I'll bring that right over. Thank you so much for dining with us tonight. It was a pleasure!", xp: 15 }
      ],
      hints: ["Try: 'I'll have a glass of water, please'", "Try: 'I would like to order the pasta'", "Try: 'Medium, please, with a side salad'", "Try: 'Could I have the bill, please?'"],
      corrections: { "i want": "✏️ More polite: 'I would like' or 'Could I have'", "give me": "✏️ More polite: 'Could I have' or 'May I have'", "no i": "✏️ Remember capital I in English!" }
    },
    hotel: {
      name: "🏨 Hotel",
      intro: "Good evening! Welcome to the Grand Cyber Hotel. Do you have a reservation?",
      steps: [
        { keywords: ["yes", "have", "name", "reservation", "booking", "booked"], response: "Wonderful! Could you give me your full name for the booking, please?", xp: 10 },
        { keywords: ["room", "single", "double", "suite", "check", "night"], response: "Excellent! Your room is ready. Check-out is at 11 AM. Would you like help with your luggage?", xp: 10 },
        { keywords: ["breakfast", "wifi", "pool", "gym", "restaurant", "service"], response: "Breakfast is served from 7 to 10 AM. WiFi password is on your key card. Is there anything else you need?", xp: 10 },
        { keywords: ["thank", "great", "perfect", "wonderful", "good", "nice"], response: "Enjoy your stay! Don't hesitate to call reception if you need anything. Have a wonderful evening!", xp: 15 }
      ],
      hints: ["Try: 'Yes, I have a reservation under Smith'", "Try: 'I'd like a double room for two nights'", "Try: 'What time is breakfast served?'", "Try: 'Thank you, that's perfect!'"],
      corrections: { "i want room": "✏️ More natural: 'I'd like a room'", "how much": "✏️ Great question! Also try: 'What's the rate per night?'" }
    },
    directions: {
      name: "🗺️ Directions",
      intro: "Hi there! You look a bit lost. Can I help you find something?",
      steps: [
        { keywords: ["looking", "find", "where", "museum", "station", "park", "hotel", "restaurant", "airport"], response: "Sure! Walk straight ahead for two blocks, then turn left at the traffic lights. You'll see it on your right.", xp: 10 },
        { keywords: ["far", "long", "walk", "bus", "subway", "taxi", "minute"], response: "It's about a 10-minute walk from here. Alternatively, you can take the number 5 bus. The stop is just around the corner.", xp: 10 },
        { keywords: ["thank", "clear", "understand", "got it", "perfect"], response: "My pleasure! Enjoy your visit. This city has so much to offer. Don't miss the old town!", xp: 15 }
      ],
      hints: ["Try: 'Excuse me, I'm looking for the museum'", "Try: 'How far is it to walk?'", "Try: 'Thank you, that's very clear!'"],
      corrections: {}
    },
    job: {
      name: "💼 Job Interview",
      intro: "Good morning! Please take a seat. Thank you for coming in today. Could you tell me a little about yourself?",
      steps: [
        { keywords: ["work", "experience", "years", "background", "graduate", "study", "degree", "university"], response: "Impressive background! What would you say is your greatest professional strength?", xp: 10 },
        { keywords: ["skill", "leadership", "communication", "team", "problem", "creative", "analytical", "organized"], response: "Excellent. Can you give me a specific example of a challenge you overcame at work?", xp: 15 },
        { keywords: ["challenge", "project", "team", "solved", "achieved", "managed", "delivered", "result"], response: "Very impressive. Why are you interested in this particular role at our company?", xp: 10 },
        { keywords: ["passion", "opportunity", "grow", "develop", "interested", "love", "excited"], response: "Thank you for sharing that. We'll be in touch within the week. Do you have any questions for us?", xp: 15 }
      ],
      hints: ["Try: 'I have 3 years of experience in marketing'", "Try: 'My greatest strength is problem-solving'", "Try: 'I successfully managed a team of 5 people'", "Try: 'I'm passionate about innovation and growth'"],
      corrections: { "i am having": "✏️ Use simple present: 'I have 3 years of experience'", "my strength are": "✏️ Singular: 'my strength is'" }
    },
    friends: {
      name: "👥 Making Friends",
      intro: "Hey! I haven't seen you around here before. Are you new to the area?",
      steps: [
        { keywords: ["yes", "new", "just", "moved", "arrived", "visiting", "studying", "living"], response: "Oh cool! Welcome! I moved here two years ago and I love it. What do you do here?", xp: 10 },
        { keywords: ["student", "work", "study", "job", "engineer", "teacher", "business", "doctor", "artist"], response: "That's awesome! Do you have any hobbies? I love hiking and photography.", xp: 10 },
        { keywords: ["like", "love", "enjoy", "hobby", "music", "sports", "reading", "gaming", "cooking", "travel"], response: "No way, me too! We should hang out sometime. Have you found any good cafes or restaurants around here?", xp: 10 },
        { keywords: ["yes", "know", "place", "restaurant", "cafe", "bar", "maybe", "sometime", "sure", "great"], response: "Sounds like a plan! Let me give you my number. It's great to meet someone new. Welcome to the neighborhood!", xp: 15 }
      ],
      hints: ["Try: 'Yes, I just moved here last week'", "Try: 'I'm a student / I work as a teacher'", "Try: 'I love hiking and reading books'", "Try: 'I know a great cafe nearby!'"],
      corrections: { "i am liking": "✏️ State verbs don't use -ing: 'I like' not 'I am liking'" }
    }
  };

  // ==========================================================================
  // 2. AUDIO ENGINE (Web Audio API)
  // ==========================================================================
  class SoundManager {
    constructor() {
      this.enabled = true;
      try { this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { this.audioCtx = null; }
    }
    playTone(frequency, type, gainVal, duration, delay = 0) {
      if (!this.enabled || !this.audioCtx) return;
      try {
        const now = this.audioCtx.currentTime + delay;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain); gain.connect(this.audioCtx.destination);
        osc.start(now); osc.stop(now + duration);
      } catch(e) {}
    }
    playCorrect() {
      this.playTone(523.25,'triangle',0.12,0.15,0); this.playTone(659.25,'triangle',0.12,0.15,0.08);
      this.playTone(783.99,'triangle',0.14,0.18,0.16); this.playTone(1046.50,'sine',0.25,0.20,0.24);
    }
    playIncorrect() { this.playTone(180,'sawtooth',0.18,0.12,0); this.playTone(130,'sawtooth',0.25,0.15,0.15); }
    playClick() { this.playTone(750,'sine',0.04,0.04,0); }
    playCoin() { this.playTone(987.77,'sine',0.1,0.15,0); this.playTone(1318.51,'sine',0.2,0.18,0.07); }
    playFanfare() { [523.25,659.25,783.99,1046.50,1318.51].forEach((f,i) => this.playTone(f,'triangle',0.25,0.16,i*0.1)); }
    playAnkiFlip() { this.playTone(440,'triangle',0.08,0.08,0); this.playTone(880,'sine',0.1,0.1,0.05); }
  }


  // ==========================================================================
  // FIGMA 4 DESIGN SYSTEMS / THEMES METADATA
  // ==========================================================================
  const THEMES = {
    'cyberpunk': {
      id: 'cyberpunk',
      name: 'Cyberpunk HUD',
      subtitle: 'Original Sci-Fi & Neon Space',
      badge: 'ORIGINAL',
      font: 'Rajdhani / Inter',
      previewBg: '#07080f',
      previewCard: '#101220',
      accent1: '#8b5cf6',
      accent2: '#00f0ff',
      accent3: '#ec4899',
      tagline: 'Alto contraste, estética futurista, resplandores púrpura/cian y cielo de partículas estelares.'
    },
    'field-notes': {
      id: 'field-notes',
      name: '01 · Field Notes',
      subtitle: 'Editorial Botánico & Archivo',
      badge: 'FIGMA 01',
      font: 'Lora (Serif) & DM Sans',
      previewBg: '#f5f2ea',
      previewCard: '#fffdf7',
      accent1: '#246a50',
      accent2: '#426843',
      accent3: '#c28b52',
      tagline: 'Papel pergamino cálido, tipografía editorial clásica, tonos verdes botánicos y bordes refinados.'
    },
    'night-signal': {
      id: 'night-signal',
      name: '02 · Night Signal',
      subtitle: 'Radar Deep Dark & Lime',
      badge: 'FIGMA 02',
      font: 'Space Grotesk & IBM Plex',
      previewBg: '#08151f',
      previewCard: '#102937',
      accent1: '#d6fa63',
      accent2: '#8bb9ff',
      accent3: '#48b89f',
      tagline: 'Pizarra oceánica táctica profunda, acentos lima radar eléctricos y cuadrícula de alta legibilidad.'
    },
    'soft-studio': {
      id: 'soft-studio',
      name: '03 · Soft Studio',
      subtitle: 'Minimalista Pastel & Lavanda',
      badge: 'FIGMA 03',
      font: 'Manrope & Inter',
      previewBg: '#f5f2ff',
      previewCard: '#ffffff',
      accent1: '#6944a0',
      accent2: '#884069',
      accent3: '#a95831',
      tagline: 'Fondo lila suave, tarjetas blancas con curvas generosas de 20px, atmósfera zen y moderna.'
    },
    'aurora-flow': {
      id: 'aurora-flow',
      name: '04 · Aurora Flow',
      subtitle: 'Digital Academy · Midnight & Mint',
      badge: 'NEW',
      font: 'Space Grotesk & DM Sans',
      previewBg: '#0b1020',
      previewCard: '#17213b',
      accent1: '#9b8cff',
      accent2: '#55e6c1',
      accent3: '#ffad91',
      tagline: 'Un espacio de aprendizaje inmersivo: azul medianoche, violeta luminoso, menta y tarjetas de alto contraste.'
    }
  };

  // ==========================================================================
  // 3. MAIN APPLICATION ENGINE
  // ==========================================================================
  class Aura100App {
    constructor() {
      this.storageKey = "aura100_state_v3";
      this.sound = new SoundManager();
      this.activeView = "dashboard";
      this.currentModuleTab = "vocabulary";
      this.currentLessonsFilter = "all";
      this.activeLesson = null;
      this.activeExerciseIndex = 0;
      this.sessionMistakesCount = 0;
      this.sessionXpEarned = 0;
      this.selectedAnswer = null;
      this.isAnswerChecked = false;
      this.isHeartRecoveryMode = false;
      this.matchSelectedLeft = null;
      this.matchedPairs = [];
      this.unscrambleChips = [];
      this.placedChips = [];

      // Flashcard state
      this.flashcardIndex = 0;
      this.filteredFlashcards = [...MASTER_WORDS];
      this.currentFlashcard = this.filteredFlashcards[0];
      this.isFlipped = false;

      // Quiz state
      this.quizQuestions = [];
      this.quizIndex = 0;
      this.quizScore = 0;
      this.quizMissed = [];

      // Anki state
      this.ankiSessionQueue = [];
      this.ankiSessionIndex = 0;
      this.ankiSessionReviewedCount = 0;
      this.ankiActiveCard = null;
      this.ankiCorrectInSession = 0;
      this.ankiCramMode = false;

      // Video Lab state
      this.activeVideo = VIDEO_CATALOG[0];
      this.videoPlayerMode = 'youtube';
      this.cinemaPlaying = false;
      this.cinemaTimer = null;
      this.cinemaAnimFrame = null;
      this.currentSubIndex = 0;
      this.videoLoopMode = false;
      this.blurEnglish = false;
      this.hideSpanish = false;
      this.playbackSpeed = 1.0;
      this.minedWords = [];
      this.shadowingActive = false;
      this.shadowingStep = 0;
      this.ytPlayer = null;
      

      // Chat Bot state
      this.currentScenario = 'restaurant';
      this.chatStep = 0;
      this.chatXpEarned = 0;
      this.chatsCompletedCount = 0;

      // Pronunciation state
      this.pronunFilter = 'all';
      this.filteredPhrases = [...PRONUNCIATION_PHRASES];
      this.pronunIndex = 0;
      this.pronunCorrect = 0;
      this.pronunPartial = 0;
      this.pronunWrong = 0;
      this.speechRecognition = null;
      this.isListening = false;

      // Word inspector
      this.currentInspectedWordData = null;

            // Focus Mode Pomodoro state (Aura100 v4)
      this.focusModeActive = false;
      this.focusTimer = null;
      this.focusSecondsRemaining = 25 * 60;
      this.focusIsPaused = false;

      // Aura100 v4 Sub-Managers
      this.adaptiveEngine = typeof AdaptiveLearningEngine !== 'undefined' ? new AdaptiveLearningEngine(this) : null;
      this.placementManager = typeof PlacementTestManager !== 'undefined' ? new PlacementTestManager(this) : null;
      this.writingLab = typeof WritingLabManager !== 'undefined' ? new WritingLabManager(this) : null;
      this.grammarAI = typeof GrammarAITutor !== 'undefined' ? new GrammarAITutor(this) : null;
      this.vocabularyAI = typeof VocabularyAIManager !== 'undefined' ? new VocabularyAIManager(this) : null;
      this.audioAdapter = typeof AudioPronunciationAdapter !== 'undefined' ? new AudioPronunciationAdapter(this) : null;
      this.learningPlanManager = typeof LearningPlanManager !== 'undefined' ? new LearningPlanManager(this) : null;
      this.aiChat = typeof AIConversationPartner !== 'undefined' ? new AIConversationPartner(this) : null;

      this.state = this.loadState();
      this.checkDailyStreak();
    }

    getInitialState() {
      const randomUser = RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
      return {
        username: randomUser, avatar: "🦊", targetCefr: "B1",
        xp: 0, coins: 100, hearts: 3, maxHearts: 3,
        streak: 1, bestStreak: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        dailyGoalXp: 50, dailyCurrentXp: 0, dailyGoalCompleted: false,
        completedLessons: [], knownWords: ["w_hello","w_good_morning","w_goodbye","w_please","w_thank_you"],
        ankiDeck: [...INITIAL_ANKI_DECK], ankiReviewsLifetime: 0,
        unlockedAchievements: [], inventory: { streakFreeze: 0, doubleXp: 0 },
        purchases: 0, premiumUnlocked: 0, shopPurchaseHistory: [],
        doubleXpActiveCount: 0,
        lastWheelSpin: null, loginStreak: 0, lastLoginBonus: null,
        sentencesMined: 0, wheelSpins: 0,
        stats: {
          totalAnswers: 0, correctAnswers: 0, grammarCompleted: 0,
          categoriesPracticed: { vocabulary: true, grammar: false, reading: false, listening: false, writing: false, speaking: false, idioms: false, verbs: false, business: false },
          perfectLessonsCount: 0, quizzesPassed: 0, videosWatched: 0,
          chatsCompleted: 0, pronunciationCorrect: 0,
          weeklyXp: {}
        },
        soundEnabled: true,
        theme: "cyberpunk"
      };
    }

    loadState() {
      const initial = this.getInitialState();
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (!saved) return initial;

        const parsed = JSON.parse(saved);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return initial;

        const state = { ...initial, ...parsed };
        const savedStats = parsed.stats && typeof parsed.stats === 'object' && !Array.isArray(parsed.stats) ? parsed.stats : {};
        const savedInventory = parsed.inventory && typeof parsed.inventory === 'object' && !Array.isArray(parsed.inventory) ? parsed.inventory : {};
        state.stats = {
          ...initial.stats,
          ...savedStats,
          categoriesPracticed: {
            ...initial.stats.categoriesPracticed,
            ...(savedStats.categoriesPracticed && typeof savedStats.categoriesPracticed === 'object' ? savedStats.categoriesPracticed : {})
          },
          weeklyXp: {
            ...initial.stats.weeklyXp,
            ...(savedStats.weeklyXp && typeof savedStats.weeklyXp === 'object' ? savedStats.weeklyXp : {})
          }
        };
        state.inventory = { ...initial.inventory, ...savedInventory };
        if (!Array.isArray(state.shopPurchaseHistory)) state.shopPurchaseHistory = [];
        if (!Number.isFinite(Number(state.purchases))) state.purchases = 0;
        if (!Number.isFinite(Number(state.premiumUnlocked))) state.premiumUnlocked = 0;

        ['completedLessons', 'knownWords', 'ankiDeck', 'unlockedAchievements'].forEach((key) => {
          if (!Array.isArray(state[key])) state[key] = initial[key];
        });
        ['totalAnswers', 'correctAnswers', 'grammarCompleted', 'perfectLessonsCount', 'quizzesPassed', 'videosWatched', 'chatsCompleted', 'pronunciationCorrect'].forEach((key) => {
          if (!Number.isFinite(Number(state.stats[key]))) state.stats[key] = initial.stats[key];
        });
        if (typeof state.username !== 'string' || !state.username.trim()) state.username = initial.username;
        if (typeof state.avatar !== 'string' || state.avatar.length > 8) state.avatar = initial.avatar;
        if (!THEMES[state.theme]) state.theme = initial.theme;
        return state;
      } catch (e) {
        console.warn('State load error; using a safe default state.', e);
        return initial;
      }
    }

    saveState() {
      try { localStorage.setItem(this.storageKey, JSON.stringify(this.state)); } catch(e) {}
      this.updateHeaderAndSidebarUI();
    }

    // ========================================================================
    // STARS BACKGROUND ANIMATION
    // ========================================================================
    initStars() {
      const canvas = document.getElementById('stars-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3, a: Math.random(),
        speed: Math.random() * 0.008 + 0.002
      }));
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
          s.a += s.speed;
          if (s.a > 1) s.a = 0;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 180, 255, ${Math.sin(s.a * Math.PI) * 0.7})`;
          ctx.fill();
        });
        requestAnimationFrame(render);
      };
      render();
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }

    // ========================================================================
    // DAILY STREAK & LOGIN
    // ========================================================================
    checkDailyStreak() {
      const today = new Date().toISOString().split("T")[0];
      const last = this.state.lastActiveDate;
      if (last !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        if (last === yesterday) {
          this.state.streak++;
          if (this.state.streak > this.state.bestStreak) this.state.bestStreak = this.state.streak;
        } else if (last < yesterday) {
          if (this.state.inventory.streakFreeze > 0) {
            this.state.inventory.streakFreeze--;
            this.showToast("🛡️ Streak Freeze usado. ¡Tu racha está protegida!", "info");
          } else {
            this.state.streak = 1;
          }
        }
        this.state.lastActiveDate = today;
        this.state.dailyCurrentXp = 0;
        this.state.dailyGoalCompleted = false;
        this.saveState();
      }
    }

    // ========================================================================
    // NAVIGATION
    // ========================================================================
    // ========================================================================
    // FOCUS MODE / POMODORO TIMER (AURA100 v4.0)
    // ========================================================================
    toggleFocusMode() {
      this.focusModeActive = !this.focusModeActive;
      const hud = document.getElementById('focus-mode-hud');
      const body = document.body;
      if (this.focusModeActive) {
        body.classList.add('focus-mode-active');
        if (hud) hud.classList.remove('hidden');
        this.focusSecondsRemaining = 25 * 60;
        this.focusIsPaused = false;
        this.startFocusTimer();
        this.showToast("🧘 Modo Concentración activado (Pomodoro 25m)", "purple");
      } else {
        body.classList.remove('focus-mode-active');
        if (hud) hud.classList.add('hidden');
        this.stopFocusTimer();
        this.showToast("Modo Concentración desactivado", "cyan");
      }
    }

    toggleFocusTimerPause() {
      this.focusIsPaused = !this.focusIsPaused;
      const btn = document.getElementById('btn-focus-timer-pause');
      if (btn) btn.textContent = this.focusIsPaused ? '▶️ Reanudar' : '⏸️ Pausa';
    }

    startFocusTimer() {
      if (this.focusTimer) clearInterval(this.focusTimer);
      this.updateFocusTimerDisplay();
      this.focusTimer = setInterval(() => {
        if (!this.focusIsPaused && this.focusSecondsRemaining > 0) {
          this.focusSecondsRemaining--;
          this.updateFocusTimerDisplay();
          if (this.focusSecondsRemaining === 0) {
            this.sound.playFanfare();
            this.showToast("🎉 ¡Sesión Pomodoro de 25 min completada! Tómate un descanso de 5 min.", "gold");
            this.toggleFocusMode();
          }
        }
      }, 1000);
    }

    stopFocusTimer() {
      if (this.focusTimer) {
        clearInterval(this.focusTimer);
        this.focusTimer = null;
      }
    }

    updateFocusTimerDisplay() {
      const el = document.getElementById('focus-hud-timer');
      if (!el) return;
      const m = Math.floor(this.focusSecondsRemaining / 60);
      const s = this.focusSecondsRemaining % 60;
      el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    navigate(viewId) {
      const target = document.getElementById(`view-${viewId}`);
      if (!target || !target.classList.contains('content-view')) {
        console.warn(`Aura100: vista no encontrada: ${viewId}`);
        return;
      }
      this.sound.playClick();
      this.activeView = viewId;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === viewId));
      document.querySelectorAll('.content-view').forEach(el => el.classList.remove('active'));
      target.classList.add('active');
      this.toggleSidebar(false);
      if (viewId === 'dashboard') this.renderDashboard();
      if (viewId === 'placement' && this.placementManager) this.placementManager.render();
      if (viewId === 'mistakes' && this.adaptiveEngine) this.adaptiveEngine.renderMistakesNotebook();
      if (viewId === 'writing-lab' && this.writingLab) this.writingLab.render();
      if (viewId === 'lessons') this.renderLessonsPath();
      if (viewId === 'anki-srs') this.renderAnkiDashboard();
      if (viewId === 'video-lab') this.renderVideoLab();
      if (viewId === 'chatbot') this.renderChatBot();
      if (viewId === 'pronunciation') this.renderPronunciation();
      if (viewId === 'modules') this.renderModules();
      if (viewId === 'word-bank') this.renderWordBank();
      if (viewId === 'shop') this.renderShop();
      if (viewId === 'achievements') this.renderAchievements();
      if (viewId === 'progress') this.renderProgress();
      if (viewId === 'profile') this.renderProfile();
      if (viewId === 'quick-quiz') { this.renderQuickQuizIntro(); }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleSidebar(forceState) {
      const sb = document.getElementById('app-sidebar');
      const toggle = document.getElementById('btn-toggle-sidebar');
      if (!sb) return;
      const shouldOpen = typeof forceState === 'boolean' ? forceState : !sb.classList.contains('open');
      sb.classList.toggle('open', shouldOpen);
      if (toggle) toggle.setAttribute('aria-expanded', String(shouldOpen));
    }

    // ========================================================================
    // XP, COINS & LEVEL SYSTEM
    // ========================================================================
    getLevelInfo() {
      const thresholds = [0,100,250,500,900,1500,2500,4000,6000,10000];
      const names = ["Beginner","Explorer","Learner","Speaker","Communicator","Advanced","Expert","Master","Legend","Grandmaster"];
      const xp = this.state.xp;
      let level = 1;
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (xp >= thresholds[i]) { level = i + 1; break; }
      }
      level = Math.min(level, thresholds.length);
      const currentBase = thresholds[level - 1] || 0;
      const nextBase = thresholds[level] || thresholds[thresholds.length - 1];
      return { level, name: names[level - 1] || "Grandmaster", currentInLevel: xp - currentBase, needed: nextBase - currentBase };
    }

    addXp(amount) {
      if (this.state.doubleXpActiveCount > 0) { amount *= 2; this.state.doubleXpActiveCount--; }
      this.state.xp += amount;
      this.state.dailyCurrentXp += amount;
      const today = new Date().toISOString().split("T")[0];
      this.state.stats.weeklyXp = this.state.stats.weeklyXp || {};
      this.state.stats.weeklyXp[today] = (this.state.stats.weeklyXp[today] || 0) + amount;
      if (!this.state.dailyGoalCompleted && this.state.dailyCurrentXp >= this.state.dailyGoalXp) {
        this.state.dailyGoalCompleted = true;
        this.addCoins(50);
        this.showToast("🎯 ¡Meta Diaria completada! +50 monedas", "gold");
        this.sound.playFanfare();
      }
      this.saveState();
    }

    addCoins(amount) {
      const baseAmount = Number(amount) || 0;
      const multiplier = Math.max(1, Math.min(3, Number(this.state.coinMultiplier) || 1));
      const earned = Math.max(0, Math.round(baseAmount * multiplier));
      this.state.coinsEarnedTotal = (this.state.coinsEarnedTotal || 0) + earned;
      this.state.coins += earned;
      const coinEl = document.getElementById('header-coins');
      if (coinEl) {
        coinEl.textContent = this.state.coins;
        coinEl.parentElement.classList.add('coin-bounce');
        setTimeout(() => coinEl.parentElement.classList.remove('coin-bounce'), 400);
      }
    }

    // ========================================================================
    // HEADER & SIDEBAR UI
    // ========================================================================
    updateHeaderAndSidebarUI() {
      const { streak, coins, hearts, xp, username, avatar, targetCefr, maxHearts } = this.state;
      const li = this.getLevelInfo();
      const due = this.getDueAnkiCards();
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('header-streak', streak);
      set('header-coins', coins);
      set('header-hearts', `${hearts}/${maxHearts}`);
      set('header-xp', xp);
      set('header-username', username);
      set('header-anki-due', due.length);
      set('sidebar-anki-due-tag', due.length);
      const ankiTagEl = document.getElementById('sidebar-anki-due-tag');
      if (ankiTagEl) ankiTagEl.dataset.zero = due.length === 0 ? 'true' : 'false';
      const pendingMistakes = this.adaptiveEngine
        ? this.adaptiveEngine.mistakes.filter(m => m.status !== 'mastered').length
        : 0;
      set('sidebar-mistakes-due-tag', pendingMistakes);
      set('dash-mistakes-due-count', pendingMistakes);
      const mstTagEl = document.getElementById('sidebar-mistakes-due-tag');
      if (mstTagEl) mstTagEl.dataset.zero = pendingMistakes === 0 ? 'true' : 'false';
      set('header-cefr-val', targetCefr || 'B1');
      const avatarEl = document.getElementById('header-avatar-emoji');
      if (avatarEl) avatarEl.textContent = avatar;
      set('sidebar-level-label', `Level ${li.level}`);
      set('sidebar-level-name', li.name);
      set('sidebar-level-xp-text', `${li.currentInLevel} / ${li.needed} XP`);
      const bar = document.getElementById('sidebar-level-progress-bar');
      if (bar) bar.style.width = `${Math.min(100, Math.round((li.currentInLevel / li.needed) * 100))}%`;
      const acc = this.state.stats.totalAnswers > 0 ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalAnswers) * 100) : 0;
      set('dash-accuracy', `${acc}%`);
    }

    // ========================================================================
    // DASHBOARD
    // ========================================================================
    renderDashboard() {
      const { username, xp, streak, completedLessons, knownWords, dailyCurrentXp, dailyGoalXp, targetCefr } = this.state;
      const li = this.getLevelInfo();
      const due = this.getDueAnkiCards();
      const acc = this.state.stats.totalAnswers > 0 ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalAnswers) * 100) : 0;

      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('dash-username', username);
      set('dash-total-xp', xp);
      set('dash-level', `Level ${li.level}`);
      set('dash-level-sub', `${targetCefr || 'B1'} Track — ${li.name}`);
      set('dash-streak', streak);
      set('dash-words-learned', knownWords.length);
      set('dash-anki-due-count', due.length);
      set('dash-anki-stat', `${due.length} Pendientes`);
      set('dash-accuracy', `${acc}%`);
      set('dash-pillar-anki-badge', `${due.length} tarjetas listas`);

      // Daily goal
      const goalPct = Math.min(100, Math.round((dailyCurrentXp / dailyGoalXp) * 100));
      const goalBar = document.getElementById('dash-daily-progress');
      if (goalBar) goalBar.style.width = `${goalPct}%`;
      const goalBadge = document.getElementById('dash-daily-badge');
      if (goalBadge) goalBadge.textContent = `${dailyCurrentXp} / ${dailyGoalXp} XP`;
      const goalText = document.getElementById('dash-daily-progress-text');
      if (goalText) goalText.textContent = this.state.dailyGoalCompleted ? "🎉 ¡Meta completada hoy! ¡Excelente trabajo!" : `Faltan ${dailyGoalXp - dailyCurrentXp} XP para alcanzar tu meta diaria.`;

      // CEFR chips
      document.querySelectorAll('.cefr-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.cefr === targetCefr));
      set('dash-current-cefr-display', targetCefr || 'B1');

      // Adaptive Learning Engine recommendations & competencies (Aura100 v4)
      if (this.adaptiveEngine) {
        const rec = this.adaptiveEngine.getNextRecommendation();
        const banner = document.getElementById('dash-adaptive-recommendation-banner');
        if (banner && rec) {
          banner.classList.remove('hidden');
          const titleEl = document.getElementById('adaptive-rec-title');
          const reasonEl = document.getElementById('adaptive-rec-reason');
          const btnEl = document.getElementById('btn-adaptive-rec-action');
          if (titleEl) titleEl.textContent = rec.title;
          if (reasonEl) reasonEl.textContent = rec.reason;
          if (btnEl) {
            btnEl.textContent = `${rec.actionLabel || 'Continuar'} →`;
            btnEl.onclick = () => {
              if (rec.actionView === 'mistakes') this.navigate('mistakes');
              else if (rec.actionView === 'modules') this.navigate('modules');
              else if (rec.actionView === 'word-bank') this.navigate('word-bank');
              else if (rec.actionView === 'chatbot') this.navigate('chatbot');
              else if (rec.actionView === 'anki-srs') this.navigate('anki-srs');
              else if (rec.actionView === 'video-lab') this.navigate('video-lab');
              else this.navigate(rec.actionView || 'lessons');
            };
          }
        }

        // Populate #dash-competencies-grid with real quantitative metrics (0-100%)
        const compGrid = document.getElementById('dash-competencies-grid');
        if (compGrid && this.adaptiveEngine.metrics && this.adaptiveEngine.metrics.skills) {
          const skillMeta = {
            grammar: { label: 'Gramática', view: 'modules' },
            vocabulary: { label: 'Vocabulario', view: 'word-bank' },
            reading: { label: 'Lectura', view: 'modules' },
            listening: { label: 'Escucha', view: 'video-lab' },
            writing: { label: 'Escritura', view: 'writing-lab' },
            speaking: { label: 'Conversación', view: 'chatbot' }
          };
          compGrid.innerHTML = Object.entries(this.adaptiveEngine.metrics.skills).map(([key, data]) => {
            const meta = skillMeta[key] || { label: key, view: 'lessons' };
            const pct = data.attempts > 0 ? data.accuracy : 0;
            return `
              <button type="button" class="placement-skill-card skill-card-btn" onclick="app.navigate('${meta.view}')" title="Practicar ${meta.label}">
                <div class="skill-card-top">
                  <span class="skill-name">${meta.label}</span>
                  <span class="skill-pct">${pct}%</span>
                </div>
                <div class="progress-bar-wrap" style="height:6px;margin:0.45rem 0">
                  <div class="progress-bar-fill" style="width:${pct}%"></div>
                </div>
                <span class="skill-attempts">${data.attempts} ${data.attempts === 1 ? 'actividad' : 'actividades'}</span>
              </button>`;
          }).join('');
        }
      }

      // Daily missions
      this.renderDailyMissions();

      // Motivational quote
      const q = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];
      set('dash-quote', q.text);
      set('dash-quote-author', `— ${q.author}`);
    }

    renderDailyMissions() {
      const due = this.getDueAnkiCards();
      const anki = document.getElementById('mission-anki');
      const lesson = document.getElementById('mission-lesson');
      const video = document.getElementById('mission-video');
      const checkAnki = document.getElementById('mission-check-anki');
      const checkLesson = document.getElementById('mission-check-lesson');
      const checkVideo = document.getElementById('mission-check-video');

      const ankiDone = this.state.ankiReviewsLifetime >= (this.ankiSessionReviewedCount + 5);
      const lessonDone = this.state.completedLessons.length > 0;
      const videoDone = (this.state.stats.videosWatched || 0) > 0;

      if (anki) anki.classList.toggle('completed', ankiDone);
      if (lesson) lesson.classList.toggle('completed', lessonDone);
      if (video) video.classList.toggle('completed', videoDone);
      if (checkAnki) checkAnki.textContent = ankiDone ? '✅' : '○';
      if (checkLesson) checkLesson.textContent = lessonDone ? '✅' : '○';
      if (checkVideo) checkVideo.textContent = videoDone ? '✅' : '○';
    }

    continueLearning() {
      // Find next incomplete lesson
      const incomplete = LESSONS_DATA.find(l => !this.state.completedLessons.includes(l.id));
      if (incomplete) { this.startLessonSession(incomplete.id); }
      else { this.navigate('lessons'); }
    }

    // ========================================================================
    // CEFR LEVEL SYSTEM
    // ========================================================================
    setTargetCefr(levelCode) {
      this.state.targetCefr = levelCode;
      this.sound.playClick();
      this.saveState();
      this.showToast(`🎯 Nivel objetivo: ${levelCode}`, "cyan");
      document.querySelectorAll('.cefr-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.cefr === levelCode));
      const el = document.getElementById('dash-current-cefr-display');
      if (el) el.textContent = levelCode;
      const hel = document.getElementById('header-cefr-val');
      if (hel) hel.textContent = levelCode;
      if (['B2','C1','C2'].includes(levelCode)) this.checkAchievements();
    }

    showCefrSelectorModal() { document.getElementById('modal-cefr-picker')?.classList.remove('hidden'); }
    closeCefrSelectorModal() { document.getElementById('modal-cefr-picker')?.classList.add('hidden'); }

    // ========================================================================
    // LESSONS PATH
    // ========================================================================
    filterLessons(filter) {
      this.currentLessonsFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
      this.renderLessonsPath();
    }

    renderLessonsPath() {
      const grid = document.getElementById('lessons-path-grid');
      if (!grid) return;
      const filtered = this.currentLessonsFilter === 'all' ? LESSONS_DATA : LESSONS_DATA.filter(l => l.cefr === this.currentLessonsFilter);
      const cefrColors = { A1: '#10b981', A2: '#06b6d4', B1: '#8b5cf6', B2: '#ec4899', C1: '#f59e0b', C2: '#ef4444' };
      grid.innerHTML = filtered.map(lesson => {
        const done = this.state.completedLessons.includes(lesson.id);
        const color = cefrColors[lesson.cefr] || '#8b5cf6';
        return `<div class="lesson-card ${done ? 'completed' : ''}" onclick="app.startLessonSession('${lesson.id}')">
          <div class="lesson-card-header">
            <span class="lesson-number">LESSON ${lesson.number}</span>
            <span class="lesson-cefr-badge badge-diff" style="background:${color}22;color:${color};border-color:${color}55">${lesson.cefr}</span>
          </div>
          <div class="lesson-icon">${lesson.icon}</div>
          <div class="lesson-title">${lesson.title}</div>
          <div class="lesson-desc">${lesson.description}</div>
          <div class="lesson-meta">
            <span class="lesson-meta-time">⏱️ ${lesson.time || '~5 min'}</span>
            <span>${lesson.exercises.length} ejercicios</span>
            ${done ? '<span class="lesson-completion-badge">✅ Completada</span>' : ''}
          </div>
        </div>`;
      }).join('');
    }

    // ========================================================================
    // LESSON SESSION ENGINE
    // ========================================================================
    startLessonSession(lessonId) {
      const lesson = LESSONS_DATA.find(l => l.id === lessonId);
      if (!lesson) return;
      this.activeLesson = lesson;
      this.activeExerciseIndex = 0;
      this.sessionMistakesCount = 0;
      this.sessionXpEarned = 0;
      this.isHeartRecoveryMode = false;
      const overlay = document.getElementById('lesson-session-overlay');
      if (overlay) overlay.classList.remove('hidden');
      this.sound.playClick();
      this.renderLessonExercise();
    }

    exitLessonSession() {
      document.getElementById('lesson-session-overlay')?.classList.add('hidden');
      document.getElementById('modal-out-of-hearts')?.classList.add('hidden');
      this.activeLesson = null;
    }

    renderLessonExercise() {
      if (!this.activeLesson) return;
      const ex = this.activeLesson.exercises[this.activeExerciseIndex];
      const total = this.activeLesson.exercises.length;
      const pct = (this.activeExerciseIndex / total) * 100;

      const bar = document.getElementById('session-progress-bar');
      if (bar) bar.style.width = `${pct}%`;
      const xpEl = document.getElementById('session-xp-earned');
      if (xpEl) xpEl.textContent = `+${this.sessionXpEarned} XP`;
      const heartsEl = document.getElementById('session-hearts-display');
      if (heartsEl) heartsEl.textContent = '❤️'.repeat(this.state.hearts) + '🖤'.repeat(Math.max(0, this.state.maxHearts - this.state.hearts));

      const container = document.getElementById('lesson-exercise-container');
      const feedbackArea = document.getElementById('footer-feedback-area');
      if (feedbackArea) feedbackArea.innerHTML = '';
      const checkBtn = document.getElementById('btn-check-answer');
      if (checkBtn) { checkBtn.textContent = 'Verificar →'; checkBtn.disabled = false; }

      this.selectedAnswer = null;
      this.isAnswerChecked = false;
      this.matchSelectedLeft = null;
      this.matchedPairs = [];

      if (!container) return;

      let html = `<div class="exercise-type-badge">${this.getExerciseTypeName(ex.type)}</div>`;
      html += `<div class="exercise-question-text">${ex.question || ex.instruction}</div>`;
      if (ex.instruction && ex.question && ex.instruction !== ex.question) {
        html = `<div class="exercise-type-badge">${this.getExerciseTypeName(ex.type)}</div>
          <p class="exercise-subtext">${ex.instruction}</p>
          <div class="exercise-question-text">${ex.question}</div>`;
      }

      switch(ex.type) {
        case 'multiple-choice':
          html += `<div class="mc-options-grid">` +
            ex.options.map(opt => `<button class="mc-option" onclick="app.selectMcOption(this,'${opt.replace(/'/g,"\\'")}',${JSON.stringify(opt === ex.correctAnswer)})">${opt}</button>`).join('') +
            `</div>`; break;
        case 'translate':
          html += `<div class="mc-options-grid">` +
            ex.options.map(opt => `<button class="mc-option" onclick="app.selectMcOption(this,'${opt.replace(/'/g,"\\'")}',${JSON.stringify(opt === ex.correctAnswer)})">${opt}</button>`).join('') +
            `</div>`; break;
        case 'fill-blank':
          html += `<div class="fill-blank-input-wrap">
            <div class="fill-blank-sentence">${(ex.sentence || '').replace('____', '<span class="blank">____</span>')}</div>
            <div class="mc-options-grid">` +
            (ex.options || []).map(opt => `<button class="mc-option" onclick="app.selectMcOption(this,'${opt.replace(/'/g,"\\'")}',${JSON.stringify(opt === ex.correctAnswer)})">${opt}</button>`).join('') +
            `</div></div>`; break;
        case 'true-false':
          html += `<div class="tf-buttons">
            <button class="tf-btn tf-true" onclick="app.selectTF(this,'Verdadero',${JSON.stringify(ex.correctAnswer === 'Verdadero')})">✅ Verdadero</button>
            <button class="tf-btn tf-false" onclick="app.selectTF(this,'Falso',${JSON.stringify(ex.correctAnswer === 'Falso')})">❌ Falso</button>
          </div>`; break;
        case 'unscramble':
          this.unscrambleChips = [...(ex.words || [])].sort(() => Math.random() - 0.5);
          this.placedChips = [];
          html += `<div class="word-chips-area" id="unscramble-placed" onclick="app.handlePlacedAreaClick(event)"></div>
            <div class="available-chips" id="unscramble-available">` +
            this.unscrambleChips.map((w,i) => `<span class="word-chip" data-chip="${i}" onclick="app.placeChip(this,'${w.replace(/'/g,"\\'")}')">${w}</span>`).join('') +
            `</div>`; break;
        case 'match-pairs':
          const lefts = (ex.pairs || []).map(p => p.left);
          const rights = [...(ex.pairs || [])].sort(() => Math.random() - 0.5).map(p => p.right);
          html += `<div class="match-pairs-container">
            <div style="display:flex;flex-direction:column;gap:0.6rem">` +
            lefts.map(l => `<div class="match-pair-item" data-side="left" data-val="${l}" onclick="app.selectMatchItem(this,'left','${l.replace(/'/g,"\\'")}')">${l}</div>`).join('') +
            `</div><div style="display:flex;flex-direction:column;gap:0.6rem">` +
            rights.map(r => `<div class="match-pair-item" data-side="right" data-val="${r}" onclick="app.selectMatchItem(this,'right','${r.replace(/'/g,"\\'")}')">${r}</div>`).join('') +
            `</div></div>`; break;
        case 'listening':
          html += `<div style="text-align:center;padding:1rem">
            <button class="btn btn-secondary btn-large" onclick="app.speakText('${(ex.audioText||'').replace(/'/g,"\\'")}',${this.playbackSpeed})">🔊 Escuchar frase</button>
          </div>
          <div class="mc-options-grid" style="margin-top:1rem">` +
            (ex.options || []).map(opt => `<button class="mc-option" onclick="app.selectMcOption(this,'${opt.replace(/'/g,"\\'")}',${JSON.stringify(opt === ex.correctAnswer)})">${opt}</button>`).join('') +
            `</div>
          <div style="text-align:center;margin-top:0.5rem"><small style="color:var(--text-muted)">🔊 Haz clic para escuchar. Selecciona lo que oíste.</small></div>`; break;
        case 'writing':
          html += `<div class="writing-area">
            <textarea class="text-input" id="writing-answer" rows="3" placeholder="Escribe tu respuesta en inglés..." style="resize:vertical"></textarea>
          </div>`; break;
      }
      container.innerHTML = html;

      // Auto-play listening audio
      if (ex.type === 'listening') {
        setTimeout(() => this.speakText(ex.audioText, 1.0), 400);
      }
    }

    getExerciseTypeName(type) {
      const names = { 'multiple-choice': '🎯 OPCIÓN MÚLTIPLE', 'translate': '🌐 TRADUCCIÓN', 'fill-blank': '📝 COMPLETAR ESPACIO', 'true-false': '✅ VERDADERO O FALSO', 'unscramble': '🔀 ORDENAR PALABRAS', 'match-pairs': '🔗 EMPAREJAR', 'listening': '🎧 COMPRENSIÓN AUDITIVA', 'writing': '✍️ ESCRITURA' };
      return names[type] || '📚 EJERCICIO';
    }

    selectMcOption(el, value, isCorrect) {
      if (this.isAnswerChecked) return;
      document.querySelectorAll('.mc-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      this.selectedAnswer = { value, isCorrect };
    }

    selectTF(el, value, isCorrect) {
      if (this.isAnswerChecked) return;
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
      this.selectedAnswer = { value, isCorrect };
    }

    placeChip(el, word) {
      if (el.classList.contains('placed')) return;
      el.classList.add('placed');
      this.placedChips.push(word);
      const placed = document.getElementById('unscramble-placed');
      if (placed) {
        const chip = document.createElement('span');
        chip.className = 'word-chip placed';
        chip.textContent = word;
        chip.dataset.idx = this.placedChips.length - 1;
        chip.onclick = () => this.removeChip(chip, el, word);
        placed.appendChild(chip);
      }
    }

    removeChip(placedChip, originalChip, word) {
      this.placedChips = this.placedChips.filter((_, i) => i !== parseInt(placedChip.dataset.idx));
      placedChip.remove();
      if (originalChip) originalChip.classList.remove('placed');
    }

    handlePlacedAreaClick() {}

    selectMatchItem(el, side, val) {
      if (el.classList.contains('matched')) return;
      if (side === 'left') {
        document.querySelectorAll('[data-side="left"]').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        this.matchSelectedLeft = val;
      } else if (this.matchSelectedLeft) {
        const ex = this.activeLesson.exercises[this.activeExerciseIndex];
        const pair = (ex.pairs || []).find(p => p.left === this.matchSelectedLeft);
        if (pair && pair.right === val) {
          document.querySelectorAll('[data-side="left"]').forEach(e => { if (e.dataset.val === this.matchSelectedLeft) e.classList.add('matched'); });
          el.classList.add('matched');
          this.matchedPairs.push(this.matchSelectedLeft);
          this.sound.playCorrect();
          if (this.matchedPairs.length === ex.pairs.length) {
            this.selectedAnswer = { value: 'matched', isCorrect: true };
          }
        } else {
          this.sound.playIncorrect();
          this.showToast("❌ Ese par no coincide. Intenta de nuevo.", "info");
        }
        document.querySelectorAll('[data-side="left"]').forEach(e => e.classList.remove('selected'));
        this.matchSelectedLeft = null;
      }
    }

    checkLessonAnswer() {
      if (this.isAnswerChecked) {
        this.nextLessonExercise();
        return;
      }
      const ex = this.activeLesson.exercises[this.activeExerciseIndex];
      let isCorrect = false;
      let userAnswer = '';

      if (ex.type === 'multiple-choice' || ex.type === 'translate' || ex.type === 'fill-blank' || ex.type === 'true-false' || ex.type === 'listening') {
        if (!this.selectedAnswer) { this.showToast("Selecciona una respuesta primero.", "info"); return; }
        isCorrect = this.selectedAnswer.isCorrect;
        userAnswer = this.selectedAnswer.value;
      } else if (ex.type === 'unscramble') {
        const formed = this.placedChips.join(' ');
        isCorrect = formed.trim().toLowerCase() === (ex.correctAnswer || '').trim().toLowerCase();
        userAnswer = formed;
      } else if (ex.type === 'match-pairs') {
        isCorrect = this.matchedPairs.length === (ex.pairs || []).length;
        if (!isCorrect && this.matchedPairs.length === 0) { this.showToast("Empareja todos los pares primero.", "info"); return; }
      } else if (ex.type === 'writing') {
        const textarea = document.getElementById('writing-answer');
        userAnswer = textarea?.value.trim() || '';
        isCorrect = userAnswer.length > 3;
      }

      this.isAnswerChecked = true;
      this.state.stats.totalAnswers++;

      const feedbackArea = document.getElementById('footer-feedback-area');
      const checkBtn = document.getElementById('btn-check-answer');
      if (checkBtn) checkBtn.textContent = 'Siguiente →';

      const lessonSkill = this.activeLesson?.category || 'grammar';
      const lessonTopic = this.activeLesson?.title || ex.question || 'Lección';
      const lessonCefr = this.activeLesson?.cefr || this.state.targetCefr || 'B1';

      if (isCorrect) {
        this.state.stats.correctAnswers++;
        this.addXp(10);
        this.sessionXpEarned += 10;
        this.sound.playCorrect();
        if (this.adaptiveEngine) {
          this.adaptiveEngine.recordActivity({
            skill: lessonSkill,
            topic: lessonTopic,
            difficulty: lessonCefr,
            isCorrect: true,
            userAnswer: String(userAnswer || ''),
            correctAnswer: String(ex.correctAnswer || '')
          });
        }
        if (feedbackArea) feedbackArea.innerHTML = `<div class="feedback-correct">✅ ¡Correcto! ${MOTIVATIONAL_MESSAGES[Math.floor(Math.random()*MOTIVATIONAL_MESSAGES.length)]} +10 XP</div>`;
        if (ex.explanation) feedbackArea.innerHTML += `<p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem;padding:0 0.5rem">${ex.explanation}</p>`;
        document.querySelector('.mc-option.selected')?.classList.add('correct');
      } else {
        this.state.hearts = Math.max(0, this.state.hearts - 1);
        this.sessionMistakesCount++;
        this.sound.playIncorrect();
        if (this.adaptiveEngine) {
          this.adaptiveEngine.recordActivity({
            skill: lessonSkill,
            topic: lessonTopic,
            difficulty: lessonCefr,
            isCorrect: false,
            userAnswer: String(userAnswer || ''),
            correctAnswer: String(ex.correctAnswer || '')
          });
          this.adaptiveEngine.recordMistake({
            sourceModule: `Lección ${lessonCefr}`,
            skill: lessonSkill,
            topic: lessonTopic,
            userAnswer: String(userAnswer || 'Sin respuesta'),
            correctAnswer: String(ex.correctAnswer || ''),
            explanation: ex.explanation || ''
          });
        }
        if (feedbackArea) feedbackArea.innerHTML = `<div class="feedback-incorrect">❌ Incorrecto. La respuesta correcta era: <strong>${ex.correctAnswer}</strong>. ${ex.explanation || ''}</div>`;
        document.querySelector('.mc-option.selected')?.classList.add('incorrect');
        if (this.state.hearts <= 0) {
          setTimeout(() => document.getElementById('modal-out-of-hearts')?.classList.remove('hidden'), 500);
          this.saveState();
          return;
        }
      }

      const xpEl = document.getElementById('session-xp-earned');
      if (xpEl) xpEl.textContent = `+${this.sessionXpEarned} XP`;
      const heartsEl = document.getElementById('session-hearts-display');
      if (heartsEl) heartsEl.textContent = '❤️'.repeat(this.state.hearts) + '🖤'.repeat(Math.max(0, this.state.maxHearts - this.state.hearts));
      this.saveState();
    }

    nextLessonExercise() {
      this.activeExerciseIndex++;
      if (this.activeExerciseIndex >= this.activeLesson.exercises.length) {
        this.completeLessonSession();
      } else {
        this.renderLessonExercise();
      }
    }

    completeLessonSession() {
      const overlay = document.getElementById('lesson-session-overlay');
      if (overlay) overlay.classList.add('hidden');

      const lesson = this.activeLesson;
      const isPerfect = this.sessionMistakesCount === 0;

      if (!this.state.completedLessons.includes(lesson.id)) {
        this.state.completedLessons.push(lesson.id);
      }

      this.addXp(25);
      this.sessionXpEarned += 25;
      const coinsEarned = 15 + (isPerfect ? 10 : 0);
      this.addCoins(coinsEarned);
      if (isPerfect) { this.state.stats.perfectLessonsCount++; }

      const acc = Math.round(((this.activeLesson.exercises.length - this.sessionMistakesCount) / this.activeLesson.exercises.length) * 100);

      document.getElementById('lc-xp').textContent = `+${this.sessionXpEarned} XP`;
      document.getElementById('lc-accuracy').textContent = `${acc}%`;
      document.getElementById('lc-coins').textContent = `+${coinsEarned} 🪙`;

      document.getElementById('modal-lesson-complete')?.classList.remove('hidden');
      this.sound.playFanfare();
      this.launchConfetti();
      this.checkAchievements();
      this.saveState();
    }

    closeLessonComplete() {
      document.getElementById('modal-lesson-complete')?.classList.add('hidden');
      this.activeLesson = null;
      this.navigate('lessons');
    }

    showHeartModal() { document.getElementById('modal-out-of-hearts')?.classList.remove('hidden'); }
    closeHeartModal() {
      document.getElementById('modal-out-of-hearts')?.classList.add('hidden');
      this.exitLessonSession();
    }

    refillHeartsWithCoins() {
      if (this.state.coins >= 30) {
        this.state.coins -= 30;
        this.state.hearts = this.state.maxHearts;
        this.saveState();
        document.getElementById('modal-out-of-hearts')?.classList.add('hidden');
        this.showToast("❤️ ¡Corazones recargados!", "purple");
        this.isHeartRecoveryMode = true;
        if (this.activeLesson) this.renderLessonExercise();
      } else {
        this.showToast("No tienes suficientes monedas (cuesta 30).", "info");
      }
    }

    // ========================================================================
    // ANKI SRS (SuperMemo SM-2)
    // ========================================================================
    getDueAnkiCards() {
      const today = new Date().toISOString().split("T")[0];
      return this.state.ankiDeck.filter(c => c.dueDate <= today);
    }

    renderAnkiDashboard() {
      const due = this.getDueAnkiCards();
      const newCards = this.state.ankiDeck.filter(c => c.state === 'learning' && c.repetitions === 0);
      const reviewed = this.state.ankiReviewsLifetime || 0;
      const total = this.state.ankiDeck.length;

      document.getElementById('anki-review-screen')?.classList.add('hidden');
      document.getElementById('anki-complete-screen')?.classList.add('hidden');
      document.getElementById('anki-dashboard-screen')?.classList.remove('hidden');

      const hud = document.getElementById('anki-stats-hud');
      if (hud) {
        hud.innerHTML = `
          <div class="anki-hud-stat"><span class="ahud-val ahud-due">${due.length}</span><div class="ahud-lbl">Pendientes Hoy</div></div>
          <div class="anki-hud-stat"><span class="ahud-val ahud-new">${newCards.length}</span><div class="ahud-lbl">Nuevas</div></div>
          <div class="anki-hud-stat"><span class="ahud-val ahud-reviewed">${reviewed}</span><div class="ahud-lbl">Revisadas Total</div></div>
          <div class="anki-hud-stat"><span class="ahud-val" style="color:var(--purple-light)">${total}</span><div class="ahud-lbl">En el Mazo</div></div>
        `;
      }

      // Due cards preview
      const preview = document.getElementById('anki-due-preview-wrap');
      if (preview && due.length > 0) {
        const list = due.slice(0, 6).map(c => `
          <div class="due-card-item">
            <span class="due-card-word">${c.front}</span>
            <span class="due-card-level badge-diff">${c.level}</span>
            <span class="due-card-interval">${c.interval}d</span>
          </div>`).join('');
        preview.innerHTML = `<div class="due-preview-list"><div class="due-preview-header"><h4>📋 Tarjetas listas para hoy (${due.length} total)</h4><button type="button" class="btn btn-primary btn-sm" onclick="app.startAnkiSession(false)">Repasar ahora →</button></div>${list}${due.length > 6 ? `<p style="font-size:0.8rem;color:var(--text-muted);padding:0.5rem;text-align:center">+ ${due.length - 6} más en cola...</p>` : ''}</div>`;
      } else if (preview) {
        preview.innerHTML = `<div class="empty-state-box"><span class="empty-icon">🎉</span><h4>¡Todo al día por hoy!</h4><p>No tienes tarjetas pendientes. Puedes practicar con Modo Cram o minar nuevas frases en Video Lab.</p><div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:0.85rem"><button type="button" class="btn btn-secondary btn-sm" onclick="app.startAnkiSession(true)">🔥 Modo Cram</button><button type="button" class="btn btn-primary btn-sm" onclick="app.navigate('video-lab')">🎬 Ir a Video Lab</button></div></div>`;
      }
    }

    startAnkiSession(cramMode = false) {
      const due = cramMode ? [...this.state.ankiDeck] : this.getDueAnkiCards();
      if (due.length === 0) { this.showToast("No hay tarjetas para repasar hoy.", "info"); return; }
      this.ankiCramMode = cramMode;
      this.ankiSessionQueue = due.slice(0, cramMode ? 20 : due.length);
      this.ankiSessionIndex = 0;
      this.ankiSessionReviewedCount = 0;
      this.ankiCorrectInSession = 0;
      document.getElementById('anki-dashboard-screen')?.classList.add('hidden');
      document.getElementById('anki-complete-screen')?.classList.add('hidden');
      document.getElementById('anki-review-screen')?.classList.remove('hidden');
      this.renderAnkiCard();
    }

    renderAnkiCard() {
      if (this.ankiSessionIndex >= this.ankiSessionQueue.length) { this.finishAnkiSession(); return; }
      const card = this.ankiSessionQueue[this.ankiSessionIndex];
      this.ankiActiveCard = card;
      const total = this.ankiSessionQueue.length;
      const pct = (this.ankiSessionIndex / total) * 100;
      const bar = document.getElementById('anki-session-progress-bar');
      if (bar) bar.style.width = `${pct}%`;
      const counter = document.getElementById('anki-session-counter');
      if (counter) counter.textContent = `${this.ankiSessionIndex + 1} / ${total}`;
      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setEl('anki-card-front-text', card.front);
      setEl('anki-card-phonetic', card.phonetic || '');
      setEl('anki-card-state-badge', card.state || 'learning');
      setEl('anki-card-level-badge', card.level || 'B1');
      setEl('anki-card-back-text', card.back);
      setEl('anki-card-explanation', card.explanation || '');
      setEl('anki-example-en', `"${card.example || ''}"`);
      setEl('anki-example-es', `"${card.exampleEs || ''}"`);
      const backWrap = document.getElementById('anki-card-back-wrap');
      const showBtn = document.getElementById('btn-anki-show-answer');
      const gradesGrid = document.getElementById('anki-grades-grid');
      if (backWrap) backWrap.classList.add('hidden');
      if (showBtn) showBtn.classList.remove('hidden');
      if (gradesGrid) gradesGrid.classList.add('hidden');
      const nextDay = Math.round(card.interval * (card.easeFactor || 2.5));
      const setT = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setT('anki-time-hard', card.interval > 0 ? `${Math.round(card.interval * 1.2)}d` : '12h');
      setT('anki-time-good', card.interval > 0 ? `${nextDay}d` : '3d');
      setT('anki-time-easy', card.interval > 0 ? `${Math.round(nextDay * 1.3)}d` : '7d');
    }

    revealAnkiAnswer() {
      document.getElementById('anki-card-back-wrap')?.classList.remove('hidden');
      document.getElementById('btn-anki-show-answer')?.classList.add('hidden');
      document.getElementById('anki-grades-grid')?.classList.remove('hidden');
      this.sound.playAnkiFlip();
    }

    speakAnkiFront() {
      if (this.ankiActiveCard) this.speakText(this.ankiActiveCard.front);
    }

    gradeAnkiCard(grade) {
      if (!this.ankiActiveCard) return;
      const card = this.ankiActiveCard;
      const idx = this.state.ankiDeck.findIndex(c => c.id === card.id);
      if (idx === -1) { this.ankiSessionIndex++; this.renderAnkiCard(); return; }
      const c = this.state.ankiDeck[idx];
      if (grade === 1) {
        c.repetitions = 0; c.interval = 1; c.easeFactor = Math.max(1.3, (c.easeFactor || 2.5) - 0.2); c.state = 'learning';
      } else if (grade === 2) {
        c.repetitions++; c.interval = Math.max(1, Math.round(c.interval * 1.2)); c.easeFactor = Math.max(1.3, (c.easeFactor || 2.5) - 0.15); c.state = 'review';
      } else if (grade === 3) {
        c.repetitions++; if (c.repetitions === 1) c.interval = 1; else if (c.repetitions === 2) c.interval = 6; else c.interval = Math.round(c.interval * (c.easeFactor || 2.5)); c.state = 'review';
      } else if (grade === 4) {
        c.repetitions++; if (c.repetitions === 1) c.interval = 4; else c.interval = Math.round(c.interval * (c.easeFactor || 2.5) * 1.3); c.easeFactor = Math.min(3.0, (c.easeFactor || 2.5) + 0.15); c.state = grade >= 3 && c.repetitions >= 3 ? 'mastered' : 'review';
      }
      const today = new Date(); today.setDate(today.getDate() + c.interval);
      c.dueDate = today.toISOString().split("T")[0];
      if (grade >= 3) { this.addXp(5); this.ankiCorrectInSession++; }
      this.state.ankiReviewsLifetime = (this.state.ankiReviewsLifetime || 0) + 1;
      this.ankiSessionReviewedCount++;
      this.ankiSessionIndex++;
      this.saveState();
      setTimeout(() => this.renderAnkiCard(), 150);
    }

    finishAnkiSession() {
      const xpGained = this.ankiCorrectInSession * 5;
      if (xpGained > 0) this.addXp(xpGained);
      this.addCoins(10);
      const retention = this.ankiSessionReviewedCount > 0 ? Math.round((this.ankiCorrectInSession / this.ankiSessionReviewedCount) * 100) : 0;
      document.getElementById('anki-review-screen')?.classList.add('hidden');
      document.getElementById('anki-complete-screen')?.classList.remove('hidden');
      document.getElementById('anki-done-count').textContent = this.ankiSessionReviewedCount;
      document.getElementById('anki-done-xp').textContent = `+${xpGained} XP`;
      document.getElementById('anki-done-retention').textContent = `${retention}%`;
      this.sound.playFanfare();
      this.checkAchievements();
      this.saveState();
    }

    finishAnkiSessionToDeck() {
      document.getElementById('anki-review-screen')?.classList.add('hidden');
      document.getElementById('anki-complete-screen')?.classList.add('hidden');
      this.renderAnkiDashboard();
    }

    openCreateAnkiCardModal() { document.getElementById('modal-create-anki-card')?.classList.remove('hidden'); }
    closeCreateAnkiCardModal() { document.getElementById('modal-create-anki-card')?.classList.add('hidden'); }

    submitNewAnkiCard() {
      const front = document.getElementById('anki-form-front')?.value.trim();
      const back = document.getElementById('anki-form-back')?.value.trim();
      const example = document.getElementById('anki-form-example')?.value.trim();
      const level = document.getElementById('anki-form-level')?.value || 'B1';
      if (!front || !back) { this.showToast("Escribe el frente y el dorso de la tarjeta.", "info"); return; }
      const newCard = { id: `custom_${Date.now()}`, front, back, level, phonetic: '', example: example || '', exampleEs: '', explanation: 'Tarjeta personalizada.', repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: 'learning' };
      this.state.ankiDeck.unshift(newCard);
      this.saveState();
      this.closeCreateAnkiCardModal();
      ['anki-form-front','anki-form-back','anki-form-example'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      this.sound.playCoin();
      this.showToast(`🧠 Tarjeta "${front}" añadida al mazo SRS.`, "cyan");
      this.renderAnkiDashboard();
    }

    addCustomAnkiCard(front, back, example) {
      if (!front || !back) return;
      const exists = this.state.ankiDeck.some(c => c.front.toLowerCase() === front.toLowerCase());
      if (exists) { this.showToast('"' + front + '" ya está en tu mazo Anki.', 'info'); return; }
      const newCard = { id: 'custom_' + Date.now(), front, back, level: 'B1', phonetic: '', example: example || '', exampleEs: '', explanation: 'Añadida desde módulo.', repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split('T')[0], state: 'learning' };
      this.state.ankiDeck.unshift(newCard);
      this.saveState();
      this.sound.playCoin();
      this.showToast('🧠 "' + front + '" añadida al mazo SRS.', 'cyan');
    }

    // ========================================================================
    // VIDEO LAB — COMPLETE REWRITE WITH YOUTUBE API FIX
    // ========================================================================
    renderVideoLab() {
      const carousel = document.getElementById('video-cards-carousel');
      if (!carousel) return;
      carousel.innerHTML = "";
      VIDEO_CATALOG.forEach(vid => {
        const isCurrent = vid.id === this.activeVideo.id;
        const card = document.createElement('div');
        card.className = `video-item-card ${isCurrent ? 'active-video' : ''}`;
        card.onclick = () => this.selectVideo(vid.id);
        card.innerHTML = `<div class="video-card-thumb"><span>▶</span><span class="badge-diff video-card-cefr">${vid.cefr}</span></div><h4>${vid.title}</h4><span>${vid.channel} • ${vid.duration}</span>`;
        carousel.appendChild(card);
      });
      this.setupActiveVideoPlayer();
      this.state.stats.videosWatched = (this.state.stats.videosWatched || 0) + 1;
      this.checkAchievements();
    }

    selectVideo(videoId) {
      const found = VIDEO_CATALOG.find(v => v.id === videoId);
      if (!found) return;
      this.activeVideo = found;
      this.currentSubIndex = 0;
      this.minedWords = [];
      this.sound.playClick();
      this.renderVideoLab();
    }

    setupActiveVideoPlayer() {
      const vid = this.activeVideo;
      if (this.videoPlayerMode === 'cinema') {
        this.updateCinemaDisplay();
        this.startCinemaVisualizer();
      } else {
        if (window.YT && window.YT.Player) {
          this.createYTPlayer(vid.youtubeId);
        } else {
          this.useFallbackIframe(vid.youtubeId);
        }
      }
      this.renderCurrentSubtitleLine();
      this.renderVideoTranscriptList();
      this.renderMinedWords();
      const btn = document.getElementById('btn-open-yt');
      if (btn) btn.onclick = () => this.openVideoInYouTube();
    }

    setVideoPlayerMode(mode) {
      this.videoPlayerMode = mode;
      const btnYt = document.getElementById('btn-mode-yt');
      const btnCin = document.getElementById('btn-mode-cinema');
      const containerYt = document.getElementById('yt-player-api-container');
      const iframeYt = document.getElementById('yt-fallback-iframe');
      const containerCin = document.getElementById('cyber-cinema-container');

      if (mode === 'cinema') {
        if (btnYt) btnYt.classList.remove('active');
        if (btnCin) btnCin.classList.add('active');
        if (containerYt) containerYt.classList.add('hidden');
        if (iframeYt) iframeYt.classList.add('hidden');
        if (containerCin) containerCin.classList.remove('hidden');
        this.updateCinemaDisplay();
        this.startCinemaVisualizer();
        this.showToast("🎧 Cyber Cinema Activo: audio nativo sincronizado", "cyan");
      } else {
        if (btnYt) btnYt.classList.add('active');
        if (btnCin) btnCin.classList.remove('active');
        if (containerCin) containerCin.classList.add('hidden');
        this.stopCinemaPlayback();
        this.stopCinemaVisualizer();
        this.setupActiveVideoPlayer();
        this.showToast("🎬 Modo YouTube Activo", "purple");
      }
    }

    toggleCinemaPlayback() {
      if (this.cinemaPlaying) {
        this.stopCinemaPlayback();
      } else {
        this.startCinemaPlayback();
      }
    }

    startCinemaPlayback() {
      this.cinemaPlaying = true;
      const playBtn = document.getElementById('btn-cinema-play-toggle');
      if (playBtn) playBtn.textContent = '⏸';
      const badge = document.getElementById('cinema-status-badge');
      if (badge) badge.textContent = '▶ REPRODUCIENDO EN VIVO';
      this.playCinemaLine(this.currentSubIndex);
    }

    stopCinemaPlayback() {
      this.cinemaPlaying = false;
      if (this.cinemaTimer) clearTimeout(this.cinemaTimer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      const playBtn = document.getElementById('btn-cinema-play-toggle');
      if (playBtn) playBtn.textContent = '▶';
      const badge = document.getElementById('cinema-status-badge');
      if (badge) badge.textContent = '⏸ PAUSADO';
    }

    playCinemaLine(idx) {
      if (!this.cinemaPlaying) return;
      const subs = this.activeVideo.subtitles;
      if (idx >= subs.length) {
        if (this.videoLoopMode) {
          this.currentSubIndex = 0;
          this.playCinemaLine(0);
          return;
        } else {
          this.stopCinemaPlayback();
          this.showToast("🎉 ¡Completaste todas las frases del video! +25 XP", "success");
          this.addXp(25);
          return;
        }
      }
      this.currentSubIndex = idx;
      this.renderCurrentSubtitleLine();
      this.updateCinemaDisplay();

      const current = subs[idx];
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(current.en);
        utter.lang = 'en-US';
        utter.rate = this.playbackSpeed || 1.0;
        utter.onend = () => {
          if (!this.cinemaPlaying) return;
          this.addXp(5);
          this.cinemaTimer = setTimeout(() => {
            this.playCinemaLine(this.currentSubIndex + 1);
          }, 1000);
        };
        utter.onerror = () => {
          if (!this.cinemaPlaying) return;
          this.cinemaTimer = setTimeout(() => {
            this.playCinemaLine(this.currentSubIndex + 1);
          }, 2500);
        };
        window.speechSynthesis.speak(utter);
      } else {
        this.cinemaTimer = setTimeout(() => {
          if (!this.cinemaPlaying) return;
          this.addXp(5);
          this.playCinemaLine(this.currentSubIndex + 1);
        }, 3000);
      }
    }

    updateCinemaDisplay() {
      const subs = this.activeVideo.subtitles;
      const current = subs[this.currentSubIndex];
      if (!current) return;
      const enEl = document.getElementById('cinema-karaoke-en');
      const esEl = document.getElementById('cinema-karaoke-es');
      if (enEl) enEl.textContent = current.en;
      if (esEl) esEl.textContent = current.es;
    }

    startCinemaVisualizer() {
      const canvas = document.getElementById('cinema-equalizer-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth || 600;
      canvas.height = 160;

      let step = 0;
      const render = () => {
        if (this.videoPlayerMode !== 'cinema') return;
        step += 0.05;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bars = 36;
        const barWidth = canvas.width / bars - 4;
        for (let i = 0; i < bars; i++) {
          const intensity = this.cinemaPlaying 
            ? Math.abs(Math.sin(step + i * 0.35)) * 0.8 + Math.random() * 0.2
            : 0.15 + Math.sin(step * 0.5 + i * 0.2) * 0.1;
          const h = intensity * (canvas.height - 30);
          const x = i * (barWidth + 4) + 2;
          const y = canvas.height - h;
          
          const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
          grad.addColorStop(0, '#00f0ff');
          grad.addColorStop(0.5, '#a855f7');
          grad.addColorStop(1, '#ff2a85');
          ctx.fillStyle = grad;
          ctx.shadowBlur = this.cinemaPlaying ? 15 : 5;
          ctx.shadowColor = '#00f0ff';
          ctx.fillRect(x, y, barWidth, h);
        }
        this.cinemaAnimFrame = requestAnimationFrame(render);
      };
      if (this.cinemaAnimFrame) cancelAnimationFrame(this.cinemaAnimFrame);
      render();
    }

    stopCinemaVisualizer() {
      if (this.cinemaAnimFrame) cancelAnimationFrame(this.cinemaAnimFrame);
    }

    // ── YouTube Player (static embed, official Google method) ───────────────
    // Builds a youtube.com/embed/ URL per the official YouTube embed guide.
    // This avoids Error 153 entirely — no JS API, no origin negotiation needed.
    updateEmbedSrc(videoId) {
      const iframe = document.getElementById('yt-embed-iframe');
      if (!iframe || !videoId) return;

      const origin = (window.location && window.location.origin && window.location.origin !== 'null')
        ? window.location.origin
        : 'http://localhost:3000';

      const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        enablejsapi: '1',
        origin: origin
      });
      iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }

    // Keep these stubs so existing callers don't break
    createYTPlayer(videoId) { this.updateEmbedSrc(videoId); }
    handleYouTubeError(code, videoId) { this.updateEmbedSrc(videoId); }
    useFallbackIframe(videoId) { this.updateEmbedSrc(videoId); }


    openVideoInYouTube() {
      const url = `https://www.youtube.com/watch?v=${this.activeVideo.youtubeId}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      this.showToast("🎬 Abriendo video en YouTube en pestaña completa...", "cyan");
    }

    loadCustomYoutubeVideo() {
      const input = document.getElementById('custom-youtube-url')?.value.trim();
      if (!input) return;
      let id = input;
      if (input.includes('v=')) id = input.split('v=')[1].split('&')[0];
      else if (input.includes('youtu.be/')) id = input.split('youtu.be/')[1].split('?')[0];
      const customVid = {
        id: "custom_" + Date.now(), youtubeId: id, title: "Custom Video", channel: "YouTube",
        cefr: this.state.targetCefr || "B1", duration: "--:--",
        subtitles: [
          { start: 0, end: 10, en: "Click 'Ver en YouTube' to open this video and practice with the subtitles.", es: "Haz clic en 'Ver en YouTube' para abrir el video y practicar con los subtítulos." },
          { start: 10, end: 25, en: "Listen carefully and click any word below to see its translation and save it to Anki.", es: "Escucha atentamente y haz clic en cualquier palabra para ver su traducción y guardarla en Anki." }
        ]
      };
      VIDEO_CATALOG.unshift(customVid);
      this.activeVideo = customVid;
      this.currentSubIndex = 0;
      this.renderVideoLab();
      this.showToast("🎬 Video cargado. Usa '▶ Ver en YouTube' para reproducirlo.", "cyan");
    }

    changePlaybackSpeed(val) {
      this.playbackSpeed = parseFloat(val) || 1.0;
      // Speed control not available with static embed (YouTube controls handle it)
      this.showToast(`⚡ Velocidad: ${this.playbackSpeed}x`, "info");
    }

    toggleLoopMode() {
      this.videoLoopMode = !this.videoLoopMode;
      const btn = document.getElementById('btn-loop-mode');
      if (btn) btn.textContent = `🔁 Loop ${this.videoLoopMode ? 'ON' : 'OFF'}`;
      if (btn) btn.classList.toggle('active', this.videoLoopMode);
      this.showToast(this.videoLoopMode ? "🔁 Modo Loop activado" : "Loop desactivado", "info");
    }

    startShadowingMode() {
      this.shadowingActive = true;
      this.shadowingStep = 0;
      const panel = document.getElementById('shadowing-panel');
      if (panel) panel.classList.remove('hidden');
      this.runShadowingRound();
    }

    runShadowingRound() {
      const current = this.activeVideo.subtitles[this.currentSubIndex];
      if (!current) return;
      const instruction = document.getElementById('shadowing-instruction');
      const phrase = document.getElementById('shadowing-phrase');
      if (instruction) instruction.textContent = `🔊 Escucha la frase (${this.currentSubIndex + 1}/${this.activeVideo.subtitles.length})...`;
      if (phrase) phrase.textContent = current.en;
      this.speakText(current.en, this.playbackSpeed);
    }

    nextShadowingRound() {
      this.currentSubIndex = (this.currentSubIndex + 1) % this.activeVideo.subtitles.length;
      this.renderCurrentSubtitleLine();
      this.runShadowingRound();
    }

    stopShadowingMode() {
      this.shadowingActive = false;
      document.getElementById('shadowing-panel')?.classList.add('hidden');
    }

    renderCurrentSubtitleLine() {
      const subs = this.activeVideo.subtitles;
      if (!subs || subs.length === 0) return;
      if (this.currentSubIndex >= subs.length) this.currentSubIndex = 0;
      if (this.currentSubIndex < 0) this.currentSubIndex = 0;
      const current = subs[this.currentSubIndex];
      const counter = document.getElementById('sub-line-counter');
      if (counter) counter.textContent = `Línea ${this.currentSubIndex + 1} / ${subs.length}`;
      const tokenContainer = document.getElementById('subtitle-en-tokens');
      const esSubEl = document.getElementById('subtitle-es-translation');
      if (tokenContainer) {
        tokenContainer.innerHTML = "";
        tokenContainer.classList.toggle('blur-mode', this.blurEnglish);
        current.en.split(' ').forEach(wordStr => {
          const clean = wordStr.replace(/[.,!?;:"()]/g, '');
          const span = document.createElement('span');
          span.className = 'sub-token';
          span.textContent = wordStr;
          span.onclick = (e) => { e.stopPropagation(); this.inspectSubtitleWord(clean, current.en); };
          tokenContainer.appendChild(span);
        });
      }
      if (esSubEl) { esSubEl.textContent = current.es; esSubEl.classList.toggle('hidden-sub', this.hideSpanish); }
      document.querySelectorAll('.transcript-line-item').forEach((item, idx) => {
        item.classList.toggle('active-line', idx === this.currentSubIndex);
      });
      this.updateCinemaDisplay();
    }

    renderVideoTranscriptList() {
      const list = document.getElementById('transcript-lines-list');
      if (!list) return;
      list.innerHTML = "";
      this.activeVideo.subtitles.forEach((line, idx) => {
        const item = document.createElement('div');
        item.className = `transcript-line-item ${idx === this.currentSubIndex ? 'active-line' : ''}`;
        item.onclick = () => { this.currentSubIndex = idx; this.renderCurrentSubtitleLine(); this.sound.playClick(); };
        const mm = Math.floor(line.start / 60).toString().padStart(2, '0');
        const ss = (line.start % 60).toString().padStart(2, '0');
        item.innerHTML = `<div class="transcript-line-time">${mm}:${ss}</div><div class="transcript-line-en">${escapeHTML(line.en)}</div><div class="transcript-line-es">${escapeHTML(line.es)}</div>`;
        list.appendChild(item);
      });
    }

    renderMinedWords() {
      const listEl = document.getElementById('mined-words-list');
      if (!listEl) return;
      if (this.minedWords.length === 0) { listEl.innerHTML = '<p style="font-size:0.78rem;color:var(--text-muted);text-align:center;padding:0.5rem">Haz clic en palabras o usa ⛏️ para minar frases</p>'; return; }
      listEl.innerHTML = this.minedWords.map(w => `<div class="mined-word-tag"><strong>${escapeHTML(w.word)}</strong><span>${escapeHTML(w.translation)}</span></div>`).join('');
    }

    nextSubtitleLine() {
      if (this.currentSubIndex < this.activeVideo.subtitles.length - 1) this.currentSubIndex++;
      else this.currentSubIndex = 0;
      this.sound.playClick();
      this.renderCurrentSubtitleLine();
    }

    prevSubtitleLine() {
      if (this.currentSubIndex > 0) this.currentSubIndex--;
      this.sound.playClick();
      this.renderCurrentSubtitleLine();
    }

    repeatCurrentSubtitleLine() {
      const current = this.activeVideo.subtitles[this.currentSubIndex];
      if (!current) return;
      const loops = parseInt(document.getElementById('loop-count-select')?.value || '3', 10);
      this.sound.playClick();
      let count = 0;
      const doSpeak = () => { if (count >= loops) return; this.speakText(current.en, this.playbackSpeed); count++; setTimeout(doSpeak, 2500); };
      doSpeak();
      this.showToast(`🔁 Repitiendo ${loops}x...`, "cyan");
    }

    speakCurrentSubtitle() {
      const current = this.activeVideo.subtitles[this.currentSubIndex];
      if (current) this.speakText(current.en, this.playbackSpeed);
    }

    toggleBlurEnglish() {
      this.blurEnglish = !this.blurEnglish;
      const btn = document.getElementById('btn-toggle-blur');
      if (btn) btn.classList.toggle('active', this.blurEnglish);
      this.renderCurrentSubtitleLine();
    }

    toggleSpanishSubtitle() {
      this.hideSpanish = !this.hideSpanish;
      const btn = document.getElementById('btn-toggle-es-sub');
      if (btn) btn.classList.toggle('active', this.hideSpanish);
      this.renderCurrentSubtitleLine();
    }

    mineCurrentSentence() {
      const current = this.activeVideo.subtitles[this.currentSubIndex];
      if (!current) return;
      const newCard = {
        id: `mined_${Date.now()}`, front: current.en, back: current.es,
        level: this.activeVideo.cefr || 'B1', phonetic: '', example: current.en, exampleEs: current.es,
        explanation: `⛏️ Minada del video: ${this.activeVideo.title}`,
        repetitions: 0, interval: 0, easeFactor: 2.5,
        dueDate: new Date().toISOString().split("T")[0], state: 'learning'
      };
      this.state.ankiDeck.unshift(newCard);
      this.minedWords.push({ word: current.en.substring(0, 30) + (current.en.length > 30 ? '...' : ''), translation: current.es.substring(0, 25) });
      this.state.sentencesMined = (this.state.sentencesMined || 0) + 1;
      this.addCoins(3);
      this.saveState();
      this.renderMinedWords();
      this.showToast(`⛏️ Frase minada → Anki SRS! (+3 monedas)`, "cyan");
      this.sound.playCoin();
      this.checkAchievements();
    }

    inspectSubtitleWord(rawWord, contextSentence = "") {
      const clean = rawWord.toLowerCase().trim();
      const lookup = SUBTITLE_DICTIONARY[clean] || {
        trans: `Traducción de "${rawWord}"`, pos: "Término en contexto",
        phonetic: `/${rawWord.toLowerCase()}/`,
        exEn: contextSentence || `This is an example with ${rawWord}.`,
        exEs: `Ejemplo traducido con "${rawWord}".`
      };
      this.currentInspectedWordData = {
        word: rawWord, translation: lookup.trans, pos: lookup.pos,
        phonetic: lookup.phonetic, exampleEn: lookup.exEn, exampleEs: lookup.exEs
      };
      const modal = document.getElementById('modal-inspect-word');
      if (modal) {
        document.getElementById('inspect-word-title').textContent = rawWord;
        document.getElementById('inspect-word-phonetic').textContent = lookup.phonetic;
        document.getElementById('inspect-word-translation').textContent = lookup.trans;
        document.getElementById('inspect-word-pos').textContent = lookup.pos;
        document.getElementById('inspect-example-en').textContent = `"${lookup.exEn}"`;
        document.getElementById('inspect-example-es').textContent = `"${lookup.exEs}"`;
        modal.classList.remove('hidden');
        this.speakText(rawWord);
      }
    }

    speakInspectedWord() {
      if (this.currentInspectedWordData) this.speakText(this.currentInspectedWordData.word);
    }

    closeInspectWordModal() { document.getElementById('modal-inspect-word')?.classList.add('hidden'); }

    saveInspectedWordToAnki() {
      if (!this.currentInspectedWordData) return;
      const data = this.currentInspectedWordData;
      const exists = this.state.ankiDeck.some(c => c.front.toLowerCase() === data.word.toLowerCase());
      if (!exists) {
        this.state.ankiDeck.unshift({ id: `vid_${Date.now()}`, front: data.word, back: data.translation, level: this.activeVideo.cefr || 'B1', phonetic: data.phonetic, example: data.exampleEn, exampleEs: data.exampleEs, explanation: `Video Lab: ${this.activeVideo.title}`, repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: 'learning' });
      }
      this.minedWords.push({ word: data.word, translation: data.translation });
      this.addCoins(5);
      this.saveState();
      this.renderMinedWords();
      this.closeInspectWordModal();
      this.sound.playCoin();
      this.showToast(`🧠 "${data.word}" guardado en Anki y Word Bank! (+5 monedas)`, "cyan");
    }

    // ========================================================================
    // CHAT BOT
    // ========================================================================
    renderChatBot() {
      this.chatXpEarned = 0;
      const xpEl = document.getElementById('chat-xp-total');
      if (xpEl) xpEl.textContent = '+0 XP earned';
      this.selectChatScenario(this.currentScenario);
    }

    selectChatScenario(scenarioKey) {
      this.currentScenario = scenarioKey;
      this.chatStep = 0;
      document.querySelectorAll('.scenario-btn').forEach(b => b.classList.toggle('active', b.dataset.scenario === scenarioKey));
      const scenario = CHAT_SCENARIOS[scenarioKey];
      if (!scenario) return;
      const messages = document.getElementById('chat-messages');
      if (messages) {
        messages.innerHTML = `<div class="chat-msg chat-msg-bot">🤖 <strong>${scenario.name}</strong><br>${scenario.intro}</div>`;
      }
      const input = document.getElementById('chat-input');
      if (input) { input.value = ''; input.focus(); }
      const hintEl = document.getElementById('chat-grammar-hint');
      if (hintEl) hintEl.textContent = `💡 Hint: ${scenario.hints?.[0] || 'Escribe algo en inglés...'}`;
    }

    sendChatMessage() {
      const input = document.getElementById('chat-input');
      const msg = input?.value.trim();
      if (!msg) return;
      if (input) input.value = '';
      const scenario = CHAT_SCENARIOS[this.currentScenario];
      if (!scenario) return;
      const messages = document.getElementById('chat-messages');
      if (!messages) return;

      // Check grammar corrections
      let correction = '';
      Object.entries(scenario.corrections || {}).forEach(([pattern, fix]) => {
        if (msg.toLowerCase().includes(pattern)) correction = fix;
      });

      // Add user message
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg chat-msg-user';
      userDiv.textContent = msg;
      messages.appendChild(userDiv);

      if (correction) {
        const corr = document.createElement('div');
        corr.className = 'chat-msg-correction';
        corr.textContent = correction;
        messages.appendChild(corr);
      }

      // Bot response
      const step = scenario.steps[this.chatStep];
      if (step) {
        const msgLow = msg.toLowerCase();
        const matches = step.keywords.some(kw => msgLow.includes(kw));
        const botText = matches ? step.response : (scenario.steps[Math.max(0, this.chatStep - 1)]?.response || "I'm not sure I understood. Could you rephrase that?");
        const xpEarned = matches ? (step.xp || 10) : 3;

        setTimeout(() => {
          const botDiv = document.createElement('div');
          botDiv.className = 'chat-msg chat-msg-bot';
          botDiv.textContent = `🤖 ${botText}`;
          messages.appendChild(botDiv);
          messages.scrollTop = messages.scrollHeight;
          this.speakText(botText, 0.95);

          if (matches) {
            this.chatStep++;
            this.chatXpEarned += xpEarned;
            this.addXp(xpEarned);
            const xpEl = document.getElementById('chat-xp-total');
            if (xpEl) xpEl.textContent = `+${this.chatXpEarned} XP earned`;
          }

          // Update hint
          const nextHint = scenario.hints?.[this.chatStep] || '¡Buen trabajo! Sigue conversando.';
          const hintEl = document.getElementById('chat-grammar-hint');
          if (hintEl) hintEl.textContent = `💡 ${nextHint}`;

          if (this.chatStep >= scenario.steps.length) {
            this.addCoins(20);
            this.chatsCompletedCount++;
            this.state.stats.chatsCompleted = (this.state.stats.chatsCompleted || 0) + 1;
            this.checkAchievements();
            this.saveState();
            setTimeout(() => {
              const fin = document.createElement('div');
              fin.className = 'chat-msg chat-msg-bot';
              fin.innerHTML = `🎉 <strong>¡Conversación completada!</strong> +20 🪙 ¡Excelente inglés!`;
              messages.appendChild(fin);
              messages.scrollTop = messages.scrollHeight;
              this.sound.playFanfare();
            }, 1000);
          }
        }, 700);
      }

      messages.scrollTop = messages.scrollHeight;
      this.saveState();
    }

    getChatHint() {
      const scenario = CHAT_SCENARIOS[this.currentScenario];
      const hint = scenario?.hints?.[this.chatStep] || '¡Sigue adelante!';
      this.showToast(`💡 ${hint}`, "cyan");
    }

    resetChat() { this.selectChatScenario(this.currentScenario); }

    // ========================================================================
    // PRONUNCIATION TRAINER
    // ========================================================================
    renderPronunciation() {
      this.filterPronunciation(this.pronunFilter);
    }

    filterPronunciation(filter) {
      this.pronunFilter = filter;
      this.filteredPhrases = filter === 'all' ? [...PRONUNCIATION_PHRASES] : PRONUNCIATION_PHRASES.filter(p => p.level === filter);
      this.pronunIndex = 0;
      document.querySelectorAll('.pronun-filter-bar .filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
      this.renderPronunPhrase();
      document.getElementById('pronun-result-box')?.classList.add('hidden');
    }

    renderPronunPhrase() {
      if (this.filteredPhrases.length === 0) return;
      if (this.pronunIndex >= this.filteredPhrases.length) this.pronunIndex = 0;
      const phrase = this.filteredPhrases[this.pronunIndex];
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('pronun-phrase-en', phrase.en);
      set('pronun-phrase-phonetic', phrase.phonetic);
      set('pronun-phrase-es', phrase.es);
      set('pronun-counter', `${this.pronunIndex + 1} / ${this.filteredPhrases.length}`);
      document.getElementById('pronun-result-box')?.classList.add('hidden');
      const btn = document.getElementById('btn-pronun-mic');
      if (btn) { btn.classList.remove('btn-recording'); btn.textContent = '🎤 Hablar'; }
      set('pronun-status', 'Listo para escuchar...');
    }

    speakPronunPhrase() {
      const phrase = this.filteredPhrases[this.pronunIndex];
      if (phrase) this.speakText(phrase.en, 0.8);
    }

    nextPronunPhrase() {
      this.pronunIndex = (this.pronunIndex + 1) % this.filteredPhrases.length;
      this.renderPronunPhrase();
      this.sound.playClick();
    }

    startPronunciationRecognition() {
      if (this.isListening) { this.stopRecognition(); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        this.showToast("⚠️ Tu navegador no soporta reconocimiento de voz. Usa Chrome.", "info");
        this.simulatePronunciationResult();
        return;
      }
      const phrase = this.filteredPhrases[this.pronunIndex];
      if (!phrase) return;
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.lang = 'en-US';
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      const btn = document.getElementById('btn-pronun-mic');
      const status = document.getElementById('pronun-status');
      if (btn) { btn.classList.add('btn-recording'); btn.textContent = '⏹️ Detener'; }
      if (status) status.textContent = '🎤 Escuchando... ¡habla ahora!';
      this.isListening = true;
      this.speechRecognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase().trim();
        this.isListening = false;
        if (btn) { btn.classList.remove('btn-recording'); btn.textContent = '🎤 Hablar'; }
        this.evaluatePronunciation(phrase.en, transcript);
      };
      this.speechRecognition.onerror = () => {
        this.isListening = false;
        if (btn) { btn.classList.remove('btn-recording'); btn.textContent = '🎤 Hablar'; }
        if (status) status.textContent = 'Error de reconocimiento. Inténtalo de nuevo.';
      };
      this.speechRecognition.onend = () => { this.isListening = false; };
      try { this.speechRecognition.start(); } catch(e) { this.simulatePronunciationResult(); }
    }

    stopRecognition() {
      if (this.speechRecognition) { try { this.speechRecognition.stop(); } catch(e) {} }
      this.isListening = false;
      const btn = document.getElementById('btn-pronun-mic');
      if (btn) { btn.classList.remove('btn-recording'); btn.textContent = '🎤 Hablar'; }
    }

    simulatePronunciationResult() {
      const phrase = this.filteredPhrases[this.pronunIndex];
      if (!phrase) return;
      const outcomes = ['correct', 'partial', 'wrong'];
      const outcome = outcomes[Math.floor(Math.random() * 2.5)];
      const heard = outcome === 'correct' ? phrase.en.toLowerCase() : (outcome === 'partial' ? phrase.en.toLowerCase().split(' ').slice(0, -1).join(' ') : 'sorry could not understand');
      this.evaluatePronunciation(phrase.en, heard);
    }

    evaluatePronunciation(target, heard) {
      const targetWords = target.toLowerCase().replace(/[.,!?]/g,'').split(' ');
      const heardWords = heard.toLowerCase().replace(/[.,!?]/g,'').split(' ');
      const matches = targetWords.filter(w => heardWords.some(h => h.includes(w) || w.includes(h))).length;
      const score = matches / targetWords.length;
      let result, emoji, className;
      if (score >= 0.8) { result = '✅ ¡Excelente pronunciación!'; emoji = '🟢'; className = 'result-correct'; this.pronunCorrect++; this.addXp(5); this.state.stats.pronunciationCorrect = (this.state.stats.pronunciationCorrect || 0) + 1; }
      else if (score >= 0.5) { result = '🟡 Casi perfecto — ¡sigue practicando!'; emoji = '🟡'; className = 'result-partial'; this.pronunPartial++; this.addXp(2); }
      else { result = '🔴 Necesita más práctica. ¡Escucha el modelo!'; emoji = '🔴'; className = 'result-wrong'; this.pronunWrong++; }

      const resultBox = document.getElementById('pronun-result-box');
      if (resultBox) {
        resultBox.className = `pronun-result-box ${className}`;
        resultBox.classList.remove('hidden');
        document.getElementById('pronun-result-text').textContent = result;
        document.getElementById('pronun-heard-text').textContent = heard ? `Escuché: "${heard}"` : '';
      }
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('pronun-correct-count', this.pronunCorrect);
      set('pronun-partial-count', this.pronunPartial);
      set('pronun-wrong-count', this.pronunWrong);
      set('pronun-status', `${emoji} Evaluación completada`);

      // Add to history
      const hist = document.getElementById('pronun-history-list');
      if (hist) {
        const phrase = this.filteredPhrases[this.pronunIndex];
        const cls = score >= 0.8 ? 'hist-correct' : (score >= 0.5 ? 'hist-partial' : 'hist-wrong');
        const item = document.createElement('div');
        item.className = `history-item ${cls}`;
        item.innerHTML = `<div class="hist-result-dot"></div><span class="hist-phrase">${escapeHTML(phrase?.en?.substring(0,40))}...</span>`;
        if (hist.querySelector('p')) hist.innerHTML = '';
        hist.insertBefore(item, hist.firstChild);
      }

      this.checkAchievements();
      this.saveState();
    }

    // ========================================================================
    // MODULES
    // ========================================================================
    renderModules() {
      this.setModuleTab(this.currentModuleTab);
    }

    // ========================================================================
    // THEME SWITCHER CONTROLLER (FIGMA 4 DESIGN SYSTEMS)
    // ========================================================================
    applyTheme(themeId) {
      if (!themeId || !THEMES[themeId]) themeId = 'cyberpunk';
      const body = document.body;
      body.classList.remove('cyber-theme', 'theme-cyberpunk', 'theme-field-notes', 'theme-night-signal', 'theme-soft-studio', 'theme-aurora-flow');
      if (themeId === 'cyberpunk') {
        body.classList.add('cyber-theme', 'theme-cyberpunk');
      } else {
        body.classList.add(`theme-${themeId}`);
      }

      // Manage stars canvas & scanline
      const stars = document.getElementById('stars-canvas');
      const scanline = document.querySelector('.cyber-scanline');
      ['obsidian-gold','arctic-mint','sakura-pulse'].forEach(skin => body.classList.toggle('premium-skin-' + skin, Boolean(this.state.premiumThemes && this.state.premiumThemeSkin === skin)));
      const showFX = (themeId === 'cyberpunk' || themeId === 'night-signal');
      if (stars) stars.style.display = showFX ? 'block' : 'none';
      if (scanline) scanline.style.display = showFX ? 'block' : 'none';
    }

    setTheme(themeId) {
      this.sound.playClick();
      if (!THEMES[themeId]) themeId = 'cyberpunk';
      this.state.theme = themeId;
      this.applyTheme(themeId);
      this.saveState();
      this.showToast(`🎨 Estilo visual cambiado a: ${THEMES[themeId].name}`, "cyan");

      this.renderThemePickerGrid();
      if (this.activeView === 'profile') this.renderProfile();
    }

    openThemeModal() {
      this.sound.playClick();
      this.renderThemePickerGrid();
      document.getElementById('modal-theme-picker')?.classList.remove('hidden');
    }

    closeThemeModal() {
      document.getElementById('modal-theme-picker')?.classList.add('hidden');
    }

    renderThemePickerGrid() {
      const container = document.getElementById('theme-picker-grid');
      if (!container) return;
      const current = this.state.theme || 'cyberpunk';

      container.innerHTML = Object.values(THEMES).map(t => {
        const isActive = t.id === current;
        return `
          <div class="theme-card-item ${isActive ? 'active' : ''}" onclick="app.setTheme('${t.id}')">
            <div class="theme-card-header">
              <div>
                <h4 style="font-size:1.05rem;font-weight:800;margin-bottom:0.15rem">${t.name}</h4>
                <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600">${t.subtitle}</div>
              </div>
              <span class="theme-badge" style="background:${t.accent1};color:#fff">${t.badge}</span>
            </div>
            <div class="theme-preview-canvas" style="background:${t.previewBg}">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:0.7rem;font-weight:800;color:${t.accent1}">✦ ${t.font}</span>
                <span style="font-size:0.68rem;padding:0.1rem 0.4rem;border-radius:9999px;background:${t.accent1};color:#fff;font-weight:700">Preview</span>
              </div>
              <div style="background:${t.previewCard};padding:0.35rem 0.6rem;border-radius:4px;border:1px solid rgba(0,0,0,0.1);display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:0.75rem;font-weight:700">Aura100 UI</span>
                <button style="border:none;background:${t.accent1};color:#fff;font-size:0.65rem;font-weight:700;padding:0.15rem 0.45rem;border-radius:3px">Demo</button>
              </div>
            </div>
            <p style="font-size:0.78rem;line-height:1.35;margin-bottom:0.75rem;color:var(--text-muted)">${t.tagline}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
              <div class="theme-swatches">
                <span class="theme-swatch" style="background:${t.accent1}" title="Primary Accent"></span>
                <span class="theme-swatch" style="background:${t.accent2}" title="Secondary Accent"></span>
                <span class="theme-swatch" style="background:${t.accent3}" title="Highlight Accent"></span>
              </div>
              <span class="btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm" style="font-size:0.75rem;pointer-events:none">
                ${isActive ? '✓ Activo' : 'Activar'}
              </span>
            </div>
          </div>
        `;
      }).join('');
    }

    // ========================================================================
    // MODULE: FLASHCARDS (VOCABULARY)
    // ========================================================================
    renderFlashcards() {
      if (this.currentFlashcardIndex === undefined) this.currentFlashcardIndex = 0;
      if (this.flashcardIsFlipped === undefined) this.flashcardIsFlipped = false;
      if (!this.flashcardsList) {
        this.flashcardsList = [...MASTER_WORDS];
      }
      this.updateFlashcardUI();
    }

    filterFlashcards() {
      const catEl = document.getElementById('flashcard-category-select');
      const lvlEl = document.getElementById('flashcard-level-select');
      const cat = catEl ? catEl.value : 'all';
      const lvl = lvlEl ? lvlEl.value : 'all';

      this.flashcardsList = MASTER_WORDS.filter(w => {
        const matchCat = cat === 'all' || w.category === cat;
        const matchLvl = lvl === 'all' || w.level === lvl;
        return matchCat && matchLvl;
      });

      this.currentFlashcardIndex = 0;
      this.flashcardIsFlipped = false;
      this.updateFlashcardUI();
    }

    updateFlashcardUI() {
      const list = this.flashcardsList && this.flashcardsList.length > 0 ? this.flashcardsList : MASTER_WORDS;
      if (this.currentFlashcardIndex >= list.length) this.currentFlashcardIndex = 0;
      if (this.currentFlashcardIndex < 0) this.currentFlashcardIndex = list.length - 1;

      const card = list[this.currentFlashcardIndex];
      if (!card) return;

      const inner = document.getElementById('flashcard-inner');
      if (inner) {
        inner.classList.toggle('flipped', this.flashcardIsFlipped);
      }

      const badge = document.getElementById('fc-level-badge');
      if (badge) badge.textContent = card.level || 'A1';

      const wordEl = document.getElementById('fc-word');
      if (wordEl) wordEl.textContent = card.word || '';

      const phonEl = document.getElementById('fc-phonetic');
      if (phonEl) phonEl.textContent = card.phonetic || '';

      const catEl = document.getElementById('fc-category');
      if (catEl) catEl.textContent = card.category || '';

      const transEl = document.getElementById('fc-translation');
      if (transEl) transEl.textContent = card.translation || '';

      const exEn = document.getElementById('fc-example-en');
      if (exEn) exEn.textContent = `"${card.example || ''}"`;

      const exEs = document.getElementById('fc-example-es');
      if (exEs) exEs.textContent = `"${card.exampleEs || ''}"`;

      const counter = document.getElementById('fc-counter');
      if (counter) counter.textContent = `${this.currentFlashcardIndex + 1} / ${list.length}`;
    }

    flipFlashcard() {
      this.sound.playClick();
      this.flashcardIsFlipped = !this.flashcardIsFlipped;
      const inner = document.getElementById('flashcard-inner');
      if (inner) inner.classList.toggle('flipped', this.flashcardIsFlipped);
    }

    nextFlashcard() {
      this.sound.playClick();
      this.flashcardIsFlipped = false;
      this.currentFlashcardIndex++;
      this.updateFlashcardUI();
    }

    prevFlashcard() {
      this.sound.playClick();
      this.flashcardIsFlipped = false;
      this.currentFlashcardIndex--;
      this.updateFlashcardUI();
    }

    speakCurrentFlashcard() {
      const list = this.flashcardsList && this.flashcardsList.length > 0 ? this.flashcardsList : MASTER_WORDS;
      const card = list[this.currentFlashcardIndex];
      if (card && card.word) {
        this.speak(card.word);
      }
    }

    addCurrentFlashcardToAnki() {
      const list = this.flashcardsList && this.flashcardsList.length > 0 ? this.flashcardsList : MASTER_WORDS;
      const card = list[this.currentFlashcardIndex];
      if (!card) return;
      
      const exists = this.state.ankiDeck.some(c => c.front.toLowerCase() === card.word.toLowerCase());
      if (exists) {
        this.showToast("Esta palabra ya está en tu mazo Anki.", "info");
        return;
      }
      this.state.ankiDeck.push({
        id: "fc_" + Date.now(),
        front: card.word,
        back: card.translation,
        phonetic: card.phonetic,
        example: card.example,
        category: card.category,
        level: card.level,
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
        dueDate: new Date().toISOString()
      });
      this.saveState();
      this.updateHeaderAndSidebarUI();
      this.showToast(`➕ "${card.word}" agregada al mazo Anki SRS`, "purple");
    }

    markWordLearned() {
      const list = this.flashcardsList && this.flashcardsList.length > 0 ? this.flashcardsList : MASTER_WORDS;
      const card = list[this.currentFlashcardIndex];
      if (!card) return;
      if (!this.state.knownWords.includes(card.word)) {
        this.state.knownWords.push(card.word);
        this.addXp(10);
        this.saveState();
        this.showToast(`✅ "${card.word}" marcada como dominada (+10 XP)`, "success");
      } else {
        this.showToast(`Ya dominas "${card.word}".`, "info");
      }
    }


    // ========================================================================
    // EXPANDED MODULES CONTROLLER & RENDERERS
    // ========================================================================
    setModuleTab(tabName) {
      this.sound.playClick();
      this.currentModuleTab = tabName;
      document.querySelectorAll('.module-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
      document.querySelectorAll('.module-tab-content').forEach(el => el.classList.remove('active'));
      document.getElementById(`module-content-${tabName}`)?.classList.add('active');
      if (tabName === 'vocabulary') this.renderFlashcards();
      if (tabName === 'grammar') this.renderGrammarModule();
      if (tabName === 'reading') this.renderReadingModule();
      if (tabName === 'listening') this.renderListeningModule();
      if (tabName === 'writing') this.renderWritingModule();
      if (tabName === 'speaking') this.renderSpeakingModule();
      if (tabName === 'idioms') this.renderIdiomsModule();
      if (tabName === 'verbs') this.renderVerbsModule();
      if (tabName === 'business') this.renderBusinessModule();
    }

    // ------------------------------------------------------------------------
    // MODULE: COMPENDIO MAESTRO DE GRAMATICA A1 - C1 (48 UNIDADES DEL PDF)
    // ------------------------------------------------------------------------
    renderGrammarModule() {
      const container = document.getElementById('grammar-module-content');
      if (!container) return;
      if (!this.currentGrammarUnitId) this.currentGrammarUnitId = GRAMMAR_DATA[0].id;
      if (!this.currentGrammarLevel) this.currentGrammarLevel = 'all';
      if (!this.currentGrammarSearch) this.currentGrammarSearch = '';

      container.innerHTML = `
        <div class="grammar-header-box">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
            <div>
              <h3 style="font-size:1.4rem;color:var(--text-main);display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem">
                <span>📖</span> Domina la Gramática Inglesa: de A1 a C1
              </h3>
              <p style="color:var(--text-muted);font-size:0.92rem;max-width:750px">
                Compendio interactivo oficial de 48 unidades maestras: fonética, partes de la oración, tiempos verbales, pasiva, estilo indirecto, condicionales, estructuras enfáticas, causativas y matriz de 12 tiempos verbales.
              </p>
            </div>
            <div style="display:flex;gap:0.6rem;align-items:center">
              <span class="badge-diff">A1 - C1</span>
              <button class="btn btn-secondary btn-sm" onclick="app.setGrammarRandomTopic()">🎲 Tema Aleatorio</button>
            </div>
          </div>

          <div style="margin-top:1.25rem;display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;justify-content:space-between">
            <div class="grammar-filter-pills" id="grammar-level-pills">
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'all' ? 'active' : ''}" onclick="app.filterGrammarLevel('all')">🌐 Todos (${GRAMMAR_DATA.length})</button>
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'A1' ? 'active' : ''}" onclick="app.filterGrammarLevel('A1')">🟢 A1 Principiante (10)</button>
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'A2' ? 'active' : ''}" onclick="app.filterGrammarLevel('A2')">🔵 A2 Básico (8)</button>
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'B1' ? 'active' : ''}" onclick="app.filterGrammarLevel('B1')">🟣 B1 Intermedio (11)</button>
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'B2' ? 'active' : ''}" onclick="app.filterGrammarLevel('B2')">🟠 B2 Intermedio Alto (9)</button>
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'C1' ? 'active' : ''}" onclick="app.filterGrammarLevel('C1')">🔴 C1 Avanzado (9)</button>
              <button class="grammar-filter-pill ${this.currentGrammarLevel === 'Anexo' ? 'active' : ''}" onclick="app.filterGrammarLevel('Anexo')">📑 Anexo: 12 Tiempos (1)</button>
            </div>
            <div style="flex:1;min-width:240px;max-width:380px">
              <input type="text" id="grammar-search-input" value="${this.currentGrammarSearch}"
                placeholder="🔍 Buscar regla, tiempo o concepto..."
                style="width:100%;padding:0.5rem 0.9rem;border-radius:var(--radius-full);background:rgba(0,0,0,0.4);border:1px solid var(--border-color);color:var(--text-main);font-size:0.85rem;outline:none"
                oninput="app.filterGrammarSearch(this.value)">
            </div>
          </div>
        </div>

        <div class="grammar-layout">
          <div class="grammar-sidebar-topics" id="grammar-sidebar-topics">
            <!-- Topics list populated by JS -->
          </div>
          <div class="grammar-detail-panel" id="grammar-detail-panel">
            <!-- Unit detail populated by JS -->
          </div>
        </div>
      `;

      this.updateGrammarSidebar();
      this.showGrammarTopic(this.currentGrammarUnitId);
      if (this.state && this.state.stats && this.state.stats.categoriesPracticed) {
        this.state.stats.categoriesPracticed.grammar = true;
      }
    }

    filterGrammarLevel(level) {
      this.sound.playClick();
      this.currentGrammarLevel = level;
      document.querySelectorAll('#grammar-level-pills .grammar-filter-pill').forEach(b => {
        const isMatch = (level === 'all' && b.textContent.includes('Todos')) || b.textContent.includes(level);
        b.classList.toggle('active', isMatch);
      });
      this.updateGrammarSidebar();
      const filtered = this.getFilteredGrammarUnits();
      if (filtered.length && !filtered.some(u => u.id === this.currentGrammarUnitId)) {
        this.showGrammarTopic(filtered[0].id);
      }
    }

    filterGrammarSearch(query) {
      this.currentGrammarSearch = query.trim().toLowerCase();
      this.updateGrammarSidebar();
      const filtered = this.getFilteredGrammarUnits();
      if (filtered.length && !filtered.some(u => u.id === this.currentGrammarUnitId)) {
        this.showGrammarTopic(filtered[0].id);
      }
    }

    getFilteredGrammarUnits() {
      return GRAMMAR_DATA.filter(unit => {
        const matchesLevel = (this.currentGrammarLevel === 'all') || (unit.level === this.currentGrammarLevel);
        if (!matchesLevel) return false;
        if (!this.currentGrammarSearch) return true;
        const q = this.currentGrammarSearch;
        return unit.title.toLowerCase().includes(q) ||
               unit.summary.toLowerCase().includes(q) ||
               (unit.content && unit.content.toLowerCase().includes(q));
      });
    }

    updateGrammarSidebar() {
      const sidebar = document.getElementById('grammar-sidebar-topics');
      if (!sidebar) return;
      const filtered = this.getFilteredGrammarUnits();
      if (!filtered.length) {
        sidebar.innerHTML = `<div style="padding:1.5rem;text-align:center;color:#64748b;font-size:0.85rem">No se encontraron temas con esos criterios.</div>`;
        return;
      }
      sidebar.innerHTML = filtered.map((unit, idx) => {
        const isActive = unit.id === this.currentGrammarUnitId;
        const lvlClass = `level-${unit.level.toLowerCase()}`;
        return `
          <button class="grammar-topic-btn ${isActive ? 'active' : ''}" onclick="app.showGrammarTopic('${unit.id}')">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span class="level-badge-tag ${lvlClass}">${unit.level}</span>
              <span style="font-size:1.1rem">${unit.icon || '📘'}</span>
            </div>
            <strong style="font-size:0.86rem;color:${isActive ? '#fff' : '#cbd5e1'};line-height:1.3;margin-top:0.25rem">${unit.title}</strong>
          </button>
        `;
      }).join('');
    }

    showGrammarTopic(topicId) {
      this.currentGrammarUnitId = topicId;
      const unit = GRAMMAR_DATA.find(u => u.id === topicId) || GRAMMAR_DATA[0];
      const panel = document.getElementById('grammar-detail-panel');
      if (!panel) return;

      document.querySelectorAll('.grammar-topic-btn').forEach(b => {
        b.classList.remove('active');
        if (b.textContent.includes(unit.title.substring(0, 15))) {
          b.classList.add('active');
        }
      });

      const unitIdx = GRAMMAR_DATA.findIndex(u => u.id === unit.id);
      const lvlClass = `level-${unit.level.toLowerCase()}`;

      panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;padding-bottom:1rem;border-bottom:1px solid var(--border-color);margin-bottom:1.25rem">
          <div>
            <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.35rem">
              <span class="level-badge-tag ${lvlClass}">${unit.level}</span>
              <span style="font-size:1.5rem">${unit.icon || '📘'}</span>
            </div>
            <h2 style="font-size:1.35rem;color:var(--text-main);margin:0">${unit.title}</h2>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <button class="btn btn-secondary btn-sm" onclick="app.speakText('${unit.title.replace(/'/g, "\'")}')">🔊 Pronunciar</button>
            <button class="btn btn-secondary btn-sm" onclick="app.addGrammarToAnki(${unitIdx})">➕ Añadir a Anki</button>
            <button class="btn btn-primary btn-sm" onclick="app.completeGrammarUnit('${unit.id}')">✅ Marcar Estudiado (+30 XP)</button>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:0.9rem 1.1rem;margin-bottom:1.25rem">
          <p style="color:var(--text-muted);font-size:0.92rem;margin:0;line-height:1.5"><strong>Resumen conceptual:</strong> ${unit.summary}</p>
        </div>

        <div class="grammar-unit-text-content">
          ${unit.content}
        </div>

        ${unit.drills && unit.drills.length ? `
          <div class="grammar-drills-box">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h4 style="font-size:1.05rem;color:var(--cyan-neon);margin:0;display:flex;align-items:center;gap:0.4rem">
                <span>🎯</span> Ejercicios Prácticos de Afianzamiento
              </h4>
              <span style="font-size:0.8rem;color:var(--text-muted)">+15 XP por respuesta correcta</span>
            </div>
            <div class="grammar-drills-list">
              ${unit.drills.map((drill, dIdx) => `
                <div class="grammar-drill-card">
                  <p style="color:var(--text-main);font-size:0.92rem;font-weight:600;margin-bottom:0.75rem">${dIdx + 1}. ${drill.q}</p>
                  <div style="display:flex;flex-direction:column;gap:0.4rem">
                    ${drill.opts.map((opt, oIdx) => `
                      <button class="mc-option" onclick="app.checkGrammarDrillByIndex(this, ${unitIdx}, ${dIdx}, ${oIdx})">
                        ${String.fromCharCode(65 + oIdx)}) ${opt}
                      </button>
                    `).join('')}
                  </div>
                  <div id="drill-feedback-${unitIdx}-${dIdx}" style="display:none;margin-top:0.75rem;padding:0.6rem 0.9rem;border-radius:var(--radius-sm);background:rgba(0,0,0,0.4);font-size:0.85rem;line-height:1.4"></div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-color)">
          ${unitIdx > 0 ? `
            <button class="btn btn-secondary btn-sm" onclick="app.showGrammarTopic('${GRAMMAR_DATA[unitIdx - 1].id}')">◀ Unidad Anterior</button>
          ` : '<div></div>'}
          ${unitIdx < GRAMMAR_DATA.length - 1 ? `
            <button class="btn btn-primary btn-sm" onclick="app.showGrammarTopic('${GRAMMAR_DATA[unitIdx + 1].id}')">Siguiente Unidad ▶</button>
          ` : '<div></div>'}
        </div>
      `;
    }

    checkGrammarDrillByIndex(btn, unitIdx, drillIdx, optIdx) {
      const unit = GRAMMAR_DATA[unitIdx];
      if (!unit || !unit.drills || !unit.drills[drillIdx]) return;
      const drill = unit.drills[drillIdx];
      const chosen = drill.opts[optIdx];
      const correct = drill.a;

      btn.parentElement.querySelectorAll('.mc-option').forEach(b => b.disabled = true);
      const fbDiv = document.getElementById(`drill-feedback-${unitIdx}-${drillIdx}`);

      if (chosen === correct) {
        btn.classList.add('correct');
        this.addXp(15);
        this.sound.playCorrect();
        this.showToast("✅ ¡Excelente deducción gramatical! +15 XP", "cyan");
        if (fbDiv) {
          fbDiv.innerHTML = `<span style="color:var(--cyan-neon);font-weight:700">✓ ¡Correcto!</span> ${drill.exp}`;
          fbDiv.style.display = 'block';
        }
      } else {
        btn.classList.add('incorrect');
        this.sound.playIncorrect();
        this.showToast("❌ Respuesta incorrecta. Revisa la regla.", "info");
        if (fbDiv) {
          fbDiv.innerHTML = `<span style="color:var(--pink-neon);font-weight:700">✗ Respuesta esperada:</span> <strong>${drill.a}</strong>.<br>${drill.exp}`;
          fbDiv.style.display = 'block';
        }
      }
    }

    completeGrammarUnit(unitId) {
      const unit = GRAMMAR_DATA.find(u => u.id === unitId);
      if (!unit) return;
      this.sound.playFanfare();
      this.addXp(30);
      this.showToast(`🎉 ¡Unidad "${unit.title}" dominada! +30 XP`, "cyan");
      this.launchConfetti();
    }

    setGrammarRandomTopic() {
      const rand = GRAMMAR_DATA[Math.floor(Math.random() * GRAMMAR_DATA.length)];
      if (rand) {
        this.sound.playClick();
        this.currentGrammarLevel = 'all';
        this.currentGrammarSearch = '';
        this.updateGrammarSidebar();
        this.showGrammarTopic(rand.id);
        this.showToast(`🎲 Tema aleatorio: ${rand.title}`, "info");
      }
    }

    addGrammarToAnki(unitIdx) {
      const unit = GRAMMAR_DATA[unitIdx];
      if (!unit) return;
      const front = `Regla Clave: ${unit.title}`;
      const back = unit.summary;
      this.addCustomAnkiCard(front, back, `Unidad Nivel ${unit.level}`);
    }

    // ------------------------------------------------------------------------
    // MODULE: SPEAKING & REAL-LIFE DIALOGUES
    // ------------------------------------------------------------------------
    renderSpeakingModule() {
      const container = document.getElementById('speaking-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>🗣️ Diálogos Situacionales de la Vida Real</h3>
              <p>Escucha las intervenciones nativas y practica tu respuesta en voz alta con micrófono o síntesis de voz.</p>
            </div>
            <span class="badge-diff">A1 - C2</span>
          </div>
        </div>
        <div class="speaking-dialogues-list">
          ${SPEAKING_DIALOGUES_DATA.map((scene, sIdx) => `
            <div class="card" style="margin-bottom:1.5rem">
              <div class="card-header-row">
                <div style="display:flex;align-items:center;gap:0.6rem">
                  <span style="font-size:1.6rem">${scene.icon}</span>
                  <h3 style="font-size:1.15rem">${scene.title}</h3>
                </div>
                <span class="badge-diff">${scene.level}</span>
              </div>
              <div class="dialogue-turns-flow" style="display:flex;flex-direction:column;gap:0.85rem;margin:1.25rem 0">
                ${scene.turns.map((turn, tIdx) => `
                  <div class="dialogue-turn-card ${turn.role === 'You' ? 'turn-user' : 'turn-agent'}" style="display:flex;gap:0.85rem;align-items:flex-start;background:${turn.role === 'You' ? 'rgba(0,240,255,0.08)' : 'rgba(168,85,247,0.08)'};border:1px solid ${turn.role === 'You' ? 'rgba(0,240,255,0.3)' : 'rgba(168,85,247,0.3)'};border-radius:var(--radius-md);padding:0.9rem">
                    <span style="font-size:1.5rem;line-height:1">${turn.avatar}</span>
                    <div style="flex:1">
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
                        <strong style="color:${turn.role === 'You' ? 'var(--cyan-neon)' : 'var(--purple-light)'};font-size:0.88rem">${turn.role}</strong>
                        <button class="btn btn-ghost btn-sm" style="padding:0.2rem 0.5rem;font-size:0.75rem" onclick="app.speakDialogueTurn('${scene.id}', ${tIdx})">🔊 Escuchar</button>
                      </div>
                      <p style="color:var(--text-main);font-size:0.98rem;line-height:1.5">${turn.text}</p>
                      ${turn.tip ? `<p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.4rem;font-style:italic">💡 Tip fonético: ${turn.tip}</p>` : ''}
                    </div>
                  </div>`).join('')}
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border-color)">
                <button class="btn btn-primary" onclick="app.completeSpeakingDialogue('${scene.id}')">✅ Marcar Escenario como Practicado (+25 XP)</button>
                <button class="btn btn-secondary" onclick="app.speakWholeDialogue('${scene.id}')">🎧 Reproducir Conversación Completa</button>
              </div>
            </div>`).join('')}
        </div>`;
      this.state.stats.categoriesPracticed.speaking = true;
    }

    speakDialogueTurn(sceneId, turnIdx) {
      const scene = SPEAKING_DIALOGUES_DATA.find(s => s.id === sceneId);
      if (!scene || !scene.turns[turnIdx]) return;
      this.speakText(scene.turns[turnIdx].text, 0.95);
    }

    completeSpeakingDialogue(sceneId) {
      this.addXp(25);
      this.addCoins(5);
      this.sound.playCorrect();
      this.showToast("🗣️ ¡Gran trabajo de pronunciación! Escenario completado +25 XP", "cyan");
      this.saveState();
    }

    speakWholeDialogue(sceneId) {
      const scene = SPEAKING_DIALOGUES_DATA.find(s => s.id === sceneId);
      if (!scene) return;
      let idx = 0;
      const playNext = () => {
        if (idx >= scene.turns.length) {
          this.showToast("✨ Conversación finalizada", "info");
          return;
        }
        const turn = scene.turns[idx];
        this.speakText(turn.text, 0.95);
        idx++;
        setTimeout(playNext, 4500);
      };
      playNext();
      this.showToast(`▶ Reproduciendo "${scene.title}"...`, "purple");
    }

    // ------------------------------------------------------------------------
    // MODULE: IDIOMS & PHRASAL VERBS
    // ------------------------------------------------------------------------
    renderIdiomsModule() {
      const container = document.getElementById('idioms-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>💡 Modismos & Phrasal Verbs Imprescindibles</h3>
              <p>Domina expresiones nativas cotidianas que no se traducen literalmente y habla como un hablante nativo.</p>
            </div>
            <div style="display:flex;gap:0.5rem">
              <input type="text" id="idiom-search-input" class="text-input" placeholder="Buscar modismo o phrasal..." style="width:220px;padding:0.4rem 0.8rem;font-size:0.85rem" oninput="app.filterIdiomsList()">
            </div>
          </div>
        </div>
        <div class="idiom-filter-tabs" style="display:flex;gap:0.5rem;margin-bottom:1.25rem">
          <button class="btn btn-secondary btn-sm active idiom-tab-filter" onclick="app.filterIdiomsByType('all', this)">Todos (24)</button>
          <button class="btn btn-secondary btn-sm idiom-tab-filter" onclick="app.filterIdiomsByType('Idiom', this)">🎭 Modismos / Idioms</button>
          <button class="btn btn-secondary btn-sm idiom-tab-filter" onclick="app.filterIdiomsByType('Phrasal Verb', this)">⚡ Phrasal Verbs</button>
        </div>
        <div class="idioms-grid" id="idioms-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.25rem">
          <!-- Populated by JS -->
        </div>
        <div class="card" style="margin-top:2rem;background:linear-gradient(135deg, rgba(168,85,247,0.15), rgba(0,240,255,0.08))">
          <h3 style="color:var(--cyan-neon);margin-bottom:0.5rem">🧠 Mini-Quiz: Adivina el Significado del Modismo</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1rem">¿Qué significa realmente la expresión en inglés <em>'To burn the midnight oil'</em>?</p>
          <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
            <button class="mc-option" onclick="app.checkIdiomDrill(this, false)">Comprar aceite para cocinar</button>
            <button class="mc-option" onclick="app.checkIdiomDrill(this, true)">Estudiar o trabajar hasta altas horas de la noche</button>
            <button class="mc-option" onclick="app.checkIdiomDrill(this, false)">Provocar un incendio accidental</button>
          </div>
          <div id="idiom-quiz-feedback" style="margin-top:0.75rem"></div>
        </div>`;
      this.filterIdiomsList();
    }

    filterIdiomsByType(type, btn) {
      document.querySelectorAll('.idiom-tab-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.currentIdiomTypeFilter = type;
      this.filterIdiomsList();
    }

    filterIdiomsList() {
      const query = document.getElementById('idiom-search-input')?.value.toLowerCase().trim() || '';
      const typeFilter = this.currentIdiomTypeFilter || 'all';
      const grid = document.getElementById('idioms-cards-grid');
      if (!grid) return;
      const filtered = IDIOMS_DATA.filter(item => {
        const matchesQuery = item.phrase.toLowerCase().includes(query) || item.meaning.toLowerCase().includes(query) || item.example.toLowerCase().includes(query);
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        return matchesQuery && matchesType;
      });
      if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:2rem">No se encontraron modismos con ese criterio de búsqueda.</p>';
        return;
      }
      grid.innerHTML = filtered.map(item => `
        <div class="card idiom-item-card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="card-header-row" style="margin-bottom:0.5rem">
              <h4 style="font-size:1.15rem;color:var(--cyan-neon);font-weight:800">${item.phrase}</h4>
              <span class="badge-diff" style="font-size:0.75rem">${item.level}</span>
            </div>
            <span style="font-size:0.75rem;font-weight:700;color:var(--pink-light);text-transform:uppercase;letter-spacing:0.5px">${item.type}</span>
            <p style="color:var(--text-main);font-size:0.95rem;font-weight:600;margin:0.6rem 0">${item.meaning}</p>
            <div style="background:rgba(0,0,0,0.3);border-radius:var(--radius-sm);padding:0.6rem;margin-bottom:0.75rem;border-left:3px solid var(--purple-neon)">
              <p style="color:#cbd5e1;font-size:0.85rem;line-height:1.4"><strong>Ejemplo:</strong> "${item.example}"</p>
            </div>
            <p style="color:var(--text-muted);font-size:0.78rem">⚠️ <em>Literal:</em> ${item.literal}</p>
          </div>
          <div style="display:flex;gap:0.5rem;margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--border-color)">
            <button class="btn btn-ghost btn-sm" style="flex:1" onclick="app.speakIdiomItem('${item.id}')">🔊 Audio</button>
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="app.addIdiomToAnki('${item.id}')">➕ A Anki</button>
          </div>
        </div>`).join('');
    }

    speakIdiomItem(id) {
      const item = IDIOMS_DATA.find(i => i.id === id);
      if (item) this.speakText(item.phrase);
    }

    addIdiomToAnki(id) {
      const item = IDIOMS_DATA.find(i => i.id === id);
      if (!item) return;
      this.addCustomAnkiCard(item.phrase, item.meaning, item.example);
    }

    checkIdiomDrill(btn, isCorrect) {
      btn.parentElement.querySelectorAll('.mc-option').forEach(b => b.disabled = true);
      const fb = document.getElementById('idiom-quiz-feedback');
      if (isCorrect) {
        btn.classList.add('correct');
        this.addXp(10);
        this.sound.playCorrect();
        if (fb) fb.innerHTML = '<span style="color:var(--success-neon);font-weight:700">✅ ¡Correcto! Viene de la época antes de la luz eléctrica, cuando se quemaba el aceite de las lámparas para estudiar de noche. +10 XP</span>';
      } else {
        btn.classList.add('incorrect');
        this.sound.playIncorrect();
        if (fb) fb.innerHTML = '<span style="color:var(--error-neon);font-weight:700">❌ Incorrecto. Significa estudiar o trabajar hasta muy tarde de noche.</span>';
      }
    }

    // ------------------------------------------------------------------------
    // MODULE: IRREGULAR VERBS HUB
    // ------------------------------------------------------------------------
    renderVerbsModule() {
      const container = document.getElementById('verbs-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>⚡ Centro Maestro de Verbos Irregulares (45+)</h3>
              <p>Domina las 3 formas de los verbos agrupados por patrones fonéticos mnemotécnicos en vez de memorizarlos al azar.</p>
            </div>
            <input type="text" id="verb-search-input" class="text-input" placeholder="Buscar verbo..." style="width:200px;padding:0.4rem 0.8rem;font-size:0.85rem" oninput="app.filterVerbsList()">
          </div>
        </div>
        <div class="verb-pattern-pills" style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.25rem">
          <button class="btn btn-secondary btn-sm active verb-filter-btn" onclick="app.filterVerbsByPattern('all', this)">Todos los Verbos (45+)</button>
          <button class="btn btn-secondary btn-sm verb-filter-btn" onclick="app.filterVerbsByPattern('A-A-A', this)">Patrón A-A-A (Sin cambios)</button>
          <button class="btn btn-secondary btn-sm verb-filter-btn" onclick="app.filterVerbsByPattern('A-B-B', this)">Patrón A-B-B (Pasado = Participio)</button>
          <button class="btn btn-secondary btn-sm verb-filter-btn" onclick="app.filterVerbsByPattern('A-B-C', this)">Patrón A-B-C (Todos distintos)</button>
          <button class="btn btn-secondary btn-sm verb-filter-btn" onclick="app.filterVerbsByPattern('A-B-A', this)">Patrón A-B-A (Base = Participio)</button>
        </div>
        <div class="card" style="padding:0;overflow:hidden;border:1px solid var(--border-color)">
          <div style="overflow-x:auto">
            <table class="grammar-rule-table" style="margin:0">
              <thead>
                <tr>
                  <th>Forma Base (Infinitive)</th>
                  <th>Pasado Simple (Past)</th>
                  <th>Participio Pasado (Participle)</th>
                  <th>Traducción</th>
                  <th>Patrón</th>
                  <th>Audio</th>
                </tr>
              </thead>
              <tbody id="verbs-table-tbody">
                <!-- Populated by JS -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="card" style="margin-top:2rem;background:linear-gradient(135deg, rgba(0,240,255,0.1), rgba(168,85,247,0.1))">
          <h3 style="color:var(--cyan-neon);margin-bottom:0.5rem">⚡ Desafío de Conjugación de Verbos</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1rem">Pon a prueba tu memoria rápida de verbos irregulares:</p>
          <div id="verb-challenge-box">
            <button class="btn btn-primary" onclick="app.generateVerbChallenge()">🎲 Comenzar Reto Aleatorio (+15 XP)</button>
          </div>
        </div>`;
      this.filterVerbsList();
    }

    filterVerbsByPattern(pattern, btn) {
      document.querySelectorAll('.verb-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.currentVerbPatternFilter = pattern;
      this.filterVerbsList();
    }

    filterVerbsList() {
      const query = document.getElementById('verb-search-input')?.value.toLowerCase().trim() || '';
      const patternFilter = this.currentVerbPatternFilter || 'all';
      const tbody = document.getElementById('verbs-table-tbody');
      if (!tbody) return;
      const filtered = IRREGULAR_VERBS_DATA.filter(v => {
        const matchesQuery = v.base.toLowerCase().includes(query) || v.past.toLowerCase().includes(query) || v.participle.toLowerCase().includes(query) || v.trans.toLowerCase().includes(query);
        const matchesPattern = patternFilter === 'all' || v.pattern === patternFilter;
        return matchesQuery && matchesPattern;
      });
      tbody.innerHTML = filtered.map(v => `
        <tr>
          <td><strong style="color:var(--cyan-neon);font-size:1.05rem">${v.base}</strong></td>
          <td style="color:var(--text-main);font-weight:700">${v.past}</td>
          <td style="color:var(--pink-light);font-weight:700">${v.participle}</td>
          <td style="color:#cbd5e1">${v.trans}</td>
          <td><span class="badge-diff" style="font-size:0.75rem">${v.pattern}</span></td>
          <td>
            <button class="btn btn-ghost btn-sm" style="padding:0.2rem 0.5rem" onclick="app.speakVerbRow('${v.base}')">🔊</button>
          </td>
        </tr>`).join('');
    }

    speakVerbRow(base) {
      const v = IRREGULAR_VERBS_DATA.find(item => item.base === base);
      if (v) this.speakText(`${v.base}, ${v.past}, ${v.participle}`);
    }

    generateVerbChallenge() {
      const box = document.getElementById('verb-challenge-box');
      if (!box) return;
      const randomVerb = IRREGULAR_VERBS_DATA[Math.floor(Math.random() * IRREGULAR_VERBS_DATA.length)];
      const isPast = Math.random() > 0.5;
      const questionText = isPast ? `¿Cuál es el PASADO SIMPLE de '${randomVerb.base}'?` : `¿Cuál es el PARTICIPIO PASADO de '${randomVerb.base}'?`;
      const correctAnswer = isPast ? randomVerb.past : randomVerb.participle;

      const distractors = [correctAnswer];
      while (distractors.length < 3) {
        const cand = IRREGULAR_VERBS_DATA[Math.floor(Math.random() * IRREGULAR_VERBS_DATA.length)];
        const opt = isPast ? cand.past : cand.participle;
        if (!distractors.includes(opt)) distractors.push(opt);
      }
      distractors.sort(() => Math.random() - 0.5);

      box.innerHTML = `
        <div style="background:rgba(0,0,0,0.3);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.25rem">
          <p style="font-size:1.1rem;font-weight:800;color:var(--text-main);margin-bottom:1rem">${questionText}</p>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem">
            ${distractors.map(d => `<button class="mc-option" onclick="app.checkVerbChallengeAnswer(this, '${d}', '${correctAnswer}')">${d}</button>`).join('')}
          </div>
          <div id="verb-challenge-feedback"></div>
        </div>`;
    }

    checkVerbChallengeAnswer(btn, chosen, correct) {
      btn.parentElement.querySelectorAll('.mc-option').forEach(b => b.disabled = true);
      const fb = document.getElementById('verb-challenge-feedback');
      if (chosen === correct) {
        btn.classList.add('correct');
        this.addXp(15);
        this.sound.playCorrect();
        if (fb) fb.innerHTML = '<p style="color:var(--success-neon);font-weight:800">✅ ¡Brillante! Respuesta exacta. +15 XP</p><button class="btn btn-secondary btn-sm" style="margin-top:0.6rem" onclick="app.generateVerbChallenge()">🔄 Siguiente Verbo</button>';
      } else {
        btn.classList.add('incorrect');
        this.sound.playIncorrect();
        if (fb) fb.innerHTML = `<p style="color:var(--error-neon);font-weight:800">❌ La forma correcta era '${correct}'.</p><button class="btn btn-secondary btn-sm" style="margin-top:0.6rem" onclick="app.generateVerbChallenge()">🔄 Intentar Otro</button>`;
      }
    }

    // ------------------------------------------------------------------------
    // MODULE: BUSINESS & PROFESSIONAL ENGLISH
    // ------------------------------------------------------------------------
    renderBusinessModule() {
      const container = document.getElementById('business-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>💼 Business English & Comunicación Corporativa</h3>
              <p>Plantillas ejecutivas de correo electrónico, frases estratégicas para juntas y vocabulario de alto impacto para CV.</p>
            </div>
            <span class="badge-diff">B1 - C2</span>
          </div>
        </div>
        <h4 style="color:var(--cyan-neon);margin:1.5rem 0 0.85rem 0;font-weight:800">📧 PLANTILLAS FORMALES DE EMAIL COPIABLES:</h4>
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          ${BUSINESS_ENGLISH_DATA.templates.map(tpl => `
            <div class="card" style="background:rgba(13,15,28,0.95);border:1px solid var(--border-color)">
              <div class="card-header-row" style="margin-bottom:0.75rem">
                <div>
                  <h4 style="font-size:1.1rem;color:var(--text-main)">${tpl.title}</h4>
                  <span style="font-size:0.78rem;color:var(--purple-light)">Asunto sugerido: <strong>${tpl.subject}</strong></span>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="app.copyTemplateToClipboard('${tpl.id}')">📋 Copiar Plantilla</button>
              </div>
              <textarea id="tpl-text-${tpl.id}" class="text-input" rows="8" readonly style="font-family:monospace;font-size:0.85rem;line-height:1.6;background:rgba(0,0,0,0.4)">${tpl.body}</textarea>
            </div>`).join('')}
        </div>
        <h4 style="color:var(--cyan-neon);margin:2rem 0 0.85rem 0;font-weight:800">🎙️ FRASES CLAVE PARA REUNIONES Y NEGOCIACIONES:</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:1rem">
          ${BUSINESS_ENGLISH_DATA.meetingPhrases.map((mp, mIdx) => `
            <div class="card" style="padding:1rem">
              <span style="font-size:0.75rem;font-weight:700;color:var(--cyan-light);text-transform:uppercase">${mp.category}</span>
              <p style="color:var(--text-main);font-size:0.95rem;font-weight:700;margin:0.5rem 0">"${mp.phrase}"</p>
              <p style="color:var(--text-muted);font-size:0.85rem">${mp.es}</p>
              <button class="btn btn-ghost btn-sm" style="margin-top:0.6rem;padding:0.2rem 0.6rem" onclick="app.speakMeetingPhrase(${mIdx})">🔊 Escuchar pronunciación</button>
            </div>`).join('')}
        </div>
        <h4 style="color:var(--cyan-neon);margin:2rem 0 0.85rem 0;font-weight:800">🚀 VERBOS DE ACCIÓN PODEROSOS PARA RESUME / CV:</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1rem">
          ${BUSINESS_ENGLISH_DATA.actionVerbs.map(av => `
            <div class="card" style="padding:1rem;border-left:3px solid var(--cyan-neon)">
              <strong style="color:var(--cyan-neon);font-size:1.1rem">${av.verb}</strong>
              <p style="color:#cbd5e1;font-size:0.85rem;margin:0.3rem 0">${av.trans}</p>
              <p style="color:var(--text-muted);font-size:0.8rem;font-style:italic">Ejemplo: "${av.ex}"</p>
            </div>`).join('')}
        </div>`;
      this.state.stats.categoriesPracticed.business = true;
    }

    speakMeetingPhrase(idx) {
      const mp = BUSINESS_ENGLISH_DATA.meetingPhrases[idx];
      if (mp) this.speakText(mp.phrase);
    }

    copyTemplateToClipboard(id) {
      const textarea = document.getElementById(`tpl-text-${id}`);
      if (textarea) {
        navigator.clipboard.writeText(textarea.value).then(() => {
          this.sound.playCoin();
          this.showToast("📋 Plantilla copiada al portapapeles con éxito", "cyan");
        }).catch(() => {
          this.showToast("Selecciona y copia el texto manualmente", "info");
        });
      }
    }

    // ------------------------------------------------------------------------
    // MODULE: LISTENING LAB (RE-ENGINEERED COMPREHENSIVE 3-PART LAB)
    // ------------------------------------------------------------------------
    renderListeningModule() {
      const container = document.getElementById('listening-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>🎧 Laboratorio de Comprensión Auditiva y Dictado</h3>
              <p>Entrena tu oído con diálogos bilingües con velocidad regulable, dictados interactivos y pares mínimos fonéticos.</p>
            </div>
            <span class="badge-diff">A1 - C1</span>
          </div>
        </div>

        <h4 style="color:var(--cyan-neon);margin:1.5rem 0 0.85rem 0;font-weight:800">1. DIÁLOGOS DE SITUACIONES REALES (CON PREGUNTAS):</h4>
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          ${LISTENING_LAB_DATA.dialogues.map((d, dIdx) => `
            <div class="card">
              <div class="card-header-row">
                <h4 style="font-size:1.1rem;color:var(--text-main)">${d.title}</h4>
                <div style="display:flex;gap:0.5rem;align-items:center">
                  <span class="badge-diff">${d.level}</span>
                  <button class="btn btn-primary btn-sm" onclick="app.playListeningDialogue('${d.id}')">🔊 Reproducir Diálogo</button>
                </div>
              </div>
              <div id="dialogue-lines-${d.id}" class="dialogue-lines-box" style="margin:1rem 0;display:none;background:rgba(0,0,0,0.3);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-color)">
                ${d.lines.map(l => `<p style="margin-bottom:0.4rem;font-size:0.95rem"><strong>${l.speaker}:</strong> ${l.text}</p>`).join('')}
              </div>
              <button class="btn btn-ghost btn-sm" style="margin-bottom:1rem" onclick="document.getElementById('dialogue-lines-${d.id}').style.display = document.getElementById('dialogue-lines-${d.id}').style.display === 'none' ? 'block' : 'none'">👁️ Alternar Transcripción</button>
              <div style="border-top:1px solid var(--border-color);padding-top:1rem">
                <p style="font-weight:700;color:var(--cyan-neon);margin-bottom:0.6rem">Pregunta de comprensión: ${d.question.q}</p>
                <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
                  ${d.question.options.map((opt, oi) => `<button class="mc-option" onclick="app.checkListeningAnswerByIndex(this, ${dIdx}, ${oi})">${opt}</button>`).join('')}
                </div>
              </div>
            </div>`).join('')}
        </div>

        <h4 style="color:var(--cyan-neon);margin:2.5rem 0 0.85rem 0;font-weight:800">2. DICTADO INTERACTIVO (ESCUCHA Y ESCRIBE EXACTAMENTE LO QUE OYES):</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.25rem">
          ${LISTENING_LAB_DATA.dictations.map((dic, dicIdx) => `
            <div class="card">
              <div class="card-header-row" style="margin-bottom:0.75rem">
                <span class="badge-diff">${dic.level}</span>
                <button class="btn btn-secondary btn-sm" onclick="app.speakDictationItem(${dicIdx})">🔊 Escuchar Frase</button>
              </div>
              <p style="color:var(--text-muted);font-size:0.8rem;margin-bottom:0.6rem">💡 Pista: ${dic.hint}</p>
              <input type="text" id="dictation-input-${dic.id}" class="text-input" placeholder="Escribe la frase que escuchaste en inglés..." style="width:100%;margin-bottom:0.6rem">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <button class="btn btn-primary btn-sm" onclick="app.checkDictationByIndex(${dicIdx})">✅ Verificar</button>
                <button class="btn btn-ghost btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">👁️ Revelar</button>
                <span class="hidden" style="color:var(--cyan-light);font-size:0.85rem;display:none">${dic.text}</span>
              </div>
              <div id="dictation-feedback-${dic.id}" style="margin-top:0.6rem"></div>
            </div>`).join('')}
        </div>

        <h4 style="color:var(--cyan-neon);margin:2.5rem 0 0.85rem 0;font-weight:800">3. ENTRENAMIENTO DE OÍDO: PARES MÍNIMOS (MINIMAL PAIRS):</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:1rem">
          ${LISTENING_LAB_DATA.minimalPairs.map((mp, mpIdx) => `
            <div class="card">
              <div class="card-header-row" style="margin-bottom:0.6rem">
                <span style="font-weight:800;color:var(--text-main)">¿Qué palabra escuchas en la frase?</span>
                <button class="btn btn-secondary btn-sm" onclick="app.speakMinimalPairItem(${mpIdx})">🔊 Oír</button>
              </div>
              <div style="display:flex;gap:0.75rem;margin-top:0.75rem">
                <button class="mc-option" style="flex:1;text-align:center" onclick="app.checkMinimalPairChoice(this, ${mpIdx}, '${mp.wordA}')">${mp.wordA} <br><small style="color:var(--text-muted)">${mp.phoneticA}</small></button>
                <button class="mc-option" style="flex:1;text-align:center" onclick="app.checkMinimalPairChoice(this, ${mpIdx}, '${mp.wordB}')">${mp.wordB} <br><small style="color:var(--text-muted)">${mp.phoneticB}</small></button>
              </div>
            </div>`).join('')}
        </div>`;
      this.state.stats.categoriesPracticed.listening = true;
    }

    playListeningDialogue(dialogueId) {
      const d = LISTENING_LAB_DATA.dialogues.find(item => item.id === dialogueId);
      if (!d) return;
      let i = 0;
      const playStep = () => {
        if (i >= d.lines.length) return;
        this.speakText(d.lines[i].text, 0.95);
        i++;
        setTimeout(playStep, 4000);
      };
      playStep();
      this.showToast(`▶ Reproduciendo diálogo "${d.title}"...`, "cyan");
    }

    checkListeningAnswerByIndex(btn, dIdx, optIdx) {
      const d = LISTENING_LAB_DATA.dialogues[dIdx];
      if (!d) return;
      const chosen = d.question.options[optIdx];
      const correct = d.question.correct;
      btn.parentElement.querySelectorAll('.mc-option').forEach(b => b.disabled = true);
      if (chosen === correct) {
        btn.classList.add('correct');
        this.addXp(12);
        this.sound.playCorrect();
        this.showToast("✅ ¡Excelente comprensión auditiva! +12 XP", "cyan");
      } else {
        btn.classList.add('incorrect');
        this.sound.playIncorrect();
        this.showToast("❌ Respuesta incorrecta. Escucha nuevamente el audio.", "info");
      }
    }

    speakDictationItem(idx) {
      const dic = LISTENING_LAB_DATA.dictations[idx];
      if (dic) this.speakText(dic.text, 0.9);
    }

    checkDictationByIndex(idx) {
      const dic = LISTENING_LAB_DATA.dictations[idx];
      if (!dic) return;
      const input = document.getElementById(`dictation-input-${dic.id}`);
      const fb = document.getElementById(`dictation-feedback-${dic.id}`);
      if (!input || !fb) return;
      const userText = input.value.trim().toLowerCase().replace(/[.,!?;:]/g, '');
      const cleanTarget = dic.text.toLowerCase().replace(/[.,!?;:]/g, '');
      if (userText === cleanTarget) {
        fb.innerHTML = '<span style="color:var(--success-neon);font-weight:700">✅ ¡Perfecto al 100%! +15 XP</span>';
        this.addXp(15);
        this.sound.playCorrect();
      } else {
        fb.innerHTML = `<span style="color:var(--error-neon);font-size:0.85rem">❌ Casi. Texto exacto: <em>"${dic.text}"</em></span>`;
        this.sound.playIncorrect();
      }
    }

    speakMinimalPairItem(idx) {
      const mp = LISTENING_LAB_DATA.minimalPairs[idx];
      if (mp) this.speakText(mp.text);
    }

    checkMinimalPairChoice(btn, idx, chosenWord) {
      const mp = LISTENING_LAB_DATA.minimalPairs[idx];
      if (!mp) return;
      btn.parentElement.querySelectorAll('.mc-option').forEach(b => b.disabled = true);
      if (chosenWord === mp.target) {
        btn.classList.add('correct');
        this.addXp(8);
        this.sound.playCorrect();
        this.showToast("✅ ¡Oído perfecto! Identificaste el par mínimo. +8 XP", "cyan");
      } else {
        btn.classList.add('incorrect');
        this.sound.playIncorrect();
        this.showToast(`❌ Era '${mp.target}'. Presta atención a las vocales y consonantes breves.`, "info");
      }
    }

    // ------------------------------------------------------------------------
    // MODULE: WRITING STUDIO (RE-ENGINEERED 6 WORKSHOPS)
    // ------------------------------------------------------------------------
    renderWritingModule() {
      const container = document.getElementById('writing-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>✍️ Taller de Expresión Escrita (6 Niveles Guiados)</h3>
              <p>Redacta textos desde presentaciones personales hasta ensayos argumentativos y cartas de presentación con contador en vivo y respuestas modelo.</p>
            </div>
            <span class="badge-diff">A1 - C2</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:1.75rem">
          ${WRITING_WORKSHOPS_DATA.map(w => `
            <div class="card" style="border:1px solid var(--border-color)">
              <div class="card-header-row">
                <h4 style="font-size:1.15rem;color:var(--text-main)">${w.title}</h4>
                <span class="badge-diff">${w.level}</span>
              </div>
              <p style="color:#cbd5e1;font-size:0.95rem;margin:0.75rem 0;line-height:1.5">${w.prompt}</p>
              <div style="margin-bottom:0.75rem;display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center">
                <span style="font-size:0.75rem;color:var(--text-muted);font-weight:700">Palabras clave recomendadas:</span>
                ${w.keywords.map(kw => `<span class="badge-diff" style="font-size:0.72rem;background:rgba(168,85,247,0.15)">${kw}</span>`).join('')}
              </div>
              <textarea id="writing-area-${w.id}" class="text-input" rows="5" placeholder="Escribe tu redacción en inglés aquí..." oninput="app.updateWritingCount('${w.id}', ${w.minWords})"></textarea>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;flex-wrap:wrap;gap:0.5rem">
                <span id="writing-count-${w.id}" style="font-size:0.85rem;color:var(--text-muted);font-weight:700">0 / ${w.minWords} palabras mínimas</span>
                <div style="display:flex;gap:0.6rem">
                  <button class="btn btn-ghost btn-sm" onclick="app.toggleModelAnswer('${w.id}')">💡 Ver Respuesta Modelo</button>
                  <button class="btn btn-primary btn-sm" onclick="app.submitWritingWorkshop('${w.id}', ${w.minWords})">🚀 Enviar para Evaluación (+25 XP)</button>
                </div>
              </div>
              <div id="writing-model-${w.id}" class="hidden" style="display:none;margin-top:1rem;background:rgba(0,240,255,0.06);border:1px solid rgba(0,240,255,0.25);border-radius:var(--radius-md);padding:1rem">
                <h5 style="color:var(--cyan-neon);margin-bottom:0.5rem">Ejemplo de Respuesta Modelo:</h5>
                <p style="color:#e2e8f0;font-size:0.92rem;line-height:1.6;white-space:pre-line">${w.modelAnswer}</p>
              </div>
              <div id="writing-fb-${w.id}" style="margin-top:0.75rem"></div>
            </div>`).join('')}
        </div>`;
      this.state.stats.categoriesPracticed.writing = true;
    }

    updateWritingCount(id, minWords) {
      const area = document.getElementById(`writing-area-${id}`);
      const countEl = document.getElementById(`writing-count-${id}`);
      if (!area || !countEl) return;
      const words = area.value.trim().split(/\s+/).filter(w => w.length > 0).length;
      countEl.textContent = `${words} / ${minWords} palabras mínimas`;
      countEl.style.color = words >= minWords ? 'var(--success-neon)' : '#94a3b8';
    }

    toggleModelAnswer(id) {
      const el = document.getElementById(`writing-model-${id}`);
      if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
      }
    }

    submitWritingWorkshop(id, minWords) {
      const area = document.getElementById(`writing-area-${id}`);
      const fb = document.getElementById(`writing-fb-${id}`);
      if (!area || !fb) return;
      const text = area.value.trim();
      const words = text.split(/\s+/).filter(w => w.length > 0).length;
      if (words < minWords) {
        fb.innerHTML = `<span style="color:var(--error-neon);font-size:0.88rem;font-weight:700">❌ Tu texto tiene ${words} palabras. Por favor redacta al menos ${minWords} palabras para completar el taller.</span>`;
        this.sound.playIncorrect();
        return;
      }
      this.addXp(25);
      this.addCoins(10);
      this.sound.playFanfare();
      fb.innerHTML = `<div style="background:rgba(0,255,157,0.1);border:1px solid var(--success-neon);border-radius:var(--radius-md);padding:1rem;color:var(--text-main)">
        <strong style="color:var(--success-neon);font-size:1.05rem">🎉 ¡Excelente redacción completada!</strong>
        <p style="font-size:0.9rem;margin-top:0.3rem">Has redactado ${words} palabras cumpliendo los requerimientos del taller. +25 XP y +10 Aura Coins ganados.</p>
      </div>`;
      this.saveState();
    }

    // ------------------------------------------------------------------------
    // MODULE: READING COMPREHENSION (EXPANDED 8 IN-DEPTH ARTICLES)
    // ------------------------------------------------------------------------
    renderReadingModule() {
      const container = document.getElementById('reading-module-content');
      if (!container) return;
      container.innerHTML = `
        <div class="module-intro-box">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem">
            <div>
              <h3>📰 Lecturas Guiadas Extensas con Audio y Glosario (8 Artículos)</h3>
              <p>Lecturas inmersivas desde nivel A1 hasta C2 con audio completo, conteo de palabras y preguntas de comprensión.</p>
            </div>
            <span class="badge-diff">A1 - C2</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:2rem">
          ${READING_DATA.map((story, si) => `
            <div class="card" style="border:1px solid var(--border-color);padding:1.75rem">
              <div class="card-header-row" style="margin-bottom:1rem">
                <div>
                  <h3 style="font-size:1.35rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem">
                    <span>${story.icon}</span> <span>${story.title}</span>
                  </h3>
                  <div style="display:flex;gap:0.6rem;align-items:center;margin-top:0.35rem">
                    <span class="badge-diff">${story.level}</span>
                    <span style="color:var(--text-muted);font-size:0.8rem">⏱️ ${story.readTime}</span>
                    <span style="color:var(--text-muted);font-size:0.8rem">📖 ${story.wordCount} palabras</span>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="app.speakReadingStory('${story.id}')">🔊 Escuchar Lectura</button>
              </div>
              <p class="card-subtitle" style="margin-bottom:1rem;font-size:1rem;color:var(--cyan-light)">${story.excerpt}</p>
              <div style="background:rgba(0,0,0,0.35);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1.5rem;line-height:1.9;color:#e2e8f0;font-size:1rem;margin-bottom:1.25rem;white-space:pre-line">
                ${story.fullText}
              </div>
              ${story.glossary ? `
                <div style="margin-bottom:1.5rem;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.25);border-radius:var(--radius-md);padding:1rem">
                  <strong style="color:var(--purple-light);font-size:0.88rem;display:block;margin-bottom:0.5rem">📚 Glosario de Términos Clave:</strong>
                  <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                    ${story.glossary.map(g => `<span class="badge-diff" style="font-size:0.75rem;background:rgba(168,85,247,0.2)">${g}</span>`).join('')}
                  </div>
                </div>` : ''}
              <h4 style="font-size:1rem;font-weight:800;color:var(--cyan-neon);margin-bottom:1rem">📝 PREGUNTAS DE COMPRENSIÓN LECTORA:</h4>
              ${story.questions.map((q, qi) => `
                <div style="margin-bottom:1.1rem;background:rgba(0,0,0,0.2);padding:1rem;border-radius:var(--radius-md)">
                  <p style="font-weight:700;margin-bottom:0.6rem;color:var(--text-main)">${qi+1}. ${q.q}</p>
                  <div style="display:flex;flex-direction:column;gap:0.45rem">
                    ${q.options.map((opt, oi) => `<button class="mc-option" onclick="app.checkReadingAnswerByIndex(this, ${si}, ${qi}, ${oi})">${opt}</button>`).join('')}
                  </div>
                </div>`).join('')}
            </div>`).join('')}
        </div>`;
      this.state.stats.categoriesPracticed.reading = true;
    }

    speakReadingStory(storyId) {
      const story = READING_DATA.find(s => s.id === storyId);
      if (story) this.speakText(story.fullText, 0.95);
    }

    renderQuickQuizIntro() {
      document.getElementById('quick-quiz-intro-screen')?.classList.remove('hidden');
      document.getElementById('quick-quiz-play-screen')?.classList.add('hidden');
      document.getElementById('quick-quiz-results-screen')?.classList.add('hidden');
    }

    startQuickQuiz() {
      const pool = [];
      LESSONS_DATA.forEach(l => l.exercises.forEach(e => {
        if (e.type === 'multiple-choice' || e.type === 'translate') pool.push({...e, lessonTitle: l.title, cefr: l.cefr});
      }));
      const shuffled = pool.sort(() => Math.random() - 0.5);
      this.quizQuestions = shuffled.slice(0, 10);
      this.quizIndex = 0; this.quizScore = 0; this.quizMissed = [];
      document.getElementById('quick-quiz-intro-screen')?.classList.add('hidden');
      document.getElementById('quick-quiz-play-screen')?.classList.remove('hidden');
      document.getElementById('quick-quiz-results-screen')?.classList.add('hidden');
      this.renderQuickQuizQuestion();
    }

    renderQuickQuizQuestion() {
      const play = document.getElementById('quick-quiz-play-screen');
      if (!play || this.quizIndex >= this.quizQuestions.length) { this.finishQuickQuiz(); return; }
      const q = this.quizQuestions[this.quizIndex];
      play.innerHTML = `
        <div style="max-width:680px;margin:0 auto;padding:1rem">
          <div style="font-size:0.8rem;font-weight:700;color:var(--cyan-neon);margin-bottom:0.5rem">Pregunta ${this.quizIndex+1} / 10 • ${q.cefr}</div>
          <div class="progress-bar-wrap" style="margin-bottom:1.25rem"><div class="progress-bar-fill" style="width:${(this.quizIndex/10)*100}%"></div></div>
          <div class="exercise-question-text">${q.question}</div>
          <p class="exercise-subtext" style="margin-top:0.25rem">${q.instruction}</p>
          <div class="mc-options-grid" style="margin-top:1.5rem">
            ${(q.options||[]).map(opt => `<button class="mc-option" onclick="app.answerQuiz(this,'${opt.replace(/'/g,"\\'")}',${JSON.stringify(opt===q.correctAnswer)},'${(q.explanation||'').replace(/'/g,"\\'")}','${q.correctAnswer.replace(/'/g,"\\'")}')">
              ${opt}
            </button>`).join('')}
          </div>
        </div>`;
    }

    answerQuiz(el, val, isCorrect, explanation, correctAnswer) {
      document.querySelectorAll('#quick-quiz-play-screen .mc-option').forEach(b => b.disabled = true);
      if (isCorrect) {
        el.classList.add('correct'); this.quizScore++; this.sound.playCorrect();
        this.showToast(`✅ ¡Correcto! +10 XP`, "cyan"); this.addXp(10);
      } else {
        el.classList.add('incorrect'); this.sound.playIncorrect();
        this.quizMissed.push({ q: document.querySelector('.exercise-question-text')?.textContent, correct: correctAnswer });
        this.showToast(`❌ La respuesta era: ${correctAnswer}`, "info");
        document.querySelectorAll('#quick-quiz-play-screen .mc-option').forEach(b => { if (b.textContent.trim() === correctAnswer) b.classList.add('correct'); });
      }
      this.quizIndex++;
      setTimeout(() => this.renderQuickQuizQuestion(), 1200);
    }

    finishQuickQuiz() {
      document.getElementById('quick-quiz-play-screen')?.classList.add('hidden');
      document.getElementById('quick-quiz-results-screen')?.classList.remove('hidden');
      const acc = Math.round((this.quizScore / 10) * 100);
      this.addCoins(20);
      if (acc >= 80) { this.state.stats.quizzesPassed++; this.checkAchievements(); }
      this.saveState();
      const box = document.getElementById('quick-quiz-results-box');
      if (box) {
        const rec = acc < 60 ? '💡 Repasa los módulos de Vocabulario y Gramática.' : (acc < 80 ? '📈 Practica más con el Anki SRS.' : '🏆 ¡Excelente nivel! Prueba con el nivel CEFR siguiente.');
        box.innerHTML = `<div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:2.5rem;max-width:680px;margin:0 auto;text-align:center">
          <span style="font-size:4rem">${acc>=80?'🌟':'📊'}</span>
          <h2 style="font-size:2rem;color:var(--text-main);margin:0.75rem 0">Quiz Completado</h2>
          <div class="results-summary-row" style="margin:1.25rem 0">
            <div class="result-stat-pill"><span class="pill-label">Puntaje</span><span class="pill-val">${this.quizScore} / 10</span></div>
            <div class="result-stat-pill"><span class="pill-label">Precisión</span><span class="pill-val xp-val">${acc}%</span></div>
            <div class="result-stat-pill"><span class="pill-label">Recompensa</span><span class="pill-val coin-val">+20 🪙</span></div>
          </div>
          <p style="color:var(--text-muted);margin-bottom:1.5rem">${rec}</p>
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary btn-large" onclick="app.startQuickQuiz()">🔄 Reintentar</button>
            <button class="btn btn-secondary btn-large" onclick="app.navigate('dashboard')">Dashboard</button>
          </div>
        </div>`;
      }
      this.sound.playFanfare();
    }

    // ========================================================================
    // WORD BANK
    // ========================================================================
    renderWordBank() {
      const grid = document.getElementById('word-bank-grid');
      const badge = document.getElementById('word-bank-total-badge');
      const search = document.getElementById('word-bank-search')?.value.toLowerCase().trim() || '';
      const cat = document.getElementById('word-bank-category-filter')?.value || 'all';
      const lvl = document.getElementById('word-bank-level-filter')?.value || 'all';
      if (!grid) return;
      const filtered = MASTER_WORDS.filter(w => {
        const mq = w.word.toLowerCase().includes(search) || w.translation.toLowerCase().includes(search);
        const mc = cat === 'all' || w.category === cat;
        const ml = lvl === 'all' || w.level === lvl;
        return mq && mc && ml;
      });
      if (badge) badge.textContent = `${filtered.length} de ${MASTER_WORDS.length}`;
      const cefrColors = { A1:'#10b981',A2:'#06b6d4',B1:'#8b5cf6',B2:'#ec4899',C1:'#f59e0b',C2:'#ef4444' };
      grid.innerHTML = filtered.map(w => {
        const mastered = this.state.knownWords.includes(w.id);
        const col = cefrColors[w.level] || '#8b5cf6';
        return `<div class="word-bank-card">
          <div class="word-card-top">
            <span class="word-card-word">${w.word}</span>
            <div class="word-card-badges">
              <span class="badge-diff" style="background:${col}22;color:${col};border-color:${col}44">${w.level}</span>
              ${mastered ? '<span title="Aprendida">⭐</span>' : ''}
            </div>
          </div>
          <div class="word-card-trans">${w.translation}</div>
          <div class="word-card-example">"${w.example}"</div>
          <div class="word-card-footer">
            <span class="word-cat-label">${w.category}</span>
            <div style="display:flex;gap:0.35rem">
              <button class="btn-speak-small" onclick="app.speakText('${w.word.replace(/'/g,"\\'")}')">🔊</button>
              <button class="btn-speak-small" onclick="app.addSingleWordToAnki('${w.id}')">➕ Anki</button>
            </div>
          </div>
        </div>`;
      }).join('');
    }

    addSingleWordToAnki(wordId) {
      const word = MASTER_WORDS.find(w => w.id === wordId);
      if (!word) return;
      const exists = this.state.ankiDeck.some(c => c.front.toLowerCase() === word.word.toLowerCase());
      if (exists) { this.showToast(`"${word.word}" ya está en tu mazo.`, "info"); return; }
      this.state.ankiDeck.unshift({ id: `wb_${word.id}`, front: word.word, back: word.translation, level: word.level || 'A1', phonetic: word.phonetic, example: word.example, exampleEs: word.exampleEs, explanation: `Categoría: ${word.category}`, repetitions: 0, interval: 0, easeFactor: 2.5, dueDate: new Date().toISOString().split("T")[0], state: 'learning' });
      this.saveState();
      this.sound.playCoin();
      this.showToast(`🧠 "${word.word}" añadida a Anki SRS.`, "cyan");
    }

    exportWordBankCSV() {
      const rows = ['Palabra,Traducción,Categoría,Nivel,Ejemplo'].concat(
        MASTER_WORDS.map(w => `"${w.word}","${w.translation}","${w.category}","${w.level}","${w.example}"`)
      );
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'aura100_word_bank.csv';
      a.click();
      this.showToast("⬇️ Word Bank exportado como CSV.", "cyan");
    }

    // ========================================================================
    // SHOP
    // ========================================================================
    renderShop() {
      const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
      set('shop-coins-val', this.state.coins);
      set('inventory-streak-freeze', 'Tienes: ' + (this.state.inventory.streakFreeze || 0));
      set('inventory-double-xp', 'Actividades con XP doble: ' + (this.state.doubleXpActiveCount || 0));
      set('inventory-hearts-info', 'Corazones: ' + this.state.hearts + '/' + this.state.maxHearts);
      const inventory = document.getElementById('shop-inventory-summary');
      if (inventory) { const rows = [['Streak Freeze', this.state.inventory.streakFreeze || 0], ['Actividades con XP doble', this.state.doubleXpActiveCount || 0], ['XP doble pendiente', this.state.doubleXpActiveCount || 0], ['Corazones', this.state.hearts + '/' + this.state.maxHearts], ['Multiplicador de monedas', 'x' + (this.state.coinMultiplier || 1).toFixed(1)]]; inventory.innerHTML = rows.map(row => '<div class="shop-inventory-stat"><span>' + escapeHTML(String(row[0])) + '</span><strong>' + escapeHTML(String(row[1])) + '</strong></div>').join(''); }
      const cards = Array.from(document.querySelectorAll('#view-shop .shop-item-card'));
      cards.forEach(card => { const grid = card.closest('.shop-grid'); const heading = grid && grid.previousElementSibling; const label = (heading && heading.textContent || '').toLowerCase(); card.dataset.shopCategory = label.includes('anki') ? 'anki' : label.includes('premium') ? 'premium' : 'consumables'; });
      cards.forEach(card => {
        const button = card.querySelector('button[onclick*="buyShopItem"]'); if (!button) return;
        const match = (button.getAttribute('onclick') || '').match(/buyShopItem\('([^']+)'\)/); if (!match) return;
        const id = match[1]; card.dataset.shopItem = id;
        const flags = { grammarUnlock: 'premiumGrammar', pronunciationPro: 'premiumPronunciation', darkThemeUnlock: 'premiumThemes', customAvatar: 'premiumAvatars', writingPro: 'premiumWriting' };
        const owned = Boolean(flags[id] && this.state[flags[id]]);
        const capped = (id === 'extraHeart' && (this.state.maxHearts || 3) >= 10) || (id === 'heartRefill' && this.state.hearts >= this.state.maxHearts) || (id === 'coinMultiplier' && (this.state.coinMultiplier || 1) >= 3);
        const price = Number((card.querySelector('.shop-price') && card.querySelector('.shop-price').textContent || '').replace(/[^0-9]/g, ''));
        const insufficient = Number.isFinite(price) && this.state.coins < price;
        if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
        button.disabled = owned || capped || insufficient;
        button.textContent = owned ? 'Desbloqueado' : capped ? 'Límite alcanzado' : insufficient ? 'Coins insuficientes' : button.dataset.defaultLabel;
        card.classList.toggle('is-owned', owned); card.classList.toggle('is-unavailable', capped || insufficient);
        let badge = card.querySelector('.shop-owned-status');
        if (owned && !badge) { badge = document.createElement('span'); badge.className = 'shop-owned-status'; badge.textContent = 'En tu cuenta'; card.appendChild(badge); }
        if (!owned && badge) badge.remove();
      });
      const history = document.getElementById('shop-purchase-history');
      if (history) { const entries = (this.state.shopPurchaseHistory || []).slice(0, 8); history.innerHTML = entries.length ? entries.map(entry => { const card = cards.find(node => node.dataset.shopItem === entry.itemId); const title = card && card.querySelector('h4') ? card.querySelector('h4').textContent : entry.itemId; const date = new Date(entry.date); const label = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }); return '<div class="shop-history-row"><span><strong>' + escapeHTML(String(title)) + '</strong><small>' + escapeHTML(String(label)) + '</small></span><b>-' + (Number(entry.cost) || 0) + ' Coins</b></div>'; }).join('') : '<p class="shop-empty-history">Tus compras aparecerán aquí.</p>'; }
      this.renderPremiumStoreDashboard();
      this.renderLoginBonus(); this.renderWheelCooldown(); this.filterShopItems();
    }

    filterShopItems() {
      const query = (document.getElementById('shop-search') && document.getElementById('shop-search').value || '').trim().toLocaleLowerCase('es');
      const category = document.getElementById('shop-category-filter') && document.getElementById('shop-category-filter').value || 'all';
      document.querySelectorAll('#view-shop .shop-item-card').forEach(card => { const text = ((card.querySelector('h4') && card.querySelector('h4').textContent || '') + ' ' + (card.querySelector('p') && card.querySelector('p').textContent || '')).toLocaleLowerCase('es'); card.hidden = !(text.includes(query) && (category === 'all' || category === (card.dataset.shopCategory || 'other'))); });
      document.querySelectorAll('#view-shop .shop-grid').forEach(grid => { const visible = Array.from(grid.querySelectorAll('.shop-item-card')).some(card => !card.hidden); if (grid.previousElementSibling && grid.previousElementSibling.classList.contains('section-title')) grid.previousElementSibling.hidden = !visible; grid.hidden = !visible; });
    }
    renderLoginBonus() {
      const row = document.getElementById('login-days-row');
      const btn = document.getElementById('btn-claim-bonus');
      if (!row) return;
      const today = new Date().toISOString().split("T")[0];
      const canClaim = this.state.lastLoginBonus !== today;
      const streak = this.state.loginStreak || 0;
      const bonuses = [10, 15, 20, 25, 30, 40, 50];
      row.innerHTML = bonuses.map((coins, i) => {
        const claimed = i < (streak % 7);
        const isToday = i === (streak % 7) && canClaim;
        return `<div class="login-day-badge ${claimed ? 'claimed' : (isToday ? 'today' : '')}"><span>Day ${i+1}</span><span>🪙${coins}</span></div>`;
      }).join('');
      if (btn) {
        btn.disabled = !canClaim;
        btn.textContent = canClaim ? `Reclamar 🪙${bonuses[(streak % 7)]}` : '✅ Reclamado hoy';
        btn.style.opacity = canClaim ? '1' : '0.5';
      }
    }

    claimDailyBonus() {
      const today = new Date().toISOString().split("T")[0];
      if (this.state.lastLoginBonus === today) { this.showToast("Ya reclamaste tu bonus hoy.", "info"); return; }
      const bonuses = [10, 15, 20, 25, 30, 40, 50];
      const streak = this.state.loginStreak || 0;
      const amount = bonuses[streak % 7];
      this.state.loginStreak = (streak + 1);
      this.state.lastLoginBonus = today;
      this.addCoins(amount);
      this.saveState();
      this.sound.playCoin();
      this.showToast(`🎁 Bonus del día ${(streak % 7) + 1}: +${amount} monedas!`, "gold");
      this.renderLoginBonus();
    }

    renderWheelCooldown() {
      const cooldown = document.getElementById('wheel-cooldown');
      const btnSpin = document.getElementById('btn-spin-wheel');
      const btnPaid = document.getElementById('btn-spin-paid');
      const btnLabel = document.getElementById('btn-spin-label');
      if (!cooldown) return;

      const today = new Date().toISOString().split("T")[0];
      const hasFreeSpin = this.state.lastWheelSpin !== today;

      if (hasFreeSpin) {
        cooldown.textContent = '✨ ¡Giro gratis diario disponible!';
        if (btnSpin) { btnSpin.classList.remove('hidden'); btnSpin.disabled = false; btnSpin.style.opacity = '1'; }
        if (btnLabel) btnLabel.textContent = '¡Girar Gratis Hoy!';
        if (btnPaid) btnPaid.classList.add('hidden');
      } else {
        cooldown.textContent = '✅ Giro diario completado. ¡Puedes girar de nuevo por 20 Coins!';
        if (btnSpin) btnSpin.classList.add('hidden');
        if (btnPaid) {
          btnPaid.classList.remove('hidden');
          btnPaid.disabled = false;
        }
      }
    }

    spinLuckyWheel() {
      if (this.wheelIsSpinning) return;
      const today = new Date().toISOString().split("T")[0];
      if (this.state.lastWheelSpin === today) {
        this.showToast("Ya usaste tu giro gratis de hoy. Usa el botón de giro por 20 Coins.", "info");
        return;
      }
      this.executeWheelSpin(false);
    }

    spinLuckyWheelPaid() {
      if (this.wheelIsSpinning) return;
      if (this.state.coins < 20) {
        this.showToast("Necesitas al menos 20 Coins para un giro adicional.", "info");
        return;
      }
      this.state.coins -= 20;
      this.updateHeaderAndSidebarUI();
      this.executeWheelSpin(true);
    }

    executeWheelSpin(isPaid) {
      this.wheelIsSpinning = true;
      const wheel = document.getElementById('lucky-wheel-disc-wrap');
      const needle = document.querySelector('.svg-wheel-pointer');
      const prizeBanner = document.getElementById('wheel-prize-banner');
      if (prizeBanner) prizeBanner.classList.add('hidden');

      const btnSpin = document.getElementById('btn-spin-wheel');
      const btnPaid = document.getElementById('btn-spin-paid');
      if (btnSpin) btnSpin.disabled = true;
      if (btnPaid) btnPaid.disabled = true;

      // 6 Wheel Slices
      // Slice 0 (mid: 30°): +50 Coins
      // Slice 1 (mid: 90°): +100 XP
      // Slice 2 (mid: 150°): +3 Vidas (Full)
      // Slice 3 (mid: 210°): Streak Freeze
      // Slice 4 (mid: 270°): +25 Coins
      // Slice 5 (mid: 330°): +50 XP
      const sliceRewards = [
        { title: "+50 Aura Coins", sub: "¡Monedas de oro acreditadas a tu cuenta!", fn: () => { this.addCoins(50); return "+50 Coins"; } },
        { title: "+100 XP de Energía", sub: "¡Gran impulso para subir de nivel!", fn: () => { this.addXp(100); return "+100 XP"; } },
        { title: "+3 Corazones (Vidas Llenas)", sub: "¡Tus corazones se han recargado al máximo!", fn: () => { this.state.hearts = this.state.maxHearts; return "Corazones Llenos"; } },
        { title: "Escudo Streak Freeze", sub: "¡Protección para tu racha de días activada!", fn: () => { this.state.inventory.streakFreeze++; return "Streak Freeze"; } },
        { title: "+25 Aura Coins", sub: "¡Monedas de plata añadidas al balance!", fn: () => { this.addCoins(25); return "+25 Coins"; } },
        { title: "+50 XP Cuántico", sub: "¡Puntos de experiencia acelerada!", fn: () => { this.addXp(50); return "+50 XP"; } }
      ];

      const chosenIndex = Math.floor(Math.random() * sliceRewards.length);
      const chosenReward = sliceRewards[chosenIndex];

      // Exact mathematical alignment to chosen slice center
      const sliceMidAngle = chosenIndex * 60 + 30;
      const extraSpins = 5 + Math.floor(Math.random() * 2); // 5 or 6 full rotations
      if (!this.wheelAccumulatedRot) this.wheelAccumulatedRot = 0;
      
      // Calculate rotation that lands sliceMidAngle under the 0deg top pointer
      const targetAngleWithinTurn = (360 - sliceMidAngle) % 360;
      const currentMod = this.wheelAccumulatedRot % 360;
      let diff = targetAngleWithinTurn - currentMod;
      if (diff < 0) diff += 360;
      this.wheelAccumulatedRot += (extraSpins * 360) + diff;

      if (wheel) {
        wheel.style.transform = `rotate(${this.wheelAccumulatedRot}deg)`;
      }

      // Ticking needle sound effect
      let tickCount = 0;
      const totalTicks = 24;
      const tickInterval = setInterval(() => {
        tickCount++;
        this.sound.playClick();
        if (needle) {
          needle.classList.add('ticking');
          setTimeout(() => needle.classList.remove('ticking'), 60);
        }
        if (tickCount >= totalTicks) clearInterval(tickInterval);
      }, 160);

      const today = new Date().toISOString().split("T")[0];
      if (!isPaid) this.state.lastWheelSpin = today;
      this.state.wheelSpins = (this.state.wheelSpins || 0) + 1;

      setTimeout(() => {
        this.wheelIsSpinning = false;
        const prizeMsg = chosenReward.fn();
        this.sound.playFanfare();

        if (prizeBanner) {
          const txt = document.getElementById('wheel-prize-text');
          const sub = document.getElementById('wheel-prize-sub');
          if (txt) txt.textContent = `¡Ganaste: ${chosenReward.title}!`;
          if (sub) sub.textContent = chosenReward.sub;
          prizeBanner.classList.remove('hidden');
        }

        this.showToast(`🎰 ¡Ruleta Cuántica: ${prizeMsg}!`, "gold");
        this.saveState();
        this.updateHeaderAndSidebarUI();
        this.renderWheelCooldown();
        this.checkAchievements();
      }, 4600);
    }

    premiumFeatureFlags() {
      return { grammar: 'premiumGrammar', pronunciation: 'premiumPronunciation', themes: 'premiumThemes', avatars: 'premiumAvatars', writing: 'premiumWriting' };
    }

    renderPremiumStoreDashboard() {
      const flags = this.premiumFeatureFlags();
      document.querySelectorAll('#view-shop .premium-open-feature').forEach(button => {
        const owned = Boolean(this.state[flags[button.dataset.feature]]);
        button.disabled = !owned;
        button.textContent = owned ? 'Abrir apartado' : 'Disponible tras desbloquear';
      });
      const meter = document.getElementById('premium-multiplier-meter');
      if (meter) {
        const value = Math.max(1, Math.min(3, Number(this.state.coinMultiplier) || 1));
        meter.innerHTML = '<strong>Multiplicador actual: x' + value.toFixed(1) + '</strong><div class="premium-meter-track"><span style="width:' + ((value / 3) * 100) + '%"></span></div><small>' + (value >= 3 ? 'Nivel máximo alcanzado' : 'Siguiente mejora: +0.5x por 150 Coins') + '</small>';
      }
    }

    openPremiumFeature(feature) {
      const flags = this.premiumFeatureFlags();
      if (feature !== 'multiplier' && !this.state[flags[feature]]) {
        this.showToast('Primero debes desbloquear este apartado.', 'info');
        return;
      }
      const workspace = document.getElementById('premium-feature-workspace');
      if (!workspace) return;
      workspace.classList.remove('hidden');
      const renderers = {
        grammar: () => this.renderPremiumGrammar(),
        pronunciation: () => this.renderPremiumPronunciation(),
        themes: () => this.renderPremiumThemes(),
        avatars: () => this.renderPremiumAvatars(),
        writing: () => this.renderPremiumWriting(),
        multiplier: () => this.renderPremiumMultiplier()
      };
      if (!renderers[feature]) return;
      renderers[feature]();
      workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderPremiumGrammar() {
      const workspace = document.getElementById('premium-feature-workspace');
      const questions = [
        { q: 'Rarely ___ such a convincing argument.', options: ['I have heard', 'have I heard', 'I heard'], answer: 1, why: 'Rarely al inicio exige inversión: auxiliar + sujeto + verbo.' },
        { q: 'The committee recommended that he ___ immediately.', options: ['resigns', 'resigned', 'resign'], answer: 2, why: 'En el subjuntivo mandativo se utiliza la forma base del verbo.' },
        { q: 'Not until the final chapter ___ the motive.', options: ['we understood', 'did we understand', 'we had understood'], answer: 1, why: 'Not until al inicio requiere inversión con did + sujeto + forma base.' },
        { q: 'The proposal, ___ carefully, could solve the issue.', options: ['if implementing', 'if implemented', 'if it implement'], answer: 1, why: 'Es una cláusula condicional reducida en voz pasiva.' },
        { q: 'So complex ___ that several experts disagreed.', options: ['the issue was', 'was the issue', 'the issue had'], answer: 1, why: 'So + adjetivo al inicio provoca inversión sujeto-verbo.' },
        { q: 'She would rather you ___ the matter confidential.', options: ['keep', 'kept', 'to keep'], answer: 1, why: 'Would rather + sujeto diferente suele ir seguido de pasado simple.' }
      ];
      this.premiumGrammarQuestions = questions;
      this.premiumGrammarAnswers = {};
      workspace.innerHTML = '<div class="premium-workspace-heading"><div><span class="premium-product-index">GRAMMAR PRO / C2 LAB</span><h3>Laboratorio de gramática avanzada</h3><p>Seis preguntas con corrección explicada. Responde todas para calcular tu resultado.</p></div><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'premium-feature-workspace\').classList.add(\'hidden\')">Cerrar</button></div><div class="premium-grammar-list">' + questions.map((q,i) => '<article class="premium-exercise"><strong>' + (i+1) + '. ' + escapeHTML(q.q) + '</strong><div class="premium-options">' + q.options.map((o,j) => '<button type="button" class="btn btn-secondary btn-sm" data-premium-q="' + i + '" data-premium-a="' + j + '" onclick="app.answerPremiumGrammar(' + i + ',' + j + ')">' + escapeHTML(o) + '</button>').join('') + '</div><p class="premium-explanation hidden" id="premium-grammar-explain-' + i + '"></p></article>').join('') + '</div><div class="premium-workspace-footer"><button class="btn btn-primary" onclick="app.finishPremiumGrammar()">Comprobar respuestas</button><strong id="premium-grammar-score" aria-live="polite">0 / 6 respondidas</strong></div>';
    }

    answerPremiumGrammar(questionIndex, answerIndex) {
      if (!this.premiumGrammarQuestions || !this.premiumGrammarQuestions[questionIndex]) return;
      this.premiumGrammarAnswers[questionIndex] = answerIndex;
      document.querySelectorAll('[data-premium-q="' + questionIndex + '"]').forEach(button => {
        button.classList.toggle('btn-primary', Number(button.dataset.premiumA) === answerIndex);
        button.classList.toggle('btn-secondary', Number(button.dataset.premiumA) !== answerIndex);
      });
      const score = document.getElementById('premium-grammar-score');
      if (score) score.textContent = Object.keys(this.premiumGrammarAnswers).length + ' / 6 respondidas';
    }

    finishPremiumGrammar() {
      if (!this.premiumGrammarQuestions || Object.keys(this.premiumGrammarAnswers || {}).length !== 6) {
        this.showToast('Responde las seis preguntas antes de comprobar.', 'info');
        return;
      }
      let score = 0;
      this.premiumGrammarQuestions.forEach((q,i) => {
        const correct = this.premiumGrammarAnswers[i] === q.answer;
        if (correct) score++;
        const explanation = document.getElementById('premium-grammar-explain-' + i);
        if (explanation) { explanation.classList.remove('hidden'); explanation.textContent = (correct ? 'Correcto. ' : 'Respuesta correcta: ' + q.options[q.answer] + '. ') + q.why; }
        document.querySelectorAll('[data-premium-q="' + i + '"]').forEach(button => { button.disabled = true; });
      });
      const result = document.getElementById('premium-grammar-score');
      if (result) result.textContent = 'Resultado: ' + score + ' / 6 (' + Math.round(score / 6 * 100) + '%)';
      this.state.premiumGrammarAttempts = (this.state.premiumGrammarAttempts || 0) + 1;
      this.state.premiumGrammarBest = Math.max(this.state.premiumGrammarBest || 0, score);
      this.saveState();
    }

    renderPremiumPronunciation() {
      const workspace = document.getElementById('premium-feature-workspace');
      const phrases = [
        ['Had I known about the delay, I would have left earlier.', 'Inversión condicional'],
        ['The findings were anything but conclusive.', 'Énfasis y matiz'],
        ['What I find particularly compelling is the evidence.', 'Cleft sentence'],
        ['The proposal was met with considerable scepticism.', 'Vocabulario académico'],
        ['Notwithstanding the challenges, the project was completed.', 'Conectores formales'],
        ['It is imperative that every participant be informed.', 'Subjuntivo formal'],
        ['Little did they realise how significant the change would be.', 'Inversión narrativa'],
        ['The implications should not be underestimated.', 'Pasiva y registro']
      ];
      this.premiumPronunciationPhrases = phrases;
      this.premiumPronunciationIndex = 0;
      this.renderPremiumPronunciationPhrase();
      workspace.innerHTML = '<div class="premium-workspace-heading"><div><span class="premium-product-index">PRONUNCIATION PRO / STUDIO</span><h3>Entrenamiento de pronunciación C1</h3><p>Escucha el modelo y graba tu intento. La comparación mide similitud de transcripción, no acento ni calidad fonética.</p></div><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'premium-feature-workspace\').classList.add(\'hidden\')">Cerrar</button></div><div class="premium-pronunciation-card"><span id="premium-pronunciation-topic" class="premium-product-index"></span><p id="premium-pronunciation-phrase"></p><div class="premium-pronunciation-controls"><button class="btn btn-secondary" onclick="app.speakPremiumPronunciation()">Escuchar modelo</button><button class="btn btn-primary" id="premium-pronunciation-record" onclick="app.recordPremiumPronunciation()">Grabar intento</button><button class="btn btn-secondary" onclick="app.nextPremiumPronunciation()">Siguiente frase</button></div><p id="premium-pronunciation-status" aria-live="polite">Listo para practicar.</p><div id="premium-pronunciation-result" class="premium-result-line"></div></div><p class="academy-disclaimer">El reconocimiento depende del navegador y del micrófono. No se almacena audio ni se presenta la transcripción como una evaluación oficial de pronunciación.</p>';
      this.renderPremiumPronunciationPhrase();
    }

    renderPremiumPronunciationPhrase() {
      const phrase = this.premiumPronunciationPhrases?.[this.premiumPronunciationIndex];
      if (!phrase) return;
      const topic = document.getElementById('premium-pronunciation-topic');
      const text = document.getElementById('premium-pronunciation-phrase');
      const status = document.getElementById('premium-pronunciation-status');
      const result = document.getElementById('premium-pronunciation-result');
      if (topic) topic.textContent = phrase[1] + ' · ' + (this.premiumPronunciationIndex + 1) + '/' + this.premiumPronunciationPhrases.length;
      if (text) text.textContent = phrase[0];
      if (status) status.textContent = 'Listo para practicar.';
      if (result) result.textContent = '';
    }

    speakPremiumPronunciation() {
      const phrase = this.premiumPronunciationPhrases?.[this.premiumPronunciationIndex];
      if (phrase) this.speakText(phrase[0], 0.78);
    }

    recordPremiumPronunciation() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const status = document.getElementById('premium-pronunciation-status');
      const button = document.getElementById('premium-pronunciation-record');
      const phrase = this.premiumPronunciationPhrases?.[this.premiumPronunciationIndex]?.[0];
      if (!phrase) return;
      if (!SpeechRecognition) {
        if (status) status.textContent = 'Este navegador no ofrece reconocimiento de voz. Prueba con Chrome o Edge y concede permiso al micrófono.';
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      if (button) button.disabled = true;
      if (status) status.textContent = 'Escuchando...';
      recognition.onresult = event => {
        const transcript = String(event.results?.[0]?.[0]?.transcript || '').trim();
        const normalise = value => value.toLowerCase().replace(/[^a-z0-9\s]/g,'').split(/\s+/).filter(Boolean);
        const expected = normalise(phrase);
        const actual = normalise(transcript);
        const matched = expected.filter(word => actual.includes(word)).length;
        const similarity = expected.length ? Math.round(matched / expected.length * 100) : 0;
        const result = document.getElementById('premium-pronunciation-result');
        if (result) result.textContent = 'Transcripción: "' + transcript + '" · Coincidencia de palabras: ' + similarity + '%.';
        if (status) status.textContent = 'Intento registrado. Revisa las palabras omitidas o reconocidas de forma distinta.';
        this.state.premiumPronunciationAttempts = (this.state.premiumPronunciationAttempts || 0) + 1;
        this.saveState();
      };
      recognition.onerror = event => { if (status) status.textContent = 'No se pudo reconocer la voz (' + event.error + '). Comprueba los permisos del micrófono e inténtalo de nuevo.'; };
      recognition.onend = () => { if (button) button.disabled = false; };
      try { recognition.start(); } catch (error) { if (button) button.disabled = false; if (status) status.textContent = 'No se pudo iniciar el micrófono. Vuelve a intentarlo.'; }
    }

    nextPremiumPronunciation() {
      this.premiumPronunciationIndex = (this.premiumPronunciationIndex + 1) % this.premiumPronunciationPhrases.length;
      this.renderPremiumPronunciationPhrase();
    }

    renderPremiumThemes() {
      const workspace = document.getElementById('premium-feature-workspace');
      const skins = [{id:'obsidian-gold',name:'Obsidian Gold',desc:'Grafito y oro cálido',a:'#e7b85c',b:'#f0d28b',c:'#b87935'},{id:'arctic-mint',name:'Arctic Mint',desc:'Azul frío y menta',a:'#56d6c2',b:'#8bc8ff',c:'#d0f5ed'},{id:'sakura-pulse',name:'Sakura Pulse',desc:'Rosa cereza y violeta',a:'#f28ab2',b:'#b89aff',c:'#ffd1e2'}];
      workspace.innerHTML = '<div class="premium-workspace-heading"><div><span class="premium-product-index">THEMES / ACCENT SKINS</span><h3>Paletas exclusivas</h3><p>Elige una paleta de acento. Se conserva tu tema principal y la selección queda guardada.</p></div><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'premium-feature-workspace\').classList.add(\'hidden\')">Cerrar</button></div><div class="premium-skin-grid">' + skins.map(skin => '<button class="premium-skin-option ' + (this.state.premiumThemeSkin === skin.id ? 'active' : '') + '" onclick="app.setPremiumThemeSkin(\'' + skin.id + '\')"><span class="premium-skin-swatches"><i style="background:' + skin.a + '"></i><i style="background:' + skin.b + '"></i><i style="background:' + skin.c + '"></i></span><strong>' + skin.name + '</strong><small>' + skin.desc + '</small><span>' + (this.state.premiumThemeSkin === skin.id ? 'Activa' : 'Aplicar paleta') + '</span></button>').join('') + '<button class="btn btn-secondary btn-sm" onclick="app.setPremiumThemeSkin(\'\')">Restaurar acentos originales</button></div>';
    }

    setPremiumThemeSkin(skin) {
      const allowed = ['obsidian-gold','arctic-mint','sakura-pulse'];
      if (skin && !allowed.includes(skin)) return;
      if (!this.state.premiumThemes) { this.showToast('Desbloquea Temas Premium para usar estas paletas.', 'info'); return; }
      document.body.classList.remove('premium-skin-obsidian-gold','premium-skin-arctic-mint','premium-skin-sakura-pulse');
      if (skin) document.body.classList.add('premium-skin-' + skin);
      this.state.premiumThemeSkin = skin || '';
      this.saveState();
      this.renderPremiumThemes();
      this.showToast(skin ? 'Paleta premium aplicada.' : 'Acentos originales restaurados.', 'cyan');
    }

    renderPremiumAvatars() {
      const extras = ['🐙','🦈','🦩','🦚','🦖','🐙','🪼','🦕'];
      const workspace = document.getElementById('premium-feature-workspace');
      workspace.innerHTML = '<div class="premium-workspace-heading"><div><span class="premium-product-index">AVATAR COLLECTION</span><h3>Avatares exclusivos</h3><p>Selecciona uno para actualizar tu perfil al instante.</p></div><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'premium-feature-workspace\').classList.add(\'hidden\')">Cerrar</button></div><div class="premium-avatar-grid">' + extras.map(emoji => '<button type="button" class="premium-avatar-choice ' + (this.state.avatar === emoji ? 'active' : '') + '" aria-label="Elegir avatar ' + emoji + '" onclick="app.setAvatar(\'' + emoji + '\')">' + emoji + '</button>').join('') + '</div>';
    }

    premiumWritingWorkshops() {
      return [
        {type:'Essay',title:'Technology and education',prompt:'Some people believe that technology has made education more effective, while others argue that it has created new distractions. Discuss both views and give your opinion.'},
        {type:'Report',title:'Improving the school library',prompt:'Your school wants to make its library more useful for students. Write a report describing the current situation and recommending two improvements.'},
        {type:'Proposal',title:'A student-led language club',prompt:'Your school is considering a student-led language club. Write a proposal explaining the activities it should offer and how students would benefit.'},
        {type:'Review',title:'A learning resource you recommend',prompt:'Write a review of a book, website or application that has helped you learn something. Explain its strengths and weaknesses and say who would benefit from it.'},
        {type:'Article',title:'Learning beyond the classroom',prompt:'Write an article for your school website explaining why learning outside the classroom can be valuable and suggesting practical ways to do it.'},
        {type:'Formal email',title:'Requesting an academic opportunity',prompt:'Write a formal email to a programme coordinator requesting information about an academic opportunity and explaining why you are interested.'}
      ];
    }

    renderPremiumWriting() {
      const workspace = document.getElementById('premium-feature-workspace');
      const workshops = this.premiumWritingWorkshops();
      workspace.innerHTML = '<div class="premium-workspace-heading"><div><span class="premium-product-index">WRITING PRO / SIX WORKSHOPS</span><h3>Centro de redacción</h3><p>Elige una tarea, redacta tu respuesta y solicita feedback formativo de IA.</p></div><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'premium-feature-workspace\').classList.add(\'hidden\')">Cerrar</button></div><div class="premium-writing-workshop-grid">' + workshops.map((w,i) => '<button class="premium-writing-workshop" onclick="app.selectPremiumWritingWorkshop(' + i + ')"><span>' + w.type + '</span><strong>' + w.title + '</strong><small>' + (i+1) + ' / 6 · Abrir tarea</small></button>').join('') + '</div><div id="premium-writing-task" class="premium-writing-task"><p>Selecciona uno de los seis talleres para ver las instrucciones.</p></div>';
    }

    selectPremiumWritingWorkshop(index) {
      const workshop = this.premiumWritingWorkshops()[index];
      if (!workshop) return;
      this.currentPremiumWritingWorkshop = index;
      const task = document.getElementById('premium-writing-task');
      if (!task) return;
      task.innerHTML = '<span class="premium-product-index">' + workshop.type + '</span><h4>' + workshop.title + '</h4><p>' + workshop.prompt + '</p><label for="premium-writing-response">Tu respuesta (120-220 palabras)</label><textarea id="premium-writing-response" class="text-input" rows="9" maxlength="5000" placeholder="Escribe tu texto en inglés..."></textarea><div class="premium-writing-actions"><span id="premium-writing-count">0 palabras</span><button class="btn btn-primary" id="premium-writing-submit" onclick="app.evaluatePremiumWriting()">Evaluar con IA</button></div><div id="premium-writing-feedback" aria-live="polite"></div>';
      const input = document.getElementById('premium-writing-response');
      input?.addEventListener('input', () => { const count = input.value.trim() ? input.value.trim().split(/\s+/).length : 0; const label = document.getElementById('premium-writing-count'); if (label) label.textContent = count + ' palabras'; });
    }

    async evaluatePremiumWriting() {
      const input = document.getElementById('premium-writing-response');
      const feedback = document.getElementById('premium-writing-feedback');
      const button = document.getElementById('premium-writing-submit');
      const text = String(input?.value || '').trim();
      const words = text ? text.split(/\s+/).length : 0;
      if (words < 120 || words > 220) { if (feedback) feedback.textContent = 'La tarea requiere entre 120 y 220 palabras. Tu texto tiene ' + words + '.'; return; }
      if (this.premiumWritingBusy) return;
      if (!global.Aura100AI || typeof global.Aura100AI.evaluateWriting !== 'function') { if (feedback) feedback.textContent = 'El servicio de evaluación no está disponible. Comprueba la conexión e inténtalo más tarde.'; return; }
      this.premiumWritingBusy = true;
      if (button) button.disabled = true;
      if (feedback) feedback.textContent = 'Evaluando organización, vocabulario, gramática y cumplimiento de la tarea...';
      const workshop = this.premiumWritingWorkshops()[this.currentPremiumWritingWorkshop];
      try {
        const evaluation = await global.Aura100AI.evaluateWriting({ text, taskType: workshop.type.toLowerCase(), level: 'C1', taskPrompt: '[WRITING_PRO_WORKSHOP] ' + workshop.prompt + ' Target length: 120-220 words.', language: 'es' });
        if (feedback) feedback.innerHTML = '<div class="premium-writing-feedback"><strong>Resultado formativo: ' + escapeHTML(String(evaluation.overallScore ?? '—')) + '%</strong><p>' + escapeHTML(String(evaluation.summary || 'Evaluación completada.')) + '</p><ul>' + (evaluation.nextSteps || []).map(step => '<li>' + escapeHTML(String(step)) + '</li>').join('') + '</ul><small>Evaluación orientativa generada por IA; no es una calificación oficial.</small></div>';
        this.state.premiumWritingSubmissions = (this.state.premiumWritingSubmissions || 0) + 1;
        this.saveState();
      } catch (error) {
        if (feedback) feedback.textContent = 'No se pudo evaluar el texto. Comprueba la conexión con la IA e inténtalo de nuevo.';
      } finally {
        this.premiumWritingBusy = false;
        const currentButton = document.getElementById('premium-writing-submit');
        if (currentButton) currentButton.disabled = false;
      }
    }

    renderPremiumMultiplier() {
      const workspace = document.getElementById('premium-feature-workspace');
      const value = Math.max(1, Math.min(3, Number(this.state.coinMultiplier) || 1));
      workspace.innerHTML = '<div class="premium-workspace-heading"><div><span class="premium-product-index">COIN MULTIPLIER / UPGRADES</span><h3>Mejora tus recompensas</h3><p>El multiplicador se aplica automáticamente a las monedas ganadas mediante actividades y objetivos.</p></div><button class="btn btn-secondary btn-sm" onclick="document.getElementById(\'premium-feature-workspace\').classList.add(\'hidden\')">Cerrar</button></div><div class="premium-multiplier-detail"><strong>x' + value.toFixed(1) + '</strong><span>de x3.0 máximo</span><div class="premium-meter-track"><span style="width:' + (value/3*100) + '%"></span></div><p>' + (value >= 3 ? 'Has alcanzado el multiplicador máximo.' : 'Cada mejora cuesta 150 Coins y aumenta el multiplicador en x0.5.') + '</p><button class="btn btn-primary" onclick="app.buyShopItem(\'coinMultiplier\')" ' + (value >= 3 ? 'disabled' : '') + '>Comprar mejora · 150 Coins</button></div>';
    }

    buyShopItem(itemId) {
      this.sound.playClick();
      const permanent = { grammarUnlock: 'premiumGrammar', pronunciationPro: 'premiumPronunciation', darkThemeUnlock: 'premiumThemes', customAvatar: 'premiumAvatars', writingPro: 'premiumWriting' };
      if (permanent[itemId] && this.state[permanent[itemId]]) { this.showToast('Este artículo ya está desbloqueado.', 'info'); return; }
      if (itemId === 'extraHeart' && (this.state.maxHearts || 3) >= 10) { this.showToast('Has alcanzado el máximo de 10 corazones.', 'info'); return; }
      if (itemId === 'heartRefill' && this.state.hearts >= this.state.maxHearts) { this.showToast('Ya tienes todos los corazones.', 'info'); return; }
      if (itemId === 'coinMultiplier' && (this.state.coinMultiplier || 1) >= 3) { this.showToast('El multiplicador máximo es x3.', 'info'); return; }
      const buy = (cost, apply, message, type = 'cyan', premium = false) => {
        if (this.state.coins < cost) { this.showToast('Necesitas ' + cost + ' Coins. Tu saldo es ' + this.state.coins + '.', 'info'); return false; }
        this.state.coins -= cost; this.state.purchases = (this.state.purchases || 0) + 1; apply();
        if (premium) this.state.premiumUnlocked = (this.state.premiumUnlocked || 0) + 1;
        if (!Array.isArray(this.state.shopPurchaseHistory)) this.state.shopPurchaseHistory = [];
        this.state.shopPurchaseHistory.unshift({ itemId: itemId, cost: cost, date: new Date().toISOString(), balanceAfter: this.state.coins });
        this.state.shopPurchaseHistory = this.state.shopPurchaseHistory.slice(0, 20);
        if (message) this.showToast(message, type); this.sound.playCoin(); this.checkAchievements(); return true;
      };
      const actions = {
        streakFreeze: () => buy(50, () => { this.state.inventory.streakFreeze = (this.state.inventory.streakFreeze || 0) + 1; }, 'Streak Freeze añadido al inventario.', 'purple'),
        doubleXp: () => buy(40, () => { this.state.doubleXpActiveCount = (this.state.doubleXpActiveCount || 0) + 2; }, 'Double XP activado para 2 actividades.', 'gold'),
        heartRefill: () => buy(30, () => { this.state.hearts = this.state.maxHearts; }, 'Corazones recargados.', 'purple'),
        extraHeart: () => buy(80, () => { this.state.maxHearts = Math.min(10, (this.state.maxHearts || 3) + 1); this.state.hearts = this.state.maxHearts; }, 'Capacidad de corazones aumentada.', 'purple'),
        mysteryBox: () => buy(60, () => { const r = Math.random(); if (r < 0.4) { this.addXp(150); this.addCoins(50); this.showToast('Caja sorpresa: +150 XP y +50 monedas.', 'gold'); } else if (r < 0.7) { this.state.inventory.streakFreeze = (this.state.inventory.streakFreeze || 0) + 1; this.showToast('Caja sorpresa: recibiste Streak Freeze.', 'purple'); } else { this.state.doubleXpActiveCount = (this.state.doubleXpActiveCount || 0) + 5; this.showToast('Caja sorpresa: Double XP para 5 actividades.', 'gold'); } this.sound.playFanfare(); }, '', false),
        xpBoost: () => buy(80, () => { this.state.doubleXpActiveCount = (this.state.doubleXpActiveCount || 0) + 10; }, 'XP x2 activado para 10 actividades.', 'gold'),
        ankiPack: () => buy(45, () => this.addAnkiPowerPack('basic'), 'Pack Anki B1-B2 añadido.'),
        ankiPackAdvanced: () => buy(90, () => this.addAnkiPowerPack('advanced'), 'Pack Anki C1-C2 añadido.'),
        ankiPackIdioms: () => buy(70, () => this.addAnkiPowerPack('idioms'), 'Pack de idioms añadido.'),
        grammarUnlock: () => buy(100, () => { this.state.premiumGrammar = true; }, 'Grammar Pro desbloqueado.', 'gold', true),
        pronunciationPro: () => buy(75, () => { this.state.premiumPronunciation = true; }, 'Pronunciation Pro desbloqueado.', 'purple', true),
        darkThemeUnlock: () => buy(50, () => { this.state.premiumThemes = true; }, 'Temas premium desbloqueados.', 'cyan', true),
        coinMultiplier: () => buy(150, () => { this.state.coinMultiplier = Math.min(3, (this.state.coinMultiplier || 1) + 0.5); }, 'Multiplicador de monedas actualizado.', 'gold', true),
        customAvatar: () => buy(60, () => { this.state.premiumAvatars = true; }, 'Avatares premium desbloqueados.', 'purple', true),
        writingPro: () => buy(85, () => { this.state.premiumWriting = true; }, 'Writing Pro desbloqueado.', 'cyan', true)
      };
      if (!Object.prototype.hasOwnProperty.call(actions, itemId)) { this.showToast('Artículo no válido.', 'info'); return; }
      const purchased = actions[itemId](); if (!purchased) return;
      this.saveState(); this.renderShop();
      const purchasedFeature = { grammarUnlock: 'grammar', pronunciationPro: 'pronunciation', darkThemeUnlock: 'themes', customAvatar: 'avatars', writingPro: 'writing', coinMultiplier: 'multiplier' }[itemId];
      if (purchasedFeature) this.openPremiumFeature(purchasedFeature);
    }
    addAnkiPowerPack(packType = 'basic') {
      const PACKS = {
        basic: [
          { f: "Tenacity",      b: "Tenacidad",           l: "B2", ph: "/tɪˈnæsɪti/",     ex: "Her tenacity earned her the promotion.",         exEs: "Su tenacidad le valió el ascenso." },
          { f: "Eloquent",      b: "Elocuente",           l: "C1", ph: "/ˈeləkwənt/",     ex: "The eloquent speech moved everyone.",             exEs: "El discurso elocuente emocionó a todos." },
          { f: "Ambiguous",     b: "Ambiguo",             l: "B2", ph: "/æmˈbɪɡjuəs/",   ex: "His answer was deliberately ambiguous.",          exEs: "Su respuesta fue deliberadamente ambigua." },
          { f: "Pragmatic",     b: "Pragmático",          l: "C1", ph: "/præɡˈmætɪk/",   ex: "A pragmatic approach solves real problems.",      exEs: "Un enfoque pragmático resuelve problemas reales." },
          { f: "Diligent",      b: "Diligente",           l: "B1", ph: "/ˈdɪlɪdʒənt/",   ex: "Diligent students always make progress.",         exEs: "Los estudiantes diligentes siempre progresan." },
          { f: "Meticulous",    b: "Meticuloso",          l: "B2", ph: "/mɪˈtɪkjʊləs/",  ex: "She is meticulous about her work.",               exEs: "Ella es meticulosa con su trabajo." },
          { f: "Proficient",    b: "Competente / Hábil",  l: "B2", ph: "/prəˈfɪʃənt/",   ex: "He became proficient in English in two years.",   exEs: "Se volvió competente en inglés en dos años." },
          { f: "Assertive",     b: "Asertivo",            l: "B2", ph: "/əˈsɜːrtɪv/",    ex: "Being assertive helps in negotiations.",           exEs: "Ser asertivo ayuda en las negociaciones." },
          { f: "Versatile",     b: "Versátil",            l: "B1", ph: "/ˈvɜːrsətl/",    ex: "A versatile employee adapts quickly.",             exEs: "Un empleado versátil se adapta rápido." },
          { f: "Compelling",    b: "Convincente / Apremiante", l: "C1", ph: "/kəmˈpelɪŋ/", ex: "The documentary makes a compelling case.",    exEs: "El documental presenta un caso convincente." }
        ],
        advanced: [
          { f: "Ephemeral",     b: "Efímero",             l: "C2", ph: "/ɪˈfɛmərəl/",    ex: "Fame can be ephemeral.",                          exEs: "La fama puede ser efímera." },
          { f: "Ubiquitous",    b: "Omnipresente",        l: "C1", ph: "/juːˈbɪkwɪtəs/", ex: "Technology is ubiquitous in modern life.",        exEs: "La tecnología es omnipresente en la vida moderna." },
          { f: "Recalcitrant",  b: "Recalcitrante",       l: "C2", ph: "/rɪˈkælsɪtrənt/",ex: "The recalcitrant student refused to cooperate.",  exEs: "El alumno recalcitrante se negó a cooperar." },
          { f: "Equivocal",     b: "Equívoco / Ambiguo",  l: "C2", ph: "/ɪˈkwɪvəkəl/",  ex: "His equivocal response confused everyone.",       exEs: "Su respuesta equívoca confundió a todos." },
          { f: "Perspicacious", b: "Perspicaz",           l: "C2", ph: "/ˌpɜːrspɪˈkeɪʃəs/",ex: "A perspicacious analyst reads between the lines.", exEs: "Un analista perspicaz lee entre líneas." },
          { f: "Pedantic",      b: "Pedante",             l: "C1", ph: "/pɪˈdæntɪk/",    ex: "His pedantic corrections annoyed everyone.",       exEs: "Sus correcciones pedantes molestaron a todos." },
          { f: "Idiosyncratic", b: "Idiosincrásico",      l: "C2", ph: "/ˌɪdiəsɪŋˈkrætɪk/",ex: "Her idiosyncratic style is unmistakable.",     exEs: "Su estilo idiosincrásico es inconfundible." },
          { f: "Sycophantic",   b: "Adulador / Servil",   l: "C2", ph: "/ˌsɪkəˈfæntɪk/", ex: "Sycophantic praise is never genuine.",            exEs: "El elogio adulador nunca es genuino." },
          { f: "Laconic",       b: "Lacónico / Conciso",  l: "C1", ph: "/ləˈkɒnɪk/",     ex: "His laconic reply was just one word.",             exEs: "Su respuesta lacónica fue de una sola palabra." },
          { f: "Magnanimous",   b: "Magnánimo / Generoso",l: "C1", ph: "/mæɡˈnænɪməs/",  ex: "She was magnanimous in defeat.",                  exEs: "Fue magnánima en la derrota." }
        ],
        idioms: [
          { f: "Hit the nail on the head",    b: "Dar en el clavo",         l: "B2", ph: "/hɪt ðə neɪl ɒn ðə hɛd/",    ex: "You hit the nail on the head with that observation.",   exEs: "Diste en el clavo con esa observación." },
          { f: "Bite the bullet",             b: "Morder el tiro / Aguantar",l: "B2", ph: "/baɪt ðə ˈbʊlɪt/",           ex: "Just bite the bullet and finish it.",                   exEs: "Simplemente aguanta y termínalo." },
          { f: "Spill the beans",             b: "Revelar el secreto",       l: "B1", ph: "/spɪl ðə biːnz/",             ex: "Don't spill the beans about the surprise party.",       exEs: "No reveles el secreto de la fiesta sorpresa." },
          { f: "Under the weather",           b: "Estar pachuco / Indispuesto",l:"A2",ph: "/ˈʌndər ðə ˈweðər/",         ex: "I'm feeling under the weather today.",                  exEs: "Hoy me siento un poco indispuesto." },
          { f: "Break a leg",                 b: "Mucha suerte",             l: "A2", ph: "/breɪk ə leɡ/",               ex: "Break a leg at the audition!",                          exEs: "¡Mucha suerte en la audición!" },
          { f: "Once in a blue moon",         b: "De vez en cuando / Raramente",l:"B1",ph:"/wʌns ɪn ə bluː muːn/",    ex: "I only eat junk food once in a blue moon.",             exEs: "Rara vez como comida basura." },
          { f: "Cost an arm and a leg",       b: "Costar un riñón",          l: "B1", ph: "/kɒst ən ɑːrm ænd ə leɡ/",   ex: "That car costs an arm and a leg.",                      exEs: "Ese coche cuesta un riñón." },
          { f: "Let the cat out of the bag",  b: "Descubrir el pastel",      l: "B2", ph: "/let ðə kæt aʊt əv ðə bæɡ/", ex: "He let the cat out of the bag about the merger.",       exEs: "Descubrió el pastel sobre la fusión." },
          { f: "Bite off more than you can chew",b:"Abarcar más de lo que se puede",l:"B2",ph:"/baɪt ɒf mɔːr ðæn juː kæn tʃuː/",ex:"Don't bite off more than you can chew.",exEs:"No abarcues más de lo que puedes." },
          { f: "Hit the sack",                b: "Irse a dormir",             l: "A2", ph: "/hɪt ðə sæk/",               ex: "I'm exhausted, I need to hit the sack.",                exEs: "Estoy agotado, me voy a dormir." }
        ]
      };
      const pack = PACKS[packType] || PACKS.basic;
      let added = 0;
      pack.forEach(w => {
        if (!this.state.ankiDeck.some(c => c.front === w.f)) {
          this.state.ankiDeck.unshift({
            id: `pp_${packType}_${Date.now()}_${w.f}`,
            front: w.f, back: w.b, level: w.l,
            phonetic: w.ph || '',
            example: w.ex || `${w.f} is widely used in English.`,
            exampleEs: w.exEs || `${w.b} se usa mucho en inglés.`,
            explanation: `🎴 Premium Pack: ${packType.charAt(0).toUpperCase()+packType.slice(1)}`,
            tag: packType === 'idioms' ? 'Idiom 🗣️' : (w.l.startsWith('C') ? 'Advanced 🔥' : 'Premium ⭐'),
            repetitions: 0, interval: 0, easeFactor: 2.5,
            dueDate: new Date().toISOString().split('T')[0], state: 'new'
          });
          added++;
        }
      });
      this.saveState();
      return added;
    }

    // ========================================================================
    // ACHIEVEMENTS
    // ========================================================================
    checkAchievements() {
      // Extra auto-checks for XP, coins, and new types
      const { xp, coins } = this.state;
      const totalCoins = this.state.coinsEarnedTotal || coins;
      const now = new Date(); const h = now.getHours();
      if (xp >= 1000)   this._unlockIfNew('ach_xp_1000');
      if (xp >= 5000)   this._unlockIfNew('ach_xp_5000');
      if (xp >= 10000)  this._unlockIfNew('ach_xp_10000');
      if (coins >= 500) this._unlockIfNew('ach_coin_saver');
      if (totalCoins >= 1000) this._unlockIfNew('ach_coin_1000');
      if ((this.state.purchases||0) >= 1)  this._unlockIfNew('ach_first_purchase');
      if ((this.state.purchases||0) >= 5)  this._unlockIfNew('ach_shopaholic');
      if ((this.state.premiumUnlocked||0) >= 1) this._unlockIfNew('ach_premium_member');
      if ((this.state.writingSubmitted||0) >= 1) this._unlockIfNew('ach_first_writing');
      if ((this.state.writingSubmitted||0) >= 5) this._unlockIfNew('ach_writing_5');
      if ((this.state.grammarUnitsCompleted||0) >= 1)  this._unlockIfNew('ach_grammar_first');
      if ((this.state.grammarUnitsCompleted||0) >= 10) this._unlockIfNew('ach_grammar_10');
      if ((this.state.grammarUnitsCompleted||0) >= 25) this._unlockIfNew('ach_grammar_master');
      if (h >= 23 || h < 2)  this._unlockIfNew('ach_night_owl');
      if (h >= 5 && h < 7)   this._unlockIfNew('ach_early_bird');
      if ((this.state.stats?.quizzesPassed||0) >= 10) this._unlockIfNew('ach_quiz_10');
      if ((this.state.stats?.quizzesPassed||0) >= 25) this._unlockIfNew('ach_quiz_25');
      if (this.state.unlockedAchievements.length >= 25) this._unlockIfNew('ach_completionist');
      ACHIEVEMENTS_DATA.forEach(ach => {
        if (this.state.unlockedAchievements.includes(ach.id)) return;
        let val = 0;
        if (ach.type === 'lessons') val = this.state.completedLessons.length;
        if (ach.type === 'words') val = this.state.knownWords.length;
        if (ach.type === 'streak') val = this.state.streak;
        if (ach.type === 'perfect') val = this.state.stats.perfectLessonsCount;
        if (ach.type === 'anki_reviews') val = this.state.ankiReviewsLifetime || 0;
        if (ach.type === 'video_watched') val = this.state.stats.videosWatched || 0;
        if (ach.type === 'target_b2') val = ['B2','C1','C2'].includes(this.state.targetCefr) ? 1 : 0;
        if (ach.type === 'sentences_mined') val = this.state.sentencesMined || 0;
        if (ach.type === 'chats_completed') val = this.state.stats.chatsCompleted || 0;
        if (ach.type === 'pronunciation_correct') val = this.state.stats.pronunciationCorrect || 0;
        if (ach.type === 'wheel_spun') val = this.state.wheelSpins || 0;
        if (val >= ach.target) {
          this.state.unlockedAchievements.push(ach.id);
          this.addCoins(20);
          this.showToast(`🏆 ¡Logro desbloqueado: "${ach.title}"! +20 monedas`, "gold");
          this.sound.playFanfare();
        }
      });
      this.saveState();
    }

    renderAchievements() {
      const grid = document.getElementById('achievements-grid');
      const unlocked = document.getElementById('achievements-unlocked-count');
      const total = document.getElementById('achievements-total-count');
      if (total) total.textContent = ACHIEVEMENTS_DATA.length;
      const count = this.state.unlockedAchievements.length;
      if (unlocked) unlocked.textContent = count;
      if (!grid) return;
      grid.innerHTML = ACHIEVEMENTS_DATA.map(ach => {
        const done = this.state.unlockedAchievements.includes(ach.id);
        return `<div class="achievement-card ${done ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${ach.icon}</div>
          <div class="achievement-body">
            <h4>${ach.title}</h4>
            <p>${ach.desc}</p>
            ${done ? '<div class="achievement-unlocked-badge">✅ DESBLOQUEADO</div>' : '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem">🔒 Bloqueado</div>'}
          </div>
        </div>`;
      }).join('');
    }

    // ========================================================================
    // PROGRESS
    // ========================================================================
    renderProgress() {
      const container = document.getElementById('progress-content');
      if (!container) return;
      const { xp, streak, bestStreak, completedLessons, knownWords } = this.state;
      const acc = this.state.stats.totalAnswers > 0 ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalAnswers) * 100) : 0;
      const li = this.getLevelInfo();

      // Weekly XP data (last 7 days)
      const today = new Date();
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today); d.setDate(today.getDate() - i);
        const key = d.toISOString().split("T")[0];
        days.push({ label: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()], xp: (this.state.stats.weeklyXp || {})[key] || 0 });
      }
      const maxXp = Math.max(...days.map(d => d.xp), 10);

      // Accuracy ring
      const circumference = 2 * Math.PI * 52;
      const offset = circumference * (1 - acc / 100);

      container.innerHTML = `
        <div class="progress-stats-grid">
          <div class="progress-big-card"><div class="progress-big-icon">⚡</div><div class="progress-big-val">${xp}</div><div class="progress-big-lbl">Total XP</div></div>
          <div class="progress-big-card"><div class="progress-big-icon">🎖️</div><div class="progress-big-val">Level ${li.level}</div><div class="progress-big-lbl">${li.name}</div></div>
          <div class="progress-big-card"><div class="progress-big-icon">🔥</div><div class="progress-big-val">${streak}</div><div class="progress-big-lbl">Racha Actual</div></div>
          <div class="progress-big-card"><div class="progress-big-icon">⭐</div><div class="progress-big-val">${bestStreak}</div><div class="progress-big-lbl">Mejor Racha</div></div>
          <div class="progress-big-card"><div class="progress-big-icon">📚</div><div class="progress-big-val">${completedLessons.length}</div><div class="progress-big-lbl">Lecciones</div></div>
          <div class="progress-big-card"><div class="progress-big-icon">📖</div><div class="progress-big-val">${knownWords.length}</div><div class="progress-big-lbl">Palabras</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 280px;gap:1.25rem;margin-bottom:1.5rem">
          <div class="xp-bar-chart-wrap">
            <h3>📊 XP de los Últimos 7 Días</h3>
            <div class="bar-chart">
              ${days.map(d => `<div class="bar-col">
                <div class="bar-value">${d.xp}</div>
                <div class="bar-fill" style="height:${d.xp > 0 ? Math.max(8, Math.round((d.xp / maxXp) * 120)) : 4}px"></div>
                <div class="bar-label">${d.label}</div>
              </div>`).join('')}
            </div>
          </div>
          <div class="accuracy-ring-wrap">
            <h3>🎯 Precisión</h3>
            <svg class="accuracy-svg-ring" viewBox="0 0 120 120">
              <circle class="ring-bg" cx="60" cy="60" r="52" stroke-width="12"/>
              <circle class="ring-fg" cx="60" cy="60" r="52" stroke-width="12"
                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                transform="rotate(-90 60 60)"/>
              <text class="ring-text-pct" x="60" y="56" text-anchor="middle" dominant-baseline="middle">${acc}%</text>
              <text class="ring-text-lbl" x="60" y="70" text-anchor="middle">PRECISIÓN</text>
            </svg>
            <p style="font-size:0.82rem;color:var(--text-muted);text-align:center">${this.state.stats.totalAnswers} respuestas totales</p>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom:1rem">🧠 Habilidades Practicadas</h3>
          <div style="display:flex;flex-direction:column;gap:0.65rem">
            ${Object.entries(this.state.stats.categoriesPracticed || {}).map(([key, done]) => `
              <div style="display:flex;align-items:center;gap:0.75rem">
                <span style="font-size:0.88rem;font-weight:700;color:var(--text-main);width:100px;text-transform:capitalize">${key}</span>
                <div style="flex:1;height:8px;background:rgba(255,255,255,0.08);border-radius:100px;overflow:hidden">
                  <div style="height:100%;width:${done?'100%':'0%'};background:linear-gradient(90deg,var(--purple-neon),var(--cyan-neon));transition:width 0.8s ease;border-radius:100px"></div>
                </div>
                <span style="font-size:0.78rem;color:${done?'var(--success-neon)':'#94a3b8'}">${done?'✅ Practicado':'⏳ Pendiente'}</span>
              </div>`).join('')}
          </div>
        </div>`;
    }

    // ========================================================================
    // PROFILE
    // ========================================================================
    renderProfile() {
      const container = document.getElementById('profile-content');
      if (!container) return;
      const { username, avatar, xp, streak, bestStreak, coins, hearts, maxHearts, targetCefr, completedLessons, knownWords, unlockedAchievements } = this.state;
      const li = this.getLevelInfo();
      const acc = this.state.stats.totalAnswers > 0 ? Math.round((this.state.stats.correctAnswers / this.state.stats.totalAnswers) * 100) : 0;
      const avatarEmojis = ['🦊','🐼','🦁','🐯','🦅','🐸','🦝','🐺','🦋','🐉','🦄','⚡','🌟','🎯','🔮','🚀', ...(this.state.premiumAvatars ? ['🐙','🦈','🦩','🦚','🦖','🪼','🦕','🦥'] : [])];

      container.innerHTML = `
        <div class="card" style="text-align:center">
          <button type="button" class="profile-avatar-trigger" onclick="document.getElementById('modal-avatar-picker')?.classList.remove('hidden')" aria-label="Cambiar avatar" title="Cambiar avatar">${escapeHTML(avatar)}</button>
          <h2 style="font-size:1.8rem;font-weight:900;color:var(--text-main);margin-bottom:0.25rem">${escapeHTML(username)}</h2>
          <span class="badge-diff" style="font-size:0.88rem">${targetCefr} Track</span>
          <p style="color:var(--text-muted);margin-top:0.5rem;font-size:0.85rem">Toca el avatar para cambiarlo</p>
          <div class="card" style="margin-top:1.25rem;text-align:left">
            <label style="font-size:0.82rem;color:var(--text-muted);font-weight:700;display:block;margin-bottom:0.4rem">✏️ Cambiar Username:</label>
            <div style="display:flex;gap:0.5rem">
              <input type="text" id="profile-username-input" class="text-input" value="${escapeHTML(username)}" placeholder="Nuevo username..." maxlength="24" autocomplete="nickname" aria-label="Nuevo nombre de usuario" style="flex:1">
              <button class="btn btn-primary btn-sm" onclick="app.saveUsername()">Guardar</button>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <div class="card">
            <h3 style="margin-bottom:1rem">📊 Estadísticas</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
              ${[['XP Total', xp],['Nivel Actual', `${li.level} — ${li.name}`],['Racha Activa', `${streak} días`],['Récord Racha', `${bestStreak} días`],['Aura Coins', coins],['Corazones', `${hearts}/${maxHearts}`],['Lecciones', completedLessons.length],['Palabras', knownWords.length],['Logros', unlockedAchievements.length],['Precisión', `${acc}%`]].map(([l,v]) => `<div style="background:rgba(0,0,0,0.2);border-radius:var(--radius-sm);padding:0.65rem"><div style="font-size:0.78rem;color:var(--text-muted);font-weight:700">${l}</div><div style="font-size:1.1rem;font-weight:800;color:var(--text-main);margin-top:0.15rem">${v}</div></div>`).join('')}
            </div>
          </div>
          <div class="card">
            <h3 style="margin-bottom:1rem">🎭 Logros Desbloqueados (${unlockedAchievements.length}/${ACHIEVEMENTS_DATA.length})</h3>
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
              ${ACHIEVEMENTS_DATA.filter(a => unlockedAchievements.includes(a.id)).map(a => `<span title="${a.title}" style="font-size:1.8rem">${a.icon}</span>`).join('') || '<p style="color:var(--text-muted);font-size:0.88rem">Completa actividades para desbloquear logros.</p>'}
            </div>
          </div>
                    <div class="card">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
              <h3 style="margin-bottom:0">🎨 Estilo Visual (Figma 4 Temas)</h3>
              <span class="badge-mini-glow" style="font-size:0.75rem">${THEMES[this.state.theme || 'cyberpunk']?.badge || 'ACTIVO'}</span>
            </div>
            <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:1rem">
              Personaliza el sistema de diseño de la academia con los 4 estilos de Figma. El cambio se guarda automáticamente.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:0.85rem">
              ${Object.values(THEMES).map(t => {
                const isAct = (this.state.theme || 'cyberpunk') === t.id;
                return `
                  <div class="theme-card-item ${isAct ? 'active' : ''}" onclick="app.setTheme('${t.id}')" style="padding:0.95rem">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
                      <span style="font-weight:800;font-size:0.92rem">${t.name}</span>
                      <span class="theme-badge" style="background:${t.accent1};color:#fff;font-size:0.65rem">${t.badge}</span>
                    </div>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.6rem;font-weight:600">${t.subtitle}</div>
                    <div style="height:32px;border-radius:var(--radius-sm);background:${t.previewBg};border:1px solid rgba(0,0,0,0.15);display:flex;align-items:center;padding:0 0.6rem;gap:0.4rem;margin-bottom:0.65rem">
                      <span style="width:12px;height:12px;border-radius:50%;background:${t.accent1};display:inline-block"></span>
                      <span style="width:12px;height:12px;border-radius:50%;background:${t.accent2};display:inline-block"></span>
                      <span style="width:12px;height:12px;border-radius:50%;background:${t.accent3};display:inline-block"></span>
                      <span style="font-size:0.68rem;font-weight:700;color:${t.accent1};margin-left:auto">${t.font}</span>
                    </div>
                    <button class="btn ${isAct ? 'btn-primary' : 'btn-secondary'} btn-sm btn-block" style="pointer-events:none;font-size:0.75rem">
                      ${isAct ? '✓ Estilo Activo' : 'Elegir Estilo'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="card">
            <h3 style="margin-bottom:0.75rem">⚠️ Zona de Peligro</h3>
            <button class="btn btn-ghost btn-sm" onclick="app.confirmResetProgress()" style="border-color:var(--error-red);color:var(--error-red)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-btn-icon"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Reiniciar Todo el Progreso</button>
          </div>
        </div>`;

      // Populate avatar picker
      const avatarGrid = document.getElementById('avatar-grid');
      if (avatarGrid) {
        avatarGrid.innerHTML = avatarEmojis.map(e => `<button type="button" class="avatar-btn" aria-label="Elegir avatar ${escapeHTML(e)}" onclick="app.setAvatar('${e}')">${escapeHTML(e)}</button>`).join('');
      }
    }

    saveUsername() {
      const input = document.getElementById('profile-username-input');
      const val = String(input?.value ?? '').replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 24);
      if (!val || val.length < 2) { this.showToast("El nombre debe tener al menos 2 caracteres.", "info"); return; }
      if (input) input.value = val;
      this.state.username = val;
      this.saveState();
      this.renderProfile();
      this.showToast("Nombre de usuario actualizado.", "purple");
    }

    setAvatar(emoji) {
      const allowedAvatars = ['🦊','🐼','🦁','🐯','🦅','🐸','🦝','🐺','🦋','🐉','🦄','⚡','🌟','🎯','🔮','🚀', ...(this.state.premiumAvatars ? ['🐙','🦈','🦩','🦚','🦖','🪼','🦕','🦥'] : [])];
      if (!allowedAvatars.includes(emoji)) return;
      if (['🐙','🦈','🦩','🦚','🦖','🪼','🦕','🦥'].includes(emoji) && !this.state.premiumAvatars) { this.showToast('Este avatar pertenece a la colección Premium.', 'info'); return; }
      this.state.avatar = emoji;
      this.saveState();
      document.getElementById('modal-avatar-picker')?.classList.add('hidden');
      this.renderProfile();
      this.showToast(`Avatar actualizado a ${emoji}`, "purple");
    }

    confirmResetProgress() {
      if (confirm("⚠️ ¿Estás seguro de que deseas reiniciar TODO tu progreso?")) {
        localStorage.removeItem(this.storageKey);
        this.state = this.getInitialState();
        this.saveState();
        this.showToast("Progreso reiniciado.", "info");
        this.navigate('dashboard');
        this.renderAll();
      }
    }

    // ========================================================================
    // WEB SPEECH API (TTS)
    // ========================================================================
    speakText(text, rate = 1.0, lang = 'en-US') {
      if (!window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang; utter.rate = rate; utter.pitch = 1.0; utter.volume = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find(v => v.lang.startsWith(lang) && !v.localService);
      const enLocal = voices.find(v => v.lang.startsWith(lang));
      utter.voice = en || enLocal || null;
      window.speechSynthesis.speak(utter);
    }

    // ========================================================================
    // CONFETTI
    // ========================================================================
    launchConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      const colors = ['#8b5cf6','#00f0ff','#ff2a85','#00ff9d','#ffb800','#fff'];
      const particles = Array.from({length:70}, () => ({
        x: canvas.width/2, y: canvas.height/2,
        vx: (Math.random()-0.5)*14, vy: (Math.random()-0.8)*16,
        size: Math.random()*8+3, color: colors[Math.floor(Math.random()*colors.length)],
        rotation: Math.random()*360, vRot: (Math.random()-0.5)*12, opacity: 1
      }));
      let f = 0;
      const render = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p => {
          p.x+=p.vx; p.y+=p.vy; p.vy+=0.4; p.rotation+=p.vRot; p.opacity-=0.014;
          ctx.save(); ctx.globalAlpha=Math.max(0,p.opacity); ctx.translate(p.x,p.y); ctx.rotate(p.rotation*Math.PI/180); ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size); ctx.restore();
        });
        f++;
        if (f < 85) requestAnimationFrame(render); else ctx.clearRect(0,0,canvas.width,canvas.height);
      };
      render();
    }

    // ========================================================================
    // TOASTS
    // ========================================================================
    showToast(message, type = "purple") {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      const icons = { purple:'⚡', cyan:'🌐', gold:'🔥', orange:'🔥', info:'💡' };
      toast.style.borderColor = { cyan:'var(--cyan-neon)', gold:'var(--gold-neon)', info:'rgba(255,255,255,0.2)' }[type] || 'var(--purple-neon)';
    toast.innerHTML = `<span>${icons[type] || '⚡'}</span><span>${escapeHTML(message)}</span>`;
      container.appendChild(toast);
      setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateY(12px)'; toast.style.transition='all 0.3s ease'; setTimeout(() => toast.remove(), 350); }, 3500);
    }

    // ========================================================================
    // INIT EVENTS & RENDER ALL
    // ========================================================================
    initEvents() {
      const btnAudio = document.getElementById('btn-toggle-audio');
      const iconOn = document.getElementById('icon-sound-on');
      const iconOff = document.getElementById('icon-sound-off');
      if (btnAudio) btnAudio.onclick = () => {
        this.sound.enabled = !this.sound.enabled;
        this.state.soundEnabled = this.sound.enabled;
        this.saveState();
        if (iconOn) iconOn.classList.toggle('hidden', !this.sound.enabled);
        if (iconOff) iconOff.classList.toggle('hidden', this.sound.enabled);
        this.showToast(this.sound.enabled ? "Sonido activado" : "Sonido silenciado", "info");
      };
      document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => this.toggleSidebar());

      // Keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.toggleSidebar(false);
        const eventTarget = e.target;
        const isEditing = eventTarget instanceof HTMLElement && (
          eventTarget.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(eventTarget.tagName)
        );
        if (isEditing) return;
        if (this.activeView === 'anki-srs') {
          const reviewVisible = !document.getElementById('anki-review-screen')?.classList.contains('hidden');
          if (!reviewVisible) return;
          if (e.code === 'Space') {
            const showBtn = document.getElementById('btn-anki-show-answer');
            if (showBtn && !showBtn.classList.contains('hidden')) { e.preventDefault(); this.revealAnkiAnswer(); }
          } else if (['Digit1','Digit2','Digit3','Digit4'].includes(e.code)) {
            const grades = document.getElementById('anki-grades-grid');
            if (grades && !grades.classList.contains('hidden')) { e.preventDefault(); this.gradeAnkiCard(parseInt(e.code.replace('Digit',''),10)); }
          }
        }
        if (this.activeView === 'video-lab') {
          if (e.code === 'ArrowRight') { e.preventDefault(); this.nextSubtitleLine(); }
          if (e.code === 'ArrowLeft') { e.preventDefault(); this.prevSubtitleLine(); }
          if (e.code === 'KeyR') { e.preventDefault(); this.repeatCurrentSubtitleLine(); }
        }
      });

      // Init stars background
      this.initStars();
      this.applyTheme(this.state.theme || "cyberpunk");

      // Restore sound state
      if (!this.state.soundEnabled) {
        this.sound.enabled = false;
        if (iconOn) iconOn.classList.add('hidden');
        if (iconOff) iconOff.classList.remove('hidden');
      }
    }

    renderAll() {
      this.updateHeaderAndSidebarUI();
      this.renderDashboard();
    }
  }

  // ==========================================================================
  // 5. BOOTSTRAP
  // ==========================================================================
  window.app = new Aura100App();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { window.app.initEvents(); window.app.renderAll(); });
  } else {
    window.app.initEvents();
    window.app.renderAll();
  }

})();
