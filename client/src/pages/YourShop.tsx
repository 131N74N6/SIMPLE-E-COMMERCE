import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { SellerProductIntrf } from '../components/ProductCard';
import { SellerProductList } from '../components/ProductList';
import { DataController } from '../services/data.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function YourShop() {
    const { user_id } = useParams();
    const queryClient = useQueryClient();
    const { deleteData, infiniteScroll } = DataController();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<SellerProductIntrf>({
        api_url: `http://localhost:1234/product/owner/${user_id}`,
        query_key: [`your-products-${user_id}`],
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
            <Navbar2/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                <button 
                    type='button' 
                    className={`${isDeleting ? 'cursor-not-allowed bg-orange-800' : 'cursor-pointer'} bg-orange-400 text-black font-400 text-[0.9rem] p-[0.4rem]`} 
                    disabled={isDeleting} 
                    onClick={deleteAllProdcuts}
                >
                    Delete All
                </button>
                <SellerProductList 
                    data={paginatedData} 
                    loadMore={isLoadMore} 
                    isReachedEnd={isReachedEnd} 
                    setSize={fetchNextPage} 
                    onDelete={deleteOneProduct}
                />
            </div>
        </div>
    );
}