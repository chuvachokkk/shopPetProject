
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoute({ authUser,redirectTo}:{ authUser: string | undefined,redirectTo: string}) {
  if(authUser){
    return <Navigate to={redirectTo} replace/>
  }
  return <Outlet/>;
}
