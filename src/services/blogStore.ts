export interface BlogComment {
  id: string;
  author: string;
  date: string;
  text: string;
  likes: number;
}

export interface BlogInteractionState {
  ratings: Record<string, number>; // postId -> user rating (1-5)
  comments: Record<string, BlogComment[]>; // postId -> list of comments
}

const STORAGE_KEY = 'eurofilm_blog_interactions_v1';

const INITIAL_SAMPLE_COMMENTS: Record<string, BlogComment[]> = {
  'blog-1': [
    {
      id: 'c-101',
      author: 'Marcus Aurelius Fan',
      date: '2 days ago',
      text: 'Completely agree Julian! Every time they touch Homer they turn it into 300 part 2. Leave the Odyssey to real playwrights.',
      likes: 42,
    },
    {
      id: 'c-102',
      author: 'Cinephile99',
      date: '1 day ago',
      text: 'You are being way too harsh on the visual effects team. The cyclops rendering in the leaked footage was actually unreal.',
      likes: 19,
    },
  ],
  'blog-2': [
    {
      id: 'c-201',
      author: 'Astrophysics_Nerd',
      date: '3 days ago',
      text: 'Rocky the alien is going to steal the show regardless of how much math Ryan Gosling mumbles at the screen. Can’t wait.',
      likes: 38,
    },
  ],
  'blog-4': [
    {
      id: 'c-401',
      author: 'PandoraTourist',
      date: '4 days ago',
      text: 'Say what you want about the dialogue, Cameron makes pure cinematic oxygen. My 3D ticket is already reserved.',
      likes: 54,
    },
  ],
};

function getStoredBlogData(): BlogInteractionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ratings: parsed.ratings || {},
        comments: { ...INITIAL_SAMPLE_COMMENTS, ...parsed.comments },
      };
    }
  } catch {
    // fallback
  }
  return {
    ratings: {},
    comments: INITIAL_SAMPLE_COMMENTS,
  };
}

function saveStoredBlogData(state: BlogInteractionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // fallback
  }
}

export function getBlogPostRating(postId: string, defaultScore: number): {
  userRating: number;
  averageRating: number;
  totalRatings: number;
} {
  const state = getStoredBlogData();
  const userRating = state.ratings[postId] || 0;
  const baseCount = 84 + (postId.charCodeAt(postId.length - 1) * 3);
  const totalCount = baseCount + (userRating > 0 ? 1 : 0);
  const avg = userRating > 0
    ? (defaultScore * baseCount + userRating) / totalCount
    : defaultScore;

  return {
    userRating,
    averageRating: Math.round(avg * 10) / 10,
    totalRatings: totalCount,
  };
}

export function recordBlogRating(postId: string, rating: number): void {
  const state = getStoredBlogData();
  state.ratings[postId] = rating;
  saveStoredBlogData(state);
}

export function getBlogComments(postId: string): BlogComment[] {
  const state = getStoredBlogData();
  return state.comments[postId] || INITIAL_SAMPLE_COMMENTS[postId] || [];
}

export function addBlogComment(postId: string, author: string, text: string): BlogComment {
  const state = getStoredBlogData();
  const currentList = state.comments[postId] || INITIAL_SAMPLE_COMMENTS[postId] || [];
  const newComment: BlogComment = {
    id: `comment-${Date.now()}`,
    author: author.trim() || 'Anonymous Film Lover',
    date: 'Just now',
    text: text.trim(),
    likes: 1,
  };

  state.comments[postId] = [newComment, ...currentList];
  saveStoredBlogData(state);
  return newComment;
}
