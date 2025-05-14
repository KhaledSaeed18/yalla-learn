"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetQuestions, useAdminDeleteQuestion } from "@/hooks/qa/useQa";
import { useGetQaTags } from "@/hooks/qa/useQaTags";
import { QaQuestionsQueryParams, QuestionStatus, QaQuestion } from "@/types/qa/qa.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, FilterIcon, X, MessageSquare, Tag, AlertCircle, CheckCircle, User } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import RoleBasedRoute from "@/components/RoleBasedRoute";

export default function AllQuestionsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(() => {
        const page = searchParams.get("page");
        return page ? parseInt(page) : 1;
    });
    const questionsPerPage = 9;

    // Filter states
    const [filterParams, setFilterParams] = useState<QaQuestionsQueryParams>({
        page: currentPage,
        limit: questionsPerPage,
    });
    const [filterStatus, setFilterStatus] = useState<QuestionStatus | "all">(() => {
        const status = searchParams.get("status");
        return status as QuestionStatus || "all";
    });
    const [selectedTagId, setSelectedTagId] = useState(() =>
        searchParams.get("tagId") || "all"
    );
    const [searchQuery, setSearchQuery] = useState(() =>
        searchParams.get("search") || ""
    );
    const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title">(() => {
        const sort = searchParams.get("sortBy");
        return (sort as any) || "createdAt";
    });
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() =>
        (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    );
    const [showFilters, setShowFilters] = useState(false);

    const { data: tags, isLoading: tagsLoading } = useGetQaTags();

    useEffect(() => {
        const updatedParams: QaQuestionsQueryParams = {
            page: currentPage,
            limit: questionsPerPage,
        };

        if (filterStatus && filterStatus !== "all") updatedParams.status = filterStatus as QuestionStatus;
        if (selectedTagId && selectedTagId !== "all") updatedParams.tagId = selectedTagId;
        if (searchQuery) updatedParams.search = searchQuery;
        updatedParams.sortBy = sortBy;
        updatedParams.sortOrder = sortOrder;

        setFilterParams(updatedParams);
    }, [currentPage, questionsPerPage, filterStatus, selectedTagId, searchQuery, sortBy, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, selectedTagId, searchQuery, sortBy, sortOrder]);

    const { data: questionData, isLoading, isError, error } = useGetQuestions(filterParams);

    const deleteQuestion = useAdminDeleteQuestion();

    const updateUrlWithFilters = () => {
        const params = new URLSearchParams();

        if (currentPage > 1) params.set("page", currentPage.toString());
        if (filterStatus && filterStatus !== "all") params.set("status", filterStatus);
        if (selectedTagId && selectedTagId !== "all") params.set("tagId", selectedTagId);
        if (searchQuery) params.set("search", searchQuery);
        if (sortBy !== "createdAt") params.set("sortBy", sortBy);
        if (sortOrder !== "desc") params.set("sortOrder", sortOrder);

        const queryString = params.toString();
        const url = `/dashboard/qa/all${queryString ? `?${queryString}` : ""}`;
        router.push(url, { scroll: false });
    };

    useEffect(() => {
        updateUrlWithFilters();
    }, [currentPage, filterStatus, selectedTagId, searchQuery, sortBy, sortOrder]);

    const clearFilters = () => {
        setFilterStatus("all");
        setSelectedTagId("all");
        setSearchQuery("");
        setSortBy("createdAt");
        setSortOrder("desc");
        setCurrentPage(1);
    };

    const handleDeleteClick = (questionId: string) => {
        setQuestionToDelete(questionId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (questionToDelete) {
            deleteQuestion.mutate(questionToDelete, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setQuestionToDelete(null);
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getQuestions = () => {
        if (isLoading || !questionData) {
            return <QuestionsCardsSkeleton />;
        }

        if (questionData.questions.length === 0) {
            return (
                <div className="col-span-3 p-8 text-center">
                    <h3 className="font-medium text-lg mb-2">No questions found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                </div>
            );
        }

        return questionData.questions.map((question) => (
            <Card key={question.id} className="flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">
                            <Link
                                href={`/dashboard/qa/question/${question.slug}`}
                                className="hover:underline line-clamp-2"
                            >
                                {question.title}
                            </Link>
                        </CardTitle>
                        <Badge variant={question.status === "OPEN" ? "default" : "secondary"}>
                            {question.status === "OPEN" ? (
                                <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                                <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {question.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                    <div className="line-clamp-3 mb-4 text-sm text-muted-foreground">
                        {question.content.replace(/<[^>]*>?/gm, '')}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {question.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline" className="flex items-center">
                                <Tag className="mr-1 h-3 w-3" />
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between border-t px-6 py-3 mt-auto flex-1">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <User className="mr-1 h-4 w-4" />
                            {question.user.firstName} {question.user.lastName}
                        </div>
                        <div className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {question.answerCount || 0} {question.answerCount === 1 ? 'answer' : 'answers'}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(question.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        ));
    };

    function Pagination() {
        if (!questionData || questionData.pagination.totalPages <= 1) return null;

        const { totalPages, currentPage: activePage } = questionData.pagination;

        return (
            <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={activePage <= 1}
                >
                    Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                        key={page}
                        variant={page === activePage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={activePage >= totalPages}
                >
                    Next
                </Button>
            </div>
        );
    }

    const FilterUI = () => (
        <div className={`space-y-4 mb-6 ${showFilters ? 'block' : 'hidden'} bg-muted/50 p-4 rounded-lg border`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" /> Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="flex">
                        <Input
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={filterStatus}
                        onValueChange={(value: QuestionStatus | "all") => setFilterStatus(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Tag</label>
                    <Select
                        value={selectedTagId}
                        onValueChange={setSelectedTagId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Tags" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {tags?.map(tag => (
                                <SelectItem key={tag.id} value={tag.id}>
                                    {tag.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                        value={sortBy}
                        onValueChange={(value: "createdAt" | "updatedAt" | "title") => setSortBy(value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt">Date Created</SelectItem>
                            <SelectItem value="updatedAt">Last Updated</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Sort Order</label>
                    <Select
                        value={sortOrder}
                        onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Descending</SelectItem>
                            <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    const QuestionsCardsSkeleton = () => {
        return (
            <>
                {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-6 w-4/5" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-4 flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <div className="flex gap-2 mt-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-between border-t px-6 py-3 bg-muted/50 mt-auto">
                            <Skeleton className="h-4 w-24" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </>
        );
    };

    const ActiveFiltersDisplay = () => {
        if (
            filterStatus === "all" && 
            selectedTagId === "all" && 
            !searchQuery && 
            sortBy === "createdAt" && 
            sortOrder === "desc"
        ) {
            return null;
        }

        const activeTag = tags?.find(tag => tag.id === selectedTagId)?.name;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="text-sm text-muted-foreground mr-2">Active filters:</div>

                {searchQuery && (
                    <Badge variant="secondary" className="flex items-center">
                        Search: {searchQuery}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => setSearchQuery("")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}

                {filterStatus !== "all" && (
                    <Badge variant="secondary" className="flex items-center">
                        Status: {filterStatus}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => setFilterStatus("all")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}

                {activeTag && selectedTagId !== "all" && (
                    <Badge variant="secondary" className="flex items-center">
                        Tag: {activeTag}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => setSelectedTagId("all")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}

                {(sortBy !== "createdAt" || sortOrder !== "desc") && (
                    <Badge variant="secondary" className="flex items-center">
                        Sorted by: {sortBy === "createdAt" ? "Date Created" : sortBy === "updatedAt" ? "Last Updated" : "Title"} ({sortOrder === "desc" ? "Desc" : "Asc"})
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => {
                                setSortBy("createdAt");
                                setSortOrder("desc");
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                )}
            </div>
        );
    };

    if (isError) {
        return (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {(error as any)?.message || 'Failed to load questions. Please try again.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
            <div className="container px-0 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">All Q&A Questions</h1>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FilterIcon className="mr-2 h-4 w-4" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>
                </div>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Question</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this question? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={deleteQuestion.isPending}>
                                {deleteQuestion.isPending ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <FilterUI />

                <ActiveFiltersDisplay />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getQuestions()}
                </div>

                <Pagination />
            </div>
        </RoleBasedRoute>
    );
}
