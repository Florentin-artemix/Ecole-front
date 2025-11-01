import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DataImporter({ onImport, type }) {
  const [showModal, setShowModal] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [error, setError] = useState('');

  const handleImport = async () => {
    setError('');
    try {
      const data = JSON.parse(jsonData);
      await onImport(data);
      setShowModal(false);
      setJsonData('');
    } catch (err) {
      setError('JSON invalide ou erreur lors de l\'importation');
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'eleves':
        return `[
  {
    "nom": "Mukendi",
    "postnom": "Jean",
    "prenom": "Pierre",
    "sexe": "M",
    "dateNaissance": "2008-03-15",
    "lieuNaissance": "Kinshasa",
    "numeroPermanent": "KIN2008001",
    "classe": "6e Scientifique",
    "ecole": "Institut Umoja",
    "code": "EP1234",
    "ville": "Bukavu",
    "commune_territoire": "Bagira"
  }
]`;
      case 'cours':
        return `[
  {
    "nomCours": "Mathématiques",
    "ponderation": 6,
    "professeurId": 1
  }
]`;
      case 'notes':
        return `[
  {
    "eleveId": 1,
    "coursId": 1,
    "valeur": 15.5,
    "periode": "PREMIERE"
  }
]`;
      case 'utilisateurs':
        return `[
  {
    "nomComplet": "Prof. KASONGO Albert",
    "role": "PROFESSEUR",
    "telephone": "0998765001",
    "email": "kasongo.albert@lycee.cd",
    "motDePasse": "Prof2025!"
  }
]`;
      case 'parent-eleve':
        return `[
  {
    "parentId": 1,
    "eleveId": 1,
    "lienParente": "Père"
  },
  {
    "parentId": 1,
    "eleveId": 2,
    "lienParente": "Père"
  }
]`;
      default:
        return '[]';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-secondary flex items-center gap-2"
      >
        📥 Importer JSON
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Importer des données JSON
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <label className="label">Collez vos données JSON ici :</label>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="input font-mono text-sm"
                rows="15"
                placeholder={getPlaceholder()}
              />
              
              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Astuce :</strong> Vous pouvez importer plusieurs éléments à la fois en utilisant un tableau JSON.
                  Consultez les fichiers de test dans le dossier <code className="bg-blue-100 px-1 rounded">demo/</code>
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                className="btn btn-primary"
                disabled={!jsonData.trim()}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
