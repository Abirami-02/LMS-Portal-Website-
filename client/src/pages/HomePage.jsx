import { Link } from 'react-router-dom'
import FeatureCard from '../components/FeatureCard'
import LearningOrbit from '../components/LearningOrbit'

const features = [
  { icon: '✦', title: 'Learn your way', description: 'A focused home for lessons, resources, and progress that keeps every next step clear.' },
  { icon: '↗', title: 'Build momentum', description: 'Set meaningful goals and turn consistent practice into skills you can use with confidence.' },
  { icon: '◎', title: 'Teach with purpose', description: 'Teachers can share knowledge, assignments, and feedback in one calm workspace.' },
]

function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <p className="eyebrow mb-5">A smarter way to learn</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">Make every lesson <span className="text-teal">count.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Smart Learning Portal brings students and teachers together in a calm, focused space built for meaningful progress.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/register" className="button-primary">Start learning <span className="ml-2">→</span></Link>
            <Link to="/login" className="button-secondary">I already have an account</Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-slate-500"><span className="grid h-8 w-8 place-items-center rounded-full bg-amber/30 text-navy">✓</span> Designed for students and teachers</div>
        </div>

        <LearningOrbit />
      </section>

      <section className="border-y border-slate-200/70 bg-white py-16 lg:py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="eyebrow mb-3">Built for progress</p><h2 className="max-w-xl text-3xl font-black tracking-tight text-ink sm:text-4xl">Everything you need to move forward.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div></div></section>
    </>
  )
}

export default HomePage
