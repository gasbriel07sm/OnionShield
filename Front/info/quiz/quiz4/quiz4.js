// ARQUIVO: quest4.js
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const questions = document.querySelectorAll('.question');
    const nextBtn = document.getElementById('next-btn');
    const timerSpan = document.querySelector('#timer-display span');

    let currentQuestionIndex = 0;
    let timer;
    const userAnswers = {};

    // Respostas corretas para o Questionário 4
    const correctAnswers = {
      q1: 'c',
      q2: 'b',
      q3: 'c',
      q4: 'b',
      q5: 'c',
      q6: 'c',
      q7: 'b',
      q8: 'b',
      q9: 'c',
      q10: 'a',
      q11: 'b',
      q12: 'c',
      q13: 'b',
      q14: 'c',
      q15: 'c',
    };

    function startTimer() {
        let timeLeft = 60;
        timerSpan.textContent = timeLeft;
        
        clearInterval(timer); // Limpa qualquer timer anterior

        timer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                goToNextQuestion();
            }
        }, 1000);
    }

    function showQuestion(index) {
        questions.forEach((question, i) => {
            question.classList.toggle('active', i === index);
        });

        // Atualiza o texto do botão
        if (index === questions.length - 1) {
            nextBtn.textContent = 'Finalizar Quiz';
        } else {
            nextBtn.textContent = 'Próxima Pergunta';
        }

        startTimer();
    }
    
    function goToNextQuestion() {
        // Salva a resposta da pergunta atual
        const currentQuestion = questions[currentQuestionIndex];
        const questionName = currentQuestion.querySelector('input[type="radio"]').name;
        const selectedAnswer = quizForm.querySelector(`input[name="${questionName}"]:checked`);
        userAnswers[questionName] = selectedAnswer ? selectedAnswer.value : null;

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        } else {
            // Fim do quiz
            clearInterval(timer);
            calculateScore();
        }
    }
    
    function calculateScore() {
        let score = 0;
        for (const question in correctAnswers) {
            if (userAnswers[question] === correctAnswers[question]) {
                score++;
            }
        }

        let result = '';
        if (score < 5) { result = 'Iniciante'; } 
        else if (score < 10) { result = 'Intermediário'; }
        else if (score < 15) { result = 'Avançado'; }
        else { result = 'Arrasou!'; }

        document.querySelector('.quiz-container').innerHTML = `
            <div class="quiz-header"><h1>Resultado Final</h1></div>
            <div class="quiz-result">
                <p>Você acertou <strong>${score}</strong> de 15 perguntas.</p>
                <p>Seu nível é: <strong>${result}</strong></p>
            </div>
        `;
    }

    // Adiciona evento ao botão "Próxima"
    nextBtn.addEventListener('click', goToNextQuestion);
    
    // Adiciona evento para destacar a resposta selecionada
    quizForm.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const labels = e.target.closest('.question').querySelectorAll('label');
            labels.forEach(label => label.classList.remove('selected'));
            e.target.parentElement.classList.add('selected');
        }
    });

    // Inicia o quiz
    showQuestion(0);
});