const OPENTDB_TK_URL = "https://opentdb.com/api_token.php";
const OPENTDB_URL = "https://opentdb.com/api.php";

export async function getToken():string {
	const res = await fetch(`${OPENTDB_TK_URL}?command=request`);
	const {response_code, token } = await res.json();

	if(response_code === 4) {
		const res = await fetch(`${OPENTDB_TK_URL}?command=reset&token=${token}`);
		const {token: newToken} = await res.json();
		return newToken;
	}

	return token;
}


export async function fetchQuestions():Promise<Question> {
	const token = await getToken();
	const res = await fetch(`${OPENTDB_URL}?amount=10&token${token}`);
	const {response_code, results, ...rest }= await res.json();
	
	if(response_code === 5) {
		setTimeout(() => {
			return fetchOneQuestion(token);
		}, 5000);
	} else {
		return results;
	}
}


