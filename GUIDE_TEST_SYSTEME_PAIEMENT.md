# 🚀 Guide de Test Rapide - Système de Paiement

## Étape 1: Démarrage

### Backend
```bash
cd demo
mvnw.cmd spring-boot:run
```
✅ API disponible sur http://localhost:8080

### Frontend
```bash
npm run dev
```
✅ Application disponible sur http://localhost:5173

---

## Étape 2: Navigation

Ouvrez le frontend et regardez le **Sidebar** à gauche.

Vous verrez une nouvelle section:
```
━━━━━━━━━━━━━━━━━━━━━
SYSTÈME DE PAIEMENT
━━━━━━━━━━━━━━━━━━━━━
🏷️ Motifs de Paiement
💵 Paiements
📊 Suivi Paiement
✅ Dérogations
```

---

## Étape 3: Créer des Motifs de Paiement

1. Cliquez sur **"Motifs de Paiement"**
2. Cliquez sur **"Nouveau Motif"**
3. Créez ces motifs:

### Motif 1: Frais 1ère période
- **Libellé**: Frais 1ère période
- **Montant**: 50000
- **Période**: 1ère période
- **Actif**: ✅ Oui

### Motif 2: Frais 2e période
- **Libellé**: Frais 2e période
- **Montant**: 50000
- **Période**: 2e période
- **Actif**: ✅ Oui

### Motif 3: Minerval annuel
- **Libellé**: Minerval annuel
- **Montant**: 100000
- **Période**: 1ère période
- **Actif**: ✅ Oui

✅ Vous devriez avoir **3 motifs** dans le tableau

---

## Étape 4: Générer les Suivis

1. Cliquez sur **"Suivi Paiement"**
2. En haut à droite, utilisez le dropdown **"Créer suivi pour tous les élèves..."**
3. Sélectionnez **"Frais 1ère période"**
4. Confirmez

✅ Un suivi est créé pour **chaque élève** avec statut **"Non payé"** (rouge)

### Que voir sur cette page?
- 📊 **4 cartes statistiques** en haut:
  - Total des suivis
  - Nombre payé complet (vert)
  - Nombre paiement partiel (jaune)
  - Nombre non payé (rouge)

- 📋 **Tableau des suivis** avec:
  - Élève + Classe
  - Motif
  - Période
  - Montant total
  - Montant payé
  - Montant restant
  - Statut (badge coloré)

---

## Étape 5: Enregistrer des Paiements

1. Cliquez sur **"Paiements"**
2. Cliquez sur **"Nouveau Paiement"**
3. Enregistrez un paiement:

### Exemple de paiement
- **Élève**: Sélectionnez un élève (ex: Jean MUKOKO - 6ème A)
- **Motif**: Frais 1ère période
- **Montant payé**: 50000 (ou moins pour paiement partiel)
- **Date**: 2025-11-05
- **Remarque**: Premier versement

4. Cliquez **"Enregistrer"**

✅ Le paiement apparaît dans le tableau

### Que voir sur cette page?
- 💰 **Carte statistique** en haut à droite:
  - Total des paiements en FC
  - Nombre de paiements

- 📋 **Tableau des paiements** avec:
  - Élève + Classe
  - Motif
  - Période
  - Montant (en vert)
  - Date
  - Remarque

---

## Étape 6: Vérifier le Suivi

1. Retournez sur **"Suivi Paiement"**
2. Observez les changements:

### Si paiement complet (50000 FC)
- Statut: **"Payé complet"** (badge vert ✅)
- Montant payé: 50000.00 FC
- Montant restant: 0.00 FC
- Carte "Payé complet" incrémentée

### Si paiement partiel (ex: 25000 FC)
- Statut: **"Paiement partiel"** (badge jaune ⚠️)
- Montant payé: 25000.00 FC
- Montant restant: 25000.00 FC
- Carte "Paiement partiel" incrémentée

### Vérifier si élève en ordre
Cliquez sur **"Vérifier statut global"** pour un élève
→ Message indique si en ordre ou non

---

## Étape 7: Créer une Dérogation

1. Cliquez sur **"Dérogations"**
2. Cliquez sur **"Nouvelle Demande"**
3. Créez une dérogation:

### Exemple de dérogation
- **Élève**: Sélectionnez un élève (ex: Marie KALALA - 5ème B)
- **Motif**: Difficultés financières temporaires
- **Date de début**: 2025-11-05
- **Date de fin**: 2025-12-31

4. Cliquez **"Créer la demande"**

✅ La dérogation apparaît avec statut **"En attente"** (badge jaune)

### Que voir sur cette page?
- 📊 **5 cartes statistiques**:
  - Total
  - En attente (jaune)
  - Acceptées (vert)
  - Refusées (rouge)
  - Expirées (gris)

---

## Étape 8: Accepter/Refuser une Dérogation

### Pour Accepter
1. Sur la ligne de la dérogation, cliquez sur **l'icône ✅ verte**
2. Confirmez
✅ Statut passe à **"Acceptée"** (badge vert)

### Pour Refuser
1. Sur une autre dérogation, cliquez sur **l'icône ❌ rouge**
2. Tapez un motif de refus (optionnel): "Documents incomplets"
3. Confirmez
✅ Statut passe à **"Refusée"** (badge rouge)
✅ Motif du refus apparaît dans la colonne

### Vérifier dérogation valide
Cliquez sur **"Vérifier dérogation valide"** pour un élève
→ Message indique si l'élève a une dérogation valide

---

## Étape 9: Vérifier les Expirations

1. Sur la page **"Dérogations"**
2. Cliquez sur **"Vérifier Expirations"** en haut
3. Le système vérifie toutes les dérogations
4. Celles dont la date de fin est dépassée → **"Expirée"** (badge gris)

---

## Étape 10: Tester les Filtres

### Sur Motifs de Paiement
- Filtrer par **période**: PREMIERE, DEUXIEME, etc.
- Filtrer par **statut**: Actifs, Inactifs

### Sur Paiements
- Filtrer par **élève**: Voir tous les paiements d'un élève

### Sur Suivi Paiement
- Filtrer par **élève**: Suivis d'un élève
- Filtrer par **motif**: Suivis d'un motif spécifique
- Filtrer par **statut**: NON_PAYE, PAIEMENT_PARTIEL, PAYE_COMPLET

### Sur Dérogations
- Filtrer par **élève**: Dérogations d'un élève
- Filtrer par **statut**: EN_ATTENTE, ACCEPTEE, REFUSEE, EXPIREE

---

## 🎯 Scénarios de Test Complets

### Scénario 1: Élève paie en plusieurs fois
1. Créer motif "Frais examen" - 30000 FC
2. Générer suivi pour tous les élèves
3. Élève paie 10000 FC → Statut "Paiement partiel"
4. Élève paie 10000 FC → Statut "Paiement partiel"
5. Élève paie 10000 FC → Statut "Payé complet"

### Scénario 2: Élève avec dérogation
1. Élève n'a pas payé → Statut "Non payé"
2. Créer dérogation pour cet élève (3 mois)
3. Accepter la dérogation
4. Vérifier statut: élève considéré en ordre grâce à dérogation
5. Après 3 mois, cliquer "Vérifier Expirations"
6. Dérogation passe à "Expirée"

### Scénario 3: Désactiver un motif
1. Créer motif "Frais anciens" - 5000 FC
2. Générer suivis
3. Se rendre compte que le motif est obsolète
4. Cliquer sur "Désactiver" (icône ❌ jaune)
5. Motif passe à "Inactif" (badge gris)
6. N'apparaît plus dans les sélections des formulaires

---

## ✅ Checklist de Test

### Motifs de Paiement
- [ ] Créer un motif
- [ ] Modifier un motif
- [ ] Désactiver un motif
- [ ] Supprimer un motif
- [ ] Filtrer par période
- [ ] Filtrer par statut

### Paiements
- [ ] Enregistrer un paiement complet
- [ ] Enregistrer un paiement partiel
- [ ] Voir le total mis à jour
- [ ] Filtrer par élève
- [ ] Supprimer un paiement

### Suivi Paiement
- [ ] Générer suivi pour tous les élèves
- [ ] Voir statistiques mises à jour
- [ ] Vérifier si élève en ordre
- [ ] Filtrer par élève
- [ ] Filtrer par motif
- [ ] Filtrer par statut
- [ ] Supprimer un suivi

### Dérogations
- [ ] Créer une demande
- [ ] Accepter une dérogation
- [ ] Refuser une dérogation (avec motif)
- [ ] Vérifier expirations
- [ ] Vérifier dérogation valide d'un élève
- [ ] Filtrer par élève
- [ ] Filtrer par statut
- [ ] Supprimer une dérogation

---

## 🐛 En cas d'erreur

### Erreur 404 sur API
- ✅ Vérifier que le backend tourne sur port 8080
- ✅ Vérifier les endpoints dans le navigateur: http://localhost:8080/api/motifs-paiement

### Erreur CORS
- ✅ Vérifier configuration CORS dans backend (doit autoriser http://localhost:5173)

### Tableau vide
- ✅ Vérifier console navigateur (F12)
- ✅ Vérifier que des données existent dans la base

### Calculs incorrects
- ✅ Le backend calcule automatiquement montantPaye, montantRestant, statutPaiement
- ✅ Rafraîchir la page après un paiement

---

## 📱 Interface Mobile

Le système est responsive:
- Grilles s'adaptent automatiquement
- Tableaux avec scroll horizontal sur mobile
- Modals centrés et adaptés

Testez en réduisant la fenêtre du navigateur !

---

## 🎉 Félicitations !

Vous avez testé avec succès le **Système de Paiement** complet ! 

Le système permet de:
- ✅ Définir des motifs de paiement par période
- ✅ Suivre les paiements de chaque élève
- ✅ Identifier qui est en ordre ou non
- ✅ Gérer des dérogations temporaires
- ✅ Avoir une vue d'ensemble avec statistiques

---

**Bon testing ! 🚀**
