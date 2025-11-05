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
// ÉNUMÉRATION: TYPE CONDUITE
// ========================
export const TYPE_CONDUITE_ENUM = {
  EXCELLENT: 'EXCELLENT',
  TRES_BON: 'TRES_BON',
  BON: 'BON',
  ASSEZ_BON: 'ASSEZ_BON',
  PASSABLE: 'PASSABLE',
  MEDIOCRE: 'MEDIOCRE',
  MAUVAIS: 'MAUVAIS',
};

export const TYPE_CONDUITE_LABELS = {
  EXCELLENT: 'Excellent',
  TRES_BON: 'Très Bon',
  BON: 'Bon',
  ASSEZ_BON: 'Assez Bon',
  PASSABLE: 'Passable',
  MEDIOCRE: 'Médiocre',
  MAUVAIS: 'Mauvais',
};

export const TYPE_CONDUITE_OPTIONS = [
  { value: TYPE_CONDUITE_ENUM.EXCELLENT, label: TYPE_CONDUITE_LABELS.EXCELLENT },
  { value: TYPE_CONDUITE_ENUM.TRES_BON, label: TYPE_CONDUITE_LABELS.TRES_BON },
  { value: TYPE_CONDUITE_ENUM.BON, label: TYPE_CONDUITE_LABELS.BON },
  { value: TYPE_CONDUITE_ENUM.ASSEZ_BON, label: TYPE_CONDUITE_LABELS.ASSEZ_BON },
  { value: TYPE_CONDUITE_ENUM.PASSABLE, label: TYPE_CONDUITE_LABELS.PASSABLE },
  { value: TYPE_CONDUITE_ENUM.MEDIOCRE, label: TYPE_CONDUITE_LABELS.MEDIOCRE },
  { value: TYPE_CONDUITE_ENUM.MAUVAIS, label: TYPE_CONDUITE_LABELS.MAUVAIS },
];

// ========================
// CONDUITES - Couleurs
// ========================
export const CONDUITE_COLORS = {
  'Excellent': 'bg-green-100 text-green-800',
  'Très Bon': 'bg-blue-100 text-blue-800',
  'Bon': 'bg-yellow-100 text-yellow-800',
  'Assez Bon': 'bg-lime-100 text-lime-800',
  'Passable': 'bg-orange-100 text-orange-800',
  'Médiocre': 'bg-red-100 text-red-800',
  'Mauvais': 'bg-red-200 text-red-900',
};

// ========================
// ÉNUMÉRATION: STATUT PAIEMENT
// ========================
export const STATUT_PAIEMENT_ENUM = {
  NON_PAYE: 'NON_PAYE',
  PAIEMENT_PARTIEL: 'PAIEMENT_PARTIEL',
  PAYE_COMPLET: 'PAYE_COMPLET',
};

export const STATUT_PAIEMENT_LABELS = {
  NON_PAYE: 'Non payé',
  PAIEMENT_PARTIEL: 'Paiement partiel',
  PAYE_COMPLET: 'Payé complet',
};

export const STATUT_PAIEMENT_COLORS = {
  NON_PAYE: 'bg-red-100 text-red-800 border-red-200',
  PAIEMENT_PARTIEL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PAYE_COMPLET: 'bg-green-100 text-green-800 border-green-200',
};

export const STATUT_PAIEMENT_OPTIONS = [
  { value: STATUT_PAIEMENT_ENUM.NON_PAYE, label: STATUT_PAIEMENT_LABELS.NON_PAYE },
  { value: STATUT_PAIEMENT_ENUM.PAIEMENT_PARTIEL, label: STATUT_PAIEMENT_LABELS.PAIEMENT_PARTIEL },
  { value: STATUT_PAIEMENT_ENUM.PAYE_COMPLET, label: STATUT_PAIEMENT_LABELS.PAYE_COMPLET },
];

// ========================
// ÉNUMÉRATION: STATUT DÉROGATION
// ========================
export const STATUT_DEROGATION_ENUM = {
  EN_ATTENTE: 'EN_ATTENTE',
  ACCEPTEE: 'ACCEPTEE',
  REFUSEE: 'REFUSEE',
  EXPIREE: 'EXPIREE',
};

export const STATUT_DEROGATION_LABELS = {
  EN_ATTENTE: 'En attente',
  ACCEPTEE: 'Acceptée',
  REFUSEE: 'Refusée',
  EXPIREE: 'Expirée',
};

export const STATUT_DEROGATION_COLORS = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ACCEPTEE: 'bg-green-100 text-green-800 border-green-200',
  REFUSEE: 'bg-red-100 text-red-800 border-red-200',
  EXPIREE: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const STATUT_DEROGATION_OPTIONS = [
  { value: STATUT_DEROGATION_ENUM.EN_ATTENTE, label: STATUT_DEROGATION_LABELS.EN_ATTENTE },
  { value: STATUT_DEROGATION_ENUM.ACCEPTEE, label: STATUT_DEROGATION_LABELS.ACCEPTEE },
  { value: STATUT_DEROGATION_ENUM.REFUSEE, label: STATUT_DEROGATION_LABELS.REFUSEE },
  { value: STATUT_DEROGATION_ENUM.EXPIREE, label: STATUT_DEROGATION_LABELS.EXPIREE },
];
