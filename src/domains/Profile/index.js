import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "services/auth";

import AdminProfile from './AdminProfile'
import UserProfile from './UserProfile'
import CreatorProfile from './CreatorProfile'

export default () => {
    const { user: { role = "Creator" } } = useAuth()
    // if seperate profile without code sharing than this structure

    // const profilesAsPerRole = {
    //     'Admin': () => <AdminProfile />,
    //     'Creator': () => <CreatorProfile />,
    //     'User': () => <UserProfile />
    // }
    //return profilesAsPerRole[role]()

    //else just rename CreatorProfile to Profile
    return <CreatorProfile />
}