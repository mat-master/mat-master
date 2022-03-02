import type { Privilege } from "types/src/user";

export interface Payload {
  id: bigint,
  privilege: Privilege
}