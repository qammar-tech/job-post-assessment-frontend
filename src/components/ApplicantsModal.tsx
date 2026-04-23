import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApplicationsByJobPost,
  createApplication,
  updateApplicationStatus,
} from "@/api/applications";
import { type Application, ApplicationStatus } from "@/types/application";
import { type JobPost, JobPostStatus } from "@/types/jobPost";
import { formatDate } from "@/lib/jobPost.utils";

interface ApplicantsModalProps {
  jobPost: JobPost | null;
  onClose: () => void;
}

interface ApplyFormState {
  name: string;
  specialty: string;
  currentLocation: string;
  availabilityDate: string;
}

const EMPTY_FORM: ApplyFormState = {
  name: "",
  specialty: "",
  currentLocation: "",
  availabilityDate: "",
};

const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: "Applied",
  [ApplicationStatus.SHORTLISTED]: "Shortlisted",
  [ApplicationStatus.REJECTED]: "Rejected",
};

const APPLICATION_STATUS_BADGE_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [ApplicationStatus.APPLIED]: "secondary",
  [ApplicationStatus.SHORTLISTED]: "default",
  [ApplicationStatus.REJECTED]: "destructive",
};

export function ApplicantsModal({
  jobPost,
  onClose,
}: ApplicantsModalProps): React.ReactElement {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ApplyFormState>(EMPTY_FORM);

  const isOpen = jobPost !== null;

  async function fetchApplications(jobPostId: string): Promise<void> {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getApplicationsByJobPost(jobPostId);
      setApplications(response.data);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : "Failed to load applicants.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    applicationId: string,
    newStatus: ApplicationStatus,
  ): Promise<void> {
    setStatusError(null);
    try {
      await updateApplicationStatus(applicationId, { status: newStatus });
      if (jobPost) await fetchApplications(jobPost.id);
    } catch (error) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Failed to update applicant status.",
      );
    }
  }

  async function handleApplySubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!jobPost) return;
    setIsSubmitting(true);
    setApplyError(null);
    try {
      await createApplication(jobPost.id, form);
      setForm(EMPTY_FORM);
      await fetchApplications(jobPost.id);
    } catch (error) {
      setApplyError(
        error instanceof Error
          ? error.message
          : "Failed to submit application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFormChange(field: keyof ApplyFormState, value: string): void {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleClose(): void {
    setApplications([]);
    setFetchError(null);
    setStatusError(null);
    setApplyError(null);
    setForm(EMPTY_FORM);
    onClose();
  }

  useEffect(() => {
    if (jobPost) {
      fetchApplications(jobPost.id);
    }
  }, [jobPost]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[92vh] overflow-y-auto">
        {jobPost && (
          <>
            <DialogHeader className="pb-4 border-b border-border/60">
              <DialogTitle className="text-xl font-bold leading-snug pr-8">
                Applicants — {jobPost.jobTitle}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {applications.length} applicant
                {applications.length !== 1 ? "s" : ""}
              </p>
            </DialogHeader>

            {fetchError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {fetchError}
              </div>
            )}
            {statusError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {statusError}
              </div>
            )}

            {isLoading ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Loading applicants…
              </p>
            ) : applications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No applicants yet.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map((application) => (
                  <ApplicantRow
                    key={application.id}
                    application={application}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}

            {jobPost.status === JobPostStatus.OPEN && (
              <ApplyForm
                form={form}
                isSubmitting={isSubmitting}
                applyError={applyError}
                onFieldChange={handleFormChange}
                onSubmit={handleApplySubmit}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ApplicantRowProps {
  application: Application;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
}

function ApplicantRow({
  application,
  onStatusChange,
}: ApplicantRowProps): React.ReactElement {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border/60 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-semibold text-sm text-foreground truncate">
          {application.name}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Specialty:</span>{" "}
          {application.specialty}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Location:</span>{" "}
          {application.currentLocation}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Available:</span>{" "}
          {formatDate(application.availabilityDate)}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={APPLICATION_STATUS_BADGE_VARIANT[application.status]}>
          {APPLICATION_STATUS_LABEL[application.status]}
        </Badge>
        <Select
          value={application.status}
          onValueChange={(value) =>
            onStatusChange(application.id, value as ApplicationStatus)
          }
        >
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ApplicationStatus).map((status) => (
              <SelectItem key={status} value={status} className="text-xs">
                {APPLICATION_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface ApplyFormProps {
  form: ApplyFormState;
  isSubmitting: boolean;
  applyError: string | null;
  onFieldChange: (field: keyof ApplyFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function ApplyForm({
  form,
  isSubmitting,
  applyError,
  onFieldChange,
  onSubmit,
}: ApplyFormProps): React.ReactElement {
  return (
    <div className="pt-4 border-t border-border/60">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Submit an Application
      </h3>
      {applyError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800 mb-3">
          {applyError}
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="applicant-name">Full Name</Label>
          <Input
            id="applicant-name"
            value={form.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="Dr. Jane Smith"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="applicant-specialty">Specialty</Label>
          <Input
            id="applicant-specialty"
            value={form.specialty}
            onChange={(e) => onFieldChange("specialty", e.target.value)}
            placeholder="Cardiology"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="applicant-location">Current Location</Label>
          <Input
            id="applicant-location"
            value={form.currentLocation}
            onChange={(e) => onFieldChange("currentLocation", e.target.value)}
            placeholder="New York, NY"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="applicant-availability">Availability Date</Label>
          <Input
            id="applicant-availability"
            type="date"
            value={form.availabilityDate}
            onChange={(e) => onFieldChange("availabilityDate", e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Apply"}
          </Button>
        </div>
      </form>
    </div>
  );
}
