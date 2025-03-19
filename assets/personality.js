const questions = [
    // Section 1: Mind (Introvert vs Extrovert)
    {
        section: "Section 1: Mind (Introvert vs Extrovert)",
        question: " 1 .You're walking alone in a park and spot a friendly dog wagging its tail at you. What is your instinctive reaction?",
        options: [
            "Approach the dog, try to pet it, maybe even chat with the owner.",
            "Smile from a distance, appreciate the moment, but continue walking."
        ]
    },
    {
        question: "2. You're at a small house party with a group of close friends. What would you prefer to do?",
        options: [
            "Be the one starting the games and conversations, making sure everyone is having fun.",
            "Sit in a comfortable corner with 2-3 people and have deep conversations."
        ]
    },
    {
        question: " 3. You're at a cafe waiting for your order. There's someone sitting nearby reading a book you're interested in. What would you do?",
        options: [
            "Strike up a conversation about the book.",
            "Notice the book but enjoy your own time without interrupting."
        ]
    },
  
    // Section 2: Energy (Intuitive vs Observant)
    {
        section: "Section 2: Energy (Intuitive vs Observant)",
        question: " 4. You're stuck in heavy rain without an umbrella. What's your first thought?",
        options: [
            "This will be an interesting story to tell later. Maybe I should enjoy the moment.",
            "I need to find shelter or call someone to pick me up."
        ]
    },
    {
        question: "5.You're watching a movie with a complicated plot. What makes you enjoy it more?",
        options: [
            "The hidden meanings and symbolism behind the story.",
            "The storyline, characters, and how everything fits logically."
        ]
    },
    {
        question: "6.If I give you a random word — 'Wanderlust' — what comes to your mind first?",
        options: [
            "The feeling of exploring unknown places and writing your own story.",
            "Planning the perfect trip with a list of things to see and do."
        ]
    },
  
    // Section 3: Nature (Thinking vs Feeling)
    {
        section: "Section 3: Nature (Thinking vs Feeling)",
        question: "7.You're watching a movie where one character makes a terrible decision that causes a disaster. What's your first reaction?",
        options: [
            "Why would they do something so stupid? They should have thought this through better.",
            "I feel bad for them... they must have been under a lot of pressure."
        ]
    },
    {
        question: "8.Your friend is asking for advice on quitting their job to start something on their own. What would your advice sound like?",
        options: [
            "List out the pros and cons and guide them on practical next steps.",
            "Ask them how they feel about it and whether it makes them happy."
        ]
    },
    {
        question: "9.A teammate isn't performing well on a group project. How do you naturally react?",
        options: [
            "Suggest ways they can improve their work directly.",
            "Try to understand what's holding them back emotionally before offering help."
        ]
    },
  
    // Section 4: Tactics (Judging vs Prospecting)
    {
        section: "Section 4: Tactics (Judging vs Prospecting)",
        question: "10.You're traveling to a new city for the first time. How would you explore the city?",
        options: [
            "Plan the whole itinerary in advance with fixed places to visit.",
            "Just explore freely without any fixed plan, letting each day unfold naturally."
        ]
    },
    {
        question: "11.You've got 10 days to finish an important project. How do you approach it?",
        options: [
            "Break the project down into small tasks and finish each day by crossing off items from your to-do list.",
            "Work in bursts of inspiration, sometimes procrastinating but delivering everything at the last moment."
        ]
    },
    {
        question: "12.You're asked to organize a surprise party for your best friend. How would you handle it?",
        options: [
            "Create a checklist, assign responsibilities, and plan every detail in advance.",
            "Make a rough plan but let things flow naturally, trusting everything will fall into place."
        ]
    },
  
    // Section 5: Identity (Assertive vs Turbulent)
    {
        section: "Section 5: Identity (Assertive vs Turbulent)",
        question: "13.Your friend challenges you to climb a mountain without preparation. What would your first thought be?",
        options: [
            "Hell yes! I'm confident I can figure it out on the way.",
            "Wait... shouldn't we at least plan or practice first?"
        ]
    },
    {
        question: "14.You're preparing for a big presentation tomorrow. How do you feel the night before?",
        options: [
            "Excited, confident that everything will go well.",
            "Nervous, constantly thinking if there's anything you've missed."
        ]
    },
    {
        question: "15.You're in a debate with someone who strongly disagrees with you. What do you feel deep down?",
        options: [
            "It's just a discussion — I don't take it personally.",
            "I need to convince them or it will feel like I've lost."
        ]
    },
  
    // Final Question (Viral Psychological Twist)
    {
        section: "Final Question (Viral Psychological Twist)",
        question: "16.If you were an animal in your next life, which one would you choose and why?",
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
  
  // Render Questions
  function renderQuestions() {
    slider.innerHTML = questions.map((q, index) => {
        // Skip rendering if options are missing or empty
        if (!q.options || q.options.length === 0) {
            console.warn(`Question ${index + 1} has no options. Skipping...`);
            return '';
        }
  
        return `
        <div class="slide">
            ${q.section ? `<h3 class="section-title">${q.section}</h3>` : ''}
            <div class="question">${q.question}</div>
            ${q.options.map((option, i) => `
                <label class="option">
                    <input type="radio" name="q${index}" value="${i}">
                    <span class="option-text">${option}</span>
                </label>
            `).join('')}
        </div>
        `;
    }).join('');
  
    // Initialize the first slide as active
    goToSlide(0);
  }
  
  // Update Progress Bar
  function updateProgress() {
    const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
    progress.style.width = `${progressPercent}%`;
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
    nextBtn.disabled = index === totalSlides - 1;
    submitBtn.classList.toggle('hidden', index !== totalSlides - 1);
  }
  
  // Save Answer
  function saveAnswer() {
    const selectedOption = document.querySelector(`input[name="q${currentSlide}"]:checked`);
    if (selectedOption) {
        answers[currentSlide] = parseInt(selectedOption.value);
        localStorage.setItem('mbtiAnswers', JSON.stringify(answers));
        nextBtn.disabled = false;
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
    const answers = JSON.parse(localStorage.getItem('mbtiAnswers')) || [];
    console.log('Answers before submission:', answers);// Debug log
    if (answers.length !== questions.length) {
      alert('Please complete all questions before submitting.');
      return;
    }
  
    try {
      const response = await makeAuthenticatedRequest('/api/mbti/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit MBTI test');
      }
  
      const data = await response.json();
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
