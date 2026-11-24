import { useSyncExternalStore } from "react";
import { draftService } from "./draft-service";
import type { Draft } from "./draft.types";

export function useDraft(): Draft {
  return useSyncExternalStore(draftService.subscribe, draftService.get);
}
