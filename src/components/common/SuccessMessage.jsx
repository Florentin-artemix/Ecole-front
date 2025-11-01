import React from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SuccessMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
      <div className="flex items-start">
        <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800">Succès</h3>
          <p className="text-sm text-green-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-green-500 hover:text-green-700 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
