import { Navbar1, Navbar2 } from '../components/Navbar'

export default function SearchProduct() {
    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <div className="h-full bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border border-blue-400 shadow-lg md:w-3/4 w-full"></div>
            <Navbar2/>
        </div>
    )
}