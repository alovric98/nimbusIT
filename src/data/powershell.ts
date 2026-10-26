import type { Locale } from './site';

type Entry = { title: string; text: string };
type PowerShellContent = {
  eyebrow: string;
  title: string;
  description: string;
  servicesLink: string;
  challengesLabel: string;
  challengesTitle: string;
  challengesIntro: string;
  challenges: string[];
  examplesLabel: string;
  examplesTitle: string;
  examplesIntro: string;
  examples: Entry[];
  implementationLabel: string;
  implementationTitle: string;
  implementationIntro: string;
  steps: Entry[];
  collaborationLabel: string;
  collaborationTitle: string;
  collaborationLead: string;
  collaborationText: string;
  faqLabel: string;
  faqTitle: string;
  faq: Entry[];
};

export const powershellContent: Record<Locale, PowerShellContent> = {
  de: {
    eyebrow: 'POWERSHELL · INFRASTRUCTURE AUTOMATION',
    title: 'PowerShell-Automatisierung für Windows- und IT-Infrastrukturen',
    description: 'Für IT-Systemhäuser, MSPs und Infrastrukturteams: Ich überführe wiederkehrende Aufgaben in PowerShell-Skripte. So lassen sich Bereitstellung, Konfiguration und Prüfungen als dokumentierte Abläufe ausführen, die Ihr Team nachvollziehen und pflegen kann.',
    servicesLink: 'Alle Infrastrukturleistungen',
    challengesLabel: 'TYPISCHE AUSGANGSLAGE',
    challengesTitle: 'Wenn Routine Engineering-Zeit bindet.',
    challengesIntro: 'Ein sinnvoller Einstieg ist eine klar abgegrenzte Aufgabe, die regelmäßig anfällt und nach festen Regeln ablaufen soll.',
    challenges: [
      'Wiederkehrende Deployments beginnen jedes Mal mit denselben manuellen Schritten.',
      'Windows-Konfigurationen werden einzeln gesetzt und sind schwer zu vergleichen.',
      'Abläufe und lokale Skriptstände unterscheiden sich je nach Bearbeiter.',
      'Im Tagesgeschäft fehlt die Kapazität, bestehende Prozesse zu automatisieren.',
    ],
    examplesLabel: 'PRAKTISCHE ANWENDUNGEN',
    examplesTitle: 'Was sich mit PowerShell automatisieren lässt.',
    examplesIntro: 'Mögliche Arbeitspakete, keine Kundenreferenzen. Der Umfang richtet sich nach Ihren Plattformen, Schnittstellen und Zugriffsrechten.',
    examples: [
      { title: 'VM-Bereitstellung', text: 'Virtuelle Maschinen anhand von Parametern oder einer CSV-Datei bereitstellen: etwa mit Namen, CPU, RAM und Netzwerkzuordnung. Eingaben und vorhandene Ressourcen werden vor der Ausführung geprüft.' },
      { title: 'Windows Server konfigurieren', text: 'Rollen, Features und Dienste nach einer vereinbarten Basiskonfiguration einrichten. Vorhandene Einstellungen prüfen und Abweichungen für die weitere Bearbeitung protokollieren.' },
      { title: 'Software unbeaufsichtigt installieren', text: 'Installationen mit den vom Hersteller unterstützten unbeaufsichtigten Optionen ausführen. Voraussetzungen, Rückgabecodes und ein möglicher Neustart werden im Ablauf berücksichtigt.' },
      { title: 'Deployment-Schritte verbinden', text: 'Vorbereitung, Installation und Konfiguration in eine definierte Reihenfolge bringen. Protokolle und vereinbarte Abbruchbedingungen helfen dabei, einen fehlgeschlagenen Schritt einzuordnen.' },
      { title: 'Validierung und Fehlerbehandlung', text: 'Pflichtwerte, Dateiformate und erforderliche Berechtigungen prüfen. Fehler verständlich melden und Ergebnisse als auswertbaren Bericht bereitstellen.' },
    ],
    implementationLabel: 'WARTBARE UMSETZUNG',
    implementationTitle: 'Ein Skript muss auch nach der Übergabe verständlich sein.',
    implementationIntro: 'Neben der Funktion zählen klare Grenzen, prüfbare Änderungen und die Informationen, die Ihr Team im Betrieb braucht.',
    steps: [
      { title: 'Umfang klären', text: 'Wir legen Eingaben, Zielzustand, Schnittstellen und Abnahmekriterien fest. Zugriffsrechte, Testumgebung und der Umgang mit Fehlern gehören zur Abstimmung.' },
      { title: 'Entwickeln und prüfen', text: 'Ich entwickle die PowerShell-Lösung in kleinen, in Git versionierten Schritten. Änderungen bleiben für Code-Reviews nachvollziehbar; Normal- und Fehlerfälle werden in der vereinbarten Umgebung getestet.' },
      { title: 'Dokumentieren und übergeben', text: 'Ihr Team erhält Skripte, Konfigurationshinweise, Aufrufbeispiele und bekannte Grenzen. In der technischen Übergabe besprechen wir Betrieb, Pflege und offene Punkte.' },
    ],
    collaborationLabel: 'ZUSAMMENARBEIT MIT NIMBUS IT',
    collaborationTitle: 'Direkter technischer Austausch. Klar vereinbarte Aufgaben.',
    collaborationLead: 'Sie arbeiten direkt mit mir als unabhängigem IT-Berater – von der ersten Abstimmung bis zur technischen Übergabe.',
    collaborationText: 'Die Zusammenarbeit ist auf Deutsch möglich, mit C1-Sprachkenntnissen für technische Gespräche. Projektbezogene Unterstützung kann ein einzelnes Skript, die Überarbeitung eines bestehenden Ablaufs oder ein abgegrenztes Automatisierungspaket umfassen. Zuständigkeiten, Umfang und Termine stimmen wir gemeinsam ab.',
    faqLabel: 'HÄUFIGE FRAGEN',
    faqTitle: 'Was vor dem Projekt wichtig ist.',
    faq: [
      { title: 'Welche Aufgaben eignen sich für den Einstieg?', text: 'Wiederkehrende, klar beschreibbare Abläufe mit bekannten Eingaben und einem überprüfbaren Ergebnis. Im ersten Schritt klären wir, welche Teile technisch automatisierbar sind und wo manuelle Entscheidungen nötig bleiben.' },
      { title: 'Können bestehende PowerShell-Skripte weiterverwendet werden?', text: 'Ja. Vor einer Erweiterung prüfe ich Aufbau, Abhängigkeiten und Fehlerbehandlung. Wir entscheiden gemeinsam, welche Teile erhalten bleiben und wo eine Überarbeitung sinnvoll ist.' },
      { title: 'Wie wird die Lösung in unsere Umgebung integriert?', text: 'PowerShell-Versionen, Module, Schnittstellen, Berechtigungen und Ihre Betriebsstandards werden vorab abgestimmt. Der Einsatz erfolgt erst nach Tests und Ihrer Freigabe. Nicht jede Plattform oder Software bietet dieselben Automatisierungsmöglichkeiten.' },
      { title: 'Kann unser Team die Skripte anschließend selbst pflegen?', text: 'Die Umsetzung ist auf eine nachvollziehbare Übergabe ausgelegt: lesbarer Code, Git-Historie und Dokumentation zu Parametern, Voraussetzungen und Grenzen. Ihr Team kann Änderungen prüfen und die Lösung weiterentwickeln.' },
      { title: 'Wie starten wir ein gemeinsames Projekt?', text: 'Für die erste Abstimmung genügen eine Beschreibung der Aufgabe, die relevante Umgebung und das gewünschte Ergebnis. Daraus stimmen wir ein Arbeitspaket und die Zusammenarbeit ab. Der Kontaktweg dieser Website ist derzeit noch als Vorschau gekennzeichnet.' },
    ],
  },
  en: {
    eyebrow: 'POWERSHELL · INFRASTRUCTURE AUTOMATION',
    title: 'PowerShell Automation for Windows & IT Infrastructure',
    description: 'For IT service providers, MSPs and infrastructure teams: I turn recurring tasks into PowerShell scripts. Provisioning, configuration and checks become documented workflows your team can understand and maintain.',
    servicesLink: 'All infrastructure services',
    challengesLabel: 'TYPICAL CHALLENGES',
    challengesTitle: 'When routine work takes up engineering time.',
    challengesIntro: 'A useful starting point is a clearly defined task that recurs regularly and should follow consistent rules.',
    challenges: [
      'Recurring deployments start with the same manual steps each time.',
      'Windows settings are applied individually and are difficult to compare.',
      'Processes and local script versions differ between engineers.',
      'Daily operations leave little capacity to automate existing workflows.',
    ],
    examplesLabel: 'PRACTICAL APPLICATIONS',
    examplesTitle: 'What PowerShell can help automate.',
    examplesIntro: 'Possible work packages, not customer case studies. Scope depends on your platforms, interfaces and access permissions.',
    examples: [
      { title: 'VM provisioning', text: 'Provision virtual machines from parameters or a CSV file, including names, CPU, RAM and network assignments. Validate inputs and check existing resources before execution.' },
      { title: 'Windows Server configuration', text: 'Configure roles, features and services to an agreed baseline. Check existing settings and log deviations for further review.' },
      { title: 'Unattended software installation', text: 'Run installations using unattended options supported by the vendor. Account for prerequisites, return codes and any required restart within the workflow.' },
      { title: 'Deployment workflows', text: 'Connect preparation, installation and configuration in a defined sequence. Logs and agreed stopping conditions help identify a failed step.' },
      { title: 'Validation and error handling', text: 'Check required values, file formats and necessary permissions. Provide clear error messages and results in a report your team can analyse.' },
    ],
    implementationLabel: 'MAINTAINABLE IMPLEMENTATION',
    implementationTitle: 'A script should remain understandable after handover.',
    implementationIntro: 'Alongside functionality, your team needs clear boundaries, reviewable changes and practical information for operation.',
    steps: [
      { title: 'Define the scope', text: 'We agree on inputs, the target state, interfaces and acceptance criteria. Access permissions, the test environment and failure behaviour are part of that discussion.' },
      { title: 'Develop and review', text: 'I develop the PowerShell solution in small changes tracked in Git. Changes remain clear for code review; normal operation and failure scenarios are tested in the agreed environment.' },
      { title: 'Document and hand over', text: 'Your team receives scripts, configuration notes, usage examples and known limitations. The technical handover covers operation, maintenance and outstanding issues.' },
    ],
    collaborationLabel: 'WORKING WITH NIMBUS IT',
    collaborationTitle: 'Direct technical communication. Clearly agreed tasks.',
    collaborationLead: 'You work directly with me as an independent IT consultant, from the first discussion to technical handover.',
    collaborationText: 'German-language collaboration is available, with C1 proficiency for technical discussions. Flexible, project-based support can cover a single script, improvements to an existing workflow or a defined automation package. We agree on responsibilities, scope and timing together.',
    faqLabel: 'FREQUENTLY ASKED QUESTIONS',
    faqTitle: 'What to clarify before a project.',
    faq: [
      { title: 'Which tasks are a good starting point?', text: 'Recurring, clearly described workflows with known inputs and a verifiable outcome. We first establish which parts can be automated technically and where manual decisions are still needed.' },
      { title: 'Can existing PowerShell scripts be reused?', text: 'Yes. Before extending them, I review their structure, dependencies and error handling. We decide together which parts to retain and where changes would help.' },
      { title: 'How will the solution fit into our environment?', text: 'PowerShell versions, modules, interfaces, permissions and your operating standards are agreed in advance. The solution is put into use after testing and your approval. Automation capabilities vary by platform and software.' },
      { title: 'Can our team maintain the scripts afterwards?', text: 'The implementation is designed for a clear handover: readable code, Git history and documentation of parameters, prerequisites and limitations. Your team can review changes and extend the solution.' },
      { title: 'How do we start a project together?', text: 'An outline of the task, the relevant environment and the intended outcome is enough for an initial discussion. We use it to agree on a work package and how to collaborate. This website’s contact channel is currently marked as a preview.' },
    ],
  },
};
