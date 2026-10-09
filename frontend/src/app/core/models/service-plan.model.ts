export interface ServicePlan {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  priceAmount: number;
  currencyCode: string;
  billingPeriod: string;
  inclusions: string[];
  exclusions: string[];
  isPublished: boolean;
  displayOrder: number;
}
