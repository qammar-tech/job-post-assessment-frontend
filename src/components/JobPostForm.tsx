import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createJobPost } from '@/api/jobPosts';
import { ScheduleType, type CreateJobPostPayload } from '@/types/jobPost';

interface JobPostFormProps {
  onSuccess: () => void;
}

type FieldErrors = Partial<Record<keyof CreateJobPostPayload, string>>;

const EMPTY_FORM: CreateJobPostPayload = {
  jobTitle: '',
  specialty: '',
  location: '',
};

function validateJobPostForm(data: CreateJobPostPayload): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.jobTitle.trim()) errors.jobTitle = 'Job title is required';
  if (!data.specialty.trim()) errors.specialty = 'Specialty is required';
  if (!data.location.trim()) errors.location = 'Location is required';
  return errors;
}

export function JobPostForm({ onSuccess }: JobPostFormProps): JSX.Element {
  const [formData, setFormData] = useState<CreateJobPostPayload>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  function handleInputChange(
    field: keyof CreateJobPostPayload,
    value: string,
  ): void {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setSuccessMessage(null);
    setApiError(null);

    const errors = validateJobPostForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      await createJobPost(formData);
      setSuccessMessage('Job post created successfully');
      setFormData(EMPTY_FORM);
      onSuccess();
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 font-medium">
          {successMessage}
        </div>
      )}
      {apiError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 font-medium">
          {apiError}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Required Information
        </legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="font-medium">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g. Registered Nurse"
            />
            {fieldErrors.jobTitle && (
              <p className="text-xs text-destructive">{fieldErrors.jobTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty" className="font-medium">
              Specialty <span className="text-destructive">*</span>
            </Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
              placeholder="e.g. Cardiology"
            />
            {fieldErrors.specialty && (
              <p className="text-xs text-destructive">{fieldErrors.specialty}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="font-medium">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g. New York, NY"
            />
            {fieldErrors.location && (
              <p className="text-xs text-destructive">{fieldErrors.location}</p>
            )}
          </div>
        </div>
      </fieldset>

      <div className="border-t border-border/50" />

      <fieldset className="space-y-4">
        <legend className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Optional Details
        </legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="scheduleType" className="font-medium">Schedule Type</Label>
            <Select
              value={formData.scheduleType ?? ''}
              onValueChange={(value) =>
                handleInputChange('scheduleType', value as ScheduleType)
              }
            >
              <SelectTrigger id="scheduleType">
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ScheduleType.FULL_TIME}>Full Time</SelectItem>
                <SelectItem value={ScheduleType.PART_TIME}>Part Time</SelectItem>
                <SelectItem value={ScheduleType.CONTRACT}>Contract</SelectItem>
                <SelectItem value={ScheduleType.PER_DIEM}>Per Diem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="compensation" className="font-medium">Compensation</Label>
            <Input
              id="compensation"
              value={formData.compensation ?? ''}
              onChange={(e) => handleInputChange('compensation', e.target.value)}
              placeholder="e.g. $80,000/yr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="font-medium">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate ?? ''}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">Description</Label>
        <Textarea
          id="description"
          rows={5}
          value={formData.description ?? ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the role, requirements, and responsibilities..."
          className="resize-none"
        />
      </div>

      <div className="flex justify-end pt-2 border-t border-border/50">
        <Button type="submit" disabled={isSubmitting} className="px-8 shadow-sm shadow-primary/20">
          {isSubmitting ? 'Submitting...' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
}
