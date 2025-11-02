import React from 'react';
import { ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { TYPE_CONDUITE_LABELS } from '../../utils/enums';

export default function ConduiteStatsCard({ conduites }) {
  if (!conduites || conduites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conduites</h3>
          <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  // Compter les conduites par type
  const conduiteCounts = conduites.reduce((acc, conduite) => {
    acc[conduite.typeConduite] = (acc[conduite.typeConduite] || 0) + 1;
    return acc;
  }, {});

  // Trier par nombre (décroissant)
  const sortedConduites = Object.entries(conduiteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5

  // Calculer le pourcentage moyen de toutes les conduites
  const valeurs = {
    'EXCELLENT': 100,
    'TRES_BON': 85,
    'BON': 70,
    'ASSEZ_BON': 60,
    'PASSABLE': 50,
    'MEDIOCRE': 35,
    'MAUVAIS': 20,
  };

  const moyennePourcentage = conduites.length > 0
    ? conduites.reduce((sum, c) => sum + (valeurs[c.typeConduite] || 0), 0) / conduites.length
    : 0;

  const getColorClass = (type) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Évaluations de Conduite</h3>
        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{conduites.length}</span>
          <span className="text-sm text-gray-600">évaluations</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <ChartBarIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Moyenne: <span className={`font-semibold ${moyennePourcentage >= 70 ? 'text-green-600' : moyennePourcentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {moyennePourcentage.toFixed(1)}%
            </span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">Distribution :</p>
        {sortedConduites.map(([type, count]) => {
          const percentage = ((count / conduites.length) * 100).toFixed(0);
          return (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getColorClass(type)}`}>
                  {TYPE_CONDUITE_LABELS[type]}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600 ml-2">
                {count} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>

      {moyennePourcentage < 50 && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3">
          <p className="text-xs text-red-800">
            ⚠️ Moyenne en dessous du seuil acceptable
          </p>
        </div>
      )}
    </div>
  );
}
