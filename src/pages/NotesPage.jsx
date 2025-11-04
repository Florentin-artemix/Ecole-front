import React, { useState, useEffect, useMemo } from 'react';
import { noteService } from '../services/noteService';
import { eleveService } from '../services/eleveService';
import { coursService } from '../services/coursService';
import { classeService } from '../services/classeService';
import { PERIODE_OPTIONS, TYPE_CONDUITE_OPTIONS } from '../utils/enums';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import DataImporter from '../components/common/DataImporter';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [cours, setCours] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedClasseFilter, setSelectedClasseFilter] = useState('');
  const [selectedEleveFilter, setSelectedEleveFilter] = useState('');
  const [formData, setFormData] = useState({
    eleveId: '',
    coursId: '',
    valeur: '',
    periode: '',
    typeConduite: '',
    commentaireConduite: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  // Calculer les notes filtrées avec useMemo pour éviter les re-renders infinis
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filtrer par classe d'abord
    if (selectedClasseFilter !== '') {
      const elevesDeClasse = eleves.filter(e => e.classeId === parseInt(selectedClasseFilter));
      const eleveIds = elevesDeClasse.map(e => e.id);
      filtered = filtered.filter(note => eleveIds.includes(note.eleveId));
    }

    // Puis filtrer par élève si sélectionné
    if (selectedEleveFilter !== '') {
      filtered = filtered.filter(note => note.eleveId === parseInt(selectedEleveFilter));
    }

    return filtered;
  }, [selectedClasseFilter, selectedEleveFilter, notes, eleves]);

  const loadData = async () => {
    try {
      const [notesRes, elevesRes, coursRes, classesRes] = await Promise.all([
        noteService.getAllNotes(),
        eleveService.getAllEleves(),
        coursService.getAllCours(),
        classeService.getAllClasses(),
      ]);
      setNotes(notesRes.data || []);
      setEleves(elevesRes.data || []);
      setCours(coursRes.data || []);
      setClasses(classesRes.data || []);
      console.log('Données chargées:', {
        notes: notesRes.data?.length || 0,
        eleves: elevesRes.data?.length || 0,
        cours: coursRes.data?.length || 0,
        classes: classesRes.data?.length || 0
      });
    } catch (err) {
      console.error('Erreur chargement:', err);
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
        coursId: parseInt(formData.coursId),
        valeur: parseFloat(formData.valeur),
      };

      // Enlever les champs de conduite s'ils sont vides (optionnels)
      if (!data.typeConduite) {
        delete data.typeConduite;
        delete data.commentaireConduite;
      }

      if (editingNote) {
        await noteService.updateNote(editingNote.id, data);
        setSuccess('Note modifiée avec succès' + (data.typeConduite ? ' (avec conduite)' : ''));
      } else {
        await noteService.createNote(data);
        setSuccess('Note créée avec succès' + (data.typeConduite ? ' (avec conduite)' : ''));
      }
      loadData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;

    try {
      await noteService.deleteNote(id);
      setSuccess('Note supprimée avec succès');
      loadData();
    } catch {
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
          const noteData = {
            ...item,
            eleveId: parseInt(item.eleveId),
            coursId: parseInt(item.coursId),
            valeur: parseFloat(item.valeur),
          };
          await noteService.createNote(noteData);
          successCount++;
        } catch (err) {
          errorCount++;
          console.error('Erreur import note:', err);
        }
      }

      if (successCount > 0) {
        setSuccess(`${successCount} note(s) importée(s) avec succès${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`);
        loadData();
      } else {
        setError('Aucune note n\'a pu être importée');
      }
    } catch (err) {
      setError('Erreur lors de l\'importation');
      console.error('Erreur import:', err);
    }
  };

  const openModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        eleveId: note.eleveId?.toString() || '',
        coursId: note.coursId?.toString() || '',
        valeur: note.valeur?.toString() || '',
        periode: note.periode || '',
        typeConduite: '',
        commentaireConduite: '',
      });
    } else {
      setEditingNote(null);
      setFormData({ 
        eleveId: '', 
        coursId: '', 
        valeur: '', 
        periode: '',
        typeConduite: '',
        commentaireConduite: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({ 
      eleveId: '', 
      coursId: '', 
      valeur: '', 
      periode: '',
      typeConduite: '',
      commentaireConduite: '',
    });
  };

  const resetFilter = () => {
    setSelectedClasseFilter('');
    setSelectedEleveFilter('');
  };

  // Obtenir les élèves filtrés par classe
  const getFilteredEleves = () => {
    if (selectedClasseFilter === '') {
      return eleves;
    }
    return eleves.filter(e => e.classeId === parseInt(selectedClasseFilter));
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Notes</h1>
          <p className="text-gray-600 mt-2">Liste de toutes les notes enregistrées</p>
        </div>
        <div className="flex gap-3">
          <DataImporter onImport={handleImportJSON} type="notes" />
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Ajouter une Note
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Filtres en cascade : Classe → Élève */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Filtres de recherche
          <span className="text-xs text-gray-500 ml-2">({classes.length} classe{classes.length > 1 ? 's' : ''} disponible{classes.length > 1 ? 's' : ''})</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Filtre par classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1️⃣ Filtrer par classe
            </label>
            <select
              value={selectedClasseFilter}
              onChange={(e) => {
                setSelectedClasseFilter(e.target.value);
                setSelectedEleveFilter(''); // Réinitialiser le filtre élève quand on change de classe
              }}
              className="input w-full"
            >
              <option value="">-- Toutes les classes ({classes.length}) --</option>
              {classes.length === 0 ? (
                <option disabled>Aucune classe disponible</option>
              ) : (
                classes
                  .sort((a, b) => (a.nom || '').localeCompare(b.nom || ''))
                  .map((classe) => {
                    const elevesCount = eleves.filter(e => e.classeId === classe.id).length;
                    const notesCount = notes.filter(n => {
                      const eleve = eleves.find(e => e.id === n.eleveId);
                      return eleve?.classeId === classe.id;
                    }).length;
                    return (
                      <option key={classe.id} value={classe.id}>
                        {classe.nom} ({elevesCount} élève{elevesCount > 1 ? 's' : ''}, {notesCount} note{notesCount > 1 ? 's' : ''})
                      </option>
                    );
                  })
              )}
            </select>
          </div>

          {/* Filtre par élève (filtré par classe si sélectionnée) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2️⃣ Filtrer par élève {selectedClasseFilter && <span className="text-blue-600">(de la classe sélectionnée)</span>}
            </label>
            <select
              value={selectedEleveFilter}
              onChange={(e) => setSelectedEleveFilter(e.target.value)}
              className="input w-full"
              disabled={!selectedClasseFilter && eleves.length > 20} // Désactiver si trop d'élèves sans filtre classe
            >
              <option value="">
                {selectedClasseFilter 
                  ? "-- Tous les élèves de cette classe --" 
                  : "-- Tous les élèves --"}
              </option>
              {getFilteredEleves()
                .sort((a, b) => {
                  const nomA = a.nomComplet || `${a.nom} ${a.postnom} ${a.prenom}`;
                  const nomB = b.nomComplet || `${b.nom} ${b.postnom} ${b.prenom}`;
                  return nomA.localeCompare(nomB);
                })
                .map((eleve) => {
                  const nom = eleve.nomComplet || 
                    (eleve.nom && eleve.postnom && eleve.prenom 
                      ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                      : `Élève #${eleve.id}`);
                  const notesCount = notes.filter(n => n.eleveId === eleve.id).length;
                  return (
                    <option key={eleve.id} value={eleve.id}>
                      {nom} ({notesCount} note{notesCount > 1 ? 's' : ''})
                    </option>
                  );
                })}
            </select>
            {!selectedClasseFilter && eleves.length > 20 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Veuillez d'abord sélectionner une classe pour activer ce filtre
              </p>
            )}
          </div>
        </div>

        {/* Barre d'état et bouton réinitialiser */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-sm">
              <span className="font-bold text-blue-700 text-lg">{filteredNotes.length}</span>
              <span className="text-gray-600 ml-2">
                note{filteredNotes.length > 1 ? 's' : ''} affichée{filteredNotes.length > 1 ? 's' : ''}
              </span>
              {(selectedClasseFilter || selectedEleveFilter) && (
                <span className="text-gray-500 ml-1">
                  (sur {notes.length} au total)
                </span>
              )}
            </p>
          </div>
          
          {(selectedClasseFilter || selectedEleveFilter) && (
            <button onClick={resetFilter} className="btn btn-secondary whitespace-nowrap">
              <XMarkIcon className="w-4 h-4 inline mr-1" />
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Élève</th>
                <th className="px-6 py-4 text-left font-semibold">Cours</th>
                <th className="px-6 py-4 text-center font-semibold">Note</th>
                <th className="px-6 py-4 text-center font-semibold">Pondération</th>
                <th className="px-6 py-4 text-center font-semibold">Période</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {selectedEleveFilter 
                      ? 'Aucune note trouvée pour cet élève' 
                      : 'Aucune note enregistrée'}
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note, index) => {
                  const eleve = eleves.find((e) => e.id === note.eleveId);
                  const coursItem = cours.find((c) => c.id === note.coursId);
                  const noteColor = note.valeur >= 10 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
                  const eleveNom = note.eleveNom || 
                    eleve?.nomComplet || 
                    (eleve?.nom && eleve?.postnom && eleve?.prenom 
                      ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                      : 'N/A');

                  return (
                    <tr key={note.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {eleveNom}
                      </td>
                      <td className="px-6 py-4">{note.coursNom || coursItem?.nomCours || 'N/A'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold ${noteColor}`}>
                          {note.valeur}/20
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {note.ponderation || coursItem?.ponderation || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {note.periode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(note)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-lg w-full my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingNote ? 'Modifier la Note' : 'Ajouter une Note'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form id="note-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6">
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
                  <label className="label">Cours *</label>
                  <select
                    required
                    value={formData.coursId}
                    onChange={(e) => setFormData({ ...formData, coursId: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner un cours</option>
                    {cours.map((coursItem) => (
                      <option key={coursItem.id} value={coursItem.id}>
                        {coursItem.nomCours}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Note (sur 20) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="20"
                    step="0.1"
                    value={formData.valeur}
                    onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                    className="input"
                    placeholder="Ex: 15.5"
                  />
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

                {/* Section optionnelle pour la conduite */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-blue-500 rounded"></div>
                    <h3 className="font-semibold text-gray-700">
                      Évaluation de la conduite (optionnel)
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Vous pouvez évaluer le comportement de l'élève en même temps que sa note académique
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Type de conduite</label>
                      <select
                        value={formData.typeConduite}
                        onChange={(e) => setFormData({ ...formData, typeConduite: e.target.value })}
                        className="input"
                      >
                        <option value="">-- Pas d'évaluation de conduite --</option>
                        {TYPE_CONDUITE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.typeConduite && (
                      <div>
                        <label className="label">Commentaire (optionnel)</label>
                        <textarea
                          rows="3"
                          value={formData.commentaireConduite}
                          onChange={(e) => setFormData({ ...formData, commentaireConduite: e.target.value })}
                          className="input resize-none"
                          placeholder="Ex: Élève attentif et participatif en classe..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </div>
            </form>

            <div className="flex gap-4 justify-end p-6 border-t bg-gray-50 flex-shrink-0">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" form="note-form" className="btn btn-primary">
                {editingNote ? 'Modifier' : 'Créer'}
                {formData.typeConduite && ' (avec conduite)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
