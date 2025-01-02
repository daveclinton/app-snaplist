export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};

export interface ProductResult {
  id?: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  source?: string;
}

type SpecificsData = {
  manufacturer: string;
  productName: string;
  category: string;
};

type ShippingData = {
  service: string;
  cost: string;
  dispatchDays: number;
};

type ReturnsData = {
  accepted: boolean;
  period: number;
  shippingPaidBy: string;
};

export type ListingFormData = {
  title: string;
  description: string;
  categories?: string[];
  categoryId: string;
  categoryName: string;
  condition: string;
  price: string;
  images: string[];
  specifics: SpecificsData;
  shipping: ShippingData;
  returns: ReturnsData;
  stock_quantity?: number;
  discount_percentage?: number;
  tags?: string[];
};

export type NestedKeys = keyof Pick<
  ListingFormData,
  'specifics' | 'shipping' | 'returns'
>;
export type FormComponentProps = {
  formData: ListingFormData;
  updateForm: (field: keyof ListingFormData, value: any) => void;
  updateNestedForm: (parent: NestedKeys, field: string, value: any) => void;
  errors: Record<string, string>;
};

export type BasicInfoFormProps = FormComponentProps;
export type SpecificsFormProps = FormComponentProps;
export type PricingFormProps = FormComponentProps;
export type ShippingFormProps = FormComponentProps;
export type ReturnsFormProps = FormComponentProps;
