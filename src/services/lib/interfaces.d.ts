export interface APIParam {
  baseUrl: String;
  authToken: String;
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
export enum creatorRole {
  "Creator",
}
export interface VersionInterface {
  loyaltyCurrency?: String;
  id?: String;
  title: String;
  description?: String;
  sample?: String;
  composition: String;
  loyaltyValue?: String;
  averageRenderTime?: Number;
  fields: Array<{
    key: String;
    _id?: String;
    type: String;
    label: String;
    placeholder?: String;
    constraints?: Object;
    rendererData?: Object;
  }>;
}

export interface Job {
  actions?: {
    prerender: Array<any>;
    postrender: Array<any>;
  };
  state?: jobState;
  _id?: String;
  idVideoTemplate: String;
  idVersion: String;
  data: String;
  id?: String;
  output?: Array<{
    _id: String;
    label: String;
    src: String;
    updatedAt: String;
    dateCreated: String;
  }>;
  dateCreated?: String;
  dateUpdated?: String;
  __v?: 0;
  dateQueued: String;
  dateStarted: String;
  dateFinished: String;
  renderTime: Number;
  queueTime: Number;
  videoTemplate: VideoTemplate;
}
export interface VideoTemplate {
  type?: String;
  keywords?: Array<String>;
  publishState?: publishState;
  rejectionReason?: String;
  staticAssets?: Array<{
    name: String;
    type: String;
    src: String;
  }>;
  fonts?: Array<Font>;
  _id?: String;
  title: String;
  idCreator: String;
  src: String;
  versions: Array<VersionInterface>;
  description?: String;
  thumbnail?: String;
  id?: String;
  dateCreated?: String;
  dateUpdated?: String;
  __v?: Number;
}

export interface Font {
  id?: String;
  src: String;
  name: String;
}

export interface Creator {
  loginAttempts?: Number;
  isVerified?: Boolean;
  otp?: String;
  imageUrl?: String;
  role?: creatorRole;
  _id?: String;
  name: String;
  email: String;
  password: String;
  id?: String;
  __v?: Number;
}

export interface JobUpdateParam {
  actions?: Object;
  data: Object;
  renderPrefs: Object;
}
export interface JobParam extends JobUpdateParam {
  idVideoTemplate: String;
  idVersion: String;
}
export interface MultiJobUpdates extends JobUpdateParam {
  id: String;
}
export interface SearchInterface {
  get: (
    text: String,
    page: Number,
    size: Number
  ) => Promise<{
    videoTemplates: { data: Array<VideoTemplate | []>; count: Number };
    jobs: { data: Array<Job | []>; count: Number };
    creators: { data: Array<Creator | []>; count: Number };
  }>;
  getJobs: (
    text: String,
    page: Number,
    size: Number
  ) => Promise<{ data: Array<Job | []>; count: Number }>;
  getVideoTemplates: (
    text: String,
    page: Number,
    size: Number
  ) => Promise<{
    data: Array<VideoTemplate | []>;
    count: Number;
  }>;
  getCreators: (
    text: String,
    page: Number,
    size: Number
  ) => Promise<{
    data: Array<Creator | []>;
    count: Number;
  }>;
}
export interface FontInterface {
  get: (name: String) => Promise<Font | Object>;
  create: (data: Font) => Promise<Object>;
}

export interface VideoTemplateInterface {
  getAll: (
    page: Number,
    size: Number,
    query: String
  ) => Promise<{ data: Array<VideoTemplate | []>; count: Number }>;
  get: (id: String) => Promise<VideoTemplate | {}>;

  create: (data: String) => Promise<any>;

  update: (id: String, data: Object) => Promise<any>;

  delete: (id: String) => Promise<any>;
}

export interface CreatorInterface {
  getAll: (
    page: Number,
    size: Number
  ) => Promise<{ data: Array<Creator | []>; count: Number }>;
  get: (id: String) => Promise<Creator | {}>;
  create: (user: Creator) => Promise<any>;
  changePassword: (id: String, data: Object) => Promise<any>;
  update: (id: String, data: Object) => Promise<any>;
  getVideoTemplates: (
    id: String,
    page: Number,
    size: Number
  ) => Promise<{ data: Array<VideoTemplate | []>; count: Number }>;
  getJobs: (
    id: Number,
    page: Number,
    size: Number,
    query: String
  ) => Promise<{ data: Array<Job | []>; count: Number }>;
}
export interface JobInterface {
  getAll: (
    page: Number,
    size: Number,
    query: String
  ) => Promise<{ data: Array<Job | []>; count: Number }>;
  get: (id: String, populateVideoTemplate: Boolean) => Promise<Job | []>;

  create: (params: JobParam) => Promise<any>;

  update: (id: String, params: JobUpdateParam) => Promise<any>;
  updateMultiple: (data: Array<MultiJobUpdates>) => Promise<any>;
  delete: (id: String) => Promise<any>;
  deleteMultiple: (data: Array<{ id: String }>) => Promise<any>;
}

export default interface APIInterface {
  Job: JobInterface;
  Font: FontInterface;
  Creator: CreatorInterface;
  VideoTemplate: VideoTemplateInterface;
  Search: SearchInterface;
}
