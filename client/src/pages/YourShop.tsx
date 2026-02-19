import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { SellerProductIntrf } from '../components/ProductCard';
import { SellerProductList } from '../components/ProductList';
import { DataController } from '../services/data.services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import useAuth from '../services/auth.services';

export default function YourShop() {
    const { user_id } = useParams();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { deleteData, infiniteScroll } = DataController();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    
    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<SellerProductIntrf>({
        api_url: `http://localhost:1234/api/product/owner/${user_id}`,
        query_key: [`your-products-${user_id}`],
        limit: 20,
        stale_time: 600000,
    });

    const deleteOneMutation = useMutation({
        onMutate: () => setIsDeleting(true),
        mutationFn: async (_id: string) => await deleteData(`http://localhost:1234/api/product/delete/${_id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-products'] });
            queryClient.invalidateQueries({ queryKey: [`your-products-${user_id}`] });
        },
        onSettled: () => setIsDeleting(false)
    });

    const deleteAllMutation = useMutation({
        onMutate: () => setIsDeleting(true),
        mutationFn: async () => await deleteData(`http://localhost:1234/api/product/deletes/${user_id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-products'] });
            queryClient.invalidateQueries({ queryKey: [`your-products-${user_id}`] });
        },
        onSettled: () => setIsDeleting(false)
    });

    function deleteOneProduct(_id: string) {
        deleteOneMutation.mutate(_id);
    }

    function deleteAllProdcuts() {
        deleteAllMutation.mutate();
    }

    const isShopOwner = user ? user.info.id === user_id : false;

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                {isShopOwner ? (
                    <button 
                        type='button' 
                        className=" font-medium bg-orange-400 text-black font-400 text-[0.9rem] p-[0.4rem] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-orange-500" 
                        disabled={isDeleting} 
                        onClick={deleteAllProdcuts}
                    >
                        Delete All
                    </button>
                ) : null}
                <SellerProductList 
                    data={paginatedData} 
                    loadMore={isLoadMore} 
                    isShopOwner={isShopOwner}
                    isReachedEnd={isReachedEnd} 
                    setSize={fetchNextPage} 
                    onDelete={deleteOneProduct}
                />
            </div>
        </div>
    );
}