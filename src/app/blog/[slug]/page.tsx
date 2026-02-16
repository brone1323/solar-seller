import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogArticlesWithFallback } from '@/lib/blogStorage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getBlogArticlesWithFallback();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} | Solar DIY`,
    description: article.cta,
  };
}

export async function generateStaticParams() {
  const articles = await getBlogArticlesWithFallback();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getBlogArticlesWithFallback();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-slate-400 hover:text-solar-leaf text-sm mb-8 transition-colors"
      >
        ← Understanding Solar
      </Link>

      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
        {article.title}
      </h1>

      <div className="space-y-10">
        {article.sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-xl font-semibold text-solar-leaf mb-4">
              {section.heading}
            </h2>
            <div className="space-y-2 text-slate-300 leading-relaxed">
              {section.content.map((item, j) =>
                item.endsWith(':') ? (
                  <p key={j} className="font-medium mb-2">{item}</p>
                ) : (
                  <div key={j} className="flex gap-2">
                    <span className="text-solar-leaf/70 shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl glass border-l-4 border-solar-leaf">
        <p className="text-slate-300 font-medium">
          <span className="text-solar-leaf">Next step: </span>
          {article.cta}
        </p>
      </div>

      <Link
        href="/blog"
        className="inline-flex mt-8 text-slate-400 hover:text-solar-leaf transition-colors"
      >
        ← Back to all articles
      </Link>
    </article>
  );
}
