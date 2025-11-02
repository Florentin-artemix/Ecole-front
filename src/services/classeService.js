import api from './api';

export const classeService = {
  // Récupérer toutes les classes
  getAllClasses: () => api.get('/classes'),

  // Récupérer une classe par ID
  getClasseById: (id) => api.get(`/classes/${id}`),

  // Créer une classe
  createClasse: (classeData) => api.post('/classes', classeData),

  // Modifier une classe
  updateClasse: (id, classeData) => api.put(`/classes/${id}`, classeData),

  // Supprimer une classe
  deleteClasse: (id) => api.delete(`/classes/${id}`),
};
