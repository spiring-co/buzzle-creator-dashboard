import { apiRequest } from "../helpers/apiRequest";
import { User as UserType } from "../types";
import objectToQueryString from "../helpers/objectToQueryString";

export default function Analytics(
    baseUrl: String,
    headers: HeadersInit
) {
    return {
        jobsPerTemplate: async (from: Date,
            to?: Date,
            mode?: "template" | "version",
            extraParams?: Record<string, any>
        ): Promise<{
            data: Array<{
                date: string,
                id: string,
                title: string,
                idVideoTemplate?: string,
                idVersion?: string
            }>;
            count: number
        }> => {
            return apiRequest(
                `${baseUrl}/analytics?mode=${mode}&dateUpdated=>=${from.toISOString()}&${to ? `dateUpdated=<=${to.toISOString() || from.toISOString()}` : ""}&${objectToQueryString(
                    extraParams || {}
                )}`,
                {
                    method: "GET",
                    headers,
                }
            );
        },

    }
}
