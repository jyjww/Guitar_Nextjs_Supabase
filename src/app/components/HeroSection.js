import Image from 'next/image';
import styles from './components.module.css';

export default function HeroSection() {
    return (
        <div className={styles.heroContainer}>
            <div className={styles.imagewrapper}>
            {/* Use the Image component with the appropriate styles */}
            <Image 
                src="/HeroSection3.jpeg" 
                alt="hero image" 
                fill
                className={styles.heroimage}
            />
            </div>
            {/* Overlay text content */}
            <div className={styles.textOverlay}>
            <h1 className={styles.heroTitle}>Guitar</h1>
            <p className={styles.heroContent}>Geared up for the spotlight</p>
            </div>
        </div>
    ); 
}