import React from 'react'
import AuthContext from './contexts/AuthContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from './Components/Loading'


function PrivateRoute({children , ...rest}) {
    const {isAuthenticated} = useContext(AuthContext)

    if(isAuthenticated === null){
        return <Loading/>
    }


    return (
        isAuthenticated ? children : <Navigate to='auth/login/'/>
    )

  
}

export default PrivateRoute
