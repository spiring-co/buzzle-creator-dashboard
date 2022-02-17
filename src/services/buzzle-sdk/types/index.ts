export interface APIParam {
    baseUrl: string;
    authToken?: string;
}
export enum jobState {
    "created",
    "started",
    "finished",
    "error",
}
export enum publishState {
    "pending",
    "published",
    "unpublished",
    "rejected",
}
export enum role {
    "user",
    "admin"
}
export interface VersionInterface {
    loyaltyCurrency?: string;
    id?: string;
    title: string;
    description?: string;
    sample?: string;
    composition: string;
    loyaltyValue?: string;
    averageRenderTime?: number;
    fields: Array<{
        key: string;
        _id?: string;
        type: string;
        label: string;
        placeholder?: string;
        constraints?: Record<string, any>;
        rendererData?: Record<string, any>;
    }>;
}

export interface Job {
    actions?: {
        prerender: Array<any>;
        postrender: Array<any>;
    };
    state?: jobState;
    _id?: string;
    idVideoTemplate: string;
    idVersion: string;
    data: string;
    id?: string;
    output?: Array<{
        _id: string;
        label: string;
        src: string;
        updatedAt: string;
        dateCreated: string;
    }>;
    dateCreated?: string;
    dateUpdated?: string;
    __v?: 0;
    dateQueued: string;
    dateStarted: string;
    dateFinished: string;
    renderTime: number;
    queueTime: number;
    videoTemplate: VideoTemplate;
}
export interface VideoTemplate {
    type?: string;
    keywords?: Array<string>;
    publishState?: publishState;
    rejectionReason?: string;
    staticAssets?: Array<{
        name: string;
        type: string;
        src: string;
    }>;
    fonts?: Array<Font>;
    _id?: string;
    title: string;
    idCreator: string;
    src: string;
    versions: Array<VersionInterface>;
    description?: string;
    thumbnail?: string;
    id?: string;
    dateCreated?: string;
    dateUpdated?: string;
    __v?: number;
}

export interface Font {
    id?: string;
    src: string;
    name: string;
}

export interface User {
    role: role;
    name: string;
    email: string;
    pushTokens: Array<string>,
    webhooks: Array<any>,
    dateCreated: Date,
    dateUpdated: Date,
    id: string;
    slug: string,
    stripeCustomerId: string
    APIKey: string
}

export interface JobUpdateParam {
    actions?: Record<string, any>;
    data: Record<string, any>;
    renderPrefs: Record<string, any>;
    extra: Record<string, any>;
    extraParams: Record<string, any>;
}
export interface JobParam extends JobUpdateParam {
    idVideoTemplate: string;
    idVersion: string;
}
export interface MultiJobUpdates extends JobUpdateParam {
    id: string;
}

export interface VideoTemplateInterface {

    update: (id: string, data: Record<string, any>, extraParams?: Record<string, any>) => Promise<any>;
    updateMany: (data: Record<string, any>, extraParams?: Record<string, any>) => Promise<any>;
    delete: (id: string, extraParams?: Record<string, any>) => Promise<any>;
    deleteMany: (data: Record<string, any>, extraParams?: Record<string, any>) => Promise<any>;
}

