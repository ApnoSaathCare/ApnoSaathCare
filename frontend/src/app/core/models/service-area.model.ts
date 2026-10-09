export type ServiceAreaStatus = 'AVAILABLE' | 'NEEDS_CONFIRMATION' | 'NOT_CURRENTLY_LISTED';

export interface ServiceArea {
  id: string;
  localityName: string;
  pincode?: string;
  city: string;
  state: string;
  isActive: boolean;
  coverageNotes?: string;
}

export interface ServiceAreaCheckResult {
  status: ServiceAreaStatus;
  locality?: string;
  pincode?: string;
  city: string;
  state: string;
  message: string;
  notes?: string;
}
