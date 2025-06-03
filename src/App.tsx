import { Suspense, useEffect, useState } from 'react'
import { useQuestions } from "./hooks/useQuestion.ts"
import HeartImg from "./assets/heart.svg"
import './App.css'

export default function App() {
	const {question, refresh, next} = useQuestions() 
	const [answers, setAnswers] = useState([]);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [score, setScore] = useState(0);
	const [lifes, setLifes] = useState(3);

	useEffect(() => {
		if(question) {
			getAnswers()
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
		} else {
			setLifes((state) => --state);
			if(lifes < 2) {
				setScore(0);
				setLifes(3);
				alert("You lost!");
			}
		}

		setSelectedAnswer(null);
		next();
	}

  return (<>
	<div className="navbar">
		<div id="score">{score}</div>
		<div id="lifes">
			{Array(lifes).fill(HeartImg).map((heart, i) => <img key={i} src={heart} width={32}/>)}
		</div>
	</div>

	<Suspense fallback={ <div>loading ... </div>}>
		{question && <div className="card">
			<h4>{question.category} - {question.difficulty}</h4>
			<div dangerouslySetInnerHTML={{__html: `<h2>${question.question}</h2>`}} />
			
			 <div className="answers">
				{answers.map((i, idx) =>(
					<div key={idx} className="answer_group">
						<span dangerouslySetInnerHTML={{__html: `<label htmlFor="answer${i}">${i}</label>`}}></span>

						<input type="checkbox" value={i} selected={selectedAnswer === i} name={`answer${i}`} onChange={handleSelection}/>
					</div>
				))}
			</div>

			<div id="actions">
				<button onClick={validate}>Validate</button>
			</div>
		</div>}
	</Suspense>
</>)
}
