import os from 'os'

type IPv4Address = `${number}.${number}.${number}.${number}`

export const getProcessIp = () => {
	const interfaces = os.networkInterfaces()
	for (const iface of Object.values(interfaces)) {
		if (!iface) continue
		for (const addr of iface) {
			if (addr.family === 'IPv4' && !addr.internal)
				return addr.address as IPv4Address
		}
	}

	return null
}
