// ========================
// ÉNUMÉRATION: ROLE
// ========================
export const ROLE_ENUM = {
  ADMIN: 'ADMIN',
  PROFESSEUR: 'PROFESSEUR',
  PARENT: 'PARENT',
  PERCEPTEUR: 'PERCEPTEUR',
};

export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  PROFESSEUR: 'Professeur',
  PARENT: 'Parent',
  PERCEPTEUR: 'Percepteur',
};

export const ROLE_COLORS = {
  ADMIN: 'bg-red-100 text-red-800 border-red-200',
  PROFESSEUR: 'bg-blue-100 text-blue-800 border-blue-200',
  PARENT: 'bg-green-100 text-green-800 border-green-200',
  PERCEPTEUR: 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const ROLE_OPTIONS = [
  { value: ROLE_ENUM.ADMIN, label: ROLE_LABELS.ADMIN },
  { value: ROLE_ENUM.PROFESSEUR, label: ROLE_LABELS.PROFESSEUR },
  { value: ROLE_ENUM.PARENT, label: ROLE_LABELS.PARENT },
  { value: ROLE_ENUM.PERCEPTEUR, label: ROLE_LABELS.PERCEPTEUR },
];

// ========================
// ÉNUMÉRATION: PERIODE
// ========================
export const PERIODE_ENUM = {
  PREMIERE: 'PREMIERE',
  DEUXIEME: 'DEUXIEME',
  TROISIEME: 'TROISIEME',
  EXAMEN_PREMIER_SEMESTRE: 'EXAMEN_PREMIER_SEMESTRE',
  EXAMEN_SECOND_SEMESTRE: 'EXAMEN_SECOND_SEMESTRE',
};

export const PERIODE_LABELS = {
  PREMIERE: '1ère période',
  DEUXIEME: '2e période',
  TROISIEME: '3e période',
  EXAMEN_PREMIER_SEMESTRE: 'Examen premier semestre',
  EXAMEN_SECOND_SEMESTRE: 'Examen second semestre',
};

export const PERIODE_OPTIONS = [
  { value: PERIODE_ENUM.PREMIERE, label: PERIODE_LABELS.PREMIERE },
  { value: PERIODE_ENUM.DEUXIEME, label: PERIODE_LABELS.DEUXIEME },
  { value: PERIODE_ENUM.TROISIEME, label: PERIODE_LABELS.TROISIEME },
  { value: PERIODE_ENUM.EXAMEN_PREMIER_SEMESTRE, label: PERIODE_LABELS.EXAMEN_PREMIER_SEMESTRE },
  { value: PERIODE_ENUM.EXAMEN_SECOND_SEMESTRE, label: PERIODE_LABELS.EXAMEN_SECOND_SEMESTRE },
];

// ========================
// ÉNUMÉRATION: SEXE
// ========================
export const SEXE_ENUM = {
  MASCULIN: 'M',
  FEMININ: 'F',
};

export const SEXE_LABELS = {
  M: 'Masculin',
  F: 'Féminin',
};

export const SEXE_OPTIONS = [
  { value: SEXE_ENUM.MASCULIN, label: SEXE_LABELS.M },
  { value: SEXE_ENUM.FEMININ, label: SEXE_LABELS.F },
];

// ========================
// MENTIONS
// ========================
export const MENTION_COLORS = {
  'Faible': 'bg-red-100 text-red-800',
  'Passable': 'bg-orange-100 text-orange-800',
  'Assez Bien': 'bg-yellow-100 text-yellow-800',
  'Bien': 'bg-blue-100 text-blue-800',
  'Très Bien': 'bg-green-100 text-green-800',
  'Excellent': 'bg-purple-100 text-purple-800',
};

// ========================
// CONDUITES
// ========================
export const CONDUITE_COLORS = {
  'Excellent': 'bg-green-100 text-green-800',
  'Très Bon': 'bg-blue-100 text-blue-800',
  'Bon': 'bg-yellow-100 text-yellow-800',
  'Passable': 'bg-orange-100 text-orange-800',
  'Mauvais': 'bg-red-100 text-red-800',
};
