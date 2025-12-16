import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pipelineData = {
  concept: {
    title: "Konsep",
    color: "border-purple-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    items: [
      { id: 1, title: "Midnight Symphony", medium: "Oil on Canvas", dueDate: "20 Des 2024" },
      { id: 2, title: "Urban Reflections", medium: "Mixed Media", dueDate: "25 Des 2024" },
    ]
  },
  wip: {
    title: "Proses",
    color: "border-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    items: [
      { id: 3, title: "Nature's Whisper", medium: "Watercolor", dueDate: "18 Des 2024" },
      { id: 4, title: "Digital Dreams", medium: "Digital Art", dueDate: "22 Des 2024" },
      { id: 5, title: "Color Burst", medium: "Acrylic", dueDate: "28 Des 2024" },
    ]
  },
  finished: {
    title: "Selesai",
    color: "border-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    items: [
      { id: 6, title: "Sunset Horizon", medium: "Acrylic on Canvas", dueDate: "10 Des 2024" },
      { id: 7, title: "Abstract Motion", medium: "Mixed Media", dueDate: "12 Des 2024" },
    ]
  },
  sold: {
    title: "Terjual",
    color: "border-primary",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    items: [
      { id: 8, title: "Ocean Dreams", medium: "Oil on Canvas", dueDate: "5 Des 2024", price: "Rp 18.000.000" },
      { id: 9, title: "City Lights", medium: "Acrylic", dueDate: "8 Des 2024", price: "Rp 12.500.000" },
    ]
  },
};

const Pipeline = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Pipeline Karya</h1>
            <p className="text-muted-foreground">Visualisasi siklus hidup karya seni Anda</p>
          </div>
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Karya
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {Object.entries(pipelineData).map(([key, column]) => (
            <div key={key} className="flex-shrink-0 w-80">
              <Card className={`bg-card border-border border-t-2 ${column.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${column.bgColor} ${column.textColor}`}>
                        {column.items.length}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {column.items.map((item) => (
                    <div 
                      key={item.id}
                      className="group bg-secondary/50 rounded-lg p-3 border border-border hover:border-primary/30 cursor-grab active:cursor-grabbing transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.medium}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Pindahkan</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">{item.dueDate}</span>
                        {'price' in item && (
                          <span className="text-xs font-medium text-primary">{item.price}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Ringkasan Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(pipelineData).map(([key, column]) => (
                <div key={key} className={`p-4 rounded-lg ${column.bgColor} border border-transparent`}>
                  <div className={`text-2xl font-bold ${column.textColor}`}>{column.items.length}</div>
                  <div className="text-sm text-muted-foreground">{column.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Pipeline;
