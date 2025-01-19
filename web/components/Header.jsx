import { Link } from "react-router-dom";
import logoImg from "../assets/Logo.png";
import signInImg from "../assets/Sign In.png";


export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={logoImg} alt="PitStop Logo" className="h-8" />
          </Link>

          <nav className="flex items-center">
            <Link to="/sign-in" className="hover:opacity-80 transition-opacity">
              <img src={signInImg} alt="Sign In" className="h-6" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
