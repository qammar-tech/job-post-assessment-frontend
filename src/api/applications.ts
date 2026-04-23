import axios from 'axios';
import type {
  Application,
  CreateApplicationPayload,
  UpdateApplicationStatusPayload,
} from '@/types/application';
import type { ApiResponse } from '@/types/jobPost';

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

export async function createApplication(
  jobPostId: string,
  payload: CreateApplicationPayload,
): Promise<ApiResponse<Application>> {
  try {
    const response = await apiClient.post<ApiResponse<Application>>(
      `/job-posts/${jobPostId}/applications`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getApplicationsByJobPost(
  jobPostId: string,
): Promise<ApiResponse<Application[]>> {
  try {
    const response = await apiClient.get<ApiResponse<Application[]>>(
      `/job-posts/${jobPostId}/applications`,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateApplicationStatus(
  id: string,
  payload: UpdateApplicationStatusPayload,
): Promise<ApiResponse<Application>> {
  try {
    const response = await apiClient.patch<ApiResponse<Application>>(
      `/applications/${id}/status`,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
