import { useInfiniteQuery } from "@tanstack/react-query";
import useAuth from "./auth.services";

export type SearchedPost = {
    api_url: string;
    limit: number;
    query_key: string[];
    searched: string;
    stale_time: number;
}

export default function FilterHandler() {
    const { user } = useAuth();
    const token = user ? user.token : null;
    
    function searchedPost<BIN1999>(props: SearchedPost) {
        const fecthers = async ({ pageParam = 1 }: { pageParam?: number }) => {
            const request = await fetch(`${props.api_url}?searched=${props.searched}&page=${pageParam}&limit=${props.limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET'
            });
            
            const response = await request.json();
            return response;
        }

        const {
            data,
            error,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isLoading,
            refetch,
        } = useInfiniteQuery({
            enabled: !!props.searched,
            queryKey: props.query_key,
            queryFn: fecthers,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            initialPageParam: 1,
            staleTime: props.stale_time,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
        });

        const paginatedData: BIN1999[] = data ? data.pages.flat() : [];
        const isReachedEnd = !hasNextPage;
        const isLoadingMore = isFetchingNextPage;

        return {
            paginatedData,
            error,
            isLoading,
            isLoadingMore,
            isReachedEnd,
            fetchNextPage,
            refetch,
        }
    }

    return { searchedPost }
}