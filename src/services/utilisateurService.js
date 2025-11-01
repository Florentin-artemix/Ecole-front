import api from './api';

export const utilisateurService = {
  // Récupérer tous les utilisateurs
  getAllUtilisateurs: () => api.get('/utilisateurs'),

  // Récupérer un utilisateur par ID
  getUtilisateurById: (id) => api.get(`/utilisateurs/${id}`),

  // Récupérer les utilisateurs par rôle
  getUtilisateursByRole: (role) => api.get(`/utilisateurs/role/${role}`),

  // Créer un utilisateur
  createUtilisateur: (utilisateurData) => api.post('/utilisateurs', utilisateurData),

  // Modifier un utilisateur
  updateUtilisateur: (id, utilisateurData) => api.put(`/utilisateurs/${id}`, utilisateurData),

  // Supprimer un utilisateur
  deleteUtilisateur: (id) => api.delete(`/utilisateurs/${id}`),
};
