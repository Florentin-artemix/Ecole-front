import api from './api';

export const parentEleveService = {
  // Créer une relation parent-élève unique
  createRelation: (data) => api.post('/parent-eleve', data),

  // Créer plusieurs relations en batch
  createRelationsBatch: (data) => api.post('/parent-eleve/batch', data),

  // Récupérer un parent avec tous ses enfants
  getParentWithEnfants: (parentId) => api.get(`/parent-eleve/parent/${parentId}`),

  // Récupérer les enfants d'un parent
  getEnfantsByParent: (parentId) => api.get(`/parent-eleve/parent/${parentId}/enfants`),

  // Récupérer les parents d'un élève
  getParentsByEleve: (eleveId) => api.get(`/parent-eleve/eleve/${eleveId}/parents`),

  // Récupérer toutes les relations
  getAllRelations: () => api.get('/parent-eleve'),

  // Modifier une relation
  updateRelation: (id, data) => api.put(`/parent-eleve/${id}`, data),

  // Supprimer une relation
  deleteRelation: (id) => api.delete(`/parent-eleve/${id}`),
};
