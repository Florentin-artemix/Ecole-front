import React, { useState, useEffect } from 'react';
import { derogationService } from '../services/derogationService';
import { eleveService } from '../services/eleveService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import { PlusIcon, TrashIcon, XMarkIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { STATUT_DEROGATION_LABELS, STATUT_DEROGATION_COLORS } from '../utils/enums';

export default function DerogationsPage() {
  const [derogations, setDerogations] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [showAccepterModal, setShowAccepterModal] = useState(false);
  const [selectedDerogation, setSelectedDerogation] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');
  const [filterEleve, setFilterEleve] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [accepterData, setAccepterData] = useState({
    dateExpiration: '',
    accordeePar: '',
  });
  const [formData, setFormData] = useState({
    eleveId: '',
    motif: '',
    dateDebut: '',
    dateFin: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [derogationsData, elevesResponse] = await Promise.all([
        derogationService.getAll(),
        eleveService.getAllEleves(),
      ]);
      const elevesData = elevesResponse.data || elevesResponse;
      setDerogations(derogationsData || []);
      setEleves(elevesData || []);
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
    if (!formData.motif.trim()) {
      setError('Le motif est requis');
      return;
    }
    if (!formData.dateDebut || !formData.dateFin) {
      setError('Les dates de début et de fin sont requises');
      return;
    }
    if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      setError('La date de fin doit être postérieure à la date de début');
      return;
    }

    const payload = {
      eleveId: parseInt(formData.eleveId),
      motif: formData.motif.trim(),
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
    };

    try {
      await derogationService.create(payload);
      setSuccess('Demande de dérogation créée avec succès');
      loadData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
      console.error('Erreur création:', err);
    }
  };

  const openAccepterModal = (derogation) => {
    setSelectedDerogation(derogation);
    // Date d'expiration par défaut : 3 mois à partir d'aujourd'hui
    const defaultExpiration = new Date();
    defaultExpiration.setMonth(defaultExpiration.getMonth() + 3);
    setAccepterData({
      dateExpiration: defaultExpiration.toISOString().slice(0, 16),
      accordeePar: '',
    });
    setShowAccepterModal(true);
  };

  const handleAccepter = async () => {
    if (!selectedDerogation) return;

    if (!accepterData.dateExpiration) {
      setError('La date d\'expiration est obligatoire');
      return;
    }
    if (!accepterData.accordeePar || accepterData.accordeePar.trim() === '') {
      setError('Le nom de la personne accordant la dérogation est obligatoire');
      return;
    }

    try {
      await derogationService.accepter(selectedDerogation.id, accepterData);
      setSuccess('Dérogation acceptée avec succès');
      setShowAccepterModal(false);
      setSelectedDerogation(null);
      setAccepterData({ dateExpiration: '', accordeePar: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'acceptation');
      console.error('Erreur acceptation:', err);
    }
  };

  const openRefusModal = (derogation) => {
    setSelectedDerogation(derogation);
    setMotifRefus('');
    setShowRefusModal(true);
  };

  const handleRefuser = async () => {
    if (!selectedDerogation) return;

    if (!motifRefus || motifRefus.trim() === '') {
      setError('La raison du refus est obligatoire');
      return;
    }

    try {
      await derogationService.refuser(selectedDerogation.id, motifRefus.trim());
      setSuccess('Dérogation refusée');
      setShowRefusModal(false);
      setSelectedDerogation(null);
      setMotifRefus('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du refus');
      console.error('Erreur refus:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette dérogation ?')) return;

    try {
      await derogationService.delete(id);
      setSuccess('Dérogation supprimée avec succès');
      loadData();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur suppression:', err);
    }
  };

  const handleVerifierExpirations = async () => {
    try {
      const expired = await derogationService.verifierExpirations();
      setSuccess(`${expired.length} dérogation(s) marquée(s) comme expirée(s)`);
      loadData();
    } catch (err) {
      setError('Erreur lors de la vérification');
      console.error('Erreur vérification:', err);
    }
  };

  const checkDerogationValide = async (eleveId) => {
    try {
      const hasValide = await derogationService.hasDerogationValide(eleveId);
      if (hasValide) {
        setSuccess('Cet élève a une dérogation valide ✓');
      } else {
        setError('Cet élève n\'a PAS de dérogation valide ✗');
      }
    } catch (err) {
      setError('Erreur lors de la vérification');
      console.error('Erreur vérification:', err);
    }
  };

  const openModal = () => {
    setFormData({
      eleveId: '',
      motif: '',
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      eleveId: '',
      motif: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  // Filtrage des dérogations
  const filteredDerogations = derogations.filter((derogation) => {
    if (filterEleve && derogation.eleveId !== parseInt(filterEleve)) return false;
    if (filterStatut && derogation.statut !== filterStatut) return false;
    return true;
  });

  // Statistiques
  const stats = {
    total: derogations.length,
    enAttente: derogations.filter((d) => d.statut === 'EN_ATTENTE').length,
    acceptees: derogations.filter((d) => d.statut === 'ACCEPTEE').length,
    refusees: derogations.filter((d) => d.statut === 'REFUSEE').length,
    expirees: derogations.filter((d) => d.statut === 'EXPIREE').length,
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion des Dérogations</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Demandes de dérogation de paiement</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
          <button
            onClick={handleVerifierExpirations}
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <XCircleIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Vérifier Expirations</span>
            <span className="sm:hidden">Expirations</span>
          </button>
          <button onClick={openModal} className="btn btn-primary flex items-center justify-center gap-2">
            <PlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Nouvelle Demande</span>
            <span className="sm:hidden">Nouvelle</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="text-xs sm:text-sm font-medium text-gray-500">Total</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-4 sm:p-6 text-white">
          <div className="text-xs sm:text-sm font-medium opacity-90">En attente</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.enAttente}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 sm:p-6 text-white">
          <div className="text-xs sm:text-sm font-medium opacity-90">Acceptées</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.acceptees}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-4 sm:p-6 text-white">
          <div className="text-xs sm:text-sm font-medium opacity-90">Refusées</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.refusees}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-md p-4 sm:p-6 text-white col-span-2 sm:col-span-1">
          <div className="text-xs sm:text-sm font-medium opacity-90">Expirées</div>
          <div className="text-2xl sm:text-3xl font-bold mt-2">{stats.expirees}</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut</label>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="input"
            >
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ACCEPTEE">Acceptée</option>
              <option value="REFUSEE">Refusée</option>
              <option value="EXPIREE">Expirée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des dérogations - Desktop */}
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
                Date Demande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Expiration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Raison Refus
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDerogations.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Aucune dérogation trouvée
                </td>
              </tr>
            ) : (
              filteredDerogations.map((derogation) => {
                // Récupérer les infos de l'élève si pas dans le DTO
                const eleve = eleves.find(e => e.id === derogation.eleveId);
                
                return (
                  <tr key={derogation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {derogation.eleveNom || (eleve ? `${eleve.prenom} ${eleve.nom}` : 'N/A')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {derogation.eleveClasse || eleve?.classeNom || 'N/A'}
                      </div>
                      <button
                        onClick={() => checkDerogationValide(derogation.eleveId)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                      >
                        Vérifier dérogation valide
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{derogation.motif || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {derogation.dateDemande ? new Date(derogation.dateDemande).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {derogation.dateExpiration ? new Date(derogation.dateExpiration).toLocaleDateString('fr-FR') : (derogation.statut === 'ACCEPTEE' ? 'En attente acceptation' : 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_DEROGATION_COLORS[derogation.statut] || 'bg-gray-100 text-gray-800'}`}>
                        {STATUT_DEROGATION_LABELS[derogation.statut] || derogation.statut || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{derogation.raisonRefus || '-'}</div>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {derogation.statut === 'EN_ATTENTE' && (
                      <>
                        <button
                          onClick={() => openAccepterModal(derogation)}
                          className="text-green-600 hover:text-green-900 mr-4"
                          title="Accepter"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openRefusModal(derogation)}
                          className="text-red-600 hover:text-red-900 mr-4"
                          title="Refuser"
                        >
                          <XCircleIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(derogation.id)}
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
        {filteredDerogations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            Aucune dérogation trouvée
          </div>
        ) : (
          filteredDerogations.map((derogation) => {
            const eleve = eleves.find(e => e.id === derogation.eleveId);
            
            return (
              <div key={derogation.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {derogation.eleveNom || (eleve ? `${eleve.prenom} ${eleve.nom}` : 'N/A')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {derogation.eleveClasse || eleve?.classeNom || 'N/A'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUT_DEROGATION_COLORS[derogation.statut] || 'bg-gray-100 text-gray-800'}`}>
                    {STATUT_DEROGATION_LABELS[derogation.statut] || derogation.statut}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700">{derogation.motif || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-600">Demandé:</span>
                    <div className="font-medium text-gray-900">
                      {derogation.dateDemande ? new Date(derogation.dateDemande).toLocaleDateString('fr-FR') : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Expiration:</span>
                    <div className="font-medium text-gray-900">
                      {derogation.dateExpiration ? new Date(derogation.dateExpiration).toLocaleDateString('fr-FR') : 'N/A'}
                    </div>
                  </div>
                </div>
                
                {derogation.raisonRefus && (
                  <div className="mb-3 p-2 bg-red-50 rounded">
                    <p className="text-xs text-red-800">
                      <strong>Raison refus:</strong> {derogation.raisonRefus}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {derogation.statut === 'EN_ATTENTE' && (
                    <>
                      <button
                        onClick={() => openAccepterModal(derogation)}
                        className="flex-1 btn btn-secondary text-green-600 hover:bg-green-50 flex items-center justify-center gap-1"
                        title="Accepter"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Accepter
                      </button>
                      <button
                        onClick={() => openRefusModal(derogation)}
                        className="flex-1 btn btn-secondary text-red-600 hover:bg-red-50 flex items-center justify-center gap-1"
                        title="Refuser"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Refuser
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(derogation.id)}
                    className="btn btn-secondary px-3 text-red-600"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Création */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Nouvelle demande de dérogation</h3>
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
                  Motif de la dérogation *
                </label>
                <textarea
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Expliquez la raison de la demande..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début *
                </label>
                <input
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin *
                </label>
                <input
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Créer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Refus */}
      {/* Modal d'acceptation */}
      {showAccepterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Accepter la dérogation</h3>
              <button onClick={() => setShowAccepterModal(false)} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'expiration *
                </label>
                <input
                  type="datetime-local"
                  value={accepterData.dateExpiration}
                  onChange={(e) => setAccepterData({ ...accepterData, dateExpiration: e.target.value })}
                  className="input"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Date jusqu'à laquelle la dérogation est valide
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accordée par *
                </label>
                <input
                  type="text"
                  value={accepterData.accordeePar}
                  onChange={(e) => setAccepterData({ ...accepterData, accordeePar: e.target.value })}
                  className="input"
                  placeholder="Nom de la personne qui accorde"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAccepterModal(false)}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
                <button onClick={handleAccepter} className="btn bg-green-600 hover:bg-green-700 text-white">
                  Confirmer l'acceptation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de refus */}
      {showRefusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Refuser la dérogation</h3>
              <button onClick={() => setShowRefusModal(false)} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raison du refus *
                </label>
                <textarea
                  value={motifRefus}
                  onChange={(e) => setMotifRefus(e.target.value)}
                  className="input"
                  rows="3"
                  placeholder="Expliquez pourquoi la dérogation est refusée..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRefusModal(false)}
                  className="btn btn-secondary"
                >
                  Annuler
                </button>
                <button onClick={handleRefuser} className="btn bg-red-600 hover:bg-red-700 text-white">
                  Confirmer le refus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
