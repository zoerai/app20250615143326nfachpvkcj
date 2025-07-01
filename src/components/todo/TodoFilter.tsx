
"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export type FilterType = "all" | "pending" | "completed" | "overdue";
export type SortType = "create_time" | "due_date" | "priority" | "title";

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sort: SortType;
  onSortChange: (sort: SortType) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function TodoFilter({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
}: TodoFilterProps) {
  const filterOptions = [
    { value: "all", label: "全部任务" },
    { value: "pending", label: "进行中" },
    { value: "completed", label: "已完成" },
    { value: "overdue", label: "已逾期" },
  ];

  const sortOptions = [
    { value: "create_time", label: "创建时间" },
    { value: "due_date", label: "截止日期" },
    { value: "priority", label: "优先级" },
    { value: "title", label: "标题" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索任务..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex gap-2">
        <Select value={filter} onValueChange={(value: FilterType) => onFilterChange(value)}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(value: SortType) => onSortChange(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                按{option.label}排序
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
