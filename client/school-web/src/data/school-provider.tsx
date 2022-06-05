import { Snowflake } from '@mat-master/api'
import { createContext } from 'react'
import { useParams } from 'react-router'

export type SchoolContext = { id: Snowflake }

export const schoolContext = createContext<SchoolContext>({ id: BigInt(0) })

export interface SchoolProviderProps {
	children?: React.ReactNode
}

export const SchoolProvider: React.FC<SchoolProviderProps> = ({ children }) => {
	const { school } = useParams<{ school: string }>()
	if (!school)
		throw 'A school provider can only be nested under a route with a :school param'
	const id = BigInt(school)

	return <schoolContext.Provider value={{ id }}>{children}</schoolContext.Provider>
}
