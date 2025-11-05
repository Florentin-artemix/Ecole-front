# 📚 Guide du Système de Dérogation et Ordre de Paiement

**Date :** 5 novembre 2025  
**Branche :** feature/paiement

---

## 🎯 Objectif

Ce guide explique :
1. **Comment fonctionne le système de dérogation**
2. **Comment déterminer si un élève est en ordre de// ❌ AVANT
const PAIEMENTS_BASE_URL = '/api/paiements';

// ✅ APRÈS
const PAIEMENTS_BASE_URL = '/paiements';// ❌ AVANT
const PAIEMENTS_BASE_URL = '/api/paiements';

// ✅ APRÈS
const PAIEMENTS_BASE_URL = '/paiements'; paiement**
3. **Comment définir la date d'expiration d'une dérogation**

---

## 📋 Système de Dérogation

### Qu'est-ce qu'une dérogation ?

Une **dérogation** est une **exemption temporaire** accordée à un élève qui ne peut pas payer ses frais scolaires dans les délais normaux. Elle permet à l'élève de continuer ses études malgré un retard de paiement.

---

## 🔄 Cycle de Vie d'une Dérogation

### 1️⃣ **Demande de dérogation** (Statut: `EN_ATTENTE`)

Un élève (ou son parent/tuteur) fait une demande en expliquant les raisons :
- **Difficultés financières temporaires**
- **Problème familial**
- **Attente de ressources**

**Exemple de demande :**
```json
{
  "eleveId": 5,
  "motifPaiementId": 3,
  "motif": "Difficultés temporaires - décès dans la famille"
}
```

---

### 2️⃣ **Acceptation de la dérogation** (Statut: `ACCEPTEE`)

L'administration scolaire examine la demande et peut l'accepter. **Lors de l'acceptation, 2 informations obligatoires sont requises :**

#### 📅 **A. Date d'expiration**
C'est la date limite jusqu'à laquelle la dérogation est valide.

**Comment la déterminer ?**

| Situation | Durée recommandée | Exemple |
|-----------|-------------------|---------|
| **Difficultés temporaires** | 1 à 3 mois | Un parent en arrêt maladie |
| **Attente de rentrée d'argent** | 1 mois | Salaire en retard, héritage en cours |
| **Cas exceptionnel grave** | 3 à 6 mois | Décès, catastrophe naturelle |
| **Période scolaire complète** | Jusqu'à fin de période | Tout le 1er trimestre |

**Par défaut dans le système :** 3 mois à partir de la date d'acceptation.

**Format requis :** ISO 8601 datetime (ex: `2025-12-31T23:59:59`)

#### 👤 **B. Accordée par**
Le nom de la personne qui accorde la dérogation (directeur, économe, etc.).

**Exemple :**
```json
{
  "dateExpiration": "2025-12-31T23:59:59",
  "accordeePar": "Directeur Jean Mukendi"
}
```

---

### 3️⃣ **Refus de la dérogation** (Statut: `REFUSEE`)

Si la demande n'est pas justifiée, elle peut être refusée avec une raison obligatoire :

**Exemple :**
```json
{
  "raisonRefus": "Pièces justificatives manquantes"
}
```

---

### 4️⃣ **Expiration automatique** (Statut: `EXPIREE`)

Lorsque la `dateExpiration` est dépassée, la dérogation devient automatiquement **EXPIREE**. L'élève doit alors :
- **Payer ses frais** pour être en ordre
- **Demander une nouvelle dérogation** si nécessaire

---

## ✅ Déterminer si un Élève est en Ordre de Paiement

### Définition : "En ordre"

Un élève est **en ordre de paiement** si **l'une des conditions suivantes** est remplie :

1. ✅ **Il a payé tous ses frais** (`montantRestant = 0`)
2. ✅ **Il bénéficie d'une dérogation valide** (`statut = ACCEPTEE` ET `dateExpiration > aujourd'hui`)

---

### Vérification via l'API

#### Endpoint 1 : Vérifier un élève spécifique
```http
GET /api/suivis-paiement/eleve/{eleveId}/en-ordre
```

**Réponse :**
```json
true  // Élève en ordre
false // Élève PAS en ordre
```

---

#### Endpoint 2 : Vérifier si élève a une dérogation valide
```http
GET /api/derogations/eleve/{eleveId}/a-derogation-valide
```

**Réponse :**
```json
true  // A une dérogation valide
false // N'a pas de dérogation valide
```

---

#### Endpoint 3 : Obtenir la dérogation valide
```http
GET /api/derogations/eleve/{eleveId}/valide
```

**Réponse (si existe) :**
```json
{
  "id": 12,
  "eleveId": 5,
  "nomEleve": "Michel",
  "prenomEleve": "Tshimanga",
  "motif": "Difficultés temporaires",
  "statut": "ACCEPTEE",
  "dateDemande": "2025-11-01T10:00:00",
  "dateAcceptation": "2025-11-02T14:30:00",
  "dateExpiration": "2026-02-02T14:30:00",
  "accordeePar": "Directeur Jean Mukendi",
  "active": true,
  "estExpiree": false,
  "estValide": true
}
```

---

### Logique de Vérification (Frontend)

```javascript
// Fonction pour vérifier si un élève est en ordre
const isEleveEnOrdre = async (eleveId) => {
  try {
    // Méthode 1 : Via le suivi de paiement
    const enOrdre = await suiviPaiementService.isEnOrdre(eleveId);
    return enOrdre;
    
    // OU Méthode 2 : Vérification manuelle
    const suivis = await suiviPaiementService.getByEleve(eleveId);
    const derogation = await derogationService.getValide(eleveId);
    
    // En ordre si :
    // - Tous les suivis sont payés (statutPaiement = 'PAYE_COMPLET')
    // - OU il a une dérogation valide
    const tousPayes = suivis.every(s => s.statutPaiement === 'PAYE_COMPLET');
    const aDerogationValide = derogation && derogation.estValide;
    
    return tousPayes || aDerogationValide;
  } catch (err) {
    console.error('Erreur vérification ordre:', err);
    return false;
  }
};
```

---

## 📊 États Possibles d'un Élève

| État | Description | Statut Paiement | Dérogation | Peut continuer |
|------|-------------|-----------------|------------|----------------|
| ✅ **En ordre (payé)** | Tous les frais payés | `PAYE_COMPLET` | Non requis | ✅ Oui |
| ✅ **En ordre (dérogation)** | Dérogation valide active | `NON_PAYE` ou `PAIEMENT_PARTIEL` | `ACCEPTEE` (non expirée) | ✅ Oui |
| ⚠️ **En attente** | Dérogation demandée | `NON_PAYE` ou `PAIEMENT_PARTIEL` | `EN_ATTENTE` | ⏳ En attente décision |
| ❌ **Pas en ordre** | Aucun paiement ni dérogation | `NON_PAYE` ou `PAIEMENT_PARTIEL` | Aucune ou `EXPIREE` | ❌ Non |

---

## 🖥️ Interface Utilisateur

### Page Suivi Paiement (`/suivi-paiement`)

**Bouton "Vérifier statut global"** :
```jsx
<button
  onClick={() => checkEnOrdre(eleve.id)}
  className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
>
  Vérifier statut global
</button>
```

**Fonction :**
```javascript
const checkEnOrdre = async (eleveId) => {
  try {
    const isEnOrdre = await suiviPaiementService.isEnOrdre(eleveId);
    if (isEnOrdre) {
      setSuccess('Cet élève est en ordre de paiement ✓');
    } else {
      setError('Cet élève n\'est PAS en ordre de paiement ✗');
    }
  } catch (err) {
    setError('Erreur lors de la vérification');
  }
};
```

---

### Page Dérogations (`/derogations`)

#### **Accepter une dérogation** (nouveau modal)

1. Cliquer sur le bouton ✅ **Accepter** (icône verte)
2. Remplir le formulaire :
   - **Date d'expiration** : Sélectionner date/heure (par défaut : +3 mois)
   - **Accordée par** : Saisir nom (ex: "Directeur Mukendi")
3. Cliquer sur **"Confirmer l'acceptation"**

**Exemple de données envoyées :**
```json
{
  "dateExpiration": "2026-02-05T23:59:59",
  "accordeePar": "Directeur Jean Mukendi"
}
```

---

#### **Refuser une dérogation**

1. Cliquer sur le bouton ❌ **Refuser** (icône rouge)
2. Saisir la **raison du refus** (obligatoire)
3. Cliquer sur **"Confirmer le refus"**

**Exemple de données envoyées :**
```json
{
  "raisonRefus": "Pièces justificatives manquantes"
}
```

---

## 🔧 Corrections Techniques Appliquées

### 1. **PaiementsPage.jsx** - Erreur toFixed()

**Problème :** `totalPaye.toFixed(2)` crashait si `montantPaye` était null/undefined.

**Solution :**
```javascript
// ❌ AVANT
const totalPaye = filteredPaiements.reduce((sum, p) => sum + p.montantPaye, 0);

// ✅ APRÈS
const totalPaye = filteredPaiements.reduce((sum, p) => sum + (p.montantPaye || 0), 0);
```

---

### 2. **paiementService.js** - URL incorrecte

**Problème :** L'URL était `/paiements` au lieu de `/api/paiements`.

**Solution :**
```javascript
// ❌ AVANT
const PAIEMENTS_BASE_URL = '/paiements';

// ✅ APRÈS
const PAIEMENTS_BASE_URL = '/api/paiements';
```

---

### 3. **derogationService.js** - Paramètres manquants

**Problème :** Les endpoints `accepter` et `refuser` envoyaient un body vide au lieu des DTOs requis.

#### A. Accepter
```javascript
// ❌ AVANT
accepter: async (id) => {
  const response = await api.patch(`${URL}/${id}/accepter`, {});
  return response.data;
}

// ✅ APRÈS
accepter: async (id, accepterData) => {
  const response = await api.patch(`${URL}/${id}/accepter`, accepterData);
  return response.data;
}
```

#### B. Refuser
```javascript
// ❌ AVANT
refuser: async (id, motifRefus = null) => {
  const url = motifRefus 
    ? `${URL}/${id}/refuser?motifRefus=${encodeURIComponent(motifRefus)}`
    : `${URL}/${id}/refuser`;
  const response = await api.patch(url);
  return response.data;
}

// ✅ APRÈS
refuser: async (id, raisonRefus) => {
  const response = await api.patch(`${URL}/${id}/refuser`, {
    raisonRefus: raisonRefus || 'Aucune raison spécifiée'
  });
  return response.data;
}
```

---

### 4. **DerogationsPage.jsx** - Modals interactifs

**Ajouts :**
- ✅ Modal d'acceptation avec 2 champs (dateExpiration, accordeePar)
- ✅ Modal de refus avec validation obligatoire
- ✅ Validation des champs avant envoi
- ✅ Messages d'erreur explicites

---

## 📝 Récapitulatif des Fichiers Modifiés

| Fichier | Changement | Raison |
|---------|------------|--------|
| `src/pages/PaiementsPage.jsx` | Ligne 137 : `(p.montantPaye \|\| 0)` | Protection null pour calcul total |
| `src/services/paiementService.js` | URL : `/api/paiements` | Conformité avec backend |
| `src/services/derogationService.js` | Paramètres : `accepterData`, `raisonRefus` | Conformité avec DTOs backend |
| `src/pages/DerogationsPage.jsx` | Ajout modal acceptation + validation | UX complète et conforme |

---

## 🎓 Exemples Pratiques

### Exemple 1 : Élève avec paiement partiel + dérogation valide

**Situation :**
- Michel Tshimanga doit 100 FC
- Il a payé 50 FC (reste 50 FC)
- Il a une dérogation valide jusqu'au 31/12/2025

**Résultat :** ✅ **EN ORDRE** (grâce à la dérogation)

---

### Exemple 2 : Élève avec dérogation expirée

**Situation :**
- Marie Kabila doit 100 FC
- Elle n'a rien payé
- Sa dérogation a expiré le 01/11/2025

**Résultat :** ❌ **PAS EN ORDRE** (dérogation expirée)

---

### Exemple 3 : Élève qui a tout payé

**Situation :**
- Jean Mukendi devait 100 FC
- Il a payé 100 FC (reste 0 FC)
- Aucune dérogation

**Résultat :** ✅ **EN ORDRE** (paiement complet)

---

## 🔗 Endpoints API Utilisés

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/suivis-paiement/eleve/{id}/en-ordre` | GET | Vérifier si élève en ordre |
| `/api/derogations/eleve/{id}/valide` | GET | Obtenir dérogation valide |
| `/api/derogations/eleve/{id}/a-derogation-valide` | GET | Vérifier existence dérogation |
| `/api/derogations/{id}/accepter` | PATCH | Accepter (body: DerogationAccepterDTO) |
| `/api/derogations/{id}/refuser` | PATCH | Refuser (body: DerogationRefuserDTO) |

---

## ✅ Résultat Final

✅ **Système de dérogation fonctionnel**  
✅ **Vérification d'ordre de paiement opérationnelle**  
✅ **Interface utilisateur complète avec modals**  
✅ **Validation des données avant envoi**  
✅ **Messages d'erreur explicites**  
✅ **Conformité totale avec le contrat API backend**

---

## 🚀 Pour Tester

1. **Créer une demande de dérogation** pour un élève
2. **Accepter** avec date d'expiration dans 3 mois et nom de personne
3. **Vérifier** que l'élève est maintenant en ordre (bouton "Vérifier statut global")
4. **Créer une autre demande** et la **refuser** avec une raison
5. **Vérifier l'expiration** automatique en simulant une date passée

---

## 📚 Documentation Complémentaire

- Contrat API : `demo/FRONTEND_API_CONTRACT.md`
- Harmonisation : `HARMONISATION_CONTRAT_API.md`
- Ce guide : `GUIDE_SYSTEME_DEROGATION_ORDRE_PAIEMENT.md`
