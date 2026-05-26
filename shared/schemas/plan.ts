export interface Plan {
  id: string;
  userId: string;
  title: string;
  type: 'meal' | 'garden';
  items: PlanItem[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanItem {
  id: string;
  contentId?: string; // Link to a recipe or guide
  notes: string;
  date: string;
}
