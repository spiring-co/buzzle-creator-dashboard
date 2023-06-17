import { AppConfig } from "common/types";
import dotenv from "dotenv"
dotenv.config({ path: ("../../.env") })

const {REACT_APP_API_URL, REACT_APP_SOCKET_SERVER_URL} = process.env;

export const config: AppConfig = {
    "initialFreeAmount": {
        "value": 1,
        "currency": "USD"
    },
    apiURL:REACT_APP_API_URL || "http://localhost:5001",
    socketURL:REACT_APP_SOCKET_SERVER_URL || "http://localhost:5001",
    "createrLoyaltyPercentageShareValue": 30,
    "renderLoyaltyPercentageShareValye": 50,
    instances: []
}
