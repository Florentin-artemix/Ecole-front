# 🎓 Institut Umoja - Système de Gestion Scolaire

Application web professionnelle de gestion scolaire développée avec React et Vite, intégrée avec le backend Spring Boot.

## ✨ Fonctionnalités

### 📊 Dashboard
- Vue d'ensemble des statistiques (élèves, cours, notes, utilisateurs)
- Indicateurs de performance
- Activités récentes

### 👨‍🎓 Gestion des Élèves
- Créer, modifier, supprimer des élèves
- Informations complètes : nom, sexe, date de naissance, classe, etc.
- Interface intuitive avec formulaires modaux

### 📚 Gestion des Cours
- Gestion complète des cours
- Association avec les professeurs
- Pondération personnalisable

### 📝 Gestion des Notes
- Enregistrement des notes par élève, cours et période
- Validation des notes (0-20)
- Suivi par période (1ère, 2e, 3e, examens)

### 📄 Bulletins Scolaires Professionnels
- **En-tête élégant** avec identité de l'école et de l'élève
- **Tableau détaillé** des notes avec calculs automatiques
- **Impression optimisée** pour format A4
- Informations complètes : mention, conduite, classement, signatures

### 👥 Gestion des Utilisateurs
- Rôles : Admin, Professeur, Parent, Percepteur
- Gestion des accès et permissions

## 🚀 Installation

### Prérequis
- Node.js 16+ et npm
- Backend Spring Boot en cours d'exécution sur `http://localhost:8080`

### Étapes d'installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'API**
   Le fichier `.env` est déjà configuré pour pointer vers `http://localhost:8080/api`

3. **Lancer l'application**
   ```bash
   npm run dev
   ```

4. **Accéder à l'application**
   Ouvrez votre navigateur sur `http://localhost:5173`

## 📦 Technologies Utilisées

- **React 19** - Framework UI
- **Vite** - Build tool et dev server
- **React Router DOM** - Navigation
- **Axios** - Communication HTTP avec l'API
- **Tailwind CSS** - Styling moderne
- **Heroicons** - Icônes
- **date-fns** - Manipulation des dates
- **React Hook Form** - Gestion des formulaires

## 🎨 Design Professionnel

### Bulletin Scolaire
Le bulletin est conçu avec une attention particulière aux détails :

#### En-tête
- Logo et nom de l'école
- Titre central élégant
- Localisation (ville, commune)
- Code de l'établissement

#### Informations Élève
- Nom complet, sexe, date/lieu de naissance
- Numéro permanent, classe
- Conduite et classement

#### Tableau des Notes
- Colonnes : Branche, Pondération, Note, Points, Maximum
- Calculs automatiques des totaux
- Pourcentage et mention
- Codes couleur pour faciliter la lecture

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
```

## 📝 Notes Importantes

1. **CORS** : Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173`

2. **Données de Test** : Utilisez les fichiers JSON du dossier `demo/` du backend pour créer des données de test

3. **Impression** : Utilisez le bouton d'impression intégré dans le bulletin

## 📄 License

Ce projet est développé pour l'Institut Umoja - Bukavu, RDC

---

**Développé avec ❤️ pour l'Institut Umoja**
