import type { ElementType } from "react";

export type AppRoute = {
  path: string;
  component: ElementType;
  layout?: ElementType;
  isPrivate?: boolean;
};