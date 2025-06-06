import { Suspense, useEffect, useState, use } from 'react'
import { fetchQuestions } from "./api/requests.ts"
import { useOpenTDBToken } from "./hooks/useOpenTDBToken.ts"
import { useIndexedDB } from "./hooks/useIndexedDB.ts"
import { useIP} from "./hooks/useIP.ts"
import HeartImg from "./assets/heart.svg"
import './App.css'

export default function App() {
	const ip = useIP()
	const token = useOpenTDBToken() 
	const {db, add, get} = useIndexedDB();

	const [question, setQuestion] = useState<null|Question>(null);
	const [answers, setAnswers] = useState([]);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [score, setScore] = useState(0);
	const [lifes, setLifes] = useState(3);
	const [displayWelcomeBack, setDisplayWelcomeBack] = useState(false);
	const [lastScore, setLastScore] = useState<number |null>(null);
	
	useEffect(() => {
		if(!ip || !db) return;

		const alreadyKnownPlayer = get(ip)
		if(alreadyKnownPlayer){
			const now = Date.now()
			let mostRecent = null
			alreadyKnownPlayer.sessions.forEach((session) => {
				const sessionTS = new Date(session.date).gettime()
				if(!mostRecent){
					mostRecent = session
				} else if(new Date(mostRecent.date).getTime() < sessionTS){
					mostRecent = session
				} 
				
			})
			console.log({mosteRecent})
			setLastScore(mostRecent.score)
			setDisplayWelcomeBack(true)
		}
	}, [ip, db])

	useEffect(() => {
		if(question) {
			getAnswers();
			return
		}
		(async() => {
			const result = await fetchQuestions(token);

			if(result) {	
				setQuestion(result[0]);
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
			if(lifes <= 1) {
				add({ip, sessions: [{score, date: new Date() }]})

				setScore(0);
				setSelectedAnswer(null);
				setLifes(3);
				alert("You lost!");
			}
		}
			setQuestion(null);
	}

  return (<Suspense fallback={ <div>loading ... </div>}>
	{displayWelcomeBack && <div>
		<h1>Welcome Back!</h1>
		<h3>Your last score was : {lastScore}</h3>
	</div>}
	<div className="navbar">
		<div id="score">{score}</div>
		<div id="lifes">
			{Array(lifes).fill(HeartImg).map((heart, i) => <img key={i} src={heart} width={32}/>)}
		</div>
	</div>
	<div className="card">
		{question ? 
		<div>
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
				<button onClick={() => add({ip:"test", score})}>Save</button>
			</div>
		</div> 
			:
		<div> loading...</div>}
	</div>
	</Suspense>
  )
}
