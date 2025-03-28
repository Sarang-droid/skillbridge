let currentQuestion = 0;
let answers = [];
let questions = [];

async function loadQuestions() {
  const industry = document.getElementById("industry-select").value;
  const token = localStorage.getItem("accessToken");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const response = await fetch(`/api/quizzes/${industry}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (response.status === 401) {
    await refreshTokenAndRetry(loadQuestions);
    return;
  }
  questions = await response.json();
  displayQuestion();
}

function displayQuestion() {
  if (currentQuestion >= questions.length) return;
  const q = questions[currentQuestion];
  document.getElementById("question-container").innerHTML = `
    <p>${q.question}</p>
    ${q.options.map((opt, i) => `
      <input type="radio" name="q${currentQuestion}" value="${i}">${opt}<br>
    `).join("")}
  `;
}

function nextQuestion() {
  const selected = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
  if (selected) answers[currentQuestion] = parseInt(selected.value);
  currentQuestion++;
  if (currentQuestion < questions.length) displayQuestion();
  else document.getElementById("question-container").innerHTML = "Quiz Complete!";
}

async function submitQuiz() {
  const token = localStorage.getItem("accessToken");
  const response = await fetch("/api/quizzes/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ industry: document.getElementById("industry-select").value, answers })
  });
  if (response.status === 401) {
    await refreshTokenAndRetry(submitQuiz);
    return;
  }
  const result = await response.json();
  document.getElementById("result").innerHTML = `Points: ${result.points} - New Badges: ${result.newBadges?.join(", ") || "None"}`;
}

async function refreshTokenAndRetry(callback) {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await fetch("/api/auth/refreshToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("accessToken", data.token);
    callback();
  } else {
    window.location.href = "/login";
  }
}

document.getElementById("industry-select").addEventListener("change", loadQuestions);
window.onload = loadQuestions;

// Add event listeners for buttons
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("submit-btn").addEventListener("click", submitQuiz);