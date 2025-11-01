import api from './api';

export const coursService = {
  // Récupérer tous les cours
  getAllCours: () => api.get('/cours'),

  // Récupérer un cours par ID
  getCoursById: (id) => api.get(`/cours/${id}`),

  // Créer un cours
  createCours: (coursData) => api.post('/cours', coursData),

  // Modifier un cours
  updateCours: (id, coursData) => api.put(`/cours/${id}`, coursData),

  // Supprimer un cours
  deleteCours: (id) => api.delete(`/cours/${id}`),
};
