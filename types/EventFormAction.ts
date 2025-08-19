import { EventFormState } from "./EventFormState";

export type EventFormAction =
  | { type: "UPDATE_FIELD"; field: keyof EventFormState; value: any }
  | { type: "RESET" }
  | { type: "SET_ALL"; payload: EventFormState };