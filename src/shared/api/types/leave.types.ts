export interface LeaveRequestResponseDto {
  id: string; // or leaveRequestId
  employee?: {
    fullName?: string;
    position?: string;
    division?: {
      name?: string;
    };
  };
  employeeName?: string; // in case it's flattened
  leaveType: string;
  startDate: string;
  endDate: string;
  durationInDays?: number;
  duration?: number;
  reason: string;
  status: string;
  balance?: number; // Optional balance field if provided
}

export interface ApproveLeaveRequestDto {
  leaveRequestId: string;
  adminUserId: string;
}

export interface RejectLeaveRequestDto {
  leaveRequestId: string;
  reason: string;
  adminUserId?: string;
}
