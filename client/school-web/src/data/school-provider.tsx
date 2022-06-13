import { Snowflake } from '@mat-master/api'
import { createContext } from 'react'
import { Outlet, useParams } from 'react-router'

export type SchoolContext = { id: Snowflake }

export const schoolContext = createContext<SchoolContext>({ id: BigInt(0) })

export const SchoolProvider: React.FC = ({ children }) => {
	const { school } = useParams<{ school: string }>()
	if (!school)
		throw 'A school provider can only be nested under a route with a :school param'
	const id = BigInt(school)

	return (
		<schoolContext.Provider value={{ id }}>
			<Outlet />
			{children}
		</schoolContext.Provider>
	)
}
