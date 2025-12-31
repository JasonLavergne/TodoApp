import { GUEST_WARNING_DISMISSED_KEY } from '../utils/constants'

interface GuestWarningProps {
  onDismiss: () => void
}

export function GuestWarning({ onDismiss }: GuestWarningProps) {
  return (
    <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 mb-6 backdrop-blur-sm relative">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-amber-500/50 hover:text-amber-500/70 transition-colors duration-200 p-1 rounded-lg hover:bg-amber-500/5"
        title="Dismiss"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-start gap-3 pr-8">
        <svg className="w-5 h-5 text-amber-500/70 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-500/80 font-bold text-base">Guest Mode</span>
          </div>
          <p className="text-amber-500/70 text-sm">Your tasks are saved locally. Log in to sync across devices.</p>
        </div>
      </div>
    </div>
  )
}

