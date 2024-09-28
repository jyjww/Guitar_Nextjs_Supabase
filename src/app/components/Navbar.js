import Image from 'next/image';
import "../globals.css";
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="navbar">
      <Link href="/" className="logo">
        <Image src="/logo.png" alt="Logo" width={100} height={40}></Image>
      </Link>

      {/* Links Section */}
      <div className="links">
        <a href="/Shop">Shop</a>
        <a href="/About">About</a>
        <a href="/Contact">Contact</a>
        <a href="/SupaReader">Supa Reader</a>
      </div>

      <div className="cart">
        <a href="/Cart">Cart</a>
      </div>

      {/* Login Button */}
      <div className="login">
        <button><a href="/Login">Login</a></button>
      </div>
    </div>
  );
};

export default Navbar;
