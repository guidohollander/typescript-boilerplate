export interface JiraGetReponse {
  data: any;
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: Fields;
}

export interface Fields {
  issuetype: Issuetype;
  timespent: null;
  project: Project;
  fixVersions: any[];
  aggregatetimespent: null;
  resolution: null;
  customfield13105: null;
  customfield10500: null;
  customfield12800: string;
  customfield10501: null;
  resolutiondate: null;
  workratio: number;
  lastViewed: string;
  watches: Watches;
  created: string;
  priority: Priority;
  customfield12400: null;
  labels: string[];
  timeestimate: null;
  aggregatetimeoriginalestimate: null;
  versions: Version[];
  issuelinks: any[];
  assignee: Assignee;
  updated: string;
  status: Status;
  components: any[];
  timeoriginalestimate: null;
  description: string;
  customfield13201: null;
  customfield13200: null;
  customfield13400: null;
  customfield10006: string;
  customfield12502: null;
  security: Priority;
  customfield10007: string[];
  customfield10008: string;
  customfield12900: null;
  attachment: Attachment[];
  aggregatetimeestimate: null;
  summary: string;
  creator: Assignee;
  subtasks: any[];
  customfield14201: null;
  customfield14202: null;
  reporter: Assignee;
  customfield13112: null;
  customfield14200: null;
  aggregateprogress: Progress;
  customfield12301: any[];
  customfield10200: null;
  customfield10002: null;
  customfield12300: null;
  customfield12303: null;
  customfield12501: null;
  customfield10004: null;
  customfield12302: null;
  customfield13108: null;
  customfield11800: string;
  duedate: null;
  progress: Progress;
  comment: WorklogClass;
  votes: Votes;
  worklog: WorklogClass;
}

export interface Progress {
  progress: number;
  total: number;
}

export interface Assignee {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export interface AvatarUrls {
  the48X48: string;
  the24X24: string;
  the16X16: string;
  the32X32: string;
}

export interface Attachment {
  self: string;
  id: string;
  filename: string;
  author: Assignee;
  created: string;
  size: number;
  mimeType: string;
  content: string;
  thumbnail: string;
}

export interface WorklogClass {
  comments?: CommentElement[];
  maxResults: number;
  total: number;
  startAt: number;
  worklogs?: any[];
}

export interface CommentElement {
  self: string;
  id: string;
  author: Assignee;
  body: string;
  updateAuthor: Assignee;
  created: string;
  updated: string;
}

export interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconURL: string;
  name: string;
  subtask: boolean;
  avatarID: number;
}

export interface Priority {
  self: string;
  iconURL?: string;
  name: string;
  id: string;
  description?: string;
}

export interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: AvatarUrls;
  projectCategory: Priority;
}

export interface Status {
  self: string;
  description: string;
  iconURL: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

export interface Version {
  self: string;
  id: string;
  description: string;
  name: string;
  archived: boolean;
  released: boolean;
}

export interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

export interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}
