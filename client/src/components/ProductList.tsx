import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import type { CartProductIntrf, CustomerProductIntrf, SellerProductIntrf } from "./ProductCard";
import { ProductCardInCart, CustomerProductCard, SellerProductCard } from "./ProductCard";
import Loading from "./Loading";

export type SellerListIntrf = {
    data: SellerProductIntrf[];
    isReachedEnd: boolean;
    loadMore: boolean;
    isShopOwner: boolean;
    setSize: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    onDelete: (_id: string) => void;
}

export type CustomerListIntrf = {
    data: CustomerProductIntrf[];
    isReachedEnd: boolean;
    loadMore: boolean;
    setSize: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}

export type CartListIntrf = {
    data: CartProductIntrf[];
    isReachedEnd: boolean;
    loadMore: boolean;
    setSize: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    onRemove: (_id: string) => void;
}

export function CartProductList(props: CartListIntrf) {
    if (props.data.length === 0) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
                <p className="text-white">No products available</p>
            </div>
        );
    }

    return (
        <section className="gap-4 flex flex-col overflow-y-auto">
            <div className="flex flex-col gap-4 overflow-y-auto">
                {props.data.map((product) => (
                    <ProductCardInCart key={product._id} {...product} onRemove={props.onRemove}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.loadMore ? <div className="flex justify-center"><Loading/></div> : null}
                {!props.isReachedEnd ? (
                    <button 
                        type="button"
                        onClick={() => props.setSize()}
                        className="bg-purple-400 text-gray-800 w-30 rounded font-medium cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button>
                ) : props.data.length < 12 ? (
                    null 
                ) : (
                    <p className="text-purple-400 font-medium text-center text-[1rem]">No More Data to Show</p>
                )}
            </div>
        </section>
    );
}

export function SellerProductList(props: SellerListIntrf) {
    if (props.data.length === 0) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
                <p className="text-white">No products available</p>
            </div>
        );
    }

    return (
        <section className="gap-4 flex flex-col overflow-y-auto">
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 overflow-y-auto">
                {props.data.map((product) => (
                    <SellerProductCard key={product._id} {...product} isShopOwner={props.isShopOwner} onDelete={props.onDelete}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.loadMore ? <div className="flex justify-center"><Loading/></div> : null}
                {!props.isReachedEnd ? (
                    <button 
                        type="button"
                        onClick={() => props.setSize()}
                        className="bg-purple-400 text-gray-800 w-30 rounded font-medium cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button>
                ) : props.data.length < 12 ? (
                    null 
                ) : (
                    <p className="text-purple-400 font-medium text-center text-[1rem]">No More Data to Show</p>
                )}
            </div>
        </section>
        
    );
}

export function CustomerProductList(props: CustomerListIntrf) {
    if (props.data.length === 0) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
                <p className="text-white">No products available</p>
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-4 overflow-y-auto">
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 overflow-y-auto">
                {props.data.map((product) => (
                    <CustomerProductCard key={product._id} {...product}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.loadMore ? <div className="flex justify-center"><Loading/></div> : null}
                {!props.isReachedEnd ? (
                    <button 
                        type="button"
                        onClick={() => props.setSize()}
                        className="bg-purple-400 text-gray-800 w-30 rounded font-medium cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button>
                ) : props.data.length < 12 ? (
                    null 
                ) : (
                    <p className="text-purple-400 font-medium text-center text-[1rem]">No More Data to Show</p>
                )}
            </div>
        </section>
    );
}