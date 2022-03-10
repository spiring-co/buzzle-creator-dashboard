import { apiRequest } from "../helpers/apiRequest";
import { ec2Instance, Pricing, VideoTemplate as VideoTemplateType } from "../types";
import objectToQueryString from "../helpers/objectToQueryString";

export default function VideoTemplate(
    baseUrl: String,
    headers: HeadersInit
) {
    return {
        video: async (id: string, query?: string, extraParams?: {
            duration?: "month" | "all"
        })
            : Promise<Array<Pricing>> => {
            return apiRequest(`${baseUrl}/renderTime/${id}?${query}&${objectToQueryString(
                extraParams || {}
            )}`, {
                method: "GET",
                headers,
            });
        },
        instance: async (): Promise<Array<ec2Instance>> => {
            return apiRequest(`${baseUrl}/status/instances`, {
                method: "GET",
                headers,
            });
        }
    };
}
