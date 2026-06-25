import Link from 'next/link';

interface Cuisine {
  name: string;
  emoji: string;
  slug: string;
}

const CUISINES: Cuisine[] = [
  { name: 'Italian', emoji: '🍕', slug: 'italian' },
  { name: 'Indian', emoji: '🍛', slug: 'indian' },
  { name: 'Chinese', emoji: '🥢', slug: 'chinese' },
  { name: 'Fast Food', emoji: '🍔', slug: 'fast-food' },
  { name: 'Healthy', emoji: '🥗', slug: 'healthy' },
  { name: 'Japanese', emoji: '🍣', slug: 'japanese' },
  { name: 'Mexican', emoji: '🌮', slug: 'mexican' },
];

export default function CuisineCarousel() {
  return (
    <section className="cuisine-section animate-fade-in-up">
      <div className="section-header">
        <h2>In the Mood for?</h2>
        <Link href="/restaurants">Explore All Cuisines &rarr;</Link>
      </div>

      <div className="cuisine-scroll">
        {CUISINES.map((c) => (
          <Link
            key={c.slug}
            href={`/restaurants?cuisine=${c.name}`}
            className="cuisine-card"
          >
            <span className="cuisine-emoji" role="img" aria-label={c.name}>
              {c.emoji}
            </span>
            <span className="cuisine-name">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
