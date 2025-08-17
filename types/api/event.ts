import { JoinStatus } from "../enums/JoinStatus";

export interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  eventLocation: {
    type: string;
    coordinates: [number, number];
  };
  eventTimeStamp: string; // ISO date string
  eventImageUrl: string;
  eventOrganizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventMember {
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  email: string;
  status: JoinStatus;
  joinedAt: string | null;
}

export interface EventDetails {
  event: Event;
  organizer: EventMember | null;
  members: EventMember[] | null;
}

