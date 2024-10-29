import React, { useState, useEffect } from "react";
import "./Quiz.css";
import { data } from "../../assets/data.js";

export const Quiz = () => {
  // State to control quiz start
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  // Track the current question index
  const [index, setIndex] = useState(0);
  // Set current question based on index
  const [question, setQuestion] = useState(data[index]);
  // Control visibility of answer options
  const [showOptions, setShowOptions] = useState(false);
  // Timer for each question
  const [timeLeft, setTimeLeft] = useState(30);
  // Flag to manage timer running state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // Store user answers with correctness
  const [userAnswers, setUserAnswers] = useState([]);
  // Count correct answers
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Function to initialize quiz start
  const startQuiz = () => {
    setIsQuizStarted(true);
    setQuestion(data[0]);
    setShowOptions(false);
    setTimeLeft(30);
    setIsTimerRunning(false);
    setUserAnswers([]);
    setCorrectAnswersCount(0);
    setIndex(0);
  };

  // Function to handle user answer selection
  const handleAnswer = (option) => {
    const isCorrect = option === question.answer;
    // Store user answer and update correct count if correct
    setUserAnswers((prev) => [
      ...prev,
      { question: question.question, answer: option, isCorrect },
    ]);
    if (isCorrect) setCorrectAnswersCount((prev) => prev + 1);
    handleNext();
  };

  // Move to the next question or end quiz if last question
  const handleNext = () => {
    if (index < data.length - 1) {
      setIndex(index + 1);
      setQuestion(data[index + 1]);
      setShowOptions(false);
      setTimeLeft(30);
      setIsTimerRunning(false);
    } else {
      setIsQuizStarted(false);
    }
  };

  // Effect to manage the display of options and countdown timer
  useEffect(() => {
    if (isQuizStarted) {
      const timer = setTimeout(() => {
        setShowOptions(true);
        setIsTimerRunning(true);
      }, 4000);

      const questionTimer = setInterval(() => {
        if (isTimerRunning) {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(questionTimer);
              handleNext();
              return 0;
            }
            return prevTime - 1;
          });
        }
      }, 1000);

      // Cleanup timers
      return () => {
        clearTimeout(timer);
        clearInterval(questionTimer);
      };
    }
  }, [isQuizStarted, index, isTimerRunning]);

  // Calculate unanswered questions count
  const unansweredCount = data.length - userAnswers.length;

  return (
    <div className="container">
      <h1>Quiz App 🚀</h1>
      <hr />

      {/* Display start screen if quiz hasn't started */}
      {!isQuizStarted && userAnswers.length === 0 ? (
        <div className="start-screen">
          <h2>Teste Hoş Geldiniz🧠</h2>
          <p>
            Bu test, genel kültür bilgilerinizi ölçmenize yardımcı olacaktır.
            Başlamak için butona tıklayın❕
          </p>
          <button id="start" onClick={startQuiz}>
            Teste Başla
          </button>
        </div>
      ) : isQuizStarted ? (
        <>
          {/* Display media if available for the question */}
          {question.media && (
            <img
              src={`/img/${question.media}`}
              alt="Question related media"
              className="question-media"
            />
          )}
          <h2>
            {index + 1}. {question.question}
          </h2>

          {/* Show options if allowed, otherwise show countdown */}
          <ul>
            {showOptions &&
              question.options.map((option, idx) => (
                <li key={idx} onClick={() => handleAnswer(option)}>
                  {option}
                </li>
              ))}
          </ul>

          {!showOptions && <p>Seçenekler 4 saniye sonra görünecektir...</p>}
          {timeLeft === 0 && <p>Zaman doldu! Yeni soruya geçiliyor...</p>}

          {/* Timer display */}
          <div className="timer"> {timeLeft} </div>

          {/* Current question index */}
          <div className="index">
            {index + 1} of {data.length} questions
          </div>

          {/* "Next Question" button if options are shown */}
          {showOptions && <button onClick={handleNext}>Sonraki Soru</button>}
        </>
      ) : (
        // Results screen after quiz ends
        <div className="results">
          <h2>Sonuçlar</h2>
          <p>Toplam Doğru: {correctAnswersCount}</p>
          <p>Toplam Yanlış: {userAnswers.length - correctAnswersCount}</p>
          <p>Toplam Boş: {unansweredCount}</p>

          <h3>Tüm Cevaplar:</h3>
          {/* Display all questions with user answers */}
          <ul className="answers-list">
            {data.map((q, idx) => {
              const userAnswer = userAnswers.find(
                (a) => a.question === q.question
              );
              const isCorrect = userAnswer && userAnswer.isCorrect;

              return (
                <li
                  key={idx}
                  className={`answer-item ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <p className="question-text">Soru: {q.question}</p>
                  <p className="user-answer">
                    Verdiğiniz Cevap: {userAnswer ? userAnswer.answer : "Boş"} -{" "}
                    {isCorrect ? "Doğru ✅" : "Yanlış ❌"}
                  </p>
                  {/* Display correct answer if user was incorrect */}
                  {!isCorrect && (
                    <p className="correct-answer">Doğru Cevap: {q.answer}</p>
                  )}
                </li>
              );
            })}
          </ul>
          <button onClick={startQuiz}>Testi Tekrar Çöz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
