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

export enum role {
    "user",
    "admin"
}
export type Action = 'buzzle-action-watermark'
    | 'buzzle-action-merge-videos' | 'buzzle-action-add-audio' | "buzzle-action-install-fonts" |
    'buzzle-action-add-thumbnail' | 'buzzle-action-video-orientation'
    | 'buzzle-action-upload' | 'buzzle-action-handbrake' | "render" | 'total'
export type Pricing = {
    idVersion: string,
    loyaltyAmount: number,
    loyaltyCurrency: string,
    idVideoTemplate: string,
} & Record<"half" | "full", Record<Action, { averageTime: number, price: number | string }>>
export interface VersionInterface {
    loyaltyCurrency?: string;
    id: string;
    title: string;
    description?: string;
    sample?: string;
    composition: string;
    loyaltyValue?: number;
    averageRenderTime?: number;
    fields: Array<FieldInterface>;
}
export interface FieldInterface {
    key: string;
    type: string;
    label: string;
    placeholder?: string;
    constraints?: any;
    rendererData?: any;
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
export type publishState = 'unpublished' | "published" | "pending" | "rejected"
export interface VideoTemplate {
    type: "ae" | "remotion";
    keywords?: Array<string>;
    publishState?: publishState;
    orientation: 'landscape' | "portrait";
    rejectionReason?: string;
    staticAssets?: Array<{
        name: string;
        type: string;
        src: string;
    }>;
    fonts?: Array<Font>;

    title: string;
    idCreatedBy: string;
    src: string;
    versions: Array<VersionInterface>;
    description?: string;
    thumbnail?: string;
    id?: string;
    slug: string;
    dateCreated?: string;
    dateUpdated?: string;
    createdBy?: {
        dateCreated: string
        email: string
        id: string
        name: string
    }
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
    renderPrefs?: {
        settingsTemplate?: "full" | "half"|string,
        incrementFrame?: number,
        renderSettings?: "h264",

    };
    extra?: Record<string, any>;
    extraParams?: Record<string, any>;
}
export type ec2Instance = {
    PublicIpAddress: string,
    SpotPrice: string,
    InstanceType: string,
    State: string
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

