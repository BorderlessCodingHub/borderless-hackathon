import { Info } from 'lucide-react'

interface ScoringNoteProps {
  note: string
  className?: string
}

export function ScoringNote({ note, className = '' }: ScoringNoteProps) {
  return (
    <div className={`mx-auto max-w-2xl rounded-xl border border-white/[0.08] bg-[#2a2a2b]/60 px-5 py-4 ${className}`}>
      <div className="flex gap-3">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#9810fa]" aria-hidden />
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
            Como calculamos
          </p>
          <p className="text-sm leading-relaxed text-[#9a9a9a]">{note}</p>
        </div>
      </div>
    </div>
  )
}
