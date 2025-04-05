import React from 'react'
import AuthContext from './contexts/AuthContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'


function PrivateRoute({children , ...rest}) {
    const {isAuthenticated} = useContext(AuthContext)

    if(isAuthenticated === null){
        return <h1>loading ....</h1>
    }


    return (
        isAuthenticated ? children : <Navigate to='auth/login/'/>
    )

  
}

export default PrivateRoute
