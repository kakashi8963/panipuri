import Axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams, Link } from 'react-router-dom'
import LoadingIcon from './LoadingIcon'
function ProfileFollowers() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/followers`)
                setIsLoading(false)
                setPosts(response.data)
            } catch (e) {

            }
        } fetchPosts()
    }, [username])

    if (isLoading) return <LoadingIcon />
    return (
        <div className="list-group">
            {posts.map((follower, index) => {

                return (
                    <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={follower.avatar} /> {follower.username}

                    </Link>
                )
            })}
        </div>
    )
}

export default ProfileFollowers