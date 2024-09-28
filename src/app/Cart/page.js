import dynamic from 'next/dynamic';

const Cart = dynamic(() => import('./cartManager.js'), { ssr: false });

export default function CartPage() {
    return (
        <div>
            <Cart />
        </div>
    );
}
