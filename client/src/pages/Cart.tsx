import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { CartProductIntrf } from '../components/ProductCard';
import { DataController } from '../services/data.services';
import { CartProductList } from '../components/ProductList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type CartStatIntrf = {
    product_total: number;
    price_total: number;
}

export default function Cart() {
    const { user_id } = useParams();
    const queryClient = useQueryClient();
    const { deleteData, getData, infiniteScroll } = DataController();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    const { data: cartStats } = getData<CartStatIntrf>({
        api_url: `http://localhost:1234/api/cart/total/${user_id}`,
        query_key: [`cart-stats-${user_id}`],
        stale_time: 600000,
    });

    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<CartProductIntrf>({
        api_url: `http://localhost:1234/api/cart/${user_id}`,
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

    function handleSelect(id: string) {
        setSelectedId(prev => prev === id ? null : id);
    }

    function deleteOneProduct(_id: string) {
        deleteOneMutation.mutate(_id);
    }

    function deleteAllProdcuts() {
        deleteAllMutation.mutate();
    }

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                <div className='grid grid-cols-2 gap-4'>
                    <button 
                        type='button' 
                        className="bg-orange-300 text-black font-400 text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 cursor-pointer" 
                        disabled={isDeleting} 
                        onClick={deleteAllProdcuts}
                    >
                        Delete All
                    </button>
                    <button 
                        type='button' 
                        className="bg-orange-300 text-black font-400 text-[0.9rem] p-[0.4rem] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 cursor-pointer" 
                        disabled={isDeleting} 
                    >
                        Check Out
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
                    selectedId={selectedId} 
                    setSize={fetchNextPage} 
                    onRemove={deleteOneProduct} 
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
}