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

/** An object describing one recurring class schedule */
export interface ClassTime {
    /** A 5 segment crontab describing the class schedule
     * example: 0 19 * * 1
     * meaning: every moday starting at 7:00 pm
     */
    schedule: string
    
    /** The duration of the class in minutes */
	duration: number
}