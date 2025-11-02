import api from './api';

export const conduiteService = {
  // Récupérer toutes les conduites
  getAllConduites: () => api.get('/conduites'),

  // Récupérer une conduite par ID
  getConduiteById: (id) => api.get(`/conduites/${id}`),

  // Récupérer les conduites d'un élève pour une période
  getConduitesByEleveAndPeriode: (eleveId, periode) => 
    api.get(`/conduites/eleve/${eleveId}/periode/${periode}`),

  // Récupérer les conduites d'un professeur pour une période
  getConduitesByProfesseurAndPeriode: (professeurId, periode) =>
    api.get(`/conduites/professeur/${professeurId}/periode/${periode}`),

  // Récupérer la conduite la plus fréquente d'un élève pour une période
  getMostFrequentConduite: (eleveId, periode) =>
    api.get(`/conduites/eleve/${eleveId}/periode/${periode}/most-frequent`),

  // NOUVEAU: Calculer la conduite finale avec détails complets (pourcentage moyen, mention, appréciation)
  getConduiteCalcul: (eleveId, periode) =>
    api.get(`/conduites/eleve/${eleveId}/periode/${periode}/calcul`),

  // NOUVEAU: Obtenir uniquement le pourcentage moyen
  getPourcentageConduite: (eleveId, periode) =>
    api.get(`/conduites/eleve/${eleveId}/periode/${periode}/pourcentage`),

  // Créer une conduite
  createConduite: (conduiteData) => api.post('/conduites', conduiteData),

  // Créer plusieurs conduites en batch
  createMultipleConduites: (conduitesData) => api.post('/conduites/batch', conduitesData),

  // Modifier une conduite
  updateConduite: (id, conduiteData) => api.put(`/conduites/${id}`, conduiteData),

  // Supprimer une conduite
  deleteConduite: (id) => api.delete(`/conduites/${id}`),
};
