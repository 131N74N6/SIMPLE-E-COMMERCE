import Loading from "../components/Loading";
import { Navbar1, Navbar2 } from "../components/Navbar"
import type { CustomerProductIntrf } from "../components/ProductCard";
import { CustomerProductList } from "../components/ProductList";
import { DataController } from "../services/data.services";

export default function Home() {
    const { infiniteScroll } = DataController();

    const { paginatedData, isLoading, error, isLoadMore, isReachedEnd, fetchNextPage } = infiniteScroll<CustomerProductIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/product/get-all`,
        query_key: ['all-products'],
        limit: 20,
        stale_time: 600000,
    });

    return (
        <div className="flex gap-4 md:flex-row flex-col bg-gray-800 p-4 h-screen">
            <Navbar1/>
            <Navbar2/>
            {isLoading ? (
                <div className="flex justify-center items-center h-full w-full md:w-3/4 bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 ">
                    <Loading/>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-full w-full md:w-3/4 bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 ">
                    <p className="font-medium text-blue-300 text-[0.9rem] text-center">{error.message}</p>
                </div> 
            ) : (
                <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col pt-4 px-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                    <CustomerProductList data={paginatedData} loadMore={isLoadMore} isReachedEnd={isReachedEnd} setSize={fetchNextPage}/>
                </div>
            )}
        </div>
    );
}