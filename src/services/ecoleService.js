import api from './api';

export const ecoleService = {
  // Récupérer les informations de l'école (première configurée)
  getEcoleInfo: () => api.get('/ecole'),

  // Récupérer toutes les écoles
  getAllEcoles: () => api.get('/ecole/all'),

  // Récupérer une école par ID
  getEcoleById: (id) => api.get(`/ecole/${id}`),

  // Créer une nouvelle école
  createEcole: (data) => api.post('/ecole', data),

  // Mettre à jour une école
  updateEcole: (id, data) => api.put(`/ecole/${id}`, data),

  // Supprimer une école
  deleteEcole: (id) => api.delete(`/ecole/${id}`),
};
