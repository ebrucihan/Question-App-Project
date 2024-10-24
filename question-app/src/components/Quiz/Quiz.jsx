import React, { useState, useEffect } from "react";
import "./Quiz.css";
import { data } from "../../assets/data.js";

export const Quiz = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [showOptions, setShowOptions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setQuestion(data[index]);
    setShowOptions(false);
    setTimeLeft(30);
    setIsTimerRunning(false);
    setUserAnswers([]);
    setCorrectAnswersCount(0);
    setIndex(0); // Sıfırdan başlat
  };

  const handleAnswer = (option) => {
    const isCorrect = option === question.answer;
    setUserAnswers((prev) => [
      ...prev,
      { question: question.question, answer: option, isCorrect },
    ]);
    if (isCorrect) setCorrectAnswersCount((prev) => prev + 1);
    handleNext();
  };

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

      return () => {
        clearTimeout(timer);
        clearInterval(questionTimer);
      };
    }
  }, [isQuizStarted, index, isTimerRunning]);

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />

      {!isQuizStarted ? (
        <div className="start-screen">
          <h2>Teste Hoş Geldiniz!</h2>
          <p>
            Bu test, genel kültür bilgilerinizi ölçmenize yardımcı olacaktır.
            Başlamak için butona tıklayın.
          </p>
          <button id="start" onClick={startQuiz}>
            Teste Başla
          </button>
        </div>
      ) : (
        <>
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

          <div className="timer">Kalan Süre: {timeLeft} saniye</div>

          <div className="index">
            {index + 1} of {data.length} questions
          </div>

          {showOptions && <button onClick={handleNext}>Sonraki Soru</button>}
        </>
      )}

      {/* Quiz tamamlandığında sonuçları göster */}
      {!isQuizStarted && userAnswers.length > 0 && (
        <div className="results">
          <h2>Sonuçlar</h2>
          <p>Toplam Doğru: {correctAnswersCount}</p>
          <p>Toplam Yanlış: {userAnswers.length - correctAnswersCount}</p>
          {/* Yanlış Cevaplanan Sorular listesi kaldırıldı */}
        </div>
      )}
    </div>
  );
};

export default Quiz;
