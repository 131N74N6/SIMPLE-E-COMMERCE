import { Link, useParams } from "react-router-dom";
import { DataController } from "../services/data.services";
import { Navbar1, Navbar2 } from "../components/Navbar";
import useAuth from "../services/auth.services";
import { ListPlus } from "lucide-react";

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
    const { user  } = useAuth();
    const { getData } = DataController();
    
    const { data: selectedProduct } = getData<ProductDetailIntrf[]>({
        api_url: `http://localhost:1234/product/detail/${_id}`,
        query_key: [`product-details-${_id}`],
        stale_time: 600000
    });
    
    const isPostOwner = user ? user.info.id === selectedProduct?.[0]?.user_id : false;
    console.log(selectedProduct);

    return (
        <section className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            {/* {selectedProduct?.[0]?.uploader_name.charAt(0)} */}
                        </div>
                        <div>
                            <Link to={`/about/${selectedProduct?.[0]?.user_id}`} className="font-semibold">
                                {/* {selectedProduct?.[0]?.uploader_name} */}
                            </Link>
                            <p className="text-gray-400 text-sm">
                                {selectedProduct && new Date(selectedProduct?.[0]?.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    {isPostOwner ? (
                        null
                    ) : (
                        <button
                            className="bg-red-600 cursor-pointer hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <ListPlus color="white" className="mr-1"/>
                            Add to Cart
                        </button>
                    )}
                </div>
                
                {/* <div className="flex flex-col gap-[1rem]">
                    {images.length > 0 ? <ImageSlider images={images} /> : null}
            
                    <div className="flex gap-[1rem]">
                        <div className="flex gap-[0.5rem] items-center text-[1.2rem]">
                            <i 
                                className={`fa-${userLiked ? 'solid' : 'regular'} fa-heart cursor-pointer ${userLiked ? 'text-red-500' : ''}`} 
                                onClick={givingLikes}
                            ></i>
                            <Link to={`/like-post/${_id}`}>{countLikesTotal}</Link>
                        </div>
                        <div className="flex gap-[0.5rem] items-center text-[1.2rem]">
                            <Link to={`/comments-post/${_id}`}>
                                <i className="fa-regular fa-comment cursor-pointer"></i>
                            </Link>
                            <span>{countCommentTotal}</span>
                        </div>
                    </div>
                    <div className="text-gray-200">{selectedPost?.[0]?.description}</div>
                </div> */}
            </div>
        </section>
    )
}