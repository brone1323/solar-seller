export interface BlogArticle {
  slug: string;
  title: string;
  sections: { heading: string; content: string[] }[];
  cta: string;
}

export const blogIntro = `Welcome to **Understanding Solar** — a practical, no-fluff blog that explains how solar really works, what drives costs, and how homeowners can make smart decisions (whether you hire it out or do it yourself). The goal is simple: help you buy better equipment, avoid expensive mistakes, and get your system approved the right way.

This content reinforces why Solar-DIY.com exists: design + equipment + permitting support so DIYers can lock in long-term energy savings with quality components.`;

export const blogArticles: BlogArticle[] = [
  {
    slug: 'solar-isnt-hard-just-unfamiliar',
    title: 'Solar Isn\'t "Hard" — It\'s Just Unfamiliar',
    sections: [
      {
        heading: 'What a solar system really is',
        content: [
          'Panels make DC power from sunlight',
          'An inverter converts DC to usable AC power',
          'Racking holds everything safely on your roof',
          'Permits + utility approval make it legal and interconnected',
        ],
      },
      {
        heading: 'Where people get stuck',
        content: [
          'The "unknowns" aren\'t the bolts and brackets—it\'s the design decisions: string sizing, roof layout, setbacks, and paperwork.',
        ],
      },
      {
        heading: 'DIY doesn\'t mean "alone"',
        content: [
          'A well-supported DIY path gives you the plan, the parts, and the approval documents—so you\'re doing the install work without guessing.',
        ],
      },
    ],
    cta: 'Start with a system design and permit-ready plan before you buy anything.',
  },
  {
    slug: 'what-youre-paying-for-traditional-solar',
    title: 'What Are You Actually Paying For in Traditional Solar Installs?',
    sections: [
      {
        heading: 'Installed price is more than labor',
        content: [
          'You\'re often paying for:',
          'Lead generation + sales commissions',
          'Truck rolls + scheduling overhead',
          'Markups and change orders',
          'Financing fees baked into pricing',
          '"Padding" for uncertainty in design and permitting',
        ],
      },
      {
        heading: 'The uncomfortable truth',
        content: [
          'Many tasks on a roof crew are mechanical: measuring, mounting, fastening, sealing. Important work—just not all "electrician-only" work.',
        ],
      },
      {
        heading: 'A better deal for hands-on homeowners',
        content: [
          'If you\'re capable and safety-minded, DIY can shift money away from overhead and into:',
          'Better equipment',
          'A cleaner design',
          'Proper permitting support',
        ],
      },
    ],
    cta: 'Compare your installed quote to equipment cost + design/permitting support and see where the gap really is.',
  },
  {
    slug: 'equipment-cheaper-quotes-not-dropping',
    title: 'Why Solar Equipment Keeps Getting Cheaper (And Why Quotes Don\'t Drop as Fast)',
    sections: [
      {
        heading: 'Why hardware prices trend down',
        content: [
          'Manufacturing scales',
          'Supply chains mature',
          'Competition increases',
          'Efficiency improves (more watts per panel)',
        ],
      },
      {
        heading: 'Why "installed solar" stays sticky',
        content: [
          'Customer acquisition costs rise',
          'Financing complexity increases',
          'Business overhead doesn\'t shrink like factories do',
          'Design/permitting time is still real work',
        ],
      },
      {
        heading: 'What you can do about it',
        content: [
          'DIY (with professional-grade planning) allows you to benefit from the equipment trend directly instead of paying for layers of overhead.',
        ],
      },
    ],
    cta: 'If you want price transparency, break the project into: design + equipment + permits + install labor.',
  },
  {
    slug: '30-year-energy-price-lock',
    title: 'The 30-Year Energy Price Lock: The Most Underrated Benefit of DIY Solar',
    sections: [
      {
        heading: 'What "locking in" means',
        content: [
          'Your panels don\'t care what electricity costs next year. Once installed, the sunlight portion of your energy becomes predictable.',
        ],
      },
      {
        heading: 'Why DIY amplifies the benefit',
        content: ['DIY can reduce the upfront cost—so your payback improves and your long-term savings grow.'],
      },
      {
        heading: 'The long-haul mindset',
        content: [
          'A solar array isn\'t a trendy gadget. Think:',
          'Consistent production',
          'Durable components',
          'Conservative design',
          'Correct approvals',
        ],
      },
    ],
    cta: 'Design for the next 30 years, not just the cheapest parts today.',
  },
  {
    slug: 'quality-matters-leave-it-alone',
    title: 'Quality Matters: Solar Is a "Leave It Alone" System',
    sections: [
      {
        heading: 'Where quality counts most',
        content: [
          'Racking that stays tight and sealed',
          'Inverters with strong warranties and proven reliability',
          'Proper wire management and weather-rated components',
          'Panels from manufacturers with real track records',
        ],
      },
      {
        heading: 'DIY doesn\'t mean cutting corners',
        content: ['DIY means moving budget away from sales overhead and into durable gear and solid design.'],
      },
      {
        heading: 'Rule of thumb',
        content: ['If a component is hard to access later (roof, attic runs), choose the higher-quality option now.'],
      },
    ],
    cta: 'Spend for longevity where replacement is painful.',
  },
  {
    slug: 'permits-are-the-backbone',
    title: 'Permits Aren\'t a "Nice to Have" — They\'re the System\'s Legal Backbone',
    sections: [
      {
        heading: 'Permits protect you',
        content: [
          'They reduce risk around:',
          'Fire and electrical safety standards',
          'Roof loading and attachment methods',
          'Utility interconnection requirements',
          'Insurance and resale questions',
        ],
      },
      {
        heading: 'Why DIYers get slowed down',
        content: ['Not because they can\'t install panels—but because paperwork is unfamiliar and mistakes cause delays.'],
      },
      {
        heading: 'What "permit-ready" support looks like',
        content: [
          'System drawings',
          'Line diagrams',
          'Equipment spec sheets',
          'Labeled layouts and set-back compliance',
        ],
      },
    ],
    cta: 'Do the paperwork once, correctly, before you climb the roof.',
  },
  {
    slug: 'roof-work-vs-electrical-work',
    title: 'Roof Work vs. Electrical Work: Know the Difference',
    sections: [
      {
        heading: 'The "roof" side (mechanical)',
        content: [
          'Layout, measurements, attachments',
          'Racking assembly',
          'Panel mounting and alignment',
          'Flashing/sealing discipline',
        ],
      },
      {
        heading: 'The "electrical" side (technical)',
        content: [
          'Correct string sizing and voltage limits',
          'Inverter placement and code compliance',
          'Conduit, grounding, labeling',
          'Tie-in rules for your local authority',
        ],
      },
      {
        heading: 'Smart DIY approach',
        content: [
          'Many DIYers do the mounting and hire a licensed electrician for final tie-in—while still saving big.',
        ],
      },
    ],
    cta: 'Split the project into stages and choose help strategically.',
  },
  {
    slug: 'design-is-where-diy-wins-or-loses',
    title: 'Design Is Where Most DIY Solar Wins (Or Loses)',
    sections: [
      {
        heading: 'Good design means',
        content: [
          'Proper panel placement (shade-aware)',
          'Correct inverter and system sizing',
          'Safe voltage/current limits',
          'Clean wire paths and roof penetrations',
          'Permit-ready documentation',
        ],
      },
      {
        heading: 'Bad design looks like',
        content: [
          '"We\'ll figure it out on the roof"',
          'Mismatched components',
          'Layout conflicts with setbacks/vents',
          'Production surprises after commissioning',
        ],
      },
      {
        heading: 'DIY advantage',
        content: ['If you start with a professional-quality design, installation becomes execution—not improvisation.'],
      },
    ],
    cta: 'Treat design like the foundation—not an afterthought.',
  },
  {
    slug: 'solar-myths-overpaying',
    title: 'Solar Myths That Keep Homeowners Overpaying',
    sections: [
      {
        heading: 'Myth: Solar is too complex for homeowners',
        content: ['Reality: With proper plans and support, the mechanical portion is very doable.'],
      },
      {
        heading: 'Myth: You must buy the "premium" installed package',
        content: ['Reality: Premium should describe equipment and design—not just a sales pitch.'],
      },
      {
        heading: 'Myth: Permits are optional',
        content: ['Reality: Permits are what protect your investment.'],
      },
      {
        heading: 'Myth: Cheapest equipment is "fine"',
        content: ['Reality: Roof systems should be built to last—repairs are costly.'],
      },
    ],
    cta: 'If a claim sounds like pressure, ask for drawings, specs, and warranties.',
  },
  {
    slug: 'cheaper-panels-not-cheaper-system',
    title: 'Why "Cheaper Panels" Doesn\'t Always Mean a Cheaper System',
    sections: [
      {
        heading: 'The real cost drivers',
        content: [
          'Inverter choice and warranties',
          'Racking quality and roof complexity',
          'Electrical balance-of-system components',
          'Permitting and interconnection requirements',
        ],
      },
      {
        heading: 'Where DIY helps',
        content: [
          'DIY reduces the "soft costs" that don\'t improve performance—so you can upgrade what actually matters.',
        ],
      },
      {
        heading: 'Focus on system value',
        content: [
          'A slightly higher-quality inverter or racking choice can prevent years of headaches.',
        ],
      },
    ],
    cta: 'Build a system, not a shopping cart.',
  },
  {
    slug: 'diy-solar-safety-right-way',
    title: 'DIY Solar Safety: The Right Way to Think About Risk',
    sections: [
      {
        heading: 'Three safety pillars',
        content: [
          'Proper design (electrical limits and layout)',
          'Proper tools and procedures (roof work is serious)',
          'Proper approvals (inspection and utility process)',
        ],
      },
      {
        heading: 'DIY doesn\'t remove standards',
        content: ['It makes you the person responsible for meeting them.'],
      },
      {
        heading: 'The best DIYers',
        content: ['Plan more than they build. They label, document, and follow the drawings.'],
      },
    ],
    cta: 'If you want savings, earn them with discipline—not shortcuts.',
  },
  {
    slug: 'how-solar-warranties-work',
    title: 'How Good Warranties Actually Work (And What to Watch For)',
    sections: [
      {
        heading: 'Warranty categories',
        content: [
          'Panel performance (long-term output expectations)',
          'Product/workmanship (defects)',
          'Inverter coverage (often shorter than panels)',
          'Racking coverage (corrosion and structural)',
        ],
      },
      {
        heading: 'What to watch',
        content: [
          'Who handles claims?',
          'Is labor included or only parts?',
          'Is the company likely to be around?',
          'Are serial numbers and install docs required?',
        ],
      },
      {
        heading: 'DIY tip',
        content: ['Keep a "system folder" with receipts, spec sheets, and photos.'],
      },
    ],
    cta: 'Choose brands that make warranty claims realistic, not theoretical.',
  },
  {
    slug: 'real-roi-formula',
    title: 'The Real ROI Formula: Production + Reliability + Approval Speed',
    sections: [
      {
        heading: 'ROI is not just cost',
        content: [
          'It\'s:',
          'How much your system produces',
          'How long it stays online',
          'How quickly it gets approved and commissioned',
        ],
      },
      {
        heading: 'DIY advantage',
        content: [
          'A clean design + correct permitting package can reduce back-and-forth and speed up approvals.',
        ],
      },
      {
        heading: 'Quality matters',
        content: ['Reliable gear avoids service calls and production gaps that silently eat savings.'],
      },
    ],
    cta: 'Optimize for smooth approval and long uptime, not just cheapest price.',
  },
  {
    slug: 'crew-not-electricians-quote',
    title: 'Why "Most of the Crew Isn\'t Electricians" Matters to Your Quote',
    sections: [
      {
        heading: 'What\'s typically happening',
        content: [
          'Many install tasks are:',
          'Repetitive',
          'Mechanical',
          'Trainable',
          'Still important—but not all "licensed electrician work"',
        ],
      },
      {
        heading: 'So what are you paying for?',
        content: ['Often: business overhead, sales structure, and risk buffers.'],
      },
      {
        heading: 'DIY flips the structure',
        content: [
          'You pay for:',
          'A correct design',
          'Quality equipment',
          'Permit-ready documentation',
          '…and you provide the installation effort.',
        ],
      },
    ],
    cta: 'Demand clarity: line items, equipment list, and what\'s included.',
  },
  {
    slug: 'diy-solar-timeline',
    title: 'DIY Solar Timeline: What a Smooth Project Looks Like',
    sections: [
      {
        heading: 'Typical stages',
        content: [
          '1. Site assessment + shade review',
          '2. System design and equipment selection',
          '3. Permitting package preparation',
          '4. Ordering and delivery coordination',
          '5. Roof install + electrical prep',
          '6. Inspection',
          '7. Utility approval and commissioning',
        ],
      },
      {
        heading: 'Where delays happen',
        content: [
          'Missing documents',
          'Wrong diagrams',
          'Last-minute equipment swaps',
          'Layout changes after permits are submitted',
        ],
      },
      {
        heading: 'DIY success habit',
        content: ['Lock the design first. Then buy.'],
      },
    ],
    cta: 'Start with a permit-ready plan so every step downstream is easier.',
  },
  {
    slug: 'choosing-an-inverter',
    title: 'Choosing an Inverter: The "Heart" of Your System',
    sections: [
      {
        heading: 'Key considerations',
        content: [
          'Warranty length and claim process',
          'Track record and support network',
          'Monitoring features you\'ll actually use',
          'Compatibility with your system design and goals',
        ],
      },
      {
        heading: 'DIY-friendly mindset',
        content: ['Pick the inverter that fits the design—not the one that\'s easiest to pitch.'],
      },
      {
        heading: 'Long-haul thinking',
        content: [
          'If the inverter is likely to be replaced sooner than panels, plan access and layout accordingly.',
        ],
      },
    ],
    cta: 'Choose reliability and support first; features second.',
  },
  {
    slug: 'racking-protects-your-home',
    title: 'Racking and Roof Attachments: The Part That Protects Your Home',
    sections: [
      {
        heading: 'What quality looks like',
        content: [
          'Correct flashing approach',
          'Proper spacing and torque',
          'Roof-type-specific attachments',
          'Clean alignment and cable management',
        ],
      },
      {
        heading: 'Why it matters',
        content: ['A cheap shortcut can turn into a leak, rot, repairs, and stress.'],
      },
      {
        heading: 'DIY win',
        content: [
          'With the right plan and components, you can install carefully—without rushing to hit a crew schedule.',
        ],
      },
    ],
    cta: 'Treat roof attachments as a roofing job, not just a solar job.',
  },
  {
    slug: 'specs-that-matter',
    title: 'Buying Solar Like a Pro: Specs That Actually Matter',
    sections: [
      {
        heading: 'Panels',
        content: [
          'Manufacturer reputation',
          'Warranty terms',
          'Degradation expectations',
          'Fit and layout on your roof',
        ],
      },
      {
        heading: 'Inverters',
        content: [
          'Warranty and support',
          'Monitoring and service access',
          'Compatibility with your system design',
        ],
      },
      {
        heading: 'System-level',
        content: [
          'Design quality and string limits',
          'Documentation readiness for permits',
          'Upgrade paths (like future storage)',
        ],
      },
    ],
    cta: 'Buy based on durability + design fit, not marketing buzzwords.',
  },
  {
    slug: 'diy-solar-resale-clean-transferable',
    title: 'DIY Solar and Resale Value: How to Keep It Clean and Transferable',
    sections: [
      {
        heading: 'What buyers want',
        content: [
          'Permits and approvals',
          'Clear equipment list and warranties',
          'Monitoring access',
          'A system that looks intentional (not improvised)',
        ],
      },
      {
        heading: 'What hurts resale',
        content: [
          'Missing inspection history',
          'Messy conduit runs',
          'Unknown equipment brands',
          'Unclear ownership or warranty transfer',
        ],
      },
      {
        heading: 'DIY best practice',
        content: ['Keep photos, diagrams, manuals, and approvals in one folder.'],
      },
    ],
    cta: 'Document like you\'re building for your future buyer—even if you never sell.',
  },
  {
    slug: 'solar-diy-approach-spend-smarter',
    title: 'The Solar-DIY Approach: Spend Less Where It Doesn\'t Matter, More Where It Does',
    sections: [
      {
        heading: 'Spend less on',
        content: [
          'Sales overhead you didn\'t ask for',
          'Markups that don\'t add durability',
          '"Bundled" pricing that hides line items',
        ],
      },
      {
        heading: 'Spend more on',
        content: [
          'A correct, permit-ready design',
          'Reliable panels, inverters, and racking',
          'Proper documentation and approvals',
        ],
      },
      {
        heading: 'The DIY advantage',
        content: [
          'DIYers can turn effort into equity: you install carefully, and the savings go into better components and long-term stability.',
        ],
      },
    ],
    cta: 'If you\'re hands-on, start with a design + permit package and build your system the smart way.',
  },
];
