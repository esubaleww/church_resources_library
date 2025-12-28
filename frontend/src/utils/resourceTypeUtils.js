import {
  FileText,
  Video,
  Headphones,
  Globe,
  BookOpen,
  File,
} from "lucide-react";

export function getTypeIcon(type) {
  switch (type) {
    case "Video":
      return Video;
    case "PDF":
      return FileText;
    case "Book":
      return BookOpen;
    case "Article":
      return File;
    case "Audio":
      return Headphones;
    case "Web":
    case "Website":
      return Globe;
    default:
      return File;
  }
}

export function getTypeColor(type) {
  switch (type) {
    case "Video":
      return "text-purple-700 dark:text-purple-300";
    case "PDF":
      return "text-red-700 dark:text-red-300";
    case "Book":
      return "text-blue-700 dark:text-blue-300";
    case "Article":
      return "text-emerald-700 dark:text-emerald-300";
    case "Audio":
      return "text-pink-700 dark:text-pink-300";
    case "Web":
    case "Website":
      return "text-cyan-700 dark:text-cyan-300";
    default:
      return "text-neutral-700 dark:text-neutral-200";
  }
}

export function getTypeBg(type) {
  switch (type) {
    case "Video":
      return "bg-purple-50 dark:bg-purple-950/60";
    case "PDF":
      return "bg-red-50 dark:bg-red-950/60";
    case "Book":
      return "bg-blue-50 dark:bg-blue-950/60";
    case "Article":
      return "bg-emerald-50 dark:bg-emerald-950/60";
    case "Audio":
      return "bg-pink-50 dark:bg-pink-950/60";
    case "Web":
    case "Website":
      return "bg-cyan-50 dark:bg-cyan-950/60";
    default:
      return "bg-neutral-100 dark:bg-slate-800/70";
  }
}
