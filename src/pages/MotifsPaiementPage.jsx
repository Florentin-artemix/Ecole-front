import React, { useState, useEffect } from 'react';
import { motifPaiementService } from '../services/motifPaiementService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { PERIODE_OPTIONS, PERIODE_LABELS } from '../utils/enums';

export default function MotifsPaiementPage() {
  const [motifs, setMotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMotif, setEditingMotif] = useState(null);
  const [filterPeriode, setFilterPeriode] = useState('');
  const [filterActif, setFilterActif] = useState('all'); // all, actif, inactif
  const [formData, setFormData] = useState({
    libelle: '',
    montant: '',
    periode: 'PREMIERE',
    actif: true,
  });

  useEffect(() => {
    loadMotifs();
  }, []);

  const loadMotifs = async () => {
    try {
      const data = await motifPaiementService.getAll();
      setMotifs(data || []);
    } catch {
      setError('Erreur lors du chargement des motifs de paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.libelle.trim()) {
      setError('Le libellé est requis');
      return;
    }
    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    const payload = {
      libelle: formData.libelle.trim(),
      montantTotal: parseFloat(formData.montant),
      periode: formData.periode,
      actif: formData.actif,
    };

    try {
      if (editingMotif) {
        await motifPaiementService.update(editingMotif.id, payload);
        setSuccess('Motif modifié avec succès');
      } else {
        await motifPaiementService.create(payload);
        setSuccess('Motif créé avec succès');
      }
      loadMotifs();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error('Erreur enregistrement:', err);
    }
  };

  const handleDesactiver = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver ce motif de paiement ?')) return;

    try {
      await motifPaiementService.desactiver(id);
      setSuccess('Motif désactivé avec succès');
      loadMotifs();
    } catch (err) {
      setError('Erreur lors de la désactivation');
      console.error('Erreur désactivation:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce motif de paiement ? Cette action est irréversible.')) return;

    try {
      await motifPaiementService.delete(id);
      setSuccess('Motif supprimé avec succès');
      loadMotifs();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
      console.error('Erreur suppression:', err);
    }
  };

  const openModal = (motif = null) => {
    if (motif) {
      setEditingMotif(motif);
      setFormData({
        libelle: motif.libelle,
        montant: motif.montantTotal?.toString() || '',
        periode: motif.periode,
        actif: motif.actif,
      });
    } else {
      setEditingMotif(null);
      setFormData({ libelle: '', montant: '', periode: 'PREMIERE', actif: true });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMotif(null);
    setFormData({ libelle: '', montant: '', periode: 'PREMIERE', actif: true });
  };

  // Filtrage des motifs
  const filteredMotifs = motifs.filter((motif) => {
    if (filterPeriode && motif.periode !== filterPeriode) return false;
    if (filterActif === 'actif' && !motif.actif) return false;
    if (filterActif === 'inactif' && motif.actif) return false;
    return true;
  });

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Motifs de Paiement</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Gérer les motifs de paiement pour chaque période</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Nouveau Motif</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par période</label>
            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value)}
              className="input"
            >
              <option value="">Toutes les périodes</option>
              {PERIODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
            <select
              value={filterActif}
              onChange={(e) => setFilterActif(e.target.value)}
              className="input"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actifs uniquement</option>
              <option value="inactif">Inactifs uniquement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des motifs - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libellé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMotifs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  Aucun motif de paiement trouvé
                </td>
              </tr>
            ) : (
              filteredMotifs.map((motif) => (
                <tr key={motif.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{motif.libelle || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-blue-600">
                      {motif.montantTotal != null ? motif.montantTotal.toFixed(2) : '0.00'} FC
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{PERIODE_LABELS[motif.periode] || motif.periode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {motif.actif ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-4 h-4" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircleIcon className="w-4 h-4" />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(motif)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Modifier"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    {motif.actif && (
                      <button
                        onClick={() => handleDesactiver(motif.id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-4"
                        title="Désactiver"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(motif.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vue mobile - Cards */}
      <div className="md:hidden space-y-4">
        {filteredMotifs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            Aucun motif de paiement trouvé
          </div>
        ) : (
          filteredMotifs.map((motif) => (
            <div key={motif.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{motif.libelle || 'N/A'}</h3>
                  <p className="text-sm text-gray-500 mt-1">{PERIODE_LABELS[motif.periode] || motif.periode}</p>
                </div>
                {motif.actif ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="w-4 h-4" />
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XCircleIcon className="w-4 h-4" />
                    Inactif
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {motif.montantTotal != null ? motif.montantTotal.toFixed(2) : '0.00'} FC
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(motif)}
                  className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                  title="Modifier"
                >
                  <PencilIcon className="w-4 h-4" />
                  Modifier
                </button>
                {motif.actif && (
                  <button
                    onClick={() => handleDesactiver(motif.id)}
                    className="btn btn-secondary px-3"
                    title="Désactiver"
                  >
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(motif.id)}
                  className="btn btn-secondary px-3 text-red-600"
                  title="Supprimer"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingMotif ? 'Modifier le motif' : 'Nouveau motif de paiement'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Libellé *
                </label>
                <input
                  type="text"
                  value={formData.libelle}
                  onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                  className="input"
                  placeholder="Ex: Frais 1ère période"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (FC) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montant}
                  onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                  className="input"
                  placeholder="Ex: 5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Période *
                </label>
                <select
                  value={formData.periode}
                  onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                  className="input"
                  required
                >
                  {PERIODE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="actif" className="ml-2 block text-sm text-gray-900">
                  Motif actif
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMotif ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
