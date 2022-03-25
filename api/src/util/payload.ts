import type { Privilege } from "@common/types";

export interface Payload {
  id: bigint,
  email: string,
  privilege: Privilege,
  stripeCustomerId: string
}