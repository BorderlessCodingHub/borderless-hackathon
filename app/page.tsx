import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  let hackathons: Awaited<ReturnType<typeof fetchQuery<typeof api.hackathons.list>>>
  try {
    hackathons = await fetchQuery(api.hackathons.list, {})
  } catch (err) {
    console.error(
      '[HomePage] fetchQuery(api.hackathons.list) failed:',
      err instanceof Error ? `${err.message}\n${err.stack}` : err,
    )
    throw err
  }
  if (hackathons.length > 0) redirect(`/${hackathons[0].slug}`)

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="glass max-w-lg w-full rounded-2xl p-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-4">
          Borderless Hackathon
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">
          Nenhum hackathon por aqui ainda
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          Ainda não há nenhum hackathon cadastrado. Volte em breve ou entre no painel
          administrativo para criar o primeiro.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-[var(--brand-purple)] text-white hover:opacity-90 transition"
        >
          Acessar admin
        </Link>
      </div>
    </main>
  )
}
