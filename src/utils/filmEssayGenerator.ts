import { MovieDetail } from '../services/tmdb';
import { NEW_THEME_KEYWORDS } from '../data/keywords';

export interface EssaySection {
  h2: string;
  subsections: {
    h3: string;
    paragraphs: string[];
  }[];
}

export interface FilmEssay {
  h1: string;
  author: string;
  totalWords: number;
  sections: EssaySection[];
}

export function generateFilmEssay(movie: MovieDetail, genreNames: string[]): FilmEssay {
  const title = movie.title || 'This Motion Picture';
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'Contemporary';
  const genresStr = genreNames.length > 0 ? genreNames.join(', ') : 'Cinematic Drama';
  const primaryGenre = genreNames[0] || 'Drama';
  const synopsis = movie.overview || 'A journey through profound psychological and dramatic stakes.';
  const tagline = movie.tagline ? `"${movie.tagline}"` : `An unyielding exploration into the abyss of human drama.`;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '8.0';

  const castList = movie.credits?.cast || [];
  const leadActor = castList[0]?.name || 'the principal lead';
  const leadChar = castList[0]?.character || 'the central figure';
  const supportingActor = castList[1]?.name || 'the secondary lead';
  const supportingChar = castList[1]?.character || 'the counterweight';
  const thirdActor = castList[2]?.name || 'the ensemble anchor';
  const thirdChar = castList[2]?.character || 'the pivotal catalyst';

  // Seed sample contextual keywords from the new theme keywords list
  const kw = (index: number) => NEW_THEME_KEYWORDS[index % NEW_THEME_KEYWORDS.length];

  const h1 = `${title} (${year}): An Immersive Study of Suspense, Atmospheric Tension, and the Complex Climax`;

  const sections: EssaySection[] = [
    // CHAPTER 1
    {
      h2: `The First Breath: My Initial Descent into the World of ${title}`,
      subsections: [
        {
          h3: `First-Person Immersion: When the Screen Awakens`,
          paragraphs: [
            `As a lifelong student of cinematic craft writing under EuroFilm, I still vividly recall the precise sensation that gripped my chest when I first encountered ${title}. From the opening moments, the film establishes an atmospheric density that refuses to accommodate passive observation. I was not merely invited into an auditorium seat to witness an entertaining distraction; I was thrust into an emotional crucible where every shadow, every calculated cadence of silence, and every flick of ambient illumination suggested an unspoken danger lurking just beyond the frame's peripheral boundary.`,
            `The cinematic pedigree of ${title} emerges from its refusal to spoon-feed its audience easy resolutions. Instead, as I watched the introductory frames unspool, I recognized the distinct markers of high-caliber ${genresStr} filmmaking reminiscent of anticipated milestones like ${kw(0)}, ${kw(1)}, and ${kw(6)}: an uncompromising fidelity to psychological realism, a refusal to shield characters from consequence, and an overarching tonal precision that vibrates with impending turbulence. In an era where ${kw(7)} frequently sacrifice narrative gravity in favor of ephemeral spectacle, this picture captured my imagination precisely because it treats narrative pacing not as a race toward an explosion, but as a deliberate tightening of an emotional vice.`,
            `My immediate response to the film was one of intense sensory hyper-awareness. The director commands our gaze with predatory patience, establishing the central world of ${title} with meticulous environmental texture. Whether through the stifling claustrophobia of its interior spaces or the vast, indifferent emptiness of its exteriors, the mise-en-scène immediately signals to cinema lovers that this narrative operates on multiple symbolic planes. We are bearing witness to an interior spiritual crisis dressed in the visceral garments of high-stakes cinematic storytelling, echoing the suspenseful dread seen in ${kw(12)}, ${kw(13)}, and ${kw(18)}.`,
          ],
        },
        {
          h3: `Thematic Foundations: Overview of the Ideological Battleground`,
          paragraphs: [
            `At its thematic core, ${title} grapples with questions that have preoccupied the greatest storytellers across film history: the fragility of human identity when confronted by extreme trauma, the corrupting influence of unchecked desire, and the terrifying realization that our worst adversary often resides within our own mirrored reflections. The synopsis itself—${synopsis}—only skims the surface of the roiling existential undercurrents that animate every chapter of this production.`,
            `What struck me most forcefully during my viewing was how the filmmakers deploy the conventions of ${primaryGenre} to disarm us, only to subvert those very tropes in service of an uncompromising moral inquiry. Taglined memorably as ${tagline}, the piece never allows the audience the luxury of moral complacency. I found myself constantly recalibrating my allegiances, interrogating the motives of every figure on screen, much as one does when analyzing ${kw(21)}, ${kw(22)}, and ${kw(29)}. I wondered whether any character could emerge from this labyrinth with their soul intact.`,
            `To understand ${title} as a true lover of cinema is to understand that tension is not merely generated by sudden revelations. True, bone-deep suspense is forged when we, the viewers, care desperately about the moral survival of individuals caught in an insurmountable dilemma. As I navigated the early acts, I became increasingly aware that every choice made by ${leadActor} as ${leadChar} was carrying us irreversibly toward an existential precipice, mirroring the stakes found in ${kw(36)}, ${kw(41)}, and ${kw(47)}.`,
          ],
        },
      ],
    },

    // CHAPTER 2
    {
      h2: `The Architecture of Suspense: A Meticulous Plot Deconstruction`,
      subsections: [
        {
          h3: `The Inciting Fracture: When Equilibrium Shatters`,
          paragraphs: [
            `Let me walk you through the structural blueprint of the narrative, because it is here that the brilliance of the screenplay reveals its clockwork perfection. The story begins in what appears to be a tenuous state of equilibrium. We are introduced to the diurnal rhythms of ${leadChar}, portrayed with breathtaking vulnerability by ${leadActor}. We observe the subtle compromises, the small evasions, and the domestic or professional routines that form the armor of everyday existence.`,
            `Yet, as I scrutinized these establishing scenes, I noted how the framing already foretold an inevitable rupture. The camera lingers a beat too long on ordinary objects; the sound design subtly emphasizes discordant ambient frequencies; the interactions between ${leadChar} and ${supportingActor}'s ${supportingChar} vibrate with latent unspoken animosity. When the inciting incident finally strikes, it does not arrive as an isolated external shock, but as the logical eruption of fissures that had been slowly widening beneath the narrative floorboards, a trait cinephiles cherish in ${kw(50)}, ${kw(56)}, and ${kw(62)}.`,
            `The moment the primary disruption occurs, the entire narrative calculus changes. I felt the collective intake of breath in the theater: the realization that the old rules governing these lives had been instantaneously incinerated. ${title} does not grant its protagonist the luxury of contemplative retreat. Instead, each reactive decision sets off a chain reaction of unintended consequences, dragging the viewer into an ever-tightening spiral of moral and physical jeopardy that calls to mind classic tension from ${kw(70)}, ${kw(76)}, and ${kw(81)}.`,
          ],
        },
        {
          h3: `The Escalating Trap: The Midpoint and Irreversible Commitments`,
          paragraphs: [
            `As the narrative advances through its second act, the sophistication of the storytelling becomes undeniable. Too many contemporary films suffer from a sagging middle act, where narrative momentum stalls while characters wait for the third-act bell to ring. But in ${title}, I observed a masterclass in narrative acceleration. Every revelation does not simplify the equation; it complicates it, adding fresh variables of betrayal, peril, and ethical ambiguity.`,
            `The introduction of ${thirdActor} as ${thirdChar} injects a volatile chemical into an already combustible brew. I watched with mounting anxiety as ${leadChar} attempted to navigate conflicting loyalties, deceitful promises, and the agonizing ticking clock that underpins the entire dilemma. It is during this crucial stretch that the film transitions from an engaging ${primaryGenre} into a gripping psychological thriller of the highest order, standing proudly alongside ${kw(90)}, ${kw(96)}, and ${kw(105)}.`,
            `By the time the narrative arrived at its midpoint, I realized with a shudder that there was no longer any path back to safety. The bridges had been burned; the secrets had spilled into the open; and the protagonist had made a fateful moral compromise that sealed their destiny. This is what separates routine genre cinema from true cinematic art: the knowledge that the trap closing around the characters is one they helped construct with their own hands, an existential dilemma reminiscent of ${kw(115)}, ${kw(122)}, and ${kw(130)}.`,
          ],
        },
      ],
    },

    // CHAPTER 3
    {
      h2: `The Crucible of Character: Psychological Torment and Virtuosic Performances`,
      subsections: [
        {
          h3: `The Protagonist in Extremis: An In-Depth Dissection of the Lead Performance`,
          paragraphs: [
            `I have watched hundreds of performances across global cinema, but what ${leadActor} achieves here as ${leadChar} belongs in the pantheon of magnetic screen acting. The role demands an extraordinary emotional continuum: shifting from quiet stoicism to unvarnished terror, from cold tactical calculation to raw, sobbing desperation. Rather than playing the obvious beats of heroic resolve, ${leadActor} allows the character's profound flaws, petty jealousies, and paralyzing doubts to flicker across their face in devastating close-ups.`,
            `There is a specific sequence in the film—one that I found myself replaying mentally for days afterward—where the camera holds steady on ${leadActor}'s eyes for nearly two uninterrupted minutes while an earth-shattering realization dawns upon them. Without speaking a single syllable of expository dialogue, the actor conveys the collapse of an entire worldview. It is a stunning display of cinematic restraint that recalls legendary portrayals in ${kw(140)}, ${kw(148)}, and ${kw(155)}, reminding cinephiles that film acting at its apex is the art of internal architecture made visible to the camera lens.`,
            `Furthermore, the psychological evolution of ${leadChar} mirrors the audience's own moral crisis. At first, I felt an unreserved sympathy for their predicament. But as the stakes climb and the pressure reaches bone-crushing intensity, we watch them cross ethical thresholds that we would like to believe we would never cross. By implicating the audience in these harrowing choices, ${title} forces us into an uncomfortable collusion with a protagonist who is gradually losing their humanity in order to survive, much like the anti-heroes in ${kw(162)}, ${kw(170)}, and ${kw(178)}.`,
          ],
        },
        {
          h3: `The Dynamic Antagonisms: Ensemble Synergy and Moral Counterweights`,
          paragraphs: [
            `A compelling central performance requires equally formidable counterweights, and in ${supportingActor}'s portrayal of ${supportingChar}, the film discovers its dark philosophical shadow. Far from being a cardboard antagonist or generic foil, ${supportingChar} operates according to an internal logic that is terrifyingly rational within their own twisted worldview. In their shared scenes with ${leadActor}, the air crackles with kinetic tension; the dialogue is delivered not as casual conversation, but as a fencing duel where every thrust seeks an existential jugular.`,
            `I was equally captivated by the texture brought by ${thirdActor} as ${thirdChar}. Every gesture, every sideways glance, and every hushed whisper in the periphery adds layers of world-building that enrich the central narrative. The ensemble works in harmonious dissonance, like an orchestra tuned to produce chords of mounting unease, a dynamic praised in works such as ${kw(185)}, ${kw(192)}, and ${kw(200)}. There are no throwaway characters in this landscape; every individual who crosses the frame represents a distinct perspective on the central dilemma of trust, survival, and moral culpability.`,
            `When I analyze the relational dynamics of the cast, I am struck by how skillfully the script avoids cliché. Relationships are depicted with all the thorny, unresolved contradictions of real life: love is entangled with resentment, loyalty is tested by self-preservation, and betrayal is born not of malice, but of tragic exhaustion. This psychological authenticity ensures that when the final confrontation looms, the stakes feel overwhelmingly intimate and devastatingly real, a standard we celebrate across ${kw(210)}, ${kw(218)}, and ${kw(225)}.`,
          ],
        },
      ],
    },

    // CHAPTER 4
    {
      h2: `The Sensory Grammar: Cinematography, Soundscapes, and Atmospheric Tension`,
      subsections: [
        {
          h3: `The Framing of Dread: Visual Language and Palette`,
          paragraphs: [
            `No thorough cinephilic appreciation of ${title} would be complete without scrutinizing its visual vocabulary. The director of photography constructs a visual language that operates as an unspoken narrative parallel. I observed how the framing subtly shifts across the three acts: beginning with steady, composed widescreen compositions that evoke control, before gradually dissolving into tighter, more claustrophobic angles, handheld tremors, and jarring shallow depths of field as the psychological pressure mounts.`,
            `The color grading is equally deliberate. Rather than opting for the desaturated gray sludge so prevalent in modern digital cinema, the filmmakers employ a striking, high-contrast palette where deep obsidian blacks swallow the backgrounds, leaving characters illuminated by harsh, unforgiving sources of light. Shadows in ${title} are not passive voids; they are active, hungry participants in the storytelling, continually threatening to engulf the fragile human figures fighting for survival, echoing the visual mastery of ${kw(230)}, ${kw(235)}, and ${kw(240)}.`,
            `I found myself marveling at the geometric rigor of the shot compositions. Chiaroscuro lighting techniques reminiscent of classic German Expressionism and American film noir are repurposed for a modern cinematic sensibility. Hallways appear interminable; doorways become framing devices that trap characters like specimens beneath a microscope; and the physical architecture of the setting mirrors the labyrinthine psychological traps from which there is no peaceful escape, a craft seen in ${kw(245)}, ${kw(250)}, and ${kw(255)}.`,
          ],
        },
        {
          h3: `The Acoustic Menace: Sound Design and Musical Architecture`,
          paragraphs: [
            `Equally integral to the film's nerve-shredding suspense is its extraordinary acoustic architecture. In my estimation, sound design is the most subliminally powerful weapon in a filmmaker's arsenal, and here it is wielded with masterly authority. The soundtrack does not rely on cheap, blaring jump scares to elicit an involuntary reflex from the viewer. Instead, it weaves a low-frequency sonic tapestry of mechanical hums, distant metallic groans, rhythmic heartbeats, and sudden, deafening absences of sound that make your eardrums strain in terror.`,
            `The musical score avoids sweeping melodic bombast, opting instead for discordant string textures, haunting ambient motifs, and percussive pulses that synchronize with the audience's escalating heart rates. During the sequences of peak suspense, the music often recedes entirely, leaving us trapped with only the ragged breathing of ${leadActor} and the terrifying crunch of approaching footsteps, creating tension akin to ${kw(260)}, ${kw(265)}, and ${kw(270)}.`,
            `As someone who listens to films as intensely as I watch them, I found the acoustic craftsmanship of ${title} to be nothing short of breathtaking. It reminded me of the golden age of thrillers—where the sonic space was treated as an invisible psychological realm that could manipulate the spectator's dread far more effectively than any visual trickery ever could, a benchmark visible throughout ${kw(275)}, ${kw(280)}, and ${kw(285)}.`,
          ],
        },
      ],
    },

    // CHAPTER 5
    {
      h2: `The Crescendo: Anatomy of the Complex Climax and Unforgiving Resolution`,
      subsections: [
        {
          h3: `The Convergence of Threats: The Ticking Clock Reaches Zero`,
          paragraphs: [
            `Now I must address what is undeniably the film's crowning achievement, and the sequence that will leave viewers clutching the edges of their seats in breathless anticipation: the magnificent, multi-layered complex climax. As the narrative careens into its third act, the disparate plot strands that the filmmakers have so patiently spun across the preceding two hours suddenly begin to converge toward a singular point of catastrophic impact.`,
            `I watched with heart-in-mouth intensity as the ticking clock, both literal and metaphorical, reached its absolute limit. There is no convenient Deus Ex Machina waiting to rescue these characters; there are no magical reprieves. The trap has snapped shut, and the only path forward is through the fire. The sequence begins with an agonizingly protracted sequence of suspense where every second feels stretched across a razor's edge. The editing during this sequence is nothing short of miraculous, cutting between parallel lines of action with such surgical rhythm that the suspense becomes almost physically unbearable, evocative of ${kw(290)}, ${kw(295)}, and ${kw(300)}.`,
            `When ${leadChar} and ${supportingChar} finally face the inevitable reckoning, the confrontation defies all conventional expectations. It is not a standard battle of physical prowess; it is a brutal, agonizing clash of competing truths, hidden sacrifices, and irrevocable revelations. The secrets that were whispered in shadows during the early chapters now explode into the blinding light, and the consequences are both shocking and utterly, mercilessly logical, fulfilling the narrative promise seen in ${kw(305)}, ${kw(310)}, and ${kw(315)}.`,
          ],
        },
        {
          h3: `The Complex Twist and the Cost of Survival`,
          paragraphs: [
            `What elevates this climax into the territory of genuine cinematic greatness is the complexity of its resolution. Just when I believed I had solved the narrative puzzle, the filmmakers pull off a series of breathtaking revelations that recontextualize every preceding scene. Yet, unlike lesser thrillers that rely on cheap gimmicks that insult the viewer's intelligence, this climax rewards close scrutiny. Every twist was meticulously foreshadowed; every breadcrumb had been dropped in plain sight, hidden only by our own preconceptions.`,
            `The emotional cost of the climax is staggering. As I watched the final confrontation reach its peak, I was overwhelmed not by triumphant adrenaline, but by a profound, tragic awe. Survival, when it comes in ${title}, is extracted at an astronomical price. There are no clean victories here. The characters who walk away from this ordeal will carry the scars—both physical and metaphysical—for the remainder of their days, and we as spectators are left reeling from the sheer weight of what transpires, a dramatic weight shared with ${kw(320)}, ${kw(325)}, and ${kw(330)}.`,
            `The climax achieves that rarest of cinematic achievements: a conclusion that satisfies the intellect while striking the emotional solar plexus with the force of a sledgehammer. It leaves the viewer suspended in a state of breathless wonder, gasping as the final narrative dominoes tumble into place with terrifying finality, an unforgettable finale comparable to ${kw(335)}, ${kw(340)}, and ${kw(345)}.`,
          ],
        },
      ],
    },

    // CHAPTER 6
    {
      h2: `The Lingering Echoes: Philosophical Weight and My Concluding Cinephile Verdict`,
      subsections: [
        {
          h3: `The Haunting Denouement: Ambiguity in the Final Frames`,
          paragraphs: [
            `When the screen finally faded to black and the end credits began their slow ascent, I remained frozen in my seat, utterly unwilling to break the spell that ${title} had cast over me. The final shots do not offer a tidy moral homily or an easy sentimental bow. Instead, the filmmakers leave us with a haunting, ambiguous image that lingers behind your eyelids long after you have exited the theater or turned off the display.`,
            `In my critical estimation, the true test of a masterpiece is what happens in the hours and days that follow your initial viewing. Does the film evaporate like so much digital popcorn, forgotten before you reach the parking lot? Or does it take root in your consciousness, compelling you to replay its key sequences, re-examine its moral arguments, and debate its final implications with fellow film lovers? ${title} belongs indisputably to the latter category, taking its place alongside cinema giants like ${kw(350)}, ${kw(355)}, and ${kw(360)}. It is a work designed for repeat viewings, promising to reveal new layers of visual foreshadowing, thematic resonance, and emotional subtlety with every subsequent engagement.`,
            `The movie poses profound questions about what it means to remain human in an inhumane world, whether forgiveness is possible after unforgivable betrayal, and whether the stories we tell ourselves to justify our survival are ever truly honest. These are not ephemeral inquiries; they are the eternal obsessions of great art, and they are explored here with maturity, passion, and uncompromising formal rigor, themes resonant throughout ${kw(365)}, ${kw(370)}, and ${kw(375)}.`,
          ],
        },
        {
          h3: `The Final Cinephile Verdict: Why ${title} Demands Your Immediate Attention`,
          paragraphs: [
            `To all passionate movie lovers, aspiring storytellers, and seekers of cinema that challenges both the heart and the intellect: ${title} is an absolute, non-negotiable imperative. It is a triumph of contemporary storytelling that honors the rich traditions of ${genresStr} cinema while carving out its own bold, unforgettable identity in the modern landscape.`,
            `With a strong community score of ${rating}/10 and an ensemble performance that represents career-high benchmarks for ${leadActor} and ${supportingActor}, this is filmic craft operating at the absolute peak of its expressive potential. The suspense is genuine, the psychological stakes are towering, and the climax is an unforgettable masterstroke that will leave you breathless, joining the esteemed ranks of ${kw(380)}, ${kw(385)}, and ${kw(390)}.`,
            `I urge you to experience this journey without delay. Turn down the lights, calibrate your sound system, immerse yourself completely into its world, and prepare yourself for one of the most thrilling, complex, and emotionally devastating cinematic rides of recent times. You will not emerge on the other side of ${title} unchanged.`,
          ],
        },
      ],
    },
  ];

  // Calculate actual total words
  let wordCount = h1.split(/\s+/).filter(Boolean).length;
  for (const sec of sections) {
    wordCount += sec.h2.split(/\s+/).filter(Boolean).length;
    for (const sub of sec.subsections) {
      wordCount += sub.h3.split(/\s+/).filter(Boolean).length;
      for (const p of sub.paragraphs) {
        wordCount += p.split(/\s+/).filter(Boolean).length;
      }
    }
  }

  return {
    h1,
    author: 'EuroFilm',
    totalWords: wordCount,
    sections,
  };
}
