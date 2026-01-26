import Link from "next/link";

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ProjectCard({
  slug,
  title,
  description,
  tags,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group block p-6 border border-gray-100 rounded-lg hover:border-orange-200 transition-colors"
    >
      <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
