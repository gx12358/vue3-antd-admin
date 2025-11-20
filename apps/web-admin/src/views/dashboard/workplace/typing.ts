import type { Component } from 'vue'

interface AnalysisOverviewItem {
  name: string;
  value: number;
}

interface WorkbenchProjectItem {
  color?: string;
  content: string;
  date: string;
  group: string;
  icon: Component | string;
  title: string;
  url?: string;
}

interface WorkbenchTrendItem {
  avatar: string;
  content: string;
  date: string;
  title: string;
}

interface WorkbenchTodoItem {
  completed: boolean;
  content: string;
  date: string;
  title: string;
}

interface WorkbenchGroupItem {
  icon: string;
  title: string;
}

export type {
  AnalysisOverviewItem,
  WorkbenchGroupItem,
  WorkbenchProjectItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
}
