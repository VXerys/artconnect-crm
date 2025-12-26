import { PipelineData, PipelineFormData } from "./types";

// Initial form data
export const initialFormData: PipelineFormData = {
  title: "",
  medium: "",
  dueDate: "",
  price: "",
  image: "",
  description: "",
  status: "concept",
};

// Medium options for artwork
export const mediumOptions = [
  "Acrylic on Canvas",
  "Oil on Canvas",
  "Watercolor",
  "Mixed Media",
  "Digital Art",
  "Digital Print",
  "Charcoal",
  "Pastel",
  "Ink on Paper",
  "Sculpture",
  "Photography",
  "Lainnya",
];

// Initial pipeline data
export const initialPipelineData: PipelineData = {
  concept: {
    title: "Konsep",
    color: "border-purple-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    items: [
      { id: "item-1", title: "Midnight Symphony", medium: "Oil on Canvas", dueDate: "20 Des 2024" },
      { id: "item-2", title: "Urban Reflections", medium: "Mixed Media", dueDate: "25 Des 2024" },
    ]
  },
  wip: {
    title: "Proses",
    color: "border-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    items: [
      { id: "item-3", title: "Nature's Whisper", medium: "Watercolor", dueDate: "18 Des 2024" },
      { id: "item-4", title: "Digital Dreams", medium: "Digital Art", dueDate: "22 Des 2024" },
      { id: "item-5", title: "Color Burst", medium: "Acrylic", dueDate: "28 Des 2024" },
    ]
  },
  finished: {
    title: "Selesai",
    color: "border-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    items: [
      { id: "item-6", title: "Sunset Horizon", medium: "Acrylic on Canvas", dueDate: "10 Des 2024" },
      { id: "item-7", title: "Abstract Motion", medium: "Mixed Media", dueDate: "12 Des 2024" },
    ]
  },
  sold: {
    title: "Terjual",
    color: "border-primary",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    items: [
      { id: "item-8", title: "Ocean Dreams", medium: "Oil on Canvas", dueDate: "5 Des 2024", price: "Rp 18.000.000" },
      { id: "item-9", title: "City Lights", medium: "Acrylic", dueDate: "8 Des 2024", price: "Rp 12.500.000" },
    ]
  },
};

// Status configuration for quick access
export const statusConfig = {
  concept: { title: "Konsep", color: "border-purple-500", bgColor: "bg-purple-500/10", textColor: "text-purple-400" },
  wip: { title: "Proses", color: "border-blue-500", bgColor: "bg-blue-500/10", textColor: "text-blue-400" },
  finished: { title: "Selesai", color: "border-emerald-500", bgColor: "bg-emerald-500/10", textColor: "text-emerald-400" },
  sold: { title: "Terjual", color: "border-primary", bgColor: "bg-primary/10", textColor: "text-primary" },
};
