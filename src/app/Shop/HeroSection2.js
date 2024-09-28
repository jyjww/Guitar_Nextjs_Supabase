import Image from 'next/image';
import styles from '../components/components.module.css';

export default function HeroSection2() {
    return (
        <div className={styles.heroContainer2}>
            <div className={styles.imagewrapper}>
            {/* Use the Image component with the appropriate styles */}
            <Image 
                src="/shopHeader3.jpg" 
                alt="hero image" 
                fill
                className={styles.heroimage}
            />
            <div className={styles.Overlay}/>
            <h1 className={styles.heroTitle2}>Shop</h1>
            </div>
        </div>
    ); 
}