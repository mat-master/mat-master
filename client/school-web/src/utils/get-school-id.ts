/**
 * Attempts to parse the current schools id from the url.
 */
const getSchoolId = () => {
	const matches = /schools\/\d+/.exec(window.location.pathname)
	if (!matches || !matches.length) return
	const match = matches[0]!.substring(8)

	try {
		return BigInt(match)
	} catch {
		return undefined
	}
}

export default getSchoolId
