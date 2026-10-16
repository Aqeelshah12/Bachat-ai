import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function GoalCard({ goal, onAddProgress, onDelete }) {
  const { t } = useLanguage()
  const [amount, setAmount] = useState('')
  const [adding, setAdding] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100))
  const isComplete = goal.saved >= goal.target

  async function handleAdd(e) {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return

    setAdding(true)
    await onAddProgress(goal._id, Number(amount))
    setAmount('')
    setAdding(false)
  }

  function handleDeleteClick() {
    if (confirmingDelete) {
      onDelete(goal._id)
    } else {
      setConfirmingDelete(true)
    }
  }

  return (
    <div
      className={`bg-paper rounded-2xl p-6 border transition-colors ${
        isComplete ? 'border-marigold ring-1 ring-marigold/40' : 'border-ink/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{goal.title}</h3>
          {goal.deadline && (
            <p className="text-xs text-ink/50 mt-0.5">
              {t('goalCard.target')}: {goal.deadline}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="text-xs font-medium text-ink bg-marigold px-2.5 py-1 rounded-full whitespace-nowrap">
              ✅ Ready to buy
            </span>
          ) : (
            <span className="text-xs font-medium text-marigold bg-marigold/15 px-2.5 py-1 rounded-full whitespace-nowrap">
              {percent}%
            </span>
          )}

          <button
            type="button"
            onClick={handleDeleteClick}
            onBlur={() => setConfirmingDelete(false)}
            aria-label="Delete goal"
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
              confirmingDelete
                ? 'bg-rose text-paper'
                : 'text-ink/40 hover:text-rose hover:bg-rose/10'
            }`}
          >
            {confirmingDelete ? 'Confirm?' : '✕'}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2.5 bg-ink/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-marigold rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-ink/60">
          Rs {goal.saved.toLocaleString()} / Rs {goal.target.toLocaleString()} {t('goalCard.saved')}
        </p>
      </div>

      {isComplete ? (
        <p className="mt-4 text-sm text-ink/70 bg-marigold/10 border border-marigold/25 rounded-lg px-3 py-2.5">
          🎉 You've saved enough for {goal.title} — go ahead and buy it!
        </p>
      ) : (
        <form onSubmit={handleAdd} className="mt-4 flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('goalCard.addSavings')}
            className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-ink text-paper px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {adding ? '...' : t('goalCard.add')}
          </button>
        </form>
      )}
    </div>
  )
}