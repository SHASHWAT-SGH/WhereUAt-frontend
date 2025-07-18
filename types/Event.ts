import { User } from "./User";

export interface Event {
  eventName: string;
  eventDescription: string;
  eventLatitude: number;
  eventLongitude: number;
  eventTimeStamp: Date;
  eventImageUrl: string;
  eventOrganizerId: string;
  eventMembersId: User[];
}

