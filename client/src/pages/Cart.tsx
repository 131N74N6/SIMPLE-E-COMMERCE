import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { CartProductIntrf } from '../components/ProductCard';
import { DataController } from '../services/data.services';
import { CartProductList } from '../components/ProductList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function Cart() {
    const { user_id } = useParams();
    const queryClient = useQueryClient();
    const { deleteData, infiniteScroll } = DataController();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<CartProductIntrf>({
        api_url: `http://localhost:1234/cart/${user_id}`,
        query_key: [`cart-items-${user_id}`],
        limit: 20,
        stale_time: 600000,
    });

    const deleteOneMutation = useMutation({
        mutationFn: async (_id: string) => await deleteData(`http://localhost:1234/product/delete/${_id}`),
        onMutate: () => setIsDeleting(true),
        onSettled: () => setIsDeleting(false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-products'] });
            queryClient.invalidateQueries({ queryKey: [`your-products-${user_id}`] });
        }
    });

    const deleteAllMutation = useMutation({
        mutationFn: async () => await deleteData(`http://localhost:1234/product/deletes/${user_id}`),
        onMutate: () => setIsDeleting(true),
        onSettled: () => setIsDeleting(false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-products'] });
            queryClient.invalidateQueries({ queryKey: [`your-products-${user_id}`] });
        }
    });

    function deleteOneProduct(_id: string) {
        deleteOneMutation.mutate(_id);
    }

    function deleteAllProdcuts() {
        deleteAllMutation.mutate();
    }

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <div className="h-full bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border border-blue-400 shadow-lg md:w-3/4 w-full">
                <button 
                    type='button' 
                    className={`${isDeleting ? 'cursor-not-allowed bg-orange-800' : 'cursor-pointer'} bg-orange-400 text-black font-400 text-[0.9rem] p-[0.4rem]`} 
                    disabled={isDeleting} 
                    onClick={deleteAllProdcuts}
                >
                    Delete All
                </button>
                <CartProductList data={paginatedData} loadMore={isLoadMore} isReachedEnd={isReachedEnd} setSize={fetchNextPage} onRemove={deleteOneProduct}/>
            </div>
            <Navbar2/>
        </div>
    );
}