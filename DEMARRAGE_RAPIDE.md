# 🚀 Guide de Démarrage Rapide - Institut Umoja

## Étape 1: Démarrer le Backend

Avant de lancer le frontend, assurez-vous que votre backend Spring Boot est en cours d'exécution :

```bash
cd demo
./mvnw spring-boot:run
```

Ou si vous utilisez Maven directement :
```bash
mvn spring-boot:run
```

Le backend devrait être accessible sur : `http://localhost:8080`

## Étape 2: Démarrer le Frontend

Dans ce dossier, exécutez :

```bash
npm run dev
```

L'application sera accessible sur : `http://localhost:5173`

## ✅ Vérifications

1. **Backend actif** : Vérifiez que `http://localhost:8080/api/eleves` retourne une réponse
2. **CORS configuré** : Le backend doit autoriser les requêtes depuis `http://localhost:5173`
3. **Données de test** : Utilisez les fichiers JSON dans `demo/` pour créer des données

## 🎯 Utilisation

### 1. Créer des Utilisateurs (Professeurs d'abord)
- Allez dans "Utilisateurs"
- Créez au moins un professeur
- Exemple : Dr. Jean Mukendi, role: PROFESSEUR

### 2. Créer des Cours
- Allez dans "Cours"
- Créez des cours en les assignant aux professeurs
- Exemple : Mathématiques, Pondération: 5

### 3. Créer des Élèves
- Allez dans "Élèves"
- Créez des élèves avec leurs informations complètes

### 4. Ajouter des Notes
- Allez dans "Notes"
- Enregistrez les notes pour chaque élève/cours/période

### 5. Générer un Bulletin
- Allez dans "Bulletins"
- Sélectionnez un élève et une période
- Le bulletin s'affiche avec tous les calculs
- Cliquez sur "Imprimer" pour l'impression

## 🐛 Problèmes Courants

### Erreur CORS
Si vous voyez des erreurs CORS dans la console :
1. Vérifiez que le backend est configuré pour accepter `http://localhost:5173`
2. Consultez `demo/GUIDE_CORS_COMPLET.md`

### Erreur "Network Error"
- Vérifiez que le backend est bien démarré
- Vérifiez l'URL dans `.env` : `VITE_API_URL=http://localhost:8080/api`

### Les icônes ne s'affichent pas
- Arrêtez le serveur (Ctrl+C)
- Relancez : `npm run dev`

## 📚 Documentation Complète

Consultez les guides dans le dossier `demo/` :
- `GUIDE_FRONTEND_REACT_UPDATED.md` - Guide complet du frontend
- `GUIDE_TEST_API_BULLETINS.md` - Tests API des bulletins
- `GUIDE_ENUMERATIONS_FRONTEND.md` - Gestion des énumérations
- `EXPLICATION_CALCUL_NOTES.md` - Système de calcul des notes

## 🎨 Personnalisation

### Changer le nom de l'école
Éditez `src/components/common/Sidebar.jsx` et `src/components/bulletin/BulletinCard.jsx`

### Changer les couleurs
Éditez `tailwind.config.js` et `src/utils/enums.js`

---

**Bon développement ! 🚀**
