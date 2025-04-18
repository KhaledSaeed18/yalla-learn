"use client";

import { useState, useRef } from "react";
import { Loader2, Send, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw, Maximize, Minimize } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Tree, TreeNode } from "react-organizational-chart";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    prompt: z.string().min(5, { message: "Please enter at least 5 characters" }),
});

type MindMapNode = {
    text: string;
    children?: MindMapNode[];
};

type MindMapData = {
    root: MindMapNode;
};

export default function MindMapGenerator() {
    const [isLoading, setIsLoading] = useState(false);
    const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [exportName, setExportName] = useState("mindmap");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const mindMapRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setError(null);
        setMindMapData(null);

        try {
            const response = await fetch("/api/mindmap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: values.prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate mind map");
            }

            if (!data.root) {
                throw new Error("Received invalid mind map data structure");
            }

            setMindMapData(data);
            setExportName(generateExportName(values.prompt));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const generateExportName = (prompt: string) => {
        return prompt
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, "_")
            .substring(0, 30);
    };

    const exportAsJSON = () => {
        if (!mindMapData) return;

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mindMapData, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${exportName}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    // Custom recursive component to render the mind map nodes
    const renderNode = (node: MindMapNode, index: number = 0, level: number = 0) => {
        return (
            <TreeNode
                key={`${node.text}-${index}`}
                label={
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: level * 0.1 }}
                        className="flex items-center justify-center p-3 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow"
                        style={{ width: Math.max(100, node.text.length * 8) }}
                    >
                        <div className="text-center font-medium text-sm">{node.text}</div>
                    </motion.div>
                }
            >
                {node.children?.map((child, childIndex) => renderNode(child, childIndex, level + 1))}
            </TreeNode>
        );
    };

    return (
        <main className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">AI Mind Map Generator</h1>
            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Generate a Mind Map</CardTitle>
                        <CardDescription>
                            Enter a topic or concept and our AI will generate a structured mind map.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Topic or Concept</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter a topic like 'Artificial Intelligence and its applications' or 'The history of space exploration'"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Generate Mind Map
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {error && (
                    <Card className="border-red-300 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="text-red-600">
                                <h3 className="font-semibold mb-2">Error generating mind map</h3>
                                <p>{error}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" onClick={() => form.handleSubmit(onSubmit)()}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {mindMapData && (
                    <Card className={isFullScreen ? "fixed inset-0 z-50 rounded-none" : ""}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Your Mind Map</CardTitle>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        value={exportName}
                                        onChange={(e) => setExportName(e.target.value)}
                                        className="max-w-[200px]"
                                        placeholder="File name"
                                    />
                                    <Button variant="outline" onClick={exportAsJSON}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                    <Button variant="outline" onClick={toggleFullScreen}>
                                        {isFullScreen ? (
                                            <Minimize className="h-4 w-4" />
                                        ) : (
                                            <Maximize className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="visual" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="visual">Visual</TabsTrigger>
                                    <TabsTrigger value="json">JSON</TabsTrigger>
                                </TabsList>
                                <TabsContent value="visual">
                                    <div
                                        ref={mindMapRef}
                                        className="overflow-hidden p-4 border rounded-md bg-muted/30"
                                        style={{
                                            minHeight: isFullScreen ? 'calc(100vh - 200px)' : '500px',
                                            height: isFullScreen ? 'calc(100vh - 200px)' : 'auto'
                                        }}
                                    >
                                        <TransformWrapper
                                            initialScale={1}
                                            minScale={0.3}
                                            maxScale={2.5}
                                            centerOnInit={true}
                                            wheel={{ step: 0.05 }}
                                        >
                                            {({ zoomIn, zoomOut, resetTransform }) => (
                                                <>
                                                    <div className="absolute bottom-4 right-4 z-10 flex gap-2 bg-background/80 p-2 rounded-lg shadow-md backdrop-blur-sm">
                                                        <Button variant="outline" size="icon" onClick={() => zoomIn()}>
                                                            <ZoomIn className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="icon" onClick={() => zoomOut()}>
                                                            <ZoomOut className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="icon" onClick={() => resetTransform()}>
                                                            <RotateCw className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <TransformComponent
                                                        wrapperStyle={{
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                        contentStyle={{
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                    >
                                                        <div className="flex justify-center items-center h-full min-w-full">
                                                            <Tree
                                                                lineWidth="2px"
                                                                lineColor="var(--primary)"
                                                                lineBorderRadius="10px"
                                                                label={
                                                                    <motion.div
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        className="p-4 rounded-xl bg-primary text-primary-foreground shadow-lg"
                                                                    >
                                                                        <div className="font-bold">{mindMapData.root.text}</div>
                                                                    </motion.div>
                                                                }
                                                            >
                                                                {mindMapData.root.children?.map((child, index) =>
                                                                    renderNode(child, index, 1)
                                                                )}
                                                            </Tree>
                                                        </div>
                                                    </TransformComponent>
                                                </>
                                            )}
                                        </TransformWrapper>
                                    </div>
                                </TabsContent>
                                <TabsContent value="json">
                                    <div className="border rounded-md bg-muted/30 p-4 min-h-[400px] overflow-auto">
                                        <pre className="whitespace-pre-wrap text-sm">
                                            {JSON.stringify(mindMapData, null, 2)}
                                        </pre>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
