import "./clublist.scss";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../request";
import { Link } from "react-router-dom";

const ClubList = ({ currentUser, searchQuery }) => {

    // Extract the current user's ID 
    const userId = currentUser.id;
    // Initialize the query client
    const queryClient = useQueryClient();
    // Define a function to get data from the query cache
    const getFromCache = (key) => {
        return queryClient.getQueryData(key);
    };

    // Fetch user follow relations with clubs
    const { data: followRelationData } = useQuery(["followRelationOfParticipant", userId], () => {
        return makeRequest.get("/follow_relations/participant?followerUserId=" + userId)
        .then((res) => res.data )
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    },
    {
        // Add caching options
        cacheTime: 3600 * 1000, // Cache for one hour
        staleTime: 1000 * 60, // Refetch data if it's stale (1 minute, adjust as needed)
    });

    // Use a query to fetch the list of clubs with optional search query
    const { isLoading: clubListLoading, error: clubListError, data: clubListData } = useQuery(["userlists", searchQuery], async () => {
        // Attempt to get data from the cache without making a network request.
        const cache = getFromCache(["userlists", searchQuery]);
        if (cache) {
            return cache;
        };
        // If the cache doesn't have the data, make a request to the server
        return makeRequest.get(`/users/club-list?from&userId=${userId}&searchQuery=${searchQuery}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error; // Propagate the error for proper error handling
        })
    });

    // Define a mutation for following/unfollowing clubs
    const followUserMutation = useMutation((followClubData) => {
        if (followClubData.isFollowing) {
            // If already following, unfollow
            return makeRequest.delete("/follow_relations?userId=" + followClubData.clubUserId);
        }
        else {
            // If not following, follow
            return makeRequest.post("/follow_relations", { userId: followClubData.clubUserId });
        }
    }, 
    {
        onSuccess: () => {
            // Invalidate and refetch the followRelationOfParticipant query
            queryClient.invalidateQueries({ queryKey: "followRelationOfParticipant" })
        },
    })

    // Function to handle club follow/unfollow
    const handleFollow = (isFollowing, clubUserId) => {
        followUserMutation.mutate({ isFollowing, clubUserId });
    };

    return (
        <div className="club-list">
            <div className="user-list-container">
                {clubListLoading ? "Loading clubs..." : 
                    clubListError ? "Cannot fetch the club list." : 
                    !clubListData || clubListData.length === 0 ? `There are no clubs with "${searchQuery}".` :
                    clubListData.map((clubUser) => {
                        // Check if the clubUser is being followed
                        const isFollowing = followRelationData?.some(item => item.followedUserId === String(clubUser.id));
                        return (
                            <div className="user-list" key={clubUser.id}>
                                <div className="user-info">
                                    <img src={clubUser.profilePhoto ? clubUser.profilePhoto : "/default/default-club-image.png"} alt={clubUser.name} />
                                    <Link to={`/profile/${clubUser.id}`} style={{ textDecoration: "none"}}>
                                        <span>{clubUser.name}</span>
                                    </Link>
                                </div>
                                <div className="buttons">
                                    <button 
                                        className={isFollowing ? "following-button" : ""} 
                                        onClick={() => {handleFollow(isFollowing, clubUser.id)}}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default ClubList;