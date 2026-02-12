import { useParams } from 'react-router-dom';
import { Navbar1, Navbar2 } from '../components/Navbar';
import type { CartProductIntrf } from '../components/ProductCard';
import { DataController } from '../services/data.services';
import { CartProductList } from '../components/ProductList';

export default function Cart() {
    const { user_id } = useParams();
    const { infiniteScroll } = DataController();
    const { paginatedData, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<CartProductIntrf>({
        api_url: `http://localhost:1234/cart/${user_id}`,
        query_key: [`cart-items-${user_id}`],
        limit: 20,
        stale_time: 600000,
    });

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <div className="h-full bg-blue-900/20 backdrop-blur-lg rounded-xl p-8 border border-blue-400 shadow-lg md:w-3/4 w-full">
                <CartProductList data={paginatedData} loadMore={isLoadMore} isReachedEnd={isReachedEnd} setSize={fetchNextPage}/>
            </div>
            <Navbar2/>
        </div>
    );
}