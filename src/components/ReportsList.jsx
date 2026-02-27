import { useState } from 'react'

/**
 * Composant listant les rapports de stage pour qu'ils puissent être lus
 * et évalués (notés) par un administrateur.
 *
 * @param {Object} props - Les propriétés
 * @param {Array} props.reports - Liste d'objets `report` représentant les rapports soumis
 * @param {Function} props.onGrade - Fonction de callback pour enregistrer la note `(reportId, note) => void`
 * @returns {JSX.Element} Liste des rapports
 */
export default function ReportsList({ reports, onGrade }) {
  // L'ID du rapport actuellement en cours d'évaluation par l'admin (champ d'input ouvert)
  const [gradingId, setGradingId] = useState(null)

  // La valeur numérique de la note en train d'être saisie
  const [gradeValue, setGradeValue] = useState(0)

  /**
   * Valide la note saisie et appelle la fonction onGrade du parent.
   * Réinitialise ensuite les variables d'état locales.
   * 
   * @param {string|number} reportId - L'ID du rapport à noter
   */
  const handleSubmitGrade = (reportId) => {
    onGrade(reportId, gradeValue)
    setGradingId(null)
    setGradeValue(0)
  }

  // Cas où la liste est vide
  if (reports.length === 0) {
    return (
      <div className="card-soft bg-white text-center py-8">
        <p className="text-muted-foreground">
          Aucun rapport enregistré
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="card-soft border border-border bg-white">
          <div className="flex items-start justify-between gap-4">

            {/* Colonne des Infos du Rapport */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">
                  {report.studentName}
                </h3>
                {/* Badge visuel pour l'état de soumission */}
                <span className={`badge text-xs ${report.fileName ? 'badge-accepted' : 'badge-pending'
                  }`}>
                  {report.status === 'soumis' ? 'Soumis' : 'Non soumis'}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                {report.title}
              </p>

              {/* Si un fichier a été téléversé, on l'affiche avec son nom et sa date */}
              {report.fileName && (
                <div className="flex items-center gap-2 text-sm">
                  <span aria-hidden="true">📄</span>
                  <span className="text-foreground">{report.fileName}</span>
                  <span className="text-xs text-muted-foreground">
                    (Uploadé le {report.uploadedAt})
                  </span>
                </div>
              )}

              {/* Si le rapport a déjà été noté, on affiche sa note sur /20 */}
              {report.grade && (
                <div className="mt-2 p-2 bg-primary bg-opacity-10 rounded text-sm">
                  <span className="font-medium text-foreground">Note:</span> {report.grade}/20
                </div>
              )}
            </div>

            {/* Colonne des Actions : Noter ou Modifier la Note */}
            {/* On ne propose de noter que si le fichier est présent et non noté */}
            {report.fileName && !report.grade && (
              <div className="flex-shrink-0">
                {/* Si on est en train de modifier CE formulaire (input ouvert) */}
                {gradingId === report.id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(parseFloat(e.target.value))}
                      className="input-soft w-16 text-sm"
                      placeholder="/20"
                      aria-label="Note sur 20"
                    />
                    <button
                      onClick={() => handleSubmitGrade(report.id)}
                      className="btn-secondary text-sm whitespace-nowrap"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => setGradingId(null)}
                      className="btn-outline text-sm"
                      aria-label="Annuler la notation"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  // Bouton initial "Noter" pour ouvrir l'input
                  <button
                    onClick={() => {
                      setGradingId(report.id)
                      setGradeValue(0)
                    }}
                    className="btn-secondary text-sm"
                  >
                    Noter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
