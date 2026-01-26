import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const blogDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        date: data.date || "",
        readingTime: stats.text,
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    excerpt: data.excerpt || "",
    date: data.date || "",
    readingTime: stats.text,
    content,
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
