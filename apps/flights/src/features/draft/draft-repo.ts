import { createPersistedStore } from "../../lib/persisted-store";
import { draftSchema, type Draft } from "./draft.types";

export const EMPTY_DRAFT: Draft = { flight: null, passengers: 1, items: {} };

export const draftRepo = createPersistedStore<Draft>("skyline.draft.v1", draftSchema, EMPTY_DRAFT);
