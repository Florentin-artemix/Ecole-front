import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord</h2>
          <p className="text-sm text-gray-500 mt-1">Bienvenue dans votre espace de gestion</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Administrateur</p>
              <p className="text-xs text-gray-500">Institut Umoja</p>
            </div>
            <UserCircleIcon className="w-10 h-10 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
