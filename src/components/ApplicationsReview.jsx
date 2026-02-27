/**
 * Retourne la classe CSS et le libellé affichable pour un statut de candidature.
 * Utilisé pour afficher un badge coloré à côté du nom du candidat.
 * 
 * @param {string} status - L'état actuel ('en_attente', 'acceptee', etc.)
 * @returns {{className: string, label: string}} L'objet avec les paramètres graphiques
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
 * Composant d'affichage des candidatures pour évaluation (Vue Entreprise).
 * Permet à un recruteur de lire les lettres de motivation et d'accepter ou refuser des étudiants.
 *
 * @param {Object} props - Les propriétés
 * @param {Array} props.applications - Tableau d'objets candidature (id, studentName, status, lettreMotivation...)
 * @param {Function} props.onUpdateStatus - Callback pour modifier le statut `(id, nouveauStatut) => void`
 * @param {Function} [props.onEvaluate] - Callback optionnel pour ouvrir le formulaire d'évaluation post-stage
 * @returns {JSX.Element} Liste de révision des candidatures
 */
export default function ApplicationsReview({ applications, onUpdateStatus, onEvaluate }) {
  // Si aucune candidature reçue, affichage d'un message informatif
  if (applications.length === 0) {
    return (
      <div className="card-soft bg-white text-center py-8">
        <p className="text-muted-foreground">
          Aucune candidature
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => {
        // Détermination du style de badge
        const badge = getStatusBadge(app.status)
        return (
          // Affichage de la carte d'une candidature
          <div key={app.id} className="card-soft border border-border bg-white">
            <div className="flex items-start justify-between gap-4">

              {/* Contenu principal : infos candidat et motivation */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {app.studentName}
                  </h3>
                  <span className={`badge ${badge.className} text-xs`}>
                    {badge.label}
                  </span>
                </div>

                {/* Lettre de motivation affichée sous forme de citation */}
                <p className="text-sm text-muted-foreground italic">
                  "{app.lettreMotivation}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Candidature du {app.appliedAt}
                </p>
              </div>

              {/* Boutons d'actions si la candidature est encore en attente */}
              {app.status === 'en_attente' && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onUpdateStatus(app.id, 'acceptee')}
                    className="btn-secondary text-sm"
                    aria-label={`Accepter la candidature de ${app.studentName}`}
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => onUpdateStatus(app.id, 'refusee')}
                    className="btn-outline text-sm"
                    aria-label={`Refuser la candidature de ${app.studentName}`}
                  >
                    Refuser
                  </button>
                </div>
              )}

              {/* Bouton d'évaluation disponible uniquement pour les candidatures acceptées/validées */}
              {(app.status === 'acceptee' || app.status === 'validee') && onEvaluate && (
                <div className="flex-shrink-0 mt-2">
                  <button
                    onClick={() => onEvaluate(app)}
                    className="btn-primary text-sm"
                  >
                    Évaluer
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
