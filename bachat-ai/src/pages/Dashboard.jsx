import { useState, useEffect, useRef } from 'react'
import GoalCard from '../components/GoalCard'
import { useLanguage } from '../context/LanguageContext'

export default function Dashboard() {
  const { t, language } = useLanguage()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  const [goals, setGoals] = useState([])
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')
  const [goalError, setGoalError] = useState('')

  const [balance, setBalance] = useState(null)

  // --- Editing a parsed entry (fix a misparse) ---
  const [editingEntry, setEditingEntry] = useState(false)
  const [editIncome, setEditIncome] = useState([])
  const [editExpenses, setEditExpenses] = useState([])
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')

  // --- Suggest adding new income toward a goal ---
  const [allocatedGoalId, setAllocatedGoalId] = useState(null)

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError(t('dashboard.micNotSupported'))
      return
    }

    // Roman Urdu isn't a spoken language of its own - it's Urdu speech written
    // in Latin letters. So for both "ur" and "roman" UI languages, we listen
    // for actual spoken Urdu; our backend AI already understands the
    // resulting Urdu-script text regardless of which UI language is active.
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'en' ? 'en-US' : 'ur-PK'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setError(`Voice input failed: ${event.error}`)
      setIsListening(false)
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  function stopListening() {
    recognitionRef.current?.stop()
  }

  async function loadBalance() {
    try {
      const token = localStorage.getItem('bachat_token')
      const res = await fetch('http://localhost:5000/api/entries/summary', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setBalance(data)
    } catch (err) {
      // Silently ignore - balance card just won't show.
    }
  }

  useEffect(() => {
    async function loadGoals() {
      try {
        const token = localStorage.getItem('bachat_token')
        const res = await fetch('http://localhost:5000/api/goals', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) setGoals(data.goals)
      } catch (err) {
        // Silently ignore - goals section will just show empty state.
      }
    }
    loadGoals()
    loadBalance()
  }, [])

  async function handleAddGoal(e) {
    e.preventDefault()
    if (!goalTitle.trim() || !goalTarget || Number(goalTarget) <= 0) return

    setGoalError('')

    try {
      const token = localStorage.getItem('bachat_token')
      const res = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: goalTitle.trim(),
          target: Number(goalTarget),
          deadline: goalDeadline.trim() || null,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setGoalError(data.message || 'Could not create the goal.')
        return
      }

      setGoals([data.goal, ...goals])
      setGoalTitle('')
      setGoalTarget('')
      setGoalDeadline('')
      setShowGoalForm(false)
    } catch (err) {
      setGoalError('Could not reach the server. Is the backend running?')
    }
  }

  async function handleAddProgress(goalId, addAmount) {
    try {
      const token = localStorage.getItem('bachat_token')
      const res = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addAmount }),
      })
      const data = await res.json()

      if (!res.ok) {
        console.error(data.message)
        return
      }

      setGoals(goals.map((g) => (g._id === goalId ? data.goal : g)))
    } catch (err) {
      console.error('Could not reach the server.')
    }
  }

  async function handleDeleteGoal(goalId) {
    try {
      const token = localStorage.getItem('bachat_token')
      const res = await fetch(`http://localhost:5000/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const data = await res.json()
        console.error(data.message)
        return
      }

      setGoals(goals.filter((g) => g._id !== goalId))
    } catch (err) {
      console.error('Could not reach the server.')
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('bachat_token')
      const res = await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, language }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong.')
        return
      }

      setResult(data)
      setEditIncome(data.entry.income || [])
      setEditExpenses(data.entry.expenses || [])
      setEditingEntry(false)
      setEditError('')
      setAllocatedGoalId(null)
      setText('')
      loadBalance()
    } catch (err) {
      setError('Could not reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function startEditingEntry() {
    setEditingEntry(true)
  }

  function cancelEditingEntry() {
    setEditIncome(result.entry.income || [])
    setEditExpenses(result.entry.expenses || [])
    setEditingEntry(false)
    setEditError('')
  }

  function updateIncomeField(idx, field, value) {
    setEditIncome((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item))
    )
  }

  function updateExpenseField(idx, field, value) {
    setEditExpenses((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item))
    )
  }

  async function handleSaveEdits() {
    setSavingEdit(true)
    setEditError('')

    try {
      const token = localStorage.getItem('bachat_token')
      const res = await fetch(`http://localhost:5000/api/entries/${result.entry._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ income: editIncome, expenses: editExpenses }),
      })
      const data = await res.json()

      if (!res.ok) {
        setEditError(data.message || 'Could not save your changes.')
        return
      }

      setResult({ ...result, entry: data.entry })
      setEditingEntry(false)
      loadBalance()
    } catch (err) {
      setEditError('Could not reach the server.')
    } finally {
      setSavingEdit(false)
    }
  }

  const totalNewIncome = result ? (result.entry.income || []).reduce((sum, i) => sum + Number(i.amount || 0), 0) : 0
  const incompleteGoals = goals.filter((g) => g.saved < g.target)

 async function handleAllocateToGoal(goalId) {
  if (allocatedGoalId) return
  await handleAddProgress(goalId, totalNewIncome)
  setAllocatedGoalId(goalId)
}

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="font-display text-3xl text-ink">{t('dashboard.greeting')}</h1>
      </div>
      <p className="mt-1 text-ink/60">{t('dashboard.subtitle')}</p>

      {/* Running balance */}
      {balance && (
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          <div className="bg-paper border border-ink/10 rounded-2xl p-5">
            <p className="text-sm text-ink/50">{t('dashboard.totalIncome')}</p>
            <p className="mt-1 font-display text-2xl text-ink">
              Rs {balance.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-paper border border-ink/10 rounded-2xl p-5">
            <p className="text-sm text-ink/50">{t('dashboard.totalExpenses')}</p>
            <p className="mt-1 font-display text-2xl text-ink">
              Rs {balance.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div
            className={`rounded-2xl p-5 border ${
              balance.balance >= 0
                ? 'bg-marigold/15 border-marigold/30'
                : 'bg-rose/10 border-rose/25'
            }`}
          >
            <p className={`text-sm ${balance.balance >= 0 ? 'text-ink/60' : 'text-rose/80'}`}>
              {balance.balance >= 0 ? t('dashboard.netBalance') : t('dashboard.shortBy')}
            </p>
            <p
              className={`mt-1 font-display text-2xl ${
                balance.balance >= 0 ? 'text-ink' : 'text-rose'
              }`}
            >
              Rs {Math.abs(balance.balance).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Chat input */}
      <div className="mt-8 bg-ink text-paper rounded-3xl p-8">
        <h2 className="font-display text-2xl">{t('dashboard.chatTitle')}</h2>
        <p className="mt-2 text-paper/70 text-sm max-w-md">{t('dashboard.chatSub')}</p>
        <form onSubmit={handleSend} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('dashboard.placeholder')}
            className="flex-1 rounded-xl bg-paper/10 border border-paper/20 px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:outline-none focus:ring-2 focus:ring-marigold/60"
          />
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isListening
                ? 'bg-rose text-paper animate-pulse'
                : 'bg-paper/10 border border-paper/20 text-paper hover:bg-paper/20'
            }`}
          >
            🎤
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-marigold text-ink px-6 py-3 rounded-xl text-sm font-medium hover:bg-marigold/90 transition-colors disabled:opacity-50"
          >
            {loading ? t('dashboard.thinking') : t('dashboard.send')}
          </button>
        </form>
        {isListening && (
          <p className="mt-3 text-sm text-marigold">{t('dashboard.listening')}</p>
        )}
        {error && (
          <p className="mt-3 text-sm text-rose-200" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 bg-paper border border-ink/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-ink font-medium">{result.summary}</p>
            {!editingEntry && (
              <button
                onClick={startEditingEntry}
                className="text-xs text-ink/50 hover:text-ink border border-ink/15 rounded-full px-3 py-1 whitespace-nowrap"
              >
                Edit
              </button>
            )}
          </div>

          {!editingEntry ? (
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {result.entry.income.length > 0 && (
                <div>
                  <p className="text-sm text-ink/50 mb-2">{t('dashboard.incomeLogged')}</p>
                  {result.entry.income.map((i, idx) => (
                    <p key={idx} className="text-sm text-ink/80">
                      Rs {i.amount} — {i.period} {i.note && `(${i.note})`}
                    </p>
                  ))}
                </div>
              )}
              {result.entry.expenses.length > 0 && (
                <div>
                  <p className="text-sm text-ink/50 mb-2">{t('dashboard.expensesLogged')}</p>
                  {result.entry.expenses.map((exp, idx) => (
                    <p key={idx} className="text-sm text-ink/80">
                      {exp.type}: Rs {exp.amount} ({exp.frequency})
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {editIncome.length > 0 && (
                <div>
                  <p className="text-sm text-ink/50 mb-2">{t('dashboard.incomeLogged')}</p>
                  <div className="space-y-2">
                    {editIncome.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateIncomeField(idx, 'amount', e.target.value)}
                          className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
                          placeholder="Amount"
                        />
                        <input
                          type="text"
                          value={item.period || ''}
                          onChange={(e) => updateIncomeField(idx, 'period', e.target.value)}
                          className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
                          placeholder="Period"
                        />
                        <input
                          type="text"
                          value={item.note || ''}
                          onChange={(e) => updateIncomeField(idx, 'note', e.target.value)}
                          className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
                          placeholder="Note"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editExpenses.length > 0 && (
                <div>
                  <p className="text-sm text-ink/50 mb-2">{t('dashboard.expensesLogged')}</p>
                  <div className="space-y-2">
                    {editExpenses.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={item.type || ''}
                          onChange={(e) => updateExpenseField(idx, 'type', e.target.value)}
                          className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
                          placeholder="Type"
                        />
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateExpenseField(idx, 'amount', e.target.value)}
                          className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
                          placeholder="Amount"
                        />
                        <input
                          type="text"
                          value={item.frequency || ''}
                          onChange={(e) => updateExpenseField(idx, 'frequency', e.target.value)}
                          className="rounded-lg border border-ink/15 px-3 py-2 text-sm"
                          placeholder="Frequency"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editError && (
                <p className="text-sm text-rose" role="alert">
                  {editError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdits}
                  disabled={savingEdit}
                  className="bg-ink text-paper px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  onClick={cancelEditingEntry}
                  className="text-ink/60 px-4 py-2 rounded-lg text-sm font-medium hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Suggest allocating new income toward a goal */}
          {!editingEntry && totalNewIncome > 0 && incompleteGoals.length > 0 && (
  <div className="mt-5 pt-5 border-t border-ink/10">
    {allocatedGoalId ? (
      <p className="text-sm text-ink/70">
        ✓ You've already added Rs {totalNewIncome.toLocaleString()} to{' '}
        {goals.find((g) => g._id === allocatedGoalId)?.title || 'a goal'} from this entry.
      </p>
    ) : (
      <>
        <p className="text-sm text-ink/70 mb-3">
          Put some of that Rs {totalNewIncome.toLocaleString()} toward a goal?
        </p>
        <div className="flex flex-wrap gap-2">
          {incompleteGoals.map((goal) => (
            <button
              key={goal._id}
              onClick={() => handleAllocateToGoal(goal._id)}
              className="text-sm bg-marigold/15 text-ink border border-marigold/30 px-4 py-2 rounded-full hover:bg-marigold/25 transition-colors"
            >
              + Add to {goal.title}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
)}
          
        </div>
      )}

      {/* Goals */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">{t('dashboard.goalsTitle')}</h2>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="text-sm bg-ink text-paper px-4 py-2 rounded-full hover:bg-ink/90 transition-colors"
          >
            {showGoalForm ? t('dashboard.cancel') : t('dashboard.addGoal')}
          </button>
        </div>

        {showGoalForm && (
          <form
            onSubmit={handleAddGoal}
            className="mt-4 bg-paper border border-ink/10 rounded-2xl p-6 grid sm:grid-cols-3 gap-4"
          >
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder={t('dashboard.goalName')}
              className="rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
            />
            <input
              type="number"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              placeholder={t('dashboard.goalTarget')}
              className="rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
            />
            <input
              type="text"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
              placeholder={t('dashboard.goalDeadline')}
              className="rounded-xl border border-ink/15 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-marigold/60"
            />
            <button
              type="submit"
              className="sm:col-span-3 bg-marigold text-ink py-2.5 rounded-xl text-sm font-medium hover:bg-marigold/90 transition-colors"
            >
              {t('dashboard.createGoal')}
            </button>
            {goalError && (
              <p className="sm:col-span-3 text-sm text-rose" role="alert">
                {goalError}
              </p>
            )}
          </form>
        )}

        {goals.length === 0 ? (
          <div className="mt-4 bg-paper border border-ink/10 rounded-2xl p-6">
            <p className="text-sm text-ink/60">{t('dashboard.noGoals')}</p>
          </div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} onAddProgress={handleAddProgress} onDelete={handleDeleteGoal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}