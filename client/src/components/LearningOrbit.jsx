import { useState } from 'react'

const orbitItems = {
  focus: { label: 'Focus', value: '01', detail: 'One clear step at a time.' },
  rhythm: { label: 'Rhythm', value: '68%', detail: 'Small habits become momentum.' },
  potential: { label: 'Potential', value: '∞', detail: 'There is always more to discover.' },
}

function LearningOrbit() {
  const [active, setActive] = useState('focus')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const current = orbitItems[active]

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10
    setTilt({ x: y, y: x })
  }

  return (
    <div className="relative mx-auto w-full max-w-md" onPointerMove={handlePointerMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full bg-amber/30 blur-2xl" />
      <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-full bg-teal/20 blur-2xl" />
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-navy p-7 shadow-soft transition-transform duration-300 sm:p-9" style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,159,154,0.35),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(245,185,66,0.2),transparent_32%)]" />
        <div className="relative flex items-center justify-between text-white/70"><span className="text-xs font-bold uppercase tracking-[0.2em]">Your learning space</span><span className="text-xl text-amber">✦</span></div>
        <div className="orbit-drift absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
        <div className="orbit-drift-reverse absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal/40" />
        <button type="button" onClick={() => setActive('focus')} className={`absolute left-8 top-28 z-10 rounded-2xl px-3 py-2 text-xs font-bold transition ${active === 'focus' ? 'bg-amber text-navy' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Focus</button>
        <button type="button" onClick={() => setActive('rhythm')} className={`absolute right-8 top-44 z-10 rounded-2xl px-3 py-2 text-xs font-bold transition ${active === 'rhythm' ? 'bg-teal text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Rhythm</button>
        <button type="button" onClick={() => setActive('potential')} className={`absolute bottom-12 left-1/2 z-10 -translate-x-1/2 rounded-2xl px-3 py-2 text-xs font-bold transition ${active === 'potential' ? 'bg-amber text-navy' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Potential</button>
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center"><p className="text-sm text-white/60">This week</p><p className="mt-2 text-5xl font-black text-white transition-all duration-300">{current.value}</p><p className="mt-2 text-lg font-bold text-white">{current.label}</p><p className="mt-2 max-w-[180px] text-xs leading-5 text-white/60">{current.detail}</p></div>
      </div>
    </div>
  )
}

export default LearningOrbit
