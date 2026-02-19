import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { type ReviewCardIntrf } from "./ReviewCard";
import { ReviewCard } from "./ReviewCard";
import Loading from "./Loading";

export type ReviewListIntrf = {
    data: ReviewCardIntrf[];
    isReachedEnd: boolean;
    loadMore: boolean;
    setSize: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}

export default function ReviewList(props: ReviewListIntrf) {
    if (props.data.length === 0) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
                <p className="text-white">No reviews available</p>
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-4 overflow-y-auto">
                {props.data.map((review) => (
                    <ReviewCard key={review._id} {...review} />
                ))}
            </div>
            <div className="flex justify-center">
                {props.loadMore ? <div className="flex justify-center"><Loading/></div> : null}
                {!props.isReachedEnd ? (
                    <button 
                        type="button"
                        onClick={() => props.setSize()}
                        className="bg-blue-300 text-blue-800 w-30 rounded font-medium cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button>
                ) : props.data.length < 20 ? (
                    <></>
                ) : (
                    <p className="text-blue-300 font-medium text-center text-[1rem]">No More Data to Show</p>
                )}
            </div>
        </section>
    );
}
