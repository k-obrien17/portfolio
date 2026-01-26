import Link from "next/link";
import { getPublishedContent, formatDate, getStats } from "@/lib/content";
import { getFeaturedContent } from "@/lib/featured";
import { getWorkType, WORK_TYPES } from "@/lib/taxonomy";

export default function Home() {
  const recentContent = getPublishedContent().slice(0, 5);
  const featuredContent = getFeaturedContent();
  const stats = getStats();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 leading-tight">
          I help B2B tech executives
          <br />
          <span className="text-orange-500">build authority through content.</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
          Ghostwriter and content strategist for technology leaders. I turn complex
          ideas into clear narratives that resonate with decision-makers and drive results.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Work with me
          </Link>
          <Link
            href="/writing"
            className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            View my work
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-10 gap-y-4 mt-14 pt-8 border-t border-gray-100">
          <div>
            <div className="text-2xl font-semibold text-gray-900">{stats.totalPieces}+</div>
            <div className="text-sm text-gray-500">Published pieces</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900">{stats.organizations}</div>
            <div className="text-sm text-gray-500">Clients served</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900">{stats.publications}</div>
            <div className="text-sm text-gray-500">Publications</div>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Featured work</h2>
          <Link
            href="/writing"
            className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-4">
          {featuredContent.map((piece) => (
            <a
              key={piece.id}
              href={piece.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-5 border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                      {piece.workTypeLabel}
                    </span>
                    {piece.publication && piece.publication !== "LinkedIn" && (
                      <span className="text-xs text-gray-400">{piece.publication}</span>
                    )}
                  </div>
                  <h3 className="text-gray-900 group-hover:text-orange-600 transition-colors font-medium mb-1">
                    {piece.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {piece.organization} · {piece.summary}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* What I Do */}
      <section className="mb-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">What I do</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Executive Ghostwriting</h3>
            <p className="text-sm text-gray-600">
              LinkedIn posts, bylines, and thought leadership content that builds your personal brand and positions you as an industry voice.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Content Strategy</h3>
            <p className="text-sm text-gray-600">
              End-to-end content programs that align with business goals, from editorial calendars to distribution strategy.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Long-form Content</h3>
            <p className="text-sm text-gray-600">
              White papers, case studies, and reports that demonstrate expertise and generate qualified leads.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Newsletter & Blog</h3>
            <p className="text-sm text-gray-600">
              Consistent, high-quality content that keeps your audience engaged and positions your company as a thought leader.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Work */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent work</h2>
          <Link
            href="/writing"
            className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            View all →
          </Link>
        </div>
        {recentContent.length > 0 ? (
          <div className="space-y-1">
            {recentContent.map((piece) => (
              <a
                key={piece.id}
                href={piece.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-4 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-gray-900 group-hover:text-orange-600 transition-colors font-medium">
                      {piece.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {piece.organization}
                      {piece.contentType && ` · ${WORK_TYPES[getWorkType(piece.contentType)].label}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 pt-1">
                    {formatDate(piece.published)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Content coming soon.</p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gray-50 rounded-xl p-8 md:p-10 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Ready to elevate your content?</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Let&apos;s discuss how I can help you build authority and drive results through strategic content.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
