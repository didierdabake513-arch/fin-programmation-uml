/**
 * Composant de gestion des offres (créées par une entreprise).
 * Affiche la liste des offres publiées avec leurs détails et des options pour
 * les modifier ou les archiver.
 * 
 * @param {Object} props - Les propriétés
 * @param {Array} props.offers - Le tableau d'objets des offres de stage
 * @param {Function} [props.onEdit] - Fonction déclenchée lors de l'appui sur "Modifier"
 * @param {Function} [props.onArchive] - Fonction déclenchée lors de l'appui sur "Archiver"
 * @returns {JSX.Element} Une interface de liste d'offres
 */
export default function OfferManagement({ offers, onEdit, onArchive }) {
  // Affichage vide si l'entreprise n'a publié aucune offre
  if (offers.length === 0) {
    return (
      <div className="card-soft bg-white text-center py-8">
        <p className="text-muted-foreground">
          Vous n'avez pas encore créé d'offre de stage
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Itération sur les éléments du tableau des offres */}
      {offers.map((offer) => (
        <div key={offer.id} className="card-soft border border-border bg-white">
          <div className="flex items-start justify-between gap-4">

            {/* Colonne d'informations principales de l'offre */}
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg">{offer.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {offer.description}
              </p>

              {/* Informations techniques sous forme de badges textuels avec icônes (localisation, etc) */}
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                <span>📍 {offer.location}</span>
                <span>⏱️ {offer.duration}</span>
                <span>💰 {offer.salary}</span>
                <span>📅 {offer.startDate}</span>
              </div>

              {/* Exigences techniques / Compétences requises (s'il y en a) */}
              <div className="flex flex-wrap gap-1 mt-3">
                {offer.requirements && offer.requirements.map((req, idx) => (
                  <span key={idx} className="badge-pending text-xs">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Colonne des actions (Boutons Modifier/Archiver) */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit && onEdit(offer)}
                className="btn-secondary text-sm"
                aria-label="Modifier l'offre"
              >
                Modifier
              </button>
              <button
                onClick={() => onArchive && onArchive(offer)}
                className="btn-outline text-sm"
                aria-label="Archiver l'offre"
              >
                Archiver
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
