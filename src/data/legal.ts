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
      de: `Verantwortlicher ist der im Impressum genannte Betreiber (NimbusIT, Inhaber Antonio Lovrić). Anfragen zum Datenschutz: ${contactEmail}`,
      en: `The controller is the operator named in the imprint (NimbusIT, owner Antonio Lovrić). Privacy requests: ${contactEmail}`,
    },
  },
  // Draft from official provider sources, checked 2026-10-26 (terms change; re-check
  // before release). Entity and address: Cloudflare Self-Serve Subscription Agreement
  // §20 (https://www.cloudflare.com/terms/, updated 2025-09-12) and DPA v6.4 Annex 1
  // (https://www.cloudflare.com/cloudflare-customer-dpa/). Processor role and DPA:
  // Terms §6.1. Logs: "most often IP addresses", kept "for a limited period of time"
  // (https://www.cloudflare.com/trust-hub/gdpr/,
  // https://www.cloudflare.com/trust-hub/law-enforcement/). NEL: Report-To/NEL
  // headers observed on nimbusit-web.pages.dev on 2026-10-26, fields per
  // https://developers.cloudflare.com/network-error-logging/. No Set-Cookie observed.
  // TODO: Log retention period and who at Cloudflare can access logs are not published.
  // TODO: Re-check cookies once nimbusit.hr is attached (Bot Fight Mode/Bot Management set __cf_bm).
  {
    label: { de: 'Website-Hosting, technische Dienste und Protokolldaten', en: 'Website hosting, technical services and request logs' },
    value: {
      de: 'Die Website wird über Cloudflare Pages ausgeliefert. Anbieter ist Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. Beim Aufruf der Website verarbeitet Cloudflare technische Verbindungsdaten, insbesondere Ihre IP-Adresse, um die Seiten auszuliefern. Nach den Vertragsbedingungen von Cloudflare handelt Cloudflare dabei als Auftragsverarbeiter; ein Auftragsverarbeitungsvertrag (Data Processing Addendum) ist Bestandteil des Vertrags. Solche Protokolldaten bewahrt Cloudflare nach eigenen Angaben nur für begrenzte Zeit auf; eine konkrete Frist veröffentlicht Cloudflare nicht. Tritt beim Laden der Website ein Netzwerkfehler auf, kann Ihr Browser einen Fehlerbericht (u. a. aufgerufene Adresse und Fehlerart) an Cloudflare senden (Network Error Logging). Die Website selbst setzt keine Cookies. Stand der Anbieterangaben: 26.10.2026.',
      en: 'The website is delivered via Cloudflare Pages. The provider is Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. When you visit the website, Cloudflare processes technical connection data, in particular your IP address, to deliver the pages. Under Cloudflare’s terms, Cloudflare acts as a processor; a data processing addendum forms part of the agreement. According to Cloudflare, such log data is kept only for a limited period; Cloudflare does not publish a specific period. If a network error occurs while loading the website, your browser may send an error report (including the requested address and the type of error) to Cloudflare (Network Error Logging). The website itself sets no cookies. Provider information as of 26 October 2026.',
    },
  },
  // Owner-confirmed: Cloudflare Email Routing forwards to a consumer Gmail mailbox
  // read only by the owner. Sources checked 2026-10-26: "we don't look into, queue,
  // or store emails" (https://blog.cloudflare.com/introducing-email-routing/);
  // Activity log lists routing events with status and SPF/DKIM/DMARC results, no
  // retention published (https://developers.cloudflare.com/email-service/observability/logs/);
  // Google Ireland Limited provides services in the EEA
  // (https://policies.google.com/terms, effective 2026-07-30;
  // https://policies.google.com/privacy, effective 2026-10-16).
  // TODO: Activity log retention is not published.
  // TODO: Legal review of Google's role towards senders when a consumer account is used.
  {
    label: { de: 'Bearbeitung von E-Mail-Anfragen', en: 'Handling of email enquiries' },
    value: {
      de: `Wenn Sie an ${contactEmail} schreiben, wird Ihre Nachricht über den Dienst Cloudflare Email Routing an ein Gmail-Postfach des Inhabers weitergeleitet und dort gespeichert. Cloudflare Email Routing (Cloudflare, Inc.) leitet Nachrichten nach Angaben von Cloudflare in Echtzeit weiter, ohne sie einzusehen, zwischenzuspeichern oder zu speichern; die Kopfzeilen bleiben erhalten. Für die Weiterleitung führt Cloudflare jedoch ein Aktivitätsprotokoll mit Metadaten zu den Nachrichten (z. B. Zustellstatus und Ergebnisse der Absenderprüfung); eine Speicherdauer dafür veröffentlicht Cloudflare nicht. Anbieter des Gmail-Postfachs ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; Google verarbeitet die Daten nach seiner Datenschutzerklärung (policies.google.com/privacy). Verarbeitet werden Ihre E-Mail-Adresse, gegebenenfalls Ihr Name und weitere Angaben aus der Nachricht, Inhalt und Anhänge sowie technische Kopfzeilen (z. B. Zeitstempel und beteiligte Mailserver). Die Nachrichten liest ausschließlich der Inhaber. Stand der Anbieterangaben: 26.10.2026.`,
      en: `When you write to ${contactEmail}, your message is forwarded by the Cloudflare Email Routing service to a Gmail mailbox of the owner and stored there. According to Cloudflare, Cloudflare Email Routing (Cloudflare, Inc.) forwards messages in real time without looking into, queuing or storing them; the headers are preserved. For forwarding, however, Cloudflare keeps an activity log with metadata about the messages (such as delivery status and sender authentication results); Cloudflare does not publish a retention period for it. The Gmail mailbox is provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland; Google processes the data under its privacy policy (policies.google.com/privacy). This involves your email address, your name and other details if you include them, the content and attachments, and technical headers (such as timestamps and the mail servers involved). Only the owner reads the messages. Provider information as of 26 October 2026.`,
    },
  },
  {
    label: { de: 'Zwecke und Rechtsgrundlagen', en: 'Purposes and legal bases' },
    value: {
      de: 'Die Daten werden verarbeitet, um Ihre Anfrage zu beantworten und ein mögliches Projekt anzubahnen oder durchzuführen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf einen Vertrag zielt, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Die Aufbewahrung aufgrund gesetzlicher Aufbewahrungspflichten erfolgt nach Art. 6 Abs. 1 lit. c DSGVO. Die Bereitstellung der Website einschließlich der technischen Verbindungsdaten beruht auf Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Die Angabe von Daten in einer Anfrage ist freiwillig; ohne E-Mail-Adresse ist keine Antwort möglich.',
      en: 'The data is processed to answer your enquiry and to prepare or carry out a possible project. The legal basis is Art. 6(1)(b) GDPR where the enquiry concerns a contract, and otherwise Art. 6(1)(f) GDPR (legitimate interest in answering enquiries). Retention required by statutory record-keeping obligations is based on Art. 6(1)(c) GDPR. Providing the website, including technical connection data, is based on Art. 6(1)(f) GDPR (legitimate interest in secure and stable operation). Providing data in an enquiry is voluntary; without an email address no reply is possible.',
    },
  },
  // Draft wording for legal review. No statutory duration is stated: the exact
  // period is not confirmed from the law itself. TODO: Add hosting log retention
  // once hosting is set up.
  {
    label: { de: 'Speicherdauer und Löschregeln', en: 'Retention periods and deletion rules' },
    value: {
      de: 'Anfragen, aus denen kein Auftrag entsteht, werden sechs Monate nach der letzten Nachricht gelöscht. Korrespondenz, die eine Geschäftsunterlage darstellt, wird so lange aufbewahrt, wie es die gesetzlichen Aufbewahrungspflichten verlangen.',
      en: 'Enquiries that do not lead to an engagement are deleted six months after the last message. Correspondence that constitutes a business record is kept for as long as statutory retention obligations require.',
    },
  },
  // Sources checked 2026-10-26: Cloudflare locations and transfers
  // (https://www.cloudflare.com/trust-hub/gdpr/; DPA v6.4 SCCs and DPF clause,
  // https://www.cloudflare.com/cloudflare-customer-dpa/; Privacy Policy 2025-11-04,
  // https://www.cloudflare.com/privacypolicy/). Google: servers outside the user's
  // country (https://policies.google.com/privacy); Google LLC DPF and SCCs
  // (https://policies.google.com/privacy/frameworks, effective 2025-08-23).
  {
    label: { de: 'Empfänger, Verarbeitungsorte und Übermittlungen', en: 'Recipients, processing locations and transfers' },
    value: {
      de: 'Empfänger sind Cloudflare, Inc. (USA) für Hosting und E-Mail-Weiterleitung sowie Google Ireland Limited (Irland) für das E-Mail-Postfach. Cloudflare betreibt ein weltweites Netz von Rechenzentren und verarbeitet Daten auch außerhalb des EWR, insbesondere in den USA. Cloudflare ist nach eigenen Angaben nach dem EU-US Data Privacy Framework zertifiziert; soweit dieses nicht greift, sieht der Auftragsverarbeitungsvertrag Standardvertragsklauseln der EU-Kommission vor. Google kann Daten auf Servern außerhalb Ihres Landes verarbeiten; nach Angaben von Google ist die Google LLC nach dem EU-US Data Privacy Framework zertifiziert, und Google nutzt, wo erforderlich, Standardvertragsklauseln. Stand der Anbieterangaben: 26.10.2026.',
      en: 'Recipients are Cloudflare, Inc. (USA) for hosting and email forwarding, and Google Ireland Limited (Ireland) for the mailbox. Cloudflare operates a global network of data centres and also processes data outside the EEA, in particular in the United States. According to Cloudflare, it is certified under the EU-US Data Privacy Framework; where that does not apply, the data processing addendum provides for the European Commission’s standard contractual clauses. Google may process data on servers outside your country; according to Google, Google LLC is certified under the EU-US Data Privacy Framework, and Google relies on standard contractual clauses where required. Provider information as of 26 October 2026.',
    },
  },
  {
    label: { de: 'Ihre Rechte, Beschwerderecht und Datenschutzbeauftragter', en: 'Your rights, right to complain and data protection officer' },
    value: {
      de: `Sie haben nach Maßgabe der Art. 15 bis 21 DSGVO das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit sowie das Recht, der Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zu widersprechen. Anfragen richten Sie an ${contactEmail}. Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in Ihrem Aufenthaltsmitgliedstaat oder bei der für den Inhaber zuständigen kroatischen Agencija za zaštitu osobnih podataka (AZOP, azop.hr). Eine automatisierte Entscheidungsfindung findet nicht statt. Ein Datenschutzbeauftragter ist nicht benannt.`,
      en: `Subject to Articles 15 to 21 GDPR, you have the right of access, rectification, erasure, restriction of processing and data portability, and the right to object to processing based on Art. 6(1)(f) GDPR. Please send requests to ${contactEmail}. You may lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in particular in your member state of residence or with the Croatian authority responsible for the owner, the Agencija za zaštitu osobnih podataka (AZOP, azop.hr). No automated decision-making takes place. No data protection officer has been appointed.`,
    },
  },
];

// Statements about this static implementation; keep in sync with the code.
export const technicalObservations: Record<Locale, string[]> = {
  de: [
    'Diese Website verwendet keine Analysewerkzeuge, Marketing-Tracker, extern eingebetteten Medien oder Kontaktformulare. Bilder, SVGs und CSS werden lokal mit der Website ausgeliefert; Schriften stellt das Betriebssystem bereit. Es wird kein clientseitiges JavaScript eingesetzt, das Cookies oder Browserspeicher beschreibt. Eine Einwilligungsabfrage ist daher nicht erforderlich.',
    'Der E-Mail-Link öffnet das E-Mail-Programm des Besuchers. Die Website versendet die Nachricht nicht selbst.',
  ],
  en: [
    'This website uses no analytics tools, marketing trackers, externally embedded media or contact forms. Images, SVGs and CSS are served locally with the website; fonts come from the operating system. No client-side JavaScript is used that writes cookies or browser storage. A consent banner is therefore not required.',
    'The email link opens the visitor’s email application. The website does not send the message itself.',
  ],
};
