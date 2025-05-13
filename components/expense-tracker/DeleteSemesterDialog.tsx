import React from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteSemesterDialogProps {
    isOpen: boolean;
    isDeleting: boolean;
    semesterName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteSemesterDialog = ({
    isOpen,
    isDeleting,
    semesterName,
    onClose,
    onConfirm,
}: DeleteSemesterDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Semester</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the semester &quot;{semesterName}&quot;? This action cannot be
                        undone and will remove all associated data including expenses, budgets, and payment schedules.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
