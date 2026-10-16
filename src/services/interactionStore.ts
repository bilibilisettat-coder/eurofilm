export type ReactionType = 'like' | 'dislike' | 'love' | 'laugh' | 'surprise';

export interface MovieInteractions {
  rating: number; // 1 to 5
  ratingCount: number;
  averageRating: number;
  reactions: Record<ReactionType, number>;
  userRating?: number;
  userReaction?: ReactionType;
}

const STORAGE_KEY = 'eurofilm_user_interactions';

interface StoredData {
  userRatings: Record<number, number>;
  userReactions: Record<number, ReactionType>;
}

function getStoredData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return { userRatings: {}, userReactions: {} };
}

function saveStoredData(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // fallback
  }
}

// Deterministically generate initial reaction base numbers from movie ID
function getBaseNumbers(movieId: number) {
  const seed = (movieId * 9301 + 49297) % 233280;
  const baseLikes = 240 + (seed % 1400);
  const baseDislikes = 8 + (seed % 45);
  const baseLove = 180 + ((seed * 2) % 950);
  const baseLaugh = 35 + ((seed * 3) % 320);
  const baseSurprise = 60 + ((seed * 4) % 410);
  const baseStarRating = 4.2 + ((seed % 8) / 10);
  const baseRatingCount = 120 + (seed % 650);

  return {
    baseLikes,
    baseDislikes,
    baseLove,
    baseLaugh,
    baseSurprise,
    baseStarRating: Math.min(5, Math.max(3.8, baseStarRating)),
    baseRatingCount,
  };
}

export function getMovieInteractions(movieId: number): MovieInteractions {
  const stored = getStoredData();
  const base = getBaseNumbers(movieId);

  const userRating = stored.userRatings[movieId];
  const userReaction = stored.userReactions[movieId];

  const reactions: Record<ReactionType, number> = {
    like: base.baseLikes + (userReaction === 'like' ? 1 : 0),
    dislike: base.baseDislikes + (userReaction === 'dislike' ? 1 : 0),
    love: base.baseLove + (userReaction === 'love' ? 1 : 0),
    laugh: base.baseLaugh + (userReaction === 'laugh' ? 1 : 0),
    surprise: base.baseSurprise + (userReaction === 'surprise' ? 1 : 0),
  };

  const ratingCount = base.baseRatingCount + (userRating ? 1 : 0);
  const averageRating = userRating
    ? (base.baseStarRating * base.baseRatingCount + userRating) / ratingCount
    : base.baseStarRating;

  return {
    rating: userRating || 0,
    ratingCount,
    averageRating: Math.round(averageRating * 10) / 10,
    reactions,
    userRating,
    userReaction,
  };
}

export function recordUserRating(movieId: number, stars: number): MovieInteractions {
  const stored = getStoredData();
  stored.userRatings[movieId] = stars;
  saveStoredData(stored);
  return getMovieInteractions(movieId);
}

export function recordUserReaction(movieId: number, reaction: ReactionType): MovieInteractions {
  const stored = getStoredData();
  if (stored.userReactions[movieId] === reaction) {
    delete stored.userReactions[movieId]; // toggle off
  } else {
    stored.userReactions[movieId] = reaction;
  }
  saveStoredData(stored);
  return getMovieInteractions(movieId);
}
