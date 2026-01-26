import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  date,
  readingTime,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block py-6 border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
        <time>{date}</time>
        <span>&middot;</span>
        <span>{readingTime}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2">{excerpt}</p>
    </Link>
  );
}
