import { Pen, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export type SellerProductIntrf = {
    _id: string;
    created_at: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    onDelete: (_id: string) => void;
    user_id: string;
}

export type CustomerProductIntrf = {
    _id: string;
    created_at: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    user_id: string;
}

export type CartProductIntrf = {
    _id: string;
    created_at: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    onRemove: (_id: string) => void;
    user_id: string;
}

export function SellerProductCard(props: SellerProductIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <div className="rounded-lg relative aspect-square">
                <img src={props.product_images[0].file_url} className="object-cover w-full h-full"/>
            </div>
            <h3 className="line-clamp-1 font-500 text-blue-400 text-[0.9rem]">{props.product_name}</h3>
            <p className="line-clamp-1 text-blue-400 text-[0.9rem]">IDR {props.product_price}</p>
            <div className="flex gap-4">
                <Link to={`/edit-product/${props._id}`} className="p-[0.45rem] cursor-pointer">
                    <Pen color="orange"/>
                </Link>
                <button type="button" className="p-[0.45rem] cursor-pointer" onClick={() => props.onDelete(props._id)}>
                    <Trash color="yellow"/>
                </button>
            </div>
        </div>
    );
}

export function CustomerProductCard(props: CustomerProductIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <div className="rounded-lg relative aspect-square">
                <img src={props.product_images[0].file_url} className="object-cover w-full h-full"/>
            </div>
            <h3 className="line-clamp-1 text-blue-400 text-[0.9rem]">{props.product_name}</h3>
            <p className="line-clamp-1 text-blue-400 text-[0.9rem]">IDR {props.product_price}</p>
            <div className="flex gap-4">
                <Link to={`/product-detail/${props._id}`} className="bg-blue-400 text-black text-[0.9rem] p-[0.45rem] cursor-pointer">Lihat Detail</Link>
            </div>
        </div>
    );
}

export function ProductCardInCart(props: CartProductIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <div className="rounded-lg relative aspect-square">
                <img src={props.product_images[0].file_url} className="object-cover w-full h-full rounded-lg"/>
            </div>
            <h3 className="line-clamp-1 text-blue-400 text-[0.9rem]">{props.product_name}</h3>
            <p className="line-clamp-1 text-blue-400 text-[0.9rem]">IDR {props.product_price}</p>
            <div className="flex gap-4">
                <button type="button" className="bg-blue-400 text-black text-[0.9rem] p-[0.45rem] cursor-pointer" onClick={() => props.onRemove(props._id)}>Remove</button>
            </div>
        </div>
    );
}