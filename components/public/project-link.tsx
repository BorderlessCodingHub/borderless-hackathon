import { Github } from 'lucide-react'

interface ProjectLinkProps {
  project: string
  githubUrl?: string
  className?: string
  /** When false, renders plain text (use inside another link). Default true. */
  linked?: boolean
}

export function ProjectLink({ project, githubUrl, className = '', linked = true }: ProjectLinkProps) {
  const baseClass = `text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363] ${className}`

  if (!githubUrl || project === '—' || !linked) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${baseClass}`}>
        {project}
        {githubUrl && project !== '—' && <Github className="h-3 w-3 opacity-60" aria-hidden />}
      </span>
    )
  }

  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1.5 transition-colors hover:text-[#2debb1] ${baseClass}`}
    >
      {project}
      <Github className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden />
    </a>
  )
}
