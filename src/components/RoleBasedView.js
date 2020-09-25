import { RotateLeft } from '@material-ui/icons';
import React from 'react';
import { useAuth } from 'services/auth';

export default ({ allowedRoles, children, redirectTo = null }) => {
    const { user: { role } } = useAuth()
    if (!allowedRoles.includes(role)) {
        return redirectTo !== null ? redirectTo : <div />
    }
    return children
}
