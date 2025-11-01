import React, { useState, useEffect } from 'react';
import { ecoleService } from '../services/ecoleService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import { BuildingOffice2Icon, MapPinIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export default function EcolePage() {
  const [ecoleInfo, setEcoleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nomEcole: '',
    codeEcole: '',
    ville: '',
    commune_territoire: '',
    adresse: '',
    telephone: '',
    email: '',
    devise: '',
  });

  useEffect(() => {
    loadEcoleInfo();
  }, []);

  const loadEcoleInfo = async () => {
    try {
      const response = await ecoleService.getEcoleInfo();
      if (response.data) {
        setEcoleInfo(response.data);
        setFormData({
          nomEcole: response.data.nomEcole || '',
          codeEcole: response.data.codeEcole || '',
          ville: response.data.ville || '',
          commune_territoire: response.data.commune_territoire || '',
          adresse: response.data.adresse || '',
          telephone: response.data.telephone || '',
          email: response.data.email || '',
          devise: response.data.devise || '',
        });
      }
    } catch (error) {
      // Si aucune info n'existe, on reste avec le formulaire vide
      if (error.response?.status !== 404) {
        setError('Erreur lors du chargement des informations');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (ecoleInfo?.id) {
        // Mise à jour
        await ecoleService.updateEcole(ecoleInfo.id, formData);
        setSuccess('Informations de l\'école mises à jour avec succès');
      } else {
        // Création
        await ecoleService.createEcole(formData);
        setSuccess('Informations de l\'école enregistrées avec succès');
      }
      loadEcoleInfo();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BuildingOffice2Icon className="w-10 h-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuration de l'École</h1>
            <p className="text-gray-600 mt-1">
              Ces informations apparaîtront sur tous les bulletins scolaires
            </p>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess('')} />}

      {/* Aperçu visuel */}
      {(formData.nomEcole || formData.codeEcole || formData.ville || formData.commune_territoire) && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg mb-8 shadow-lg">
          <div className="grid grid-cols-3 gap-6 items-center">
            <div className="col-span-1">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-blue-900">
                  {formData.nomEcole ? formData.nomEcole.substring(0, 2).toUpperCase() : 'IU'}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{formData.nomEcole || 'Nom de l\'école'}</h2>
              <p className="text-blue-200 text-sm mt-1">Code: {formData.codeEcole || 'CODE123'}</p>
            </div>

            <div className="col-span-1 text-center">
              <h3 className="text-3xl font-bold uppercase tracking-wider">Bulletin</h3>
              <p className="text-xl mt-2 text-blue-200">Aperçu</p>
            </div>

            <div className="col-span-1 text-right">
              <p className="text-lg font-semibold">{formData.ville || 'Ville'}</p>
              <p className="text-blue-200 text-sm">{formData.commune_territoire || 'Commune/Territoire'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          {/* Section Identification */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IdentificationIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Identification</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Nom de l'École *</label>
                <input
                  type="text"
                  name="nomEcole"
                  required
                  value={formData.nomEcole}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: Institut Umoja"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Apparaît en haut à gauche du bulletin
                </p>
              </div>

              <div>
                <label className="label">Code de l'École *</label>
                <input
                  type="text"
                  name="codeEcole"
                  required
                  value={formData.codeEcole}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: EP1234"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Code officiel de l'établissement
                </p>
              </div>
            </div>
          </div>

          {/* Section Localisation */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPinIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Localisation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: Bukavu"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Apparaît en haut à droite du bulletin
                </p>
              </div>

              <div>
                <label className="label">Commune/Territoire *</label>
                <input
                  type="text"
                  name="commune_territoire"
                  required
                  value={formData.commune_territoire}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: Bagira"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Commune ou territoire administratif
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="label">Adresse Complète</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: Avenue de la Paix, N°123, Quartier Ndendere"
                />
              </div>
            </div>
          </div>

          {/* Section Contact */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: +243 999 999 999"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ex: contact@institut-umoja.cd"
                />
              </div>
            </div>
          </div>

          {/* Section Devise */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Devise de l'École</h3>
            <div>
              <label className="label">Devise ou Slogan</label>
              <textarea
                name="devise"
                value={formData.devise}
                onChange={handleChange}
                className="input"
                rows="2"
                placeholder="Ex: L'excellence par l'éducation"
              />
              <p className="text-xs text-gray-500 mt-1">
                Peut apparaître sur certains documents officiels
              </p>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={loadEcoleInfo}
            className="btn btn-secondary"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Enregistrement...' : ecoleInfo ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Note informative */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Note :</strong> Ces informations seront automatiquement utilisées pour tous les bulletins générés. 
          Les modifications prendront effet immédiatement sur tous les nouveaux bulletins.
        </p>
      </div>
    </div>
  );
}
