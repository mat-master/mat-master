/**
 * Attempts to parse the current schools id from the url.
 * throws on not found
 */
const getSchoolId = () => {
	const matches = /schools\/\d+/.exec(window.location.pathname)
	if (!matches || !matches.length) throw "Couldn't resolve school id"
	const match = matches[0]!.substring(8)
	return BigInt(match)
}

export default getSchoolId
