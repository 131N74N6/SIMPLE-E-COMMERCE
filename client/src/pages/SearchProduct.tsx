import { useState } from 'react';
import { Navbar1, Navbar2 } from '../components/Navbar';
import { CustomerProductList } from '../components/ProductList';
import FilterHandler from '../services/filter.services';
import type { CustomerProductIntrf } from '../components/ProductCard';

export default function SearchProduct() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { searchedPost } = FilterHandler();

    const { paginatedData, isLoadingMore, isReachedEnd, fetchNextPage } = searchedPost<CustomerProductIntrf>({
        api_url: 'http://localhost:1234/api/product/searched',
        query_key: [`search-products-${searchQuery}`],
        limit: 20,
        searched: searchQuery,
        stale_time: 600000,
    });

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            <div className="h-full bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border border-blue-400 shadow-lg md:w-3/4 w-full">
                <form>
                    <input
                        type="text"
                        placeholder="Search products..."
                        name='search_product'
                        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery.trim()}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                    />
                </form>
                <CustomerProductList data={paginatedData} loadMore={isLoadingMore} isReachedEnd={isReachedEnd} setSize={fetchNextPage}/>
            </div>
        </div>
    )
}