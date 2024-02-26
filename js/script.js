'use strict';

// The entire code will be refactored and split into modules in the future...

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

let correctAnswersCount = 0;

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggableElement = document.getElementById(data);
    const answerIndex = parseInt(draggableElement.id.split("-")[1]);
    const questionIndex = parseInt(ev.target.id);
    const correctAnswerIndex = technologies[questionIndex].correctAnswerIndex;

    const isCorrect = (answerIndex === correctAnswerIndex);

    // Check if the answer has already been moved
    if (!draggableElement.classList.contains('custom-style')) {
        if (ev.target.querySelector('.answer') === null) {
            ev.target.appendChild(draggableElement);
            draggableElement.classList.add('custom-style');
            if (isCorrect) {
                draggableElement.classList.add('correct');
                correctAnswersCount++;
            } else {
                draggableElement.classList.add('incorrect');
            }
        }
    }

    checkAllAnswers();
}

function checkAllAnswers() {
    const completeContainer = document.querySelector('#complete');
    const completeh1 = document.createElement('h1');
    if (correctAnswersCount === technologies.length) {
        completeh1.innerText = 'Thanks for playing, game is over!';
        completeContainer.classList.add('complete');
        completeContainer.appendChild(completeh1);
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'block';
        setTimeout(() => {
            completeContainer.classList.remove('complete');
            completeContainer.removeChild(completeh1);
            overlay.style.display = 'none';
        }, 4000);
    }
}

// Removing an answer when clicked
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('answer')) {
        const removedAnswer = event.target;
        removedAnswer.parentNode.removeChild(removedAnswer);
        removedAnswer.classList.remove('custom-style');
        if (removedAnswer.classList.contains('correct')) {
            correctAnswersCount--;
        }
        removedAnswer.classList.remove('correct', 'incorrect');
        const answersContainer = document.querySelector('.answers');
        answersContainer.appendChild(removedAnswer);
    }
});

// Array of technologies
const technologies = [
    {
        name: 'HTML',
        shortDescription: 'Web markup language',
        fullDescription: 'HTML (HyperText Markup Language) is a markup language used to create the structure and content of web pages.',
        correctAnswerIndex: 0
    },
    {
        name: 'CSS',
        shortDescription: 'Web stylesheet language',
        fullDescription: 'CSS (Cascading Style Sheets) is a stylesheet language used to style the appearance of web pages.',
        correctAnswerIndex: 1
    },
    {
        name: 'JavaScript',
        shortDescription: 'Website programming language',
        fullDescription: 'JavaScript is a programming language used to add interactivity to websites.',
        correctAnswerIndex: 2
    },
    {
        name: 'Git',
        shortDescription: 'Version control system',
        fullDescription: 'Git is a distributed version control system used to manage changes to a projects source code.',
        correctAnswerIndex: 3
    },
    {
        name: 'API',
        shortDescription: 'Interface for program-to-program communication',
        fullDescription: 'API (Application Programming Interface) is a set of tools and rules used by software developers to interact with other programs.',
        correctAnswerIndex: 4
    },
    {
        name: 'Node.js',
        shortDescription: 'JavaScript runtime environment for servers',
        fullDescription: 'Node.js is a JavaScript runtime environment that allows running JavaScript code on the server and performing input/output operations, working with files, etc.',
        correctAnswerIndex: 5
    }
];

// Reset button and randomizer
addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.querySelector('.resetButton');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    resetBtn.addEventListener('click', () => {
        shuffleArray(technologies);

        correctAnswersCount = 0;

        updateQuestionsAndAnswers(technologies);
    });

    function updateQuestionsAndAnswers(data) {
        questionsContainer.innerHTML = '';
        answersContainer.innerHTML = '';

        data.forEach((tech, index) => {
            tech.correctAnswerIndex = index;
        });

        generateQuestionsAndAnswers(data);
    }

    const questionsContainer = document.querySelector('.questions');
    const answersContainer = document.querySelector('.answers');

    // Function to generate questions and answers
    function generateQuestionsAndAnswers(data) {
        data.forEach((tech, index) => {
            // Create a question
            const question = document.createElement('div');
            question.classList.add('question');
            question.id = `${index}`;
            question.textContent = `${tech.shortDescription}`;

            // Create a symbol to display additional information
            const moreDetailsSymbol = document.createElement('span');
            moreDetailsSymbol.classList.add('more-details-symbol');
            moreDetailsSymbol.insertAdjacentHTML('beforeend', 'ℹ️');

            // Create an answer
            const answer = document.createElement('button');
            answer.classList.add('answer');
            answer.draggable = true;
            answer.id = `answer-${index}`;
            answer.textContent = tech.name;

            answer.addEventListener('dragstart', drag);

            questionsContainer.appendChild(question);
            question.appendChild(moreDetailsSymbol);
            answersContainer.appendChild(answer);

            // Add a click event listener to the symbol to display a modal window with detailed information
            moreDetailsSymbol.addEventListener('click', () => {
                const overlay = document.querySelector('.overlay');
                overlay.style.display = 'block';
                const modal = createModal(tech.fullDescription);
                document.body.appendChild(modal);
            });

        });
    }

    // Function to create a modal window
    function createModal(fullDescription) {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.textContent = '×';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '50px';

        // Add a click event listener to the button to close the modal window
        closeButton.addEventListener('click', () => {
            modal.remove();
            const overlay = document.querySelector('.overlay');
            overlay.style.display = 'none'; // Hide the overlay
        });

        const details = document.createElement('h2');
        details.textContent = fullDescription;

        modalContent.appendChild(closeButton);
        modalContent.appendChild(details);
        modal.appendChild(modalContent);

        return modal;
    }

    generateQuestionsAndAnswers(technologies);
});
