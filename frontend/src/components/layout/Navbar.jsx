"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
    LogOut,
    CalendarDays,
    Ticket,
    LayoutDashboard,
    PlusCircle,
    Menu,
    X,
} from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
    const [isLogout, setIsLogout] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { isAuthenticated, user, role } = useAuth();

    const handleLogout = () => {
        setIsLogout(true);
        setTimeout(() => {
            dispatch(logout());
            router.push("/login");
            setIsLogout(false);
            setMenuOpen(false);
        }, 1000);
    };

    const handleLinkClick = () => setMenuOpen(false);

    const getHomeLink = () => {
        if (!isAuthenticated) return "/login";
        return role === "ORGANIZER" ? "/organizer/dashboard" : "/customer/dashboard";
    };

    const linkClass = (href) =>
        `flex items-center gap-1.5 text-sm font-medium ${pathname === href ? "text-indigo-600" : "text-black hover:text-indigo-600"
        }`;

    const mobileLinkClass = (href) =>
        `flex items-center gap-3 text-base font-medium px-4 py-3 rounded-lg ${pathname === href
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-700 hover:bg-gray-50"
        }`;

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm md:px-6 px-4 lg:py-7 md:py-5 py-4 ">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href={getHomeLink()} className="text-lg font-semibold text-indigo-600">
                        EventBooking
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated && role === "CUSTOMER" && (
                            <>
                                <Link href="/customer/dashboard" className={linkClass("/customer/dashboard")}>
                                    <CalendarDays className="w-4 h-4" />
                                    Events
                                </Link>
                                <Link href="/customer/my-bookings" className={linkClass("/customer/my-bookings")}>
                                    <Ticket className="w-4 h-4" />
                                    My Bookings
                                </Link>
                            </>
                        )}

                        {isAuthenticated && role === "ORGANIZER" && (
                            <>
                                <Link href="/organizer/dashboard" className={linkClass("/organizer/dashboard")}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    My Events
                                </Link>
                                <Link href="/organizer/create-event" className={linkClass("/organizer/create-event")}>
                                    <PlusCircle className="w-4 h-4" />
                                    Create Event
                                </Link>
                            </>
                        )}

                        {isAuthenticated && (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden lg:flex flex-col leading-tight">
                                        <span className="text-sm font-medium text-gray-800">{user?.name}</span>
                                        <span className="text-xs text-gray-400">{role}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    disabled={isLogout}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {isLogout ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                                    Login
                                </Link>
                                <Link href="/register" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: avatar + hamburger */}
                    <div className="flex md:hidden items-center gap-3">
                        {isAuthenticated && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold shrink-0">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="text-gray-700"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            {menuOpen && (
                <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <span className="text-lg font-semibold text-indigo-600">EventBooking</span>
                    <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                <div className="flex flex-col gap-1 px-4 py-6">
                    {isAuthenticated && role === "CUSTOMER" && (
                        <>
                            <Link
                                href="/customer/dashboard"
                                onClick={handleLinkClick}
                                className={mobileLinkClass("/customer/dashboard")}
                            >
                                <CalendarDays className="w-5 h-5" />
                                Events
                            </Link>
                            <Link
                                href="/customer/my-bookings"
                                onClick={handleLinkClick}
                                className={mobileLinkClass("/customer/my-bookings")}
                            >
                                <Ticket className="w-5 h-5" />
                                My Bookings
                            </Link>
                        </>
                    )}

                    {isAuthenticated && role === "ORGANIZER" && (
                        <>
                            <Link
                                href="/organizer/dashboard"
                                onClick={handleLinkClick}
                                className={mobileLinkClass("/organizer/dashboard")}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                My Events
                            </Link>
                            <Link
                                href="/organizer/create-event"
                                onClick={handleLinkClick}
                                className={mobileLinkClass("/organizer/create-event")}
                            >
                                <PlusCircle className="w-5 h-5" />
                                Create Event
                            </Link>
                        </>
                    )}

                    {!isAuthenticated && (
                        <>
                            <Link href="/login" onClick={handleLinkClick} className={mobileLinkClass("/login")}>
                                Login
                            </Link>
                            <Link href="/register" onClick={handleLinkClick} className={mobileLinkClass("/register")}>
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {isAuthenticated && (
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-600 py-2.5 rounded-lg hover:bg-red-700"
                        >
                            <LogOut className="w-4 h-4" />
                            {isLogout ? "Logging out..." : "Logout"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}