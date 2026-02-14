export type ProductDetailIntrf = {
    _id: string;
    created_at: string;
    product_description: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    product_stock: number;
    user_id: string;
}

export function ProductDetail() {
    return (
        <div>
        
        </div>
    )
}