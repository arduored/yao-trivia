import { useEffect, useState } from "react"
import { useIndexedDB } from "./useIndexedDB.ts"

export function useLastScore(ip: string, db: any){
    const {get} = useIndexedDB()
    const [previousScore, setPreviousScore] = useState(null)

	useEffect(() => {
		if(ip && db) {
            (async() => {
			    const res = await get(ip)
                const {sessions} = res

                if(sessions.length === 1) {
                    setPreviousScore(sessions[0].score)
                    return
                }

                const nearestDate = findNearestDateFrom(sessions)
                const lastSession = sessions[nearestDate]
                setPreviousScore(lastSession.score)
             })()

	    }
    }, [ip, db])

    return previousScore
}

