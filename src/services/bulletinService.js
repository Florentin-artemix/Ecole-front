import api from './api';

export const bulletinService = {
  // Récupérer le bulletin d'un élève pour une période donnée
  getBulletin: (eleveId, periode) => api.get(`/bulletins/${eleveId}/${periode}`),
};
