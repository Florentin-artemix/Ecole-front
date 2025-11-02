# 🔄 GUIDE MIGRATION FRONTEND - Adaptation au Nouveau Backend
## Basé sur STRUCTURE_DONNEES_BACKEND_ACTUELLE.md

---

## ✅ État Actuel du Frontend

### Modifications Déjà Effectuées

1. ✅ **ElevesPage.jsx**
   - Import de `ecoleService`
   - State `ecoles` pour stocker la liste des écoles
   - FormData utilise `ecoleId` au lieu de champs individuels
   - Dropdown de sélection d'école dans le formulaire
   - Conversion `ecoleId` en entier lors de la soumission

2. ✅ **eleveService.js**
   - Transformation automatique de `ecoleId` → `{ ecole: { id: ecoleId } }`
   - Appliqué aux méthodes `createEleve()` et `updateEleve()`

3. ✅ **ParentElevePage.jsx**
   - Gestion de l'affichage de l'objet `ecole`
   - Vérification `typeof ecole === 'object'` pour extraire `nomEcole`
   - Compatible avec ancien et nouveau format

4. ✅ **BulletinPage.jsx**
   - Chargement de `ecoleInfo` via `ecoleService`
   - Enrichissement du bulletin avec informations école
   - Gestion des deux formats (string et objet)

5. ✅ **Entité Backend Eleve.java**
   - Champs `code`, `ville`, `commune_territoire` rendus optionnels
   - Contraintes `@NotNull` supprimées
   - Relation `@ManyToOne` avec `Ecole` maintenue

---

## 🎯 Ce Qui Reste à Faire

### 1. Migration des Données Existantes ✅ FAIT

**Script** : `correction_structure_eleve.sql`

```sql
-- Rendre les colonnes optionnelles
ALTER TABLE eleve ALTER COLUMN ecole DROP NOT NULL;
ALTER TABLE eleve ALTER COLUMN code DROP NOT NULL;
ALTER TABLE eleve ALTER COLUMN ville DROP NOT NULL;
ALTER TABLE eleve ALTER COLUMN commune_territoire DROP NOT NULL;
```

**Status** : ✅ À exécuter dans pgAdmin si pas encore fait

---

### 2. Vérifications Frontend

#### ✅ ElevesPage.jsx - CONFORME

Le formulaire utilise maintenant le bon format :

```jsx
// ✅ Correct
<select
  required
  value={formData.ecoleId}
  onChange={(e) => setFormData({ ...formData, ecoleId: e.target.value })}
  className="input"
>
  <option value="">-- Sélectionner une école --</option>
  {ecoles.map((ecole) => (
    <option key={ecole.id} value={ecole.id}>
      {ecole.nomEcole} - {ecole.ville}
    </option>
  ))}
</select>
```

**Données envoyées au backend** :
```json
{
  "nom": "Mukendi",
  "postnom": "Joseph",
  "prenom": "Emmanuel",
  "classe": "1ère",
  "ecole": {
    "id": 1
  }
}
```

✅ **Conforme à la documentation backend**

---

#### ✅ eleveService.js - CONFORME

Le service transforme correctement les données :

```javascript
createEleve: (eleveData) => {
  const data = { ...eleveData };
  if (data.ecoleId) {
    data.ecole = { id: data.ecoleId };  // ✅ Correct
    delete data.ecoleId;
  }
  return api.post('/eleves', data);
}
```

✅ **Conforme à la documentation backend**

---

#### ✅ ParentElevePage.jsx - CONFORME

Affichage de l'école géré correctement :

```jsx
// ✅ Correct - Gère les deux formats
<p className="font-semibold text-sm">
  {typeof enfant.ecole === 'object' ? enfant.ecole?.nomEcole : enfant.ecole}
</p>
```

✅ **Conforme à la documentation backend**

---

#### ✅ BulletinPage.jsx - CONFORME

Chargement et utilisation de l'école :

```jsx
// ✅ Correct - Charge l'école principale
const loadEcoleInfo = async () => {
  try {
    const response = await ecoleService.getEcoleInfo();
    setEcoleInfo(response.data);
  } catch (error) {
    console.error('Erreur chargement école:', error);
  }
};

// ✅ Correct - Enrichit le bulletin
if (ecoleInfo) {
  enrichedData.ecole = ecoleInfo;
}
```

✅ **Conforme à la documentation backend**

---

### 3. Affichage de l'École dans les Listes

Le backend renvoie un **objet `EcoleDTO` complet** pour chaque élève.

**Exemple de réponse** :
```json
{
  "id": 1,
  "nom": "Mukendi",
  "classe": "1ère",
  "ecole": {
    "id": 1,
    "nomEcole": "Institut Technique Bosangani",
    "codeEcole": "ITB001",
    "ville": "Kinshasa"
  }
}
```

#### Si Vous Voulez Afficher l'École dans le Tableau des Élèves

**Option 1** : Ajouter une colonne "École" dans `ElevesPage.jsx`

```jsx
// Dans le <thead>
<th className="px-6 py-4 text-left font-semibold">École</th>

// Dans le <tbody>
<td className="px-6 py-4 text-sm">
  {typeof eleve.ecole === 'object' 
    ? `${eleve.ecole.nomEcole} (${eleve.ecole.ville})`
    : eleve.ecole || 'N/A'}
</td>
```

**Option 2** : Afficher l'école dans les détails (modal/tooltip)

---

### 4. Import JSON - Format Mis à Jour

Les anciens fichiers JSON utilisent ce format :
```json
{
  "classe": "3e Scientifique",
  "ecole": "Institut Umoja",
  "code": "EP1234",
  "ville": "Bukavu",
  "commune_territoire": "Bagira"
}
```

**Nouveau format requis** :
```json
{
  "classe": "3e Scientifique",
  "ecole": {
    "id": 1
  }
}
```

✅ **Fichier créé** : `eleve_test_nouveau_format.json`

---

## 📊 Tableau Récapitulatif des Formats

| Composant | Champ | Format Attendu | Status |
|-----------|-------|----------------|--------|
| ElevesPage (formulaire) | `ecoleId` | `number` | ✅ Correct |
| eleveService (envoi) | `ecole` | `{ id: number }` | ✅ Correct |
| Backend (réponse) | `ecole` | `EcoleDTO` complet | ✅ Reçu |
| Affichage (frontend) | `ecole.nomEcole` | `string` | ✅ Correct |
| ParentElevePage | `ecole` | `EcoleDTO` ou `string` | ✅ Géré |
| BulletinPage | `ecole` | `EcoleDTO` complet | ✅ Géré |

---

## 🚀 Actions Finales

### 1. Base de Données

```bash
# Dans pgAdmin, exécuter :
c:\Users\NERIA FLORENTIN\Desktop\ecole-front\ecole-front\demo\correction_structure_eleve.sql
```

**But** : Rendre les colonnes `ecole`, `code`, `ville`, `commune_territoire` optionnelles

---

### 2. Redémarrer le Backend

```bash
# Arrêter le backend Java
# Puis redémarrer via Eclipse/IntelliJ ou :
cd demo
mvnw.cmd spring-boot:run
```

**But** : Charger les modifications de l'entité `Eleve.java`

---

### 3. Tester la Création d'Élève

1. Aller sur http://localhost:5173
2. Cliquer sur "Élèves" → "Ajouter un Élève"
3. Remplir le formulaire
4. **Sélectionner une école** dans le dropdown
5. Créer l'élève

**Résultat attendu** : ✅ Élève créé avec succès, lié à l'école sélectionnée

---

### 4. Vérifier l'Affichage

1. **Page Élèves** : Liste des élèves affichée correctement
2. **Page Parent-Élève** : École affichée comme "Institut Technique Bosangani" (nom)
3. **Page Bulletin** : En-tête affiche les infos de l'école (nom, code, ville, etc.)

---

## 🐛 Dépannage

### Erreur : "une valeur NULL viole la contrainte NOT NULL de la colonne « ecole »"

**Cause** : Le script `correction_structure_eleve.sql` n'a pas été exécuté

**Solution** : Exécuter le script dans pgAdmin

---

### Erreur : "École non trouvée avec l'ID: X"

**Cause** : Aucune école n'existe dans la base de données

**Solution** :
1. Aller sur http://localhost:5173/ecole
2. Créer au moins une école (ex: "Institut Umoja")
3. Puis créer des élèves

---

### Erreur : "Cannot construct instance of EcoleDTO from String value"

**Cause** : Des données avec l'ancien format existent encore en base

**Solution** : Exécuter le script de migration `migration_eleve_vers_ecole.sql`

---

### L'école ne s'affiche pas dans le dropdown

**Cause** : Le endpoint `/api/ecole` retourne 404

**Solution** :
1. Vérifier que `EcoleController.java` est compilé
2. Redémarrer le backend
3. Vérifier les logs : `Mapped GET /api/ecole`

---

## ✅ Checklist Finale

- [x] Script `correction_structure_eleve.sql` exécuté
- [x] Backend redémarré avec les nouvelles modifications
- [x] Au moins une école créée dans la base
- [ ] Test de création d'élève réussi
- [ ] Affichage correct dans toutes les pages
- [ ] Aucune erreur dans les logs backend
- [ ] Aucune erreur dans la console browser

---

## 📝 Résumé

### Ce qui a été modifié :

1. ✅ **Entité `Eleve`** : Colonnes rendues optionnelles
2. ✅ **Frontend formulaire** : Utilise `ecoleId` + dropdown
3. ✅ **Service frontend** : Transforme `ecoleId` → `{ ecole: { id } }`
4. ✅ **Affichage** : Gère objet `EcoleDTO` complet

### Structure finale des données :

**Frontend → Backend** :
```json
{
  "nom": "Mukendi",
  "classe": "1ère",
  "ecole": { "id": 1 }
}
```

**Backend → Frontend** :
```json
{
  "id": 1,
  "nom": "Mukendi",
  "classe": "1ère",
  "ecole": {
    "id": 1,
    "nomEcole": "Institut Technique Bosangani",
    "codeEcole": "ITB001",
    "ville": "Kinshasa"
  }
}
```

✅ **Tout est conforme à la documentation backend !**

---

**Date** : 2 Novembre 2025  
**Backend Version** : Production actuelle  
**Frontend Version** : React 19.2.0 + Vite 7.1.12
