import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ========== ÉTAT 1 : GESTION DE L'ONBOARDING ==========
  const [onboardingTermine, setOnboardingTermine] = useState(() => {
    return localStorage.getItem('onboardingTermine') === 'true';
  });
  const [pageOnboarding, setPageOnboarding] = useState(0);

  // ========== ÉTAT 2 : RÉPONSES DU QUESTIONNAIRE ==========
  const [reponses, setReponses] = useState(() => {
    const saved = localStorage.getItem('profilUtilisateur');
    return saved ? JSON.parse(saved) : {
      nom: '',
      objectif: '',
      experience: 'debutant'
    };
  });

  // ========== ÉTAT 3 : GESTION DES TÂCHES ==========
  const [taches, setTaches] = useState(() => {
    const saved = localStorage.getItem('mesTaches');
    return saved ? JSON.parse(saved) : [];
  });
  const [nouvelleTache, setNouvelleTache] = useState('');
  const [filtre, setFiltre] = useState('toutes');
  
  // ========== ÉTAT 4 : CATÉGORIES ==========
  const [categorie, setCategorie] = useState('personnel');
  const [filtreCategorie, setFiltreCategorie] = useState('toutes');

  // Catégories disponibles
  const categories = [
    { id: 'personnel', nom: 'Personnel', emoji: '👤' },
    { id: 'travail', nom: 'Travail', emoji: '💼' },
    { id: 'courses', nom: 'Courses', emoji: '🛒' },
    { id: 'sante', nom: 'Santé', emoji: '💪' },
    { id: 'loisirs', nom: 'Loisirs', emoji: '🎮' }
  ];

  // ========== EFFET : SAUVEGARDE AUTOMATIQUE ==========
  useEffect(() => {
    localStorage.setItem('mesTaches', JSON.stringify(taches));
  }, [taches]);

  // ========== FONCTIONS DE L'ONBOARDING ==========
  const pageSuivante = () => {
    if (pageOnboarding < 2) {
      setPageOnboarding(pageOnboarding + 1);
    }
  };

  const pagePrecedente = () => {
    if (pageOnboarding > 0) {
      setPageOnboarding(pageOnboarding - 1);
    }
  };

  const changerReponse = (champ, valeur) => {
    setReponses({
      ...reponses,
      [champ]: valeur
    });
  };

  const terminerOnboarding = () => {
    localStorage.setItem('profilUtilisateur', JSON.stringify(reponses));
    localStorage.setItem('onboardingTermine', 'true');
    setOnboardingTermine(true);
  };

  // ========== FONCTIONS DES TÂCHES ==========
  const ajouterTache = () => {
    if (nouvelleTache.trim() !== '') {
      const tache = {
        id: Date.now(),
        texte: nouvelleTache,
        terminee: false,
        categorie: categorie
      };
      setTaches([...taches, tache]);
      setNouvelleTache('');
    }
  };

  const toggleTache = (id) => {
    setTaches(taches.map(tache => 
      tache.id === id ? { ...tache, terminee: !tache.terminee } : tache
    ));
  };

  const supprimerTache = (id) => {
    setTaches(taches.filter(tache => tache.id !== id));
  };

  const supprimerTachesTerminees = () => {
    setTaches(taches.filter(tache => !tache.terminee));
  };

  // ========== FILTRAGE DES TÂCHES ==========
  const tachesFiltrees = taches.filter(tache => {
    let filtreEtat = true;
    switch (filtre) {
      case 'actives':
        filtreEtat = !tache.terminee;
        break;
      case 'terminees':
        filtreEtat = tache.terminee;
        break;
      default:
        filtreEtat = true;
    }
    
    let filtreCat = true;
    if (filtreCategorie !== 'toutes') {
      filtreCat = tache.categorie === filtreCategorie;
    }
    
    return filtreEtat && filtreCat;
  });

  // ========== AFFICHAGE : ONBOARDING ==========
  if (!onboardingTermine) {
    return (
      <div className="App">
        <div className="onboarding-container">
          {/* PAGE 1 : BIENVENUE */}
          {pageOnboarding === 0 && (
            <div className="onboarding-page">
              <div className="onboarding-emoji">📋</div>
              <h1>BIENVENUE</h1>
              <p>Organisez votre vie, une tâche à la fois</p>
              <div className="indicateur-pages">
                <span className="page-dot actif">●</span>
                <span className="page-dot">○</span>
                <span className="page-dot">○</span>
              </div>
              <button className="bouton-brutal primaire" onClick={pageSuivante}>
                COMMENCER
              </button>
            </div>
          )}

          {/* PAGE 2 : NOM */}
          {pageOnboarding === 1 && (
            <div className="onboarding-page">
              <h2>COMMENT VOUS APPELEZ-VOUS ?</h2>
              <input
                type="text"
                value={reponses.nom}
                onChange={(e) => changerReponse('nom', e.target.value)}
                placeholder="Votre nom..."
                className="champ-brutal"
              />
              <div className="indicateur-pages">
                <span className="page-dot">○</span>
                <span className="page-dot actif">●</span>
                <span className="page-dot">○</span>
              </div>
              <div className="boutons-navigation">
                <button className="bouton-brutal secondaire" onClick={pagePrecedente}>
                  RETOUR
                </button>
                <button 
                  className="bouton-brutal primaire" 
                  onClick={pageSuivante}
                  disabled={!reponses.nom.trim()}
                >
                  SUIVANT
                </button>
              </div>
            </div>
          )}

          {/* PAGE 3 : OBJECTIF */}
          {pageOnboarding === 2 && (
            <div className="onboarding-page">
              <h2>DERNIÈRES QUESTIONS</h2>
              
              <div className="question-bloc">
                <label>Objectif principal :</label>
                <input
                  type="text"
                  value={reponses.objectif}
                  onChange={(e) => changerReponse('objectif', e.target.value)}
                  placeholder="Ex: Organiser mon travail..."
                  className="champ-brutal"
                />
              </div>

              <div className="question-bloc">
                <label>Niveau d'expérience :</label>
                <select 
                  value={reponses.experience}
                  onChange={(e) => changerReponse('experience', e.target.value)}
                  className="select-brutal"
                >
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="indicateur-pages">
                <span className="page-dot">○</span>
                <span className="page-dot">○</span>
                <span className="page-dot actif">●</span>
              </div>
              <div className="boutons-navigation">
                <button className="bouton-brutal secondaire" onClick={pagePrecedente}>
                  RETOUR
                </button>
                <button 
                  className="bouton-brutal primaire" 
                  onClick={terminerOnboarding}
                  disabled={!reponses.objectif.trim()}
                >
                  TERMINER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== AFFICHAGE : APPLICATION PRINCIPALE ==========
  return (
    <div className="App">
      <div className="container">
        
        {/* EN-TÊTE PERSONNALISÉE */}
        <div className="header-brutal">
          <h1>#{reponses.nom.toUpperCase()}'S TASKS</h1>
          <p className="objectif-text">{reponses.objectif}</p>
        </div>

        {/* SÉLECTEUR DE CATÉGORIE */}
        <div className="categories-section">
          <label className="label-brutal">CATÉGORIE :</label>
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategorie(cat.id)}
                className={`bouton-categorie ${categorie === cat.id ? 'actif' : ''}`}
              >
                {cat.emoji} {cat.nom}
              </button>
            ))}
          </div>
        </div>

        {/* ZONE D'AJOUT */}
        <div className="ajout-tache">
          <input
            type="text"
            value={nouvelleTache}
            onChange={(e) => setNouvelleTache(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && ajouterTache()}
            placeholder="Quelle est votre prochaine tâche ?"
            className="champ-saisie"
          />
          <button onClick={ajouterTache} className="bouton-ajouter">
            AJOUTER
          </button>
        </div>

        {/* FILTRES */}
        <div className="filtres-section">
          <div className="filtres-etat">
            <button 
              onClick={() => setFiltre('toutes')}
              className={`bouton-filtre ${filtre === 'toutes' ? 'actif' : ''}`}
            >
              TOUTES ({taches.length})
            </button>
            <button 
              onClick={() => setFiltre('actives')}
              className={`bouton-filtre ${filtre === 'actives' ? 'actif' : ''}`}
            >
              ACTIVES ({taches.filter(t => !t.terminee).length})
            </button>
            <button 
              onClick={() => setFiltre('terminees')}
              className={`bouton-filtre ${filtre === 'terminees' ? 'actif' : ''}`}
            >
              TERMINÉES ({taches.filter(t => t.terminee).length})
            </button>
          </div>
          
          <div className="filtre-categorie">
            <label>Filtrer :</label>
            <select 
              value={filtreCategorie} 
              onChange={(e) => setFiltreCategorie(e.target.value)}
              className="select-brutal"
            >
              <option value="toutes">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LISTE DES TÂCHES */}
        <div className="liste-taches">
          {tachesFiltrees.length === 0 ? (
            <div className="message-vide">
              <p>AUCUNE TÂCHE {filtre !== 'toutes' ? filtre.toUpperCase() : ''}</p>
              <p className="sous-message">#NoDaysOff</p>
            </div>
          ) : (
            tachesFiltrees.map(tache => {
              const cat = categories.find(c => c.id === tache.categorie);
              return (
                <div key={tache.id} className={`tache ${tache.terminee ? 'terminee' : ''}`}>
                  <span 
                    onClick={() => toggleTache(tache.id)}
                    className="texte-tache"
                  >
                    <span className="badge-categorie">
                      {cat?.emoji} {cat?.nom}
                    </span>
                    {tache.texte}
                  </span>
                  <button 
                    onClick={() => supprimerTache(tache.id)}
                    className="bouton-supprimer"
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* BOUTON NETTOYAGE */}
        {taches.some(t => t.terminee) && (
          <div className="actions-globales">
            <button 
              onClick={supprimerTachesTerminees}
              className="bouton-nettoyer"
            >
              🧹 SUPPRIMER LES TERMINÉES
            </button>
          </div>
        )}

        {/* STATISTIQUES */}
        {taches.length > 0 && (
          <div className="statistiques">
            <p>
              TOTAL: {taches.length} | 
              ACTIVES: {taches.filter(t => !t.terminee).length} | 
              TERMINÉES: {taches.filter(t => t.terminee).length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;