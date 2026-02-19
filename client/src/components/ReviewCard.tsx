import { Link } from "react-router-dom";

export type ReviewCardIntrf = {
    _id: string;
    created_at: string;
    product_review: string;
    customer_id: string;
    customer_name: string;
}

export function ReviewCard(props: ReviewCardIntrf) {
    return (
        <div className="p-4 rounded-lg border border-blue-400">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
                    {props.customer_name.charAt(0)}
                </div>
                <div className="flex flex-col gap-2">
                    <Link to={`/your-shop/${props.customer_id}`} className="font-semibold text-white hover:underline">
                        {props.customer_name}
                    </Link>
                    <div className="text-gray-400 text-sm">
                        {new Date(props.created_at).toLocaleString()}
                    </div>
                </div>
            </div>
            <div className="text-gray-200 mt-2">{props.product_review}</div>
        </div>
    );
}