import React, { useState } from 'react';
import { format } from 'date-fns';
import { Filter, CalendarIcon, X } from 'lucide-react';
import { ExpenseCategoryType, PaymentMethod, ExpensesQueryParams, Semester } from '@/types/expense-tracker/expenseTracker.types';
import { useGetSemesters } from '@/hooks/expense-tracker/useSemesters';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface ExpenseFiltersProps {
    filters: ExpensesQueryParams;
    onFilterChange: (filters: ExpensesQueryParams) => void;
    onResetFilters: () => void;
}

export const ExpenseFilters = ({
    filters,
    onFilterChange,
    onResetFilters,
}: ExpenseFiltersProps) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<ExpensesQueryParams>(filters);
    const { data: semesters } = useGetSemesters();

    // Get array of category names from the enum
    const categories = Object.keys(ExpenseCategoryType) as Array<keyof typeof ExpenseCategoryType>;
    const paymentMethods: PaymentMethod[] = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'MOBILE_PAYMENT', 'SCHOLARSHIP', 'OTHER'];

    const handleFilterChange = (key: keyof ExpensesQueryParams, value: any) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyFilters = () => {
        onFilterChange(localFilters);
        setIsFiltersOpen(false);
    };

    const resetFilters = () => {
        const defaultFilters: ExpensesQueryParams = {
            page: 1,
            limit: 10,
        };
        setLocalFilters(defaultFilters);
        onResetFilters();
        setIsFiltersOpen(false);
    };

    // Count active filters (excluding pagination)
    const activeFilterCount = Object.entries(filters).filter(([key, value]) =>
        key !== 'page' && key !== 'limit' && value !== undefined && value !== ''
    ).length;

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Filter</span>
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Filter Expenses</SheetTitle>
                        <SheetDescription>
                            Refine your expense list by applying filters
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Term</Label>
                            <Input
                                id="search"
                                placeholder="Search expense descriptions"
                                value={localFilters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Select
                                value={localFilters.semesterId || ''}
                                onValueChange={(value) => handleFilterChange('semesterId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Semesters" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Semesters</SelectItem>
                                    {semesters?.map((semester: Semester) => (
                                        <SelectItem key={semester.id} value={semester.id}>
                                            {semester.name} {semester.isActive && "(Active)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={localFilters.category || ''}
                                onValueChange={(value) => handleFilterChange('category', value as keyof typeof ExpenseCategoryType || undefined)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select
                                value={localFilters.paymentMethod || ''}
                                onValueChange={(value) => handleFilterChange('paymentMethod', value as PaymentMethod || undefined)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Payment Methods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Payment Methods</SelectItem>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method.replace(/_/g, ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${!localFilters.startDate && "text-muted-foreground"
                                                }`}
                                        >
                                            {localFilters.startDate ? (
                                                format(new Date(localFilters.startDate), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
                                            onSelect={(date) => date && handleFilterChange('startDate', date.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {localFilters.startDate && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 p-0 text-muted-foreground"
                                        onClick={() => handleFilterChange('startDate', undefined)}
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${!localFilters.endDate && "text-muted-foreground"
                                                }`}
                                        >
                                            {localFilters.endDate ? (
                                                format(new Date(localFilters.endDate), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
                                            onSelect={(date) => date && handleFilterChange('endDate', date.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {localFilters.endDate && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 p-0 text-muted-foreground"
                                        onClick={() => handleFilterChange('endDate', undefined)}
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Select
                                    value={localFilters.sortBy || 'date'}
                                    onValueChange={(value) => handleFilterChange('sortBy', value as 'amount' | 'date' | 'createdAt')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort Field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Date</SelectItem>
                                        <SelectItem value="amount">Amount</SelectItem>
                                        <SelectItem value="createdAt">Created At</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={localFilters.sortOrder || 'desc'}
                                    onValueChange={(value) => handleFilterChange('sortOrder', value as 'asc' | 'desc')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Descending</SelectItem>
                                        <SelectItem value="asc">Ascending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="flex flex-row gap-3 sm:justify-end">
                        <Button variant="outline" onClick={resetFilters}>
                            Reset
                        </Button>
                        <Button onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Active filter badges */}
            <div className="flex flex-wrap gap-1">
                {filters.category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        Category: {filters.category.replace(/_/g, ' ')}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters.category;
                                onFilterChange(newFilters);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </Badge>
                )}
                {filters.paymentMethod && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        Payment: {filters.paymentMethod.replace(/_/g, ' ')}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters.paymentMethod;
                                onFilterChange(newFilters);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </Badge>
                )}
                {filters.startDate && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        From: {format(new Date(filters.startDate), "MMM d, yyyy")}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters.startDate;
                                onFilterChange(newFilters);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </Badge>
                )}
                {filters.endDate && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        To: {format(new Date(filters.endDate), "MMM d, yyyy")}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters.endDate;
                                onFilterChange(newFilters);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </Badge>
                )}
                {filters.search && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {filters.search}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters.search;
                                onFilterChange(newFilters);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </Badge>
                )}
                {filters.semesterId && semesters && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        Semester: {semesters.find(s => s.id === filters.semesterId)?.name || 'Selected'}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => {
                                const newFilters = { ...filters };
                                delete newFilters.semesterId;
                                onFilterChange(newFilters);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                        </Button>
                    </Badge>
                )}
                {activeFilterCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={onResetFilters}
                    >
                        Clear All
                    </Button>
                )}
            </div>
        </div>
    );
};
