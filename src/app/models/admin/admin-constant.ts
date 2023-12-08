export class AdminConstant {
  public static readonly filterPlaceholder: string = "Filter";
  public static readonly filterOptions: number[] = [5, 10, 20];
}

export enum OrganizationType {
  NonProfit = 'NonProfit',
  ForProfit = 'ForProfit',
  Government = 'Government',
  // Add other types as needed
}
