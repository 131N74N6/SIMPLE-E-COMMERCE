export type ProductDataIntrf = {
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
}

export function ProductCard(props: ProductDataIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <img src={props.product_images[0].file_url}/>
            <h3>{props.product_name}</h3>
            <p>{props.product_price}</p>
            <button>Buy</button>
        </div>
    );
}

export function ProductList(props: ProductDataIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <img src={props.product_images[0].file_url}/>
            <h3>{props.product_name}</h3>
            <p>{props.product_price}</p>
            <button>Remove</button>
            <button>Edit</button>
        </div>
    );
}

export function ProductCardInCart(props: ProductDataIntrf) {
    return (
        <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl border border-blue-400/30 flex flex-col gap-4 p-4">
            <img src={props.product_images[0].file_url}/>
            <h3>{props.product_name}</h3>
            <p>{props.product_price}</p>
            <button>Buy</button>
            <button>Remove</button>
        </div>
    );
}