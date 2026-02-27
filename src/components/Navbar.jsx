import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Retourne le titre du tableau de bord principal selon le rôle de l'utilisateur.
 * 
 * @param {string} role - Le rôle d'authentification de l'utilisateur
 * @returns {string} Le titre d'accueil textuel
 */
const getRoleTitle = (role) => {
  const titles = {
    etudiant: 'Tableau de Bord Étudiant',
    entreprise: 'Tableau de Bord Entreprise',
    administration: 'Tableau de Bord Administration',
    admin: 'Tableau de Bord Admin'
  }
  return titles[role] || 'Gestion de Stage'
}

/**
 * Dérive un titre de page basé sur l'URL de localisation actuelle.
 * Affiche le titre personnalisé uniquement si on est à la racine de l'app (dashboard).
 * 
 * @param {string} role - Le rôle de l'utilisateur connecté
 * @param {string} pathname - Le chemin d'URL courant
 * @returns {string} Le titre affiché dans la Navbar ou vide
 */
const getPageTitle = (role, pathname) => {
  return pathname === '/' ? getRoleTitle(role) : ''
}

/**
 * Composant `Navbar`
 * Barre de navigation supérieure incluant le titre de la page visible côté gauche
 * et le module de profil avec menu déroulant pour configurer compte et déconnexion à droite.
 *
 * @returns {JSX.Element} Barre de la navigation au-dessus du composant principal
 */
export default function Navbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Gère l'état d'ouverture du menu contextuel (dropdown) de profil
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Nom à afficher : on utilise l'email comme base en attendant le profil complet
  const displayName = user?.email ? user.email.split('@')[0] : ''

  /**
   * Fonction de gestion de déconnexion.
   * Appelle logout() du contexte auth — App.jsx redirige automatiquement
   * vers /login quand isAuthenticated devient false (via la route wildcard).
   */
  const handleLogout = async () => {
    setIsProfileOpen(false)
    await logout()
    // Pas de navigate() ici : App.jsx gère la redirection automatiquement
    // quand user devient null (route * → /login)
  }

  /**
   * Génère les initiales (avatar textuel minimaliste) à afficher
   * à partir du nom d'utilisateur, ou bien de la première de l'email.
   * 
   * @returns {string} Initiales textuelles (1 à 2 lettres)
   */
  const getInitials = () => {
    if (displayName) return displayName[0].toUpperCase()
    return user?.email?.[0]?.toUpperCase() || '?'
  }

  // Détermination du titre contextuel selon l'url de l'application
  const title = getPageTitle(role, location.pathname)

  return (
    <nav className="bg-white shadow-sm border-b border-border">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Affichage conditionnel du titre de page principal (le cas échéant) */}
        {title && (
          <h1 className="text-2xl font-bold text-foreground">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-4 relative ml-auto">
          {/* Bouton du profil qui déclenche le sous-menu dropdown */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-muted px-3 py-2 rounded-lg transition"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            {/* Icône / Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {getInitials()}
            </div>
            {/* Informations du Compte en texte, masquées sur petits écrans */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{displayName || user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </button>

          {/* Menu Dropdown de l'utilisateur affiché si l'état isProfileOpen = true */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg w-48 z-50 overflow-hidden">
              <button
                onClick={() => { navigate('/profile'); setIsProfileOpen(false) }}
                className="w-full text-left px-4 py-2 hover:bg-muted transition text-foreground font-medium"
              >
                Mon Profil
              </button>

              {/* Options supplémentaires de navigation spécifiques au rôle Étudiant */}
              {(role === 'etudiant') && (
                <>
                  <button
                    onClick={() => { navigate('/convention'); setIsProfileOpen(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition text-foreground border-t border-border font-medium"
                  >
                    Ma Convention
                  </button>
                  <button
                    onClick={() => { navigate('/evaluations'); setIsProfileOpen(false) }}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition text-foreground border-t border-border font-medium"
                  >
                    Mes Évaluations
                  </button>
                </>
              )}

              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-muted transition text-destructive border-t border-border font-bold text-red-500"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
