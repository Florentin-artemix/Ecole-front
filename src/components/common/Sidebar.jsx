import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ShieldCheckIcon
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

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-2xl font-bold text-blue-400">Institut Umoja</h1>
        <p className="text-sm text-gray-400 mt-1">Gestion Scolaire</p>
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
      </nav>

      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <div className="text-xs text-gray-400 text-center">
          © 2025 Institut Umoja
        </div>
      </div>
    </div>
  );
}
