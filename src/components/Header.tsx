import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import ordinumLogo from "@/assets/ordinum-logo-new.jpg";

const navLinks = [
  { to: "/problem", label: "The Problem" },
  { to: "/solution", label: "Our Solution" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-sm border-b border-white/10">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <img src={ordinumLogo} alt="Ordinum" className="w-12 h-12 object-contain" />
            <span className="text-lg font-semibold tracking-tight">Ordinum</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Button asChild size="sm" className="hidden md:inline-flex bg-white text-black hover:bg-white/90">
            <Link to="/contact">Request early access</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-black border-white/10 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <Link to="/" className="flex items-center gap-2.5 text-white" onClick={() => setOpen(false)}>
                    <img src={ordinumLogo} alt="Ordinum" className="w-12 h-12 object-contain" />
                    <span className="text-lg font-semibold tracking-tight">Ordinum</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col gap-1 p-4 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                  <Button asChild className="w-full bg-white text-black hover:bg-white/90">
                    <Link to="/contact" onClick={() => setOpen(false)}>Request early access</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
