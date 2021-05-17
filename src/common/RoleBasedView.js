import { RotateLeft } from '@material-ui/icons';
import React from 'react';
import { useAuth } from 'services/auth';

export default ({ allowedRoles, children, redirectTo = null }) => {
    const { user ={},initializing} = useAuth()
    const {role=''}=user?user:{}
    if(initializing){
        return <div/>
    }
    if (!allowedRoles.includes(role) && allowedRoles !== "*") {
        return redirectTo !== null ? redirectTo : <div />
    }
    return children
}
