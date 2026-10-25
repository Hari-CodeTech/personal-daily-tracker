import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDestructive
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
