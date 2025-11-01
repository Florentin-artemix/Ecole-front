import React, { useState, useEffect } from 'react';
import { coursService } from '../services/coursService';
import { utilisateurService } from '../services/utilisateurService';
import { ROLE_ENUM } from '../utils/enums';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import DataImporter from '../components/common/DataImporter';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CoursPage() {
  const [cours, setCours] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCours, setEditingCours] = useState(null);
  const [formData, setFormData] = useState({
    nomCours: '',
    ponderation: '',
    professeurId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursRes, profsRes] = await Promise.all([
        coursService.getAllCours(),
        utilisateurService.getUtilisateursByRole(ROLE_ENUM.PROFESSEUR),
      ]);
      setCours(coursRes.data || []);
      setProfesseurs(profsRes.data || []);
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = {
        ...formData,
        ponderation: parseInt(formData.ponderation),
        professeurId: parseInt(formData.professeurId),
      };

      if (editingCours) {
        await coursService.updateCours(editingCours.id, data);
        setSuccess('Cours modifié avec succès');
      } else {
        await coursService.createCours(data);
        setSuccess('Cours créé avec succès');
      }
      loadData();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    try {
      await coursService.deleteCours(id);
      setSuccess('Cours supprimé avec succès');
      loadData();
    } catch (error) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleImportJSON = async (data) => {
    try {
      const dataArray = Array.isArray(data) ? data : [data];
      let successCount = 0;
      let errorCount = 0;

      for (const item of dataArray) {
        try {
          const coursData = {
            ...item,
            ponderation: parseInt(item.ponderation),
            professeurId: parseInt(item.professeurId),
          };
          await coursService.createCours(coursData);
          successCount++;
        } catch (err) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSuccess(`${successCount} cours importé(s) avec succès${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
        loadData();
      } else {
        setError('Aucun cours n\'a pu être importé');
      }
    } catch (error) {
      setError('Erreur lors de l\'importation');
    }
  };

  const openModal = (coursItem = null) => {
    if (coursItem) {
      setEditingCours(coursItem);
      setFormData({
        nomCours: coursItem.nomCours,
        ponderation: coursItem.ponderation.toString(),
        professeurId: coursItem.professeurId?.toString() || '',
      });
    } else {
      setEditingCours(null);
      setFormData({ nomCours: '', ponderation: '', professeurId: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCours(null);
    setFormData({ nomCours: '', ponderation: '', professeurId: '' });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
          <p className="text-gray-600 mt-2">Liste de tous les cours disponibles</p>
        </div>
        <div className="flex gap-3">
          <DataImporter onImport={handleImportJSON} type="cours" />
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Ajouter un Cours
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cours.map((coursItem) => {
          const prof = professeurs.find((p) => p.id === coursItem.professeurId);
          return (
            <div key={coursItem.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{coursItem.nomCours}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Pondération: {coursItem.ponderation}
                    </span>
                  </div>
                </div>
              </div>

              {prof && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Professeur</p>
                  <p className="font-medium text-gray-900">{prof.nomComplet}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => openModal(coursItem)}
                  className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-1"
                >
                  <PencilIcon className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(coursItem.id)}
                  className="flex-1 btn btn-danger text-sm flex items-center justify-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCours ? 'Modifier le Cours' : 'Ajouter un Cours'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Nom du Cours *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomCours}
                    onChange={(e) => setFormData({ ...formData, nomCours: e.target.value })}
                    className="input"
                    placeholder="Ex: Mathématiques"
                  />
                </div>

                <div>
                  <label className="label">Pondération *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.ponderation}
                    onChange={(e) => setFormData({ ...formData, ponderation: e.target.value })}
                    className="input"
                    placeholder="Ex: 5"
                  />
                </div>

                <div>
                  <label className="label">Professeur *</label>
                  <select
                    required
                    value={formData.professeurId}
                    onChange={(e) => setFormData({ ...formData, professeurId: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner un professeur</option>
                    {professeurs.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nomComplet}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCours ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
