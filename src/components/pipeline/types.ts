// Pipeline Types
export type PipelineStatus = "concept" | "wip" | "finished" | "sold";

export interface PipelineItem {
  id: string;
  title: string;
  medium: string;
  dueDate: string;
  price?: string;
  image?: string;
  description?: string;
}

export interface PipelineColumn {
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
  items: PipelineItem[];
}

export interface PipelineData {
  concept: PipelineColumn;
  wip: PipelineColumn;
  finished: PipelineColumn;
  sold: PipelineColumn;
}

export interface PipelineFormData {
  title: string;
  medium: string;
  dueDate: string;
  price: string;
  image: string;
  description: string;
  status: PipelineStatus;
}

export interface PipelineFormErrors {
  title?: string;
  medium?: string;
  dueDate?: string;
}
