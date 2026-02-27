import { useState } from 'react'

/**
 * Formulaire interactif permettant à une entreprise d'évaluer un étudiant
 * à l'issue ou pendant son stage.
 * 
 * @param {Object} props - Les propriétés
 * @param {string} [props.studentName=''] - Le nom pré-rempli de l'étudiant à évaluer
 * @param {Function} props.onSubmit - Callback recevant l'objet d'évaluation une fois le formulaire validé
 * @returns {JSX.Element} Formulaire d'évaluation
 */
export default function EvaluationForm({ studentName = '', onSubmit }) {
  // État local gérant les différents champs de l'évaluation
  const [formData, setFormData] = useState({
    studentName,
    rating: 4,      // Note par défaut fixée à 4/5
    comments: ''
  })

  /**
   * Empêche le rechargement via l'événement onSubmit du navigateur,
   * exécute la fonction de callback et vide le formulaire.
   * 
   * @param {React.FormEvent} e - Événement de soumission classique
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Évaluation soumise:', formData)

    // Remonte les données au composant parent (ex: CompanyDashboard)
    if (onSubmit) onSubmit(formData)

    // Réinitialise le formulaire après envoi
    setFormData({ studentName: '', rating: 4, comments: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="card-soft max-w-2xl space-y-4">
      {/* ─── Champ : Nom de l'étudiant ─── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nom de l'étudiant
        </label>
        <input
          type="text"
          value={formData.studentName}
          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          className="input-soft"
          required
          placeholder="Ex: Marie Dupont"
        />
      </div>

      {/* ─── Champ : Note Globale (Curseur) ─── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Note (0-5)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            aria-label="Note sur cinq"
          />
          <span className="text-lg font-bold text-primary w-12 text-center">
            {formData.rating}/5
          </span>
        </div>
      </div>

      {/* ─── Champ : Commentaire Libre ─── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Commentaires
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          className="input-soft resize-none"
          rows="5"
          required
          placeholder="Donnez votre avis sur la performance et l'attitude de l'étudiant..."
        />
      </div>

      {/* Bouton de Soumission */}
      <button type="submit" className="btn-primary w-full">
        Soumettre l'Évaluation
      </button>
    </form>
  )
}
