import { useParams } from "react-router-dom";
import { DataController } from "../services/data.services";
import { Navbar1, Navbar2 } from "../components/Navbar";

export type ProductDetailIntrf = {
    _id: string;
    created_at: string;
    product_description: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    product_stock: number;
    user_id: string;
}

export function ProductDetail() {
    const { _id } = useParams();
    const { getData } = DataController();

    const { data: selectedProduct } = getData<ProductDetailIntrf[]>({
        api_url: `http://localhost:1234/product/detail/${_id}`,
        query_key: [`product-${_id}`],
        stale_time: 600000
    });

    console.log(selectedProduct);

    return (
        <section className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                
            </div>
            <Navbar2/>
        </section>
    )
}