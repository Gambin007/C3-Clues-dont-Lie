// Desktop-Datenstruktur: Ordner, Unterordner und Dateien

export interface DesktopFile {
  name: string
  type: 'file' | 'folder'
  content?: string // Für Textdateien
  url?: string // Für Bilddateien (URL zum Bild)
  children?: DesktopFile[] // Für Ordner
}

export interface DesktopFolder {
  name: string
  top: string
  left: string
  files: DesktopFile[]
}

// Ordner-Inhalte
export const DESKTOP_FOLDERS: Record<string, DesktopFile[]> = {
  REDAKTION: [
    {
      name: 'Artikel',
      type: 'folder',
      children: [
        { name: 'artikel_entwurf_final_v3.docx', type: 'file', content: 'Artikel Entwurf v3\n\nEinleitung...\nHauptteil...\nFazit...' },
        { name: 'artikel_entwurf_final_v3_NEU.docx', type: 'file', content: 'Artikel Entwurf v3 NEU\n\nÜberarbeitete Version nach Feedback...' },
        { name: 'artikel_final_abgabe.docx', type: 'file', content: 'Finale Version für Abgabe\n\nAlle Korrekturen eingearbeitet.' },
        { name: 'kommentar_korrekturen.txt', type: 'file', content: 'Korrekturen:\n- Zeile 5: Formulierung anpassen\n- Zeile 12: Quelle ergänzen\n- Zeile 20: Rechtschreibung prüfen' },
      ],
    },
    {
      name: 'Bilder',
      type: 'folder',
      children: [
        { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Arbeitsplatz/Screenshots/Redaktion/Privat' },
      ],
    },
    {
      name: 'Recherche',
      type: 'folder',
      children: [
        { name: 'notizen_quellen.txt', type: 'file', content: 'Quellen-Notizen:\n\nQuelle A: bestätigt, Interview geführt\nQuelle B: noch offen, Rückmeldung ausstehend\nQuelle C: anonym, nur per Mail' },
        { name: 'hintergrund_info.md', type: 'file', content: '# Hintergrund-Informationen\n\nKontext zum Artikel...\nHistorische Entwicklung...\nAktuelle Situation...' },
        { name: 'faktencheck_offen.txt', type: 'file', content: 'Faktencheck-Liste:\n\n- Behauptung 1: noch prüfen\n- Behauptung 2: bestätigt\n- Behauptung 3: widerlegt' },
        { name: 'timeline_roh.txt', type: 'file', content: 'Timeline:\n\n2024-01-10: Erstes Treffen\n2024-01-15: Recherche begonnen\n2024-01-17: Artikel-Entwurf' },
        { name: 'zugang_archiv.txt', type: 'file', content: 'ARCHIV-ZUGANG\n\nDas relevante Material ist archiviert.\nZugriff nur mit korrekter Referenz.\n\nWichtig:\n- Die Referenz ist KEIN Name.\n- Sie ist sichtbar, aber nicht beschriftet.\n- Du wirst sie nicht in Text finden.\n\nTipp:\nWenn du sie suchst: schau bei den Bildern nach.\nNicht die schönen. Die nützlichen.' },
        { name: 'intern_memo_kurz.txt', type: 'file', content: 'INTERN\n\nBitte keine sensiblen Dateien offen lassen.\nAlles was \'vault\' betrifft: nur noch im ARCHIV ablegen.\nKein Klartext in Chats.\n\n– Ende' },
        { name: 'checkliste_archiv.txt', type: 'file', content: 'Checkliste\n\n[ ] Material ins Archiv verschoben\n[ ] Referenz notiert (nicht im Klartext)\n[ ] Zugriff getestet\n[ ] Ordner wieder geschlossen' },
        {
          name: 'Fragmente',
          type: 'folder',
          children: [
            { name: 'Zusatz_notiz.txt', type: 'file', content: 'Zusätzliche Notiz\n\nGespräch mit Quelle: Samstag, 18:12\nWichtige Details erhalten.\n\nNachfrage: Sonntag, 18:21\nGleiche Information, aber andere Zeitangabe.\n\nWenn alles widerspricht, lies nur den Anfang.' },
            { name: 'Email_anfrage.eml', type: 'file', content: 'E-Mail Anfrage\n\nVon: quelle@example.com\nBetreff: Rückmeldung\nDatum: Freitag, 15.02.2024 14:30\n\nHallo,\n\nhier die gewünschten Informationen.\n\nZeitstempel: Freitag, 15.02.2024 14:30\nAber im Header steht: Sonntag, 17.02.2024\n\nViele Grüße' },
            { name: 'Interview_notizen.txt', type: 'file', content: 'Interview-Notizen\n\nDatum: 16.02.2024\nZeit: 10:00 Uhr\n\nInterview mit Quelle X.\n\nWichtig: Die Zeitangabe im Protokoll zeigt 10:00, aber die Aufnahme startet um 10:15.\n\nNotiz: Zeitstempel passen nicht zusammen.' },
            { name: 'Telefonat_protokoll.txt', type: 'file', content: 'Telefonat-Protokoll\n\nAnruf: Dienstag, 13.02.2024\nUhrzeit: 16:45\n\nGespräch mit Kontakt.\n\nProtokoll erstellt: Dienstag, 13.02.2024 16:45\nAber im Kalender steht: Mittwoch, 14.02.2024\n\nZeitangaben stimmen nicht überein.' },
            { name: 'Sprachnotiz_transkript.txt', type: 'file', content: 'Sprachnotiz-Transkript\n\nAufgenommen: Donnerstag, 12.02.2024 09:30\n\n"Wichtige Information für den Artikel..."\n\nMetadaten zeigen: Freitag, 13.02.2024 09:30\n\nDie Zeit springt zwischen den Dateien.' },
            { name: 'Protokoll_treffen.txt', type: 'file', content: 'Protokoll Treffen\n\nDatum: Montag, 11.02.2024\nBeginn: 14:00\nEnde: 15:30\n\nBesprechung mit Redaktion.\n\nIm Kalender eingetragen als: Montag, 11.02.2024 14:00\nAber E-Mail-Erinnerung zeigt: Dienstag, 12.02.2024 14:00\n\nProtokoll erstellt: Montag, 11.02.2024 15:30\nAber Datei-Metadaten: Dienstag, 12.02.2024 15:30' },
            { name: 'Recherche_log.txt', type: 'file', content: 'Recherche-Log\n\n2024-02-10 11:00: Recherche begonnen\n2024-02-10 14:30: Erste Quelle kontaktiert\n2024-02-10 18:00: Antwort erhalten\n\nAber im E-Mail-Verlauf steht:\n2024-02-11 11:00: Recherche begonnen\n2024-02-11 14:30: Erste Quelle kontaktiert\n\nDie Logs zeigen unterschiedliche Daten für dieselben Ereignisse.' },
            { name: 'Update_status.txt', type: 'file', content: 'Update Status\n\nStand: Freitag, 09.02.2024 17:00\n\nArtikel-Status aktualisiert.\n\nAber im System-Log:\nStand: Samstag, 10.02.2024 17:00\n\nStatus-Update zeigt verschiedene Zeiten.\n\nWenn alles widerspricht, lies nur den Anfang.' },
            { name: 'Notiz_quelle.txt', type: 'file', content: 'Notiz Quelle\n\nKontakt: Freitag, 08.02.2024 13:15\n\nWichtige Information erhalten.\n\nNotiz erstellt: Freitag, 08.02.2024 13:15\nAber Backup zeigt: Samstag, 09.02.2024 13:15\n\nDie Zeitangaben passen nicht zusammen.' },
            { name: 'Gespraech.txt', type: 'file', content: 'Die Antwort liegt nicht in Worten.\n\nSie wurde nicht getippt.\nSie wurde nicht gespeichert.\n\nSie wurde gesehen.\n\nSchau, wo man etwas markiert.\nWo etwas hervorgehoben wird.\nWo etwas unterstrichen ist.\n\nNicht hier. Nicht in Text.\n\nSondern dort, wo man hinschaut.\n\nPHOTO_KEY: arbeitsplatz/arbeitsplatz7.png' },          ],
        },
      ],
    },
    {
      name: 'Entwürfe_alt',
      type: 'folder',
      children: [
        { name: 'artikel_alt_01.docx', type: 'file', content: 'Alter Entwurf 1\n\nErste Version, verworfen.' },
        { name: 'artikel_alt_02.docx', type: 'file', content: 'Alter Entwurf 2\n\nZweite Version, verworfen.' },
        { name: 'kommentar_verworfen.txt', type: 'file', content: 'Grund für Verwerfung:\n\nZu lang, zu kompliziert, nicht fokussiert genug.' },
      ],
    },
  ],
  QUELLEN: [
    {
      name: 'Quelle_A',
      type: 'folder',
      children: [
        { name: 'kontakt.txt', type: 'file', content: 'Kontakt Quelle A:\n\nName: [anonymisiert]\nTreffpunkt: Bahnhof\nZeit: 15:00\nStatus: bestätigt' },
        { name: 'treffpunkt_notiz.md', type: 'file', content: '# Treffpunkt-Notiz\n\nBahnhof, Haupteingang\n15:00 Uhr\nDiskret bleiben.' },
      ],
    },
    {
      name: 'Quelle_B',
      type: 'folder',
      children: [
        { name: 'audio_transkript.txt', type: 'file', content: 'Audio-Transkript:\n\n[00:00] Interview beginnt\n[02:15] Wichtige Information\n[05:30] Interview endet' },
        { name: 'fragenliste.txt', type: 'file', content: 'Fragenliste:\n\n1. Wie ist die Situation?\n2. Was sind die Hintergründe?\n3. Wer ist betroffen?\n4. Was sind die nächsten Schritte?' },
      ],
    },
    {
      name: 'Unklar',
      type: 'folder',
      children: [
        { name: 'unbekannt_1.txt', type: 'file', content: 'Unbekannte Quelle:\n\nKeine weiteren Informationen verfügbar.' },
        { name: 'anonym_mail.txt', type: 'file', content: 'Anonyme E-Mail:\n\nBetreff: Wichtige Information\n\nInhalt: [gelöscht]' },
      ],
    },
  ],
  BILDER: [
    { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Arbeitsplatz/Screenshots/Redaktion/Privat' },
  ],
  AUDIO: [
    { name: 'interview_roh.m4a', type: 'file', content: '[Audio-Datei - Interview]' },
    { name: 'interview_backup.wav', type: 'file', content: '[Audio-Datei - Backup]' },
    { name: 'memo_sprachnotiz.m4a', type: 'file', content: '[Audio-Datei - Sprachnotiz]' },
  ],
  DOKUMENTE: [
    { name: 'steuer_2025.pdf', type: 'file', content: '[PDF-Datei - Steuerunterlagen]' },
    { name: 'vertrag_redaktion.pdf', type: 'file', content: '[PDF-Datei - Redaktionsvertrag]' },
    { name: 'lebenslauf_lisa.pdf', type: 'file', content: '[PDF-Datei - Lebenslauf]' },
    { name: 'rechnung_kamera.pdf', type: 'file', content: '[PDF-Datei - Rechnung]' },
  ],
  ALT: [
    { name: 'backup_2023.zip', type: 'file', content: '[ZIP-Archiv - Backup 2023]' },
    { name: 'backup_2024.zip', type: 'file', content: '[ZIP-Archiv - Backup 2024]' },
    {
      name: 'archiv_alt',
      type: 'folder',
      children: [
        { name: 'alt_notizen.txt', type: 'file', content: 'Alte Notizen:\n\nVerschiedene Ideen und Gedanken aus früheren Projekten.' },
        { name: 'ideen_liste.md', type: 'file', content: '# Ideen-Liste\n\n- Idee 1\n- Idee 2\n- Idee 3' },
      ],
    },
  ],
  Melina: [], // Leerer Ordner für jetzt
  Projekte: [],
  Downloads: [],
  Musik: [],
  Videos: [],
  Recherche_Fotos: [
    {
      name: 'Arbeitsplatz',
      type: 'folder',
      children: [
        { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Arbeitsplatz' },
      ],
    },
  ],
  TRAVELS: [
    {
      name: 'Florenz_2025',
      type: 'folder',
      children: [
        { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Events/Unterwegs' },
        { name: 'reiseplan.txt', type: 'file', content: 'Florenz Reiseplan:\n\nTag 1: Ankunft, Check-in\nTag 2: Stadtbesichtigung\nTag 3: Interview-Termine\nTag 4: Abreise' },
        { name: 'hotel_bestätigung.pdf', type: 'file', content: '[PDF - Hotel-Bestätigung]' },
      ],
    },
    {
      name: 'Wien_2024',
      type: 'folder',
      children: [
        { name: 'wien_fotos', type: 'folder', children: [
          { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Events/Unterwegs' },
        ]},
        { name: 'notizen_wien.txt', type: 'file', content: 'Wien Notizen:\n\n- Konferenz besucht\n- Interessante Kontakte geknüpft\n- Artikel-Idee: Wiener Kaffeehaus-Kultur' },
        { name: 'zugticket.pdf', type: 'file', content: '[PDF - Zugticket]' },
      ],
    },
    {
      name: 'Zürich_Lokal',
      type: 'folder',
      children: [
        { name: 'restaurant_tipps.txt', type: 'file', content: 'Restaurant-Tipps:\n\n- Restaurant X: gut für Interviews\n- Café Y: ruhig zum Arbeiten\n- Bar Z: nette Atmosphäre' },
        { name: 'orte_fotos', type: 'folder', children: [
          { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Events/Unterwegs' },
        ]},
      ],
    },
    { name: 'reisekosten_2024.xlsx', type: 'file', content: '[Excel-Datei - Reisekosten]' },
    { name: 'visum_antrag.pdf', type: 'file', content: '[PDF - Visum-Antrag]' },
  ],
  FRIENDS: [
    {
      name: 'Geburtstage',
      type: 'folder',
      children: [
        { name: 'geschenk_ideen.txt', type: 'file', content: 'Geschenk-Ideen:\n\n- Melina: Buch über Journalismus\n- Emma: Kaffee-Gutschein\n- Anna: Notizbuch' },
        { name: 'geburtstags_fotos', type: 'folder', children: [
          { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Privat/Events' },
        ]},
      ],
    },
    {
      name: 'Feiern',
      type: 'folder',
      children: [
        { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Privat/Events' },
      ],
    },
    {
      name: 'Erinnerungen',
      type: 'folder',
      children: [
        { name: 'uni_zeit', type: 'folder', children: [
          { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Privat/Events' },
          { name: 'notizen_uni.txt', type: 'file', content: 'Uni-Erinnerungen:\n\nViele gute Momente mit der Gruppe...' },
        ]},
        { name: 'sommer_2023', type: 'folder', children: [
          { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Privat/Events' },
        ]},
      ],
    },
    { name: 'kontaktliste_freunde.txt', type: 'file', content: 'Kontaktliste:\n\nMelina - Journalistin\nEmma - Studentin\nAnna - Bibliothekarin\nAndreas - Freund' },
  ],
  FINANZEN: [
    {
      name: 'Rechnungen_2024',
      type: 'folder',
      children: [
        { name: 'rechnung_internet.pdf', type: 'file', content: '[PDF - Internet-Rechnung]' },
        { name: 'rechnung_handy.pdf', type: 'file', content: '[PDF - Handy-Rechnung]' },
        { name: 'rechnung_abo.pdf', type: 'file', content: '[PDF - Abo-Rechnung]' },
        { name: 'rechnung_software.pdf', type: 'file', content: '[PDF - Software-Lizenz]' },
      ],
    },
    {
      name: 'Steuern',
      type: 'folder',
      children: [
        { name: 'steuer_2023.pdf', type: 'file', content: '[PDF - Steuererklärung 2023]' },
        { name: 'belege_2024', type: 'folder', children: [
          { name: 'beleg_01.pdf', type: 'file', content: '[PDF - Beleg]' },
          { name: 'beleg_02.pdf', type: 'file', content: '[PDF - Beleg]' },
          { name: 'beleg_03.pdf', type: 'file', content: '[PDF - Beleg]' },
        ]},
        { name: 'steuer_notizen.txt', type: 'file', content: 'Steuer-Notizen:\n\n- Belege sammeln\n- Ausgaben dokumentieren\n- Deadline: 31. März' },
      ],
    },
    {
      name: 'Überweisungen',
      type: 'folder',
      children: [
        { name: 'überweisung_miete.pdf', type: 'file', content: '[PDF - Miet-Überweisung]' },
        { name: 'überweisung_versicherung.pdf', type: 'file', content: '[PDF - Versicherung]' },
        { name: 'kontoauszug_januar.pdf', type: 'file', content: '[PDF - Kontoauszug]' },
        { name: 'kontoauszug_februar.pdf', type: 'file', content: '[PDF - Kontoauszug]' },
      ],
    },
    { name: 'budget_2024.txt', type: 'file', content: 'Budget 2024:\n\nEinnahmen:\n- Redaktion: CHF 3500/Monat\n- Freelance: variabel\n\nAusgaben:\n- Miete: CHF 1200\n- Lebensmittel: CHF 400\n- Sonstiges: CHF 300' },
    { name: 'sparkonto.txt', type: 'file', content: 'Sparkonto:\n\nZiel: CHF 5000\nAktuell: CHF 3200\nNoch: CHF 1800' },
  ],
  IDEEN: [
    {
      name: 'Artikel_Ideen',
      type: 'folder',
      children: [
        { name: 'idee_lokale_politik.txt', type: 'file', content: 'Artikel-Idee: Lokale Politik\n\nFokus: Stadtrat-Entscheidungen\nWinkel: Bürgerbeteiligung\nStatus: Recherche' },
        { name: 'idee_kultur.txt', type: 'file', content: 'Artikel-Idee: Kultur\n\nFokus: Lokale Künstler\nWinkel: Förderung\nStatus: Idee' },
        { name: 'idee_umwelt.txt', type: 'file', content: 'Artikel-Idee: Umwelt\n\nFokus: Nachhaltigkeit in der Stadt\nWinkel: Praktische Umsetzung\nStatus: Brainstorming' },
        { name: 'idee_bildung.txt', type: 'file', content: 'Artikel-Idee: Bildung\n\nFokus: Schulen\nWinkel: Digitalisierung\nStatus: Vorschlag' },
      ],
    },
    {
      name: 'Story_Konzepte',
      type: 'folder',
      children: [
        { name: 'konzept_serie.txt', type: 'file', content: 'Serien-Konzept:\n\nThema: Junge Journalisten\nFolge 1: Einstieg\nFolge 2: Herausforderungen\nFolge 3: Erfolge' },
        { name: 'konzept_interview.txt', type: 'file', content: 'Interview-Konzept:\n\nGast: Lokaler Politiker\nFragen: Vorbereitet\nFormat: Print + Online' },
        { name: 'konzept_reportage.txt', type: 'file', content: 'Reportage-Konzept:\n\nThema: Stadtentwicklung\nWinkel: Perspektiven\nLänge: 3000 Wörter' },
      ],
    },
    {
      name: 'Brainstorming',
      type: 'folder',
      children: [
        { name: 'brainstorm_2024_01.txt', type: 'file', content: 'Brainstorming Session:\n\n- Thema A\n- Thema B\n- Thema C\n\nNotizen: spontane Ideen, noch unstrukturiert' },
        { name: 'brainstorm_2024_02.txt', type: 'file', content: 'Brainstorming Session:\n\n- Neue Winkel\n- Kontakte\n- Recherche-Ideen' },
        { name: 'skizzen', type: 'folder', children: [
          { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Screenshots' },
        ]},
      ],
    },
    { name: 'ideen_sammlung.md', type: 'file', content: '# Ideen-Sammlung\n\nVerschiedene Ideen für Artikel, Reportagen und Features.\n\n- Idee 1: Lokale Geschichte\n- Idee 2: Stadtentwicklung\n- Idee 3: Kultur-Events\n- Idee 4: Soziales Engagement' },
    { name: 'verworfen.txt', type: 'file', content: 'Verworfene Ideen:\n\n- Idee X: zu komplex\n- Idee Y: keine Quellen\n- Idee Z: bereits behandelt' },
  ],
  RANDOM: [
    {
      name: 'Screenshots',
      type: 'folder',
      children: [
        { name: 'bilder_verweis.txt', type: 'file', content: 'Fotos wurden aus Platzgründen ausgelagert.\nSiehe Fotos-App > Screenshots' },
      ],
    },
    {
      name: 'Downloads_Alt',
      type: 'folder',
      children: [
        { name: 'download_01.pdf', type: 'file', content: '[PDF - Download]' },
        { name: 'download_02.zip', type: 'file', content: '[ZIP - Download]' },
        { name: 'download_04.txt', type: 'file', content: 'Download-Inhalt:\n\nVerschiedene Dateien, nicht mehr benötigt.' },
      ],
    },
    {
      name: 'Verschiedenes',
      type: 'folder',
      children: [
        { name: 'notiz_random.txt', type: 'file', content: 'Random Notizen:\n\nVerschiedene Gedanken und Ideen, nicht kategorisiert.' },
        { name: 'liste.txt', type: 'file', content: 'Liste:\n\n- Punkt 1\n- Punkt 2\n- Punkt 3' },
        { name: 'alt_datei.txt', type: 'file', content: 'Alte Datei:\n\nInhalt nicht mehr relevant, aber noch nicht gelöscht.' },
      ],
    },
    { name: 'test.txt', type: 'file', content: 'Test-Datei:\n\nNur zum Testen erstellt.' },
    { name: 'backup_alt.zip', type: 'file', content: '[ZIP - Alter Backup]' },
    { name: 'tmp_datei.txt', type: 'file', content: 'Temporäre Datei:\n\nSollte eigentlich gelöscht werden.' },
  ],
  BACKUP_MISC: [
    {
      name: 'Backup_2023',
      type: 'folder',
      children: [
        { name: 'backup_januar.zip', type: 'file', content: '[ZIP - Backup Januar 2023]' },
        { name: 'backup_februar.zip', type: 'file', content: '[ZIP - Backup Februar 2023]' },
        { name: 'backup_märz.zip', type: 'file', content: '[ZIP - Backup März 2023]' },
        { name: 'backup_april.zip', type: 'file', content: '[ZIP - Backup April 2023]' },
      ],
    },
    {
      name: 'Backup_2024',
      type: 'folder',
      children: [
        { name: 'backup_januar_2024.zip', type: 'file', content: '[ZIP - Backup Januar 2024]' },
        { name: 'backup_februar_2024.zip', type: 'file', content: '[ZIP - Backup Februar 2024]' },
        { name: 'backup_log.txt', type: 'file', content: 'Backup-Log:\n\n2024-01-15: Backup erfolgreich\n2024-02-10: Backup erfolgreich\n2024-02-20: Backup fehlgeschlagen - wiederholt' },
      ],
    },
    {
      name: 'Archiv',
      type: 'folder',
      children: [
        { name: 'archiv_2022', type: 'folder', children: [
          { name: 'alt_dateien.zip', type: 'file', content: '[ZIP - Archiv 2022]' },
          { name: 'notizen_2022.txt', type: 'file', content: 'Notizen aus 2022:\n\nVerschiedene alte Notizen und Dokumente.' },
        ]},
        { name: 'archiv_2023', type: 'folder', children: [
          { name: 'alt_dateien.zip', type: 'file', content: '[ZIP - Archiv 2023]' },
          { name: 'dokumente_2023', type: 'folder', children: [
            { name: 'dok_01.pdf', type: 'file', content: '[PDF - Dokument]' },
            { name: 'dok_02.pdf', type: 'file', content: '[PDF - Dokument]' },
          ]},
        ]},
      ],
    },
    {
      name: 'Sicherungen',
      type: 'folder',
      children: [
        { name: 'sicherung_system.zip', type: 'file', content: '[ZIP - System-Sicherung]' },
        { name: 'sicherung_dokumente.zip', type: 'file', content: '[ZIP - Dokumente-Sicherung]' },
        { name: 'sicherung_bilder.zip', type: 'file', content: '[ZIP - Bilder-Sicherung]' },
      ],
    },
    { name: 'backup_info.txt', type: 'file', content: 'Backup-Informationen:\n\nRegelmäßige Backups werden hier gespeichert.\nLetztes Backup: 2024-02-20\nNächstes Backup: geplant' },
  ],
  ARCHIV: [
    { name: 'anhang_video.mp4', type: 'file', url: '/media/videos/anhang_video.mp4' },
  ],
}

// Lose Dateien auf dem Desktop
export const DESKTOP_FILES: DesktopFile[] = [
  {
    name: 'TODO.txt',
    type: 'file',
    content: 'TODO-Liste:\n\n- Artikel fertigstellen\n- Quellen nochmal prüfen\n- Bilder auswählen\n- Faktencheck abschließen\n- Deadline: Montag',
  },
  {
    name: 'NOTIZ.txt',
    type: 'file',
    content: 'Notiz:\n\nWichtige Punkte für nächste Woche:\n- Interview vorbereiten\n- Recherche vertiefen\n- Redaktion kontaktieren',
  },
  {
    name: 'ENTWURF.txt',
    type: 'file',
    content: 'Entwurf:\n\nErste Gedanken zum Artikel...\n\nEinleitung könnte so beginnen...\n\nHauptteil: verschiedene Aspekte beleuchten...',
  },
  {
    name: 'idee_3am.md',
    type: 'file',
    content: '# Idee um 3 Uhr morgens\n\nSpontane Gedanken:\n\n- Was wäre wenn...\n- Interessanter Ansatz...\n- Könnte funktionieren...',
  },
  {
    name: 'erinnerung.txt',
    type: 'file',
    content: 'Erinnerung:\n\nNicht vergessen:\n- Melina anrufen\n- Termin bestätigen\n- Dokumente sortieren',
  },
]

// Desktop-Ordner-Positionen
export const DESKTOP_FOLDER_POSITIONS: DesktopFolder[] = [
  // Erste Reihe
  { name: 'REDAKTION', top: '70px', left: '30px', files: DESKTOP_FOLDERS.REDAKTION },
  { name: 'QUELLEN', top: '70px', left: '130px', files: DESKTOP_FOLDERS.QUELLEN },
  { name: 'BILDER', top: '70px', left: '230px', files: DESKTOP_FOLDERS.BILDER },
  { name: 'AUDIO', top: '70px', left: '330px', files: DESKTOP_FOLDERS.AUDIO },
  { name: 'DOKUMENTE', top: '70px', left: '430px', files: DESKTOP_FOLDERS.DOKUMENTE },
  { name: 'ALT', top: '70px', left: '530px', files: DESKTOP_FOLDERS.ALT },
  // Zweite Reihe (ersetzt die alte zweite Reihe)
  { name: 'TRAVELS', top: '170px', left: '30px', files: DESKTOP_FOLDERS.TRAVELS },
  { name: 'FRIENDS', top: '170px', left: '130px', files: DESKTOP_FOLDERS.FRIENDS },
  { name: 'FINANZEN', top: '170px', left: '230px', files: DESKTOP_FOLDERS.FINANZEN },
  { name: 'IDEEN', top: '170px', left: '330px', files: DESKTOP_FOLDERS.IDEEN },
  { name: 'RANDOM', top: '170px', left: '430px', files: DESKTOP_FOLDERS.RANDOM },
  { name: 'BACKUP_MISC', top: '170px', left: '530px', files: DESKTOP_FOLDERS.BACKUP_MISC },
]
