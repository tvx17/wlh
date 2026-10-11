
/**
 * Mock-Daten für eine Buchautorensoftware
 * Geschichte: Das Geheimnis von Falkenstein
 *
 * Reine Frontend-Testdaten, keine Datenbankmigration.
 */

// --------------------------------------------------
// 1. Bearbeitungsstatus
// --------------------------------------------------

export const statuses = {
  books: [
    { id: 'planned', label: 'Geplant', color: 'grey' },
    { id: 'in_progress', label: 'In Arbeit', color: 'blue' },
    { id: 'completed', label: 'Fertig', color: 'green' },
    { id: 'on_hold', label: 'Zurückgestellt', color: 'orange' },
    { id: 'cancelled', label: 'Abgebrochen', color: 'red' },
  ],
  chapters: [
    { id: 'planned', label: 'Geplant' },
    { id: 'in_progress', label: 'In Arbeit' },
    { id: 'completed', label: 'Fertig' },
    { id: 'discarded', label: 'Verworfen' },
  ],
  scenes: [
    { id: 'idea', label: 'Idee' },
    { id: 'draft', label: 'Entwurf' },
    { id: 'in_progress', label: 'In Arbeit' },
    { id: 'completed', label: 'Fertig' },
    { id: 'discarded', label: 'Verworfen' },
  ],
  translations: [
    { id: 'not_translated', label: 'Nicht übersetzt' },
    { id: 'in_progress', label: 'In Arbeit' },
    { id: 'revision', label: 'Revision' },
    { id: 'completed', label: 'Fertig' },
    { id: 'cancelled', label: 'Abgebrochen' },
  ],
};

// --------------------------------------------------
// 2. Projekte und Bücher
// --------------------------------------------------

export const projects = [
  {
    id: 'project-1',
    api_name: 'falkenstein',
    name: 'Die Falkenstein-Chroniken',
    description: 'Mysteriöse Ereignisse rund um Schloss Falkenstein.',
    source_language: 'de-DE',
    is_active: true,
  },
  {
    id: 'project-2',
    api_name: 'space_odyssey',
    name: 'Jenseits der Sterne',
    description: 'Science-Fiction-Projekt in einer fernen Zukunft.',
    source_language: 'de-DE',
    is_active: false,
  },
];

export const books = [
  {
    id: 'book-1',
    project_id: 'project-1',
    api_name: 'falkenstein_secret',
    status: 'in_progress',
    sort_order: 1000,
    is_active: true,
    translations: {
      'de-DE': {
        title: 'Das Geheimnis von Falkenstein',
        description: 'Ein Kriminalroman über ein dunkles Familiengeheimnis.',
        status: 'completed',
      },
      'en-US': {
        title: 'The Secret of Falkenstein',
        description: 'A mystery novel about a dark family secret.',
        status: 'revision',
      },
    },
  },
  {
    id: 'book-2',
    project_id: 'project-1',
    api_name: 'falkenstein_return',
    status: 'planned',
    sort_order: 2000,
    is_active: true,
    translations: {
      'de-DE': {
        title: 'Rückkehr nach Falkenstein',
        status: 'completed',
      },
      'en-US': {
        title: '',
        status: 'not_translated',
      },
    },
  },
];

// --------------------------------------------------
// 3. Kapitel
// --------------------------------------------------

export const chapters = [
  {
    id: 'chapter-1',
    book_id: 'book-1',
    api_name: 'arrival',
    sort_order: 1000,
    status: 'completed',
    is_active: true,
    translations: {
      'de-DE': { title: 'Die Rückkehr', status: 'completed' },
      'en-US': { title: 'The Return', status: 'completed' },
    },
  },
  {
    id: 'chapter-2',
    book_id: 'book-1',
    api_name: 'first_clues',
    sort_order: 2000,
    status: 'in_progress',
    is_active: true,
    translations: {
      'de-DE': { title: 'Erste Spuren', status: 'completed' },
      'en-US': { title: 'First Clues', status: 'revision' },
    },
  },
  {
    id: 'chapter-3',
    book_id: 'book-1',
    api_name: 'dark_past',
    sort_order: 3000,
    status: 'planned',
    is_active: true,
    translations: {
      'de-DE': { title: 'Die dunkle Vergangenheit', status: 'completed' },
      'en-US': { title: '', status: 'not_translated' },
    },
  },
];

// --------------------------------------------------
// 4. Szenen
// chapter_id = null bedeutet freie Szene
// --------------------------------------------------

export const scenes = [
  {
    id: 'scene-1',
    project_id: 'project-1',
    chapter_id: 'chapter-1',
    api_name: 'arrival_at_castle',
    sort_order: 1000,
    status: 'completed',
    is_active: true,
    translations: {
      'de-DE': { title: 'Ankunft am Schloss', status: 'completed' },
      'en-US': { title: 'Arrival at the Castle', status: 'completed' },
    },
  },
  {
    id: 'scene-2',
    project_id: 'project-1',
    chapter_id: 'chapter-1',
    api_name: 'meeting_with_peter',
    sort_order: 2000,
    status: 'completed',
    is_active: true,
    translations: {
      'de-DE': { title: 'Ein alter Bekannter', status: 'completed' },
      'en-US': { title: 'An Old Acquaintance', status: 'revision' },
    },
  },
  {
    id: 'scene-3',
    project_id: 'project-1',
    chapter_id: 'chapter-2',
    api_name: 'discovery_of_letter',
    sort_order: 1000,
    status: 'in_progress',
    is_active: true,
    translations: {
      'de-DE': { title: 'Der geheimnisvolle Brief', status: 'completed' },
      'en-US': { title: 'The Mysterious Letter', status: 'in_progress' },
    },
  },
  {
    id: 'scene-4',
    project_id: 'project-1',
    chapter_id: 'chapter-2',
    api_name: 'forest_attack',
    sort_order: 2000,
    status: 'draft',
    is_active: true,
    translations: {
      'de-DE': { title: 'Der Angriff im Wald', status: 'completed' },
      'en-US': { title: '', status: 'not_translated' },
    },
  },
  {
    id: 'scene-5',
    project_id: 'project-1',
    chapter_id: 'chapter-3',
    api_name: 'old_murder',
    sort_order: 1000,
    status: 'planned',
    is_active: true,
    translations: {
      'de-DE': { title: 'Die Nacht des Mordes', status: 'completed' },
      'en-US': { title: '', status: 'not_translated' },
    },
  },
  {
    id: 'scene-6',
    project_id: 'project-1',
    chapter_id: null,
    api_name: 'secret_tunnel',
    sort_order: 1000,
    status: 'idea',
    is_active: true,
    translations: {
      'de-DE': { title: 'Der geheime Tunnel', status: 'completed' },
      'en-US': { title: '', status: 'not_translated' },
    },
  },
  {
    id: 'scene-7',
    project_id: 'project-1',
    chapter_id: null,
    api_name: 'alternative_ending',
    sort_order: 2000,
    status: 'discarded',
    is_active: false,
    translations: {
      'de-DE': { title: 'Alternatives Ende', status: 'completed' },
    },
  },
];

// --------------------------------------------------
// 5. Charaktere
// properties = aktuelle Stammdaten/Ausgangswerte
// Zeitabhängige Änderungen folgen weiter unten.
// --------------------------------------------------

export const characters = [
  {
    id: 'char-1',
    project_id: 'project-1',
    api_name: 'anna_weber',
    name: 'Anna Weber',
    description: 'Journalistin, die nach Jahren in ihre Heimat zurückkehrt.',
    is_active: true,
    properties: {
      age: 32,
      gender: 'female',
      occupation: 'Journalistin',
      eye_color: 'Blau',
      hair_color: 'Braun',
      height_cm: 172,
      life_status: 'alive',
      marital_status: 'single',
      residence: 'loc-3',
    },
  },
  {
    id: 'char-2',
    project_id: 'project-1',
    api_name: 'peter_falkenstein',
    name: 'Peter von Falkenstein',
    description: 'Erbe des Schlosses mit einer geheimnisvollen Vergangenheit.',
    is_active: true,
    properties: {
      age: 38,
      gender: 'male',
      occupation: 'Unternehmer',
      eye_color: 'Grün',
      hair_color: 'Schwarz',
      life_status: 'alive',
      marital_status: 'divorced',
      residence: 'loc-1',
    },
  },
  {
    id: 'char-3',
    project_id: 'project-1',
    api_name: 'heinrich_falkenstein',
    name: 'Heinrich von Falkenstein',
    description: 'Verstorbener Vater von Peter.',
    is_active: true,
    properties: {
      age: 67,
      gender: 'male',
      occupation: 'Industrieller',
      life_status: 'alive',
      residence: 'loc-1',
    },
  },
  {
    id: 'char-4',
    project_id: 'project-1',
    api_name: 'kommissar_berger',
    name: 'Kommissar Thomas Berger',
    description: 'Ermittler mit persönlichem Bezug zum alten Mordfall.',
    is_active: true,
    properties: {
      age: 48,
      gender: 'male',
      occupation: 'Kriminalkommissar',
      life_status: 'alive',
      marital_status: 'married',
    },
  },
  {
    id: 'char-5',
    project_id: 'project-1',
    api_name: 'maria_keller',
    name: 'Maria Keller',
    description: 'Langjährige Haushälterin auf Schloss Falkenstein.',
    is_active: true,
    properties: {
      age: 61,
      gender: 'female',
      occupation: 'Haushälterin',
      life_status: 'alive',
      residence: 'loc-1',
    },
  },
];

// --------------------------------------------------
// 6. Orte
// --------------------------------------------------

export const locations = [
  {
    id: 'loc-1',
    project_id: 'project-1',
    api_name: 'castle_falkenstein',
    name: 'Schloss Falkenstein',
    type: 'building',
    parent_location_id: 'loc-4',
    description: 'Altes Schloss auf einem bewaldeten Hügel.',
    is_active: true,
    properties: {
      condition: 'intact',
      year_built: 1742,
      inhabited: true,
    },
  },
  {
    id: 'loc-2',
    project_id: 'project-1',
    api_name: 'dark_forest',
    name: 'Dunkelwald',
    type: 'forest',
    parent_location_id: 'loc-4',
    description: 'Dichter Wald mit verlassenen Wegen.',
    is_active: true,
    properties: {
      dangerous: true,
      condition: 'intact',
    },
  },
  {
    id: 'loc-3',
    project_id: 'project-1',
    api_name: 'anna_apartment',
    name: 'Annas Wohnung',
    type: 'building',
    parent_location_id: 'loc-5',
    description: 'Kleine Wohnung in der Hauptstadt.',
    is_active: true,
    properties: {
      condition: 'intact',
    },
  },
  {
    id: 'loc-4',
    project_id: 'project-1',
    api_name: 'falkenstein_village',
    name: 'Falkenstein',
    type: 'village',
    parent_location_id: null,
    description: 'Abgelegenes Dorf in den Bergen.',
    is_active: true,
    properties: {
      population: 2400,
    },
  },
  {
    id: 'loc-5',
    project_id: 'project-1',
    api_name: 'berlin',
    name: 'Berlin',
    type: 'city',
    parent_location_id: null,
    is_active: true,
    properties: {},
  },
];

// --------------------------------------------------
// 7. Objekte
// --------------------------------------------------

export const objects = [
  {
    id: 'obj-1',
    project_id: 'project-1',
    api_name: 'old_letter',
    name: 'Der alte Brief',
    description: 'Vergilbter Brief mit Hinweisen auf einen Mord.',
    is_active: true,
    properties: {
      material: 'Papier',
      condition: 'intact',
      owner: 'char-3',
    },
  },
  {
    id: 'obj-2',
    project_id: 'project-1',
    api_name: 'silver_key',
    name: 'Silberner Schlüssel',
    description: 'Schlüssel zu einem bislang unbekannten Raum.',
    is_active: true,
    properties: {
      material: 'Silber',
      condition: 'intact',
      owner: 'char-2',
    },
  },
  {
    id: 'obj-3',
    project_id: 'project-1',
    api_name: 'family_diary',
    name: 'Familientagebuch',
    description: 'Aufzeichnungen der Familie Falkenstein.',
    is_active: true,
    properties: {
      material: 'Leder und Papier',
      condition: 'damaged',
      owner: 'char-2',
    },
  },
];

// --------------------------------------------------
// 8. Gruppen (einschließlich Untergruppen)
// --------------------------------------------------

export const groups = [
  {
    id: 'group-1',
    project_id: 'project-1',
    api_name: 'falkenstein_family',
    name: 'Familie Falkenstein',
    description: 'Die Mitglieder und Besitztümer der Familie.',
    is_active: true,
  },
  {
    id: 'group-2',
    project_id: 'project-1',
    api_name: 'castle_household',
    name: 'Schlosshaushalt',
    description: 'Bewohner und Angestellte des Schlosses.',
    is_active: true,
  },
  {
    id: 'group-3',
    project_id: 'project-1',
    api_name: 'investigation_team',
    name: 'Ermittlungsteam',
    description: 'Personen und Beweismittel des aktuellen Falls.',
    is_active: true,
  },
];

export const groupMembers = [
  { group_id: 'group-1', entity_type: 'character', entity_id: 'char-2' },
  { group_id: 'group-1', entity_type: 'character', entity_id: 'char-3' },
  { group_id: 'group-1', entity_type: 'location', entity_id: 'loc-1' },
  { group_id: 'group-1', entity_type: 'object', entity_id: 'obj-3' },
  { group_id: 'group-1', entity_type: 'group', entity_id: 'group-2' },

  { group_id: 'group-2', entity_type: 'character', entity_id: 'char-5' },
  { group_id: 'group-2', entity_type: 'location', entity_id: 'loc-1' },

  { group_id: 'group-3', entity_type: 'character', entity_id: 'char-1' },
  { group_id: 'group-3', entity_type: 'character', entity_id: 'char-4' },
  { group_id: 'group-3', entity_type: 'object', entity_id: 'obj-1' },
];

// --------------------------------------------------
// 9. Beziehungen
// --------------------------------------------------

export const relationships = [
  {
    id: 'rel-1',
    source_id: 'char-2',
    target_id: 'char-3',
    type: 'child_of',
    description: 'Peter ist Heinrichs Sohn.',
    is_active: true,
  },
  {
    id: 'rel-2',
    source_id: 'char-5',
    target_id: 'char-2',
    type: 'works_for',
    description: 'Maria arbeitet für Peter.',
    is_active: true,
  },
  {
    id: 'rel-3',
    source_id: 'char-1',
    target_id: 'char-2',
    type: 'knows',
    description: 'Anna und Peter kennen sich seit ihrer Jugend.',
    is_active: true,
  },
  {
    id: 'rel-4',
    source_id: 'char-2',
    target_id: 'loc-1',
    type: 'owns',
    description: 'Peter besitzt Schloss Falkenstein.',
    is_active: true,
  },
];

// --------------------------------------------------
// 10. Szenenbeteiligung
// --------------------------------------------------

export const sceneEntities = [
  { scene_id: 'scene-1', entity_id: 'char-1', type: 'character' },
  { scene_id: 'scene-1', entity_id: 'char-5', type: 'character' },
  { scene_id: 'scene-1', entity_id: 'loc-1', type: 'location' },

  { scene_id: 'scene-2', entity_id: 'char-1', type: 'character' },
  { scene_id: 'scene-2', entity_id: 'char-2', type: 'character' },
  { scene_id: 'scene-2', entity_id: 'loc-1', type: 'location' },

  { scene_id: 'scene-3', entity_id: 'char-1', type: 'character' },
  { scene_id: 'scene-3', entity_id: 'obj-1', type: 'object' },
  { scene_id: 'scene-3', entity_id: 'loc-1', type: 'location' },

  { scene_id: 'scene-4', entity_id: 'char-1', type: 'character' },
  { scene_id: 'scene-4', entity_id: 'loc-2', type: 'location' },

  { scene_id: 'scene-5', entity_id: 'char-3', type: 'character' },
  { scene_id: 'scene-5', entity_id: 'char-5', type: 'character' },
  { scene_id: 'scene-5', entity_id: 'loc-1', type: 'location' },

  { scene_id: 'scene-6', entity_id: 'char-2', type: 'character' },
  { scene_id: 'scene-6', entity_id: 'obj-2', type: 'object' },
  { scene_id: 'scene-6', entity_id: 'loc-1', type: 'location' },
];

// --------------------------------------------------
// 11. Eigenschaftsdefinitionen
// --------------------------------------------------

export const propertyDefinitions = [
  {
    id: 'prop-life',
    api_name: 'life_status',
    label: 'Lebensstatus',
    entity_types: ['character'],
    data_type: 'select',
    is_temporal: true,
    options: [
      { value: 'alive', label: 'Lebt' },
      { value: 'deceased', label: 'Verstorben' },
      { value: 'missing', label: 'Vermisst' },
    ],
  },
  {
    id: 'prop-condition',
    api_name: 'condition',
    label: 'Zustand',
    entity_types: ['object', 'location'],
    data_type: 'select',
    is_temporal: true,
    options: [
      { value: 'intact', label: 'Intakt' },
      { value: 'damaged', label: 'Beschädigt' },
      { value: 'destroyed', label: 'Zerstört' },
    ],
  },
  {
    id: 'prop-owner',
    api_name: 'owner',
    label: 'Besitzer',
    entity_types: ['object'],
    data_type: 'reference',
    reference_type: 'character',
    is_temporal: true,
  },
  {
    id: 'prop-residence',
    api_name: 'residence',
    label: 'Wohnort',
    entity_types: ['character'],
    data_type: 'reference',
    reference_type: 'location',
    is_temporal: true,
  },
  {
    id: 'prop-occupation',
    api_name: 'occupation',
    label: 'Beruf',
    entity_types: ['character'],
    data_type: 'text',
    is_temporal: true,
  },
  {
    id: 'prop-eye-color',
    api_name: 'eye_color',
    label: 'Augenfarbe',
    entity_types: ['character'],
    data_type: 'text',
    is_temporal: false,
  },
];

// --------------------------------------------------
// 12. Ereignisse
// Chronologie unabhängig von der Lesereihenfolge.
// --------------------------------------------------

export const events = [
  {
    id: 'event-1',
    project_id: 'project-1',
    api_name: 'heinrich_death',
    title: 'Tod von Heinrich',
    description: 'Heinrich stirbt unter mysteriösen Umständen.',
    chronological_order: 1000,
    time_start: '2012-10-15',
    time_precision: 'day',
    is_active: true,
  },
  {
    id: 'event-2',
    project_id: 'project-1',
    api_name: 'anna_returns',
    title: 'Anna kehrt zurück',
    description: 'Anna kehrt nach Falkenstein zurück.',
    chronological_order: 2000,
    time_start: '2025-09-12',
    time_precision: 'day',
    is_active: true,
  },
  {
    id: 'event-3',
    project_id: 'project-1',
    api_name: 'letter_discovered',
    title: 'Anna findet den Brief',
    description: 'Anna entdeckt ein wichtiges Beweisstück.',
    chronological_order: 3000,
    time_start: '2025-09-13',
    time_precision: 'day',
    is_active: true,
  },
  {
    id: 'event-4',
    project_id: 'project-1',
    api_name: 'forest_attack',
    title: 'Angriff im Wald',
    description: 'Anna wird im Dunkelwald angegriffen.',
    chronological_order: 4000,
    time_start: '2025-09-14',
    time_precision: 'day',
    is_active: true,
  },
  {
    id: 'event-5',
    project_id: 'project-1',
    api_name: 'key_damaged',
    title: 'Der Schlüssel wird beschädigt',
    description: 'Beim Öffnen einer alten Tür verbiegt sich der Schlüssel.',
    chronological_order: 5000,
    time_start: null,
    time_precision: 'unknown',
    is_active: true,
  },
];

// --------------------------------------------------
// 13. Zustands- und Eigenschaftsänderungen
// --------------------------------------------------

export const propertyChanges = [
  {
    id: 'change-1',
    event_id: 'event-1',
    entity_id: 'char-3',
    property: 'life_status',
    old_value: 'alive',
    new_value: 'deceased',
  },
  {
    id: 'change-2',
    event_id: 'event-2',
    entity_id: 'char-1',
    property: 'residence',
    old_value: 'loc-3',
    new_value: 'loc-4',
  },
  {
    id: 'change-3',
    event_id: 'event-3',
    entity_id: 'obj-1',
    property: 'owner',
    old_value: 'char-3',
    new_value: 'char-1',
  },
  {
    id: 'change-4',
    event_id: 'event-4',
    entity_id: 'char-1',
    property: 'health_status',
    old_value: 'healthy',
    new_value: 'injured',
  },
  {
    id: 'change-5',
    event_id: 'event-5',
    entity_id: 'obj-2',
    property: 'condition',
    old_value: 'intact',
    new_value: 'damaged',
  },
];

// --------------------------------------------------
// 14. Zuordnung Ereignisse zu Szenen
// --------------------------------------------------

export const sceneEvents = [
  { scene_id: 'scene-5', event_id: 'event-1' },
  { scene_id: 'scene-1', event_id: 'event-2' },
  { scene_id: 'scene-3', event_id: 'event-3' },
  { scene_id: 'scene-4', event_id: 'event-4' },
  { scene_id: 'scene-6', event_id: 'event-5' },
];

// --------------------------------------------------
// 15. Zeitleisten
// --------------------------------------------------

export const timelines = [
  {
    id: 'timeline-1',
    project_id: 'project-1',
    api_name: 'main_timeline',
    name: 'Hauptchronologie',
    is_primary: true,
    is_active: true,
  },
  {
    id: 'timeline-2',
    project_id: 'project-1',
    api_name: 'past_events',
    name: 'Vergangenheit der Familie',
    is_primary: false,
    is_active: true,
  },
];

export const timelineEntries = [
  {
    id: 'te-1',
    timeline_id: 'timeline-1',
    event_id: 'event-1',
    scene_id: null,
    sort_order: 1000,
  },
  {
    id: 'te-2',
    timeline_id: 'timeline-1',
    event_id: 'event-2',
    scene_id: null,
    sort_order: 2000,
  },
  {
    id: 'te-3',
    timeline_id: 'timeline-1',
    event_id: 'event-3',
    scene_id: null,
    sort_order: 3000,
  },
  {
    id: 'te-4',
    timeline_id: 'timeline-1',
    event_id: 'event-4',
    scene_id: null,
    sort_order: 4000,
  },
  {
    id: 'te-5',
    timeline_id: 'timeline-1',
    event_id: 'event-5',
    scene_id: null,
    sort_order: 5000,
  },
  {
    id: 'te-6',
    timeline_id: 'timeline-2',
    event_id: 'event-1',
    scene_id: null,
    sort_order: 1000,
  },
];

// --------------------------------------------------
// 16. Handlungsstränge
// --------------------------------------------------

export const storylines = [
  {
    id: 'story-1',
    project_id: 'project-1',
    name: 'Annas Ermittlungen',
    color: '#3b82f6',
    is_active: true,
  },
  {
    id: 'story-2',
    project_id: 'project-1',
    name: 'Das Familiengeheimnis',
    color: '#a855f7',
    is_active: true,
  },
  {
    id: 'story-3',
    project_id: 'project-1',
    name: 'Die Vergangenheit',
    color: '#f97316',
    is_active: true,
  },
];

export const storylineScenes = [
  { storyline_id: 'story-1', scene_id: 'scene-1', sort_order: 1000 },
  { storyline_id: 'story-1', scene_id: 'scene-3', sort_order: 2000 },
  { storyline_id: 'story-1', scene_id: 'scene-4', sort_order: 3000 },

  { storyline_id: 'story-2', scene_id: 'scene-2', sort_order: 1000 },
  { storyline_id: 'story-2', scene_id: 'scene-3', sort_order: 2000 },
  { storyline_id: 'story-2', scene_id: 'scene-6', sort_order: 3000 },

  { storyline_id: 'story-3', scene_id: 'scene-5', sort_order: 1000 },
  { storyline_id: 'story-3', scene_id: 'scene-2', sort_order: 2000 },
];

// --------------------------------------------------
// 17. Szeneninhalte / Textblöcke
// --------------------------------------------------

export const sceneBlocks = [
  {
    id: 'block-1',
    scene_id: 'scene-1',
    block_type: 'text',
    sort_order: 1000,
    speaker_character_id: null,
    is_active: true,
    translations: {
      'de-DE': {
        content: 'Als Anna die kurvenreiche Straße hinauffuhr, tauchte Schloss Falkenstein hinter den Bäumen auf. Seit fünfzehn Jahren hatte sie diesen Ort nicht mehr gesehen.',
        status: 'completed',
      },
      'en-US': {
        content: 'As Anna drove up the winding road, Falkenstein Castle appeared behind the trees. She had not seen this place in fifteen years.',
        status: 'completed',
      },
    },
  },
  {
    id: 'block-2',
    scene_id: 'scene-1',
    block_type: 'dialogue',
    sort_order: 2000,
    speaker_character_id: 'char-5',
    is_active: true,
    translations: {
      'de-DE': {
        content: '„Fräulein Weber? Ich hätte nicht gedacht, Sie jemals wieder hier zu sehen.“',
        status: 'completed',
      },
      'en-US': {
        content: '"Miss Weber? I never thought I would see you here again."',
        status: 'completed',
      },
    },
  },
  {
    id: 'block-3',
    scene_id: 'scene-1',
    block_type: 'dialogue',
    sort_order: 3000,
    speaker_character_id: 'char-1',
    is_active: true,
    translations: {
      'de-DE': {
        content: '„Glauben Sie mir, Maria. Ich auch nicht.“',
        status: 'completed',
      },
      'en-US': {
        content: '"Believe me, Maria. Neither did I."',
        status: 'completed',
      },
    },
  },
  {
    id: 'block-4',
    scene_id: 'scene-1',
    block_type: 'note',
    sort_order: 4000,
    speaker_character_id: null,
    is_active: true,
    translations: {
      'de-DE': {
        content: 'Hier später einen Hinweis auf Annas Vergangenheit einbauen.',
        status: 'completed',
      },
    },
  },
  {
    id: 'block-5',
    scene_id: 'scene-3',
    block_type: 'text',
    sort_order: 1000,
    speaker_character_id: null,
    is_active: true,
    translations: {
      'de-DE': {
        content: 'Zwischen den vergilbten Seiten des Tagebuchs entdeckte Anna einen zusammengefalteten Brief. Die Handschrift kam ihr seltsam vertraut vor.',
        status: 'completed',
      },
      'en-US': {
        content: 'Between the yellowed pages of the diary, Anna discovered a folded letter.',
        status: 'in_progress',
      },
    },
  },
  {
    id: 'block-6',
    scene_id: 'scene-3',
    block_type: 'quote',
    sort_order: 2000,
    speaker_character_id: null,
    is_active: true,
    translations: {
      'de-DE': {
        content: '„Wenn du diese Zeilen liest, ist es wahrscheinlich bereits zu spät.“',
        status: 'completed',
      },
      'en-US': {
        content: '',
        status: 'not_translated',
      },
    },
  },
  {
    id: 'block-7',
    scene_id: 'scene-4',
    block_type: 'text',
    sort_order: 1000,
    speaker_character_id: null,
    is_active: true,
    translations: {
      'de-DE': {
        content: 'Ein Ast knackte hinter ihr. Anna blieb stehen. Noch bevor sie sich umdrehen konnte, stürzte eine dunkle Gestalt aus dem Unterholz.',
        status: 'completed',
      },
    },
  },
];

// --------------------------------------------------
// 18. Sprachdefinitionen
// --------------------------------------------------

export const languages = [
  { id: 'de-DE', name: 'Deutsch', is_active: true },
  { id: 'en-US', name: 'Englisch (USA)', is_active: true },
  { id: 'fr-FR', name: 'Französisch', is_active: true },
  { id: 'es-ES', name: 'Spanisch', is_active: false },
];

// --------------------------------------------------
// 19. Praktische Hilfsfunktionen für das Frontend
// --------------------------------------------------

export function getChapters(bookId) {
  return chapters
    .filter(chapter => chapter.book_id === bookId && chapter.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getScenes(chapterId) {
  return scenes
    .filter(scene => scene.chapter_id === chapterId && scene.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getFreeScenes(projectId) {
  return scenes
    .filter(scene =>
      scene.project_id === projectId &&
      scene.chapter_id === null &&
      scene.is_active
    )
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getSceneBlocks(sceneId, language = 'de-DE') {
  return sceneBlocks
    .filter(block => block.scene_id === sceneId && block.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(block => ({
      ...block,
      content: block.translations[language]?.content ?? '',
    }));
}

export function getSceneEntities(sceneId) {
  const allEntities = [...characters, ...locations, ...objects];

  return sceneEntities
    .filter(relation => relation.scene_id === sceneId)
    .map(relation => ({
      ...relation,
      entity: allEntities.find(item => item.id === relation.entity_id),
    }));
}

export function getEntityPropertyAt(entityId, property, order) {
  const entity = [...characters, ...locations, ...objects]
    .find(item => item.id === entityId);

  if (!entity) return undefined;

  let value = entity.properties?.[property];

  const changes = propertyChanges
    .map(change => ({
      ...change,
      event: events.find(event => event.id === change.event_id),
    }))
    .filter(change =>
      change.entity_id === entityId &&
      change.property === property &&
      change.event?.is_active &&
      change.event.chronological_order <= order
    )
    .sort((a, b) =>
      a.event.chronological_order - b.event.chronological_order
    );

  for (const change of changes) {
    value = change.new_value;
  }

  return value;
}
