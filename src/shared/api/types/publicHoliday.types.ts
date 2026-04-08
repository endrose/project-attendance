export interface CreatePublicHolidayDto {
  name: string;
  date: string;
  category: string;
  tenantId: string;
}

export interface UpdatePublicHolidayDto {
  name: string;
  date: string;
  category: string;
}

export interface PublicHolidayResponseDto {
  id: string;
  name: string;
  date: string;
  category: string;
}
