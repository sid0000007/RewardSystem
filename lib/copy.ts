import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!", {
        description: "You can now paste it in the scanner",
        duration: 2000,
    });
};