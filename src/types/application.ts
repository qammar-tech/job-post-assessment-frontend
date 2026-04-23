export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
}

export interface Application {
  readonly id: string;
  name: string;
  specialty: string;
  currentLocation: string;
  availabilityDate: string;
  status: ApplicationStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateApplicationPayload {
  name: string;
  specialty: string;
  currentLocation: string;
  availabilityDate: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
}
