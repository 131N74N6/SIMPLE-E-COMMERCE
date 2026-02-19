import { Link } from "react-router-dom";
import { DoorOpen, Home, Search, UserCircle2, ShoppingCart, ShoppingBag, Plus, Menu } from 'lucide-react';
import useAuth from "../services/auth.services";
import { useState } from "react";

export function Navbar1() {
    const { user, signOut } = useAuth();
    
    return (
        <nav className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 md:w-1/4 md:flex shrink-0 hidden flex-col gap-5 p-4">
            <Link to={'/home'} className="outline-0 text-blue-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                <Home></Home>
                <span>Home</span>
            </Link>
            <Link to={user ? `/your-shop/${user.info.id}` : '/home'} className="outline-0 text-blue-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                <ShoppingBag></ShoppingBag>
                <span>Your Shop</span>
            </Link>
            <Link to={'/add-product'} className="outline-0 text-blue-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                <Plus></Plus>
                <span>Add Product</span>
            </Link>
            <Link to={'/search-product'} className="outline-0 text-blue-400 cursor-pointer text-left flex items-center gap-2 font-[550] text-[1.2rem]">
                <Search></Search>
                <span>Search Product</span>
            </Link>
            <Link to={user ? `/cart/${user.info.id}` : '/home'} className="outline-0 text-blue-400 cursor-pointer text-left flex items-center gap-2 font-[550] text-[1.2rem]">
                <ShoppingCart></ShoppingCart>
                <span>Cart</span>
            </Link>
            <button type="button" className="text-blue-400 cursor-pointer text-left flex items-center gap-2 font-[550] text-[1.2rem]" onClick={signOut}>
                <DoorOpen></DoorOpen>
                <span>Sign Out</span>
            </button>
            <div className="grow"></div>
            <div className="text-purple-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                <UserCircle2></UserCircle2>
                <span>{user ? user.info.username : 'signed-user'}</span>
            </div>
        </nav>
    );
}

export function Navbar2() {
    const { signOut, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            <nav className="md:hidden bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex items-center p-4">
                <button onClick={toggleSidebar} className="cursor-pointer text-blue-400 font-medium">
                    <Menu size={24} />
                </button>
            </nav>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 opacity-75 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside
                className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                } flex flex-col gap-4 p-4`}
            >
                <Link to={'/home'} className="outline-0 text-blue-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                    <Home></Home>
                    <span>Home</span>
                </Link>
                <Link to={user ? `/your-shop/${user.info.id}` : '/home'} className="outline-0 text-blue-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                    <ShoppingBag></ShoppingBag>
                    <span>Your Shop</span>
                </Link>
                <Link to={'/add-product'} className="outline-0 text-blue-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                    <Plus></Plus>
                    <span>Add Product</span>
                </Link>
                <Link to={'/search-product'} className="outline-0 text-blue-400 cursor-pointer text-left flex items-center gap-2 font-[550] text-[1.2rem]">
                    <Search></Search>
                    <span>Search Product</span>
                </Link>
                <Link to={user ? `/cart/${user.info.id}` : '/home'} className="outline-0 text-blue-400 cursor-pointer text-left flex items-center gap-2 font-[550] text-[1.2rem]">
                    <ShoppingCart></ShoppingCart>
                    <span>Cart</span>
                </Link>
                <button type="button" className="text-blue-400 cursor-pointer text-left flex items-center gap-2 font-[550] text-[1.2rem]" onClick={signOut}>
                    <DoorOpen></DoorOpen>
                    <span>Sign Out</span>
                </button>
                <div className="grow"></div>
                <div className="text-purple-400 flex items-center gap-2 font-[550] text-[1.2rem]">
                    <UserCircle2></UserCircle2>
                    <span>{user ? user.info.username : 'signed-user'}</span>
                </div>
            </aside>
        </>
    );
}