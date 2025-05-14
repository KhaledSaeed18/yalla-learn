"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export type Option = {
    label: string
    value: string
}

type MultiSelectProps = {
    options: Option[]
    selected: string[]
    onChange: (values: string[]) => void
    className?: string
    placeholder?: string
    disabled?: boolean
}

export function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = "Select options...",
    disabled = false,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedItems, setSelectedItems] = React.useState<string[]>(selected || [])

    // Update local state when selected props change
    React.useEffect(() => {
        setSelectedItems(selected || []);
    }, [selected]);

    const handleUnselect = (value: string) => {
        const newSelected = selectedItems.filter((item) => item !== value);
        setSelectedItems(newSelected);
        onChange(newSelected);
    }

    const handleSelect = (value: string) => {
        const newSelected = [...selectedItems, value];
        setSelectedItems(newSelected);
        onChange(newSelected);
    }

    return (
        <div className={cn("relative", className)}>
            <div
                className={cn(
                    "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative flex min-h-9 w-full items-center gap-1 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                    disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => !disabled && setOpen(true)}
            >
                <div className="flex flex-wrap gap-1">
                    {selectedItems.length === 0 && (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    {selectedItems.map((value) => {
                        const option = options.find((opt) => opt.value === value)
                        return (
                            <Badge
                                key={value}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {option?.label}
                                <button
                                    type="button"
                                    className="focus:bg-accent focus:text-accent-foreground -mr-0.5 ml-1 rounded-full outline-none hover:bg-slate-200 dark:hover:bg-slate-700"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleUnselect(value)
                                    }}
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            </div>
            {open && !disabled && (
                <>
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md outline-none animate-in slide-in-from-top-1">
                        <Command className="w-full">
                            <div className="max-h-64 overflow-auto p-1">
                                {options.length === 0 && (
                                    <p className="text-muted-foreground text-center p-2 text-sm">No options available</p>
                                )}
                                <CommandGroup>
                                    {options.map((option) => {
                                        const isSelected = selectedItems.includes(option.value)
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                onSelect={() => {
                                                    if (isSelected) {
                                                        handleUnselect(option.value)
                                                    } else {
                                                        handleSelect(option.value)
                                                    }
                                                    setOpen(false)
                                                }}
                                                className={cn(
                                                    "flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm",
                                                    isSelected && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded border",
                                                        isSelected && "bg-primary text-primary-foreground"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <span className="h-2 w-2 rounded-sm bg-current" />
                                                    )}
                                                </div>
                                                <span>{option.label}</span>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </div>
                        </Command>
                    </div>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                </>
            )}
        </div>
    )
}
