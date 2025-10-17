/**
 * EPFO Data models for employee provident fund information
 */

export interface EpfoLoginRequest {
  uan: string;  // Universal Account Number
  password: string;
}

export interface EpfoLoginResponse {
  token: string;
  uan: string;
  name?: string;
  membershipDate?: string;
}

export interface EpfoAccountDetail {
  uan: string;
  name: string;
  dateOfBirth?: string;
  dateOfJoining?: string;
  fatherName?: string;
  gender?: string;
  maritalStatus?: string;
  mobileNumber?: string;
  emailId?: string;
  panNumber?: string;
  aadharNumber?: string;
}

export interface EpfoEmployerDetail {
  establishmentId: string;
  establishmentName: string;
  address?: string;
  joiningDate?: string;
  leavingDate?: string;
  isActive?: boolean;
}

export interface EpfoContribution {
  month: string;
  year: string;
  employeeContribution: number;
  employerContribution: number;
  pensionContribution: number;
  totalContribution: number;
  establishmentName?: string;
}

export interface EpfoBalance {
  totalBalance: number;
  employeeShare: number;
  employerShare: number;
  pensionShare: number;
  lastUpdated?: string;
}

export interface EpfoNomineeDetail {
  nomineeName: string;
  relationshipWithMember: string;
  dateOfBirth?: string;
  sharePercentage: number;
  address?: string;
  guardianName?: string;
}

export interface EpfoPassbook {
  uan: string;
  name: string;
  balance: EpfoBalance;
  contributions: EpfoContribution[];
  employers: EpfoEmployerDetail[];
}

export interface EpfoData {
  accountDetail?: EpfoAccountDetail;
  balance?: EpfoBalance;
  passbook?: EpfoPassbook;
  nominees?: EpfoNomineeDetail[];
  employers?: EpfoEmployerDetail[];
}
