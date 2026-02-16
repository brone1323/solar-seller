import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

export default function WhySolarDIYPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
        Why Solar-DIY.com is Better
      </h1>
      <p className="text-xl text-slate-300 mb-12 leading-relaxed">
        DIY solar, done right — with a plan, not just parts
      </p>

      <p className="text-slate-300 mb-12 leading-relaxed">
        Anyone can sell you panels and a box of hardware. The difference is what happens after the delivery truck leaves.
      </p>

      <p className="text-slate-300 mb-12 leading-relaxed">
        At Solar-DIY.com, you get the equipment + the full roadmap: clear directions, permit-ready drawings, installation video links, and the paperwork support that helps you move from &quot;I want solar&quot; to approved, installed, and turned on.
      </p>

      <p className="text-slate-300 mb-16 font-medium">
        You&apos;re not buying a kit. You&apos;re getting a complete DIY solar project package.
      </p>

      <h2 className="font-display text-2xl font-bold mb-8">
        What you get (that most &quot;kit sellers&quot; don&apos;t include)
      </h2>

      <div className="space-y-16">
        <section>
          <h3 className="font-display text-xl font-semibold mb-4 text-solar-leaf">
            1) A system designed for your home
          </h3>
          <p className="text-slate-300 mb-4">
            Not a generic bundle. Your plan is built around your roof, electrical setup, and goals—so everything fits and works together the first time.
          </p>
          <p className="text-slate-400 font-medium mb-2">Included:</p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>System layout guidance (so panels land where they should)</li>
            <li>Correct equipment pairing (panels, inverter, racking, protection)</li>
            <li>Clean, organized bill of materials so you know exactly what&apos;s included</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-xl font-semibold mb-4 text-solar-leaf">
            2) Permit-ready drawings & documentation
          </h3>
          <p className="text-slate-300 mb-4">
            Permits and utility approval can be the most confusing part of DIY solar. We make it easier by providing the drawings and supporting documents you need to submit.
          </p>
          <p className="text-slate-400 font-medium mb-2">Included (varies by area):</p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Plan-style drawings (layout + key details)</li>
            <li>Electrical single-line diagrams</li>
            <li>Equipment spec sheets and labels</li>
            <li>Permit/utility submission support documents</li>
            <li>Guidance for inspection readiness</li>
          </ul>
          <p className="text-slate-400 mt-4">
            Local requirements vary — but our goal stays the same: help you submit with confidence and reduce back-and-forth.
          </p>
        </section>

        <section>
          <h3 className="font-display text-xl font-semibold mb-4 text-solar-leaf">
            3) Step-by-step directions you can actually follow
          </h3>
          <p className="text-slate-300 mb-4">
            No guessing. No &quot;figure it out from forums.&quot; We give you a clear build path so you know what to do, in what order, and what to double-check.
          </p>
          <p className="text-slate-400 font-medium mb-2">Included:</p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Installation sequence checklist</li>
            <li>Hardware and mounting guidance</li>
            <li>Cable management and best-practice tips</li>
            <li>Safety reminders and common-mistake prevention</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-xl font-semibold mb-4 text-solar-leaf">
            4) Installation video links for each key step
          </h3>
          <p className="text-slate-300 mb-4">
            Some people learn best by watching. We provide curated video links that match the steps you&apos;re doing—so you can see what &quot;correct&quot; looks like before you drill, mount, or wire.
          </p>
          <p className="text-slate-400 font-medium mb-2">Expect:</p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>&quot;How to mount&quot; walkthroughs</li>
            <li>&quot;How to route and secure wiring&quot; examples</li>
            <li>&quot;What inspectors look for&quot; style guidance</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-xl font-semibold mb-4 text-solar-leaf">
            5) Live chat access to real technical experts
          </h3>
          <p className="text-slate-300 mb-4">
            DIY doesn&apos;t mean you&apos;re alone.
          </p>
          <p className="text-slate-300 mb-4">
            When you&apos;re on the roof, in the garage, or staring at a diagram thinking &quot;wait…,&quot; you can use live chat to get support from people who actually know solar installs.
          </p>
          <p className="text-slate-400 font-medium mb-2">Live support can help with:</p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Quick troubleshooting</li>
            <li>Photo-based &quot;does this look right?&quot; checks</li>
            <li>Clarifying steps and diagrams</li>
            <li>Catching issues early (before they become expensive)</li>
          </ul>
        </section>
      </div>

      <div className="glass rounded-2xl p-8 my-16">
        <h3 className="font-display text-xl font-semibold mb-6">
          The result: fewer delays, fewer mistakes, faster approval
        </h3>
        <p className="text-slate-300 mb-6">
          Most DIY headaches come from missing documentation, unclear steps, or having no one to ask when something doesn&apos;t make sense. Our whole approach is built to prevent that.
        </p>
        <ul className="space-y-2">
          {['Right equipment', 'Clear directions', 'Drawings and documents for permits/utility approval', 'Video help for visual learners', 'Live expert chat when you\'re stuck'].map((item) => (
            <li key={item} className="flex items-center gap-2 text-slate-200">
              <Check className="w-5 h-5 text-solar-leaf shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <section className="mb-16">
        <h3 className="font-display text-xl font-semibold mb-6">How it works</h3>
        <ol className="list-decimal list-inside text-slate-300 space-y-3">
          <li>Share your project info (roof, goals, electrical basics)</li>
          <li>Get your system package (equipment + directions + drawings + video links)</li>
          <li>Submit for permits / utility approval with confidence</li>
          <li>Install step-by-step with support available</li>
          <li>Pass inspection and get approval to operate (where applicable)</li>
        </ol>
      </section>

      <div className="glass rounded-2xl p-8 text-center">
        <h3 className="font-display text-2xl font-bold mb-4">
          Ready to build your DIY solar the smart way?
        </h3>
        <p className="text-slate-300 mb-6">
          If you want a DIY solar setup that&apos;s organized, supported, and permit-ready, Solar-DIY.com is built for you.
        </p>
        <p className="text-slate-400 mb-8">
          Start your plan today — and if you have questions, open live chat and talk to a technical expert.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90 transition-opacity"
        >
          Start Your Plan <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
