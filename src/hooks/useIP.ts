import { useState, useEffect } from "react"

export function useIP() {
	const [ip, setIP] = useState<any | null>();

	useEffect(() => {
		(async() => {
			const res = await fetch("http://ip-api.com/json/")
			if(res.status === 200) {
				const result = await res.json()
				setIP(result.query)
			}
		})()
	})

	return ip
}
