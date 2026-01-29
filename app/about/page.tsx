import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "B2B tech ghostwriter and content strategist helping executives build authority through compelling content",
};

const expertise = [
  {
    category: "Content Types",
    items: ["Executive Ghostwriting", "Thought Leadership", "White Papers", "Case Studies", "Newsletters"],
  },
  {
    category: "Industries",
    items: ["Enterprise Tech", "SaaS", "Financial Services", "AI/ML", "Cybersecurity"],
  },
  {
    category: "Services",
    items: ["Ghostwriting", "Content Strategy", "Editorial Direction", "Brand Voice Development"],
  },
  {
    category: "Platforms",
    items: ["LinkedIn", "Company Blogs", "Industry Publications", "Substack/Beehiiv"],
  },
];

const clients = [
  "IBM Consulting",
  "Northern Trust",
  "Sodexo",
  "Ball Corporation",
  "UBS",
  "Starbucks",
  "You.com",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">About</h1>

      {/* Bio Section */}
      <section className="mb-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            I&apos;m a B2B tech ghostwriter helping executives and companies share their
            expertise through content that actually gets read. I specialize in thought
            leadership that cuts through the noise and connects with decision-makers.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            My background spans content strategy, marketing, and editorial work for
            technology companies of all sizes—from Fortune 500 enterprises to high-growth
            startups. I&apos;ve written for CEOs, CTOs, and founders across industries
            including enterprise software, fintech, AI, and cybersecurity.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            I run{" "}
            <a
              href="https://totalemphasis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 underline underline-offset-2"
            >
              Total Emphasis
            </a>
            , a content consultancy focused on B2B tech. Whether it&apos;s building a
            CEO&apos;s LinkedIn presence, launching a company newsletter, or creating a
            content engine, I help turn complex ideas into clear, engaging narratives.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">What I do</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {expertise.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold text-orange-500 mb-3 uppercase tracking-wide">
                {group.category}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-gray-600 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Select clients</h2>
        <div className="flex flex-wrap gap-3">
          {clients.map((client) => (
            <span
              key={client}
              className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm"
            >
              {client}
            </span>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">How I work</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Discovery</h3>
              <p className="text-gray-600 text-sm">
                We start with a conversation to understand your goals, audience, and voice. I learn your business so I can write like you think.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Strategy</h3>
              <p className="text-gray-600 text-sm">
                I develop a content plan aligned with your business objectives—topics, formats, cadence, and distribution.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Creation</h3>
              <p className="text-gray-600 text-sm">
                I write, you review. Quick turnarounds, collaborative feedback, and content that sounds like you—because it should.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 rounded-xl p-8 md:p-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Let&apos;s talk</h2>
        <p className="text-gray-600 mb-6">
          Looking for a ghostwriter who understands B2B tech? I&apos;d love to hear about
          your project.
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
