"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ExpenseSummaryPeriod } from "@/types/expense-tracker/analytics.types";

interface DateRangePickerProps {
    period: ExpenseSummaryPeriod;
    startDate?: Date;
    endDate?: Date;
    onPeriodChange: (period: ExpenseSummaryPeriod) => void;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    period,
    startDate,
    endDate,
    onPeriodChange,
    onStartDateChange,
    onEndDateChange,
}) => {
    const isCustomPeriod = period === "custom";

    const handlePeriodChange = (value: string) => {
        const newPeriod = value as ExpenseSummaryPeriod;
        onPeriodChange(newPeriod);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div>
                <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isCustomPeriod && (
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date-from"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={onStartDateChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date-to"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={onEndDateChange}
                                    initialFocus
                                    disabled={(date) => (startDate ? date < startDate : false)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}
        </div>
    );
};

interface SemesterFilterProps {
    semesters: Array<{ id: string; name: string }>;
    selectedSemesterId?: string;
    onSelect: (semesterId: string | undefined) => void;
}

export const SemesterFilter: React.FC<SemesterFilterProps> = ({
    semesters,
    selectedSemesterId,
    onSelect,
}) => {
    const handleChange = (value: string) => {
        onSelect(value === "all" ? undefined : value);
    };

    return (
        <div>
            <Select value={selectedSemesterId || "all"} onValueChange={handleChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                            {semester.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

interface GroupByFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export const GroupByFilter: React.FC<GroupByFilterProps> = ({
    value,
    onChange,
}) => {
    return (
        <div>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
