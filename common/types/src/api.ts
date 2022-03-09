import type { Address } from './data';

// Auth

export interface SignupPostBody {
	firstName: string
	lastName: string
	email: string
	password: string
}

export interface LoginPostBody {
	email: string
	password: string
}

// Schools

export interface SchoolPostBody {
	name: string
	address: Address
}

export interface SchoolClassesPostBody {
	name: string
}

export interface SchoolInvitesPostBody {
	email: string
}

export interface SchoolInvitesDeleteBody {
	email: string
}
