import { contactEmail, type Locale } from './site';

type LegalDetail = {
  label: Record<Locale, string>;
  // null means unverified or undecided, never an empty public claim.
  value: Record<Locale, string> | null;
};

// Only approved public information belongs here. Never add private mailbox
// addresses, credentials, contracts or account records. Keep legal pages marked
// as drafts; filling these fields does not approve publication or legal wording.
export const businessDetails: LegalDetail[] = [
  { label: { de: 'Geschäftliche E-Mail', en: 'Business email' }, value: { de: contactEmail, en: contactEmail } },
  {
    label: { de: 'Vollständiger rechtlicher Name', en: 'Full legal name' },
    value: {
      de: 'NimbusIT, Obrt za informatičke i poslovne usluge, Inhaber: Antonio Lovrić',
      en: 'NimbusIT, Obrt za informatičke i poslovne usluge, owner: Antonio Lovrić',
    },
  },
  {
    label: { de: 'Rechtsform und Niederlassungsland', en: 'Legal form and country of establishment' },
    value: { de: 'Einzelunternehmen (Obrt), Kroatien', en: 'Sole proprietorship (obrt), Croatia' },
  },
  {
    label: { de: 'Vollständige Geschäftsanschrift', en: 'Full business address' },
    value: {
      de: 'Ulica Mate Topalovića 1, 35201 Brodski Zdenci, Kroatien',
      en: 'Ulica Mate Topalovića 1, 35201 Brodski Zdenci, Croatia',
    },
  },
  // Owner approved publishing the OIB. Representative, MBO and VAT-ID applicability
  // remain open for legal review (no VAT-ID issued yet).
  {
    label: { de: 'Steuernummer (OIB)', en: 'Tax number (OIB)' },
    value: { de: '75412907772', en: '75412907772' },
  },
  // TODO: Approve any further contact or publication disclosures actually required
  // for this operator and service. Do not infer them from the target language.
  { label: { de: 'Weitere Angaben nach Prüfung der Veröffentlichungsvorgaben', en: 'Further details after review of publication requirements' }, value: null },
];

// Draft wording based on owner-confirmed facts, pending legal review; rendered
// under a draft heading. Do not insert unconfirmed providers, retention periods,
// legal bases or compliance claims; keep unresolved topics null.
export const privacyDetails: LegalDetail[] = [
  {
    label: { de: 'Verantwortlicher und Datenschutzkontakt', en: 'Controller and privacy contact' },
    value: {
      de: `Verantwortlicher ist der oben genannte Betreiber (NimbusIT, Inhaber Antonio Lovrić). Anfragen zum Datenschutz: ${contactEmail}`,
      en: `The controller is the operator named above (NimbusIT, owner Antonio Lovrić). Privacy requests: ${contactEmail}`,
    },
  },
  // TODO: Confirm the actual website host/CDN, enabled features and request logs.
  { label: { de: 'Website-Hosting, technische Dienste und Protokolldaten', en: 'Website hosting, technical services and request logs' }, value: null },
  // Owner-confirmed: Cloudflare Email Routing forwards to a Gmail mailbox read only
  // by the owner. TODO: Verify Gmail account type and provider entities privately.
  {
    label: { de: 'Bearbeitung von E-Mail-Anfragen', en: 'Handling of email enquiries' },
    value: {
      de: `Wenn Sie an ${contactEmail} schreiben, wird Ihre Nachricht über den Dienst Cloudflare Email Routing an ein Gmail-Postfach des Inhabers weitergeleitet und dort gespeichert. Verarbeitet werden Ihre E-Mail-Adresse, gegebenenfalls Ihr Name und weitere Angaben aus der Nachricht, Inhalt und Anhänge sowie technische Kopfzeilen (z. B. Zeitstempel und beteiligte Mailserver). Die Nachrichten liest ausschließlich der Inhaber.`,
      en: `When you write to ${contactEmail}, your message is forwarded by the Cloudflare Email Routing service to a Gmail mailbox of the owner and stored there. This involves your email address, your name and other details if you include them, the content and attachments, and technical headers (such as timestamps and the mail servers involved). Only the owner reads the messages.`,
    },
  },
  {
    label: { de: 'Zwecke und Rechtsgrundlagen', en: 'Purposes and legal bases' },
    value: {
      de: 'Die Daten werden verarbeitet, um Ihre Anfrage zu beantworten und ein mögliches Projekt anzubahnen oder durchzuführen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf einen Vertrag zielt, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Die Aufbewahrung aufgrund gesetzlicher Aufbewahrungspflichten erfolgt nach Art. 6 Abs. 1 lit. c DSGVO. Die Angabe von Daten ist freiwillig; ohne E-Mail-Adresse ist keine Antwort möglich.',
      en: 'The data is processed to answer your enquiry and to prepare or carry out a possible project. The legal basis is Art. 6(1)(b) GDPR where the enquiry concerns a contract, and otherwise Art. 6(1)(f) GDPR (legitimate interest in answering enquiries). Retention required by statutory record-keeping obligations is based on Art. 6(1)(c) GDPR. Providing data is voluntary; without an email address no reply is possible.',
    },
  },
  // Owner-approved rule; statutory period per Opći porezni zakon Art. 66 and 108(2).
  // TODO: Add hosting log retention once hosting is set up.
  {
    label: { de: 'Speicherdauer und Löschregeln', en: 'Retention periods and deletion rules' },
    value: {
      de: 'Anfragen, aus denen kein Auftrag entsteht, werden sechs Monate nach der letzten Nachricht gelöscht. Projektkorrespondenz wird für die Dauer der Zusammenarbeit gespeichert. Danach werden Nachrichten, die steuerlich relevante Unterlagen darstellen (z. B. Angebote, Aufträge, Rechnungen), zehn Jahre ab Ende des Jahres aufbewahrt, in dem die Steuerpflicht entstanden ist (Art. 66 und 108 des kroatischen Allgemeinen Steuergesetzes, Opći porezni zakon); übrige Korrespondenz wird nach Ende der Zusammenarbeit gelöscht.',
      en: 'Enquiries that do not lead to an engagement are deleted six months after the last message. Project correspondence is kept for the duration of the collaboration. Afterwards, messages that constitute tax-relevant records (such as quotes, orders and invoices) are kept for ten years from the end of the year in which the tax liability arose (Articles 66 and 108 of the Croatian General Tax Act, Opći porezni zakon); other correspondence is deleted when the collaboration ends.',
    },
  },
  // TODO: Verify provider roles, contracting entities and transfer safeguards.
  {
    label: { de: 'Empfänger, Verarbeitungsorte und Übermittlungen', en: 'Recipients, processing locations and transfers' },
    value: {
      de: 'Empfänger im Rahmen der Weiterleitung und Speicherung von E-Mails sind Cloudflare (Email Routing) und Google (Gmail). Beide Anbieter können Daten auch außerhalb der EU bzw. des EWR, insbesondere in den USA, verarbeiten. Die vertraglichen Rollen der Anbieter, die zuständigen Vertragsgesellschaften und die Grundlage etwaiger Übermittlungen in Drittländer (z. B. Angemessenheitsbeschluss zum EU-US Data Privacy Framework oder Standardvertragsklauseln) werden vor der Veröffentlichung geprüft und ergänzt.',
      en: 'Recipients involved in forwarding and storing email are Cloudflare (Email Routing) and Google (Gmail). Both providers may process data outside the EU/EEA, in particular in the United States. The providers’ contractual roles, the contracting entities and the basis for any transfers to third countries (such as the adequacy decision for the EU-US Data Privacy Framework or standard contractual clauses) will be reviewed and added before publication.',
    },
  },
  // TODO: Legal review of DPO applicability (Art. 37 GDPR).
  {
    label: { de: 'Ihre Rechte, Beschwerderecht und Datenschutzbeauftragter', en: 'Your rights, right to complain and data protection officer' },
    value: {
      de: `Sie haben nach Maßgabe der Art. 15 bis 21 DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit sowie das Recht, der Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zu widersprechen. Anfragen richten Sie an ${contactEmail}. Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in Ihrem Aufenthaltsmitgliedstaat oder bei der für den Inhaber zuständigen kroatischen Agencija za zaštitu osobnih podataka (AZOP, azop.hr). Eine automatisierte Entscheidungsfindung findet nicht statt. Nach vorläufiger Einschätzung ist kein Datenschutzbeauftragter zu benennen (Art. 37 DSGVO); diese Einschätzung wird rechtlich geprüft.`,
      en: `Subject to Articles 15 to 21 GDPR, you have the right of access, rectification, erasure, restriction of processing and data portability, and the right to object to processing based on Art. 6(1)(f) GDPR. Please send requests to ${contactEmail}. You may lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in particular in your member state of residence or with the Croatian authority responsible for the owner, the Agencija za zaštitu osobnih podataka (AZOP, azop.hr). No automated decision-making takes place. Based on a preliminary assessment, no data protection officer needs to be appointed (Art. 37 GDPR); this assessment is subject to legal review.`,
    },
  },
];

// Repository observations only: these describe this static implementation,
// not a final privacy notice or an audit of provider/account settings.
export const technicalObservations: Record<Locale, string[]> = {
  de: [
    'Die aktuelle statische Implementierung enthält keine Analysewerkzeuge, Marketing-Tracker, extern eingebetteten Medien oder Kontaktformulare. Bilder, SVGs und CSS werden lokal mit der Website ausgeliefert; Schriften stellt das Betriebssystem bereit. Es ist kein clientseitiges JavaScript eingebunden, das Cookies oder Browserspeicher beschreibt.',
    'Der E-Mail-Link öffnet das E-Mail-Programm des Besuchers. Die Website versendet die Nachricht nicht selbst. Die anschließende E-Mail-Verarbeitung sowie Hosting-Dienste und mögliche Protokolldaten sind für die endgültigen Datenschutzhinweise noch zu prüfen.',
  ],
  en: [
    'The current static implementation contains no analytics tools, marketing trackers, externally embedded media or contact forms. Images, SVGs and CSS are served locally with the website; fonts come from the operating system. No client-side JavaScript is included that writes cookies or browser storage.',
    'The email link opens the visitor’s email application. The website does not send the message itself. Subsequent email processing, hosting services and any request logs still need review for the final privacy notice.',
  ],
};
