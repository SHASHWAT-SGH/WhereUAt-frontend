import { EventFormAction } from "@/types/EventFormAction";
import { EventFormState, initialFormState } from "@/types/EventFormState";

export const eventFormReducer = (
  state: EventFormState,
  action: EventFormAction
): EventFormState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_ALL":
      return { ...action.payload };

    case "RESET":
      return initialFormState;

    default:
      return state;
  }
};

