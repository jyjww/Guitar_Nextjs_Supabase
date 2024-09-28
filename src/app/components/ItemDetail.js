import React from 'react';
import styles from './components.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faXmark } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기


const ItemDetail = ({image, onClose}) => {
    return (
        <div className={styles.itemDetail} onClick={onclose} style={{width:600 , height: 600 }}>
            <div className="ItemHead">
                <h2>(image.alt || 'Item Name')</h2>
                <button onClick={onClose} className={styles.btn_close}><FontAwesomeIcon icon={faXmark} size="lg" /></button>
            </div>
            <img src={image?.image} alt={image?.alt} className={styles.detail_image} />
            <p>(image.description || 'Item Description')</p>
        </div>
    )
}

export default ItemDetail;