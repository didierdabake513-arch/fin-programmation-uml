/**
 * Carte d'affichage d'une offre de stage.
 * Présente les informations clés (titre, entreprise, description métier, salaire...).
 * Contient un bouton d'action pour postuler.
 *
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.offer - Les données de l'offre à afficher
 * @param {Function} props.onApply - Fonction de rappel (callback) appelée lors du clic sur le bouton postuler
 * @param {boolean} props.isApplied - État permettant de savoir si l'étudiant a déjà postulé à cette offre (désactive le bouton)
 * @returns {JSX.Element} Une carte stylisée pour l'offre
 */
export default function OfferCard({ offer, onApply, isApplied }) {
  return (
    <div className="card-soft border border-border bg-white">
      <div className="space-y-3">
        {/* Titre et nom de l'entreprise */}
        <div>
          <h3 className="font-bold text-foreground text-lg">{offer.title}</h3>
          <p className="text-sm text-primary font-medium">{offer.company}</p>
        </div>

        {/* Description tronquée à 2 lignes */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {offer.description}
        </p>

        {/* Bloc d'informations pratiques (Lieu, Durée, Salaire, Date) sous forme de grille compacte */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>📍</span>
            <span>{offer.location}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>⏱️</span>
            <span>{offer.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>💰</span>
            <span>{offer.salary}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>📅</span>
            <span>{offer.startDate}</span>
          </div>
        </div>

        {/* Affichage des compétences requises sous forme de badges (limité à 3) */}
        <div className="flex flex-wrap gap-1">
          {offer.requirements && offer.requirements.slice(0, 3).map((req, idx) => (
            <span key={idx} className="badge-pending">
              {req}
            </span>
          ))}
        </div>

        {/* Bouton pour déclencher la candidature */}
        <button
          onClick={() => onApply(offer.id)}
          disabled={isApplied}
          className={`w-full btn-soft transition-all ${isApplied
              ? 'bg-success text-white cursor-default' // Style si déjà postulé
              : 'btn-primary hover:opacity-90'        // Style normal
            }`}
        >
          {isApplied ? '✓ Candidature envoyée' : 'Postuler'}
        </button>
      </div>
    </div>
  )
}
