import React, { useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { MENTION_COLORS, CONDUITE_COLORS } from '../../utils/enums';

export default function BulletinCard({ bulletin }) {
  const bulletinRef = useRef();

  if (!bulletin) return null;

  // Construire le nom complet si nécessaire
  const nomComplet = bulletin.nomComplet || 
    (bulletin.nom && bulletin.postnom && bulletin.prenom 
      ? `${bulletin.nom} ${bulletin.postnom} ${bulletin.prenom}` 
      : 'Nom non disponible');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Bouton d'impression */}
      <div className="no-print mb-6 flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
        >
          <PrinterIcon className="w-5 h-5" />
          Imprimer le Bulletin
        </button>
      </div>

      {/* Bulletin */}
      <div ref={bulletinRef} className="bulletin-print bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-200">
        {/* EN-TÊTE DU BULLETIN */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8">
          <div className="grid grid-cols-3 gap-6 items-center">
            {/* Logo / Nom de l'école */}
            <div className="col-span-1">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl font-bold text-blue-900">IU</span>
              </div>
              <h1 className="text-2xl font-bold">{bulletin.ecole || 'Institut Umoja'}</h1>
              <p className="text-blue-200 text-sm mt-1">Code: {bulletin.code || bulletin.Code || 'EP1234'}</p>
            </div>

            {/* Titre central */}
            <div className="col-span-1 text-center">
              <h2 className="text-3xl font-bold uppercase tracking-wider">Bulletin</h2>
              <p className="text-xl mt-2 text-blue-200">{bulletin.periode}</p>
              <p className="text-sm mt-1 text-blue-300">Année Scolaire 2024-2025</p>
            </div>

            {/* Localisation */}
            <div className="col-span-1 text-right">
              <p className="text-lg font-semibold">{bulletin.ville || 'Bukavu'}</p>
              <p className="text-blue-200 text-sm">{bulletin.commune_territoire || bulletin.communeTerritoire || 'Bagira'}</p>
              <p className="text-xs text-blue-300 mt-3">
                Édité le {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        {/* INFORMATIONS DE L'ÉLÈVE */}
        <div className="bg-gray-50 p-6 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-3">
              Identité de l'Élève
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nom Complet</p>
              <p className="font-bold text-gray-900">{nomComplet}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sexe</p>
              <p className="font-semibold text-gray-900">{bulletin.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date de Naissance</p>
              <p className="font-semibold text-gray-900">
                {bulletin.dateNaissance && format(new Date(bulletin.dateNaissance), 'dd/MM/yyyy')}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lieu de Naissance</p>
              <p className="font-semibold text-gray-900">{bulletin.lieuNaissance}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">N° Permanent</p>
              <p className="font-semibold text-gray-900">{bulletin.numeroPermanent}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Classe</p>
              <p className="font-semibold text-gray-900">{bulletin.classe}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Place</p>
              <p className="font-semibold text-gray-900">{bulletin.place_nbreEleve}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Conduite</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${CONDUITE_COLORS[bulletin.conduite] || 'bg-gray-100 text-gray-800'}`}>
                {bulletin.conduite}
              </span>
            </div>
          </div>
        </div>

        {/* TABLEAU DES NOTES */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
              Résultats Scolaires
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-600 px-4 py-3 text-left font-bold">N°</th>
                  <th className="border border-gray-600 px-4 py-3 text-left font-bold">Branche/Cours</th>
                  <th className="border border-gray-600 px-4 py-3 text-center font-bold">Pondération</th>
                  <th className="border border-gray-600 px-4 py-3 text-center font-bold">Note Obtenue</th>
                </tr>
              </thead>
              <tbody>
                {bulletin.notes && bulletin.notes.map((note, index) => {
                  // Calculer le pourcentage pour la couleur
                  const pourcentage = (note.valeur / note.ponderation) * 100;
                  const noteColor = pourcentage >= 50 ? 'text-green-700' : 'text-red-700';
                  
                  return (
                    <tr key={note.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium">{note.coursNom}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold">{note.ponderation}</td>
                      <td className={`border border-gray-300 px-4 py-3 text-center font-bold text-lg ${noteColor}`}>
                        {note.valeur.toFixed(1)}/{note.ponderation}
                      </td>
                    </tr>
                  );
                })}

                {/* Ligne de totaux */}
                <tr className="bg-blue-50 font-bold border-t-4 border-blue-900">
                  <td colSpan="2" className="border border-gray-300 px-4 py-4 text-right text-lg">
                    TOTAL GÉNÉRAL
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-center text-xl text-gray-900 font-bold shadow-md bg-white">
                    {bulletin.maximumGeneral}
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-center text-2xl text-blue-900 font-bold shadow-lg bg-white">
                    {bulletin.totalGeneral?.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RÉSULTATS ET MENTION */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Pourcentage</p>
              <p className="text-4xl font-bold text-blue-900">{bulletin.pourcentage?.toFixed(2)}%</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Mention</p>
              <span className={`inline-block px-4 py-2 rounded-lg text-xl font-bold ${MENTION_COLORS[bulletin.mention] || 'bg-gray-100 text-gray-800'}`}>
                {bulletin.mention}
              </span>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Classement</p>
              <p className="text-3xl font-bold text-purple-900">{bulletin.place_nbreEleve}</p>
              <p className="text-xs text-gray-500 mt-1">de la classe</p>
            </div>
          </div>
        </div>

        {/* PIED DE PAGE */}
        <div className="bg-gray-800 text-white p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-400 mb-2">Signature du Titulaire</p>
              <div className="h-16 border-t-2 border-gray-600 mt-8"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Signature du Directeur</p>
              <div className="h-16 border-t-2 border-gray-600 mt-8"></div>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Signature du Parent/Tuteur</p>
              <div className="h-16 border-t-2 border-gray-600 mt-8"></div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-400">
              {bulletin.ecole} - {bulletin.ville}, {bulletin.commune_territoire}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Document officiel - Toute falsification est passible de sanctions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
