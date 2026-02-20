import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { CartProductIntrf } from '../components/ProductCard';
import { DataController } from '../services/data.services';
import { CartProductList } from '../components/ProductList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Notification2 } from '../components/Notification';
import useAuth from '../services/auth.services';

declare global {
    interface Window {
        snap: any;
    }
}

type CartStatIntrf = {
    product_total: number;
    price_total: number;
}

export default function Cart() {
    const { user_id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { createTransaction, deleteData, getData, infiniteScroll, message, updateData, setMessage } = DataController();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    const { data: cartStats } = getData<CartStatIntrf>({
        api_url: `http://localhost:1234/api/cart/total/${user_id}`,
        query_key: [`cart-stats-${user_id}`],
        stale_time: 600000,
    });

    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<CartProductIntrf>({
        api_url: `http://localhost:1234/api/cart/get/${user_id}`,
        query_key: [`cart-items-${user_id}`],
        limit: 20,
        stale_time: 600000,
    });

    const deleteOneMutation = useMutation({
        onMutate: () => setIsDeleting(true),
        mutationFn: async (_id: string) => await deleteData(`http://localhost:1234/api/cart/delete/${_id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`cart-items-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`cart-stats-${user_id}`] });
        },
        onSettled: () => setIsDeleting(false)
    });

    const deleteAllMutation = useMutation({
        onMutate: () => setIsDeleting(true),
        mutationFn: async () => await deleteData(`http://localhost:1234/api/cart/deletes/${user_id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`cart-items-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`cart-stats-${user_id}`] });
        },
        onSettled: () => setIsDeleting(false)
    });

    const updateMutation = useMutation({
        onMutate: () => setIsUpdating(true),
        mutationFn: async (cartData: Pick<CartProductIntrf, '_id' | 'product_total'>) => {
            await updateData<CartProductIntrf>({
                api_url: `http://localhost:1234/api/cart/update/${cartData._id}`,
                data: { product_total: cartData.product_total }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`cart-items-${user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`cart-stats-${user_id}`] });
        },
        onSettled: () => {
            setIsUpdating(false);
            setSelectedId(null);
        },
    });

    function handleSelect(id: string) {
        setSelectedId(prev => prev === id ? null : id);
    }

    function deleteOneProduct(_id: string) {
        deleteOneMutation.mutate(_id);
    }

    function deleteAllProdcuts() {
        deleteAllMutation.mutate();
    }

    function handleUpdateTotal(cartData: Pick<CartProductIntrf, '_id' | 'product_total'>) {
        updateMutation.mutate(cartData);
    }

    async function handleCheckout() {
        setLoading(true);
        setMessage('');

        try {
            if (!user) return;

            const payload = {
                customer_id: user.info.id,
                customer_name: user.info.username,
                customer_email: user.info.email,
                product_list: paginatedData.map(item => ({
                    product_images: item.product_images,
                    product_name: item.product_name,
                    product_price: item.product_price,
                    product_total: item.product_total,
                    product_id: item._id,
                    seller_id: item.seller_id,
                    seller_name: item.seller_name,
                })),
                total_quantity: cartStats ? cartStats.product_total : 0,
                total_price: cartStats ? cartStats.price_total : 0,
            };

            const result = await createTransaction(payload);
            const { snap_token } = result;

            // Load Midtrans Snap
            window.snap.pay(snap_token, {
                onSuccess: () => {
                    setMessage('Pembayaran berhasil!');
                },
                onPending: () => {
                    setMessage('Menunggu pembayaran...');
                },
                onError: () => {
                    setMessage('Pembayaran gagal!');
                },
                onClose: () => {
                    setMessage('Pembayaran ditutup.');
                }
            });
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen relative z-10">
            <Navbar1/>
            <Navbar2/>
            {message ? <Notification2 message_text={message}/> : null}
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                <div className='grid grid-cols-2 gap-4'>
                    <button 
                        type='button' 
                        className="bg-orange-400 font-medium text-black font-400 text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 cursor-pointer" 
                        disabled={isDeleting} 
                        onClick={deleteAllProdcuts}
                    >
                        Delete All
                    </button>
                    <button 
                        type='button' 
                        className="bg-orange-400 font-medium text-black font-400 text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 cursor-pointer" 
                        disabled={isDeleting || loading} 
                        onClick={handleCheckout}
                    >
                        {loading ? 'Processing...' : 'Check Out'}
                    </button>
                    <div>
                        <div className="text-white font-bold">Total Products: {cartStats ? cartStats.product_total : 0}</div>
                        <div className="text-white font-bold">Total Price: IDR {cartStats ? cartStats.price_total : 0}</div>
                    </div>
                </div>
                <CartProductList 
                    data={paginatedData} 
                    loadMore={isLoadMore} 
                    isReachedEnd={isReachedEnd} 
                    isUpdating={isUpdating}
                    selectedId={selectedId} 
                    setSize={fetchNextPage} 
                    onRemove={deleteOneProduct} 
                    onSelect={handleSelect}
                    onUpdate={handleUpdateTotal}
                />
            </div>
        </div>
    );
}