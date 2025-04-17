let currentQuestion = 0;
let answers = [];
let questions = [];
let currentIndustry = 'edtech';

// DOM elements
const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const resultDiv = document.getElementById("result");
const questionCounter = document.getElementById("question-counter");
const progressBar = document.getElementById("progress-bar");
const categoryButtons = document.querySelectorAll(".category-btn");

// Event listeners for category buttons
categoryButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    // Remove active class from all buttons
    categoryButtons.forEach(b => b.classList.remove("active"));
    // Add active class to clicked button
    this.classList.add("active");
    // Set current industry
    currentIndustry = this.dataset.industry;
    // Reset quiz for new industry
    resetQuiz();
    // Load questions for selected industry
    loadQuestions();
  });
});

async function loadQuestions() {
  const token = localStorage.getItem("accessToken");
  console.log("Loading questions for industry:", currentIndustry);
  console.log("Access token:", token ? "Present" : "Missing");
  
  if (!token) {
    window.location.href = "/login";
    return;
  }
  
  try {
    console.log("Fetching questions from API...");
    const response = await fetch(`/api/quizzes/${currentIndustry}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    console.log("API Response status:", response.status);
    
    if (response.status === 401) {
      await refreshTokenAndRetry(loadQuestions);
      return;
    }
    
    questions = await response.json();
    console.log("Questions loaded:", questions);
    
    if (questions.length > 0) {
      displayQuestion();
      updateProgress();
    } else {
      questionContainer.innerHTML = `<p>No questions available for ${currentIndustry} at the moment. Please try another category.</p>`;
    }
  } catch (error) {
    console.error("Error loading questions:", error);
    questionContainer.innerHTML = `<p>Error loading questions. Please try again later.</p>`;
  }
}

function displayQuestion() {
  if (currentQuestion >= questions.length) return;
  const q = questions[currentQuestion];
  
  questionContainer.innerHTML = `
    <p>${q.question}</p>
    ${q.options.map((opt, i) => `
      <label>
        <input type="radio" name="q${currentQuestion}" value="${i}">
        ${opt}
      </label>
    `).join("")}
  `;
  
  // Add event listeners to radio buttons
  const radioButtons = document.querySelectorAll(`input[name="q${currentQuestion}"]`);
  radioButtons.forEach(radio => {
    radio.addEventListener("change", function() {
      nextBtn.disabled = false;
      if (currentQuestion === questions.length - 1) {
        submitBtn.disabled = false;
      }
    });
  });
  
  updateProgress();
}

function nextQuestion() {
  const selected = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
  if (selected) answers[currentQuestion] = parseInt(selected.value);
  
  currentQuestion++;
  nextBtn.disabled = true;
  
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    questionContainer.innerHTML = "<p>Quiz Complete! Ready to submit?</p>";
    submitBtn.disabled = false;
  }
  
  updateProgress();
}

function updateProgress() {
  if (questions.length > 0) {
    const progress = ((currentQuestion) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  }
}

async function submitQuiz() {
  // Get the selected answer for the last question if not already stored
  if (answers.length === questions.length - 1) {
    const selected = document.querySelector(`input[name="q${currentQuestion - 1}"]:checked`);
    if (selected) answers.push(parseInt(selected.value));
  }
  
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch("/api/quizzes/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        industry: currentIndustry, 
        answers 
      })
    });

    if (response.status === 401) {
      await refreshTokenAndRetry(submitQuiz);
      return;
    }

    const result = await response.json();
    showResult(result);
    
    // Refresh profile data
    await loadProfileData(token);
  } catch (error) {
    console.error("Error submitting quiz:", error);
    showResult({ 
      error: true,
      message: "Error submitting quiz. Please try again later."
    });
  }
}

function showResult(result) {
  if (result.error) {
    resultDiv.className = "result-error";
    resultDiv.innerHTML = `
      <div class="result-title">Oops!</div>
      <div class="result-message">${result.message}</div>
    `;
  } else {
    resultDiv.className = "result-success";
    resultDiv.innerHTML = `
      <div class="result-title">Congratulations!</div>
      <div class="result-message">You've completed the ${currentIndustry} quiz</div>
      <div class="result-points">+${result.pointsToAward || result.points} Points</div>
      <div class="result-message">Keep up the great work!</div>
    `;
    
    if (result.newBadges && result.newBadges.length > 0) {
      const badgesHtml = `
        <div style="margin-top: 1rem;">
          <div>New Badges Earned:</div>
          <div class="badges-container">
            ${result.newBadges.map(badge => `
              <div class="badge">
                <i class="fas fa-medal"></i> ${badge}
              </div>
            `).join("")}
          </div>
        </div>
      `;
      resultDiv.innerHTML += badgesHtml;
    }
    
    createConfetti();
  }
  
  resultDiv.style.display = "block";
}

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    resultDiv.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

function getRandomColor() {
  const colors = [
    "#FFC107", "#FF5722", "#E91E63", 
    "#9C27B0", "#673AB7", "#3F51B5",
    "#2196F3", "#03A9F4", "#00BCD4",
    "#009688", "#4CAF50", "#8BC34A",
    "#CDDC39", "#FFEB3B", "#FF9800"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function resetQuiz() {
  currentQuestion = 0;
  answers = [];
  nextBtn.disabled = true;
  submitBtn.disabled = true;
  resultDiv.style.display = "none";
  questionCounter.textContent = "";
  progressBar.style.width = "0%";
}

async function refreshTokenAndRetry(callback) {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
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
  } catch (error) {
    console.error("Error refreshing token:", error);
    window.location.href = "/login";
  }
}

async function loadProfileData(token) {
  try {
    const response = await fetch("https://skillexa.in/api/profile/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("Profile data after quiz:", data);
      // Update profile points in the UI
      if (document.getElementById("profile-points")) {
        document.getElementById("profile-points").textContent = data.points || 0;
      }
      if (document.getElementById("profile-badges-count")) {
        document.getElementById("profile-badges-count").textContent = data.badges ? data.badges.length : 0;
      }
    } else if (response.status === 401) {
      await refreshTokenAndRetry(() => loadProfileData(token));
    }
  } catch (error) {
    console.error("Error refreshing profile data:", error);
  }
}

// Initialize event listeners
nextBtn.addEventListener("click", nextQuestion);
submitBtn.addEventListener("click", submitQuiz);

// Load questions for default category (EdTech)
window.addEventListener("DOMContentLoaded", () => {
  loadQuestions();
});