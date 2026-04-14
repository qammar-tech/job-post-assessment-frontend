import { ScheduleType } from '@/types/jobPost';

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
