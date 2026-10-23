export interface CelebrityProfile {
  id: number;
  name: string;
  birthDate: string;
  age: number;
  knownFor: string;
  role: string;
  imageUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  imageUrl: string;
  category: string;
}

export interface BoxOfficeItem {
  rank: number;
  title: string;
  weekendGross: string;
  totalGross: string;
  weeksOut: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  totalVotes: number;
  options: { label: string; votes: number }[];
}

export const BORN_TODAY_CELEBS: CelebrityProfile[] = [
  {
    id: 1,
    name: 'Hugh Jackman',
    birthDate: 'October 12, 1968',
    age: 58,
    knownFor: 'Logan, The Greatest Showman, Les Misérables',
    role: 'Actor / Producer',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Guillermo del Toro',
    birthDate: 'October 9, 1964',
    age: 62,
    knownFor: "The Shape of Water, Pan's Labyrinth, Hellboy",
    role: 'Director / Screenwriter',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Matt Damon',
    birthDate: 'October 8, 1970',
    age: 56,
    knownFor: 'Good Will Hunting, The Martian, Oppenheimer',
    role: 'Actor / Writer',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Sigourney Weaver',
    birthDate: 'October 8, 1949',
    age: 77,
    knownFor: 'Alien, Avatar, Ghostbusters',
    role: 'Actress',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Kate Winslet',
    birthDate: 'October 5, 1975',
    age: 51,
    knownFor: 'Titanic, The Reader, Eternal Sunshine',
    role: 'Actress / Producer',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Brie Larson',
    birthDate: 'October 1, 1989',
    age: 37,
    knownFor: 'Room, Captain Marvel, Lessons in Chemistry',
    role: 'Actress / Director',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
];



export const SAMPLE_POLLS: CommunityPoll[] = [
  {
    id: 'poll-1',
    question: 'Which anticipated 2025/2026 blockbuster are you most excited to watch in theaters?',
    totalVotes: 14820,
    options: [
      { label: 'Superman (James Gunn)', votes: 4890 },
      { label: 'Avatar: Fire and Ash (James Cameron)', votes: 4120 },
      { label: 'The Odyssey (Nolan project)', votes: 3290 },
      { label: 'Project Hail Mary (Ryan Gosling)', votes: 2520 },
    ],
  },
  {
    id: 'poll-2',
    question: 'What is your favorite genre for a Friday cinema night?',
    totalVotes: 9840,
    options: [
      { label: 'Psychological Thriller & Mystery', votes: 3450 },
      { label: 'High-Octane Sci-Fi & Adventure', votes: 3120 },
      { label: 'Gripping Drama & True Crime', votes: 1980 },
      { label: 'Classic Horror & Supernatural', votes: 1290 },
    ],
  },
];
