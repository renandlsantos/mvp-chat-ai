export interface PageProps<Params, SearchParams = undefined> {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export type PagePropsWithId = PageProps<{ id: string }>;

export interface DynamicLayoutProps {
  modal?: React.ReactNode;
  params: Promise<{ variants: string }>;
}
