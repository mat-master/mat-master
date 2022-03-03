import type { Privilege } from "types";

export interface Payload {
  id: bigint,
  email: string,
  privilege: Privilege
}