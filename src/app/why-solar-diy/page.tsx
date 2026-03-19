import Link from 'next/link';
import { Check, ArrowRight, Zap, FileText, PlayCircle, MessageCircle, Layout } from 'lucide-react';

const steps = [
  { num: 1, label: 'Share your project info', desc: 'Tell us your roof size, goals, and electrical basics.' },
  { num: 2, label: 'Get your system package', desc: 'Equipment + directions + drawings + video links delivered.' },
  { num: 3, label: 'Submit permits with confidence', desc: 'Use our ready-made documents to get approval fast.' },
  { num: 4, label: 'Install step-by-step', desc: 'Follow the guide with live expert support on standby.' },
  { num: 5, label: 'Pass inspection & operate', desc: 'Turn on your system and start generating clean power.' },
];

const included = [
  { icon: Layout, title: 'A system designed for your home', color: 'solar-sky', items: ['System layout guidance', 'Correct equipment pairing', 'Clean bill of materials'] },
  { icon: FileText, title: 'Permit-ready drawings & docs', color: 'solar-leaf', items: ['Plan-style drawings', 'Electrical single-line diagrams', 'Equipment spec sheets', 'Utility submission support'] },
  { icon: Zap, title: 'Step-by-step directions', color: 'accent-sun', items: ['Installation sequence checklist', 'Hardware & mounting guidance', 'Cable management tips', 'Safety reminders'] },
  { icon: PlayCircle, title: 'Curated installation videos', color: 'solar-sky', items: ['How-to-mount walkthroughs', 'Wiring routing examples', 'Inspection-readiness guidance'] },
  { icon: MessageCircle, title: 'Live expert support', color: 'solar-leaf', items: ['Quick troubleshooting', 'Photo-based "does this look right?" checks', 'Clarifying steps & diagrams'] },
];

const checkItems = [
  'Right equipment matched to your home',
  'Clear, step-by-step installation directions',
  'Permit & utility approval drawings',
  'Video guidance for visual learners',
  'Live expert chat when you\'re stuck',
];

export default function WhySolarDIYPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060d1f] via-[#082240]/70 to-[#041a0f]/50" />
        <div className="orb orb-sky w-[400px] h-[400px] top-[-80px] right-[-80px] animate-orb-float opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-4">Why choose us</p>
          <h1 className="font-display text-4xl lg:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
            Solar DIY, done{' '}
            <span className="gradient-text">right</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mb-8">
            Anyone can sell you panels and a box of hardware. We give you the equipment <em>and</em> the full roadmap — so you go from &quot;I want solar&quot; to approved, installed, and turned on.
          </p>
          <Link
            href="/products"
            className="btn-solar inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white"
          >
            Browse Equipment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <p className="section-label mb-2">What&apos;s included</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            What you get that most &quot;kit sellers&quot; don&apos;t include
          </h2>
        </div>

        <div className="space-y-5">
          {included.map((item, i) => (
            <div key={item.title} className="glass-card p-6 flex gap-5 items-start">
              <div className={`w-11 h-11 rounded-xl bg-${item.color}/15 border border-${item.color}/25 flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-5 h-5 text-${item.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-slate-600 text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display font-bold text-base">{item.title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {item.items.map((li) => (
                    <li key={li} className="flex items-center gap-2 text-sm text-slate-400">
                      <Check className="w-3.5 h-3.5 text-solar-leaf flex-shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="glass-strong rounded-3xl p-8 lg:p-10 border-solar-sky/15" style={{ background: 'rgba(14,165,233,0.04)' }}>
          <h3 className="font-display text-2xl font-bold mb-2">
            The result: fewer delays, fewer mistakes
          </h3>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Most DIY headaches come from missing docs, unclear steps, or nobody to ask when something doesn&apos;t make sense. Our approach prevents that.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {checkItems.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-slate-200 text-sm">
                <div className="w-5 h-5 rounded-full bg-solar-leaf/20 border border-solar-leaf/40 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-solar-leaf" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <p className="section-label mb-2">The process</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-white/[0.07] hidden sm:block" />
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-solar-sky/15 border border-solar-sky/30 flex items-center justify-center font-display font-bold text-solar-sky text-sm z-10">
                  {step.num}
                </div>
                <div className="pb-4 pt-1.5">
                  <div className="font-semibold text-white text-sm mb-0.5">{step.label}</div>
                  <div className="text-slate-500 text-sm">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card rounded-3xl p-10 text-center glow-solar border-solar-sky/20">
          <h3 className="font-display text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
            Ready to build your DIY solar{' '}
            <span className="gradient-text">the smart way?</span>
          </h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            If you want a solar setup that&apos;s organized, supported, and permit-ready — Solar-DIY is built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="btn-solar inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white"
            >
              Browse Equipment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass border border-white/15 font-semibold hover:bg-white/10 transition-all"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
