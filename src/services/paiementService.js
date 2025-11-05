import api from './api';

/**
 * Service pour la gestion des paiements
 * Basé sur FRONTEND_API_CONTRACT.md
 * Note: URL sans préfixe /api car api.js a déjà baseURL avec /api
 */

const PAIEMENTS_BASE_URL = '/paiements';

export const paiementService = {
  /**
   * Récupérer tous les paiements
   * @returns {Promise<Array>} Liste de tous les paiements
   */
  getAll: async () => {
    const response = await api.get(PAIEMENTS_BASE_URL);
    return response.data;
  },

  /**
   * Récupérer les paiements d'un élève
   * @param {number} eleveId - ID de l'élève
   * @returns {Promise<Array>} Liste des paiements de l'élève
   */
  getByEleve: async (eleveId) => {
    const response = await api.get(`${PAIEMENTS_BASE_URL}/eleve/${eleveId}`);
    return response.data;
  },

  /**
   * Récupérer un paiement par ID
   * @param {number} id - ID du paiement
   * @returns {Promise<Object>} Détails du paiement
   */
  getById: async (id) => {
    const response = await api.get(`${PAIEMENTS_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Enregistrer un nouveau paiement
   * @param {Object} paiementData - PaiementCreateDTO
   * @param {number} paiementData.eleveId - ID de l'élève
   * @param {number} paiementData.motifPaiementId - ID du motif de paiement
   * @param {number} paiementData.montantPaye - Montant payé
   * @param {string} [paiementData.datePaiement] - Date du paiement (ISO 8601, optionnel)
   * @param {string} [paiementData.remarque] - Remarque (optionnel)
   * @returns {Promise<Object>} Paiement créé
   */
  create: async (paiementData) => {
    const response = await api.post(PAIEMENTS_BASE_URL, paiementData);
    return response.data;
  },

  /**
   * Supprimer un paiement
   * @param {number} id - ID du paiement
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await api.delete(`${PAIEMENTS_BASE_URL}/${id}`);
  },
};
