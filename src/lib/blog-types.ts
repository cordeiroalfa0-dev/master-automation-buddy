export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogPostRecord {
  slug: string;
  title: string;
  excerpt: string;
  datePublished: string;
  readingTime: string;
  category: string;
  keyword?: string | null;
  coverImage?: string | null;
  published?: boolean;
  id?: string;
  content: BlogBlock[];
}