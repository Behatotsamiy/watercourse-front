
export interface AppRoute {
  path: string;
  component: React.ComponentType<any>;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  isPrivate?: boolean;
  roles?: string[]; // Добавляем поле для ролей
};

