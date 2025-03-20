
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/ui/SearchBar';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4',
        isScrolled ? 
        'bg-white/70 backdrop-blur-xl shadow-sm' : 
        'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              ديجيتال ماركت
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link text-foreground/80 hover:text-foreground button-transition">
              الرئيسية
            </Link>
            <Link to="/products" className="nav-link text-foreground/80 hover:text-foreground button-transition">
              المنتجات
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="nav-link text-primary hover:text-primary/80 button-transition font-medium">
                لوحة الإدارة
              </Link>
            )}
            <SearchBar className="ml-4" />
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{user?.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full">لوحة التحكم</Link>
                    </DropdownMenuItem>
                    {user?.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="w-full">لوحة الإدارة</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" /> تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">إنشاء حساب</Button>
                </Link>
              </>
            )}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0 right-0 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "fixed inset-0 bg-white z-40 pt-20 px-6 md:hidden transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="flex flex-col space-y-6 mt-8">
            <SearchBar fullWidth showFilters />
            
            <Link to="/" className="text-foreground text-lg font-medium">
              الرئيسية
            </Link>
            <Link to="/products" className="text-foreground text-lg font-medium">
              المنتجات
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-primary text-lg font-medium">
                لوحة الإدارة
              </Link>
            )}
            
            <div className="border-t border-border pt-6 mt-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center text-foreground mb-4">
                    <User className="h-5 w-5 mr-2" />
                    <span>{user?.username}</span>
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="block text-foreground mb-4">
                      لوحة الإدارة
                    </Link>
                  )}
                  <Button variant="outline" className="w-full" onClick={logout}>
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">إنشاء حساب</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
