import api from './api';

export const noteService = {
  // Récupérer toutes les notes
  getAllNotes: () => api.get('/notes'),

  // Récupérer une note par ID
  getNoteById: (id) => api.get(`/notes/${id}`),

  // Récupérer les notes d'un élève
  getNotesByEleve: (eleveId) => api.get(`/notes/eleve/${eleveId}`),

  // Récupérer les notes d'un cours
  getNotesByCours: (coursId) => api.get(`/notes/cours/${coursId}`),

  // Créer une note
  createNote: (noteData) => api.post('/notes', noteData),

  // Créer plusieurs notes en batch
  createNotesBatch: (notesData) => api.post('/notes/batch', notesData),

  // Modifier une note
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),

  // Supprimer une note
  deleteNote: (id) => api.delete(`/notes/${id}`),
};
