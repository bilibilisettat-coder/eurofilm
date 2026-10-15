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

// Curated live feed baseline articles
const LIVE_BASE_ARTICLES: NewsArticleItem[] = [
  {
    id: 'news-1',
    title: 'Christopher Nolan Sets Next Epic Feature for IMAX Release in 2026',
    summary: 'Universal Pictures confirms production schedule with Matt Damon, Tom Holland, and Zendaya in preliminary talks for the star-studded mystery project.',
    source: 'EuroFilm Exclusive',
    timeAgo: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    category: 'Film News',
  },
  {
    id: 'news-2',
    title: 'Zendaya and Tom Holland Spotted at London Premieres Ahead of Spider-Man Pre-Production',
    summary: 'The Hollywood power couple addressed fan questions regarding the grounded, street-level tone promised for the fourth installment.',
    source: 'Celebrity Insider',
    timeAgo: '3 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    category: 'Celebrity News',
  },
  {
    id: 'news-3',
    title: 'Avatar: Fire and Ash Debuts Extended Concept Showcase with James Cameron',
    summary: 'Director teases new volcanic Na’vi tribes and groundbreaking photorealistic oceanic physics ahead of global holiday release.',
    source: 'EuroFilm Reports',
    timeAgo: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    category: 'Box Office',
  },
  {
    id: 'news-4',
    title: 'Sydney Sweeney Signs Multi-Picture First-Look Deal with Sony Following Rom-Com Success',
    summary: 'The Euphoria star expands her executive producing footprint across psychological thrillers and upcoming indie festival dramas.',
    source: 'Hollywood Reporter Wire',
    timeAgo: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    category: 'Celebrity News',
  },
  {
    id: 'news-5',
    title: 'Wicked: For Good Shatters International Advance Ticket Pre-Sales Record',
    summary: 'Universal reveals staggering musical box office figures topping holiday blockbuster estimates across 65 territories.',
    source: 'Box Office Central',
    timeAgo: '8 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop&q=80',
    category: 'Box Office',
  },
  {
    id: 'news-6',
    title: 'Timothée Chalamet and Kylie Jenner Make Rare Public Appearance at Fashion & Film Gala',
    summary: 'Chalamet discussed his grueling table tennis training regime for Marty Supreme while greeting fans on the red carpet.',
    source: 'Celebrity Central',
    timeAgo: '9 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    category: 'Celebrity News',
  },
  {
    id: 'news-7',
    title: 'Michael B. Jordan and Ryan Coogler Unveil Secrets Behind 1930s Vampire Thriller Sinners',
    summary: 'Warner Bros. holds private industry screening showcasing blues musical score and southern gothic blood effects.',
    source: 'Variety Film Daily',
    timeAgo: '11 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
    category: 'Film News',
  },
  {
    id: 'news-8',
    title: 'Cillian Murphy Celebrates Academy Award Year with Historic Dublin Theater Fundraiser',
    summary: 'The Oppenheimer star discusses returning to Peaky Blinders film set and his passion for supporting small independent art-house cinemas.',
    source: 'EuroFilm Spotlight',
    timeAgo: '14 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    category: 'Celebrity News',
  },
  {
    id: 'news-9',
    title: 'Netflix Enters Heated Bidding War for Japanese Horror Phenomenon Backrooms',
    summary: 'A24 and major streamers compete for international rights to the analog horror viral adaptation produced by James Wan.',
    source: 'Streaming Wire',
    timeAgo: '16 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    category: 'Streaming',
  },
  {
    id: 'news-10',
    title: 'Hugh Jackman and Ryan Reynolds Tease Unannounced Comic-Con Stage Surprise',
    summary: 'Fresh off their billion-dollar blockbuster run, the duo drops hints about co-hosting an upcoming Hollywood awards ceremony.',
    source: 'Celebrity Wire',
    timeAgo: '18 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    category: 'Celebrity News',
  },
];

// Reusable topic templates to synthesize realistic 1000+ article pool
const MOVIE_TOPICS = [
  'The Odyssey 2026 adaptation',
  'Project Hail Mary sci-fi saga',
  'Spider-Man: Brand New Day NYC shooting',
  'Avatar: Fire and Ash digital innovations',
  'Sinners southern gothic thriller',
  'Superman 2025 James Gunn reboot',
  'The Housemaid psychological thriller',
  'Marty Supreme 1950s NYC table tennis film',
  'Weapons mystery horror by Zach Cregger',
  'Mortal Kombat 2 Karl Urban Johnny Cage debut',
  'The Long Walk Stephen King brutal adaptation',
  'Wicked Part 2 holiday box office wave',
  'Zootopia 2 animated worldwide release',
  'Michael Jackson biopic starring Jaafar Jackson',
  'Tron: Ares cyberpunk soundtrack revelation',
  'Scream 7 ghostface revival in Montreal',
  'Wuthering Heights Margot Robbie period production',
  'K-Pop: Demon Hunters Sony musical animation',
  'Mandalorian & Grogu Star Wars theatrical release',
  'Deadpool & Wolverine home streaming records',
  'Beetlejuice Beetlejuice international box office',
  'Dune Part 3 Messiah script completion',
  'Gladiator II European premiere dispatches',
  'Joker: Folie à Deux critical post-mortem',
  'Nosferatu Robert Eggers dark gothic trailer',
  'Ballerina John Wick spin-off action showcases',
  'Alien: Romulus sequel discussions in Hollywood',
  'Captain America: Brave New World test reactions',
  'Fantastic Four: First Steps retro 1960s aesthetic',
  'Blade reboot status update from Marvel Studios',
];

const CELEB_NAMES = [
  'Zendaya', 'Tom Holland', 'Ryan Gosling', 'Sydney Sweeney', 'Timothée Chalamet',
  'Florence Pugh', 'Margot Robbie', 'Austin Butler', 'Cillian Murphy', 'Robert Downey Jr.',
  'Emma Stone', 'Pedro Pascal', 'Anya Taylor-Joy', 'Paul Mescal', 'Barry Keoghan',
  'Glen Powell', 'Jacob Elordi', 'Jenna Ortega', 'Michael B. Jordan', 'Ana de Armas',
  'Leonardo DiCaprio', 'Brad Pitt', 'Denzel Washington', 'Keanu Reeves', 'Charlize Theron',
  'Scarlett Johansson', 'Ryan Reynolds', 'Hugh Jackman', 'Anne Hathaway', 'Jessica Chastain',
];

const SOURCES = [
  'EuroFilm Wire', 'Variety Hollywood', 'Deadline Film Desk', 'The Hollywood Reporter',
  'Box Office Mojo', 'Cinema Insider', 'IndieWire Reports', 'ScreenDaily International',
  'Celebrity Dispatch', 'Entertainment Weekly', 'Cannes Daily', 'Venice Film Gazette'
];

const IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
];

// Generate 1,020 comprehensive articles
export function generateEntertainmentNewsCatalog(): NewsArticleItem[] {
  const catalog: NewsArticleItem[] = [...LIVE_BASE_ARTICLES];
  const totalTarget = 1050;

  for (let i = catalog.length; i < totalTarget; i++) {
    const isCeleb = i % 2 === 0;
    const celeb = CELEB_NAMES[i % CELEB_NAMES.length];
    const movie = MOVIE_TOPICS[i % MOVIE_TOPICS.length];
    const source = SOURCES[i % SOURCES.length];
    const image = IMAGES[i % IMAGES.length];
    const daysAgo = Math.floor(i / 15) + 1;
    const hoursAgo = (i % 24) + 1;
    const timeStr = daysAgo === 1 ? `${hoursAgo} hours ago` : `${daysAgo} days ago`;

    if (isCeleb) {
      const headlines = [
        `${celeb} Speaks Out on Career Turning Points and Upcoming Indie Blockbuster Collaboration`,
        `${celeb} Spotted on Red Carpet for European Film Festival Premiere of ${movie}`,
        `Exclusive Interview: ${celeb} on Method Acting, Physical Transformations, and Fan Devotion`,
        `${celeb} and Co-Stars Celebrate Record-Breaking Opening Weekend Numbers`,
        `${celeb} Signs Major Multi-Year Studio Producing Deal for Female-Led Thrillers`,
        `Behind the Scenes with ${celeb}: Director Praises Unmatched Discipline and Emotional Depth`,
        `${celeb} Addresses Casting Rumors for Next Major Christopher Nolan Mystery Project`,
        `Inside ${celeb}’s Unfiltered Thoughts on Social Media Scrutiny and Hollywood Press Tours`,
      ];
      const summaries = [
        `In an intimate conversation with industry journalists, ${celeb} opened up about creative risks, studio pressure, and the personal sacrifices required during long international filming schedules.`,
        `Following standing ovations at the international festival premiere, ${celeb} discussed the psychological intensity required to bring this complex role to the silver screen.`,
        `Industry insiders report that ${celeb}’s commanding presence on set earned praise from both veteran cinematographers and emerging indie co-stars during intense principal photography.`,
        `Speaking with foreign correspondents, ${celeb} revealed why working with visionary directors continues to dictate project choices over massive franchise paychecks.`,
      ];

      catalog.push({
        id: `news-${i + 1}`,
        title: headlines[i % headlines.length],
        summary: summaries[i % summaries.length],
        source,
        timeAgo: timeStr,
        imageUrl: image,
        category: 'Celebrity News',
      });
    } else {
      const categories: ('Film News' | 'Box Office' | 'Streaming' | 'Casting' | 'Awards')[] = [
        'Film News', 'Box Office', 'Streaming', 'Casting', 'Awards'
      ];
      const cat = categories[i % categories.length];
      const filmHeadlines = [
        `Production Dispatches: How the Visual Effects Team Built the World of ${movie}`,
        `Studio Executives Report Staggering Advance Ticket Sales for ${movie} Worldwide`,
        `Critical Review Roundup: Early Reactions for ${movie} Point to Record-Breaking Season`,
        `Director Breaks Down Jaw-Dropping Action Sequences in New Teaser for ${movie}`,
        `International Box Office Tracking Suggests ${movie} Could Open Above $140 Million`,
        `Streaming Rights Auction for ${movie} Sparks Intense Bidding War Among Tech Giants`,
        `Behind the Soundstage: Why Practical Stunts Replaced CGI in Key Sequences of ${movie}`,
        `Awards Season Buzz Intensifies for Cinematography and Editing in ${movie}`,
      ];
      const filmSummaries = [
        `Universal and partner distributors confirm extensive 70mm and IMAX rollouts across major territories as theatrical tracking numbers continue to exceed initial quarter forecasts.`,
        `With principal photography officially wrapped in London and Prague, the creative crew prepares for extensive sound engineering and orchestral scoring sessions.`,
        `Movie theater chains express renewed confidence in holiday season attendance as advance ticket sales set new modern post-pandemic benchmarks across global markets.`,
        `Cinematographers detail the custom anamorphic lenses and natural lighting rigs utilized to deliver an authentic, tactile visual texture on screen.`,
      ];

      catalog.push({
        id: `news-${i + 1}`,
        title: filmHeadlines[i % filmHeadlines.length],
        summary: filmSummaries[i % filmSummaries.length],
        source,
        timeAgo: timeStr,
        imageUrl: image,
        category: cat,
      });
    }
  }

  return catalog;
}
