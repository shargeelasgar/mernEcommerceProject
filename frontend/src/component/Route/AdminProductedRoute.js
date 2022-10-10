import React from 'react'
import {  useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminProductedRoute = ({element: Element}) => {

    const {loading, isAuthenticated ,user} = useSelector((state) => state.user)
    const history = useNavigate()
  
    
    if(isAuthenticated === false && loading === false){
        return  history('/login') 
    } else if(isAuthenticated && loading === false && user.role !== "admin" ){
        return  history('/login') 
    } else if(loading === false ){
        
      return <Element />
    }
}

export default AdminProductedRoute
