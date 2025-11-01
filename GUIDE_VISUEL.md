# 🎨 Guide Visuel de l'Application

## 📸 Captures d'Écran Attendues

### 1. Dashboard
**URL:** `http://localhost:5173/`

**Description:**
- 4 cartes de statistiques colorées (Élèves, Cours, Notes, Utilisateurs)
- Section "Performance Globale" avec taux de réussite et moyenne
- Section "Activité Récente" avec chronologie

**Couleurs:**
- Carte Élèves : Bleu
- Carte Cours : Vert
- Carte Notes : Violet
- Carte Utilisateurs : Orange

---

### 2. Gestion des Élèves
**URL:** `http://localhost:5173/eleves`

**Description:**
- Tableau avec colonnes : Nom, Sexe, Date naissance, Lieu, N° Permanent, Classe, Actions
- Bouton "Ajouter un Élève" en haut à droite
- Actions : Modifier (icône crayon bleu), Supprimer (icône poubelle rouge)
- Modal pour créer/modifier avec formulaire en 2 colonnes

---

### 3. Gestion des Cours
**URL:** `http://localhost:5173/cours`

**Description:**
- Grille de cartes (3 colonnes sur grand écran)
- Chaque carte affiche : Nom du cours, Pondération, Nom du professeur
- Boutons "Modifier" et "Supprimer" en bas de chaque carte

---

### 4. Gestion des Notes
**URL:** `http://localhost:5173/notes`

**Description:**
- Tableau avec : Élève, Cours, Note (colorée), Pondération, Période, Actions
- Notes ≥10 en vert, <10 en rouge
- Badges bleus pour les périodes

---

### 5. Bulletins 🌟
**URL:** `http://localhost:5173/bulletins`

**Structure du Bulletin:**

#### A. Formulaire de Recherche
- 2 selects : Élève, Période
- Bouton "Afficher le Bulletin"

#### B. En-tête du Bulletin (fond bleu dégradé, texte blanc)
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo IU]                    BULLETIN                    Bukavu │
│  Institut Umoja          1ère période                     Bagira │
│  Code: EP1234           Année 2024-2025                          │
└─────────────────────────────────────────────────────────────────┘
```

#### C. Identité de l'Élève (fond gris clair)
```
┌─────────────────────────────────────────────────────────────────┐
│  🔹 Identité de l'Élève                                          │
│  ┌────────────────┬───────┬──────────────┬──────────────┐       │
│  │ Nom Complet    │ Sexe  │ Date Naiss.  │ Lieu Naiss. │       │
│  │ Kabongo F.Jean │ M     │ 12/04/2008   │ Bukavu      │       │
│  └────────────────┴───────┴──────────────┴──────────────┘       │
│  ┌────────────┬─────────────┬─────────┬──────────┐             │
│  │ N° Perm.   │ Classe      │ Place   │ Conduite │             │
│  │ 12345      │ 3e Scient.  │ 25/26   │ [Bon]    │             │
│  └────────────┴─────────────┴─────────┴──────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

#### D. Tableau des Notes (fond blanc)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔹 Résultats Scolaires                                                  │
│                                                                          │
│  ┌────┬─────────────┬────────────┬─────────┬──────────┬──────────┐    │
│  │ N° │ Branche     │ Pondérat.  │ Note/20 │ Total Pts│ Max Poss.│    │
│  ├────┼─────────────┼────────────┼─────────┼──────────┼──────────┤    │
│  │ 1  │ Mathématiqu.│     5      │  15.5   │   77.5   │   100    │    │
│  │ 2  │ Français    │     4      │  14.0   │   56.0   │    80    │    │
│  │ 3  │ Anglais     │     3      │  12.5   │   37.5   │    60    │    │
│  ├────┴─────────────┴────────────┴─────────┼──────────┼──────────┤    │
│  │              TOTAL GÉNÉRAL               │  171.0   │   240    │    │
│  └──────────────────────────────────────────┴──────────┴──────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

#### E. Résultats (3 cartes)
```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Pourcentage   │  │    Mention     │  │   Classement   │
│                │  │                │  │                │
│    71.25%      │  │   [Bien]       │  │     25/26      │
│                │  │                │  │   de la classe │
└────────────────┘  └────────────────┘  └────────────────┘
```

#### F. Pied de Page (fond gris foncé, texte blanc)
```
┌─────────────────────────────────────────────────────────────────┐
│  Signature Titulaire    Signature Directeur    Signature Parent │
│  ________________        ________________        ________________│
│                                                                  │
│  Institut Umoja - Bukavu, Bagira                                │
│  Document officiel - Toute falsification est passible de...     │
└─────────────────────────────────────────────────────────────────┘
```

#### G. Bouton d'Impression
- En haut à droite avant le bulletin
- Texte : "Imprimer le Bulletin"
- Icône d'imprimante
- Couleur : Bleu
- Disparaît lors de l'impression

---

### 6. Gestion des Utilisateurs
**URL:** `http://localhost:5173/utilisateurs`

**Description:**
- Grille de cartes utilisateurs
- Badges colorés par rôle :
  - Admin : Rouge
  - Professeur : Bleu
  - Parent : Vert
  - Percepteur : Jaune
- Informations : Email, Téléphone, Statut (Actif/Inactif)

---

## 🎨 Palette de Couleurs Utilisée

### Couleurs Principales
- **Bleu** : `#3B82F6` (primary, élèves, professeurs)
- **Vert** : `#10B981` (cours, parents, succès)
- **Violet** : `#8B5CF6` (notes, statistiques)
- **Orange** : `#F59E0B` (utilisateurs, alertes)
- **Rouge** : `#EF4444` (admin, erreurs, notes <10)

### Couleurs Secondaires
- **Gris foncé** : `#1F2937` (menu, en-têtes tableaux)
- **Gris clair** : `#F3F4F6` (fond alternatif)
- **Blanc** : `#FFFFFF` (cartes, fond principal)

### Dégradés
- **En-tête bulletin** : `from-blue-900 to-blue-700`
- **Pied bulletin** : `bg-gray-800`

---

## 🖼️ Éléments Visuels

### Icônes (Heroicons)
- **Dashboard** : HomeIcon
- **Élèves** : UserGroupIcon
- **Cours** : AcademicCapIcon
- **Notes** : DocumentTextIcon
- **Bulletins** : ClipboardDocumentCheckIcon
- **Utilisateurs** : UsersIcon
- **Imprimer** : PrinterIcon
- **Modifier** : PencilIcon
- **Supprimer** : TrashIcon
- **Fermer** : XMarkIcon

### Badges
- **Rôles** : Arrondis, couleurs spécifiques
- **Notes** : Fond coloré selon valeur
- **Périodes** : Bleu clair
- **Classes** : Bleu
- **Mentions** : Couleurs adaptées

### Animations
- **Hover** : Transition douce sur tous les boutons/cartes
- **Loading** : Spinner rotatif
- **Modals** : Apparition avec transition

---

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar fixe à gauche (256px)
- Grilles en 3-4 colonnes
- Tableaux complets

### Tablet (768px - 1023px)
- Grilles en 2 colonnes
- Sidebar pliable
- Tableaux avec scroll horizontal

### Mobile (<768px)
- Grilles en 1 colonne
- Menu hamburger
- Formulaires empilés

---

## 🖨️ Mode Impression (Bulletin)

### Changements lors de l'impression
- ✅ Cache le menu latéral
- ✅ Cache l'en-tête de l'application
- ✅ Cache le bouton "Imprimer"
- ✅ Affiche uniquement le bulletin
- ✅ Optimisé pour A4
- ✅ Marges adaptées

### Pour imprimer
1. Cliquer sur "Imprimer le Bulletin"
2. OU Ctrl+P (Windows) / Cmd+P (Mac)
3. Sélectionner l'imprimante
4. Format : A4
5. Orientation : Portrait

---

## ✨ Détails de Finition

### Messages
- **Succès** : Fond vert clair, bordure verte, icône check
- **Erreur** : Fond rouge clair, bordure rouge, icône warning
- **Loading** : Spinner bleu avec message

### Formulaires
- **Labels** : Gris foncé, petite taille
- **Inputs** : Bordure grise, focus bleu
- **Validation** : Messages rouges sous les champs
- **Selects** : Style cohérent avec inputs

### Cartes
- **Ombre** : shadow-md
- **Hover** : shadow-lg
- **Coins** : arrondis (rounded-lg)
- **Padding** : 24px (p-6)

---

## 🎯 Points Clés du Design

1. **Cohérence** : Tous les éléments suivent le même style
2. **Lisibilité** : Textes bien contrastés
3. **Hiérarchie** : Tailles de texte appropriées
4. **Feedback** : Retours visuels sur toutes les actions
5. **Professionnalisme** : Design épuré et moderne

---

**🎨 Design créé pour l'Institut Umoja**
