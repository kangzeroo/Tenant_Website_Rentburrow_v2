
// to shorten a long street address by removing city and postal code
export const shortenAddress = (address) => {
	if (address) {
		const comma = address.indexOf(',')
		if (comma > 7) {
			return address.slice(0, comma)
		} else {
			const nextAddr = address.slice(comma + 1, address.length - 1)
			const nextComma = nextAddr.indexOf(',')
			return address.slice(0, comma + nextComma + 1)
		}
	} else {
		return
	}
}
