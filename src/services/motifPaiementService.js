import api from './api';

/**
 * Service pour la gestion des motifs de paiement
 * Basé sur FRONTEND_API_CONTRACT.md
 */

const MOTIFS_PAIEMENT_BASE_URL = '/motifs-paiement';

export const motifPaiementService = {
  /**
   * Récupérer tous les motifs de paiement
   * @returns {Promise<Array>} Liste de tous les motifs
   */
  getAll: async () => {
    const response = await api.get(MOTIFS_PAIEMENT_BASE_URL);
    return response.data;
  },

  /**
   * Récupérer tous les motifs actifs
   * @returns {Promise<Array>} Liste des motifs actifs
   */
  getActifs: async () => {
    const response = await api.get(`${MOTIFS_PAIEMENT_BASE_URL}/actifs`);
    return response.data;
  },

  /**
   * Récupérer les motifs par période
   * @param {string} periode - PREMIERE, DEUXIEME, TROISIEME, EXAMEN_PREMIER_SEMESTRE, EXAMEN_SECOND_SEMESTRE
   * @returns {Promise<Array>} Liste des motifs pour cette période
   */
  getByPeriode: async (periode) => {
    const response = await api.get(`${MOTIFS_PAIEMENT_BASE_URL}/periode/${periode}`);
    return response.data;
  },

  /**
   * Récupérer les motifs actifs par période
   * @param {string} periode - PREMIERE, DEUXIEME, TROISIEME, EXAMEN_PREMIER_SEMESTRE, EXAMEN_SECOND_SEMESTRE
   * @returns {Promise<Array>} Liste des motifs actifs pour cette période
   */
  getActifsByPeriode: async (periode) => {
    const response = await api.get(`${MOTIFS_PAIEMENT_BASE_URL}/periode/${periode}/actifs`);
    return response.data;
  },

  /**
   * Récupérer un motif par ID
   * @param {number} id - ID du motif
   * @returns {Promise<Object>} Détails du motif
   */
  getById: async (id) => {
    const response = await api.get(`${MOTIFS_PAIEMENT_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Créer un nouveau motif de paiement
   * @param {Object} motifData - MotifPaiementCreateDTO
   * @param {string} motifData.libelle - Libellé du motif
   * @param {number} motifData.montantTotal - Montant total à payer
   * @param {string} motifData.periode - Période concernée
   * @param {boolean} [motifData.actif=true] - Statut actif (optionnel)
   * @returns {Promise<Object>} Motif créé
   */
  create: async (motifData) => {
    const response = await api.post(MOTIFS_PAIEMENT_BASE_URL, motifData);
    return response.data;
  },

  /**
   * Mettre à jour un motif de paiement
   * @param {number} id - ID du motif
   * @param {Object} motifData - MotifPaiementCreateDTO
   * @returns {Promise<Object>} Motif mis à jour
   */
  update: async (id, motifData) => {
    const response = await api.put(`${MOTIFS_PAIEMENT_BASE_URL}/${id}`, motifData);
    return response.data;
  },

  /**
   * Désactiver un motif de paiement
   * @param {number} id - ID du motif
   * @returns {Promise<Object>} Motif désactivé
   */
  desactiver: async (id) => {
    const response = await api.patch(`${MOTIFS_PAIEMENT_BASE_URL}/${id}/desactiver`);
    return response.data;
  },

  /**
   * Supprimer un motif de paiement
   * @param {number} id - ID du motif
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await api.delete(`${MOTIFS_PAIEMENT_BASE_URL}/${id}`);
  },
};
