import type { Address } from "./address";
import type { User } from "./user";

/** School trial period is set to an ms string */
export const SCHOOL_TRIAL_PERIOD = "3m";

export interface School {
    id: bigint,
    owner: bigint,
    name: string,
    address: Address,
    tier: Tier,
    stripeAccountId: string,
    stripeSubscriptionId: string
}

export enum Tier {
    TRIAL = 0,
    BASIC = 1,
    PREMIUM = 2
}

export interface Student {
    id: bigint,
    school: School,
    user: User,
    stripeCustomerId: string
}