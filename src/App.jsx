import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProfileProvider } from './context/UserProfileContext'
import Layout from './layouts/Layout'

// Importation des pages du tableau de bord selon le rôle
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Importation des différentes vues et pages fonctionnelles
import UserProfile from './pages/UserProfile'
import StudentConvention from './pages/StudentConvention'
import StudentEvaluations from './pages/StudentEvaluations'
import CompanyCandidates from './pages/CompanyCandidates'
import Messages from './pages/Messages'
import AdminReports from './pages/AdminReports'
import AdminConventions from './pages/AdminConventions'
import StudentProfileView from './pages/StudentProfileView'
import ApplicationTracking from './pages/ApplicationTracking'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import Login from './pages/Login'

/**
 * Composant `AppContent` responsable de l'affichage sécurisé du contenu et du routage
 * en fonction de l'état d'authentification et du rôle de l'utilisateur.
 * 
 * @returns {JSX.Element} Le JSX rendant les routes protégées ou publiques
 */
function AppContent() {
  // Récupération de l'état d'authentification et du rôle depuis le contexte d'auth
  const { isAuthenticated, role } = useAuth()

  // Si l'utilisateur n'est pas authentifié, seules les routes publiques (connexion, inscription) sont accessibles
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Si l'utilisateur est authentifié, on englobe les vues dans le composant `Layout` (qui contient la barre de menu etc.)
  return (
    <Layout>
      <Routes>
        {/* Route d'accueil : redirige vers le tableau de bord spécifique au rôle */}
        <Route path="/" element={
          role === 'etudiant' ? <StudentDashboard /> :
            role === 'entreprise' ? <CompanyDashboard /> :
              (role === 'administration' || role === 'admin') ? <AdminDashboard /> :
                // Rôle null = compte Supabase Auth sans ligne dans la table utilisateur
                <RoleErrorPage />
        } />

        {/* Routes communes et spécialisées */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/student/:studentId" element={<StudentProfileView />} />

        {/* Routes pour les étudiants : requièrent le rôle 'etudiant' sinon redirection à l'accueil */}
        <Route path="/application/:applicationId" element={role === 'etudiant' ? <ApplicationTracking /> : <Navigate to="/" />} />
        <Route path="/convention" element={role === 'etudiant' ? <StudentConvention /> : <Navigate to="/" />} />
        <Route path="/evaluations" element={role === 'etudiant' ? <StudentEvaluations /> : <Navigate to="/" />} />

        {/* Routes pour les entreprises : requièrent le rôle 'entreprise' */}
        <Route path="/candidates" element={role === 'entreprise' ? <CompanyCandidates /> : <Navigate to="/" />} />

        {/* Messagerie accessible à tous les utilisateurs connectés */}
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/" />} />

        {/* Routes pour les administrateurs : requièrent le rôle 'admin' ou 'administration' */}
        <Route
          path="/reports"
          element={
            (role === 'admin' || role === 'administration')
              ? <AdminReports />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/conventions"
          element={
            (role === 'admin' || role === 'administration')
              ? <AdminConventions />
              : <Navigate to="/" />
          }
        />

        {/* Route fallback (attrape-tout) : redirige vers l'accueil si la page n'existe pas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

/**
 * Page d'erreur affichée quand l'utilisateur est authentifié dans Supabase Auth
 * mais qu'il n'a pas de ligne dans la table `utilisateur` (profil incomplet).
 */
function RoleErrorPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-soft">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Compte incomplet</h2>
        <p className="text-muted-foreground mb-2">
          Votre compte est authentifié mais votre profil n'a pas encore été créé dans la base de données.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Contactez l'administrateur ou reconnectez-vous après avoir complété votre inscription.
        </p>
        <button onClick={handleLogout} className="btn-primary w-full">
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

/**
 * Composant principal de l'application `App`.
 * Initialise le routeur (`BrowserRouter`) et englobe l'application avec les contextes globaux.
 * 
 * @returns {JSX.Element} L'arbre de composants racine.
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          <AppContent />
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
