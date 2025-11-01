import React, { useState, useEffect } from 'react';
import { utilisateurService } from '../services/utilisateurService';
import { ROLE_OPTIONS, ROLE_LABELS, ROLE_COLORS } from '../utils/enums';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import DataImporter from '../components/common/DataImporter';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function UtilisateursPage() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nomComplet: '',
    role: '',
    telephone: '',
    email: '',
    motDePasse: '',
  });

  useEffect(() => {
    loadUtilisateurs();
  }, []);

  const loadUtilisateurs = async () => {
    try {
      const response = await utilisateurService.getAllUtilisateurs();
      setUtilisateurs(response.data || []);
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        await utilisateurService.updateUtilisateur(editingUser.id, formData);
        setSuccess('Utilisateur modifié avec succès');
      } else {
        await utilisateurService.createUtilisateur(formData);
        setSuccess('Utilisateur créé avec succès');
      }
      loadUtilisateurs();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await utilisateurService.deleteUtilisateur(id);
      setSuccess('Utilisateur supprimé avec succès');
      loadUtilisateurs();
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
          await utilisateurService.createUtilisateur(item);
          successCount++;
        } catch (err) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSuccess(`${successCount} utilisateur(s) importé(s) avec succès${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
        loadUtilisateurs();
      } else {
        setError('Aucun utilisateur n\'a pu être importé');
      }
    } catch (error) {
      setError('Erreur lors de l\'importation');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nomComplet: user.nomComplet,
        role: user.role,
        telephone: user.telephone,
        email: user.email,
        motDePasse: '',
      });
    } else {
      setEditingUser(null);
      setFormData({ nomComplet: '', role: '', telephone: '', email: '', motDePasse: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ nomComplet: '', role: '', telephone: '', email: '', motDePasse: '' });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">Liste de tous les utilisateurs du système</p>
        </div>
        <div className="flex gap-3">
          <DataImporter onImport={handleImportJSON} type="utilisateurs" />
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Ajouter un Utilisateur
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilisateurs.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{user.nomComplet}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${ROLE_COLORS[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p className="flex items-center">
                <span className="mr-2">📧</span>
                {user.email}
              </p>
              <p className="flex items-center">
                <span className="mr-2">📱</span>
                {user.telephone}
              </p>
              <p className="flex items-center">
                <span className="mr-2">✅</span>
                {user.actif ? 'Actif' : 'Inactif'}
              </p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => openModal(user)}
                className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-1"
              >
                <PencilIcon className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex-1 btn btn-danger text-sm flex items-center justify-center gap-1"
              >
                <TrashIcon className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingUser ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomComplet}
                    onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
                    className="input"
                    placeholder="Ex: Jean Mukendi"
                  />
                </div>

                <div>
                  <label className="label">Rôle *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner un rôle</option>
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="input"
                    placeholder="+243..."
                  />
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="exemple@email.com"
                  />
                </div>

                <div>
                  <label className="label">
                    Mot de Passe {editingUser ? '(laisser vide pour ne pas modifier)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.motDePasse}
                    onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                    className="input"
                    placeholder="••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
