'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PublicNavbarProps {
  slug?: string
}

export function PublicNavbar({ slug }: PublicNavbarProps = {}) {
  const pathname = usePathname()
  const base = slug ? `/${slug}` : ''
  const links = [
    { href: `${base}/`, label: 'Início' },
    { href: `${base}/resultados`, label: 'Resultados' },
    { href: `${base}/times`, label: 'Times' },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#222]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.12em] text-white sm:text-sm">
            Borderless<span className="hidden sm:inline"> · Hackathon</span>
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                (link.href === `${base}/` ? pathname === link.href : pathname.startsWith(link.href))
                  ? 'bg-white/12 font-semibold text-white'
                  : 'text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
