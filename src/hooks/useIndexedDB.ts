import {useState, useEffect} from "react"

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

			objectStore.createIndex("score", "score", {unique: false})
			console.log("yaoTrivia object store created")
		}

	}, [])

	function add(item) {
		const transaction = db.transaction(['yaoTrivia'], 'readwrite')
		const dbObj = transaction.objectStore('yaoTrivia')
		const request = dbObj.add(item)

		request.onsuccess = (event) => {
			console.info("Score stored!")
		}
	}

	return {db, add}
}
