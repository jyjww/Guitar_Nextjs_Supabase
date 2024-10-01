import PurchaseManager from './purchaseManager';

export default function Purchase() {
    return (
        <div className="container mx-auto px-4 py-8 font-nanumsquare p-8">
            <h1 className="text-2xl font-bold mt-16 text-center font-nanumsquare">구매 내역</h1>
            <PurchaseManager />
        </div>
    );
}