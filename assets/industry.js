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
      <label><input type="radio" name="q${currentQuestion}" value="${i}">${opt}</label><br>
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
  const industry = document.getElementById("industry-select").value;
  const response = await fetch("/api/quizzes/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ industry, answers })
  });

  if (response.status === 401) {
    await refreshTokenAndRetry(submitQuiz);
    return;
  }

  const result = await response.json();
  console.log("Quiz submission result:", result); // Debug the response

  // Display both earned points and total points for clarity
  document.getElementById("result").innerHTML = `Points Earned: ${result.pointsToAward || result.points} - Total Points: ${result.points} - New Badges: ${result.newBadges?.join(", ") || "None"}`;

  // Refresh profile data to update points in the profile section
  await loadProfileData(token);
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

// Assuming loadProfileData is defined in profile.js and available globally
// If not, you’ll need to import or define it here, or trigger a profile refresh differently
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
      console.log("Profile data after quiz:", data); // Debug profile data
      // Update profile points in the UI (assuming these IDs exist in profile.html)
      document.getElementById("profile-points").textContent = data.points || 0;
      document.getElementById("profile-badges-count").textContent = data.badges ? data.badges.length : 0;
    } else if (response.status === 401) {
      const newToken = await refreshTokenAndRetry(() => loadProfileData(token));
      if (newToken) await loadProfileData(newToken);
    }
  } catch (error) {
    console.error("Error refreshing profile data:", error);
  }
}

document.getElementById("industry-select").addEventListener("change", loadQuestions);
window.onload = loadQuestions;

document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("submit-btn").addEventListener("click", submitQuiz);