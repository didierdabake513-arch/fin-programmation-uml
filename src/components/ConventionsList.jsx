/**
 * Convertit l'état interne d'une convention de stage en une classe CSS visuelle 
 * (pour la couleur du badge) et un libellé textuel lisible.
 * 
 * @param {string} status - Le statut de la convention (ex: 'en_attente', 'validee')
 * @returns {{className: string, label: string}} Le style et le texte à afficher
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
 * Composant listant les différentes conventions de stages déposées.
 * Affiche les détails sous forme de cartes (étudiant, entreprise, offre associée, statut).
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.conventions - Tableau des conventions de l'utilisateur ou de l'admin
 * @param {Function} props.onValidate - Fonction de callback appelée lors de la validation admin (optionnelle)
 * @returns {JSX.Element} Une liste de conventions
 */
export default function ConventionsList({ conventions, onValidate }) {
  // Cas où aucune convention n'existe
  if (conventions.length === 0) {
    return (
      <div className="card-soft bg-white text-center py-8">
        <p className="text-muted-foreground">
          Aucune convention enregistrée
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {conventions.map((conv) => {
        // Calcule le style du badge en fonction du statut de la convention
        const badge = getStatusBadge(conv.status)
        return (
          // Affichage des informations d'une convention sous forme de carte (card)
          <div key={conv.id} className="card-soft border border-border bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* En-tête de la carte : Nom étudiant et statut */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {conv.studentName}
                  </h3>
                  <span className={`badge ${badge.className} text-xs`}>
                    {badge.label}
                  </span>
                </div>

                {/* Détails de la convention */}
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Entreprise:</span> {conv.companyName}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Poste:</span> {conv.offerTitle}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Durée:</span> {conv.startDate} à {conv.endDate}
                  </p>
                  {/* Affichage du mentor / tuteur si fourni */}
                  {conv.mentor && (
                    <p>
                      <span className="font-medium text-foreground">Mentor:</span> {conv.mentor}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions interactives (côté droit de la carte) */}

              {/* Si on peut la valider (généralement admin) et qu'elle est en attente */}
              {conv.status === 'en_attente' && (
                <button
                  onClick={() => onValidate(conv.id)}
                  className="btn-secondary text-sm flex-shrink-0"
                >
                  Valider
                </button>
              )}
              {/* Affichage de la date de validation le cas échéant */}
              {conv.status === 'validee' && (
                <div className="flex-shrink-0 text-xs text-muted-foreground">
                  <p>Validée le</p>
                  <p className="font-medium text-foreground">{conv.validatedAt}</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
