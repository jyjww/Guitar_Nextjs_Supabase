import Image from 'next/image';
import "../globals.css";
import Link from 'next/link';

const Navbarcopy = () => {
  return (
      <div className="md:flex items-center justify-between bg-white py-2 px-5">
        <Link href="/" className="w-[100px] max-h-[40px] sm: mx-0 ">
        <Image src="/logo.png" alt="Logo" width={100} height={40} />
        </Link>

      {/* Links Section */}
      <div className="hidden md:flex items-center border border-[#eaeeef] rounded-full bg-[#eaeeef] p-2 ml-auto gap-10 padding-2">
        <a href="/Shop" className="text-[#333] no-underline font-light gap">Shop</a>
        <a href="/About" className="text-[#333] no-underline font-light">About</a>
        <a href="/Contact" className="text-[#333] no-underline font-light">Contact</a>
        <a href="/SupaReader" className="text-[#333] no-underline font-light">Supa Reader</a>
      </div>


      <div className="flex items-center border border-[#eaeeef] rounded-full bg-[#eaeeef] p-2 ml-auto gap-10 padding-2 sm:hidden">
        <a href="/Cart">Cart</a>
      </div>

      {/* Login Button */}
      <div className="md:flex items-center border border-[#eaeeef] rounded-full bg-[#eaeeef] p-2 ml-auto gap-10 padding-2">
        <button><a href="/Login">Login</a></button>
      </div>
    </div>
  );
};

export default Navbarcopy;
