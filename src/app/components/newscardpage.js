import NewsCard from '../components/newscard.js';
import styles from './components.module.css';

export default function NewsletterPage() {
  const newsItems = [
    {
      title: '2024 Promo',
      date: '2024-01-01',
      description: 'New release for base guitar',
      imageSrc: '/artist.jpg',
    }
  ];

  const newsItemFill = Array(4).fill(newsItems[0]);

  return (
    <div className={styles.newsletterPage}>
      <h1 className={styles.pageTitle}>Newsletter</h1>
      <div className={styles.newsGrid}>
        {newsItemFill.map((item, index) => (
          <NewsCard
            key={index}
            title={item.title}
            date={item.date}
            description={item.description}
            imageSrc={item.imageSrc}
          />
        ))}
      </div>
    </div>
  );
}
