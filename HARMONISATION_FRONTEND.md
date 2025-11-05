# Harmonisation Frontend avec Contrat API

## Date: 5 novembre 2025
## Branche: feature/paiement

---

## 📋 État des lieux

### Services existants ✅
- `eleveService.js`
- `classeService.js`
- `coursService.js`
- `utilisateurService.js`
- `noteService.js`
- `conduiteService.js`
- `bulletinService.js`
- `parentEleveService.js`
- `ecoleService.js`

### Services manquants ❌
Selon le contrat API, il manque:
1. **motifPaiementService.js** - Gestion des motifs de paiement
2. **paiementService.js** - Gestion des paiements
3. **suiviPaiementService.js** - Suivi des paiements élèves
4. **derogationService.js** - Gestion des dérogations

### Pages manquantes ❌
1. **MotifsPaiementPage.jsx** - CRUD motifs de paiement
2. **PaiementsPage.jsx** - Enregistrement des paiements
3. **SuiviPaiementPage.jsx** - Tableau de bord suivi paiements
4. **DerogationsPage.jsx** - Gestion des demandes de dérogation

---

## 🔍 Vérifications nécessaires

### 1. Énumérations (utils/enums.js)
Vérifier que les valeurs correspondent au contrat:
- **Periode**: `PREMIERE`, `DEUXIEME`, `TROISIEME`, `EXAMEN_PREMIER_SEMESTRE`, `EXAMEN_SECOND_SEMESTRE`
- **TypeConduite**: `EXCELLENT`, `TRES_BON`, `BON`, `ASSEZ_BON`, `PASSABLE`, `MEDIOCRE`, `MAUVAIS`
- **Role**: `ADMIN`, `PROFESSEUR`, `PARENT`, `PERCEPTEUR`

### 2. DTOs dans les pages
Vérifier que les payloads envoyés correspondent aux CreateDTO:
- **EleveCreateDTO** vs **EleveDTO**
- **NoteCreateDTO** vs **NoteDTO** (attention: `typeConduite` et `commentaireConduite` optionnels)
- **ConduiteCreateDTO** vs **ConduiteDTO**
- etc.

### 3. Endpoints
Vérifier que tous les appels API utilisent les bons endpoints selon le contrat:
- `/api/ecole` vs `/api/ecole/all`
- `/api/notes/batch` pour import multiple
- `/api/conduites/eleve/{id}/periode/{periode}/calcul`
- etc.

---

## 📦 Plan d'action

### Phase 1: Création des services (PRIORITAIRE)
1. ✅ Créer `motifPaiementService.js`
2. ✅ Créer `paiementService.js`
3. ✅ Créer `suiviPaiementService.js`
4. ✅ Créer `derogationService.js`

### Phase 2: Création des pages UI
1. ✅ Créer `MotifsPaiementPage.jsx`
2. ✅ Créer `PaiementsPage.jsx`
3. ✅ Créer `SuiviPaiementPage.jsx`
4. ✅ Créer `DerogationsPage.jsx`

### Phase 3: Intégration au routeur
1. ✅ Ajouter les routes dans `App.jsx`
2. ✅ Ajouter les liens dans le Sidebar

### Phase 4: Tests et validation
1. ⏳ Tester chaque CRUD
2. ⏳ Valider les formats de données
3. ⏳ Vérifier les messages d'erreur

---

## 🎯 Objectifs spécifiques

### Système de Paiement
Le système doit permettre:
- Créer des motifs de paiement (ex: "Frais 1ère période", "Minerval", etc.)
- Enregistrer les paiements des élèves
- Suivre l'état des paiements (PAYE_COMPLET, PAIEMENT_PARTIEL, NON_PAYE)
- Gérer les dérogations (demande, acceptation, refus)
- Vérifier si un élève est en ordre de paiement

### Fonctionnalités clés
- Dashboard de suivi des paiements par élève
- Alerte pour paiements non en ordre
- Système de dérogation temporaire
- Historique des paiements
- Export/impression des reçus

---

## 📝 Notes importantes

### Formats de données
- **Dates**: ISO 8601 (`YYYY-MM-DD` pour LocalDate, `YYYY-MM-DDThh:mm:ss` pour LocalDateTime)
- **Montants**: Number (ex: 100.00)
- **Statuts**: Enums stricts

### Gestion des erreurs
Format standard du backend:
```json
{
  "timestamp": "2025-11-05T12:34:56",
  "status": 404,
  "error": "Not Found",
  "message": "Détail de l'erreur",
  "path": "/api/..."
}
```

### Endpoints importants
- `POST /api/suivis-paiement/motif/{motifId}/tous-eleves` : Créer suivi pour tous les élèves
- `GET /api/suivis-paiement/eleve/{eleveId}/en-ordre` : Vérifier si élève en ordre
- `POST /api/derogations/verifier-expirations` : Vérifier et marquer dérogations expirées
- `GET /api/derogations/eleve/{eleveId}/a-derogation-valide` : Check dérogation valide

