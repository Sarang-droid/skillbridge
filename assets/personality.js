  /*
   * Each graded question declares the `dimension` it measures and labels both poles.
   *  - `negative` = the answer that pushes the score toward the dimension's NEGATIVE pole
   *  - `positive` = the answer that pushes it toward the POSITIVE pole
   * The Likert scale runs left (strongly negative) -> right (strongly positive),
   * producing a signed value of -2..+2. This must stay in sync with the convention in
   * controllers/MBTIController.js:
   *    mind: I(+)/E(-)  energy: N(+)/S(-)  nature: F(+)/T(-)
   *    tactics: P(+)/J(-)  identity: T(+)/A(-)
   */
  const questions = [
    // Section 1: Mind — Introvert (+) vs Extrovert (-)
    {
        section: "Section 1: Mind — Introvert vs Extrovert",
        dimension: "mind",
        question: "1. You're walking alone in a park and spot a friendly dog wagging its tail at you. What's your instinctive reaction?",
        negative: "Approach the dog, pet it, maybe chat with the owner",
        positive: "Smile from a distance, enjoy the moment, keep walking"
    },
    {
        dimension: "mind",
        question: "2. You're at a small house party with a group of close friends. What would you prefer to do?",
        negative: "Start the games and conversations, keeping everyone entertained",
        positive: "Settle into a corner with 2-3 people for a deeper conversation"
    },
    {
        dimension: "mind",
        question: "3. You're at a cafe waiting for your order and notice someone reading a book you love. What do you do?",
        negative: "Strike up a conversation about the book",
        positive: "Notice it but happily enjoy your own time without interrupting"
    },

    // Section 2: Energy — Intuitive (+) vs Sensing/Observant (-)
    {
        section: "Section 2: Energy — Intuitive vs Observant",
        dimension: "energy",
        question: "4. You're stuck in heavy rain without an umbrella. What's your first thought?",
        negative: "I need to find shelter or call someone to pick me up",
        positive: "This'll make an interesting story — maybe I should enjoy the moment"
    },
    {
        dimension: "energy",
        question: "5. You're watching a movie with a complicated plot. What makes you enjoy it more?",
        negative: "The storyline, characters, and how everything fits together logically",
        positive: "The hidden meanings and symbolism behind the story"
    },
    {
        dimension: "energy",
        question: "6. I give you a random word — 'Wanderlust'. What comes to mind first?",
        negative: "Planning the perfect trip with a list of things to see and do",
        positive: "The feeling of exploring unknown places and writing your own story"
    },

    // Section 3: Nature — Feeling (+) vs Thinking (-)
    {
        section: "Section 3: Nature — Thinking vs Feeling",
        dimension: "nature",
        question: "7. In a movie, a character makes a terrible decision that causes a disaster. Your first reaction?",
        negative: "Why would they do something so reckless? They should've thought it through",
        positive: "I feel bad for them — they must have been under a lot of pressure"
    },
    {
        dimension: "nature",
        question: "8. A friend asks whether they should quit their job to start something of their own. Your advice sounds like?",
        negative: "Let's list the pros and cons and figure out the practical next steps",
        positive: "How do you feel about it? Would it genuinely make you happier?"
    },
    {
        dimension: "nature",
        question: "9. A teammate isn't performing well on a group project. How do you naturally react?",
        negative: "Suggest concrete ways they can improve their work directly",
        positive: "Try to understand what's holding them back emotionally first"
    },

    // Section 4: Tactics — Prospecting (+) vs Judging (-)
    {
        section: "Section 4: Tactics — Judging vs Prospecting",
        dimension: "tactics",
        question: "10. You're visiting a new city for the first time. How do you explore it?",
        negative: "Plan the whole itinerary in advance with fixed places to visit",
        positive: "Explore freely with no fixed plan, letting each day unfold"
    },
    {
        dimension: "tactics",
        question: "11. You've got 10 days to finish an important project. How do you approach it?",
        negative: "Break it into small tasks and cross items off a to-do list each day",
        positive: "Work in bursts of inspiration, delivering it all near the deadline"
    },
    {
        dimension: "tactics",
        question: "12. You're organizing a surprise party for your best friend. How do you handle it?",
        negative: "Create a checklist, assign roles, and plan every detail in advance",
        positive: "Make a rough plan and let things flow, trusting it'll come together"
    },

    // Section 5: Identity — Turbulent (+) vs Assertive (-)
    {
        section: "Section 5: Identity — Assertive vs Turbulent",
        dimension: "identity",
        question: "13. A friend dares you to climb a mountain without preparation. Your first thought?",
        negative: "Hell yes! I'm confident I can figure it out on the way",
        positive: "Wait... shouldn't we at least plan or practice first?"
    },
    {
        dimension: "identity",
        question: "14. It's the night before a big presentation. How do you feel?",
        negative: "Excited and confident that everything will go well",
        positive: "Nervous, constantly wondering if I've missed something"
    },
    {
        dimension: "identity",
        question: "15. You're in a debate with someone who strongly disagrees with you. Deep down you feel?",
        negative: "It's just a discussion — I don't take it personally",
        positive: "I need to convince them, or it'll feel like I've lost"
    },

    // Final Question (Viral Psychological Twist) — special multi-choice
    {
        section: "Final Question",
        dimension: "final",
        type: "choice",
        question: "16. If you were an animal in your next life, which would you choose and why?",
        options: [
            "Wolf – Independent, strategic, but loyal to the pack.",
            "Dolphin – Playful, intelligent, and thrives in social circles.",
            "Owl – Quiet, observant, wise.",
            "Tiger – Fearless, focused, always chasing the next big thing."
        ]
    }
  ];
  
  const slider = document.querySelector('.slider');
  const progress = document.querySelector('.progress');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
const userId = localStorage.getItem('userId'); // Fetch userId from localStorage
let currentSlide = 0;

  const totalSlides = questions.length;
  const answers = JSON.parse(localStorage.getItem('mbtiAnswers')) || [];
  
  // Render a 5-point Likert scale (values 0..4 -> signed -2..+2)
  function renderLikert(q, index) {
    // strength class + side, in display order from strongly-negative to strongly-positive
    const points = [
        { value: 0, cls: 's2 left' },
        { value: 1, cls: 's1 left' },
        { value: 2, cls: 's0' },
        { value: 3, cls: 's1 right' },
        { value: 4, cls: 's2 right' }
    ];
    return `
        <div class="likert">
            <div class="poles">
                <span class="pole-left">${q.negative}</span>
                <span class="pole-right">${q.positive}</span>
            </div>
            <div class="scale">
                ${points.map(p => `
                    <label class="dot ${p.cls}">
                        <input type="radio" name="q${index}" value="${p.value}">
                        <span class="bubble"></span>
                    </label>
                `).join('')}
            </div>
            <div class="scale-hint">
                <span>Strongly</span>
                <span>Neutral</span>
                <span>Strongly</span>
            </div>
        </div>
    `;
  }

  // Render the multi-choice final question
  function renderChoice(q, index) {
    return q.options.map((option, i) => `
        <label class="option">
            <input type="radio" name="q${index}" value="${i}">
            <span class="option-text">${option}</span>
        </label>
    `).join('');
  }

  // Render Questions
  function renderQuestions() {
    slider.innerHTML = questions.map((q, index) => {
        const body = q.type === 'choice' ? renderChoice(q, index) : renderLikert(q, index);
        return `
        <div class="slide">
            ${q.section ? `<h3 class="section-title">${q.section}</h3>` : ''}
            <div class="question">${q.question}</div>
            ${body}
        </div>
        `;
    }).join('');

    // Restore any previously saved selections
    answers.forEach((value, index) => {
        if (value === undefined || value === null) return;
        const input = document.querySelector(`input[name="q${index}"][value="${value}"]`);
        if (input) input.checked = true;
    });

    // Initialize the first slide as active
    goToSlide(0);
  }
  
  // Update Progress Bar
  function updateProgress() {
    const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
    progress.style.width = `${progressPercent}%`;
  }
  
  // Is the question on a given slide answered yet?
  function isAnswered(index) {
    return !!document.querySelector(`input[name="q${index}"]:checked`);
  }

  // Navigate to Slide
  function goToSlide(index) {
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    slider.scrollTo({ left: slider.clientWidth * index, behavior: 'smooth' });
    currentSlide = index;
    updateProgress();
    prevBtn.disabled = index === 0;
    // Block "Next" until the current question is answered
    nextBtn.disabled = index === totalSlides - 1 || !isAnswered(index);
    submitBtn.classList.toggle('hidden', index !== totalSlides - 1);
  }

  // Save Answer
  function saveAnswer() {
    const selectedOption = document.querySelector(`input[name="q${currentSlide}"]:checked`);
    if (selectedOption) {
        answers[currentSlide] = parseInt(selectedOption.value);
        localStorage.setItem('mbtiAnswers', JSON.stringify(answers));
        nextBtn.disabled = currentSlide === totalSlides - 1;
    } else {
        nextBtn.disabled = true;
    }
  }
  
  // Auto Next on Select
  slider.addEventListener('change', () => {
    saveAnswer();
    if (currentSlide < totalSlides - 1) {
        setTimeout(() => goToSlide(currentSlide + 1), 1000); // 1-second delay
    }
  });
  
  // Event Listeners
  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
  });
  
  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
  });
  
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Redirect to login page
      return null;
    }
  
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      localStorage.setItem('accessToken', data.token); // Save the new access token
      return data.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      alert('Your session has expired. Please log in again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login'; // Redirect to login page
      return null;
    }
  };
  
  // Function to make authenticated requests
  const makeAuthenticatedRequest = async (url, options) => {
    let accessToken = localStorage.getItem('accessToken');
  
    // Try the request with the current access token
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    // If the token is expired, refresh it and retry the request
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        return; // Redirect to login if refresh fails
      }
  
      // Retry the request with the new access token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }
  
    return response;
  };
  
  // Submit MBTI Test
  submitBtn.addEventListener('click', async () => {
    const savedAnswers = JSON.parse(localStorage.getItem('mbtiAnswers')) || [];
    console.log('Answers before submission:', savedAnswers);// Debug log

    // Every question (including the final choice) must be answered
    const allAnswered = questions.every((q, i) =>
        savedAnswers[i] !== undefined && savedAnswers[i] !== null
    );
    if (!allAnswered) {
      alert('Please complete all questions before submitting.');
      return;
    }

    // Build the graded payload. For Likert questions, map the 0..4 choice to a
    // signed intensity of -2..+2 (positive = toward the dimension's positive pole).
    const responses = [];
    let finalAnswer;
    questions.forEach((q, i) => {
      if (q.type === 'choice') {
        finalAnswer = savedAnswers[i];
      } else {
        responses.push({ dimension: q.dimension, value: savedAnswers[i] - 2 });
      }
    });

    try {
      const response = await makeAuthenticatedRequest('/mbti/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses, finalAnswer, userId }), // graded payload
        signal: AbortSignal.timeout(10000) // Add timeout to prevent hanging
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw err;
      });

      if (!response) {
        throw new Error('No response received from server');
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit MBTI test');
      }
      if (data.success) {
        alert('MBTI results submitted successfully!');
        localStorage.setItem('mbtiToken', data.token);
        window.location.href = '/result';
      } else {
        alert('Error submitting results: ' + data.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting results.');
    }
  });
  // Initialize
  renderQuestions();
