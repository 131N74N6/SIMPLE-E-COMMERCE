import { Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    isShopOwner: boolean;
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
    is_selected: boolean;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    product_total: number;
    onRemove: (_id: string) => void;
    onSelect: (id: string) => void;
    product_id: string;
}

export function SellerProductCard(props: SellerProductIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <div className="rounded-lg relative aspect-square">
                <img src={props.product_images[0].file_url} className="object-cover w-full h-50"/>
            </div>
            <h3 className="line-clamp-1 font-500 text-blue-400 text-[0.9rem] font-medium">{props.product_name}</h3>
            <p className="line-clamp-1 text-blue-400 text-[0.9rem] font-medium">IDR {props.product_price}</p>
            {props.isShopOwner ? (
                <div className="flex gap-4">
                    <Link to={`/edit-product/${props._id}`} className="p-[0.45rem] cursor-pointer">
                        <Pen color="orange"/>
                    </Link>
                    <button type="button" className="p-[0.45rem] cursor-pointer" onClick={() => props.onDelete(props._id)}>
                        <Trash color="yellow"/>
                    </button>
                </div>
            ) : (
                <div className="flex gap-4">
                    <Link to={`/product-detail/${props._id}`} className="bg-blue-400 font-medium text-blue-900 text-[0.9rem] p-[0.45rem] cursor-pointer">Lihat Detail</Link>
                </div>
            )}
        </div>
    );
}

export function CustomerProductCard(props: CustomerProductIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <div className="rounded-lg relative aspect-square">
                <img src={props.product_images[0].file_url} className="object-cover w-full h-50"/>
            </div>
            <h3 className="line-clamp-1 text-blue-400 text-[0.9rem] font-medium">{props.product_name}</h3>
            <p className="line-clamp-1 text-blue-400 text-[0.9rem] font-medium">IDR {props.product_price}</p>
            <div className="flex gap-4">
                <Link to={`/product-detail/${props._id}`} className="bg-blue-400 font-medium text-blue-900 text-[0.9rem] p-[0.45rem] cursor-pointer">Lihat Detail</Link>
            </div>
        </div>
    );
}

export function ProductCardInCart(props: CartProductIntrf) {
    const navigate = useNavigate();
    const [productTotal, setProductTotal] = useState<string>('');

    useEffect(() => {
        if (props.is_selected) {
            setProductTotal(props.product_total.toString());
        } else {
            setProductTotal('');
        }
    }, [props.is_selected]);

    function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        props.onUpdate({ product_total: parseInt(productTotal) });
    }

    function handleCancel() {
        props.onSelect(props._id);
    }

    if (props.is_selected) {
        return (
            <form className="border-blue-300 border rounded p-[0.45rem] flex flex-col gap-2" onSubmit={handleSave}>
                {/* <input 
                    type="text"
                    placeholder="ex: watch movie"
                    value={editActName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditActName(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <input 
                    type="datetime-local"
                    placeholder="ex: 4500"
                    value={editSchedule}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditSchedule(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <div className="flex gap-[0.4rem]">
                    <button 
                        type="submit" 
                        disabled={!editActName || props.isDataChanging}
                        className="bg-white disabled:cursor-not-allowed cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]"
                    >
                        Save
                    </button>
                    <button 
                        type="button" 
                        disabled={props.isDataChanging}
                        className="bg-white cursor-pointer disabled:cursor-not-allowed text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]" 
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div> */}
            </form>
        );
    }
    
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <div className="flex gap-4 md:flex-row flex-col">
                <div className="rounded-lg relative w-50 h-50">
                    <img src={props.product_images[0].file_url} className="object-cover w-full h-full"/>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="line-clamp-1 text-blue-400 text-[0.9rem] font-medium">{props.product_name}</h3>
                    <p className="line-clamp-1 text-blue-400 text-[0.9rem] font-medium">IDR {props.product_price}</p>
                </div>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <button type="button" className="bg-blue-400 rounded text-blue-900 font-medium text-[0.9rem] p-[0.45rem] cursor-pointer" onClick={() => props.onRemove(props._id)}>Remove</button>
                <button type="button" className="bg-blue-400 rounded text-blue-900 font-medium text-[0.9rem] p-[0.45rem] cursor-pointer" onClick={() => navigate(`/product-detail/${props.product_id}`)}>Lihat Detail</button>
                <button type="button" className="bg-blue-400 rounded text-blue-900 font-medium text-[0.9rem] p-[0.45rem] cursor-pointer">Edit</button>
            </div>
        </div>
    );
}