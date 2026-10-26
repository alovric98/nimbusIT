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
  // TODO: Supply the operator's full registered legal name (not just the brand).
  { label: { de: 'Vollständiger rechtlicher Name', en: 'Full legal name' }, value: null },
  // TODO: Verify the legal form and country of establishment against business records.
  { label: { de: 'Rechtsform und Niederlassungsland', en: 'Legal form and country of establishment' }, value: null },
  // TODO: Supply the verified public business address, including country.
  { label: { de: 'Vollständige Geschäftsanschrift', en: 'Full business address' }, value: null },
  // TODO: Establish whether representative, registry and tax disclosures apply;
  // supply exact public details or record a reviewed not-applicable decision.
  { label: { de: 'Vertretung, Register- und Steuerangaben nach Prüfung der Anwendbarkeit', en: 'Representative, registry and tax details after applicability review' }, value: null },
  // TODO: Approve any further contact or publication disclosures actually required
  // for this operator and service. Do not infer them from the target language.
  { label: { de: 'Weitere Angaben nach Prüfung der Veröffentlichungsvorgaben', en: 'Further details after review of publication requirements' }, value: null },
];

// These are unresolved review topics, not prewritten privacy-policy clauses.
// Fill only with fact-checked, approved bilingual wording; do not insert default
// providers, retention periods, legal bases, authorities or compliance claims.
export const privacyDetails: LegalDetail[] = [
  // TODO: Confirm controller identity/address and the contact for privacy requests.
  { label: { de: 'Verantwortlicher und Datenschutzkontakt', en: 'Controller and privacy contact' }, value: null },
  // TODO: Confirm the actual website host/CDN, enabled features and request logs.
  { label: { de: 'Website-Hosting, technische Dienste und Protokolldaten', en: 'Website hosting, technical services and request logs' }, value: null },
  // TODO: Document the owner-confirmed email forwarding and mailbox processing;
  // verify provider entities, account type, access, storage and deletion privately.
  { label: { de: 'Bearbeitung von E-Mail-Anfragen und beteiligte Dienste', en: 'Email enquiry handling and services involved' }, value: null },
  // TODO: Approve purposes and legal bases for each actual processing activity.
  { label: { de: 'Zwecke und Rechtsgrundlagen der tatsächlichen Verarbeitung', en: 'Purposes and legal bases of actual processing' }, value: null },
  // TODO: Supply retention/deletion rules for logs, email and any backups.
  { label: { de: 'Speicherdauer und Löschregeln', en: 'Retention periods and deletion rules' }, value: null },
  // TODO: Verify recipients, processing locations and any transfer arrangements.
  { label: { de: 'Empfänger, Verarbeitungsorte und etwaige Übermittlungen', en: 'Recipients, processing locations and any transfers' }, value: null },
  // TODO: Approve applicable rights, request handling, authority and any further
  // required information. Determine DPO/representative applicability, not identity by guess.
  { label: { de: 'Anwendbare Rechte, Anlaufstellen und weitere Informationspflichten nach Prüfung', en: 'Applicable rights, contact points and further information after review' }, value: null },
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
