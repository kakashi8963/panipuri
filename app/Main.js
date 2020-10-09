import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from 'use-immer'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { CSSTransition } from 'react-transition-group'
import Axios from "axios"
Axios.defaults.baseURL = process.env.BACKENDURL || "https://panipuri.herokuapp.com"

import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

import LoadingIcon from "./components/LoadingIcon"
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))

import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import ProfilePosts from "./components/ProfilePosts"
import EditPost from "./components/EditPost"
const Search = React.lazy(() => import("./components/Search"))
import Chat from './components/Chat'


function Main() {
    const initialState = {
        loggedin: Boolean(localStorage.getItem("complexappToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexappToken"),
            username: localStorage.getItem("complexappUsername"),
            avatar: localStorage.getItem("complexappAvatar")
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0
    }
    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedin = true
                draft.user = action.data
                return
            case "logout":
                draft.loggedin = false
                return
            case "flashMessage":
                draft.flashMessages.push(action.value)
                return
            case "openSearch":
                draft.isSearchOpen = true
                return
            case "closeSearch":
                draft.isSearchOpen = false
                return
            case "toggleChat":
                draft.isChatOpen = !draft.isChatOpen
                return
            case "closeChat":
                draft.isChatOpen = false
                return
            case "increment":
                draft.unreadChatCount++
                return
            case "clear":
                draft.unreadChatCount = 0
                return
        }
    }


    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.loggedin) {
            localStorage.setItem("complexappToken", state.user.token)
            localStorage.setItem("complexappUsername", state.user.username)
            localStorage.setItem("complexappAvatar", state.user.avatar)

        } else {
            localStorage.removeItem("complexappToken")
            localStorage.removeItem("complexappUsername")
            localStorage.removeItem("complexappAvatar")

        }

    }, [state.loggedin])

    useEffect(() => {
        if (state.loggedin) {
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try {
                    const response = await Axios.post('/checkToken', { toke: state.user.token }, { cancelToken: ourRequest.token })
                    if (!response.data) {
                        dispatch({ type: "logout" })
                        dispatch({ type: "flashMessage", value: "Your session has expired" })
                    }
                }
                catch (e) {

                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
    }, [])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />

                    <Header />
                    <Suspense fallback={<LoadingIcon />}>
                        <Switch>
                            <Route path="/profile/:username">
                                <Profile />
                            </Route>

                            <Route path="/" exact>
                                {state.loggedin ? < Home /> : <HomeGuest />}
                            </Route>
                            <Route path="/post/:id" exact>
                                <ViewSinglePost />
                            </Route>
                            <Route path="/post/:id/edit" exact >
                                <EditPost />
                            </Route>

                            <Route path="/create-post" >
                                <CreatePost />

                            </Route>
                            <Route path="/about-us">
                                <About />
                            </Route>
                            <Route path="/terms" >
                                <Terms />
                            </Route>
                        </Switch>
                    </Suspense>
                    <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
                        <div className="search-overlay">
                            <Suspense fallback="">
                                <Search />
                            </Suspense>
                        </div>
                    </CSSTransition>
                    <Chat />
                    <Footer />

                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
    module.hot.accept()
}
