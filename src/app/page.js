import { homedir } from "os";
import HeroSection from './components/HeroSection.js';
import CategorySection from './components/CategorySection.js'
import NewsletterPage from './components/NewsCardPage2.js'
import './globals.css';

export default function Home() {
    return (
      <div className="overflow-x-hidden w-full">
        <HeroSection/>
        <div className="w-full h-[50px] overflow-x-hidden"></div>
        <div className="overflow-x-hidden w-full h-[200px] mx-auto flex flex-col justify-center items-center text-center max-w-screen-lg px-4">
          <h1 className="text-lg sm:text-xl">
            Ibanez is a Japanese electric musical instrument brand that mainly produces electric guitars, bass guitars, and acoustic guitars.
          </h1>
          <button className="btn_intro mt-4 text-[#333] bg-white rounded-full px-4 py-2 text-sm transition-colors duration-300 hover:bg-[#333] hover:text-white" style={{border: '0.5px solid #333'}}>
            <a href="/About">Learn more</a>
          </button>
        </div>
        <div className="w-full h-[150px] overflow-x-hidden"></div>
        <CategorySection/>
        <div className="w-full h-[150px] overflow-x-hidden"></div>
        <NewsletterPage/>
      </div>
    );
  };