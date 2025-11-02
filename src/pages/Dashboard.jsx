import React, { useState, useEffect } from 'react';
import { eleveService } from '../services/eleveService';
import { coursService } from '../services/coursService';
import { noteService } from '../services/noteService';
import { utilisateurService } from '../services/utilisateurService';
import { conduiteService } from '../services/conduiteService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConduiteStatsCard from '../components/dashboard/ConduiteStatsCard';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    eleves: 0,
    cours: 0,
    notes: 0,
    utilisateurs: 0,
  });
  const [conduites, setConduites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [elevesRes, coursRes, notesRes, usersRes, conduitesRes] = await Promise.all([
        eleveService.getAllEleves(),
        coursService.getAllCours(),
        noteService.getAllNotes(),
        utilisateurService.getAllUtilisateurs(),
        conduiteService.getAllConduites(),
      ]);

      setStats({
        eleves: elevesRes.data?.length || 0,
        cours: coursRes.data?.length || 0,
        notes: notesRes.data?.length || 0,
        utilisateurs: usersRes.data?.length || 0,
      });
      setConduites(conduitesRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const statCards = [
    {
      title: 'Élèves',
      value: stats.eleves,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Cours',
      value: stats.cours,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Notes',
      value: stats.notes,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Utilisateurs',
      value: stats.utilisateurs,
      icon: UsersIcon,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre établissement</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition"
            style={{ borderLeftColor: stat.color.replace('bg-', '') }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide font-medium mb-1">
                  {stat.title}
                </p>
                <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.lightColor} p-4 rounded-full`}>
                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Performance Globale</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Taux de réussite</span>
              <span className="text-2xl font-bold text-green-600">85%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Moyenne générale</span>
              <span className="text-2xl font-bold text-blue-600">14.2/20</span>
            </div>
          </div>
        </div>

        <ConduiteStatsCard conduites={conduites} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Activité Récente</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvelles notes ajoutées</p>
                <p className="text-xs text-gray-600 mt-1">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau cours créé</p>
                <p className="text-xs text-gray-600 mt-1">Il y a 5 heures</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvel élève inscrit</p>
                <p className="text-xs text-gray-600 mt-1">Il y a 1 jour</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
