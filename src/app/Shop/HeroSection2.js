import Image from 'next/image';

export default function HeroSection2() {
    return (
        <div className="relative w-[99%] sm:w-full h-[380px] mx-auto overflow-hidden">
            <div className="relative w-full h-full">
                <Image 
                    src="/shopHeader3.jpg" 
                    alt="hero image" 
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black to-black/60" />
                <h1 className="absolute inset-0 flex justify-center items-center text-6xl text-white font-['NanumSquareExtrabold'] text-center z-10">
                    Shop
                </h1>
            </div>
        </div>
    ); 
}