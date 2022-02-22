import AlertHandler from "common/AlertHandler"
import React, { useState } from "react"
import { useAuth } from "services/auth"
export default () => {
    const { user, verifyEmail } = useAuth()
    const [message, setMessage] = useState("Your email verification is pending!")
    const [type, setType] = useState<"warning" | "info">("warning")
    const handleVerify = async () => {
        await verifyEmail()
        setMessage(`Email verification link has been sent to ${user?.email}, Follow the instructions to verify your email`)
        setType("info")
    }
    if (user?.emailVerified) {
        return <div />
    }
    return <AlertHandler message={message} buttonText="verify"
        severity={type}
        onRetry={handleVerify} />

}