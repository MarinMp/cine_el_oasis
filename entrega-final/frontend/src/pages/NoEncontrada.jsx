import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-24 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-duna-profunda">Error 404</p>
      <h1 className="font-display text-5xl">Esta página se perdió en el desierto</h1>
      <Link to="/" className="btn btn-primary">
        Volver a la cartelera
      </Link>
    </section>
  )
}
