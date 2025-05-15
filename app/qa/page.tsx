"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetQuestions } from "@/hooks/qa/useQa";
import { useGetQaTags } from "@/hooks/qa/useQaTags";
import { QaQuestionsQueryParams, QuestionStatus } from "@/types/qa/qa.types";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SearchIcon, FilterIcon, ChevronDownIcon, MessageSquareIcon, CalendarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function QaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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
    const [filterStatus, setFilterStatus] = useState<QuestionStatus | "all">(() =>
        (searchParams.get("status") as QuestionStatus | "all") || "all"
    );
    const [selectedTagId, setSelectedTagId] = useState(() =>
        searchParams.get("tagId") || "all"
    );
    const [searchQuery, setSearchQuery] = useState(() =>
        searchParams.get("search") || ""
    );
    const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title">(() =>
        (searchParams.get("sortBy") as "createdAt" | "updatedAt" | "title") || "createdAt"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() =>
        (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    );
    const [showFilters, setShowFilters] = useState(false);

    const { data: tags, isLoading: tagsLoading } = useGetQaTags();

    useEffect(() => {
        const newParams: QaQuestionsQueryParams = {
            page: currentPage,
            limit: questionsPerPage,
            sortBy,
            sortOrder,
        };

        if (filterStatus !== "all") {
            newParams.status = filterStatus;
        }

        if (selectedTagId !== "all") {
            newParams.tagId = selectedTagId;
        }

        if (searchQuery) {
            newParams.search = searchQuery;
        }

        setFilterParams(newParams);
    }, [currentPage, questionsPerPage, filterStatus, selectedTagId, searchQuery, sortBy, sortOrder]);

    useEffect(() => {
        // Reset to page 1 when filters change
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [filterStatus, selectedTagId, searchQuery, sortBy, sortOrder]);

    const { data: questionData, isLoading, isError, error } = useGetQuestions(filterParams);

    const updateUrlWithFilters = () => {
        const params = new URLSearchParams();

        if (currentPage > 1) {
            params.set("page", currentPage.toString());
        }

        if (filterStatus !== "all") {
            params.set("status", filterStatus);
        }

        if (selectedTagId !== "all") {
            params.set("tagId", selectedTagId);
        }

        if (searchQuery) {
            params.set("search", searchQuery);
        }

        if (sortBy !== "createdAt") {
            params.set("sortBy", sortBy);
        }

        if (sortOrder !== "desc") {
            params.set("sortOrder", sortOrder);
        }

        const query = params.toString();
        const url = query ? `/qa?${query}` : "/qa";

        router.push(url, { scroll: false });
    };

    useEffect(() => {
        updateUrlWithFilters();
    }, [currentPage, filterStatus, selectedTagId, searchQuery, sortBy, sortOrder]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Community Q&A</h1>
                    <p className="text-muted-foreground">Browse questions or ask your own to get help from the community</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <FilterIcon className="h-4 w-4" />
                        Filters
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </Button>
                    {isAuthenticated ? (
                        <Button asChild>
                            <Link href="/dashboard/qa/ask">Ask a Question</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/auth/signin?redirect=/dashboard/qa/ask">Sign in to Ask</Link>
                        </Button>
                    )}
                </div>
            </div>

            {showFilters && (
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search questions..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={filterStatus}
                                    onValueChange={(value) => setFilterStatus(value as QuestionStatus | "all")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Questions</SelectItem>
                                        <SelectItem value="OPEN">Open Questions</SelectItem>
                                        <SelectItem value="CLOSED">Closed Questions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tag</label>
                                <Select
                                    value={selectedTagId}
                                    onValueChange={setSelectedTagId}
                                    disabled={tagsLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tags</SelectItem>
                                        {tags?.map((tag) => (
                                            <SelectItem key={tag.id} value={tag.id}>
                                                {tag.name} ({tag.questionCount || 0})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sort</label>
                                <div className="flex gap-2">
                                    <Select
                                        value={sortBy}
                                        onValueChange={(value) => setSortBy(value as "createdAt" | "updatedAt" | "title")}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="createdAt">Date Created</SelectItem>
                                            <SelectItem value="updatedAt">Date Updated</SelectItem>
                                            <SelectItem value="title">Title</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={sortOrder}
                                        onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Order" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {(error as any)?.message || 'Failed to load questions. Please try again later.'}
                    </AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, index) => (
                        <Card key={index} className="h-[280px]">
                            <CardHeader className="pb-3">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                            <CardFooter>
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    {questionData?.questions.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquareIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No questions found</h3>
                            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                            {isAuthenticated ? (
                                <Button asChild>
                                    <Link href="/dashboard/qa/ask">Ask a Question</Link>
                                </Button>
                            ) : (
                                <Button asChild>
                                    <Link href="/auth/signin?redirect=/dashboard/qa/ask">Sign in to Ask</Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {questionData?.questions.map((question) => (
                                    <Link key={question.id} href={`/qa/${question.slug}`} className="block h-full">
                                        <Card className="h-full transition-all hover:shadow-md">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <CardTitle className="text-lg line-clamp-2">{question.title}</CardTitle>
                                                    <Badge variant={question.status === "OPEN" ? "default" : "secondary"}>
                                                        {question.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {question.tags.map((tag) => (
                                                        <Badge key={tag.id} variant="outline" className="text-xs">
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-3">{question.content}</p>
                                            </CardContent>
                                            <CardFooter>
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={question.user.avatar || undefined} alt={question.user.firstName} />
                                                            <AvatarFallback>
                                                                {getInitials(question.user.firstName, question.user.lastName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">{question.user.firstName} {question.user.lastName}</span>
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground text-sm">
                                                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                                        {formatDate(question.createdAt)}
                                                    </div>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {questionData?.pagination && questionData.pagination.totalPages > 1 && (
                                <Pagination className="mt-8">
                                    <PaginationContent>
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(currentPage - 1);
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}

                                        {Array.from({ length: Math.min(5, questionData.pagination.totalPages) }, (_, i) => {
                                            let pageNum: number;
                                            const totalPages = questionData.pagination?.totalPages || 0;

                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(pageNum);
                                                        }}
                                                        isActive={pageNum === currentPage}
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        {currentPage < questionData.pagination.totalPages && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(currentPage + 1);
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}