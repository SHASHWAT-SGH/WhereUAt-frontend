import { UserSearchedDTO } from "./api/user";

export interface EventFormState {
  eventName: string;
  eventDescription: string;
  eventDate: Date;
  eventTime: Date;
  eventLatitude: number | null;
  eventLongitude: number | null;
  selectedLocationAddress: string | null;
  eventImageUrl: string;
  eventOrganizerId: string;
  eventMembers: UserSearchedDTO[];
}

export const initialFormState: EventFormState = {
  eventName: "",
  eventDescription: "",
  eventDate: new Date(),
  eventTime: new Date(),
  eventImageUrl: "",
  eventLatitude: null,
  eventLongitude: null,
  selectedLocationAddress: null,
  eventMembers: [],
  eventOrganizerId: "",
};