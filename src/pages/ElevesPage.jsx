import React, { useState, useEffect } from 'react';
import { eleveService } from '../services/eleveService';
import { ecoleService } from '../services/ecoleService';
import { classeService } from '../services/classeService';
import { SEXE_OPTIONS } from '../utils/enums';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import DataImporter from '../components/common/DataImporter';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ElevesPage() {
  const [eleves, setEleves] = useState([]);
  const [filteredEleves, setFilteredEleves] = useState([]);
  const [ecoles, setEcoles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEleve, setEditingEleve] = useState(null);
  const [formData, setFormData] = useState({
    nomComplet: '',
    nom: '',
    postnom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    lieuNaissance: '',
    numeroPermanent: '',
    classeId: '',
    ecoleId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [elevesRes, ecolesRes, classesRes] = await Promise.all([
        eleveService.getAllEleves(),
        ecoleService.getAllEcoles().catch(() => ({ data: [] })),
        classeService.getAllClasses().catch(() => ({ data: [] }))
      ]);
      const elevesData = elevesRes.data || [];
      setEleves(elevesData);
      setFilteredEleves(elevesData);
      setEcoles(ecolesRes.data || []);
      setClasses(classesRes.data || []);
    } catch {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadEleves = async () => {
    try {
      const response = await eleveService.getAllEleves();
      const elevesData = response.data || [];
      setEleves(elevesData);
      setFilteredEleves(elevesData);
    } catch {
      setError('Erreur lors du chargement des élèves');
    }
  };

  // Filtrer les élèves par classe
  useEffect(() => {
    if (selectedClasse === '') {
      setFilteredEleves(eleves);
    } else {
      setFilteredEleves(eleves.filter(eleve => eleve.classeNom === selectedClasse));
    }
  }, [selectedClasse, eleves]);

  // Obtenir la liste unique des classes depuis les élèves
  const uniqueClasseNames = [...new Set(eleves.map(eleve => eleve.classeNom))].filter(Boolean).sort();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Construire nomComplet si nom/postnom/prenom fournis
      let dataToSend = { ...formData };
      if (formData.nom && formData.postnom && formData.prenom) {
        dataToSend.nomComplet = `${formData.nom} ${formData.postnom} ${formData.prenom}`;
      }

      // Convertir classeId et ecoleId en entiers
      if (dataToSend.classeId) {
        dataToSend.classeId = parseInt(dataToSend.classeId);
      }
      if (dataToSend.ecoleId) {
        dataToSend.ecoleId = parseInt(dataToSend.ecoleId);
      }

      if (editingEleve) {
        await eleveService.updateEleve(editingEleve.id, dataToSend);
        setSuccess('Élève modifié avec succès');
      } else {
        await eleveService.createEleve(dataToSend);
        setSuccess('Élève créé avec succès');
      }
      loadEleves();
      closeModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleImportJSON = async (data) => {
    try {
      const dataArray = Array.isArray(data) ? data : [data];
      let successCount = 0;
      let errorCount = 0;

      for (const item of dataArray) {
        try {
          // Construire nomComplet si besoin
          if (item.nom && item.postnom && item.prenom && !item.nomComplet) {
            item.nomComplet = `${item.nom} ${item.postnom} ${item.prenom}`;
          }
          await eleveService.createEleve(item);
          successCount++;
        } catch {
          errorCount++;
        }
      }

      if (successCount > 0) {
        setSuccess(`${successCount} élève(s) importé(s) avec succès${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
        loadEleves();
      } else {
        setError('Aucun élève n\'a pu être importé');
      }
    } catch {
      setError('Erreur lors de l\'importation');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) return;

    try {
      await eleveService.deleteEleve(id);
      setSuccess('Élève supprimé avec succès');
      loadEleves();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  const openModal = (eleve = null) => {
    if (eleve) {
      setEditingEleve(eleve);
      // Si l'élève a un objet ecole, extraire l'ID
      const ecoleId = typeof eleve.ecole === 'object' ? eleve.ecole?.id : eleve.ecoleId;
      setFormData({
        ...eleve,
        classeId: eleve.classeId || '',
        ecoleId: ecoleId || '',
      });
    } else {
      setEditingEleve(null);
      setFormData({
        nomComplet: '',
        nom: '',
        postnom: '',
        prenom: '',
        sexe: '',
        dateNaissance: '',
        lieuNaissance: '',
        numeroPermanent: '',
        classeId: classes.length > 0 ? classes[0].id : '',
        ecoleId: ecoles.length > 0 ? ecoles[0].id : '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEleve(null);
    setFormData({
      nomComplet: '',
      nom: '',
      postnom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      lieuNaissance: '',
      numeroPermanent: '',
      classeId: '',
      ecoleId: '',
    });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Élèves</h1>
          <p className="text-gray-600 mt-2">
            {selectedClasse 
              ? `Classe: ${selectedClasse} - ${filteredEleves.length} élève(s)` 
              : `${eleves.length} élève(s) inscrit(s)`}
          </p>
        </div>
        <div className="flex gap-3">
          <DataImporter onImport={handleImportJSON} type="eleves" />
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Ajouter un Élève
          </button>
        </div>
      </div>

      {/* Filtre par classe */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-700">Filtrer par classe:</label>
          <select
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
            className="input w-64"
          >
            <option value="">Toutes les classes</option>
            {uniqueClasseNames.map((classeName) => (
              <option key={classeName} value={classeName}>
                {classeName}
              </option>
            ))}
          </select>
          {selectedClasse && (
            <button
              onClick={() => setSelectedClasse('')}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nom Complet</th>
                <th className="px-6 py-4 text-left font-semibold">Sexe</th>
                <th className="px-6 py-4 text-left font-semibold">Date de Naissance</th>
                <th className="px-6 py-4 text-left font-semibold">Lieu de Naissance</th>
                <th className="px-6 py-4 text-left font-semibold">N° Permanent</th>
                <th className="px-6 py-4 text-left font-semibold">Classe</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEleves.map((eleve, index) => {
                const nomComplet = eleve.nomComplet || 
                  (eleve.nom && eleve.postnom && eleve.prenom 
                    ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                    : `Élève #${eleve.id}`);
                return (
                  <tr key={eleve.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-gray-900">{nomComplet}</td>
                    <td className="px-6 py-4">{eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}</td>
                    <td className="px-6 py-4">{eleve.dateNaissance}</td>
                    <td className="px-6 py-4">{eleve.lieuNaissance}</td>
                    <td className="px-6 py-4">{eleve.numeroPermanent}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {eleve.classeNom}
                      </span>
                    </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openModal(eleve)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(eleve.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEleve ? 'Modifier l\'Élève' : 'Ajouter un Élève'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form id="eleve-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="input"
                    placeholder="Ex: KABONGO"
                  />
                </div>

                <div>
                  <label className="label">Post-Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.postnom}
                    onChange={(e) => setFormData({ ...formData, postnom: e.target.value })}
                    className="input"
                    placeholder="Ex: Florent"
                  />
                </div>

                <div>
                  <label className="label">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="input"
                    placeholder="Ex: Jean"
                  />
                </div>

                <div>
                  <label className="label">Sexe *</label>
                  <select
                    required
                    value={formData.sexe}
                    onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner</option>
                    {SEXE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Date de Naissance *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateNaissance}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Lieu de Naissance *</label>
                  <input
                    type="text"
                    required
                    value={formData.lieuNaissance}
                    onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                    className="input"
                    placeholder="Ex: Bukavu"
                  />
                </div>

                <div>
                  <label className="label">N° Permanent *</label>
                  <input
                    type="text"
                    required
                    value={formData.numeroPermanent}
                    onChange={(e) => setFormData({ ...formData, numeroPermanent: e.target.value })}
                    className="input"
                    placeholder="Ex: 12345"
                  />
                </div>

                <div>
                  <label className="label">Classe *</label>
                  {classes.length > 0 ? (
                    <select
                      required
                      value={formData.classeId}
                      onChange={(e) => setFormData({ ...formData, classeId: e.target.value })}
                      className="input"
                    >
                      <option value="">-- Sélectionner une classe --</option>
                      {classes.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                          {classe.nom} - {classe.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune classe disponible</p>
                  )}
                </div>

                <div>
                  <label className="label">École *</label>
                  {ecoles.length > 0 ? (
                    <select
                      required
                      value={formData.ecoleId}
                      onChange={(e) => setFormData({ ...formData, ecoleId: e.target.value })}
                      className="input"
                    >
                      <option value="">-- Sélectionner une école --</option>
                      {ecoles.map((ecole) => (
                        <option key={ecole.id} value={ecole.id}>
                          {ecole.nomEcole} - {ecole.ville}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-gray-600 p-2 bg-yellow-50 rounded">
                      Aucune école disponible. Veuillez d'abord créer une école dans la page <a href="/ecole" className="text-blue-600 underline">Configuration École</a>.
                    </div>
                  )}
                </div>
              </div>
            </form>

            <div className="flex gap-4 justify-end p-6 border-t bg-gray-50 flex-shrink-0">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" form="eleve-form" className="btn btn-primary">
                {editingEleve ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
