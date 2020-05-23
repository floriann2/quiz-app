import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';

import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty.js';

import correctNotification from '../../assets/audio/swish.mp3';
import wrongNotification from '../../assets/audio/miss.mp3';
import buttonSound from '../../assets/audio/bounce.mp3';

class Play extends React.Component{
	constructor (props){ //all class components should have this
		super(props);
		this.state={
			questions,
			currentQuestion: {},
			nextQuestion: {},
			previousQuestion: {},
			answer: '',
			numberOfQuestions: 0,
			numberOfAnsweredQuestion: 0,
			currentQuestionIndex: 0,
			score: 0,
			correctAnswers: 0,
			wrongAnswers: 0,
			hints: 5,
			fiftyFifty: 2,
			usedFiftyFifty: false,
			time: {}
		};
	};
	componentDidMount(){
		const {questions, currentQuestion, nextQuestion, previousQuestion}  = this.state;
		this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
	}
	displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
		let { currentQuestionIndex } = this.state;
		if (!isEmpty(this.state.questions)){
			questions = this.state.questions;
			currentQuestion = questions[currentQuestionIndex];
			nextQuestion = questions[currentQuestionIndex + 1];
			previousQuestion = questions[currentQuestionIndex - 1]
			const answer = currentQuestion.answer;
			this.setState({
				currentQuestion,
				nextQuestion,
				previousQuestion,
				numberOfQuestions: questions.length,
				answer
			});
		}
	}
	handleOptionClick = (e) => {
		if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()){
			setTimeout(() => {
				document.getElementById('correct-sound').play();
			}, 500);
			this.correctAnswer();
		}
		else{
			setTimeout(() => {
				document.getElementById('wrong-sound').play();
			}, 500);
			this.wrongAnswer();
		}
	}

    handleButtonClick = () => {
    	this.playButtonSound();
    };

    playButtonSound = () => {
		setTimeout(() => {
			document.getElementById('button-sound').play();
		}, 500);
    };



	correctAnswer = () =>{
		M.toast({
			html: 'Correct Answer!',
			classes: 'toast-valid',
			displayLength: 1500
		});
		this.setState(prevState => ({
			score: prevState.score + 1,
			correctAnswers: prevState.correctAnswers + 1,
			currentQuestionIndex: prevState.currentQuestionIndex + 1,
			numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
		}), () => {
			this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
		});
	}
	wrongAnswer = () => {
		navigator.vibrate(1000);
		M.toast({
			html: 'Wrong Answer!',
			classes: 'toast-invalid',
			displayLength: 1500
		});
		this.setState(prevState => ({
			//score: prevState.score - 1
			wrongAnswers: prevState.wrongAnswers + 1,
			currentQuestionIndex: prevState.currentQuestionIndex + 1,
			numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
		}), () =>{
			this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
		});
}
	increaseCount = () => {
		this.setState({counter: 5})
	}
	render(){
		const { currentQuestion, currentQuestionIndex, numberOfQuestions } = this.state;
		return (
			<Fragment>
				<Helmet>Quiz Page</Helmet>
				<Fragment>
					<audio id = "correct-sound" src={correctNotification}></audio>
					<audio id = "wrong-sound" src={wrongNotification}></audio>
					<audio id = "button-sound" src={buttonSound}></audio>
				</Fragment>
				<div className="questions">
					<h2>Quiz Mode</h2>
					<div className="lifeline-container">
						<p>
							<span className="mdi mdi-set-center mdi-24px lifeline-icon"></span><span className="lifeline">2</span>
						</p>
						<p>
							<span className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span><span className="lifeline">5</span>
						</p>
					</div>
					<div>
						<p>
							<span className="left" style={{float: 'left'}}>{currentQuestionIndex + 1} of {numberOfQuestions}</span>
							<span className="right">2:15<span className="mdi mdi-clock-outline mdi-24px"></span></span>
						</p>
					</div>
					<h5>{ currentQuestion.question }</h5>
					<div className="options-container">
						<p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
						<p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
					</div>
					<div className="options-container">
						<p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
						<p onClick = {this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
					</div>
					<div className="button-container">
						<button onClick = {this.handleButtonClick}>Previous</button>
						<button onClick = {this.handleButtonClick}>Next</button>
						<button onClick = {this.handleButtonClick}>Quit</button>
					</div>

				</div>
			</Fragment>
		);
	}
}

export default Play;