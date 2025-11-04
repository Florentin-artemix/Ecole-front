-- ============================================================
-- SCRIPT DE SUPPRESSION COMPLÈTE DES DONNÉES
-- ============================================================
-- Ce script supprime TOUTES les données de la base de données
-- tout en préservant la structure des tables
-- Date: 4 Novembre 2025
-- ============================================================

DO $$
BEGIN
    -- Désactiver temporairement les contraintes de clés étrangères
    SET session_replication_role = 'replica';

    -- ============================================================
    -- ÉTAPE 1: SUPPRIMER LES DONNÉES DES TABLES DÉPENDANTES
    -- ============================================================

    -- Supprimer les conduites (dépend de eleve)
    DELETE FROM conduite;
    RAISE NOTICE 'Conduites supprimées';

    -- Supprimer les notes (dépend de eleve et cours)
    DELETE FROM note;
    RAISE NOTICE 'Notes supprimées';

    -- Supprimer les relations parent-élève (dépend de utilisateur et eleve)
    DELETE FROM parent_eleve;
    RAISE NOTICE 'Relations parent-élève supprimées';

    -- Supprimer les cours (dépend de classe et utilisateur/professeur)
    DELETE FROM cours;
    RAISE NOTICE 'Cours supprimés';

    -- Supprimer les élèves (dépend de classe et ecole)
    DELETE FROM eleve;
    RAISE NOTICE 'Élèves supprimés';

    -- ============================================================
    -- ÉTAPE 2: SUPPRIMER LES DONNÉES DES TABLES INDÉPENDANTES
    -- ============================================================

    -- Supprimer les utilisateurs
    DELETE FROM utilisateur;
    RAISE NOTICE 'Utilisateurs supprimés';

    -- Supprimer les classes
    DELETE FROM classe;
    RAISE NOTICE 'Classes supprimées';

    -- Supprimer les écoles
    DELETE FROM ecole;
    RAISE NOTICE 'Écoles supprimées';

    -- ============================================================
    -- ÉTAPE 3: RÉINITIALISER LES SÉQUENCES AUTO-INCREMENT
    -- ============================================================

    -- Réinitialiser les séquences pour que les IDs recommencent à 1
    ALTER SEQUENCE IF EXISTS conduite_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS note_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS parent_eleve_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS cours_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS eleve_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS utilisateur_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS classe_id_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS ecole_id_seq RESTART WITH 1;

    RAISE NOTICE 'Séquences réinitialisées';

    -- Réactiver les contraintes de clés étrangères
    SET session_replication_role = 'origin';
    
    RAISE NOTICE '✅ TOUTES LES DONNÉES ONT ÉTÉ SUPPRIMÉES AVEC SUCCÈS !';
END $$;

-- ============================================================
-- VÉRIFICATION
-- ============================================================

-- Afficher le nombre de lignes dans chaque table
SELECT 
    'conduite' as table_name, COUNT(*) as nombre_lignes FROM conduite
UNION ALL
SELECT 'note', COUNT(*) FROM note
UNION ALL
SELECT 'parent_eleve', COUNT(*) FROM parent_eleve
UNION ALL
SELECT 'cours', COUNT(*) FROM cours
UNION ALL
SELECT 'eleve', COUNT(*) FROM eleve
UNION ALL
SELECT 'utilisateur', COUNT(*) FROM utilisateur
UNION ALL
SELECT 'classe', COUNT(*) FROM classe
UNION ALL
SELECT 'ecole', COUNT(*) FROM ecole
ORDER BY table_name;

-- Message de confirmation
SELECT '✅ TOUTES LES DONNÉES ONT ÉTÉ SUPPRIMÉES AVEC SUCCÈS !' as resultat;

-- ============================================================
-- NOTES IMPORTANTES
-- ============================================================
-- 
-- ⚠️ ATTENTION: Ce script supprime TOUTES les données !
-- 
-- 1. La structure des tables est PRÉSERVÉE
-- 2. Les séquences sont RÉINITIALISÉES (IDs recommencent à 1)
-- 3. Les contraintes de clés étrangères sont respectées
-- 4. Aucune donnée n'est récupérable après exécution
-- 
-- UTILISATION:
-- psql -U postgres -d ecole_db -f effacer_toutes_donnees.sql
-- 
-- OU depuis pgAdmin: Exécuter ce script dans Query Tool
-- 
-- ============================================================
