import api from './api';

/**
 * Service pour le suivi des paiements des élèves
 * Basé sur FRONTEND_API_CONTRACT.md
 */

const SUIVIS_PAIEMENT_BASE_URL = '/suivis-paiement';

export const suiviPaiementService = {
  /**
   * Récupérer tous les suivis de paiement
   * @returns {Promise<Array>} Liste de tous les suivis
   */
  getAll: async () => {
    const response = await api.get(SUIVIS_PAIEMENT_BASE_URL);
    return response.data;
  },

  /**
   * Récupérer le suivi des paiements d'un élève
   * @param {number} eleveId - ID de l'élève
   * @returns {Promise<Array>} Liste des suivis de l'élève
   */
  getByEleve: async (eleveId) => {
    const response = await api.get(`${SUIVIS_PAIEMENT_BASE_URL}/eleve/${eleveId}`);
    return response.data;
  },

  /**
   * Récupérer les suivis par motif de paiement
   * @param {number} motifId - ID du motif de paiement
   * @returns {Promise<Array>} Liste des suivis pour ce motif
   */
  getByMotif: async (motifId) => {
    const response = await api.get(`${SUIVIS_PAIEMENT_BASE_URL}/motif/${motifId}`);
    return response.data;
  },

  /**
   * Récupérer les suivis par statut de paiement
   * @param {string} statut - PAYE_COMPLET, PAIEMENT_PARTIEL, NON_PAYE
   * @returns {Promise<Array>} Liste des suivis avec ce statut
   */
  getByStatut: async (statut) => {
    const response = await api.get(`${SUIVIS_PAIEMENT_BASE_URL}/statut/${statut}`);
    return response.data;
  },

  /**
   * Récupérer un suivi par ID
   * @param {number} id - ID du suivi
   * @returns {Promise<Object>} Détails du suivi
   */
  getById: async (id) => {
    const response = await api.get(`${SUIVIS_PAIEMENT_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Vérifier si un élève est en ordre de paiement
   * @param {number} eleveId - ID de l'élève
   * @returns {Promise<boolean>} true si en ordre, false sinon
   */
  isEnOrdre: async (eleveId) => {
    const response = await api.get(`${SUIVIS_PAIEMENT_BASE_URL}/eleve/${eleveId}/en-ordre`);
    return response.data;
  },

  /**
   * Créer un suivi pour un élève et un motif
   * @param {Object} suiviData - SuiviPaiementCreateDTO
   * @param {number} suiviData.eleveId - ID de l'élève
   * @param {number} suiviData.motifPaiementId - ID du motif de paiement
   * @returns {Promise<Object>} Suivi créé
   */
  create: async (suiviData) => {
    const response = await api.post(SUIVIS_PAIEMENT_BASE_URL, suiviData);
    return response.data;
  },

  /**
   * Créer un suivi pour tous les élèves d'un motif
   * @param {number} motifId - ID du motif de paiement
   * @returns {Promise<Array>} Liste des suivis créés
   */
  createForAllEleves: async (motifId) => {
    const response = await api.post(`${SUIVIS_PAIEMENT_BASE_URL}/motif/${motifId}/tous-eleves`);
    return response.data;
  },

  /**
   * Supprimer un suivi de paiement
   * @param {number} id - ID du suivi
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await api.delete(`${SUIVIS_PAIEMENT_BASE_URL}/${id}`);
  },
};
