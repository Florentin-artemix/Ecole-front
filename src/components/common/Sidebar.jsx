import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ecoleService } from '../../services/ecoleService';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  UserPlusIcon,
  BuildingOffice2Icon,
  RectangleGroupIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Élèves', to: '/eleves', icon: UserGroupIcon },
  { name: 'Classes', to: '/classes', icon: RectangleGroupIcon },
  { name: 'Cours', to: '/cours', icon: AcademicCapIcon },
  { name: 'Notes', to: '/notes', icon: DocumentTextIcon },
  { name: 'Conduites', to: '/conduites', icon: ShieldCheckIcon },
  { name: 'Bulletins', to: '/bulletins', icon: ClipboardDocumentCheckIcon },
  { name: 'Parent-Élève', to: '/parent-eleve', icon: UserPlusIcon },
  { name: 'Utilisateurs', to: '/utilisateurs', icon: UsersIcon },
  { name: 'École', to: '/ecole', icon: BuildingOffice2Icon },
];

const paiementNavigation = [
  { name: 'Motifs de Paiement', to: '/motifs-paiement', icon: ReceiptPercentIcon },
  { name: 'Paiements', to: '/paiements', icon: BanknotesIcon },
  { name: 'Suivi Paiement', to: '/suivi-paiement', icon: ChartBarIcon },
  { name: 'Dérogations', to: '/derogations', icon: DocumentCheckIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const [ecoleInfo, setEcoleInfo] = useState(null);

  useEffect(() => {
    loadEcoleInfo();
  }, []);

  const loadEcoleInfo = async () => {
    try {
      const response = await ecoleService.getEcoleInfo();
      if (response.data) {
        setEcoleInfo(response.data);
      }
    } catch {
      // Si pas d'info école, on utilise le nom par défaut
      console.log('Aucune information école configurée');
    }
  };

  const nomEcole = ecoleInfo?.nomEcole || 'Institut Umoja';
  const codeEcole = ecoleInfo?.codeEcole || '';

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-2xl font-bold text-blue-400">{nomEcole}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {codeEcole ? `${codeEcole} - Gestion Scolaire` : 'Gestion Scolaire'}
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6 mr-3 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* Section Paiements */}
        <div className="pt-4 mt-4 border-t border-gray-700">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Système de Paiement
          </div>
          {paiementNavigation.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.name}
                to={item.to}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6 mr-3 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="text-xs text-gray-400 text-center">
          © 2025 {nomEcole}
        </div>
      </div>
    </div>
  );
}
