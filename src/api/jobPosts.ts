import axios from 'axios';
import type {
  ApiResponse,
  CreateJobPostPayload,
  JobPost,
  UpdateJobPostStatusPayload,
} from '@/types/jobPost';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseErrors = error.response?.data?.errors as string[] | undefined;
    if (responseErrors?.length) return responseErrors.join(', ');
    const responseMessage = error.response?.data?.message as string | undefined;
    if (responseMessage) return responseMessage;
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

export async function createJobPost(
  payload: CreateJobPostPayload,
): Promise<ApiResponse<JobPost>> {
  try {
    const response = await apiClient.post<ApiResponse<JobPost>>(
      '/job-posts',
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getJobPosts(): Promise<ApiResponse<JobPost[]>> {
  try {
    const response = await apiClient.get<ApiResponse<JobPost[]>>('/job-posts');
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateJobPostStatus(
  id: string,
  payload: UpdateJobPostStatusPayload,
): Promise<ApiResponse<JobPost>> {
  try {
    const response = await apiClient.patch<ApiResponse<JobPost>>(
      `/job-posts/${id}/status`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
