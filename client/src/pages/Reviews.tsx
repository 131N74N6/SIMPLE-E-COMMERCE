import { useParams } from "react-router-dom";
import { DataController } from "../services/data.services";
import { Navbar1, Navbar2 } from "../components/Navbar";
import ReviewList from "../components/ReviewList";
import type { ReviewCardIntrf } from "../components/ReviewCard";
import Loading from "../components/Loading";

export function Reviews() {
    const { _id } = useParams();
    const { infiniteScroll } = DataController();
    const { paginatedData, isLoading, error, isReachedEnd, isLoadMore, fetchNextPage } = infiniteScroll<ReviewCardIntrf>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/review/get/${_id}`,
        limit: 20,
        query_key: [`product-reviews-${_id}`],
        stale_time: 600000
    });

    return (
        <div className="flex gap-4 h-screen md:flex-row flex-col bg-gray-800 p-4">
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
                <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400 flex flex-col p-4 gap-4 md:w-3/4 h-full min-h-50 w-full">
                    <ReviewList data={paginatedData} isReachedEnd={isReachedEnd} loadMore={isLoadMore} setSize={fetchNextPage}/>
                </div>
            )}
        </div>
    );
}