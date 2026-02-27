import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ------ Définition des éléments du menu par rôle ------

/** Liste des liens de navigation pour le profil "etudiant" */
const studentMenuItems = [
  { label: 'Tableau de Bord', id: 'dashboard', path: '/' },
  { label: 'Offres de Stage', id: 'offers', path: '/?tab=offers' },
  { label: 'Mes Candidatures', id: 'applications', path: '/?tab=applications' },
  { label: 'Ma Convention', id: 'convention', path: '/convention' },
  { label: 'Soumettre Rapport', id: 'report', path: '/?tab=report' },
  { label: 'Mes Évaluations', id: 'evaluation', path: '/evaluations' },
  { label: 'Messages', id: 'messages', path: '/messages' }
]

/** Liste des liens de navigation pour le profil "entreprise" */
const companyMenuItems = [
  { label: 'Tableau de Bord', id: 'dashboard', path: '/' },
  { label: 'Mes Offres', id: 'offers', path: '/?tab=offers' },
  { label: 'Ajouter une Offre', id: 'add-offer', path: '/?tab=add-offer' },
  { label: 'Candidatures Reçues', id: 'applications', path: '/?tab=applications' },
  { label: 'Conventions', id: 'conventions', path: '/?tab=conventions' },
  { label: 'Évaluer Étudiant', id: 'evaluate', path: '/?tab=evaluate' },
  { label: 'Messages', id: 'messages', path: '/messages' }
]

/** Liste des liens de navigation pour le profil "administration" ou "admin" */
const adminMenuItems = [
  { label: 'Tableau de Bord', id: 'dashboard', path: '/' },
  { label: 'Conventions', id: 'conventions', path: '/conventions' },
  { label: 'Rapports', id: 'reports', path: '/reports' },
  { label: 'Statistiques', id: 'stats', path: '/?tab=stats' },
  { label: 'Messages', id: 'messages', path: '/messages' }
]

/**
 * Composant `Sidebar` (Barre de navigation latérale dynamique).
 * Il adapte son contenu en fonction du rôle de l'utilisateur (étudiant, entreprise, admin).
 * Permet également de réduire/agrandir le panneau pour un gain de place.
 * 
 * @returns {JSX.Element} Barre de navigation latérale
 */
export default function Sidebar() {
  // État local déterminant si la barre est étendue (par défaut) ou réduite (icônes uniquement)
  const [isExpanded, setIsExpanded] = useState(true)

  // Récupération du rôle d'authentification pour filtrer le menu
  const { role } = useAuth()

  // Hooks de routage React Router
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Retourne la liste des éléments de menu appropriés pour le rôle de l'utilisateur actif.
   * @returns {Array} Tableau d'objets (label, id, path)
   */
  const getMenuItems = () => {
    switch (role) {
      case 'etudiant': return studentMenuItems
      case 'entreprise': return companyMenuItems
      case 'administration':
      case 'admin': return adminMenuItems
      default: return []
    }
  }

  /**
   * Détermine si un élément de menu est actuellement actif (pour styliser le bouton).
   * La correspondance se fait via les chemins URL ou les Query Parameters (ex: `/?tab=offers`).
   * 
   * @param {Object} item L'objet de menu courant
   * @returns {boolean} True si le lien correspond à la vue actuelle
   */
  const isActive = (item) => {
    // Récupération du paramètre `tab` de l'URL courante
    const currentTab = new URLSearchParams(location.search).get('tab')
    // Extraction du paramètre `tab` depuis le chemin configuré pour le bouton
    const itemTab = new URLSearchParams(item.path.split('?')[1] || '').get('tab')

    // Règle spécifique pour le "Dashboard" (racine '/' sans tabs actifs)
    if (item.path === '/' && !currentTab && location.pathname === '/') {
      return item.id === 'dashboard'
    }
    // Si l'onglet en cours correspond à l'onglet du bouton, il est actif
    if (itemTab && itemTab === currentTab) return true

    // Sinon on compare les chemins purs en excluant 'tabs' et le dashboard
    if (item.path !== '/' && !itemTab) return location.pathname === item.path

    return false
  }

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-border shadow-sm transition-all duration-300 flex flex-col`}>
      {/*  ------- En-tête : Titre & Bouton  ------- */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {isExpanded && <h2 className="text-xl font-bold text-primary">Stage</h2>}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded-md transition"
            title={isExpanded ? "Réduire le menu" : "Agrandir le menu"}
          >
            {isExpanded ? '←' : '→'}
          </button>
        </div>
      </div>

      {/* ------- Liens de Navigation du Menu ------- */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${isExpanded ? '' : 'text-center'
              } ${isActive(item)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground hover:bg-muted'
              }`}
          >
            {/* Si réduit, on affiche juste la 1ère lettre du label comme icône texte */}
            {isExpanded ? item.label : item.label.charAt(0).toUpperCase()}
          </button>
        ))}
      </nav>

      {/* ------- Pied de page de la barre latérale ------- */}
      <div className="p-3 border-t border-border text-xs text-muted-foreground">
        {isExpanded && <div>© 2024 Gestion de Stage</div>}
      </div>
    </div>
  )
}
