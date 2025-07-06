export interface EventFormData {
  eventName: string;
  eventDescription: string;
  eventLatitude: number;
  eventLongitude: number;
  eventTimeStamp: Date;
  eventImageUrl: string;
  eventOrganizerId: string;
  eventMembersId: string[];
}