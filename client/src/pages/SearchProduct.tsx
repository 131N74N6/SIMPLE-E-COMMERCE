import { useState } from 'react';
import { Navbar1, Navbar2 } from '../components/Navbar';
import { CustomerProductList } from '../components/ProductList';
import FilterHandler from '../services/filter.services';
import type { CustomerProductIntrf } from '../components/ProductCard';
import Loading from '../components/Loading';

export default function SearchProduct() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { searchedProduct } = FilterHandler();

    const { paginatedData, isLoading, error, isLoadingMore, isReachedEnd, fetchNextPage } = searchedProduct<CustomerProductIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/product/search`,
        query_key: [`search-products-${searchQuery}`],
        limit: 20,
        searched: searchQuery,
        stale_time: 600000,
    });

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                <form>
                    <input
                        type="text"
                        placeholder="Search products..."
                        name='search_product'
                        className="w-full p-2 rounded-md border text-blue-300 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery.trim()}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                    />
                </form>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="font-medium text-blue-300 text-[0.9rem] text-center">{error.message}</p>
                    </div> 
                ) : (
                    <CustomerProductList data={paginatedData} loadMore={isLoadingMore} isReachedEnd={isReachedEnd} setSize={fetchNextPage}/>
                )}
            </div>
        </div>
    )
}