import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRroute";
import YourShop from "./pages/YourShop";
import Cart from "./pages/Cart";
import { AddProduct } from "./pages/AddProduct";
import SearchProduct from "./pages/SearchProduct";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                    <Route path="/add-product" element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>
                    <Route path="/your-shop/:user_id" element={<ProtectedRoute><YourShop/></ProtectedRoute>}/>
                    <Route path="/cart/:user_id" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
                    <Route path="/search-product" element={<ProtectedRoute><SearchProduct/></ProtectedRoute>}/>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App