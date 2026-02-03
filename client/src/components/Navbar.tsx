import { Link } from "react-router-dom";
import { DoorOpen, Home, Search, UserCircle2, ShoppingCart, ShoppingBag, Plus } from 'lucide-react';
import useAuth from "../services/auth.services";

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

    return (
        <nav className="md:hidden flex justify-center gap-4 shrink-0 bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 p-4">
            <Link to={'/home'} className="text-blue-400 font-medium text-4">
                <Home></Home>
            </Link>
            <Link to={user ? `/your-shop/${user.info.id}` : '/home'} className="text-blue-400 font-medium text-4">
                <ShoppingBag></ShoppingBag>
            </Link>
            <Link to={'/add-product'} className="text-blue-400 font-medium text-4 flex gap-[0.7rem] items-center">
                <Plus></Plus>
            </Link>
            <Link to={user ? `/cart/${user.info.id}` : '/home'} className="text-blue-400 font-medium text-4 flex gap-[0.7rem] items-center">
                <ShoppingCart></ShoppingCart>
            </Link>
            <Link to={'/search-product'} className="text-blue-400 font-medium text-4 flex gap-[0.7rem] items-center">
                <Search></Search>
            </Link>
            <button onClick={signOut} className="cursor-pointer text-blue-400 font-medium text-4">
                <DoorOpen></DoorOpen>
            </button>
        </nav>
    );
}