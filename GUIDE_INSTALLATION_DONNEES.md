# 🚀 Guide d'Installation et d'Importation des Données

## ⚠️ PROBLÈME ACTUEL

L'erreur que vous rencontrez :
```
ERREUR: la colonne e1_0.classe_id n'existe pas
```

Indique que la migration de la base de données n'a pas été exécutée. La colonne `classe_id` doit être créée dans la table `eleve`.

---

## 📋 ÉTAPES À SUIVRE DANS L'ORDRE

### 1️⃣ **Exécuter les Migrations SQL**

#### Option A : Via le script batch (Recommandé)

1. **Ouvrez le fichier** `demo/executer_migrations_complet.bat`
2. **Modifiez les paramètres de connexion** :
   ```batch
   set PGPASSWORD=votre_mot_de_passe
   set DB_NAME=votre_nom_base
   set DB_USER=postgres
   ```
3. **Exécutez le script** en double-cliquant dessus ou via PowerShell :
   ```powershell
   cd demo
   .\executer_migrations_complet.bat
   ```

#### Option B : Via psql manuellement

Dans PowerShell, exécutez chaque migration dans l'ordre :

```powershell
cd demo

# 1. Supprimer les anciennes données
psql -U postgres -d ecole_db -f supprimer_toutes_donnees.sql

# 2. Créer la table école
psql -U postgres -d ecole_db -f migration_ecole.sql

# 3. Ajouter les classes aux cours
psql -U postgres -d ecole_db -f migration_add_classe_to_cours.sql

# 4. Créer la relation Eleve-Classe
psql -U postgres -d ecole_db -f migration_eleve_classe_relation.sql

# 5. Créer la table conduite
psql -U postgres -d ecole_db -f migration_conduite_table.sql

# 6. Réinitialiser les séquences
psql -U postgres -d ecole_db -f reinitialiser_sequences.sql
```

---

### 2️⃣ **Redémarrer le Backend**

Après les migrations, redémarrez votre application Spring Boot :

```bash
# Si vous utilisez Maven
mvn spring-boot:run

# Ou si vous avez un JAR
java -jar votre-application.jar
```

---

### 3️⃣ **Importer les Données via l'Interface Web**

Une fois le backend démarré et les migrations appliquées :

#### **Ordre d'importation obligatoire** :

1. **École** (Page École)
   - Copiez la section `"ecole"` du fichier `donnees_completes_10_elements.json`
   - Collez dans le formulaire École

2. **Utilisateurs** (Page Utilisateurs)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"utilisateurs"` (16 éléments)
   - Collez et importez
   - ⚠️ **Notez les IDs générés** (vous en aurez besoin)

3. **Classes** (Page Classes)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"classes"` (12 éléments)
   - Collez et importez
   - ⚠️ **Notez les IDs générés**

4. **Élèves** (Page Élèves)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"eleves"` (12 éléments)
   - ⚠️ **IMPORTANT** : Ajustez les `classeId` avec les vrais IDs générés
   - Exemple : Si la classe "1ère" a l'ID 5, remplacez `"classeId": 1` par `"classeId": 5`

5. **Cours** (Page Cours)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"cours"` (12 éléments)
   - ⚠️ **Ajustez** les `classeId` et `professeurId` avec les vrais IDs

6. **Notes** (Page Notes)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"notes"` (12 éléments)
   - ⚠️ **Ajustez** les `eleveId` et `coursId`

7. **Relations Parent-Élève** (Page Parent-Élève)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"parentEleve"` (10 éléments)
   - ⚠️ **Ajustez** les `parentId` et `eleveId`

8. **Conduites** (Page Conduites)
   - Cliquez sur "📥 Importer JSON"
   - Copiez le tableau `"conduites"` (10 éléments)
   - ⚠️ **Ajustez** les `eleveId`

---

## 🔧 VÉRIFICATION

### Vérifier que les migrations ont fonctionné :

```sql
-- Vérifier la structure de la table eleve
\d eleve

-- Doit afficher :
-- classe_id    | bigint           | not null
-- ecole_id     | bigint           | not null
```

### Vérifier que les données sont importées :

```sql
SELECT COUNT(*) FROM ecole;           -- Doit retourner 1
SELECT COUNT(*) FROM utilisateur;     -- Doit retourner 16+
SELECT COUNT(*) FROM classe;          -- Doit retourner 12+
SELECT COUNT(*) FROM eleve;           -- Doit retourner 12+
SELECT COUNT(*) FROM cours;           -- Doit retourner 12+
SELECT COUNT(*) FROM note;            -- Doit retourner 12+
```

---

## 🆘 DÉPANNAGE

### Erreur : "classe_id n'existe pas"
**Solution** : Exécutez la migration `migration_eleve_classe_relation.sql`

### Erreur : "Foreign key violation"
**Solution** : Respectez l'ordre d'importation (École → Utilisateurs → Classes → Élèves...)

### Erreur : "Duplicate key"
**Solution** : Exécutez `reinitialiser_sequences.sql` puis réessayez

### Erreur 404 sur `/api/eleves`
**Solution** : 
1. Vérifiez que le backend est démarré
2. Vérifiez les logs Spring Boot
3. Assurez-vous que les migrations sont appliquées

---

## 📝 NOTES IMPORTANTES

1. **Les IDs sont auto-générés** : N'utilisez pas les IDs du fichier JSON tels quels
2. **Les relations doivent pointer vers des IDs existants** : Vérifiez dans l'interface avant d'importer
3. **Backup recommandé** : Avant les migrations, sauvegardez votre base de données
4. **Ordre d'importation strict** : Ne pas respecter l'ordre causera des erreurs

---

## ✅ CHECKLIST

- [ ] Migrations SQL exécutées
- [ ] Backend redémarré
- [ ] École créée
- [ ] Utilisateurs importés (noter les IDs)
- [ ] Classes importées (noter les IDs)
- [ ] Élèves importés (IDs ajustés)
- [ ] Cours importés (IDs ajustés)
- [ ] Notes importées (IDs ajustés)
- [ ] Relations Parent-Élève importées
- [ ] Conduites importées

---

## 🎯 RÉSULTAT ATTENDU

Après avoir suivi toutes ces étapes :
- ✅ 1 école configurée
- ✅ 16 utilisateurs (2 admins, 6 profs, 6 parents, 2 percepteurs)
- ✅ 12 classes
- ✅ 12 élèves répartis dans les classes
- ✅ 12 cours assignés aux classes et professeurs
- ✅ 12+ notes pour différentes périodes
- ✅ 10 relations parent-élève
- ✅ 10 appréciations de conduite

Vous pourrez alors générer des bulletins complets !
