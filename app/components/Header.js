import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import HeaderLoggedout from './HeaderLoggedout'
import HeaderLoggedin from './HeaderLoggedin'
import StateContext from '../StateContext'
function Header(props) {
    const appState = useContext(StateContext)
    const headerContent = appState.loggedin ? <HeaderLoggedin /> : <HeaderLoggedout />
    return (
        <header className="header-bar bg-primary mb-3">
            <div className="container d-flex flex-column flex-md-row align-items-center p-3">
                <h4 className="my-0 mr-md-auto font-weight-normal">
                    <Link to="/" className="text-white">
                        NOTEBOOK
                    </Link>
                </h4>
                {!props.staticEmpty ? headerContent : ""}
            </div>
        </header>
    )
}

export default Header