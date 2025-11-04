import React, { useState, useEffect } from 'react';
import { parentEleveService } from '../services/parentEleveService';
import { utilisateurService } from '../services/utilisateurService';
import { eleveService } from '../services/eleveService';
import { ROLE_ENUM } from '../utils/enums';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import DataImporter from '../components/common/DataImporter';
import { PlusIcon, TrashIcon, XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const LIENS_PARENTE = [
  'Père',
  'Mère',
  'Tuteur',
  'Tutrice',
  'Oncle',
  'Tante',
  'Grand-père',
  'Grand-mère',
  'Frère aîné',
  'Sœur aînée',
];

export default function ParentElevePage() {
  const [relations, setRelations] = useState([]);
  const [parents, setParents] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    parentId: '',
    eleveId: '',
    lienParente: '',
  });
  const [selectedParentView, setSelectedParentView] = useState('');
  const [parentDetails, setParentDetails] = useState(null);
  const [selectedEleveView, setSelectedEleveView] = useState('');
  const [eleveParents, setEleveParents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [relationsRes, utilisateursRes, elevesRes] = await Promise.all([
        parentEleveService.getAllRelations(),
        utilisateurService.getAllUtilisateurs(),
        eleveService.getAllEleves(),
      ]);

      setRelations(relationsRes.data || []);
      // Filtrer uniquement les utilisateurs avec rôle PARENT
      const parentsOnly = (utilisateursRes.data || []).filter(u => u.role === 'PARENT');
      setParents(parentsOnly);
      setEleves(elevesRes.data || []);
    } catch {
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
        parentId: parseInt(formData.parentId),
        eleveId: parseInt(formData.eleveId),
      };

      await parentEleveService.createRelation(data);
      setSuccess('Relation parent-élève créée avec succès');
      loadData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette relation ?')) return;

    try {
      await parentEleveService.deleteRelation(id);
      setSuccess('Relation supprimée avec succès');
      loadData();
    } catch {
      setError('Erreur lors de la suppression');
    }
  };

  const handleImportJSON = async (data) => {
    try {
      const dataArray = Array.isArray(data) ? data : [data];
      await parentEleveService.createRelationsBatch(dataArray);
      setSuccess(`${dataArray.length} relation(s) importée(s) avec succès`);
      loadData();
    } catch {
      setError('Erreur lors de l\'importation');
    }
  };

  const handleViewParentDetails = async (parentId) => {
    try {
      setSelectedParentView(parentId);
      const response = await parentEleveService.getParentWithEnfants(parentId);
      setParentDetails(response.data);
    } catch {
      setError('Erreur lors du chargement des détails du parent');
    }
  };

  const handleViewEleveParents = async (eleveId) => {
    try {
      setSelectedEleveView(eleveId);
      const response = await parentEleveService.getParentsByEleve(eleveId);
      setEleveParents(response.data || []);
    } catch {
      setError('Erreur lors du chargement des parents de l\'élève');
      setEleveParents([]);
    }
  };

  const openModal = () => {
    setFormData({ parentId: '', eleveId: '', lienParente: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ parentId: '', eleveId: '', lienParente: '' });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion Parent-Élève</h1>
          <p className="text-gray-600 mt-2">Gérer les relations entre parents et élèves</p>
        </div>
        <div className="flex gap-3">
          <DataImporter onImport={handleImportJSON} type="parent-eleve" />
          <button onClick={openModal} className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Ajouter une Relation
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Vue par parent */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <UserGroupIcon className="w-6 h-6 text-blue-600 mr-2" />
          Voir les enfants d'un parent
        </h2>
        <div className="flex gap-4">
          <select
            value={selectedParentView}
            onChange={(e) => handleViewParentDetails(e.target.value)}
            className="input flex-1"
          >
            <option value="">-- Sélectionner un parent --</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.nomComplet} - {parent.telephone}
              </option>
            ))}
          </select>
        </div>

        {parentDetails && (
          <div className="mt-6 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Parent: {parentDetails.nomComplet}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Email: {parentDetails.email} | Tél: {parentDetails.telephone}
            </p>
            
            {parentDetails.enfants && parentDetails.enfants.length > 0 ? (
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">
                  {parentDetails.enfants.length} enfant(s) :
                </p>
                {parentDetails.enfants.map((enfant, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Nom</p>
                        <p className="font-semibold">{enfant.nomComplet}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Lien</p>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                          {enfant.lienParente}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Classe</p>
                        <p className="font-semibold">{enfant.classe}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">École</p>
                        <p className="font-semibold text-sm">{typeof enfant.ecole === 'object' ? enfant.ecole?.nomEcole : enfant.ecole}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Ce parent n'a pas encore d'enfants liés.</p>
            )}
          </div>
        )}
      </div>

      {/* Vue par élève - Voir les parents d'un enfant */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <UserGroupIcon className="w-6 h-6 text-green-600 mr-2" />
          Voir les parents d'un élève
        </h2>
        <div className="flex gap-4">
          <select
            value={selectedEleveView}
            onChange={(e) => handleViewEleveParents(e.target.value)}
            className="input flex-1"
          >
            <option value="">-- Sélectionner un élève --</option>
            {eleves.map((eleve) => {
              const nom = eleve.nomComplet || 
                (eleve.nom && eleve.postnom && eleve.prenom 
                  ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                  : `Élève #${eleve.id}`);
              return (
                <option key={eleve.id} value={eleve.id}>
                  {nom} - {eleve.classeNom || 'Sans classe'}
                </option>
              );
            })}
          </select>
        </div>

        {selectedEleveView && (
          <div className="mt-6 bg-green-50 rounded-lg p-6">
            {(() => {
              const eleve = eleves.find(e => e.id === parseInt(selectedEleveView));
              const eleveNom = eleve ? (eleve.nomComplet || 
                (eleve.nom && eleve.postnom && eleve.prenom 
                  ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                  : `Élève #${eleve.id}`)) : 'Inconnu';
              
              return (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Élève: {eleveNom}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Classe: {eleve?.classeNom || 'N/A'} | École: {typeof eleve?.ecole === 'object' ? eleve?.ecole?.nomEcole : eleve?.ecole}
                  </p>
                </>
              );
            })()}
            
            {eleveParents && eleveParents.length > 0 ? (
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">
                  {eleveParents.length} parent(s) :
                </p>
                {eleveParents.map((relation, index) => {
                  const parent = parents.find(p => p.id === relation.parentId);
                  return (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Nom du Parent</p>
                          <p className="font-semibold">{parent?.nomComplet || 'Inconnu'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Lien de Parenté</p>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium">
                            {relation.lienParente}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Téléphone</p>
                          <p className="font-semibold">{parent?.telephone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-semibold text-sm">{parent?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">Cet élève n'a pas encore de parents liés.</p>
            )}
          </div>
        )}
      </div>

      {/* Tableau des relations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Parent</th>
                <th className="px-6 py-4 text-left font-semibold">Contact Parent</th>
                <th className="px-6 py-4 text-left font-semibold">Élève</th>
                <th className="px-6 py-4 text-left font-semibold">Classe</th>
                <th className="px-6 py-4 text-left font-semibold">Lien de Parenté</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {relations.map((relation, index) => {
                const parent = parents.find(p => p.id === relation.parentId);
                // Utiliser les données du backend directement depuis relation
                const eleveNom = relation.eleveNom || 'Inconnu';

                return (
                  <tr key={relation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {relation.parentNom || parent?.nomComplet || 'Inconnu'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{relation.parentTelephone || parent?.telephone}</div>
                      <div className="text-gray-500">{relation.parentEmail || parent?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {eleveNom}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {relation.eleveClasse || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {relation.lienParente}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(relation.id)}
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
          <div className="bg-white rounded-lg max-w-md w-full my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">Ajouter une Relation</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form id="parent-eleve-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="label">Parent *</label>
                  <select
                    required
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner un parent</option>
                    {parents.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.nomComplet} - {parent.telephone}
                      </option>
                    ))}
                  </select>
                </div>

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
                          {nom} ({eleve.classe})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="label">Lien de Parenté *</label>
                  <select
                    required
                    value={formData.lienParente}
                    onChange={(e) => setFormData({ ...formData, lienParente: e.target.value })}
                    className="input"
                  >
                    <option value="">Sélectionner le lien</option>
                    {LIENS_PARENTE.map((lien) => (
                      <option key={lien} value={lien}>
                        {lien}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            <div className="flex gap-4 justify-end p-6 border-t bg-gray-50 flex-shrink-0">
              <button type="button" onClick={closeModal} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" form="parent-eleve-form" className="btn btn-primary">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
