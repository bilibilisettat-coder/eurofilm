export interface NewsArticleItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  imageUrl: string;
  category: 'Film News' | 'Celebrity News' | 'Box Office' | 'Streaming' | 'Casting' | 'Awards';
  link?: string;
}
