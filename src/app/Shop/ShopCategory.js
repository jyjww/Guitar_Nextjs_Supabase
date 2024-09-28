'use client';

import styles from '../components/components.module.css';

const ShopCategory = () => {
    return (
        <div className={styles.category}>
            <div className={styles.category_text}>
                <li>All</li>
                <li>Electric</li>
                <li>Base</li>
                <li>Acoustic</li>
                <li>Accessories</li>
            </div>
        </div>
    );
};

export default ShopCategory;