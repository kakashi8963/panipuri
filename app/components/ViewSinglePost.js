import React, { useEffect, useState, useContext } from "react"
import Page from './Page'
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from 'axios'
import LoadingIcon from './LoadingIcon'
import ReactMArkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglepost(props) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState()

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
                setPost(response.data)
                setIsLoading(false)
            } catch (e) {

            }
        } fetchPost()
        return () => {
            ourRequest.cancel()
        }
    }, [id])

    if (isLoading)
        return (
            <Page><LoadingIcon /></Page>
        )
    if (!isLoading && !post) {
        return (
            <NotFound />
        )
    }

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`
    function isOwner() {
        if (appState.loggedin) {
            return appState.user.username == post.author.username
        }
        return false
    }
    async function deleteHandler() {
        const areYouSure = window.confirm("Are you sure")
        if (areYouSure) {
            try {
                const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
                if (response.data == "Success") {
                    appDispatch({ type: "flashMessage", value: "Post is deleted" })
                    props.history.push(`/profile/${appState.user.username}`)
                }
            }
            catch (e) {

            }
        }
    }

    return (
        <Page>

            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {isOwner() && (
                    <span className="pt-2">
                        <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2" ><i className="fas fa-edit"></i></Link>
                        <ReactTooltip id="edit" className="custom-toolkit" />
                        <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"></i></a>
                        <ReactTooltip id="delete" className="custom-toolkit" />
                    </span>
                )}

            </div>

            <p className="text-muted small mb-4">
                <a href="#">
                    <img className="avatar-tiny" src={post.author.avatar} />
                </a>
    Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
            </p>

            <div className="body-content">
                <ReactMArkdown source={post.body} />
            </div>

        </Page>
    )
}

export default withRouter(ViewSinglepost)