import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eleveService } from '../services/eleveService';
import { bulletinService } from '../services/bulletinService';
import { PERIODE_ENUM, PERIODE_OPTIONS } from '../utils/enums';
import BulletinCard from '../components/bulletin/BulletinCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function BulletinPage() {
  const { eleveId: paramEleveId, periode: paramPeriode } = useParams();
  const navigate = useNavigate();

  const [eleves, setEleves] = useState([]);
  const [selectedEleveId, setSelectedEleveId] = useState(paramEleveId || '');
  const [selectedPeriode, setSelectedPeriode] = useState(paramPeriode || '');
  const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEleves, setLoadingEleves] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEleves();
  }, []);

  useEffect(() => {
    if (paramEleveId && paramPeriode) {
      loadBulletin(paramEleveId, paramPeriode);
    }
  }, [paramEleveId, paramPeriode]);

  const loadEleves = async () => {
    try {
      const response = await eleveService.getAllEleves();
      setEleves(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
      setError('Impossible de charger la liste des élèves');
    } finally {
      setLoadingEleves(false);
    }
  };

  const loadBulletin = async (eleveId, periode) => {
    if (!eleveId || !periode) {
      setError('Veuillez sélectionner un élève et une période');
      return;
    }

    setLoading(true);
    setError('');
    setBulletin(null);

    try {
      const response = await bulletinService.getBulletin(eleveId, periode);
      const bulletinData = response.data;
      
      // Enrichir le bulletin avec les données de l'élève si manquantes
      const eleve = eleves.find(e => e.id === parseInt(eleveId));
      if (eleve) {
        bulletinData.ecole = bulletinData.ecole || eleve.ecole;
        bulletinData.code = bulletinData.code || eleve.code;
        bulletinData.ville = bulletinData.ville || eleve.ville;
        bulletinData.commune_territoire = bulletinData.commune_territoire || eleve.commune_territoire;
      }
      
      setBulletin(bulletinData);
    } catch (error) {
      console.error('Erreur lors du chargement du bulletin:', error);
      setError(
        error.response?.data?.message ||
        'Impossible de charger le bulletin. Vérifiez que l\'élève a des notes pour cette période.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedEleveId && selectedPeriode) {
      loadBulletin(selectedEleveId, selectedPeriode);
    } else {
      setError('Veuillez sélectionner un élève et une période');
    }
  };

  if (loadingEleves) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Retour au tableau de bord
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Bulletins Scolaires</h1>
        <p className="text-gray-600 mt-2">Consultez et imprimez les bulletins des élèves</p>
      </div>

      {/* Formulaire de recherche */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Rechercher un Bulletin</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Élève</label>
            <select
              value={selectedEleveId}
              onChange={(e) => setSelectedEleveId(e.target.value)}
              className="input"
            >
              <option value="">-- Sélectionner un élève --</option>
              {eleves.map((eleve) => {
                const nomComplet = eleve.nomComplet || 
                  (eleve.nom && eleve.postnom && eleve.prenom 
                    ? `${eleve.nom} ${eleve.postnom} ${eleve.prenom}` 
                    : `Élève #${eleve.id}`);
                return (
                  <option key={eleve.id} value={eleve.id}>
                    {nomComplet} ({eleve.classe})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Période</label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="input"
            >
              <option value="">-- Sélectionner une période --</option>
              {PERIODE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!selectedEleveId || !selectedPeriode}
              className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Afficher le Bulletin
            </button>
          </div>
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* Chargement */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Bulletin */}
      {!loading && bulletin && <BulletinCard bulletin={bulletin} />}

      {/* Message si pas de bulletin */}
      {!loading && !bulletin && !error && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">
            Sélectionnez un élève et une période pour afficher le bulletin
          </p>
        </div>
      )}
    </div>
  );
}
