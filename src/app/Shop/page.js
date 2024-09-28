import HeroSection2 from './HeroSection2.js';
import ShopCategory from './ShopCategory.js';
import ShopItems from './ShopCategory1.1.js';

export default function Shop() {
    return (
        <div>
            <HeroSection2/>
            <div className="spacebetween"/>
            <h1 style={{textAlign: "center", fontSize:"20px", marginBottom: "40px"}}>All Products</h1>
            <ShopCategory />
            <div className="spacebetween"/>
            <ShopItems/>

        </div>
    );
};


