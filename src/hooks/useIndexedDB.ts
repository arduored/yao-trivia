import {useState, useEffect} from "react"

type ScoreHistory = {
	ip: string;
	sessions: [{
		score: number;
		date: Date;
	}]
}

type ObjectStoreMode = "readonly" | "readwrite";

export function useIndexedDB() {
	const [db, setDB] = useState(null)

	useEffect(() => {
		const DBOpenRequest = window.indexedDB.open('yaoTrivia_db', 4)

		DBOpenRequest.onerror = (event) => {
			console.error('Error opening DB')
		}

		DBOpenRequest.onsuccess = (event) => {
			console.info("DB initialized")
			setDB(event.target.result)
		}

		DBOpenRequest.onupgradeneeded = (event) => {
			const db = event.target.result
			const objectStore = db.createObjectStore("yaoTrivia", {keyPath: "ip"})

			objectStore.createIndex("sessions", "sessions", {unique: false})
		}

	}, [])

	function getObjectStore(mode: ObjectStoreMode) {
		const transaction = db.transaction(['yaoTrivia'], mode)
		return transaction.objectStore('yaoTrivia')

	}

	function add(item: ScoreHistory) {
		const existingScore = get(item.ip)
		const dbObj = getObjectStore('readwrite')
		const request = existingScore ? dbObj.put(item) : dbObj.add(item)

		request.onsuccess = (event) => {
			console.info("Score stored!")
		}
	}

	function get(key: string) {
		const dbObj = getObjectStore('readonly')
		const objRequest = dbObj.get(key);

		objRequest.onsuccess = (event) => {
			console.log({result: objRequest.result})
			return objRequest.result
		}
	}

	return {db, add, get}
}
