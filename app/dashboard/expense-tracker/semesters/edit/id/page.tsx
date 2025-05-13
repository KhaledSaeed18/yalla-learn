"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useGetSemester, 
  useUpdateSemester
} from '@/hooks/expense-tracker/useSemesters';
import { UpdateSemesterRequest } from '@/types/expense-tracker/expenseTracker.types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SemesterForm, semesterFormSchema } from '@/components/expense-tracker/SemesterForm';
import * as z from 'zod';

interface EditSemesterPageProps {
  params: {
    id: string;
  };
}

const EditSemesterPage = ({ params }: EditSemesterPageProps) => {
  const router = useRouter();
  const semesterId = params.id;
  const { data: semester, isLoading } = useGetSemester(semesterId);
  const { mutate: updateSemester, isPending: isUpdating } = useUpdateSemester();

  const handleSubmit = (values: z.infer<typeof semesterFormSchema>) => {
    if (!semester) return;

    const updateData: UpdateSemesterRequest = {
      name: values.name,
      term: values.term,
      year: values.year,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      isActive: values.isActive,
    };

    updateSemester(
      { id: semesterId, semesterData: updateData },
      {
        onSuccess: () => {
          router.push(`/dashboard/expense-tracker/semesters/${semesterId}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
          <h2 className="text-2xl font-bold">Semester Not Found</h2>
          <p className="text-muted-foreground">
            The semester you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/dashboard/expense-tracker/semesters')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Semesters
          </Button>
        </div>
      </div>
    );
  }

  const defaultValues = {
    name: semester.name,
    term: semester.term,
    year: semester.year,
    startDate: new Date(semester.startDate),
    endDate: new Date(semester.endDate),
    isActive: semester.isActive,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push(`/dashboard/expense-tracker/semesters/${semesterId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Semester</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <SemesterForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          submitButtonText="Update Semester"
          cancelButtonText="Cancel"
          onCancel={() => router.push(`/dashboard/expense-tracker/semesters/${semesterId}`)}
          showActiveWarning={semester.isActive}
        />
      </div>
    </div>
  );
};

export default EditSemesterPage;
