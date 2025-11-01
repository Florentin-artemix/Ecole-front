import api from './api';

export const eleveService = {
  // Récupérer tous les élèves
  getAllEleves: () => api.get('/eleves'),

  // Récupérer un élève par ID
  getEleveById: (id) => api.get(`/eleves/${id}`),

  // Créer un élève
  createEleve: (eleveData) => {
    // Transformer ecoleId en objet ecole si nécessaire
    const data = { ...eleveData };
    if (data.ecoleId) {
      data.ecole = { id: data.ecoleId };
      delete data.ecoleId;
    }
    return api.post('/eleves', data);
  },

  // Modifier un élève
  updateEleve: (id, eleveData) => {
    // Transformer ecoleId en objet ecole si nécessaire
    const data = { ...eleveData };
    if (data.ecoleId) {
      data.ecole = { id: data.ecoleId };
      delete data.ecoleId;
    }
    return api.put(`/eleves/${id}`, data);
  },

  // Supprimer un élève
  deleteEleve: (id) => api.delete(`/eleves/${id}`),
};
