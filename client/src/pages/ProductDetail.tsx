import { Link, useNavigate, useParams } from "react-router-dom";
import { DataController } from "../services/data.services";
import { Navbar1, Navbar2 } from "../components/Navbar";
import useAuth from "../services/auth.services";
import { ListPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ImageSlider from "../components/ImageSlider";

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
    username: string;
    user_id: string;
}

export type CartDetailIntrf = {
    _id: string;
    created_at: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    product_total: number;
    user_id: string;
    product_id: string;
    seller_id: string;
    seller_name: string;
}

export type ReviewIntrf = {
    _id: string;
    created_at: string;
    product_review: string;
    product_id: string;
    seller_id: string;
    customer_id: string;
    customer_name: string;
}

export function ProductDetail() {
    const { _id } = useParams();
    const navigate = useNavigate();
    const { user  } = useAuth();
    const { getData, insertData } = DataController();
    const queryClient = useQueryClient();
    const currentUserId = user ? user.info.id : '';
    
    const { data: selectedProduct } = getData<ProductDetailIntrf[]>({
        api_url: `http://localhost:1234/api/product/detail/${_id}`,
        query_key: [`product-details-${_id}`],
        stale_time: 600000
    });

    const { data: isProductInCart } = getData<boolean>({
        api_url: `http://localhost:1234/api/cart/check?user_id=${currentUserId}&product_id=${_id}`,
        query_key: [`check-cart-${currentUserId}-${_id}`],
        stale_time: 600000
    });

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');

    const insertCartMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            await insertData<CartDetailIntrf>({
                api_url: 'http://localhost:1234/api/cart/add',
                data: {
                    created_at: new Date().toISOString(),
                    product_images: selectedProduct ? selectedProduct[0].product_images : [],
                    product_name: selectedProduct ? selectedProduct[0].product_name : '',
                    product_price: selectedProduct ? selectedProduct[0].product_price : 0,
                    product_total: 1,
                    user_id: currentUserId,
                    product_id: selectedProduct ? selectedProduct[0]._id : '',
                    seller_id: selectedProduct ? selectedProduct[0].user_id : '',
                    seller_name: selectedProduct ? selectedProduct[0].username : '',
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`cart-items-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`cart-stats-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`check-cart-${currentUserId}-${_id}`] });
        },
        onSettled: () => setIsProcessing(false)
    });


    const insertReviewMutation = useMutation({
        onMutate: () => setIsUploading(true),
        mutationFn: async () => {
            await insertData<ReviewIntrf>({
                api_url: 'http://localhost:1234/api/review/make',
                data: {
                    created_at: new Date().toISOString(),
                    product_review: comment.trim(),
                    product_id: selectedProduct ? selectedProduct[0]._id : '',
                    seller_id: selectedProduct ? selectedProduct[0].user_id : '',
                    customer_id: currentUserId,
                    customer_name: user ? user.info.username : ''
                }
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`product-reviews-${_id}`] }),
        onSettled: () => {
            setComment('');
            setIsUploading(false);
        }
    });

    function handleAddToCart() {
        insertCartMutation.mutate();
    }

    function submitReview(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        insertReviewMutation.mutate();
    }
    
    const isPostOwner = user ? user.info.id === selectedProduct?.[0]?.user_id : false;

    return (
        <section className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full overflow-y-auto">
                <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
                            {selectedProduct?.[0]?.username.charAt(0)}
                        </div>
                        <div>
                            <Link to={`/your-shop/${selectedProduct?.[0]?.user_id}`} className="font-semibold text-white hover:underline">
                                {selectedProduct?.[0]?.username}
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
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isProcessing || isProductInCart}
                            className="bg-orange-400 flex gap-2 items-center cursor-pointer hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            <ListPlus color="black" className="mr-1"/>
                            {isProductInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                    )}
                </div>
                
                <div className="flex flex-col gap-4">
                    {selectedProduct && selectedProduct[0] && selectedProduct[0].product_images && selectedProduct[0].product_images.length > 0 ? <ImageSlider images={selectedProduct[0].product_images} /> : null}
                    <div className="text-xl font-bold text-gray-200">{selectedProduct?.[0]?.product_name}</div>
                    <div className="text-gray-200">{selectedProduct?.[0]?.product_description}</div>
                    <div className="text-gray-200">IDR {selectedProduct?.[0]?.product_price}</div>
                    <div className="text-gray-200">Stock: {selectedProduct?.[0]?.product_stock}</div>
                    <form onSubmit={submitReview}>
                        <textarea
                            className="w-full p-2 rounded-lg border-blue-300 border resize-none outline-0 text-gray-200 font-medium"
                            placeholder="Leave a comment..."
                            rows={6}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                type="submit" 
                                disabled={isUploading}
                                className="mt-2 cursor-pointer bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-500 text-blue-950 font-medium py-2 px-4 rounded-lg"
                            >
                                Submit Comment
                            </button>
                            <button 
                                type="button" 
                                disabled={isUploading}
                                onClick={() => navigate(`/reviews/${_id}`)}
                                className="mt-2 cursor-pointer bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-500 text-blue-950 font-medium py-2 px-4 rounded-lg"
                            >
                                View Reviews
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}