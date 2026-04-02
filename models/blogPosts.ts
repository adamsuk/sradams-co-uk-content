export interface BlogMeta {
  slug?: string;
  title?: string;
  desc?: string;
  date?: string;
  public?: boolean;
  tags?: string[];
}

export interface BlogPost {
  name: string;
  slug?: string;
  meta: BlogMeta;
  content: string;
  error?: boolean;
}
