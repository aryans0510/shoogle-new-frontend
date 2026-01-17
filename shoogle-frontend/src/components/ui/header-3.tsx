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
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                Home
            </Link>

            {user?.seller ? (
                <>
                    <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                        Dashboard
                    </Link>
                    <Link to="/dashboard/listings" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                        My Listings
                    </Link>
                    <Link to="/discover" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                        Search
                    </Link>
                    <Link to="/dashboard/profile" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                        Profile
                    </Link>
                </>
            ) : (
                <Link to="/discover" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setOpen(false)}>
                    Search
                </Link>
            )}
        </>
    );

    return (
        <>
            <header
                className={cn('sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300', {
                    'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
                        scrolled,
                })}
            >
                <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <NavbarLogo />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLinks />
                        </div>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated && user.name !== "User" ? (
                            <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                                Logout
                                <LogOut size={16} />
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={handleLogin}>
                                    Sign In
                                </Button>
                                <Button onClick={handleSignUp}>
                                    Get Started
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setOpen(!open)}
                        className="md:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <MenuToggleIcon open={open} className="size-6" duration={300} />
                    </Button>
                </nav>

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
                                    <Button variant="outline" onClick={handleLogin} className="w-full">
                                        Sign In
                                    </Button>
                                    <Button onClick={handleSignUp} className="w-full">
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

