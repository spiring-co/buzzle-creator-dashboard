import { Box, Container } from "@material-ui/core"
import { SubHeading ,Text} from "common/Typography"
import React from "react"
export default () => {
    return <Container
        style={{
            padding: 20, paddingLeft: 25, paddingRight: 25,
            margin: 0,
        }}>
        <SubHeading style={{ marginBottom: 15 }}>Webhooks</SubHeading>
        <Text>Coming soon</Text>
    </Container>
}