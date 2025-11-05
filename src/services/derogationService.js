import api from './api';

/**
 * Service pour la gestion des dérogations de paiement
 * Basé sur FRONTEND_API_CONTRACT.md
 */

const DEROGATIONS_BASE_URL = '/derogations';

export const derogationService = {
  /**
   * Récupérer toutes les dérogations
   * @returns {Promise<Array>} Liste de toutes les dérogations
   */
  getAll: async () => {
    const response = await api.get(DEROGATIONS_BASE_URL);
    return response.data;
  },

  /**
   * Récupérer les dérogations d'un élève
   * @param {number} eleveId - ID de l'élève
   * @returns {Promise<Array>} Liste des dérogations de l'élève
   */
  getByEleve: async (eleveId) => {
    const response = await api.get(`${DEROGATIONS_BASE_URL}/eleve/${eleveId}`);
    return response.data;
  },

  /**
   * Récupérer les dérogations par statut
   * @param {string} statut - EN_ATTENTE, ACCEPTEE, REFUSEE, EXPIREE
   * @returns {Promise<Array>} Liste des dérogations avec ce statut
   */
  getByStatut: async (statut) => {
    const response = await api.get(`${DEROGATIONS_BASE_URL}/statut/${statut}`);
    return response.data;
  },

  /**
   * Récupérer les dérogations en attente
   * @returns {Promise<Array>} Liste des dérogations en attente
   */
  getEnAttente: async () => {
    const response = await api.get(`${DEROGATIONS_BASE_URL}/en-attente`);
    return response.data;
  },

  /**
   * Récupérer les dérogations valides (acceptées et non expirées)
   * @returns {Promise<Array>} Liste des dérogations valides
   */
  getValides: async () => {
    const response = await api.get(`${DEROGATIONS_BASE_URL}/valides`);
    return response.data;
  },

  /**
   * Récupérer une dérogation par ID
   * @param {number} id - ID de la dérogation
   * @returns {Promise<Object>} Détails de la dérogation
   */
  getById: async (id) => {
    const response = await api.get(`${DEROGATIONS_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Vérifier si un élève a une dérogation valide
   * @param {number} eleveId - ID de l'élève
   * @returns {Promise<boolean>} true si l'élève a une dérogation valide
   */
  hasDerogationValide: async (eleveId) => {
    const response = await api.get(`${DEROGATIONS_BASE_URL}/eleve/${eleveId}/a-derogation-valide`);
    return response.data;
  },

  /**
   * Obtenir la dérogation valide d'un élève
   * @param {number} eleveId - ID de l'élève
   * @returns {Promise<Object|null>} Dérogation valide ou null si aucune
   */
  getValide: async (eleveId) => {
    try {
      const response = await api.get(`${DEROGATIONS_BASE_URL}/eleve/${eleveId}/valide`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Créer une nouvelle demande de dérogation
   * @param {Object} derogationData - DerogationCreateDTO
   * @param {number} derogationData.eleveId - ID de l'élève
   * @param {string} derogationData.motif - Motif de la dérogation
   * @param {string} derogationData.dateDebut - Date de début (ISO 8601)
   * @param {string} derogationData.dateFin - Date de fin (ISO 8601)
   * @returns {Promise<Object>} Dérogation créée
   */
  create: async (derogationData) => {
    const response = await api.post(DEROGATIONS_BASE_URL, derogationData);
    return response.data;
  },

  /**
   * Accepter une dérogation
   * @param {number} id - ID de la dérogation
   * @param {Object} accepterData - DerogationAccepterDTO
   * @param {string} accepterData.dateExpiration - Date d'expiration (ISO datetime)
   * @param {string} accepterData.accordeePar - Nom de la personne qui accorde
   * @returns {Promise<Object>} Dérogation acceptée
   */
  accepter: async (id, accepterData) => {
    const response = await api.patch(`${DEROGATIONS_BASE_URL}/${id}/accepter`, accepterData);
    return response.data;
  },

  /**
   * Refuser une dérogation
   * @param {number} id - ID de la dérogation
   * @param {string} raisonRefus - Raison du refus
   * @returns {Promise<Object>} Dérogation refusée
   */
  refuser: async (id, raisonRefus) => {
    const response = await api.patch(`${DEROGATIONS_BASE_URL}/${id}/refuser`, {
      raisonRefus: raisonRefus || 'Aucune raison spécifiée'
    });
    return response.data;
  },

  /**
   * Vérifier et marquer les dérogations expirées
   * @returns {Promise<Array>} Liste des dérogations marquées comme expirées
   */
  verifierExpirations: async () => {
    const response = await api.post(`${DEROGATIONS_BASE_URL}/verifier-expirations`);
    return response.data;
  },

  /**
   * Supprimer une dérogation
   * @param {number} id - ID de la dérogation
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await api.delete(`${DEROGATIONS_BASE_URL}/${id}`);
  },
};
