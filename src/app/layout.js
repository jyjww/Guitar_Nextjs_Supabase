import Navbar from './components/Navbar';
import './globals.css';
import Footer from './components/Footer';

export const metadata = {
  title: 'YJ Next.js App',
  description: 'Guitar shopping page',
};

const Layout = ({ children }) => {
  return (
    <html lang="ko"> 
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
