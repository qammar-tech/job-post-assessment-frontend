export enum ScheduleType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  PER_DIEM = 'PER_DIEM',
}

export enum JobPostStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface JobPost {
  readonly id: string;
  jobTitle: string;
  specialty: string;
  location: string;
  scheduleType?: ScheduleType;
  compensation?: string;
  startDate?: string;
  description?: string;
  status: JobPostStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateJobPostPayload {
  jobTitle: string;
  specialty: string;
  location: string;
  scheduleType?: ScheduleType;
  compensation?: string;
  startDate?: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  errors?: string[];
  message?: string;
}

export interface UpdateJobPostStatusPayload {
  status: JobPostStatus;
}
