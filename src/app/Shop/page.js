import HeroSection2 from './HeroSection2.js';
import ShopCategory from './ShopCategory.js';
import ShopItems from './ShopCategory1.1.js';

export default function Shop() {
    return (
        <div>
            <HeroSection2/>
            <div className="w-full h-[10px] overflow-x-hidden"></div>
            <ShopItems/>

        </div>
    );
};


