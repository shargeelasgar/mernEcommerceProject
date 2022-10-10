
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

const ProductedRoute =  ({element: Element}) => {
    const {loading, isAuthenticated ,user} = useSelector((state) => state.user)
    const history = useNavigate()
  
    
    if(isAuthenticated === false && loading === false){
        return  history('/login') 
    } else if(loading === false){
      return <Element />
    }
    
    // if(loading === false && isAuthenticated ){
    //   return <Element />
    // }else{
    //     history('/login')    
    //   }

      // if(isAuthenticated === false){
        //   <Navigate to="/login" />
        // }else{
          //   if(!loading){
            //     return <Element />
            //   }
            // }
            
      // useEffect(() => {
      //   if(isAuthenticated === false){
        //   }else if(!loading){
          //     return <Element/>
          //   }
          // })
          
  //       const Auth = () => {
  //       if(isAuthenticated === false){
  //        return  <Navigate to="/login" />      
  //       }else if(!loading){
  //        return  <Element/>
  //       }
  //     }
  // return(
  //   Auth()
  //   )
    // !loading &&  isAuthenticated  ? <Element /> : <Navigate to="/login"/>
     
    
      
      
  
};

export default ProductedRoute;


       
  