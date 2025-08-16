
// =========================
// NAVIGATION & SCROLL BAR
// =========================

function handleScrollTo(sectionClass) {
    const section = document.querySelector('.' + sectionClass);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.getElementById('flashcards').addEventListener('click', function(e) {
    e.preventDefault();
    handleScrollTo('flashcards');
});
document.getElementById('finance').addEventListener('click', function(e) {
    e.preventDefault();
    handleScrollTo('finance-quiz');
});
document.getElementById('budget-journal').addEventListener('click', function(e) {
    e.preventDefault();
    handleScrollTo('budgeting-journal');
});
document.getElementById('budget-calculator').addEventListener('click', function(e) {
    e.preventDefault();
    handleScrollTo('budget-calculator');
});

document.getElementById('get-started').addEventListener('click', function(e){
    e.preventDefault();
    handleScrollTo('about')
});


// =========================
// HERO & ABOUT SECTION
// =========================
// (No specific JS logic needed for static hero/about sections)


// =========================
// FLASHCARDS SECTION
// =========================

let currentCardIndex = 0;
const flashcards = [
    { question: "Investment", answer: "When you put your money into something" },
    { question: "Stock", answer: "Small peice of ownership in company" },
    { question: "Budgeting", answer: "Plan for how you'll use your money" },
    { question: "Income", answer: "Money you earn" },
    { question: "Savings", answer: "Money set aside for future use" },
    { question: "Interest", answer: "Extra money you earn" },
    { question: "Expense", answer: "Money you spend" }
];

document.getElementById('flip-card-btn').addEventListener('click', function() {
    document.getElementById('myFlashcard').classList.toggle('flipped');
});

document.getElementById('next-card-btn').addEventListener('click', function() {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    const card = flashcards[currentCardIndex];
    document.querySelector('.front').textContent = card.question;
    document.querySelector('.back').textContent = card.answer;
    document.getElementById('myFlashcard').classList.remove('flipped');
});

// Initial load
(function() {
    const card = flashcards[currentCardIndex];
    document.querySelector('.front').textContent = card.question;
    document.querySelector('.back').textContent = card.answer;
})();


// =========================
// FINANCE QUIZ SECTION
// =========================

const questionBank = [
    {
        question: 'What is a budget?',
        options: ['A plan for spending', 'A type of investment', 'A loan', 'A tax'],
        answer: 'A plan for spending'
    },
    {
        question: 'What does APR stand for?',
        options: ['Annual Percentage Rate', 'Annual Payment Return', 'Applied Personal Rate', 'Average Percentage Ratio'],
        answer: 'Annual Percentage Rate'
    },
    {
        question: 'Which is a fixed expense?',
        options: ['Rent', 'Groceries', 'Utilities', 'Entertainment'],
        answer: 'Rent'
    },
    {
        question: 'What is an emergency fund?',
        options: ['Money for vacations', 'Money for unexpected expenses', 'Money for shopping', 'Money for investments'],
        answer: 'Money for unexpected expenses'
    },
    {
        question: 'What is a credit score?',
        options: ['A measure of your income', 'A measure of your creditworthiness', 'A type of loan', 'A tax rate'],
        answer: 'A measure of your creditworthiness'
    },
    {
        question: 'Which is a variable expense?',
        options: ['Rent', 'Car payment', 'Groceries', 'Insurance'],
        answer: 'Groceries'
    }
    // Add more questions as needed
];

const quizForm = document.querySelector('.finance-quiz');
const quizList = quizForm.querySelector('.quiz');
const resultSpan = document.getElementById('myresults');
let currentQuestions = [];

function getRandomQuestions(num) {
    const shuffled = questionBank.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function renderQuiz() {
    currentQuestions = getRandomQuestions(3);
    quizList.innerHTML = '';
    resultSpan.textContent = 'My results will appear here';
    const restartBtn = document.getElementById('restart-quiz');
    if (restartBtn) restartBtn.remove();
    currentQuestions.forEach((q, i) => {
        const li = document.createElement('li');
        const h4 = document.createElement('h4');
        h4.textContent = q.question;
        li.appendChild(h4);
        const ul = document.createElement('ul');
        ul.className = 'choices';
        q.options.forEach((opt, j) => {
            const optLi = document.createElement('li');
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'question' + i;
            input.value = opt;
            label.appendChild(input);
            const span = document.createElement('span');
            span.textContent = opt;
            label.appendChild(span);
            optLi.appendChild(label);
            ul.appendChild(optLi);
        });
        li.appendChild(ul);
        quizList.appendChild(li);
    });
}

function returnScore() {
    let score = 0;
    currentQuestions.forEach((q, i) => {
        const radios = document.getElementsByName('question' + i);
        let selected = '';
        for (const radio of radios) {
            if (radio.checked) {
                selected = radio.value;
                break;
            }
        }
        if (selected === q.answer) {
            score++;
        }
    });
    resultSpan.textContent = `You scored ${score} out of ${currentQuestions.length}!`;
    showRestartButton();
    return false;
}

function showRestartButton() {
    let btn = document.getElementById('restart-quiz');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'restart-quiz';
        btn.textContent = 'Restart Quiz';
        btn.type = 'button';
        btn.style.marginLeft = '10px';
        btn.onclick = function() {
            renderQuiz();
        };
        resultSpan.insertAdjacentElement('afterend', btn);
    }
}

quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
});
window.returnScore = returnScore;
renderQuiz();


// =========================
// BUDGETING JOURNAL & CALCULATOR SECTION
// =========================

const entryTextarea = document.getElementById('journal-textarea');
const saveBtn = document.getElementById('save-journal-btn');
const entriesList = document.getElementById('journal-entries');
const clearBtn = document.getElementById('clear-journal-btn');

function getJournalEntries() {
    const entries = localStorage.getItem('budgetJournalEntries');
    return entries ? JSON.parse(entries) : [];
}

function saveJournalEntry(entryText) {
    const entries = getJournalEntries();
    const newEntry = {
        date: new Date().toLocaleString(),
        entry: entryText
    };
    entries.unshift(newEntry); // newest first
    localStorage.setItem('budgetJournalEntries', JSON.stringify(entries));
}

function renderJournalEntries() {
    const entries = getJournalEntries();
    entriesList.innerHTML = '';
    if (entries.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No entries yet.';
        entriesList.appendChild(li);
        return;
    }
    entries.forEach(e => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${e.date}:</strong> ${e.entry}`;
        entriesList.appendChild(li);
    });
}

saveBtn.addEventListener('click', function() {
    const text = entryTextarea.value.trim();
    if (!text) return;
    saveJournalEntry(text);
    entryTextarea.value = '';
    renderJournalEntries();
});

clearBtn.addEventListener('click', function() {
    localStorage.removeItem('budgetJournalEntries');
    renderJournalEntries();
});

// Render entries on page load
renderJournalEntries();

//budgeting calculator
document.getElementById('expForm').addEventListener('submit', addTransaction);
// initial array of transactions, reading from localStorage
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const clearCalculatorBtn = document.getElementById('clear-caluclator-btn');
const confirmGoalBtn = document.getElementById('confirm')

let currentGoal = null;
let goalMet = false;

function metGoalCheck() {
    const balance = Number(document.querySelector('.balance').textContent);
    // Remove any previous message
    let msg = document.getElementById('goal-message');
    if (msg) msg.remove();
    if (currentGoal === null) return;
    if (balance >= currentGoal) {
        if (!goalMet) {
            showGoalMessage('🎉 Congratulations! You met your budgeting goal! 🎉', true);
            launchConfetti();
            goalMet = true;
        }
    }
}

function showGoalMessage(message, success) {
    let msg = document.createElement('div');
    msg.id = 'goal-message';
    msg.textContent = message;
    msg.style.margin = '10px 0';
    msg.style.fontWeight = 'bold';
    msg.style.fontSize = '1.2em';
    msg.style.textAlign = 'center';
    msg.style.color = success ? 'green' : 'red';
    // Insert after the confirm button
    const confirmBtn = document.getElementById('confirm');
    confirmBtn.parentNode.insertBefore(msg, confirmBtn.nextSibling);
}

// Simple confetti effect
function launchConfetti() {
    // Remove any previous confetti
    const old = document.getElementById('confetti-canvas');
    if (old) old.remove();
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const confetti = [];
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];
    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: 6 + Math.random() * 6,
            d: 2 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5
        });
    }
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.r, c.r/2, c.tilt, 0, 2 * Math.PI);
            ctx.fillStyle = c.color;
            ctx.fill();
        });
        update();
        frame++;
        if (frame < 120) {
            requestAnimationFrame(draw);
        } else {
            canvas.remove();
        }
    }
    function update() {
        confetti.forEach(c => {
            c.y += c.d;
            c.x += Math.sin(frame/10 + c.tilt);
            if (c.y > canvas.height) {
                c.y = Math.random() * -20;
                c.x = Math.random() * canvas.width;
            }
        });
    }
    draw();
}

function addTransaction(e) {
    e.preventDefault();
    // get type, name, and amount
    let type = document.getElementById('type').value;
    let name = document.getElementById('name').value;
    let amount = document.getElementById('amount').value;
    if (type != 'chooseOne'
      && name.length > 0
      && amount > 0) {
      const transaction = {
        type,
        name,
        amount,
        id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
      }
      transactions.push(transaction);
      // localStorage 
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    document.getElementById('expForm').reset();
    showTransactions();
    updateBalance();
    metGoalCheck();
  }
  const showTransactions = () => {
    const transactionTable = document.getElementById('transactionTable');
    transactionTable.innerHTML = '';
    for (let i = 0; i < transactions.length; i++) {
      transactionTable.innerHTML += `
            <tr>
                <td>${transactions[i].type}</td>
                <td>${transactions[i].name}</td>
                <td>$${transactions[i].amount}</td>
                <td><a class="deleteButton" onclick="deleteTransaction(${transactions[i].id})">
                    Delete</td>
            </tr>
        `;
    }
  }

  const deleteTransaction = (id) => {
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].id == id) {
        transactions.splice(i, 1);
      }
    }
    // localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    showTransactions();
    updateBalance();
    metGoalCheck();
  }

  const updateBalance = () => {
    let balance = 0;
    let income = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        balance += Number(transaction.amount);
        income += Number(transaction.amount)
      } else if (transaction.type === "expense") {
        balance -= transaction.amount;
      }
    });
    document.querySelector(".balance").textContent = balance;
    document.querySelector(".income").textContent = income;
  }

  clearCalculatorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    transactions.length = 0; // clear the array in-place
    localStorage.removeItem('transactions');
    showTransactions();
    document.querySelector('.balance').textContent = 0;
    document.querySelector('.income').textContent = 0;
});

confirmGoalBtn.addEventListener('click', () => {
    const goalInput = document.getElementById('confirm-box');
    const goal = Number(goalInput.value);
    if (!goal || isNaN(goal)) {
        showGoalMessage('Please enter a valid goal amount.', false);
        currentGoal = null;
        goalMet = false;
        return;
    }
    currentGoal = goal;
    goalMet = false;
    let msg = document.getElementById('goal-message');
    if (msg) msg.remove();
    showGoalMessage('Goal set! Add transactions to reach your goal.', false);
});

// Patch addTransaction to check goal after updating balance
const originalAddTransaction = addTransaction;
addTransaction = function(e) {
    originalAddTransaction.call(this, e);
    metGoalCheck();
}






