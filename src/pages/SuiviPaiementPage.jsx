import React, { useState, useEffect } from 'react';
import { suiviPaiementService } from '../services/suiviPaiementService';
import { eleveService } from '../services/eleveService';
import { motifPaiementService } from '../services/motifPaiementService';
import { derogationService } from '../services/derogationService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import { PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { STATUT_PAIEMENT_LABELS, STATUT_PAIEMENT_COLORS, PERIODE_LABELS } from '../utils/enums';

export default function SuiviPaiementPage() {
  const [suivis, setSuivis] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [motifs, setMotifs] = useState([]);
  const [derogations, setDerogations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterEleve, setFilterEleve] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterMotif, setFilterMotif] = useState('');
  const [creatingForAll, setCreatingForAll] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [suivisData, elevesResponse, motifsData] = await Promise.all([
        suiviPaiementService.getAll(),
        eleveService.getAllEleves(),
        motifPaiementService.getActifs(),
      ]);
      const elevesData = elevesResponse.data || elevesResponse;
      setSuivis(suivisData || []);
      setEleves(elevesData || []);
      setMotifs(motifsData || []);

      // Charger les dérogations valides pour chaque élève
      const derogationsMap = {};
      for (const eleve of elevesData) {
        try {
          const derogation = await derogationService.getValide(eleve.id);
          if (derogation) {
            derogationsMap[eleve.id] = derogation;
          }
        } catch (err) {
          // Ignorer les erreurs (élève sans dérogation)
        }
      }
      setDerogations(derogationsMap);
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForAllEleves = async (motifId) => {
    if (!motifId) {
      setError('Veuillez sélectionner un motif de paiement');
      return;
    }

    if (!window.confirm('Créer un suivi de paiement pour TOUS les élèves avec ce motif ?')) return;

    setCreatingForAll(true);
    try {
      const created = await suiviPaiementService.createForAllEleves(parseInt(motifId));
      setSuccess(`${created.length} suivi(s) créé(s) avec succès`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      console.error('Erreur création:', err);
    } finally {
      setCreatingForAll(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce suivi ?')) return;

    try {
      await suiviPaiementService.delete(id);
      setSuccess('Suivi supprimé avec succès');
      loadData();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur suppression:', err);
    }
  };

  const checkEnOrdre = async (eleveId) => {
    try {
      const isEnOrdre = await suiviPaiementService.isEnOrdre(eleveId);
      if (isEnOrdre) {
        setSuccess('Cet élève est en ordre de paiement ✓');
      } else {
        setError('Cet élève n\'est PAS en ordre de paiement ✗');
      }
    } catch (err) {
      setError('Erreur lors de la vérification');
      console.error('Erreur vérification:', err);
    }
  };

  // Filtrage des suivis
  const filteredSuivis = suivis.filter((suivi) => {
    if (filterEleve && suivi.eleveId !== parseInt(filterEleve)) return false;
    if (filterStatut && suivi.statutPaiement !== filterStatut) return false;
    if (filterMotif && suivi.motifPaiementId !== parseInt(filterMotif)) return false;
    return true;
  });

  // Statistiques
  const stats = {
    total: filteredSuivis.length,
    payeComplet: filteredSuivis.filter((s) => s.statutPaiement === 'PAYE_COMPLET').length,
    paiementPartiel: filteredSuivis.filter((s) => s.statutPaiement === 'PAIEMENT_PARTIEL').length,
    nonPaye: filteredSuivis.filter((s) => s.statutPaiement === 'NON_PAYE').length,
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'PAYE_COMPLET':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'PAIEMENT_PARTIEL':
        return <ExclamationCircleIcon className="w-5 h-5" />;
      case 'NON_PAYE':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Suivi des Paiements</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Tableau de bord des paiements des élèves</p>
        </div>
        <div className="w-full lg:w-auto">
          <select
            onChange={(e) => handleCreateForAllEleves(e.target.value)}
            className="input w-full lg:max-w-xs"
            disabled={creatingForAll}
          >
            <option value="">Créer suivi pour tous les élèves...</option>
            {motifs.map((motif) => (
              <option key={motif.id} value={motif.id}>
                {motif.libelle} ({PERIODE_LABELS[motif.periode]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="text-xs sm:text-sm font-medium text-gray-500">Total</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 sm:p-6 text-white">
          <div className="text-xs sm:text-sm font-medium opacity-90">Payé complet</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.payeComplet}</div>
          <div className="text-xs sm:text-sm opacity-75 mt-1">
            {stats.total > 0 ? Math.round((stats.payeComplet / stats.total) * 100) : 0}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-4 sm:p-6 text-white">
          <div className="text-xs sm:text-sm font-medium opacity-90">Paiement partiel</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.paiementPartiel}</div>
          <div className="text-xs sm:text-sm opacity-75 mt-1">
            {stats.total > 0 ? Math.round((stats.paiementPartiel / stats.total) * 100) : 0}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-4 sm:p-6 text-white">
          <div className="text-xs sm:text-sm font-medium opacity-90">Non payé</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.nonPaye}</div>
          <div className="text-xs sm:text-sm opacity-75 mt-1">
            {stats.total > 0 ? Math.round((stats.nonPaye / stats.total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par motif</label>
            <select
              value={filterMotif}
              onChange={(e) => setFilterMotif(e.target.value)}
              className="input"
            >
              <option value="">Tous les motifs</option>
              {motifs.map((motif) => (
                <option key={motif.id} value={motif.id}>
                  {motif.libelle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="input"
            >
              <option value="">Tous les statuts</option>
              <option value="PAYE_COMPLET">Payé complet</option>
              <option value="PAIEMENT_PARTIEL">Paiement partiel</option>
              <option value="NON_PAYE">Non payé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des suivis - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-x-auto">
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
                Montant Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant Payé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reste
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                En Ordre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSuivis.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  Aucun suivi de paiement trouvé
                </td>
              </tr>
            ) : (
              filteredSuivis.map((suivi) => {
                // Récupérer les infos de l'élève et du motif si pas dans le DTO
                const eleve = eleves.find(e => e.id === suivi.eleveId);
                const derogation = derogations[suivi.eleveId];
                const isEnOrdre = suivi.statutPaiement === 'PAYE_COMPLET' || (derogation && derogation.estValide);
                const raisonEnOrdre = suivi.statutPaiement === 'PAYE_COMPLET' 
                  ? 'Solde = 0' 
                  : (derogation ? 'Dérogation valide' : null);
                const motif = motifs.find(m => m.id === suivi.motifPaiementId);
                
                return (
                  <tr key={suivi.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {suivi.eleveNom || (eleve ? `${eleve.prenom} ${eleve.nom}` : 'N/A')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {suivi.eleveClasse || eleve?.classeNom || 'N/A'}
                      </div>
                      <button
                        onClick={() => checkEnOrdre(suivi.eleveId)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                      >
                        Vérifier statut global
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {suivi.motifLibelle || motif?.libelle || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {PERIODE_LABELS[suivi.motifPeriode || motif?.periode] || suivi.motifPeriode || motif?.periode || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {suivi.montantTotal != null ? suivi.montantTotal.toFixed(2) : '0.00'} FC
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {suivi.montantPaye != null ? suivi.montantPaye.toFixed(2) : '0.00'} FC
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-red-600">
                        {suivi.montantRestant != null ? suivi.montantRestant.toFixed(2) : '0.00'} FC
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_PAIEMENT_COLORS[suivi.statutPaiement] || 'bg-gray-100 text-gray-800'}`}>
                        {getStatutIcon(suivi.statutPaiement)}
                        {STATUT_PAIEMENT_LABELS[suivi.statutPaiement] || suivi.statutPaiement || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isEnOrdre ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                            <CheckCircleIcon className="w-4 h-4" />
                            ✓ En ordre
                          </span>
                          {raisonEnOrdre && (
                            <span className="text-xs text-gray-500">
                              {raisonEnOrdre}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                          <XCircleIcon className="w-4 h-4" />
                          ✗ Pas en ordre
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(suivi.id)}
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
        {filteredSuivis.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            Aucun suivi de paiement trouvé
          </div>
        ) : (
          filteredSuivis.map((suivi) => {
            const eleve = eleves.find(e => e.id === suivi.eleveId);
            const motif = motifs.find(m => m.id === suivi.motifPaiementId);
            const derogation = derogations[suivi.eleveId];
            const isEnOrdre = suivi.statutPaiement === 'PAYE_COMPLET' || (derogation && derogation.estValide);
            const raisonEnOrdre = suivi.statutPaiement === 'PAYE_COMPLET' 
              ? 'Solde = 0' 
              : (derogation ? 'Dérogation valide' : null);
            
            return (
              <div key={suivi.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {suivi.eleveNom || (eleve ? `${eleve.prenom} ${eleve.nom}` : 'N/A')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {suivi.eleveClasse || eleve?.classeNom || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(suivi.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600">{suivi.motifLibelle || motif?.libelle || 'N/A'}</div>
                  <div className="text-xs text-gray-500">
                    {PERIODE_LABELS[suivi.motifPeriode || motif?.periode] || suivi.motifPeriode || motif?.periode || 'N/A'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600">Total</div>
                    <div className="font-semibold text-blue-600 text-sm">
                      {suivi.montantTotal != null ? suivi.montantTotal.toFixed(0) : '0'} FC
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600">Payé</div>
                    <div className="font-semibold text-green-600 text-sm">
                      {suivi.montantPaye != null ? suivi.montantPaye.toFixed(0) : '0'} FC
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2">
                    <div className="text-xs text-gray-600">Reste</div>
                    <div className="font-semibold text-orange-600 text-sm">
                      {suivi.montantRestant != null ? suivi.montantRestant.toFixed(0) : '0'} FC
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium flex-1 justify-center ${STATUT_PAIEMENT_COLORS[suivi.statutPaiement] || 'bg-gray-100 text-gray-800'}`}>
                    {getStatutIcon(suivi.statutPaiement)}
                    {STATUT_PAIEMENT_LABELS[suivi.statutPaiement] || suivi.statutPaiement}
                  </span>
                  
                  {isEnOrdre ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-4 h-4" />
                      En ordre
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircleIcon className="w-4 h-4" />
                      Pas en ordre
                    </span>
                  )}
                </div>
                
                {isEnOrdre && raisonEnOrdre && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {raisonEnOrdre}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
