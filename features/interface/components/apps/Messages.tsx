'use client'

import { useState, useRef, useEffect } from 'react'
import { usePuzzle } from '@interface/contexts/PuzzleContext'

interface Message {
  from: 'me' | 'them'
  text?: string
  at: string
  pinned?: boolean
  voiceNote?: { label: string; letter: string }
  image?: string
}

interface Contact {
  id: string
  name: string
  avatar: string
  messages: Message[]
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'mama',
    name: 'Mama',
    avatar: '👩',
    messages: [
      { from: 'them', text: 'Wie geht es dir heute?', at: 'Freitag 18:00' },
      { from: 'me', text: 'Alles gut, danke!', at: 'Freitag 18:15' },
      { from: 'them', text: 'Hast du schon die neuen Fotos gesehen?', at: 'Freitag 18:20' },
      { from: 'me', text: 'Noch nicht, schick mal!', at: 'Freitag 18:22' },
      { from: 'them', image: '/media/images/DSC00587.jpg', at: 'Freitag 18:23' },
      { from: 'me', text: 'Oh nice!', at: 'Freitag 18:25' },
      { from: 'them', image: '/media/images/PHOTO-2026-01-22-12-37-02 2.jpg', at: 'Freitag 18:26' },
      { from: 'them', text: 'Das war gestern', at: 'Freitag 18:27' },
      { from: 'me', text: 'Sieht gut aus!', at: 'Freitag 18:28' },
      { from: 'them', image: '/media/images/PHOTO-2026-01-22-12-37-02 3.jpg', at: 'Freitag 18:30' },
      { from: 'them', text: 'Und das hier ist total unscharf geworden 😅', at: 'Freitag 18:31' },
      { from: 'me', text: 'Haha ja, sieht man', at: 'Freitag 18:32' },
      { from: 'them', text: 'Aber trotzdem cool oder?', at: 'Freitag 18:33' },
      { from: 'me', text: 'Definitiv!', at: 'Freitag 18:34' },
      { from: 'them', text: 'Hast du auch genug gegessen?', at: 'Freitag 19:10' },
      { from: 'me', text: 'Ja Mama 😊', at: 'Freitag 19:12' },
      { from: 'them', text: 'Und schläfst du genug?', at: 'Freitag 19:15' },
      { from: 'me', text: 'Ja, alles gut', at: 'Freitag 19:16' },
      { from: 'them', text: 'Tut mir leid wegen unserem Streit, Lisa.', at: 'Freitag 19:20' },
      { from: 'me', text: 'Ist ok.', at: 'Freitag 19:25' },
      { from: 'them', text: 'Ich hätte anders reagieren sollen.', at: 'Freitag 19:30' },
      { from: 'me', text: 'Wir können später nochmal drüber reden.', at: 'Freitag 19:35' },
      { from: 'them', text: 'Danke Schatz ❤️', at: 'Freitag 19:40' },

      // Sonntag Abend: letzte Nachrichten (Mama -> Lisa reagiert nicht mehr)
      { from: 'them', text: 'Hey… alles okay?', at: 'Sonntag 20:15' },
      { from: 'them', text: 'Bitte sag kurz was.', at: 'Sonntag 20:18' },
      { from: 'them', text: 'Tut mir leid wegen unserem Streit.', at: 'Sonntag 20:22' },
      { from: 'them', text: 'Ich mache mir Sorgen.', at: 'Sonntag 20:30' },
    ],
  },

  {
    id: 'stefan',
    name: 'Stefan Redaktion',
    avatar: '👨',
    messages: [
      { from: 'them', text: 'Hey, hast du Zeit für ein kurzes Gespräch?', at: 'Samstag 19:00' },
      { from: 'me', text: "Ja klar, worum geht's?", at: 'Samstag 19:05' },
      { from: 'them', text: 'Über das Projekt, das wir besprochen haben.', at: 'Samstag 19:10' },
      { from: 'me', text: 'Ah ja, können wir morgen drüber reden?', at: 'Samstag 19:15' },
      { from: 'them', text: 'Perfekt!', at: 'Samstag 19:20' },
      { from: 'them', text: 'Ich hab noch ein paar Fragen zur Quelle', at: 'Samstag 19:25' },
      { from: 'me', text: 'Ok, schreib mir einfach', at: 'Samstag 19:30' },
      { from: 'them', text: 'Können wir uns auch persönlich treffen?', at: 'Samstag 19:35' },
      { from: 'me', text: 'Ja klar, wann?', at: 'Samstag 19:40' },
      { from: 'them', text: 'Morgen Nachmittag?', at: 'Samstag 19:42' },
      { from: 'me', text: 'Passt!', at: 'Samstag 19:45' },
    ],
  },

  {
    id: 'uni-gruppe',
    name: 'Uni Gruppe',
    avatar: '👥',
    messages: [
      { from: 'them', text: 'Wer kann heute zur Vorlesung?', at: 'Samstag 08:00' },
      { from: 'me', text: 'Ich bin dabei', at: 'Samstag 08:15' },
      { from: 'them', text: 'Super!', at: 'Samstag 08:20' },
      { from: 'them', text: 'Vergesst nicht die Abgabe!', at: 'Samstag 10:00' },
      { from: 'me', text: 'Danke für die Erinnerung', at: 'Samstag 10:05' },
      { from: 'them', text: 'Kann jemand die Notizen teilen?', at: 'Samstag 14:30' },
      { from: 'me', text: 'Ich schicke sie gleich', at: 'Samstag 14:35' },
      { from: 'them', text: 'Danke!', at: 'Samstag 14:36' },
      { from: 'them', text: 'Wer macht die Präsentation?', at: 'Samstag 15:00' },
      { from: 'me', text: 'Ich kann', at: 'Samstag 15:05' },
      { from: 'them', text: 'Perfekt, danke!', at: 'Samstag 15:06' },
    ],
  },

  {
    id: 'redaktion',
    name: 'Redaktion',
    avatar: '📰',
    messages: [
      { from: 'them', text: 'Deadline ist morgen!', at: 'Samstag 13:00' },
      { from: 'me', text: 'Ich bin dran.', at: 'Samstag 13:15' },
      { from: 'them', text: 'Gut, danke!', at: 'Samstag 13:20' },
      { from: 'them', text: 'Artikel bitte bis 18 Uhr.', at: 'Samstag 16:00' },
      { from: 'me', text: 'Wird gemacht 👍', at: 'Samstag 16:05' },
      { from: 'them', text: 'Vergiss nicht die Quellen anzugeben', at: 'Samstag 16:10' },
      { from: 'me', text: 'Natürlich nicht', at: 'Samstag 16:12' },
      { from: 'them', text: 'Und bitte nicht zu spät abgeben 😅', at: 'Samstag 16:15' },
      { from: 'me', text: 'Haha ok', at: 'Samstag 16:16' },
      { from: 'them', text: 'Danke!', at: 'Samstag 16:17' },
    ],
  },

  {
    id: 'chefredaktion',
    name: 'Chefredaktion',
    avatar: '📝',
    messages: [
      { from: 'them', text: 'Guten Morgen', at: 'Samstag 08:30' },
      { from: 'me', text: 'Guten Morgen!', at: 'Samstag 08:32' },
      { from: 'them', text: 'Kannst du heute noch den Artikel überprüfen?', at: 'Samstag 08:35' },
      { from: 'me', text: 'Ja klar, mache ich', at: 'Samstag 08:40' },
      { from: 'them', text: 'Danke. Wichtig: Faktencheck nicht vergessen.', at: 'Samstag 08:42' },
      { from: 'me', text: 'Natürlich', at: 'Samstag 08:43' },
      { from: 'them', text: 'Gut.', at: 'Samstag 08:45' },
      { from: 'them', text: 'Melde dich wenn Fragen sind.', at: 'Samstag 08:46' },
      { from: 'me', text: 'Mach ich, danke!', at: 'Samstag 08:47' },
    ],
  },

  {
    id: 'quelle1',
    name: 'Quelle1',
    avatar: '🔒',
    messages: [
      { from: 'them', text: 'Hallo', at: 'Samstag 20:00' },
      { from: 'me', text: 'Hi, wer ist das?', at: 'Samstag 20:05' },
      { from: 'them', text: 'Ich habe Informationen für dich.', at: 'Samstag 20:10' },
      { from: 'me', text: 'Welche?', at: 'Samstag 20:12' },
      { from: 'them', text: 'Nicht hier. Treffen?', at: 'Samstag 20:15' },
      { from: 'me', text: 'Wann und wo?', at: 'Samstag 20:16' },
      { from: 'them', text: 'Morgen, 19 Uhr. Ich schicke Ort später.', at: 'Samstag 20:20' },
      { from: 'me', text: 'Ok', at: 'Samstag 20:22' },
      { from: 'them', text: 'Allein kommen.', at: 'Samstag 20:25' },
      { from: 'me', text: 'Verstanden', at: 'Samstag 20:26' },
    ],
  },

  {
    id: 'andreas',
    name: 'Andreas Gym',
    avatar: '👨',
    messages: [
      { from: 'them', text: 'Yo', at: 'Samstag 17:00' },
      { from: 'me', text: 'Hey', at: 'Samstag 17:05' },
      { from: 'them', text: 'Was geht?', at: 'Samstag 17:06' },
      { from: 'me', text: 'Nicht viel, du?', at: 'Samstag 17:10' },
      { from: 'them', text: 'Same', at: 'Samstag 17:11' },
      { from: 'them', image: '/media/images/DSC00697.jpg', at: 'Samstag 17:15' },
      { from: 'them', text: 'Random pic lol', at: 'Samstag 17:16' },
      { from: 'me', text: 'Haha nice', at: 'Samstag 17:17' },
      { from: 'them', text: 'Bock auf Kaffee?', at: 'Samstag 17:20' },
      { from: 'me', text: 'Ne Danke', at: 'Samstag 17:22' },
      { from: 'them', text: 'ok cool', at: 'Samstag 17:23' },
    ],
  },

  {
    id: 'emma',
    name: 'Emma',
    avatar: '👱‍♀️',
    messages: [
      { from: 'them', text: 'Hey!', at: 'Samstag 16:00' },
      { from: 'me', text: 'Hey Emma!', at: 'Samstag 16:02' },
      { from: 'them', text: "Wie läuft's mit dem Artikel?", at: 'Samstag 16:05' },
      { from: 'me', text: 'Gut, bin fast fertig', at: 'Samstag 16:07' },
      { from: 'them', text: 'Super! 😊', at: 'Samstag 16:08' },
      { from: 'them', image: '/media/images/messages/znacht.jpg', at: 'Samstag 16:10' },
      { from: 'them', text: 'Hab das gestern gemacht', at: 'Samstag 16:11' },
      { from: 'me', text: 'Sieht gut aus!', at: 'Samstag 16:12' },
      { from: 'them', text: 'Danke!', at: 'Samstag 16:13' },
      { from: 'them', text: 'Lass uns mal wieder was machen', at: 'Samstag 16:15' },
      { from: 'me', text: 'Ja gerne!', at: 'Samstag 16:16' },
      { from: 'me', text: 'Falls du mal was brauchst, sag Bescheid', at: 'Samstag 16:20' },
      { from: 'them', text: 'Danke! Bin gerade viel unterwegs, aber melde mich wenn ich Zeit habe.', at: 'Samstag 16:25' },
      { from: 'me', text: 'Ok, kein Stress', at: 'Samstag 16:26' },
      { from: 'them', text: 'Perfekt! Später vielleicht?', at: 'Samstag 16:28' },
    ],
  },

  {
    id: 'hauswart',
    name: 'Hauswart',
    avatar: '🔧',
    messages: [
      { from: 'them', text: 'Hallo, die Heizung in Ihrer Wohnung wurde repariert.', at: 'Samstag 08:30' },
      { from: 'me', text: 'Super, danke!', at: 'Samstag 08:35' },
      { from: 'them', text: 'Bitte testen Sie die Heizung heute Abend.', at: 'Samstag 08:36' },
      { from: 'me', text: 'Mache ich, danke für die Info!', at: 'Samstag 08:40' },
      { from: 'them', text: 'Gerne. Bei Problemen einfach melden.', at: 'Samstag 08:42' },
      { from: 'me', text: 'Bei dir oder bei mir?', at: 'Samstag 08:45' },
      { from: 'them', text: '...', at: 'Samstag 08:50' },
      { from: 'them', text: 'In Ihrer Wohnung natürlich.', at: 'Samstag 08:52' },
      { from: 'me', text: '😅', at: 'Samstag 08:53' },
    ],
  },

  {
    id: 'melina',
    name: 'Melina',
    avatar: '👩‍💼',
    messages: [
      { from: 'them', text: 'Hast du die Notizen?', at: 'Samstag 14:00' },
      { from: 'me', text: 'Ja, schicke sie dir gleich.', at: 'Samstag 14:05' },
      { from: 'them', text: 'Danke!', at: 'Samstag 14:10' },
      { from: 'them', text: 'Können wir uns nochmal treffen?', at: 'Samstag 14:30' },
      { from: 'me', text: 'Ja klar, wann?', at: 'Samstag 14:35' },
      { from: 'them', text: 'Morgen?', at: 'Samstag 14:36' },
      { from: 'me', text: 'Passt!', at: 'Samstag 14:37' },
      { from: 'them', text: 'Perfekt, dann bis morgen', at: 'Samstag 14:38' },
      { from: 'me', text: 'Bis dann!', at: 'Samstag 14:40' },
      { from: 'them', image: '/media/images/messages/headshot.png', at: 'Samstag 15:00' },
      { from: 'them', text: 'Hab das Foto gefunden', at: 'Samstag 15:01' },
      { from: 'me', text: 'Super Danke!', at: 'Samstag 15:02' },
      { from: 'them', text: 'Die Quelle will sich nochmal treffen', at: 'Samstag 19:15' },
      { from: 'me', text: 'Ok, wann?', at: 'Samstag 19:20' },
      { from: 'them', text: 'In einer Stunde. Ich bin etwas unsicher.', at: 'Samstag 19:25' },
      { from: 'me', text: 'Wieso?', at: 'Samstag 19:26' },
      { from: 'them', text: 'Weiß nicht, komisches Gefühl.', at: 'Samstag 19:30' },
      { from: 'me', text: 'Soll ich mitkommen?', at: 'Samstag 19:32' },
      { from: 'them', text: 'Ja, wäre gut.', at: 'Samstag 19:35' },
    ],
  },

  {
    id: 'anna',
    name: 'Anna',
    avatar: '👩‍🎓',
    messages: [
      { from: 'them', text: 'Hey! Hast du Zeit für eine Lerngruppe?', at: 'Samstag 15:00' },
      { from: 'me', text: 'Ja, wann denkst du?', at: 'Samstag 15:05' },
      { from: 'them', text: 'Morgen Nachmittag?', at: 'Samstag 15:10' },
      { from: 'me', text: 'Passt!', at: 'Samstag 15:12' },
      { from: 'them', text: 'Super!', at: 'Samstag 15:13' },
      { from: 'them', text: 'Wo treffen wir uns?', at: 'Samstag 15:15' },
      { from: 'me', text: 'Bibliothek?', at: 'Samstag 15:16' },
      { from: 'them', text: 'Ja perfekt!', at: 'Samstag 15:17' },
      { from: 'me', text: 'Ok bis dann!', at: 'Samstag 15:18' },
      { from: 'me', text: 'Falls du später noch was brauchst, sag Bescheid', at: 'Samstag 15:20' },
      { from: 'them', text: 'Klar, kein Problem. Meld dich einfach, egal wann.', at: 'Samstag 15:22' },
      { from: 'me', text: 'Danke!', at: 'Samstag 15:23' },
      { from: 'them', text: 'Gerne. Ich schaue eigentlich immer rein.', at: 'Samstag 15:25' },
      { from: 'me', text: 'Das ist lieb, danke', at: 'Samstag 15:26' },
      { from: 'them', text: 'Kein Thema. Egal ob morgens oder nachts, ich antworte.', at: 'Samstag 15:28' },
      { from: 'me', text: 'Wow, das ist echt nett von dir', at: 'Samstag 15:30' },
      { from: 'them', text: '**A**ch ist doch selbstverständlich. Wenn du was brauchst, einfach schreiben.', at: 'Samstag 15:32' },
    ],
  },

  {
    id: 'unbekannt',
    name: 'Unbekannt',
    avatar: '❓',
    messages: [
      { from: 'them', text: '...', at: 'Freitag 20:00' },
      { from: 'me', text: 'Wer ist das?', at: 'Freitag 20:05' },
      { from: 'them', text: '...', at: 'Freitag 20:10' },
      { from: 'me', text: 'Hello?', at: 'Freitag 20:15' },
      { from: 'them', text: '...', at: 'Freitag 20:20' },
    ],
  },
]


// Chatbot-Konfiguration: Pro Chat können spezifische Antworten definiert werden
interface ChatbotConfig {
  defaultReplies?: string[] // Liste von Standard-Antworten (wird zufällig gewählt)
  specialHandler?: (userMessage: string) => string | null // Spezial-Handler für bestimmte Nachrichten
  delay?: { min: number; max: number } // Delay in ms für Bot-Antwort
  replyLength?: 'short' | 'long' // Länge der Antworten
}

const CHATBOT_CONFIG: Record<string, ChatbotConfig> = {
  melina: {
    defaultReplies: ['ok', 'klar', 'passt', 'bin kurz offline', 'später'],
    specialHandler: (userMessage: string) => {
      return "ok. wenn du's wirklich brauchst: der erste ist **V**. vertrau mir."
    },
  },

  mama: {
    defaultReplies: [
      'Hab dich lieb ❤️',
      'Hast du gut geschlafen?',
      'Hast du heute genug gegessen?',
      'Gib mir kurz Bescheid, wenn du zuhause bist.',
      'Nimm bitte eine Jacke mit, es wird kalt.',
      'Ruf mich an, wenn du kurz Zeit hast 😊',
      'Ich mache mir ein bisschen Sorgen… ist alles ok?',
      'Entschuldige, ich war gerade beschäftigt. Was brauchst du denn?',
      'Oh, tut mir leid, ich habe deine Nachricht erst jetzt gesehen. Kann ich dir helfen?',
    ],
    delay: { min: 2000, max: 4000 }, // Langsam: 2-4 Sekunden
    replyLength: 'long',
  },

  hauswart: {
    defaultReplies: [
      'Alles klar, ich komme morgen vorbei.',
      'Bitte lüften Sie kurz nach dem Testen.',
      'Wenn es wieder klopft oder zischt: bitte sofort melden.',
      'Und bitte… erwähnen Sie nicht, worüber wir gesprochen haben.',
      'Entschuldigung für die späte Antwort, ich war gerade nicht am Handy. Was kann ich für Sie tun?',
    ],
    delay: { min: 2500, max: 4500 }, // Langsam: 2.5-4.5 Sekunden
    replyLength: 'long',
  },

  stefan: {
    defaultReplies: [
      'Alles klar, ich schicke dir später einen Vorschlag.',
      'Kannst du mir noch kurz die Details zur Quelle schicken?',
      'Morgen 15:00 passt – wo wollen wir uns treffen?',
      'Ok, aber bitte diskret.',
      'Perfekt 👍',
      'Sorry, ich war gerade in einem Meeting. Lass mich kurz schauen, was du geschrieben hast.',
      'Entschuldige die späte Antwort, ich hatte den ganzen Tag Termine. Kann ich dir noch helfen?',
    ],
    delay: { min: 2000, max: 4000 }, // Langsam: 2-4 Sekunden
    replyLength: 'long',
  },

  'uni-gruppe': {
    defaultReplies: [
      'Wer hat das PDF?? 😭',
      'Ich habe ehrlich nichts verstanden…',
      'Treffpunkt 10:15? Ich bin zu spät.',
      'Kann jemand die Slides schicken, bitte?',
      'Haha ok.',
      'Oh, sorry, ich war gerade in der Vorlesung und konnte nicht antworten. Was war nochmal die Frage?',
      'Entschuldigt die späte Antwort, ich hatte den ganzen Tag Uni. Kann jemand nochmal erklären?',
    ],
    delay: { min: 2500, max: 5000 }, // Langsam: 2.5-5 Sekunden
    replyLength: 'long',
  },

  redaktion: {
    defaultReplies: [
      'Bitte bis 18:00 im Drive.',
      'Der Einstieg muss noch stärker werden.',
      'Quellen bitte sauber angeben.',
      'Mach es kürzer. Viel kürzer.',
      '👍',
      'Entschuldige die späte Antwort, wir hatten heute eine Redaktionssitzung. Was brauchst du genau?',
      'Sorry, ich war gerade mit einem anderen Artikel beschäftigt. Kannst du mir nochmal schreiben, was du brauchst?',
    ],
    delay: { min: 2000, max: 4000 }, // Langsam: 2-4 Sekunden
    replyLength: 'long',
  },

  chefredaktion: {
    defaultReplies: [
      'Status?',
      'Ich brauche das in 30 Minuten.',
      'Kein Risiko. Nur Fakten.',
      'Ruf mich an.',
      'Ok.',
      'Entschuldige die späte Antwort, ich war in einem wichtigen Meeting. Was ist der aktuelle Stand?',
      'Sorry, ich hatte den ganzen Tag Termine. Kannst du mir nochmal kurz zusammenfassen, was du brauchst?',
    ],
    delay: { min: 2500, max: 4500 }, // Langsam: 2.5-4.5 Sekunden
    replyLength: 'long',
  },

  quelle1: {
    defaultReplies: [
      'Keine Details hier.',
      'Halte dich an die Anweisungen.',
      'Nicht zu viele Fragen.',
      'Der Treffpunkt kommt noch.',
      'Komm allein.',
      'Entschuldige die späte Antwort, ich war nicht erreichbar. Was brauchst du?',
    ],
    delay: { min: 3000, max: 5000 }, // Sehr langsam: 3-5 Sekunden
    replyLength: 'long',
  },

  andreas: {
    defaultReplies: [
      'Bock auf Kaffee?',
      '/media/images/DSC00695.jpg',
      'Wie gehts?',
      'Sorry, ich war gerade unterwegs und habe deine Nachricht erst jetzt gesehen. Was geht?',
      'Entschuldige die späte Antwort, ich hatte den ganzen Tag keine Zeit. Alles klar bei dir?',
    ],
    delay: { min: 2000, max: 4000 }, // Langsam: 2-4 Sekunden
    replyLength: 'long',
  },

  emma: {
    defaultReplies: [
      'Oh mein Gott, nice 😂',
      'Ich bin stolz auf dich 🫶',
      'Hast du heute Zeit für einen Kaffee?',
      'Schick mir ein Update, wenn du magst.',
      'Aww, süß.',
      'Sorry, ich war gerade viel unterwegs und habe deine Nachricht erst jetzt gesehen. Was geht?',
      'Entschuldige die späte Antwort, ich hatte den ganzen Tag Termine. Lass uns später nochmal schreiben!',
    ],
    delay: { min: 2500, max: 4500 }, // Langsam: 2.5-4.5 Sekunden
    replyLength: 'long',
  },

  anna: {
    defaultReplies: [
      'Ok',
      'Klar',
      'Passt',
      'Gerne',
      'Ja',
      '👍',
      'Alles klar',
    ],
    delay: { min: 300, max: 600 }, // Schnell: 300-600ms
    replyLength: 'short',
  },

  unbekannt: {
    defaultReplies: [
      '…',
      'Lies.',
      'Zu spät.',
      'Lösch das.',
      'Nicht hier.',
    ],
  },

  default: {
    defaultReplies: ['ok', 'klar', 'mache ich', 'passt', 'okay', 'bin gerade beschäftigt', 'später'],
    delay: { min: 2000, max: 4000 }, // Langsam: 2-4 Sekunden
    replyLength: 'long',
  },
}

export default function Messages({ windowId }: { windowId: string }) {
  const { markVFound } = usePuzzle()
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)
  const [currentId, setCurrentId] = useState('mama')
  const [input, setInput] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)
  const [hasSeenVoiceNote, setHasSeenVoiceNote] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [melinaHasGivenHint, setMelinaHasGivenHint] = useState(false)

  const currentContact = contacts.find(c => c.id === currentId)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [contacts, currentId])

  useEffect(() => {
    // Markiere V als gefunden, wenn Melina den Hinweis gegeben hat
    if (currentContact?.id === 'melina' && melinaHasGivenHint && !hasSeenVoiceNote) {
      markVFound()
      setHasSeenVoiceNote(true)
    }
  }, [melinaHasGivenHint, hasSeenVoiceNote, markVFound, currentContact])

  const getBotReply = (chatId: string, userMessage: string): { reply: string | null; image: string | null; shouldMarkVFound: boolean } => {
    const config = CHATBOT_CONFIG[chatId] || CHATBOT_CONFIG.default
    
    // Prüfe zuerst Spezial-Handler (z.B. Melina-Rätsel)
    // Wichtig: Handler soll IMMER funktionieren, wenn Trigger-Wörter enthalten sind
    if (chatId === 'melina' && config.specialHandler) {
      const specialReply = config.specialHandler(userMessage)
      if (specialReply) {
        // Markiere V nur beim ersten Mal als gefunden
        return { reply: specialReply, image: null, shouldMarkVFound: !melinaHasGivenHint }
      }
    }
    
    // Standard-Antwort aus Liste wählen
    const replies = config.defaultReplies || CHATBOT_CONFIG.default.defaultReplies || ['ok']
    const selectedReply = replies[Math.floor(Math.random() * replies.length)]
    
    // Prüfe ob es ein Bild-Pfad ist
    if (selectedReply.includes('/media/images/') || selectedReply.endsWith('.jpg') || selectedReply.endsWith('.png')) {
      // Korrigiere den Pfad (entferne 'public' falls vorhanden)
      const imagePath = selectedReply.startsWith('public/') ? selectedReply.substring(7) : selectedReply
      return { reply: null, image: imagePath, shouldMarkVFound: false }
    }
    
    return { reply: selectedReply, image: null, shouldMarkVFound: false }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = input.trim()
    if (!val || !currentContact) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

    // User-Nachricht hinzufügen
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === currentId
          ? {
              ...contact,
              messages: [
                ...contact.messages,
                { from: 'me', text: val, at: timeStr },
              ],
            }
          : contact
      )
    )

    setInput('')
    setIsTyping(true)

    // Bot-Antwort nach Verzögerung - unterschiedlich je nach Kontakt
    const config = CHATBOT_CONFIG[currentId] || CHATBOT_CONFIG.default
    const delayConfig = config.delay || { min: 600, max: 1200 }
    const delay = delayConfig.min + Math.random() * (delayConfig.max - delayConfig.min)
    
    setTimeout(() => {
      const { reply, image, shouldMarkVFound } = getBotReply(currentId, val)
      
      // Markiere V als gefunden, wenn Melina den Hinweis gegeben hat
      if (shouldMarkVFound && !melinaHasGivenHint) {
        setMelinaHasGivenHint(true)
        markVFound()
      }
      
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === currentId
            ? {
                ...contact,
                messages: [
                  ...contact.messages,
                  image 
                    ? { from: 'them', image, at: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }
                    : { from: 'them', text: reply || '', at: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) },
                ],
              }
            : contact
        )
      )
      
      setIsTyping(false)
    }, delay)
  }

  return (
    <>
      <div className="messages-root" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: '100%', gap: '16px' }}>
        <aside style={{ borderRight: '1px solid var(--border)', paddingRight: '12px', paddingLeft: '8px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 16px' }}>
            <div style={{ fontWeight: 700 }}>Messages</div>
          </div>
          <div className="contact-list">
            {contacts.map(c => (
              <button
                key={c.id}
                className={`contact ${c.id === currentId ? 'active' : ''}`}
                onClick={() => setCurrentId(c.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: c.id === currentId ? '1px solid var(--border)' : '1px solid transparent',
                  background: c.id === currentId ? '#2a2b33' : 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '8px',
                }}
              >
                <div style={{ fontSize: '20px' }}>{c.avatar}</div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.messages.at(-1)?.text || (c.messages.at(-1)?.image ? '📷 Bild' : '\u00A0')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <header className="thread-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', paddingTop: '8px', borderBottom: '1px solid var(--border)', minHeight: '42px' }}>
            <div className="avatar" style={{ fontSize: '18px' }}>{currentContact?.avatar || '🗯️'}</div>
            <div className="name" style={{ fontWeight: 600, color: 'var(--text)' }}>{currentContact?.name || 'Select a chat'}</div>
          </header>

          <div className="thread" ref={threadRef} style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '20px 24px' }}>
            {/* Pinned Message */}
            {currentContact?.messages.find(m => m.pinned) && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#1e1f24', border: '2px solid #3b82f6', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '10px', fontWeight: 600 }}>📌 ANGEHEFTET</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', whiteSpace: 'pre-line' }}>
                  {currentContact.messages.find(m => m.pinned)?.text}
                </div>
              </div>
            )}

            {currentContact?.messages.map((m, i) => {
              const mine = m.from === 'me'
              return (
                <div key={`${i}-${m.text || m.image || 'voice'}`}>
                  {m.voiceNote ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: mine ? 'flex-end' : 'flex-start',
                        margin: '12px 0',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '65%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: '#2a2b33',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <div style={{ fontSize: '20px' }}>🎤</div>
                        <div>
                          <div style={{ color: 'var(--text)', fontWeight: 600 }}>{m.text}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                            {m.voiceNote.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : m.image ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: mine ? 'flex-end' : 'flex-start',
                        margin: '12px 0',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '65%',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: mine ? '#3b82f6' : '#2a2b33',
                          border: mine ? '1px solid rgba(255,255,255,.15)' : '1px solid var(--border)',
                          cursor: 'pointer',
                        }}
                        onClick={() => setLightboxImage(m.image || null)}
                      >
                        <img
                          src={m.image}
                          alt="Shared image"
                          style={{
                            width: '100%',
                            maxWidth: '300px',
                            height: 'auto',
                            display: 'block',
                          }}
                        />
                        {m.text && (
                          <div style={{ padding: '10px 16px', color: mine ? '#fff' : 'var(--text)', fontSize: '14px' }}>
                            {m.text}
                          </div>
                        )}
                        <div style={{ fontSize: '11px', opacity: 0.7, padding: '6px 16px 12px', color: mine ? '#fff' : 'var(--muted)', textAlign: mine ? 'right' : 'left' }}>
                          {m.at}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: mine ? 'flex-end' : 'flex-start',
                        margin: '12px 0',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '65%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: mine ? '#3b82f6' : '#2a2b33',
                          color: mine ? '#fff' : 'var(--text)',
                          border: mine ? '1px solid rgba(255,255,255,.15)' : '1px solid var(--border)',
                        }}
                      >
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                          {m.text ? (() => {
                            const parts = m.text.split(/(\*\*[A-Z]\*\*)/g).filter(p => p !== '')
                            return parts.map((part, idx) => {
                              const boldMatch = part.match(/^\*\*([A-Z])\*\*$/)
                              if (boldMatch) {
                                return <strong key={idx} style={{ fontWeight: 700, color: 'inherit' }}>{boldMatch[1]}</strong>
                              }
                              return <span key={idx}>{part}</span>
                            })
                          })() : ''}
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px', textAlign: mine ? 'right' : 'left' }}>
                          {m.at}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Tippindikator */}
            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  margin: '12px 0',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#2a2b33',
                    border: '1px solid var(--border)',
                    color: 'var(--muted)',
                    fontSize: '14px',
                  }}
                >
                  ...
                </div>
              </div>
            )}
          </div>

          <form className="composer" onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginTop: '16px', padding: '0 24px 0' }}>
            <input
              className="input"
              type="text"
              placeholder="Message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: '#2a2b33', color: 'var(--text)' }}
            />
            <button className="btn send" type="submit" style={{ padding: '12px 20px' }}>Send</button>
          </form>
        </section>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            cursor: 'pointer',
          }}
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Enlarged"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  )
}
