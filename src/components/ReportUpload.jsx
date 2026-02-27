import { useState } from 'react'

/**
 * Composant de téléversement (Upload) de rapport de stage destiné aux étudiants.
 * Permet de sélectionner un fichier local (PDF, Word) et de saisir quelques métadonnées.
 *
 * @returns {JSX.Element} Formulaire d'upload de rapport
 */
export default function ReportUpload() {
  // Nom du fichier sélectionné
  const [fileName, setFileName] = useState('')
  // Booléen pour savoir si un fichier est prêt à être envoyé
  const [uploaded, setUploaded] = useState(false)

  /**
   * Gestionnaire appelé lors de la sélection d'un fichier via l'input de type "file".
   * Stocke le nom du fichier en local state pour affichage.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement du fichier
   */
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setUploaded(true) // Débloque le bouton de soumission
    }
  }

  return (
    <div className="card-soft max-w-2xl">
      <div className="space-y-6">
        {/* ------- Zone d'Upload (Glisser-Déposer visuel) ------- */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <div className="mb-4">
            <span className="text-4xl" aria-hidden="true">📄</span>
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Télécharger votre rapport
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Glissez-déposez votre fichier PDF ou cliquez pour parcourir
          </p>
          <label className="inline-block">
            {/* Input masqué, le bouton stylisé ci-dessous sert de déclencheur */}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="btn-secondary cursor-pointer inline-block">
              Choisir un fichier
            </span>
          </label>
        </div>

        {/* ------- Affichage du Fichier Sélectionné ------- */}
        {uploaded && (
          <div className="bg-success bg-opacity-10 border border-success rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">✓</span>
              <div>
                <h4 className="font-semibold text-foreground">Fichier sélectionné</h4>
                <p className="text-sm text-muted-foreground">{fileName}</p>
              </div>
            </div>
          </div>
        )}

        {/* ------- Formulaire additionnel (Titre / Description) ------- */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Titre du Rapport
            </label>
            <input
              type="text"
              placeholder="Ex: Rapport de Stage - TechCorp 2024"
              className="input-soft"
              defaultValue="Rapport de Stage - TechCorp 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (optionnel)
            </label>
            <textarea
              placeholder="Résumez les points clés de votre stage..."
              className="input-soft resize-none"
              rows="4"
              defaultValue="Lors de mon stage chez TechCorp, j'ai pu développer une application web complète avec React et Node.js..."
            />
          </div>

          {/* Bouton de soumission, désactivé tant qu'aucun fichier n'est choisi */}
          <button
            disabled={!uploaded}
            className={`w-full btn-soft transition-all ${uploaded
                ? 'btn-primary'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
          >
            Soumettre le Rapport
          </button>
        </div>
      </div>
    </div>
  )
}
