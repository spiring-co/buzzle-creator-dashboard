import { AppConfig } from "common/types";

export const config: AppConfig = {
    "initialFreeAmount": {
        "value": 1,
        "currency": "USD"
    },
    apiURL:"http://localhost:8001",//"https://api.buzzle.site",
    socketURL:"https://sockets.buzzle.site",
    "createrLoyaltyPercentageShareValue": 30,
    "renderLoyaltyPercentageShareValye": 50,
    instances: []
}
