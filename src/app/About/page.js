import styles from '../globals.css'

export default function About() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="w-full h-[150px] overflow-x-hidden"></div>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-[100px] font-extrabold mb-4 font-nanumsquare">About Us</h1>
                </div>
                <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed">
                        Ibanez (アイバニーズ, Aibanīzu) is a Japanese guitar brand owned by Hoshino Gakki. Based in Nagoya, Aichi, Japan, Hoshino Gakki were one of the first Japanese musical instrument companies to gain a significant foothold in import guitar sales in the United States and Europe, as well as the first brand of guitars to mass-produce seven-string and eight-string guitars. Ibanez manufactures effects, accessories, amps, and instruments in Japan, China, Indonesia, and the United States (at a Los Angeles-based custom shop). As of 2017 they marketed nearly 165 models of bass guitar, 130 acoustic guitars, and more than 300 electric guitars. After Gibson and Fender, Ibanez is considered the third biggest guitar brand.
                    </p>
                </div>
            </div>
        </div>
    );
};