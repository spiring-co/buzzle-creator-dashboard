import { RotateLeft } from '@material-ui/icons';
import React from 'react';
import { useAuth } from 'services/auth';

export default ({ allowedRoles, children, redirectTo = null }) => {
    const { isAdmin } = useAuth()
    if (!allowedRoles.includes(isAdmin ? 'admin' : 'user') && allowedRoles !== "*") {
        return redirectTo !== null ? redirectTo : <div />
    }
    return children
}
