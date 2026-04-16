import { type JobPost, JobPostStatus, ScheduleType } from '@/types/jobPost';

export const SCHEDULE_TYPE_LABEL: Record<ScheduleType, string> = {
  [ScheduleType.FULL_TIME]: 'Full Time',
  [ScheduleType.PART_TIME]: 'Part Time',
  [ScheduleType.CONTRACT]: 'Contract',
  [ScheduleType.PER_DIEM]: 'Per Diem',
};

export const SCHEDULE_TYPE_BADGE_VARIANT: Record<
  ScheduleType,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  [ScheduleType.FULL_TIME]: 'default',
  [ScheduleType.PART_TIME]: 'secondary',
  [ScheduleType.CONTRACT]: 'outline',
  [ScheduleType.PER_DIEM]: 'destructive',
};

export function formatDate(isoDateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoDateString));
}

export const STATUS_BADGE_VARIANT: Record<
  JobPostStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  [JobPostStatus.DRAFT]: 'secondary',
  [JobPostStatus.OPEN]: 'default',
  [JobPostStatus.CLOSED]: 'destructive',
};

export const STATUS_LABEL: Record<JobPostStatus, string> = {
  [JobPostStatus.DRAFT]: 'Draft',
  [JobPostStatus.OPEN]: 'Open',
  [JobPostStatus.CLOSED]: 'Closed',
};

export function isOpenOptionDisabled(jobPost: JobPost): boolean {
  return (
    !jobPost.jobTitle?.trim() ||
    !jobPost.specialty?.trim() ||
    !jobPost.location?.trim()
  );
}
