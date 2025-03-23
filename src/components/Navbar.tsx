import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@progress/kendo-react-buttons";
import {
  homeIcon,
  walletSolidIcon,
  menuIcon,
  arrowsSwapIcon,
  chartPieIcon,
  xIcon,
} from "@progress/kendo-svg-icons";
import { SvgIcon } from '@progress/kendo-react-common';
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 16) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Dashboard", path: "/", icon: (isActive: boolean) => <SvgIcon className="w-4 h-4" fill={isActive ? 'white' : ''} icon={homeIcon} /> },
    {
      name: "Income",
      path: "/income",
      icon: (isActive: boolean) => <SvgIcon className="w-4 h-4" fill={isActive ? 'white' : ''} icon={arrowsSwapIcon} />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: (isActive: boolean) => <SvgIcon className="w-4 h-4" fill={isActive ? 'white' : ''} icon={chartPieIcon} />,
    },
    {
      name: "Savings",
      path: "/savings",
      icon: (isActive: boolean) => <SvgIcon className="w-4 h-4" fill={isActive ? 'white' : ''} icon={walletSolidIcon} />,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? "glass bg-opacity-80 backdrop-blur-md py-3 shadow-sm border-b border-white/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2 font-semibold text-lg"
        >
          <SvgIcon className="w-6 h-6" icon={walletSolidIcon} />
          <span className="font-medium">MyFinApp</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-primary text-white"
                    : "hover:bg-secondary"
                }`}
              >
                {link.icon(location.pathname === link.path)}
                <span className="ml-2">{link.name}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            svgIcon={isOpen ? xIcon : menuIcon}
            className="w-6 h-6"
            type="button"
            fillMode={"clear"}
            aria-label="Toggle menu"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobile && isOpen && (
        <nav className="container py-4 glass animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-primary text-white"
                    : "hover:bg-secondary"
                }`}
              >
                {link.icon(location.pathname === link.path)}
                <span className="ml-2">{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
