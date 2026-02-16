import Link from 'next/link';
import { blogIntro } from '@/data/blog';
import { getBlogArticlesWithFallback } from '@/lib/blogStorage';

export const metadata = {
  title: 'Understanding Solar | Solar DIY Blog',
  description: 'Practical, no-fluff articles on how solar works, what drives costs, and how homeowners can make smart decisions—whether you hire it out or DIY.',
};

function renderIntro(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') ? (
      <strong key={i} className="text-solar-leaf font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export default async function BlogPage() {
  const articles = await getBlogArticlesWithFallback();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-4">Understanding Solar</h1>
      <div className="prose prose-invert prose-slate max-w-none mb-12">
        <p className="text-slate-300 leading-relaxed">
          {renderIntro(blogIntro)}
        </p>
      </div>

      <h2 className="font-display text-xl font-semibold mb-6 text-slate-300">Articles</h2>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.slug || article.id}>
            <Link
              href={`/blog/${article.slug}`}
              className="block p-4 rounded-xl glass hover:bg-white/5 transition-colors group"
            >
              <h3 className="font-display font-semibold text-lg group-hover:text-solar-leaf transition-colors">
                {article.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                {article.sections[0]?.content[0] || article.cta}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
