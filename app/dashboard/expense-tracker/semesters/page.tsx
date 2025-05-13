"use client"

import { useState } from "react"
import { useGetSemesters, useGetActiveSemester } from "@/hooks/expense-tracker/useSemesters"
import { useCreateSemester, useUpdateSemester, useDeleteSemester } from "@/hooks/expense-tracker/useSemesters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { toast } from "sonner"
import { format } from "date-fns"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Calendar, Plus, CheckCircle, MoreVertical, Trash2, Edit, AlertCircle } from "lucide-react"
import { Term } from "@/types/expense-tracker/expenseTracker.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

// Semester form validation schema
const semesterSchema = z.object({
    name: z.string().min(1, "Semester name is required").max(50, "Semester name cannot exceed 50 characters"),
    term: z.enum(["FALL", "SPRING", "SUMMER"] as const),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    isActive: z.boolean().default(false),
    year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
    description: z.string().max(255, "Description cannot exceed 255 characters").optional().nullable(),
}).refine(data => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});

type SemesterFormValues = z.infer<typeof semesterSchema>

const TERM_OPTIONS: { value: Term, label: string }[] = [
    { value: 'FALL', label: 'Fall Semester' },
    { value: 'SPRING', label: 'Spring Semester' },
    { value: 'SUMMER', label: 'Summer Semester' }
]

export default function SemestersPage() {
    const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null)

    const { data: semesters, isLoading } = useGetSemesters()
    const { data: activeSemester, isLoading: isActiveLoading } = useGetActiveSemester()

    const { mutate: createSemester, isPending: isCreating } = useCreateSemester()
    const { mutate: updateSemester, isPending: isUpdating } = useUpdateSemester()
    const { mutate: deleteSemester, isPending: isDeleting } = useDeleteSemester()

    const form = useForm<SemesterFormValues>({
        resolver: zodResolver(semesterSchema),
        defaultValues: {
            name: "",
            term: "FALL",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
            isActive: false,
            year: new Date().getFullYear().toString(),
            description: ""
        }
    })

    const openCreateForm = () => {
        form.reset({
            name: "",
            term: "FALL",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString().split('T')[0],
            isActive: false,
            year: new Date().getFullYear().toString(),
            description: ""
        })
        setEditingSemesterId(null)
        setIsFormOpen(true)
    }

    const openEditForm = (semester: any) => {
        form.reset({
            name: semester.name,
            term: semester.term,
            startDate: new Date(semester.startDate).toISOString().split('T')[0],
            endDate: new Date(semester.endDate).toISOString().split('T')[0],
            isActive: semester.isActive,
            year: semester.year.toString(),
            description: semester.description || ""
        })
        setEditingSemesterId(semester.id)
        setIsFormOpen(true)
    }

    const openDeleteDialog = (id: string) => {
        setSemesterToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteSemester = () => {
        if (semesterToDelete) {
            deleteSemester(semesterToDelete, {
                onSuccess: () => {
                    toast.success("Semester deleted successfully")
                    setIsDeleteDialogOpen(false)
                    setSemesterToDelete(null)
                },
                onError: () => {
                    toast.error("Failed to delete semester")
                }
            })
        }
    }

    const onSubmit = (values: SemesterFormValues) => {
        if (editingSemesterId) {
            updateSemester(
                { id: editingSemesterId, semesterData: values },
                {
                    onSuccess: () => {
                        toast.success("Semester updated successfully")
                        setIsFormOpen(false)
                        form.reset()
                    },
                    onError: () => {
                        toast.error("Failed to update semester")
                    }
                }
            )
        } else {
            createSemester(values, {
                onSuccess: () => {
                    toast.success("Semester created successfully")
                    setIsFormOpen(false)
                    form.reset()
                },
                onError: () => {
                    toast.error("Failed to create semester")
                }
            })
        }
    }

    if (isLoading || isActiveLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Semesters</h1>
                    <p className="text-muted-foreground">
                        Manage your academic semesters for expense tracking
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Semester
                </Button>
            </div>

            {!activeSemester && (
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-amber-700 dark:text-amber-400">No Active Semester</h3>
                                <p className="text-sm text-amber-600 dark:text-amber-500">
                                    Set a semester as active to associate your expenses with the current academic period.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Your Semesters</CardTitle>
                    <CardDescription>
                        Create and manage semesters to organize your expenses by academic periods
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {semesters?.data?.semesters?.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Term</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {semesters.data.semesters.map((semester) => (
                                    <TableRow key={semester.id}>
                                        <TableCell className="font-medium">{semester.name}</TableCell>
                                        <TableCell>{semester.term}</TableCell>
                                        <TableCell>
                                            {format(new Date(semester.startDate), "MMM d, yyyy")} - {format(new Date(semester.endDate), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>{semester.year}</TableCell>
                                        <TableCell>
                                            {semester.isActive ? (
                                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditForm(semester)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => openDeleteDialog(semester.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No semesters found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You haven't created any semesters yet.
                            </p>
                            <Button onClick={openCreateForm}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add your first semester
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Semester Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingSemesterId ? "Edit Semester" : "Add New Semester"}</DialogTitle>
                        <DialogDescription>
                            {editingSemesterId
                                ? "Update the details of your semester."
                                : "Create a new semester to organize your academic expenses."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semester Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Spring 2025, Fall 2024, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="term"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Term</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select term" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {TERM_OPTIONS.map(term => (
                                                        <SelectItem key={term.value} value={term.value}>
                                                            {term.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="YYYY"
                                                    min="2000"
                                                    max="2100"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active Semester</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Set this as your active semester for expense tracking
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Any additional details about this semester"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                >
                                    {isCreating || isUpdating ? (
                                        <>Saving...</>
                                    ) : (
                                        <>{editingSemesterId ? "Update" : "Create"} Semester</>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Semester</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this semester? This action cannot be undone.
                            Any expenses associated with this semester will remain but will no longer be linked to a semester.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSemester}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
