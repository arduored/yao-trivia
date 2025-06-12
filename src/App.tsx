import { Suspense, useEffect, useState } from 'react'
import { fetchQuestions } from "./api/requests.ts"
import { useOpenTDBToken } from "./hooks/useOpenTDBToken.ts"
import { useQuestions } from "./hooks/useQuestion.ts"
import { useIndexedDB } from "./hooks/useIndexedDB.ts"
import { useIP} from "./hooks/useIP.ts"
import HeartImg from "./assets/heart.svg"
import './App.css'

export default function App() {
	const ip = useIP()
	const {question, refresh, next} = useQuestions();
	const {db, add, get} = useIndexedDB();
	const [answers, setAnswers] = useState([]);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [score, setScore] = useState(0);
	const [lifes, setLifes] = useState(3);

	useEffect(() => {
		if(ip && db) {
			get(ip).then((res) => {
				console.log({res});
			});
		}
	}, [ip, db])

	useEffect(() => {
		if(question) {
			getAnswers();
			return
		}
	}, [question])

	function getAnswers() {
		const shuffledAnswers = [];
		const answers = [question.correct_answer, ...question.incorrect_answers]

		while (answers.length > 0) {
			const idx = Math.floor(Math.random() * answers.length)
			shuffledAnswers.push(answers[idx])
			answers.splice(idx, 1)
		}

		setAnswers(shuffledAnswers)
	}

	function handleSelection(e) {
		setSelectedAnswer(e.target.value);
	}

	function validate() {
		if(selectedAnswer === question.correct_answer) {
			setScore((state) => ++state);
			setSelectedAnswer(null);
		} else {
			setLifes((state) => --state);
			alert("The correct answer was: " + question.correct_answer)
			if(lifes <= 1) {
				add({ip, sessions: [{score, date: new Date()}]});
				setScore(0);
				setLifes(3);
				alert("You lost!");
			}
		}
		setSelectedAnswer(null);
		next()
	}

	function save() {
		console.info("Score saved!")
		add({ip, sessions: [{score, date: new Date()}]})
	}

  return (<Suspense fallback={ <div>loading ... </div>}>
	<div className="navbar">
		<div id="score">{score}</div>
		<div id="lifes">
			{Array(lifes).fill(HeartImg).map((heart, i) => <img key={i} src={heart} width={32}/>)}
		</div>
	</div>
	<div className="card">
		{question ? 
		<div>
			<div dangerouslySetInnerHTML={{__html: `
				<h4>${question.category} - ${question.difficulty}</h4>`}}
				/>
			<div dangerouslySetInnerHTML={{__html: `<h2>${question.question}</h2>`}} />
			
			 <div className="answers">
				{answers.map((i, idx) =>(<div key={idx} className="answer_group">

					<span dangerouslySetInnerHTML={{__html: `<label htmlFor={answer${i}}>${i}</label>`}}/>
					<div>
						<input type="checkbox" value={i} checked={i === selectedAnswer} name={`answer${i}`} onChange={handleSelection}/>
					</div>
				</div>))}
			</div>

			<div id="actions">
				<button onClick={validate}>Validate</button>
				<button onClick={save}>Save</button>
			</div>
		</div> 
			:
		<div> loading...</div>}
	</div>
	</Suspense>
  )
}
