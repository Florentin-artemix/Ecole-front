import React, { useState, useEffect } from 'react';
import { conduiteService } from '../services/conduiteService';
import { eleveService } from '../services/eleveService';
import { utilisateurService } from '../services/utilisateurService';
import { PERIODE_OPTIONS, TYPE_CONDUITE_OPTIONS, TYPE_CONDUITE_LABELS } from '../utils/enums';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import DataImporter from '../components/common/DataImporter';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function ConduitesPage() {
  const [conduites, setConduites] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCalculModal, setShowCalculModal] = useState(false);
  const [editingConduite, setEditingConduite] = useState(null);
  const [conduiteCalcul, setConduiteCalcul] = useState(null);
  const [selectedEleve, setSelectedEleve] = useState('');
  const [selectedPeriode, setSelectedPeriode] = useState('');
  
  const [formData, setFormData] = useState({
    eleveId: '',
    professeurId: '',
    typeConduite: '',
    periode: '',
    commentaire: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [conduitesRes, elevesRes, profsRes] = await Promise.all([
        conduiteService.getAllConduites(),
        eleveService.getAllEleves(),
        utilisateurService.getAllUtilisateurs(),
      ]);
      setConduites(conduitesRes.data || []);
      setEleves(elevesRes.data || []);
      setProfesseurs((profsRes.data || []).filter(u => u.role === 'PROFESSEUR'));
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
        eleveId: parseInt(formData.eleveId),
        professeurId: parseInt(formData.professeurId),
      };

      if (editingConduite) {
        await conduiteService.updateConduite(editingConduite.id, data);
        setSuccess('Conduite modifiée avec succès');
      } else {
        await conduiteService.createConduite(data);
        setSuccess('Conduite créée avec succès');
      }
      loadData();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette conduite ?')) return;

    try {
      await conduiteService.deleteConduite(id);
      setSuccess('Conduite supprimée avec succès');
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
          await conduiteService.createConduite(item);
          successCount++;
        } catch (err) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSuccess(`${successCount} conduite(s) importée(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
        loadData();
      } else {
        setError('Aucune conduite n\'a pu être importée');
      }
    } catch (error) {
      setError('Erreur lors de l\'importation');
    }
  };

  const openModal = (conduite = null) => {
    if (conduite) {
      setEditingConduite(conduite);
      setFormData({
        eleveId: conduite.eleveId?.toString() || '',
        professeurId: conduite.professeurId?.toString() || '',
        typeConduite: conduite.typeConduite || '',
        periode: conduite.periode || '',
        commentaire: conduite.commentaire || '',
      });
    } else {
      setEditingConduite(null);
      setFormData({ 
        eleveId: '', 
        professeurId: '', 
        typeConduite: '', 
        periode: '', 
        commentaire: '' 
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingConduite(null);
    setFormData({ 
      eleveId: '', 
      professeurId: '', 
      typeConduite: '', 
      periode: '', 
      commentaire: '' 
    });
  };

  const viewCalcul = async (eleveId, periode) => {
    try {
      setLoading(true);
      const response = await conduiteService.getConduiteCalcul(eleveId, periode);
      setConduiteCalcul(response.data);
      setShowCalculModal(true);
    } catch (error) {
      setError('Erreur lors du calcul de la conduite');
    } finally {
      setLoading(false);
    }
  };

  const getConduiteColor = (type) => {
    const colors = {
      'EXCELLENT': 'bg-green-100 text-green-800',
      'TRES_BON': 'bg-blue-100 text-blue-800',
      'BON': 'bg-yellow-100 text-yellow-800',
      'ASSEZ_BON': 'bg-lime-100 text-lime-800',
      'PASSABLE': 'bg-orange-100 text-orange-800',
      'MEDIOCRE': 'bg-red-100 text-red-800',
      'MAUVAIS': 'bg-red-200 text-red-900',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPourcentageColor = (pourcentage) => {
    if (pourcentage >= 80) return 'text-green-600';
    if (pourcentage >= 65) return 'text-blue-600';
    if (pourcentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  // Filtrer les conduites
  const filteredConduites = conduites.filter(conduite => {
    if (selectedEleve && conduite.eleveId !== parseInt(selectedEleve)) return false;
    if (selectedPeriode && conduite.periode !== selectedPeriode) return false;
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Conduites</h1>
          <p className="text-gray-600 mt-2">
            Système de notation par pourcentage - {conduites.length} évaluation(s)
          </p>
        </div>
        <div className="flex gap-3">
          <DataImporter onImport={handleImportJSON} type="conduites" />
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Ajouter une Conduite
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Filtrer par élève</label>
            <select
              value={selectedEleve}
              onChange={(e) => setSelectedEleve(e.target.value)}
              className="input"
            >
              <option value="">Tous les élèves</option>
              {eleves.map((eleve) => {
                const nom = eleve.nomComplet || 
                  (eleve.nom && eleve.postnom && eleve.prenom 
                    ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                    : `Élève #${eleve.id}`);
                return (
                  <option key={eleve.id} value={eleve.id}>
                    {nom}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Filtrer par période</label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="input"
            >
              <option value="">Toutes les périodes</option>
              {PERIODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            {(selectedEleve || selectedPeriode) && (
              <button
                onClick={() => {
                  setSelectedEleve('');
                  setSelectedPeriode('');
                }}
                className="btn btn-secondary w-full"
              >
                Réinitialiser
              </button>
            )}
            {selectedEleve && selectedPeriode && (
              <button
                onClick={() => viewCalcul(parseInt(selectedEleve), selectedPeriode)}
                className="btn btn-primary w-full flex items-center justify-center gap-2 ml-2"
              >
                <ChartBarIcon className="w-5 h-5" />
                Voir le Calcul
              </button>
            )}
          </div>
        </div>

        {filteredConduites.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-700">{filteredConduites.length}</span> évaluation(s) affichée(s)
              {selectedEleve && selectedPeriode && ' - Cliquez sur "Voir le Calcul" pour la moyenne et la mention'}
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Élève</th>
                <th className="px-6 py-4 text-left font-semibold">Professeur</th>
                <th className="px-6 py-4 text-center font-semibold">Type</th>
                <th className="px-6 py-4 text-center font-semibold">Période</th>
                <th className="px-6 py-4 text-left font-semibold">Commentaire</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConduites.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Aucune conduite enregistrée
                  </td>
                </tr>
              ) : (
                filteredConduites.map((conduite, index) => {
                  const eleve = eleves.find((e) => e.id === conduite.eleveId);
                  const professeur = professeurs.find((p) => p.id === conduite.professeurId);
                  const eleveNom = conduite.eleveNom || 
                    (eleve?.nomComplet || 
                    (eleve?.nom && eleve?.postnom && eleve?.prenom 
                      ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                      : 'N/A'));
                  const profNom = conduite.professeurNom || professeur?.nomComplet || 'N/A';

                  return (
                    <tr key={conduite.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{eleveNom}</td>
                      <td className="px-6 py-4">{profNom}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConduiteColor(conduite.typeConduite)}`}>
                          {TYPE_CONDUITE_LABELS[conduite.typeConduite]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {conduite.periode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {conduite.commentaire || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(conduite)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(conduite.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulaire */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingConduite ? 'Modifier la Conduite' : 'Ajouter une Conduite'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form id="conduite-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Élève *</label>
                  <select
                    required
                    value={formData.eleveId}
                    onChange={(e) => setFormData({ ...formData, eleveId: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner un élève</option>
                    {eleves.map((eleve) => {
                      const nom = eleve.nomComplet || 
                        (eleve.nom && eleve.postnom && eleve.prenom 
                          ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                          : `Élève #${eleve.id}`);
                      return (
                        <option key={eleve.id} value={eleve.id}>
                          {nom} {eleve.classeNom ? `- ${eleve.classeNom}` : ''}
                        </option>
                      );
                    })}
                  </select>
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

                <div>
                  <label className="label">Type de Conduite *</label>
                  <select
                    required
                    value={formData.typeConduite}
                    onChange={(e) => setFormData({ ...formData, typeConduite: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner un type</option>
                    {TYPE_CONDUITE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Période *</label>
                  <select
                    required
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner une période</option>
                    {PERIODE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Commentaire</label>
                  <textarea
                    rows="3"
                    value={formData.commentaire}
                    onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                    className="input resize-none"
                    placeholder="Ex: Élève attentif et respectueux..."
                  />
                </div>
              </div>
            </form>

            <div className="flex gap-4 justify-end p-6 border-t bg-gray-50 flex-shrink-0">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" form="conduite-form" className="btn btn-primary">
                {editingConduite ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Calcul */}
      {showCalculModal && conduiteCalcul && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Calcul de la Conduite
              </h2>
              <button onClick={() => setShowCalculModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-800">{conduiteCalcul.eleveNom}</h3>
                </div>
                <p className="text-gray-600">Période: {conduiteCalcul.periode}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Nombre d'évaluations</p>
                  <p className="text-3xl font-bold text-blue-700">{conduiteCalcul.nombreEvaluations}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Pourcentage moyen</p>
                  <p className={`text-3xl font-bold ${getPourcentageColor(conduiteCalcul.pourcentageMoyen)}`}>
                    {conduiteCalcul.pourcentageMoyen.toFixed(2)}%
                  </p>
                </div>
              </div>

              {conduiteCalcul.mentionFinale && (
                <div className={`rounded-lg p-6 mb-4 ${getConduiteColor(conduiteCalcul.mentionFinale)} border-2`}>
                  <div className="text-center">
                    <p className="text-sm font-semibold mb-2">Mention Finale</p>
                    <p className="text-3xl font-bold mb-3">
                      {TYPE_CONDUITE_LABELS[conduiteCalcul.mentionFinale]}
                    </p>
                    <p className="text-sm">
                      {conduiteCalcul.appreciation}
                    </p>
                  </div>
                </div>
              )}

              {conduiteCalcul.pourcentageMoyen < 50 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-red-800 font-semibold">
                    ⚠️ Attention: La conduite est en dessous du seuil acceptable (50%)
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" />
                  Barème de notation
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>≥ 95%</span>
                    <span className="font-semibold">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>80-94%</span>
                    <span className="font-semibold">Très Bon</span>
                  </div>
                  <div className="flex justify-between">
                    <span>65-79%</span>
                    <span className="font-semibold">Bon</span>
                  </div>
                  <div className="flex justify-between">
                    <span>55-64%</span>
                    <span className="font-semibold">Assez Bon</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50-54%</span>
                    <span className="font-semibold">Passable</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-49%</span>
                    <span className="font-semibold">Médiocre</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span>&lt; 30%</span>
                    <span className="font-semibold">Mauvais</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button onClick={() => setShowCalculModal(false)} className="btn btn-primary">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
