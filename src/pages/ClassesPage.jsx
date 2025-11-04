import React, { useState, useEffect } from 'react';
import { classeService } from '../services/classeService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClasse, setEditingClasse] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classeService.getAllClasses();
      setClasses(response.data || []);
    } catch {
      setError('Erreur lors du chargement des classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingClasse) {
        await classeService.updateClasse(editingClasse.id, formData);
        setSuccess('Classe modifiée avec succès');
      } else {
        await classeService.createClasse(formData);
        setSuccess('Classe créée avec succès');
      }
      loadClasses();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error('Erreur enregistrement:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ? Tous les cours associés seront également supprimés.')) return;

    try {
      await classeService.deleteClasse(id);
      setSuccess('Classe supprimée avec succès');
      loadClasses();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur suppression:', err);
    }
  };

  const openModal = (classe = null) => {
    if (classe) {
      setEditingClasse(classe);
      setFormData({
        nom: classe.nom,
        description: classe.description || '',
      });
    } else {
      setEditingClasse(null);
      setFormData({ nom: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClasse(null);
    setFormData({ nom: '', description: '' });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Classes</h1>
          <p className="text-gray-600 mt-2">Liste de toutes les classes de l'école</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Ajouter une Classe
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Classe</th>
                <th className="px-6 py-4 text-left font-semibold">Description</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map((classe, index) => (
                <tr key={classe.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                    {classe.nom}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {classe.description || 'Aucune description'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(classe)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(classe.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingClasse ? 'Modifier la Classe' : 'Ajouter une Classe'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form id="classe-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Nom de la Classe *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="input"
                    placeholder="Ex: 1ère, 2ème, 3ème..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Exemples : 1ère, 2ème, 3ème, 4ème, 5ème, 6ème
                  </p>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="3"
                    placeholder="Ex: Première année du secondaire"
                  />
                </div>
              </div>
            </form>

            <div className="flex gap-4 justify-end p-6 border-t bg-gray-50 flex-shrink-0">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" form="classe-form" className="btn btn-primary">
                {editingClasse ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
