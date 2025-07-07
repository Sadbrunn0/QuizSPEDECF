// 🔧 Configure seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZ6sSIDgw_jIUAgUfuP0ebZYc48yNiDWk",
  authDomain: "quiz-sped-ecf.firebaseapp.com",
  projectId: "quiz-sped-ecf",
  storageBucket: "quiz-sped-ecf.firebasestorage.app",
  messagingSenderId: "222439306082",
  appId: "1:222439306082:web:406cc5a327a12ddb5a723b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let userId = null;
firebase.auth().signInAnonymously().then(user => {
  userId = user.user.uid;
});

// Perguntas
const questions = [
  {
    text: "Qual o prazo de entrega da ECF referente ao ano-calendário 2024?",
    options: ["31 de maio de 2025", "Último dia útil de abril", "31 de julho de 2025", "30 de junho de 2025"],
    answer: 2
  },
  {
    text: "Quando o registro Q100 é obrigatório no Lucro Presumido?",
    options: [
      "Quando tiver contabilidade regular",
      "Sempre, independentemente do faturamento",
      "Se a receita proporcional superar o limite e não houver ECD",
      "Somente no Lucro Real"
    ],
    answer: 2
  },
  {
    text: "Qual é a multa por atraso na entrega da ECF para empresas no Lucro Real?",
    options: [
      "0,25% por mês do lucro líquido, limitado a 10%",
      "3% do faturamento total",
      "R$ 100,00 fixos",
      "Multa diária de R$ 10,00"
    ],
    answer: 0
  },
  {
    text: "O que acontece se a empresa ultrapassar o limite de receita do MEI?",
    options: [
      "Continua como MEI normalmente",
      "Deve recolher impostos extras e pode ser desenquadrada",
      "Precisa abrir uma nova empresa",
      "Deixa de pagar INSS"
    ],
    answer: 1
  }
];


let current = 0;
let score = 0;

function showQuestion() {
  const container = document.getElementById('quiz-container');
  const q = questions[current];

  container.innerHTML = `<div class="question"><strong>${q.text}</strong></div>`;
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "option";
    btn.onclick = () => {
      if (i === q.answer) score++;
      current++;
      if (current < questions.length) {
        showQuestion();
      } else {
        finishQuiz();
      }
    };
    container.appendChild(btn);
  });
}

function finishQuiz() {
  document.getElementById('quiz-container').innerHTML = "";
  document.getElementById('result').innerText = `Você acertou ${score} de ${questions.length} perguntas!`;

  db.collection("respostas").add({ userId, score, timestamp: Date.now() });

  // Ranking
  db.collection("respostas").orderBy("score", "desc").limit(10).get().then(snapshot => {
    const list = document.getElementById("ranking-list");
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const item = document.createElement("li");
      item.textContent = `Usuário anônimo - ${doc.data().score} pontos`;
      list.appendChild(item);
    });
  });
}

showQuestion();
