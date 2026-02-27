import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Composant `ProtectedRoute` (Route protégée) utilisé pour restreindre l'accès à certaines pages.
 * Empêche les utilisateurs non connectés ou sans le bon rôle d'accéder au contenu.
 *
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu réel de la page à rendre si l'accès est autorisé
 * @param {string[]} [props.allowedRoles] - Tableau facultatif des rôles autorisés (ex: ['admin', 'etudiant'])
 * @returns {JSX.Element} Écran de chargement, redirection ou les enfants (children)
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth()

  // Tant que l'état d'authentification est en train d'être déterminé, on affiche un loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          {/* Spinner de chargement */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté, redirection forcée vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // Si des rôles spécifiques sont requis et que le rôle de l'utilisateur n'est pas dedans
  // redirection forcée vers l'accueil (qui le redirigera vers son dashboard correspondant)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />
  }

  // Si toutes les vérifications passent, on affiche le contenu de la route
  return children
}
