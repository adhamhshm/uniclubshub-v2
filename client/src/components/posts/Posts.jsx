import "./posts.scss";
import Post from "./post/Post";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../request.js";

// the userId may come from the profile of the user
const Posts = ({ userId }) => {

    const { isLoading, error, data } = useQuery(["posts"], () => 
        makeRequest.get("/posts?userId=" + userId)
        .then((res) => {
            const fetchedPosts = res.data;
            return fetchedPosts;
        })
    );

    return (
        <div className="posts">
            {isLoading 
                ? ( "Loading..." ) 
                : error ? ( "Something went wrong...") 
                : (
                    data.map((post) => {
                        return (
                            <Post post={post} key={post.id} />
                        )
                    })
                )
            }
        </div>
    )
}

export default Posts;