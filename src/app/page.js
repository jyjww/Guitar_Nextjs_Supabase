import { homedir } from "os";
import HeroSection from './components/HeroSection.js';
import CategorySection from './components/CategorySection.js'
import NewsletterPage from './components/NewsCardPage2.js'

export default function Home() {
    return (
      <div>
        <HeroSection/>
        <div className="spacebetween"></div>
        <div className="home_intro">
          <h1>Ibanez is a Japanese electric musical instrument brand that mainly produces electric guitars , bass guitars , and acoustic guitars.
          </h1>
          <button className="btn_intro"><a href="/">Learn more</a></button>
        </div>
        <div className="spacebetween2"></div>
        <CategorySection/>
        <div className="spacebetween2"></div>
        <NewsletterPage/>
        <div className="spacebetween2"></div>
      </div>
    );
  };