import { Box, Divider ,Container} from "@material-ui/core"
import React from "react"
import AuthOperations from "common/AuthOperations";
import Credentials from "./Credentials";

export default () => {
    return <Box>
        <AuthOperations initialMode="change-pass" />
        <Container>
            <Divider />
        </Container>
        <Credentials />
    </Box>
}