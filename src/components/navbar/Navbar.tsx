'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Menu} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const {  status } = useSession();
  const { setTheme } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  interface NavLinkProps {
    href: string;
    children: React.ReactNode;
  }
  
  const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
    <Link 
      href={href}
      className="relative text-sm font-medium transition-colors hover:text-primary px-1 py-2
        after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-primary 
        after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  );

  return (
    <nav className="p-4 bg-background/80 border-b shadow-sm backdrop-blur-md w-full fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={'/'}>
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Anonymous
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink href="/">Home</NavLink>
          {status === 'authenticated' && <NavLink href="/dashboard">Dashboard</NavLink>}
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-72 border-r bg-background/95 backdrop-blur-lg p-6"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <Link href={'/'}>
                    <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Anonymous
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col space-y-6">
                  <Link 
                    href="/" 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                  {status === 'authenticated' && (
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link 
                    href="/about" 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                          <span className="sr-only">Toggle theme</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Auth Button */}
                  {status === 'authenticated' ? (
                    <Button 
                      className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/sign-in" className="w-full">
                      <Button variant="default" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Theme Toggle and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {status === 'authenticated' ? (
            <Button 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;