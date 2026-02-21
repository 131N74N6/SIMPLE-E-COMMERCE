import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import useAuth from "./auth.services";
import { useState } from "react";

export type ChangeDataIntrf<U> = {
    api_url: string;
    data: Partial<Omit<U, '_id'>>;
}

export type GetDataIntrf = {
    api_url: string;
    query_key: string[];
    stale_time: number;
}

export type InfiniteScrollIntrf = {
    api_url: string;
    limit: number;
    query_key: string[];
    stale_time: number;
}

export type InputDataIntrf<Y> = {
    api_url: string;
    data: Omit<Y, '_id'>;
}

export type TransactionIntrf = {
    _id: string;
    created_at: string;
    customer_data: {
        customer_id: string;
        customer_firstname: string;
        customer_lastname: string;
        customer_phone: string;
        customer_email: string;
        customer_address: string;
        customer_city: string;
        customer_postal_code: string;
        customer_country_code: string;
    };
    product_list: {
        product_images: { 
            file_url: string;
            public_id: string;
        }[];
        product_name: string;
        product_price: number;
        product_total: number;
        product_id: string;
        seller_id: string;
        seller_name: string;
    }[];
    total_quantity: number;
    total_price: number;
}

export function DataController() {
    const { loading, user } = useAuth();
    const token = user ? user.token : null;
    const [message, setMessage] = useState<string | null>(null);
    
    async function deleteData(api_url: string) {
        try {
            const request = await fetch(api_url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });

            const response = await request.json();

            if (request.ok) {
                return response;
            } else {
                setMessage(response.message);
                return;
            }
        } catch (error) {
            setMessage('Network Error');
            return;
        }
    }

    async function deleteChosenData(api_url: string, data: string[]) {
        try {
            const request = await fetch(api_url, {
                body: JSON.stringify({ publicIds: data }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });

            const response = await request.json();

            if (request.ok) {
                setMessage(null);
                return response;
            } else {
                setMessage(response.message);
                return;
            }

        } catch (error) {
            setMessage('Network Error');
            return;
        }
    }

    function getData<BIN1999>(props: GetDataIntrf) {
        const { data, error, isLoading } = useQuery<BIN1999, Error>({
            enabled: !!token && !loading,
            queryFn: async () => {
                const request = await fetch(props.api_url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'GET'
                });

                const response = await request.json();

                if (!request.ok) {
                    setMessage(response.message);
                    return;
                }

                return response;
            },
            queryKey: props.query_key,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time
        });

        return { data, error, isLoading }
    }

    function infiniteScroll<BIN1999>(props: InfiniteScrollIntrf) {
        async function fetchData({ pageParam = 1 }: { pageParam?: number }) {
            const request = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });
            
            const response = await request.json();

            if (!request.ok) {
                setMessage(response.message);
                return;
            }

            return response;
        }

        const { 
            data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading 
        } = useInfiniteQuery({
            enabled: !!token && !loading,
            initialPageParam: 1,
            queryKey: props.query_key,
            queryFn: fetchData,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time,
        });

        const paginatedData: BIN1999[] = data ? data.pages.flat() : [];
        const isReachedEnd = !hasNextPage;
        const isLoadMore = isFetchingNextPage;

        return { error, fetchNextPage, isLoading, isLoadMore, isReachedEnd, paginatedData }
    }

    async function insertData<BIN1999>(props: InputDataIntrf<BIN1999>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
            });

            const response = await request.json();

            if (request.ok) {
                setMessage(null);
                return response;
            } else {
                setMessage(response.message);
                return;
            }
        } catch (error) {
            setMessage('Network Error');
            return;
        }
    }

    async function updateData<BIN1999>(props: ChangeDataIntrf<BIN1999>) {
        try {
            const request = await fetch(props.api_url, {
                body: JSON.stringify(props.data),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
            });

            const response = await request.json();

            if (request.ok) {
                setMessage(null);
                return response;
            } else {
                setMessage(response.message);
                return;
            }
        } catch (error) {
            setMessage('Network Error');
            return;
        }
    }

    async function createTransaction(props: Omit<TransactionIntrf, '_id'>) {
        try {
            const request = await fetch('http://localhost:1234/api/payment/create-transaction', {
                body: JSON.stringify(props),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                method: 'POST'
            });
        
            const response = await request.json();

            if (request.ok) {
                setMessage(null);
                return response;
            } else {
                setMessage(response.message);
                return;
            }
        } catch (error) {
            setMessage('Network Error');
            return null;
        }
    }
    
    return { createTransaction, deleteChosenData, deleteData, getData, infiniteScroll, insertData, message, setMessage, updateData }
}