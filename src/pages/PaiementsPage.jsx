import React, { useState, useEffect } from 'react';
import { paiementService } from '../services/paiementService';
import { eleveService } from '../services/eleveService';
import { motifPaiementService } from '../services/motifPaiementService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PERIODE_LABELS } from '../utils/enums';

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterEleve, setFilterEleve] = useState('');
  const [formData, setFormData] = useState({
    eleveId: '',
    motifPaiementId: '',
    montantPaye: '',
    datePaiement: new Date().toISOString().split('T')[0],
    remarque: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paiementsData, elevesResponse, motifsData] = await Promise.all([
        paiementService.getAll(),
        eleveService.getAllEleves(),
        motifPaiementService.getActifs(),
      ]);
      const elevesData = elevesResponse.data || elevesResponse;
      setPaiements(paiementsData || []);
      setEleves(elevesData || []);
      setMotifs(motifsData || []);
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.eleveId) {
      setError('Veuillez sélectionner un élève');
      return;
    }
    if (!formData.motifPaiementId) {
      setError('Veuillez sélectionner un motif de paiement');
      return;
    }
    if (!formData.montantPaye || parseFloat(formData.montantPaye) <= 0) {
      setError('Le montant payé doit être supérieur à 0');
      return;
    }

    const payload = {
      eleveId: parseInt(formData.eleveId),
      motifPaiementId: parseInt(formData.motifPaiementId),
      montantPaye: parseFloat(formData.montantPaye),
      datePaiement: formData.datePaiement + 'T00:00:00', // Backend expects LocalDateTime format
      remarque: formData.remarque.trim() || null,
    };

    try {
      await paiementService.create(payload);
      setSuccess('Paiement enregistré avec succès');
      loadData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
      console.error('Erreur enregistrement:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) return;

    try {
      await paiementService.delete(id);
      setSuccess('Paiement supprimé avec succès');
      loadData();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur suppression:', err);
    }
  };

  const openModal = () => {
    setFormData({
      eleveId: '',
      motifPaiementId: '',
      montantPaye: '',
      datePaiement: new Date().toISOString().split('T')[0],
      remarque: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      eleveId: '',
      motifPaiementId: '',
      montantPaye: '',
      datePaiement: new Date().toISOString().split('T')[0],
      remarque: '',
    });
  };

  const handleMotifChange = (motifId) => {
    setFormData({ ...formData, motifPaiementId: motifId });
    const motif = motifs.find((m) => m.id === parseInt(motifId));
    if (motif && !formData.montantPaye && motif.montantTotal) {
      setFormData({ ...formData, motifPaiementId: motifId, montantPaye: motif.montantTotal.toString() });
    }
  };

  // Filtrage des paiements
  const filteredPaiements = paiements.filter((paiement) => {
    if (filterEleve && paiement.eleveId !== parseInt(filterEleve)) return false;
    return true;
  });

  // Calcul du total
  const totalPaye = filteredPaiements.reduce((sum, p) => sum + (p.montantPaye || 0), 0);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Enregistrement des Paiements</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Enregistrer les paiements effectués par les élèves</p>
        </div>
        <button onClick={openModal} className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Nouveau Paiement</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filtres et stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par élève</label>
          <select
            value={filterEleve}
            onChange={(e) => setFilterEleve(e.target.value)}
            className="input"
          >
            <option value="">Tous les élèves</option>
            {eleves.map((eleve) => (
              <option key={eleve.id} value={eleve.id}>
                {eleve.prenom} {eleve.nom} - {eleve.classeNom}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total des paiements</div>
          <div className="text-3xl font-bold mt-2">{totalPaye.toFixed(2)} FC</div>
          <div className="text-sm opacity-75 mt-1">
            {filteredPaiements.length} paiement{filteredPaiements.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Tableau des paiements - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Élève
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarque
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPaiements.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Aucun paiement enregistré
                </td>
              </tr>
            ) : (
              filteredPaiements.map((paiement) => {
                // Récupérer les infos de l'élève et du motif si pas dans le DTO
                const eleve = eleves.find(e => e.id === paiement.eleveId);
                const motif = motifs.find(m => m.id === paiement.motifPaiementId);
                
                return (
                  <tr key={paiement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {paiement.eleveNom || (eleve ? `${eleve.prenom} ${eleve.nom}` : 'N/A')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {paiement.eleveClasse || eleve?.classeNom || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {paiement.motifLibelle || motif?.libelle || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {PERIODE_LABELS[paiement.motifPeriode || motif?.periode] || paiement.motifPeriode || motif?.periode || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {paiement.montantPaye != null ? paiement.montantPaye.toFixed(2) : '0.00'} FC
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {paiement.datePaiement ? new Date(paiement.datePaiement).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{paiement.remarque || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(paiement.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Vue mobile - Cards */}
      <div className="lg:hidden space-y-4">
        {filteredPaiements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            Aucun paiement enregistré
          </div>
        ) : (
          filteredPaiements.map((paiement) => {
            const eleve = eleves.find(e => e.id === paiement.eleveId);
            const motif = motifs.find(m => m.id === paiement.motifPaiementId);
            
            return (
              <div key={paiement.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {paiement.eleveNom || (eleve ? `${eleve.prenom} ${eleve.nom}` : 'N/A')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {paiement.eleveClasse || eleve?.classeNom || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(paiement.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Motif:</span>
                    <span className="font-medium text-gray-900">
                      {paiement.motifLibelle || motif?.libelle || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Période:</span>
                    <span className="font-medium text-gray-900">
                      {PERIODE_LABELS[paiement.motifPeriode || motif?.periode] || paiement.motifPeriode || motif?.periode || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-semibold text-green-600 text-base">
                      {paiement.montantPaye != null ? paiement.montantPaye.toFixed(2) : '0.00'} FC
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {paiement.datePaiement ? new Date(paiement.datePaiement).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                  
                  {paiement.remarque && (
                    <div className="pt-2">
                      <span className="text-gray-600 text-xs">Remarque:</span>
                      <p className="text-gray-700 mt-1">{paiement.remarque}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Enregistrer un paiement</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Élève *
                </label>
                <select
                  value={formData.eleveId}
                  onChange={(e) => setFormData({ ...formData, eleveId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Sélectionner un élève</option>
                  {eleves.map((eleve) => (
                    <option key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} - {eleve.classeNom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif de paiement *
                </label>
                <select
                  value={formData.motifPaiementId}
                  onChange={(e) => handleMotifChange(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Sélectionner un motif</option>
                  {motifs.map((motif) => (
                    <option key={motif.id} value={motif.id}>
                      {motif.libelle} - {motif.montantTotal != null ? motif.montantTotal.toFixed(2) : '0.00'} FC ({PERIODE_LABELS[motif.periode]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant payé (FC) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.montantPaye}
                  onChange={(e) => setFormData({ ...formData, montantPaye: e.target.value })}
                  className="input"
                  placeholder="Ex: 5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de paiement *
                </label>
                <input
                  type="date"
                  value={formData.datePaiement}
                  onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarque (optionnel)
                </label>
                <textarea
                  value={formData.remarque}
                  onChange={(e) => setFormData({ ...formData, remarque: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Notes supplémentaires..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
