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

export const TOP_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Christopher Nolan Sets Next Epic Feature for IMAX Release in 2026',
    summary: 'Universal Pictures confirms production schedule with Matt Damon and Zendaya in preliminary talks for the star-studded mystery project.',
    source: 'EuroFilm Exclusive',
    timeAgo: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    category: 'Film News',
  },
  {
    id: 'n2',
    title: 'Avatar: Fire and Ash Debuts Extended Concept Showcase with James Cameron',
    summary: 'Director teases new volcanic Na’vi tribes and groundbreaking photorealistic oceanic physics ahead of global holiday release.',
    source: 'EuroFilm Reports',
    timeAgo: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    category: 'Box Office',
  },
  {
    id: 'n3',
    title: 'Spider-Man: Brand New Day Commences Principal Photography in New York',
    summary: 'Tom Holland returns in a grounded street-level adventure featuring Daredevil and new rogues gallery antagonists.',
    source: 'Cinema Wire',
    timeAgo: '8 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    category: 'Casting & Production',
  },
  {
    id: 'n4',
    title: 'Wicked: For Good Shatters International Advance Ticket Pre-Sales Record',
    summary: 'Universal reveals staggering musical box office figures topping holiday blockbuster estimates across 65 territories.',
    source: 'Box Office Central',
    timeAgo: '12 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop&q=80',
    category: 'Box Office',
  },
];

export const BOX_OFFICE_REGIONS: Record<'US' | 'India' | 'UK', BoxOfficeItem[]> = {
  US: [
    { rank: 1, title: 'Beetlejuice Beetlejuice', weekendGross: '$26.3M', totalGross: '$282.4M', weeksOut: 5 },
    { rank: 2, title: 'Deadpool & Wolverine', weekendGross: '$18.2M', totalGross: '$634.1M', weeksOut: 11 },
    { rank: 3, title: 'The Wild Robot', weekendGross: '$15.8M', totalGross: '$104.5M', weeksOut: 3 },
    { rank: 4, title: 'Transformers One', weekendGross: '$8.4M', totalGross: '$56.2M', weeksOut: 3 },
    { rank: 5, title: 'Speak No Evil', weekendGross: '$5.1M', totalGross: '$35.9M', weeksOut: 4 },
  ],
  India: [
    { rank: 1, title: 'Devara: Part 1', weekendGross: '₹95.4 Cr', totalGross: '₹410.2 Cr', weeksOut: 2 },
    { rank: 2, title: 'Stree 2', weekendGross: '₹32.1 Cr', totalGross: '₹840.5 Cr', weeksOut: 8 },
    { rank: 3, title: 'Jigra', weekendGross: '₹28.4 Cr', totalGross: '₹28.4 Cr', weeksOut: 1 },
    { rank: 4, title: 'Vettaiyan', weekendGross: '₹140.2 Cr', totalGross: '₹140.2 Cr', weeksOut: 1 },
    { rank: 5, title: 'GOAT (Greatest of All Time)', weekendGross: '₹12.0 Cr', totalGross: '₹455.0 Cr', weeksOut: 6 },
  ],
  UK: [
    { rank: 1, title: 'Joker: Folie à Deux', weekendGross: '£5.6M', totalGross: '£12.4M', weeksOut: 2 },
    { rank: 2, title: 'The Outrun', weekendGross: '£1.4M', totalGross: '£3.8M', weeksOut: 2 },
    { rank: 3, title: 'Beetlejuice Beetlejuice', weekendGross: '£1.1M', totalGross: '£25.8M', weeksOut: 5 },
    { rank: 4, title: 'A Different Man', weekendGross: '£680K', totalGross: '£1.2M', weeksOut: 1 },
    { rank: 5, title: 'Paddington in Peru (Early Tracking)', weekendGross: '£450K', totalGross: '£450K', weeksOut: 1 },
  ],
};

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
