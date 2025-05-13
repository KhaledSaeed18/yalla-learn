"use client"

import { useState } from 'react';
import { useGetUsers, useDeleteUser } from '@/hooks/user/useUsers';
import { User, UserQueryParams } from '@/types/user/user.types';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Trash2, UserCog, Check, X, RefreshCw } from 'lucide-react';
// Create a simple debounce function since lodash isn't available
const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const UsersManagePage = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [queryParams, setQueryParams] = useState<UserQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useGetUsers(queryParams);

    const deleteUser = useDeleteUser();

    const handleSearchChange = debounce((value: string) => {
        setQueryParams(prevParams => ({
            ...prevParams,
            search: value || undefined,
            page: 1
        }));
    }, 500);

    const handleRoleFilterChange = (value: string) => {
        setQueryParams(prevParams => ({
            ...prevParams,
            role: value === 'all' ? undefined : (value as 'USER' | 'ADMIN'),
            page: 1
        }));
    };

    const handleVerificationFilterChange = (value: string) => {
        if (value === 'all') {
            setQueryParams(prevParams => {
                const newParams = { ...prevParams };
                delete newParams.isVerified;
                newParams.page = 1;
                return newParams;
            });
        } else {
            setQueryParams(prevParams => ({
                ...prevParams,
                isVerified: value === 'verified',
                page: 1
            }));
        }
    };

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-');
        setQueryParams(prevParams => ({
            ...prevParams,
            sortBy: sortBy as 'firstName' | 'lastName' | 'email' | 'createdAt' | 'updatedAt',
            sortOrder: sortOrder as 'asc' | 'desc'
        }));
    };

    const handlePageChange = (page: number) => {
        setQueryParams(prevParams => ({
            ...prevParams,
            page
        }));
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const onDeleteConfirm = () => {
        if (!selectedUser) return;

        deleteUser.mutate(selectedUser.id, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getUserInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const renderPagination = () => {
        if (!data?.pagination) return null;

        const { currentPage, totalPages } = data.pagination;
        const pages = [];

        // Previous button
        pages.push(
            <PaginationItem key="prev">
                <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        );

        // Page numbers
        const maxPages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(startPage + maxPages - 1, totalPages);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        // First page if not in range
        if (startPage > 1) {
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (startPage > 2) {
                pages.push(
                    <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Last page if not in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }

            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Next button
        pages.push(
            <PaginationItem key="next">
                <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        );

        return (
            <Pagination>
                <PaginationContent>
                    {pages}
                </PaginationContent>
            </Pagination>
        );
    };

    const TableRowsSkeleton = () => {
        return Array(5).fill(0).map((_, index) => (
            <TableRow key={`skeleton-row-${index}`}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
            </TableRow>
        ));
    };

    if (isError) {
        return (
            <RoleBasedRoute allowedRoles={["ADMIN"]}>
                <div className="container mx-auto p-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Error</CardTitle>
                                <CardDescription>
                                    Failed to load users. Please try again.
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => refetch()}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                    </Card>
                </div>
            </RoleBasedRoute>
        );
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <div className="">
                <Card className='overflow-hidden'>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Users Management</CardTitle>
                            <CardDescription>
                                Manage users, view details, and control access to the platform.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 grid gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-8"
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                            <Select onValueChange={handleRoleFilterChange} defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handleVerificationFilterChange} defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by verification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="unverified">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={handleSortChange} defaultValue="createdAt-desc">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt-desc">Newest Users</SelectItem>
                                    <SelectItem value="createdAt-asc">Oldest Users</SelectItem>
                                    <SelectItem value="firstName-asc">Name (A-Z)</SelectItem>
                                    <SelectItem value="firstName-desc">Name (Z-A)</SelectItem>
                                    <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                                    <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Verification</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRowsSkeleton />
                                    ) : data && data.users.length > 0 ? (
                                        data.users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={user.avatar || undefined} />
                                                            <AvatarFallback>{getUserInitials(user.firstName, user.lastName)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {user.location || "No location"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={user.role === 'ADMIN' ? 'destructive' : 'default'}
                                                        className="text-xs font-normal"
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {user.isVerified ? (
                                                            <>
                                                                <Badge variant="default" className="text-xs font-normal text-green-600 bg-green-100">
                                                                    <Check className="mr-1 h-3 w-3" />
                                                                    Verified
                                                                </Badge>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Badge variant="secondary" className="text-xs font-normal">
                                                                    <X className="mr-1 h-3 w-3" />
                                                                    Unverified
                                                                </Badge>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatDate(user.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(user)}
                                                        disabled={user.role === 'ADMIN'}
                                                        title={user.role === 'ADMIN' ? "Cannot delete admin users" : "Delete user"}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex items-center justify-end space-x-4">
                            {data?.pagination && (
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{data.users.length}</span> of{" "}
                                    <span className="font-medium">{data.pagination.total}</span> users
                                </div>
                            )}
                            {renderPagination()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onDeleteConfirm}
                            disabled={deleteUser.isPending}
                        >
                            {deleteUser.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </RoleBasedRoute>
    );
};

export default UsersManagePage;