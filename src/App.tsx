import { Suspense, useEffect, useState } from 'react'
import './App.css'
import { fetchOneQuestion } from "./api/requests.ts"
import { useOpenTDBToken } from "./hooks/useOpenTDBToken.ts"
import HeartImg from "./assets/heart.svg"

export default function App() {
	const token = useOpenTDBToken() 
	const [question, setQuestion] = useState<null|Question>(null);
	const [answers, setAnswers] = useState([]);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [score, setScore] = useState(0);
	const [lifes, setLifes] = useState(3);

	useEffect(() => {
		if(question) {
			getAnswers();
			return
		}
		(async() => {
			const result = await fetchOneQuestion(token);

			if(result) {	
				setQuestion(result);
			}
		})()
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
			if(lifes <= 0) {
				setScore(0);
				setSelectedAnswer(null);
				setLifes(3);
				alert("You lost!");
			}
		}
			setQuestion(null);
	}

  return (<Suspense fallback={ <div>loading ... </div>}>
	<div class="navbar">
		<div id="score">{score}</div>
		<div id="lifes">
			{Array(lifes).fill(HeartImg).map((heart, i) => <img key={i} src={heart} width={32}/>)}
		</div>
	</div>
	<div className="card">
		{question ? <div>
			<h4>{question.category} - {question.difficulty}</h4>
			<div dangerouslySetInnerHTML={{__html: `<h2>${question.question}</h2>`}} />
			
			 <div className="answers">
				{answers.map((i, idx) =>(<div key={idx} className="answer_group">

					<label htmlFor={`answer${i}`}>{i}</label>
					<div>
						<input type="checkbox" value={i} name={`answer${i}`} onChange={handleSelection}/>
					</div>
				</div>))}
			</div>

			<div id="actions">
				<button onClick={validate}>Validate</button>
			</div>
		</div> : <div> loading...</div>}
	</div>
	</Suspense>
  )
}
