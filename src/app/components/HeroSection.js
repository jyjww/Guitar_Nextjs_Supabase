import Image from 'next/image';
import '../globals.css';

export default function HeroSection2() {
    return (
        <div className="relative w-full overflow-x-hidden sm:w-full h-[450px] mx-auto overflow-hidden">
            {/* Hero 이미지 컨테이너 */}
            <div className="relative w-full h-full">
                {/* 이미지 */}
                <Image 
                    src="/HeroSection3.jpeg" 
                    alt="hero image" 
                    fill
                    className="w-full h-auto object-cover"
                />
                {/* 그라디언트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black to-black/60" />

                {/* 타이틀 */}
                <h1 className="absolute inset-0 font-custom-font md:flex justify-center items-center text-6xl text-white font-extrabold md:text-left lg:text-left sm:hidden z-10">
                    Geared up
                    <br className="md:visible"/>
                    <span className="invisible md:visible">&nbsp;for the spotlight</span>
                </h1>
            </div>
        </div>
    );
}
