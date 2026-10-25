export type Locale = 'de' | 'en';
export type Page = 'home' | 'services' | 'about' | 'contact' | 'imprint' | 'privacy';
export const site = 'https://nimbusit.hr';
export const pages: Page[] = ['home', 'services', 'about', 'contact', 'imprint', 'privacy'];
export const locales: Locale[] = ['de', 'en'];
export const routes: Record<Locale, Record<Page, string>> = {
  de: { home: '/', services: '/leistungen/', about: '/ueber-uns/', contact: '/kontakt/', imprint: '/impressum/', privacy: '/datenschutz/' },
  en: { home: '/en/', services: '/en/services/', about: '/en/about/', contact: '/en/contact/', imprint: '/en/imprint/', privacy: '/en/privacy/' },
};
export const labels = {
  de: {
    home: 'Startseite', services: 'Leistungen', about: 'Über Nimbus IT', contact: 'Kontakt', imprint: 'Impressum', privacy: 'Datenschutz',
    cta: 'Projekt besprechen', skip: 'Zum Inhalt', nav: 'Hauptnavigation', languages: 'Sprache wählen',
    preview: 'Website-Vorschau', previewDetail: 'Kontakt und rechtliche Angaben noch in Vorbereitung.',
    footer: 'Infrastruktur automatisieren. Freiraum schaffen.', independent: 'Unabhängige IT-Beratung aus Kroatien. Für IT-Dienstleister im deutschsprachigen Raum.',
    back: 'Zur Startseite',
  },
  en: {
    home: 'Home', services: 'Services', about: 'About Nimbus IT', contact: 'Contact', imprint: 'Imprint', privacy: 'Privacy',
    cta: 'Discuss a project', skip: 'Skip to content', nav: 'Main navigation', languages: 'Select language',
    preview: 'Website preview', previewDetail: 'Contact and legal information are still in preparation.',
    footer: 'Automate infrastructure. Make room for progress.', independent: 'Independent IT consulting from Croatia. For IT service providers in German-speaking markets.',
    back: 'Back to home',
  },
} as const;
export const metadata: Record<Locale, Record<Page, { title: string; description: string }>> = {
  de: {
    home: { title: 'Infrastruktur automatisieren. IT-Teams entlasten. | Nimbus IT', description: 'Unabhängige IT-Beratung für Systemhäuser und MSPs: PowerShell-Automatisierung sowie Unterstützung für Windows- und Azure-Infrastrukturprojekte.' },
    services: { title: 'Infrastruktur-Automatisierung, Windows & Azure | Nimbus IT', description: 'Wiederkehrende Aufgaben automatisieren, Infrastrukturprojekte umsetzen und Azure-Konfigurationen prüfen. Technische Unterstützung für IT-Dienstleister.' },
    about: { title: 'Über Nimbus IT – unabhängige IT-Beratung aus Kroatien', description: 'Ein direkter Ansprechpartner für Infrastruktur-Automatisierung, Windows und Azure. Vier Jahre IT-Berufserfahrung und Deutschkenntnisse auf C1-Niveau.' },
    contact: { title: 'Projekt besprechen – Kontaktvorschau | Nimbus IT', description: 'Informationen zur Vorbereitung Ihrer Projektanfrage. Vorschau: Der Kontaktweg von Nimbus IT wird noch eingerichtet; Anfragen sind noch nicht möglich.' },
    imprint: { title: 'Impressum – Entwurf | Nimbus IT', description: 'Entwurfsseite. Die verifizierten Unternehmensangaben und rechtlichen Informationen werden vor einer Veröffentlichung ergänzt.' },
    privacy: { title: 'Datenschutz – Entwurf | Nimbus IT', description: 'Entwurfsseite. Die Datenschutzhinweise werden nach Festlegung der technischen Dienste und Prüfung der rechtlichen Angaben ergänzt.' },
  },
  en: {
    home: { title: 'Automate infrastructure. Support your IT team. | Nimbus IT', description: 'Independent IT consulting for IT service providers and MSPs: PowerShell automation and engineering support for Windows and Azure infrastructure projects.' },
    services: { title: 'Infrastructure automation, Windows & Azure | Nimbus IT', description: 'Automate recurring tasks, deliver infrastructure projects and review Azure configurations. Practical engineering support for IT service providers.' },
    about: { title: 'About Nimbus IT – independent IT consulting from Croatia', description: 'One direct point of contact for infrastructure automation, Windows and Azure. Four years of professional IT experience and C1 German proficiency.' },
    contact: { title: 'Discuss a project – contact preview | Nimbus IT', description: 'Prepare your project enquiry. Preview: The Nimbus IT contact channel is still being set up; enquiries cannot yet be submitted.' },
    imprint: { title: 'Imprint – draft | Nimbus IT', description: 'Draft page. Verified business details and legal information will be added before publication.' },
    privacy: { title: 'Privacy – draft | Nimbus IT', description: 'Draft page. Privacy information will be added once the technical services and legal details have been confirmed.' },
  },
};

type Service = { id: string; number: string; title: string; summary: string; tags: string[]; problem: string; solution: string; benefit: string; deliverables: string[] };
export const services: Record<Locale, Service[]> = {
  de: [
    { id: 'automation', number: '01', title: 'Infrastructure Automation', summary: 'Weniger manuelle Routine. Mehr wiederholbare Abläufe.', tags: ['PowerShell', 'Provisionierung', 'Deployment'], problem: 'Wenn jede Bereitstellung von Hand erfolgt, kosten wiederkehrende Aufgaben Zeit – und Konfigurationen weichen voneinander ab.', solution: 'Ich überführe geeignete Arbeitsschritte in PowerShell-basierte Workflows: von der Bereitstellung virtueller Maschinen bis zur Konfiguration und zum Deployment.', benefit: 'Nachvollziehbare Abläufe, die Ihr Team wiederverwenden, prüfen und weiterentwickeln kann.', deliverables: ['Skripte und parametrisierbare Workflows', 'Validierung und nachvollziehbare Fehlerbehandlung', 'Dokumentation und technische Übergabe'] },
    { id: 'infrastructure', number: '02', title: 'Cloud & Windows Infrastructure', summary: 'Zusätzliche technische Kapazität für Ihre Infrastrukturprojekte.', tags: ['Microsoft Azure', 'Windows Server', 'Virtualisierung'], problem: 'Das Tagesgeschäft läuft weiter, während Migrationen, Deployments und neue Umgebungen vorbereitet werden müssen.', solution: 'Ich unterstütze Ihr Team bei klar abgegrenzten Arbeitspaketen rund um Azure, Windows Server, Virtualisierung und Infrastrukturkonfiguration.', benefit: 'Sie erhalten direkte Unterstützung bei der Umsetzung und behalten die Verantwortung für Architektur und Kundenbeziehung.', deliverables: ['Abgestimmte Konfiguration und Bereitstellung', 'Technische Unterstützung bei Deployment und Tests', 'Dokumentierte Ergebnisse für Ihren Betrieb'] },
    { id: 'security', number: '03', title: 'Azure Security & Configuration Automation', summary: 'Konfigurationen systematisch prüfen. Abweichungen gezielt bearbeiten.', tags: ['Konfigurationschecks', 'CIS-Kontrollen', 'Reporting'], problem: 'Manuelle Konfigurationsprüfungen sind aufwendig. Abweichungen lassen sich ohne wiederholbare Checks nur schwer nachverfolgen.', solution: 'Ich automatisiere vereinbarte Konfigurationsprüfungen und ausgewählte CIS-Benchmark-Kontrollen, bereite Ergebnisse auf und unterstütze bei der technischen Behebung.', benefit: 'Ihr Team erhält nachvollziehbare Prüfergebnisse als Grundlage für konkrete technische Maßnahmen.', deliverables: ['Abgestimmter Prüfumfang und ausgewählte Kontrollen', 'Wiederholbare Checks und verständliche Berichte', 'Technische Unterstützung bei Korrektur und Nachprüfung'] },
  ],
  en: [
    { id: 'automation', number: '01', title: 'Infrastructure Automation', summary: 'Less manual routine. More repeatable workflows.', tags: ['PowerShell', 'Provisioning', 'Deployment'], problem: 'When every deployment is manual, recurring tasks take time and configurations can drift.', solution: 'I turn suitable tasks into PowerShell-based workflows, from virtual machine provisioning to configuration and deployment.', benefit: 'Clear workflows your team can reuse, review and extend.', deliverables: ['Scripts and parameterised workflows', 'Validation and clear error handling', 'Documentation and technical handover'] },
    { id: 'infrastructure', number: '02', title: 'Cloud & Windows Infrastructure', summary: 'Additional engineering capacity for your infrastructure projects.', tags: ['Microsoft Azure', 'Windows Server', 'Virtualisation'], problem: 'Day-to-day operations continue while migrations, deployments and new environments need preparation.', solution: 'I support your team with clearly scoped work packages across Azure, Windows Server, virtualisation and infrastructure configuration.', benefit: 'Direct support with implementation, while your team retains ownership of architecture and the customer relationship.', deliverables: ['Agreed configuration and provisioning', 'Technical support with deployment and testing', 'Documented results for your operations team'] },
    { id: 'security', number: '03', title: 'Azure Security & Configuration Automation', summary: 'Review configurations systematically. Address deviations precisely.', tags: ['Configuration checks', 'CIS controls', 'Reporting'], problem: 'Manual configuration reviews take time. Without repeatable checks, deviations are difficult to track.', solution: 'I automate agreed configuration checks and selected CIS benchmark controls, report the results and support technical remediation.', benefit: 'Traceable findings that help your team plan specific technical actions.', deliverables: ['Agreed scope and selected controls', 'Repeatable checks and clear reports', 'Technical remediation and recheck support'] },
  ],
};
