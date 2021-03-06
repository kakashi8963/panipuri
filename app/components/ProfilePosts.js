import Axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams, Link } from 'react-router-dom'
import LoadingIcon from './LoadingIcon'
function ProfilePosts() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const { username } = useParams()
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`)
                setIsLoading(false)
                setPosts(response.data)
            } catch (e) {

            }
        } fetchPosts()
    }, [username])

    if (isLoading) return <LoadingIcon />
    return (
        <div className="list-group">
            {posts.map(post => {
                const date = new Date(post.createdDate)
                const dateFormatted = `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`
                return (
                    <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>{" "}
                        <span className="text-muted small">on {dateFormatted} </span>
                    </Link>
                )
            })}
        </div>
    )
}

export default ProfilePosts