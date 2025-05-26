import { useState, useEffect } from "react"
import { getToken } from "../api/requests.ts"

const OPENTDB_TK_URL = "https://opentdb.com/api_token.php";

export function useOpenTDBToken() {
	const [tk, setTk] = useState<null|string>(null);

	useEffect(() => {
		if(tk) return;

		(async () => {
				const token = await getToken()
				setTk(token);
			}
		)()
		
	}, [tk])

	return tk;

}
