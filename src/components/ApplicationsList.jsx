import { useNavigate } from 'react-router-dom'

/**
 * Convertit le statut brut d'une candidature en une classe CSS visuelle 
 * et un libellé textuel correspondant.
 * 
 * @param {string} status - Le statut de la candidature (ex: 'en_attente')
 * @returns {{className: string, label: string}} L'objet contenant les classes du badge et le texte
 */
const getStatusBadge = (status) => {
  const badges = {
    en_attente: 'badge-pending',
    acceptee: 'badge-accepted',
    refusee: 'badge-rejected',
    validee: 'badge-validated'
  }
  const labels = {
    en_attente: 'En attente',
    acceptee: 'Acceptée',
    refusee: 'Refusée',
    validee: 'Validée'
  }
  return { className: badges[status], label: labels[status] }
}

/**
 * Composant listant les candidatures, adapté pour différentes vues (étudiant ou entreprise).
 * Affiche l'historique des postulations avec leurs statuts récents sous forme de cards.
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.applications - Le tableau des candidatures à lister
 * @param {boolean} [props.isStudentView=true] - Booléen indiquant si l'on est côté "étudiant"
 * @returns {JSX.Element} Liste verticale des candidatures
 */
export default function ApplicationsList({ applications, isStudentView = true }) {
  const navigate = useNavigate()

  // Message s'il n'y a pas de candidature existante
  if (applications.length === 0) {
    return (
      <div className="card-soft bg-white text-center py-8">
        <p className="text-muted-foreground">
          {isStudentView ? 'Vous n\'avez pas encore candidaté à une offre' : 'Aucune candidature'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => {
        // Calcule le badge couleur pour chaque candidature
        const badge = getStatusBadge(app.status)
        return (
          // Conteneur de la candidature avec effet de survol
          <div key={app.id} className="card-soft border border-border bg-white hover:shadow-md transition">
            <div className="flex items-start justify-between">

              {/* Informations principales de la postulation */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {/* Utilise le nom de l'offre si présent, sinon un ID par défaut */}
                  {app.offerTitle || `Offre #${app.offerId}`}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {app.message || app.companyName}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Candidature du {app.appliedAt}
                </p>

                {/* Liens d'actions contextuels vers le détail via React Router */}
                <div className="flex gap-2 mt-3">
                  {/* Lien pour l'étudiant */}
                  {isStudentView && (
                    <button
                      onClick={() => navigate(`/application/${app.id}`)}
                      className="text-sm text-primary hover:underline font-medium"
                      aria-label="Voir les détails de ma candidature"
                    >
                      Suivre ma candidature →
                    </button>
                  )}
                  {/* Lien pour l'entreprise pour voir le profil du postulant */}
                  {!isStudentView && (
                    <button
                      onClick={() => navigate(`/student/${app.studentEmail || app.studentId}`)}
                      className="text-sm text-primary hover:underline font-medium"
                      aria-label="Voir le profil du candidat"
                    >
                      Voir le profil →
                    </button>
                  )}
                </div>
              </div>

              {/* Badge de statut affiché sur le côté droit */}
              <span className={`badge ${badge.className} whitespace-nowrap ml-4`}>
                {badge.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
