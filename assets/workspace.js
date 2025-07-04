document.addEventListener("DOMContentLoaded", function () {
    console.log('Token on workspace page:', localStorage.getItem('accessToken'));

    const timerElement = document.getElementById('countdown');
    const taskList = document.getElementById('task-list');
    const notesButton = document.getElementById('notes-button');
    const githubButton = document.getElementById('github-button');
    const qaButton = document.getElementById('qa-button');
    const resourcesButton = document.getElementById('resources-button');
    const submitButton = document.getElementById('submit-button');
    const submitGithubButton = document.getElementById('submit-github-link');
    const githubLinkInput = document.getElementById('github-link-input');
    const submissionResult = document.getElementById('submission-result');
    const questionInput = document.getElementById('question-input');
    const submitQuestionButton = document.getElementById('submit-question');

    // Fetch projectId and companyId from query string
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    const companyId = urlParams.get('companyId');

    console.log('Extracted Project ID:', projectId);
    console.log('Extracted Company ID:', companyId);

    // Initialize Quill Editor for Notes
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });

    // Load saved notes into the editor
    const savedNotes = localStorage.getItem(`notes_${projectId}`) || '';
    quill.root.innerHTML = savedNotes;

    // Auto-save notes every 5 seconds
    setInterval(() => {
        const notes = quill.root.innerHTML;
        if (notes !== localStorage.getItem(`notes_${projectId}`)) { // Only save if content changed
            localStorage.setItem(`notes_${projectId}`, notes);
            saveNotesToServer(projectId, notes).catch(error => {
                console.error('Error auto-saving notes:', error);
            });
        }
    }, 5000);

    // Fetch project details on load
    fetchProjectDetails(projectId);

    // Event Listeners for Section Navigation
    notesButton?.addEventListener('click', () => {
        showSection('notes-section');
    });

    githubButton?.addEventListener('click', () => {
        console.log('GitHub button clicked');
        showSection('github-section');
    });

    qaButton?.addEventListener('click', () => {
        showSection('qa-section');
        loadQandA(projectId);
    });

    resourcesButton?.addEventListener('click', () => {
        showSection('resources-section');
        loadResources(projectId);
    });

    submitButton?.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/workspace/project/${projectId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ forceSubmit: true })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Project submission failed');
            }

            const data = await response.json();
            alert('Project submitted successfully! Awaiting evaluation.');
            // Optionally redirect to another page or update UI
        } catch (error) {
            console.error('Error submitting project:', error);
            alert(error.message || 'An error occurred. Please try again.');
        }
    });

    // GitHub Link Submission
    submitGithubButton?.addEventListener('click', async () => {
        const githubLink = githubLinkInput.value.trim();
        if (!githubLink) {
            alert('Please enter a GitHub repository URL.');
            return;
        }

        const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
        if (!githubRegex.test(githubLink)) {
            alert('Invalid GitHub URL. Use format: https://github.com/username/repo');
            return;
        }

        submissionResult.innerHTML = 'Submitting your GitHub link...';
        try {
            const response = await fetch('/api/workspace/submit-github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ githubLink, projectId, companyId })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Submission failed: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            submissionResult.innerHTML = 'GitHub link submitted successfully! Awaiting analysis.';
            githubLinkInput.value = '';
        } catch (error) {
            console.error('Error submitting GitHub link:', error);
            submissionResult.innerHTML = 'Error submitting link. Please try again.';
        }
    });

    // Q&A Submission
    submitQuestionButton?.addEventListener('click', () => {
        const questionText = questionInput.value.trim();
        if (!questionText) {
            alert('Please enter a question');
            return;
        }
        submitQuestion(projectId, questionText);
        questionInput.value = '';
    });

    // Add error handling for task completion
    taskList.addEventListener('change', async (event) => {
        if (event.target.classList.contains('task-checkbox')) {
            const taskItem = event.target.closest('.task');
            const taskId = taskItem.dataset.taskId;
            
            try {
                const response = await fetch(`/api/workspace/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify({ completed: event.target.checked })
                });

                if (!response.ok) {
                    throw new Error('Failed to update task status');
                }

                const data = await response.json();
                console.log('Task updated successfully:', data);
            } catch (error) {
                console.error('Error updating task:', error);
                event.target.checked = !event.target.checked; // Revert checkbox state
                alert('Failed to update task status. Please try again.');
            }
        }
    });

    // Functions
    async function saveNotesToServer(projectId, notes) {
        try {
            const response = await fetch(`/api/workspace/project/${projectId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ notes })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save notes: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log('Notes saved:', data);
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    }

    async function fetchProjectDetails(projectId) {
        console.log('Fetching project details for Project ID:', projectId);
        try {
            const response = await fetch(`/api/workspace/project/${projectId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const project = await response.json();
            console.log('Fetched project:', project);
            renderProjectData(project);
            startCountdown(project.submissionDeadline);
            return project; // Return project data for validation
        } catch (error) {
            console.error('Error fetching project data:', error);
            alert('Failed to fetch project details. Please try again later.');
            return null;
        }
    }

    // New function for validation purposes
    async function fetchProjectDetailsForValidation(projectId) {
        const project = await fetchProjectDetails(projectId);
        return project || {};
    }

    // Check if GitHub link was submitted
    async function checkGithubLinkSubmitted(projectId) {
        try {
            const response = await fetch(`/api/workspace/submit-github/check?projectId=${projectId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!response.ok) return false;
            const data = await response.json();
            return data.submitted; // Assumes backend returns { submitted: true/false }
        } catch (error) {
            console.error('Error checking GitHub link submission:', error);
            return false; // Default to false if check fails
        }
    }

    // Check if all Q&A questions are answered
    async function checkUnansweredQuestions(projectId) {
        try {
            const response = await fetch(`/api/qa/${projectId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!response.ok) return true; // Assume unanswered if fetch fails
            const data = await response.json();
            return data.qa.some(qa => !qa.answer); // True if any question lacks an answer
        } catch (error) {
            console.error('Error checking Q&A:', error);
            return true; // Default to true (unanswered) if check fails
        }
    }

    function renderProjectData(project) {
        document.getElementById('project-title').innerText = `Project: ${project.title}`;
        document.getElementById('project-description').innerText = project.description || 'No description provided.';
        document.getElementById('project-status').innerText = `Status: ${project.status}`;

        taskList.innerHTML = '';
        if (project.tasks?.length) {
            project.tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task';
                taskItem.dataset.taskId = task.taskId; // Use taskId instead of _id

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.id = `task-${task.taskId}`;
                checkbox.className = 'task-checkbox';

                const label = document.createElement('label');
                label.htmlFor = `task-${task.taskId}`;
                label.textContent = task.taskName;

                taskItem.appendChild(checkbox);
                taskItem.appendChild(label);
                taskList.appendChild(taskItem);
            });
        } else {
            taskList.innerHTML = '<p>No tasks found.</p>';
        }
    }

    function startCountdown(deadline) {
        const countdown = setInterval(() => {
            const now = new Date();
            const timeRemaining = new Date(deadline) - now;

            if (timeRemaining <= 0) {
                clearInterval(countdown);
                timerElement.innerHTML = "Time's up!";
            } else {
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                timerElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }

    function showSection(sectionId) {
        const sections = ['notes-section', 'github-section', 'qa-section', 'resources-section'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = id === sectionId ? 'block' : 'none';
            else console.warn(`Element with ID '${id}' not found.`);
        });
    }

    async function markTaskComplete(taskId, completed) {
        try {
            const response = await fetch(`/api/workspace/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ completed })
            });
            const data = await response.json();
            console.log('Task updated:', data);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    async function loadQandA(projectId) {
        try {
            const response = await fetch(`/api/qa/${projectId}`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch Q&A');
            }
            
            const data = await response.json();
            const qaList = document.getElementById('qa-list');
            qaList.innerHTML = '';
            
            if (data.qa?.length) {
                data.qa.forEach(qa => {
                    const qaItem = document.createElement('div');
                    qaItem.className = 'qa-item';
                    qaItem.innerHTML = `
                        <div class="question">
                            <strong>Question:</strong> ${qa.question}
                            <div class="meta">Asked by: ${qa.userId ? qa.userId.name : 'Unknown User'}</div>
                        </div>
                        <div class="answer">
                            <strong>Answer:</strong> ${qa.answer || 'Pending...'}
                            ${qa.answeredAt ? `<div class="meta">Answered on: ${new Date(qa.answeredAt).toLocaleDateString()}</div>` : ''}
                        </div>
                        <div class="answer-input">
                            <textarea placeholder="Type your answer here..."></textarea>
                            <button class="submit-answer" data-question-id="${qa._id}">Submit Answer</button>
                        </div>
                    `;
                    qaList.appendChild(qaItem);
                });

                // Add event listeners for answer submission
                document.querySelectorAll('.submit-answer').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const questionId = event.target.dataset.questionId;
                        const answerText = event.target.previousElementSibling.value.trim();
                        if (!answerText) {
                            alert('Please enter an answer.');
                            return;
                        }
                        await submitAnswer(questionId, answerText);
                        loadQandA(projectId); // Reload Q&A after submission
                    });
                });
            } else {
                qaList.innerHTML = '<p>No questions found. Ask the first question!</p>';
            }
        } catch (error) {
            console.error('Error loading Q&A:', error);
            document.getElementById('qa-list').innerHTML = '<p>Failed to load Q&A. Please try again later.</p>';
        }
    }

    async function submitQuestion(projectId, questionText) {
        try {
            const response = await fetch('/api/qa/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    projectId,
                    question: questionText
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit question');
            }

            await loadQandA(projectId); // Reload Q&A after submission
            alert('Question submitted successfully!');
        } catch (error) {
            console.error('Error submitting question:', error);
            alert('Failed to submit question. Please try again.');
        }
    }

    async function loadResources(projectId) {
        try {
            const response = await fetch(`/api/workspace/project/${projectId}/resources`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const resources = await response.json();
            renderResources(resources);
        } catch (error) {
            console.error('Error fetching resources:', error);
            document.getElementById('resources-list').innerHTML = '<p>Failed to load resources.</p>';
        }
    }

    function renderResources(resources) {
        const resourcesList = document.getElementById('resources-list');
        resourcesList.innerHTML = '';
        if (resources && resources.length > 0) {
            resources.forEach(resource => {
                const resourceItem = document.createElement('div');
                resourceItem.className = 'resource-item';
                resourceItem.innerHTML = `
                    <p><strong>${resource.name}</strong></p>
                    <p><a href="${resource.url}" target="_blank">${resource.url}</a></p>
                    <p>${resource.description || 'No description provided.'}</p>
                `;
                resourcesList.appendChild(resourceItem);
            });
        } else {
            resourcesList.innerHTML = '<p>No resources available for this project.</p>';
        }
    }

    async function submitAnswer(questionId, answerText) {
        try {
            const response = await fetch(`/api/qa/${questionId}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ answer: answerText })
            });

            if (!response.ok) {
                throw new Error('Failed to submit answer');
            }

            const data = await response.json();
            console.log('Answer submitted successfully:', data);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer. Please try again.');
        }
    }

    // Finalize and Submit Project logic
    const finalSubmitButton = document.getElementById('final-submit-button');
    const forceSubmitCheckbox = document.getElementById('force-submit-checkbox');
    const submitWarning = document.getElementById('submit-warning');

    finalSubmitButton?.addEventListener('click', async () => {
        submitWarning.style.display = 'none';
        submitWarning.textContent = '';
        // Validate GitHub link and Q&A
        const [githubSubmitted, hasUnanswered] = await Promise.all([
            checkGithubLinkSubmitted(projectId),
            checkUnansweredQuestions(projectId)
        ]);
        let warningMsg = '';
        if (!githubSubmitted) warningMsg += 'You must submit your GitHub repository link. ';
        if (hasUnanswered) warningMsg += 'You must answer all the Q&A questions.';

        if ((warningMsg && !forceSubmitCheckbox.checked)) {
            submitWarning.textContent = warningMsg;
            submitWarning.style.display = 'block';
            return;
        }
        if (warningMsg && forceSubmitCheckbox.checked) {
            submitWarning.textContent = 'Warning: ' + warningMsg + ' You are submitting anyway.';
            submitWarning.style.display = 'block';
        }
        // Proceed with submission
        try {
            const response = await fetch(`/api/workspace/project/${projectId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ forceSubmit: forceSubmitCheckbox.checked })
            });
            if (!response.ok) {
                const errorData = await response.json();
                // Show specific error if missing GitHub link
                if (errorData.message && errorData.message.includes('GitHub repository link')) {
                    submitWarning.textContent = errorData.message;
                    submitWarning.style.display = 'block';
                    return;
                }
                throw new Error(errorData.message || 'Project submission failed');
            }
            const data = await response.json();
            // Show the required message after successful submission
            alert('Your project will be evaluated within 24 hours and points will be awarded to you on the basis of quality of your project. You will be notified.');
            // Optionally redirect or update UI
        } catch (error) {
            console.error('Error submitting project:', error);
            submitWarning.textContent = error.message || 'An error occurred. Please try again.';
            submitWarning.style.display = 'block';
        }
    });

    // Add styles for Q&A section
    const style = document.createElement('style');
    style.textContent = `
        .qa-item {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #4a4a4a;
            border-radius: 8px;
            border: 2px dashed #555;
        }
        .qa-item .question {
            margin-bottom: 10px;
        }
        .qa-item .answer {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #555;
        }
        .qa-item .meta {
            font-size: 0.8em;
            color: #b0b0b0;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
});