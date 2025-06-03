import {useEffect, useState} from "react"
import {useOpenTDBToken} from "./useOpenTDBToken.ts"
import { fetchQuestions } from "../api/requests.ts"

export function useQuestions() {
	const token = useOpenTDBToken();
	const [questions, setQuestions] = useState<Set<Question>|null>(null)
	const [question, setQuestion] = useState<Question|null>(null)
	const [iterator, setIterator] = useState<Iterator<Question>|null>(null)

	useEffect(() => {
		getQuestions(token)
	}, [])

	useEffect(() => {
		if(!questions) return;
		setIterator(questions.values())
		
	}, [questions])


	function refresh() {
		getQuestions(token)
	}

	function next() {
		setQuestion(iterator.next().value)
	}

	async function getQuestions(token: string) {
		const results = await fetchQuestions(token);

		if(results) {	
			setQuestions(new Set(results));
		}
	}


	return {question, refresh, next}
}


