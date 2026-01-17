'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/modals';
import api from '@/api';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import { NavbarLogo } from '@/components/common';

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);
    const { user, setUserLoading, clearContext, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [authModal, setAuthModal] = useState<{
        isOpen: boolean;
        mode: "shopping" | "selling";
        initialAuthMode: "login" | "signup";
    }>({
        isOpen: false,
        mode: "shopping",
        initialAuthMode: "signup",
    });

    const handleLogout = async () => {
        try {
            setUserLoading(true);
            const res = await api.get("/auth/logout");
            toast.success(res.data.message, { description: "You have been logged out." });
            clearContext();
            navigate("/");
            setOpen(false);
        } catch (error) {
            console.log("error logging out", error);
            toast.error("Some error occured");
        } finally {
            setUserLoading(false);
        }
    };

    const handleLogin = () => {
        setAuthModal({ isOpen: true, mode: "shopping", initialAuthMode: "login" });
        setOpen(false);
    };

    const handleSignUp = () => {
        setAuthModal({ isOpen: true, mode: "selling", initialAuthMode: "signup" });
        setOpen(false);
    };

    const handleAuthSuccess = () => {
        if (authModal.mode === "shopping") {
            navigate("/discover");
        } else {
            navigate("/dashboard");
        }
    };

    // Prevent body scroll when menu is open
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const NavLinks = () => (
        <>
            <Link to="/" className="text-sm font-medium text-[#2D1B69] hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
                Home
            </Link>

            {user?.seller ? (
                <>
                    <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
                        Dashboard
                    </Link>
                    <Link to="/dashboard/listings" className="text-sm font-medium text-gray-700 hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
                        My Listings
                    </Link>
                    <Link to="/discover" className="text-sm font-medium text-gray-700 hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
                        Search
                    </Link>
                    <Link to="/dashboard/profile" className="text-sm font-medium text-gray-700 hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
                        Profile
                    </Link>
                </>
            ) : (
                <Link to="/discover" className="text-sm font-medium text-gray-700 hover:text-[#7C3AED] transition-colors" onClick={() => setOpen(false)}>
                    Search
                </Link>
            )}
        </>
    );

    return (
        <>
            <header className="sticky top-0 z-50 w-full">
                <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6', {
                    'pt-2 sm:pt-3': scrolled,
                })}>
                <nav className={cn('flex h-16 w-full items-center justify-between relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-purple-50/30 via-pink-50/10 to-transparent backdrop-blur-md transition-all duration-300 shadow-sm mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6 lg:px-8', {
                    'bg-white/70 supports-[backdrop-filter]:bg-white/60 border border-gray-200/50 backdrop-blur-lg':
                        scrolled,
                })}>
                    {/* Logo - Left */}
                    <div className="flex-shrink-0 z-10">
                        <NavbarLogo />
                    </div>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2 z-10">
                        <Link to="/" className="text-sm font-medium text-[#2D1B69] hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                            Home
                        </Link>
                        <Link to="/discover" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                            Search
                        </Link>
                    </div>

                    {/* Desktop Auth Buttons - Right */}
                    <div className="hidden md:flex items-center gap-3 z-10">
                        {isAuthenticated && user.name !== "User" ? (
                            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-gray-700 hover:text-[#7C3AED]">
                                Logout
                                <LogOut size={16} />
                            </Button>
                        ) : (
                            <>
                                <Button 
                                    variant="outline" 
                                    onClick={handleLogin}
                                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2"
                                >
                                    Log In
                                </Button>
                                <Button 
                                    onClick={handleSignUp}
                                    className="rounded-lg px-4 py-2"
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle - Right */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setOpen(!open)}
                        className="md:hidden z-10"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <MenuToggleIcon open={open} className="size-6" duration={300} />
                    </Button>
                </nav>
                </div>

                {/* Mobile Menu Portal */}
                <MobileMenu open={open}>
                    <div className="flex flex-col space-y-6 pt-12 pb-6 px-6">
                        <div className="flex flex-col space-y-4">
                            <NavLinks />
                        </div>

                        <div className="h-px bg-border w-full my-4" />

                        <div className="flex flex-col gap-3">
                            {isAuthenticated && user.name !== "User" ? (
                                <Button variant="destructive" onClick={handleLogout} className="w-full justify-start">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleLogin} 
                                        className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 rounded-lg"
                                    >
                                        Log In
                                    </Button>
                                    <Button 
                                        onClick={handleSignUp} 
                                        className="w-full rounded-lg"
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </MobileMenu>
            </header>

            <AuthModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
                mode={authModal.mode}
                onSuccess={handleAuthSuccess}
                initialAuthMode={authModal.initialAuthMode}
            />
        </>
    );
}

type MobileMenuProps = React.ComponentProps<'div'> & {
    open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div
            id="mobile-menu"
            className={cn(
                'fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out',
                open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                className
            )}
            style={{ top: '64px' }} // Below header
            {...props}
        >
            <div
                className={cn(
                    'h-full w-full overflow-y-auto',
                    open ? 'translate-y-0' : '-translate-y-4',
                    'transition-transform duration-300 ease-out'
                )}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

function useScroll(threshold: number) {
    const [scrolled, setScrolled] = React.useState(false);

    const onScroll = React.useCallback(() => {
        setScrolled(window.scrollY > threshold);
    }, [threshold]);

    React.useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    React.useEffect(() => {
        onScroll();
    }, [onScroll]);

    return scrolled;
}

