import Image from 'next/image';
import styles from './components.module.css'; // CSS 모듈 가져오기

const NewsCard = ({ title, date, description, imageSrc }) => {
  return (
    <div className={styles.newsCard}>
      <div className={styles.newsCardHeader}>
        <h3 className={styles.newsCardTitle}>{title}</h3>
      </div>
      <div className={styles.newsCardImage}>
        <Image src={imageSrc} alt={title} width={300} height={200} />
      </div>
      <div className={styles.newsCardContent}>
        <p className={styles.newsCardDescription}>{description}</p>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default NewsCard;
