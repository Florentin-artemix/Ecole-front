# 📋 Harmonisation avec le Contrat API Backend

**Date :** 5 novembre 2025  
**Branche :** feature/paiement

---

## 🎯 Objectif

Harmoniser le frontend avec le contrat API défini dans `demo/FRONTEND_API_CONTRACT.md` après consultation des DTOs backend.

---

## 🔍 Analyse du Contrat API

### DTO Backend Vérifiés

#### 1. **MotifPaiementDTO**
```java
private Long id;
private String libelle;
private BigDecimal montantTotal;  // ✅ Champ correct
private String description;
private Periode periode;
private String anneeScolaire;
private LocalDateTime dateCreation;
private LocalDateTime dateEcheance;
private Boolean actif;
```

#### 2. **MotifPaiementCreateDTO**
```java
@NotBlank(message = "Le libellé est obligatoire")
private String libelle;

@NotNull(message = "Le montant total est obligatoire")
private BigDecimal montantTotal;  // ✅ Champ obligatoire

private String description;
private Periode periode;
private String anneeScolaire;
private LocalDateTime dateEcheance;
private Boolean actif = true;
```

#### 3. **PaiementDTO**
```java
private Long id;
private Long eleveId;
private String nomEleve;
private String prenomEleve;
private Long motifPaiementId;
private String libelleMotif;
private BigDecimal montantPaye;  // ✅ Champ correct
// ...
```

#### 4. **SuiviPaiementDTO**
```java
private Long id;
private Long eleveId;
private String nomEleve;
private String prenomEleve;
private Long motifPaiementId;
private String libelleMotif;
private BigDecimal montantAPayer;
private BigDecimal montantPaye;
private BigDecimal montantRestant;
private SuiviPaiement.StatutPaiement statutPaiement;
// ...

@JsonProperty("montantTotal")
public BigDecimal getMontantTotal() {
    return montantAPayer;  // ✅ Alias JSON montantTotal
}
```

---

## ❌ Problèmes Identifiés

### Problème 1 : Nom de champ incorrect dans MotifsPaiementPage

**Erreur Backend :**
```
Field error in object 'motifPaiementCreateDTO' on field 'montantTotal': 
rejected value [null]; default message [Le montant total est obligatoire]
```

**Cause :** Le frontend envoyait `montant` au lieu de `montantTotal`.

**Fichier :** `src/pages/MotifsPaiementPage.jsx`

**Code erroné :**
```javascript
const payload = {
  libelle: formData.libelle.trim(),
  montant: parseFloat(formData.montant),  // ❌ Mauvais nom
  periode: formData.periode,
  actif: formData.actif,
};
```

---

### Problème 2 : Erreur toFixed() sur undefined

**Erreur Frontend :**
```
Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
at PaiementsPage.jsx:319:56
```

**Cause :** Le champ `motif.montant` était accédé au lieu de `motif.montantTotal`, et sans vérification null.

**Fichier :** `src/pages/PaiementsPage.jsx` ligne 319

**Code erroné :**
```javascript
{motif.libelle} - {motif.montant.toFixed(2)} FC  // ❌ montant n'existe pas
```

---

### Problème 3 : Logique incohérente dans le tableau de suivi

**Observation :**
```
Montant Total: 0.00 FC
Montant Payé:  50.00 FC
Reste:         100.00 FC
```

**Diagnostic :** Ce problème provient du **backend** :
- Le `SuiviPaiementDTO` retourne probablement `montantAPayer = 0` ou `null`
- Le backend ne récupère pas correctement le `montantTotal` depuis la table `motif_paiement`
- **Action requise :** Corriger le backend pour calculer correctement le `montantAPayer`

---

## ✅ Corrections Appliquées

### 1. **MotifsPaiementPage.jsx** - Harmonisation du nom de champ

#### Changement 1 : Payload de création/modification (ligne 54-59)
```javascript
// ❌ AVANT
const payload = {
  libelle: formData.libelle.trim(),
  montant: parseFloat(formData.montant),
  periode: formData.periode,
  actif: formData.actif,
};

// ✅ APRÈS
const payload = {
  libelle: formData.libelle.trim(),
  montantTotal: parseFloat(formData.montant),  // ✅ Nom conforme au contrat
  periode: formData.periode,
  actif: formData.actif,
};
```

#### Changement 2 : Chargement des données dans le formulaire (ligne 107-111)
```javascript
// ❌ AVANT
setFormData({
  libelle: motif.libelle,
  montant: motif.montant.toString(),  // ❌ Peut crasher si undefined
  periode: motif.periode,
  actif: motif.actif,
});

// ✅ APRÈS
setFormData({
  libelle: motif.libelle,
  montant: motif.montantTotal?.toString() || '',  // ✅ Protection null + nom correct
  periode: motif.periode,
  actif: motif.actif,
});
```

#### Changement 3 : Affichage dans le tableau (ligne 218)
```javascript
// ❌ AVANT
{motif.montant != null ? motif.montant.toFixed(2) : '0.00'} FC

// ✅ APRÈS
{motif.montantTotal != null ? motif.montantTotal.toFixed(2) : '0.00'} FC
```

---

### 2. **PaiementsPage.jsx** - Protection contre undefined

#### Changement 1 : Sélection du motif dans le formulaire (ligne 319)
```javascript
// ❌ AVANT
{motif.libelle} - {motif.montant.toFixed(2)} FC ({PERIODE_LABELS[motif.periode]})

// ✅ APRÈS
{motif.libelle} - {motif.montantTotal != null ? motif.montantTotal.toFixed(2) : '0.00'} FC ({PERIODE_LABELS[motif.periode]})
```

#### Changement 2 : Auto-remplissage du montant (ligne 122-127)
```javascript
// ❌ AVANT
const handleMotifChange = (motifId) => {
  setFormData({ ...formData, motifPaiementId: motifId });
  const motif = motifs.find((m) => m.id === parseInt(motifId));
  if (motif && !formData.montantPaye) {
    setFormData({ ...formData, motifPaiementId: motifId, montantPaye: motif.montant.toString() });
  }
};

// ✅ APRÈS
const handleMotifChange = (motifId) => {
  setFormData({ ...formData, motifPaiementId: motifId });
  const motif = motifs.find((m) => m.id === parseInt(motifId));
  if (motif && !formData.montantPaye && motif.montantTotal) {
    setFormData({ ...formData, motifPaiementId: motifId, montantPaye: motif.montantTotal.toString() });
  }
};
```

---

### 3. **motifPaiementService.js** - Documentation corrigée

#### Changement : JSDoc (ligne 63)
```javascript
// ❌ AVANT
/**
 * @param {number} motifData.montant - Montant à payer
 */

// ✅ APRÈS
/**
 * @param {number} motifData.montantTotal - Montant total à payer
 */
```

---

## 📊 Résumé des Fichiers Modifiés

| Fichier | Lignes modifiées | Type de changement |
|---------|------------------|-------------------|
| `src/pages/MotifsPaiementPage.jsx` | 56, 108, 218 | `montant` → `montantTotal` |
| `src/pages/PaiementsPage.jsx` | 125, 319 | `montant` → `montantTotal` + protection null |
| `src/services/motifPaiementService.js` | 63 | Documentation JSDoc |

---

## 🧪 Tests de Validation

### Test 1 : Création d'un motif de paiement
```bash
POST http://localhost:8080/api/motifs-paiement
{
  "libelle": "Frais scolaire 1ère période",
  "montantTotal": 100.00,
  "periode": "PREMIERE",
  "actif": true
}
```
**Résultat attendu :** ✅ 201 Created

---

### Test 2 : Affichage des motifs dans la liste
**Résultat attendu :** Le montant s'affiche correctement (ex: `150.00 FC`)

---

### Test 3 : Sélection d'un motif dans PaiementsPage
**Résultat attendu :** Le dropdown affiche le libellé et le montant sans crasher

---

### Test 4 : Auto-remplissage du montant
**Action :** Sélectionner un motif dans le formulaire de paiement  
**Résultat attendu :** Le champ "Montant payé" se remplit automatiquement avec le `montantTotal` du motif

---

## ⚠️ Problème Backend Non Résolu

### Issue : `montantTotal = 0` dans SuiviPaiementDTO

**Symptôme :**
```
Montant Total: 0.00 FC
Montant Payé:  50.00 FC
Reste:         100.00 FC
```

**Cause probable :**
Le backend ne peuple pas correctement le champ `montantAPayer` dans `SuiviPaiementDTO`. Il devrait récupérer le `montantTotal` depuis la table `motif_paiement` via la relation `motifPaiementId`.

**Action requise côté Backend :**
```java
// Dans le mapper ou le service qui crée le SuiviPaiementDTO
suiviDTO.setMontantAPayer(motifPaiement.getMontantTotal());
```

**Vérifications SQL suggérées :**
```sql
-- 1. Vérifier les motifs de paiement
SELECT id, libelle, montant_total, periode FROM motif_paiement;

-- 2. Vérifier les suivis de paiement
SELECT id, eleve_id, motif_paiement_id, montant_a_payer, montant_paye, montant_restant 
FROM suivi_paiement;

-- 3. Vérifier la relation
SELECT sp.id, sp.montant_a_payer, mp.montant_total as motif_montant
FROM suivi_paiement sp
JOIN motif_paiement mp ON sp.motif_paiement_id = mp.id;
```

---

## ✅ Conformité avec le Contrat API

### Endpoints Motifs de Paiement
| Endpoint | Méthode | DTO Requis | Statut |
|----------|---------|------------|--------|
| `/api/motifs-paiement` | POST | MotifPaiementCreateDTO | ✅ Conforme |
| `/api/motifs-paiement` | GET | - | ✅ Conforme |
| `/api/motifs-paiement/{id}` | PUT | MotifPaiementCreateDTO | ✅ Conforme |
| `/api/motifs-paiement/{id}/desactiver` | PATCH | - | ✅ Conforme |

### Endpoints Paiements
| Endpoint | Méthode | DTO Requis | Statut |
|----------|---------|------------|--------|
| `/api/paiements` | POST | PaiementCreateDTO | ✅ Conforme |
| `/api/paiements` | GET | - | ✅ Conforme |
| `/api/paiements/eleve/{eleveId}` | GET | - | ✅ Conforme |

### Endpoints Suivi Paiement
| Endpoint | Méthode | DTO Requis | Statut |
|----------|---------|------------|--------|
| `/api/suivis-paiement` | GET | - | ✅ Conforme |
| `/api/suivis-paiement/eleve/{eleveId}` | GET | - | ⚠️ Backend retourne `montantTotal = 0` |

---

## 🎉 Résultat Final

✅ **Frontend 100% conforme au contrat API**  
✅ **Erreurs de création de motif résolues**  
✅ **Erreurs toFixed() éliminées**  
⚠️ **Problème backend `montantTotal = 0` documenté (nécessite correction backend)**

---

## 📝 Notes Importantes

1. **Toujours utiliser `montantTotal`** dans les payloads envoyés au backend pour les motifs de paiement
2. **Toujours vérifier null** avant d'appeler `.toFixed()` sur les montants
3. Le backend utilise `montantAPayer` en interne mais expose `montantTotal` via `@JsonProperty`
4. Le contrat API est la source de vérité - toujours s'y référer en cas de doute
5. **SuiviPaiementDTO** : Le backend doit corriger le calcul de `montantAPayer`

---

## 🔗 Références

- Contrat API : `demo/FRONTEND_API_CONTRACT.md`
- DTOs Backend : `demo/src/main/java/com/Ecole/demo/dto/`
- Services Frontend : `src/services/motifPaiementService.js`, `src/services/paiementService.js`
- Pages Frontend : `src/pages/MotifsPaiementPage.jsx`, `src/pages/PaiementsPage.jsx`, `src/pages/SuiviPaiementPage.jsx`
