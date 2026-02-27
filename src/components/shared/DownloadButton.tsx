import { useState } from "react";
import { getDownloadUrl } from "../../lib/api";
import { Button } from "../ui/button";
import { FileDown, ImageDown, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DownloadButtonProps {
    blogId: string;
    type: "markdown" | "images" | "bundle";
}

export function DownloadButton({ blogId, type }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const getIcon = () => {
        if (isDownloading) return <Loader2 className="mr-2 h-5 w-5 animate-spin" />;
        switch (type) {
            case "markdown": return <FileDown className="mr-2 h-5 w-5" />;
            case "images": return <ImageDown className="mr-2 h-5 w-5" />;
            case "bundle": return <Package className="mr-2 h-5 w-5" />;
        }
    };

    const getLabel = () => {
        switch (type) {
            case "markdown": return "MD";
            case "images": return "IMG";
            case "bundle": return "ZIP";
        }
    };

    const getColor = () => {
        switch (type) {
            case "markdown": return "bg-primary text-primary-foreground";
            case "images": return "bg-accent text-accent-foreground";
            case "bundle": return "bg-secondary text-secondary-foreground";
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        toast.info(`Starting download for ${getLabel()}...`, { id: `download-${type}` });

        try {
            const url = getDownloadUrl(blogId, type);
            const res = await fetch(url);

            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const filename = res.headers.get("Content-Disposition")?.split('filename="')[1]?.split('"')[0] || `download.${type === "markdown" ? "md" : "zip"}`;

            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);

            toast.success(`${getLabel()} downloaded successfully!`, { id: `download-${type}` });
        } catch (err) {
            console.error(err);
            toast.error(`Failed to download ${getLabel()}`, { id: `download-${type}` });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="default"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`brutal-btn font-bold tracking-widest ${getColor()}`}
        >
            {getIcon()}
            {getLabel()}
        </Button>
    );
}
