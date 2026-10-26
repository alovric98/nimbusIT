export type Locale = 'de' | 'en';
export type Page = 'home' | 'services' | 'powershell' | 'about' | 'contact' | 'imprint' | 'privacy';
export const site = 'https://nimbusit.hr';
// Review build unless PUBLIC_RELEASE=true is set. Only an approved release may set it.
export const publicRelease = import.meta.env.PUBLIC_RELEASE === 'true';
// While true, legal pages are drafts: noindex and out of the sitemap even in a release build.
// Set false by owner decision on 2026-10-26 to publish without a separate legal review.
export const legalDraft = false;
export const legalPages: Page[] = ['imprint', 'privacy'];
export const contactEmail = 'info@nimbusit.hr';
export const pages: Page[] = ['home', 'services', 'powershell', 'about', 'contact', 'imprint', 'privacy'];
export const locales: Locale[] = ['de', 'en'];
export const routes: Record<Locale, Record<Page, string>> = {
  de: { home: '/', services: '/leistungen/', powershell: '/powershell-automatisierung/', about: '/ueber-uns/', contact: '/kontakt/', imprint: '/impressum/', privacy: '/datenschutz/' },
  en: { home: '/en/', services: '/en/services/', powershell: '/en/powershell-automation/', about: '/en/about/', contact: '/en/contact/', imprint: '/en/imprint/', privacy: '/en/privacy/' },
};
export const labels = {
  de: {
    home: 'Startseite', services: 'Leistungen', about: 'Über Nimbus IT', contact: 'Kontakt', imprint: 'Impressum', privacy: 'Datenschutz',
    powershell: 'PowerShell-Automatisierung',
    cta: 'Projekt besprechen', skip: 'Zum Inhalt', nav: 'Hauptnavigation', languages: 'Sprache wählen',
    preview: 'Website-Vorschau', previewDetail: 'Rechtliche Angaben noch in Vorbereitung.',
    footer: 'Infrastruktur automatisieren. Freiraum schaffen.', independent: 'Unabhängige IT-Beratung aus Kroatien. Für IT-Dienstleister im deutschsprachigen Raum.',
    back: 'Zur Startseite',
  },
  en: {
    home: 'Home', services: 'Services', about: 'About Nimbus IT', contact: 'Contact', imprint: 'Imprint', privacy: 'Privacy',
    powershell: 'PowerShell Automation',
    cta: 'Discuss a project', skip: 'Skip to content', nav: 'Main navigation', languages: 'Select language',
    preview: 'Website preview', previewDetail: 'Legal information is still in preparation.',
    footer: 'Automate infrastructure. Make room for progress.', independent: 'Independent IT consulting from Croatia. For IT service providers in German-speaking markets.',
    back: 'Back to home',
  },
} as const;
export const metadata: Record<Locale, Record<Page, { title: string; description: string }>> = {
  de: {
    home: { title: 'Infrastruktur automatisieren. IT-Teams entlasten. | Nimbus IT', description: 'Unabhängige IT-Beratung für Systemhäuser und MSPs: PowerShell-Automatisierung sowie Unterstützung für Windows- und Azure-Infrastrukturprojekte.' },
    services: { title: 'Infrastruktur-Automatisierung, Windows & Azure | Nimbus IT', description: 'Wiederkehrende Aufgaben automatisieren, Infrastrukturprojekte umsetzen und Azure-Konfigurationen prüfen. Technische Unterstützung für IT-Dienstleister.' },
    powershell: { title: 'PowerShell Automatisierung für IT-Dienstleister | Nimbus IT', description: 'PowerShell-Automatisierung für Systemhäuser und MSPs: VM-Bereitstellung, Windows-Konfiguration und Deployments – mit Tests, Dokumentation und direkter Übergabe.' },
    about: { title: 'Über Nimbus IT – unabhängige IT-Beratung aus Kroatien', description: 'Ein direkter Ansprechpartner für Infrastruktur-Automatisierung, Windows und Azure. Vier Jahre IT-Berufserfahrung und Deutschkenntnisse auf C1-Niveau.' },
    contact: { title: 'Kontakt – Ihr Infrastrukturprojekt besprechen | Nimbus IT', description: 'Besprechen Sie Ihr PowerShell-, Windows- oder Azure-Projekt direkt mit Nimbus IT. Schreiben Sie an info@nimbusit.hr und skizzieren Sie Ihre Aufgabe.' },
    imprint: legalDraft
      ? { title: 'Impressum – Entwurf | Nimbus IT', description: 'Entwurfsseite. Die verifizierten Unternehmensangaben und rechtlichen Informationen werden vor einer Veröffentlichung ergänzt.' }
      : { title: 'Impressum | Nimbus IT', description: 'Impressum von Nimbus IT: Betreiber, Rechtsform, Anschrift, Kontakt und Steuernummer des kroatischen Einzelunternehmens.' },
    privacy: legalDraft
      ? { title: 'Datenschutz – Entwurf | Nimbus IT', description: 'Entwurfsseite. Die Datenschutzhinweise werden nach Festlegung der technischen Dienste und Prüfung der rechtlichen Angaben ergänzt.' }
      : { title: 'Datenschutz | Nimbus IT', description: 'Datenschutzerklärung von Nimbus IT: Hosting über Cloudflare, Bearbeitung von E-Mail-Anfragen, Rechtsgrundlagen, Speicherdauer und Ihre Rechte.' },
  },
  en: {
    home: { title: 'Automate infrastructure. Support your IT team. | Nimbus IT', description: 'Independent IT consulting for IT service providers and MSPs: PowerShell automation and engineering support for Windows and Azure infrastructure projects.' },
    services: { title: 'Infrastructure automation, Windows & Azure | Nimbus IT', description: 'Automate recurring tasks, deliver infrastructure projects and review Azure configurations. Practical engineering support for IT service providers.' },
    powershell: { title: 'PowerShell Automation for IT Service Providers | Nimbus IT', description: 'PowerShell automation for IT service providers and MSPs: VM provisioning, Windows configuration and deployments, with testing, documentation and direct handover.' },
    about: { title: 'About Nimbus IT – independent IT consulting from Croatia', description: 'One direct point of contact for infrastructure automation, Windows and Azure. Four years of professional IT experience and C1 German proficiency.' },
    contact: { title: 'Contact – Discuss your infrastructure project | Nimbus IT', description: 'Discuss your PowerShell, Windows or Azure project directly with Nimbus IT. Email info@nimbusit.hr with an outline of your task and intended outcome.' },
    imprint: legalDraft
      ? { title: 'Imprint – draft | Nimbus IT', description: 'Draft page. Verified business details and legal information will be added before publication.' }
      : { title: 'Imprint | Nimbus IT', description: 'Imprint of Nimbus IT: operator, legal form, address, contact and tax number of the Croatian sole proprietorship.' },
    privacy: legalDraft
      ? { title: 'Privacy – draft | Nimbus IT', description: 'Draft page. Privacy information will be added once the technical services and legal details have been confirmed.' }
      : { title: 'Privacy | Nimbus IT', description: 'Privacy notice of Nimbus IT: hosting via Cloudflare, handling of email enquiries, legal bases, retention periods and your rights.' },
  },
};

type Service = {
  id: string;
  number: string;
  title: string;
  summary: string;
  tags: string[];
  approachTitle: string;
  approach: string;
  handoverTitle: string;
  handover: string;
  itemsTitle: string;
  itemsNote?: string;
  items: string[];
};
export const services: Record<Locale, Service[]> = {
  de: [
    {
      id: 'automation', number: '01', title: 'Infrastructure Automation',
      summary: 'Weniger manuelle Routine. Mehr wiederholbare Abläufe.',
      tags: ['PowerShell', 'Provisionierung', 'Deployment'],
      approachTitle: 'Von manuellen Schritten zum Skript',
      approach: 'Ich fasse wiederkehrende Bereitstellungs- und Konfigurationsschritte in parametrisierbaren PowerShell-Workflows zusammen.',
      handoverTitle: 'Im Betrieb nachvollziehbar',
      handover: 'Eingabeprüfungen, Fehlerbehandlung und Protokolle machen den Ablauf prüfbar. Die Dokumentation beschreibt Voraussetzungen und Anpassungsmöglichkeiten.',
      itemsTitle: 'Konkrete Beispielaufgaben',
      itemsNote: 'Je nach Umgebung und vereinbartem Umfang:',
      items: [
        'Virtuelle Maschinen aus einer Konfigurationsdatei mit Namen, CPU, RAM und Netzwerkzuordnung bereitstellen.',
        'Windows-Server-Rollen und Dienste nach einer vereinbarten Basiskonfiguration einrichten und ihren Status prüfen.',
        'Vor einem Deployment Voraussetzungen prüfen, Schritte protokollieren und das Ergebnis als Bericht ausgeben.',
      ],
    },
    {
      id: 'infrastructure', number: '02', title: 'Cloud & Windows Infrastructure',
      summary: 'Zusätzliche technische Kapazität für Ihre Infrastrukturprojekte.',
      tags: ['Microsoft Azure', 'Windows Server', 'Virtualisierung'],
      approachTitle: 'Ein Arbeitspaket übernehmen',
      approach: 'Während Ihr Tagesgeschäft weiterläuft, übernehme ich vereinbarte Konfigurations- und Deployment-Aufgaben. Architekturentscheidungen und Kundenbeziehung bleiben bei Ihrem Team.',
      handoverTitle: 'An Ihren Betrieb anschließen',
      handover: 'Umsetzung und Tests richten sich nach Ihren Standards. Konfigurationen und offene Punkte werden für die Übergabe festgehalten.',
      itemsTitle: 'Möglicher Umfang',
      items: [
        'Azure-Ressourcen konfigurieren und bereitstellen',
        'Windows Server und virtuelle Umgebungen einrichten',
        'Deployments begleiten und die vereinbarten Funktionen prüfen',
      ],
    },
    {
      id: 'security', number: '03', title: 'Azure Security & Configuration Automation',
      summary: 'Konfigurationen systematisch prüfen. Abweichungen gezielt bearbeiten.',
      tags: ['Konfigurationschecks', 'CIS-Kontrollen', 'Reporting'],
      approachTitle: 'Prüfumfang festlegen',
      approach: 'Ich automatisiere vereinbarte Azure-Konfigurationschecks und ausgewählte CIS-Benchmark-Kontrollen. Prüfgrundlage und Grenzen werden vorab festgelegt.',
      handoverTitle: 'Abweichungen gezielt bearbeiten',
      handover: 'Berichte zeigen Befunde für die technische Bewertung durch Ihr Team. Bei Korrekturen und der anschließenden Nachprüfung unterstütze ich Sie.',
      itemsTitle: 'Von der Prüfung zur Maßnahme',
      items: [
        'Ist-Konfiguration mit vereinbarten Sollvorgaben vergleichen',
        'Abweichungen und nicht prüfbare Einstellungen ausweisen',
        'Freigegebene Änderungen umsetzen und erneut prüfen',
      ],
    },
  ],
  en: [
    {
      id: 'automation', number: '01', title: 'Infrastructure Automation',
      summary: 'Less manual routine. More repeatable workflows.',
      tags: ['PowerShell', 'Provisioning', 'Deployment'],
      approachTitle: 'From manual steps to scripts',
      approach: 'I turn recurring provisioning and configuration steps into parameterised PowerShell workflows.',
      handoverTitle: 'Traceable in operation',
      handover: 'Input validation, error handling and logs make the workflow reviewable. Documentation explains prerequisites and how to adapt it.',
      itemsTitle: 'Example tasks',
      itemsNote: 'Depending on your environment and the agreed scope:',
      items: [
        'Provision virtual machines from a configuration file specifying names, CPU, RAM and network assignments.',
        'Configure Windows Server roles and services to an agreed baseline and check their status.',
        'Check prerequisites before a deployment, log its steps and produce a report of the outcome.',
      ],
    },
    {
      id: 'infrastructure', number: '02', title: 'Cloud & Windows Infrastructure',
      summary: 'Additional engineering capacity for your infrastructure projects.',
      tags: ['Microsoft Azure', 'Windows Server', 'Virtualisation'],
      approachTitle: 'Take on a defined work package',
      approach: 'While your daily operations continue, I take on agreed configuration and deployment tasks. Your team retains ownership of architecture decisions and the customer relationship.',
      handoverTitle: 'Fit into your operations',
      handover: 'Implementation and testing follow your standards. Configurations and outstanding issues are recorded for handover.',
      itemsTitle: 'Possible scope',
      items: [
        'Configure and provision Azure resources',
        'Set up Windows Server and virtual environments',
        'Support deployments and check the agreed functionality',
      ],
    },
    {
      id: 'security', number: '03', title: 'Azure Security & Configuration Automation',
      summary: 'Review configurations systematically. Address deviations precisely.',
      tags: ['Configuration checks', 'CIS controls', 'Reporting'],
      approachTitle: 'Define the review scope',
      approach: 'I automate agreed Azure configuration checks and selected CIS benchmark controls. The review criteria and limitations are defined in advance.',
      handoverTitle: 'Address deviations precisely',
      handover: 'Reports present findings for technical assessment by your team. I support remediation and subsequent rechecks.',
      itemsTitle: 'From findings to action',
      items: [
        'Compare the current configuration with agreed requirements',
        'Report deviations and settings that could not be checked',
        'Apply approved changes and repeat the checks',
      ],
    },
  ],
};
