import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { SellerProductIntrf } from '../components/ProductCard';
import { SellerProductList } from '../components/ProductList';
import { DataController } from '../services/data.services';

export default function YourShop() {
    const { user_id } = useParams();
    const { infiniteScroll } = DataController();
    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<SellerProductIntrf>({
        api_url: `http://localhost:1234/product/${user_id}`,
        query_key: [`products-${user_id}`],
        limit: 20,
        stale_time: 600000,
    });

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <div className="h-full bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border border-blue-400 shadow-lg md:w-3/4 w-full">
                <SellerProductList data={paginatedData} loadMore={isLoadMore} isReachedEnd={isReachedEnd} setSize={fetchNextPage}/>
            </div>
            <Navbar2/>
        </div>
    );
}