function ErrorState({ message, onRetry }) {
  return <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700"><p>{message}</p>{onRetry && <button type="button" className="mt-4 font-semibold underline" onClick={onRetry}>Try again</button>}</div>
}

export default ErrorState
