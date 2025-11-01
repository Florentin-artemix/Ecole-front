import api from './api';

export const eleveService = {
  // Récupérer tous les élèves
  getAllEleves: () => api.get('/eleves'),

  // Récupérer un élève par ID
  getEleveById: (id) => api.get(`/eleves/${id}`),

  // Créer un élève
  createEleve: (eleveData) => api.post('/eleves', eleveData),

  // Modifier un élève
  updateEleve: (id, eleveData) => api.put(`/eleves/${id}`, eleveData),

  // Supprimer un élève
  deleteEleve: (id) => api.delete(`/eleves/${id}`),
};
