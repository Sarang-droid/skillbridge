// Get the JWT token from localStorage
const token = localStorage.getItem('mbtiToken');

// DOM Elements
const mbtiTypeElement = document.getElementById('mbtiType');
const descriptionElement = document.getElementById('description');
const psychologicalScoreElement = document.getElementById('psychologicalScore');
const strengthsListElement = document.getElementById('strengthsList');
const weaknessesListElement = document.getElementById('weaknessesList');
const famousPersonalitiesListElement = document.getElementById('famousPersonalitiesList');
const keywordElement = document.getElementById('keyword');
const coreDesireElement = document.getElementById('coreDesire');
const hiddenFearElement = document.getElementById('hiddenFear');
const coreMotivationsElement = document.getElementById('coreMotivations');
const communicationStyleElement = document.getElementById('communicationStyle');
const learningStyleElement = document.getElementById('learningStyle');
const conflictStyleElement = document.getElementById('conflictStyle');
const innovationVsStabilityElement = document.getElementById('innovationVsStability');
const workplaceRoleElement = document.getElementById('workplaceRole');
const bestCollaborationMatchElement = document.getElementById('bestCollaborationMatch');
const bestIndustriesListElement = document.getElementById('bestIndustriesList');
const stressTriggersListElement = document.getElementById('stressTriggersList');
const projectListElement = document.getElementById('projectList');
const selfImprovementTipElement = document.getElementById('selfImprovementTip');
const shareButton = document.getElementById('shareButton');

// Fetch MBTI Results
async function fetchResults() {
  try {
    const response = await fetch(`/api/mbti/result/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch results');
    }

    const data = await response.json();
    console.log('Fetched Data:', data);

    // Display Results
    mbtiTypeElement.textContent = data.type || 'N/A';
    descriptionElement.textContent = data.personalityDetails?.description || 'No description available';
    psychologicalScoreElement.textContent = data.psychologicalScore || 'N/A';
    strengthsListElement.innerHTML = data.personalityDetails?.strengths?.map(strength => `<li>${strength}</li>`).join('') || '<li>No strengths available</li>';
    weaknessesListElement.innerHTML = data.personalityDetails?.weaknesses?.map(weakness => `<li>${weakness}</li>`).join('') || '<li>No weaknesses available</li>';
    famousPersonalitiesListElement.innerHTML = data.personalityDetails?.famousPersonalities?.map(person => `<li>${person}</li>`).join('') || '<li>No famous personalities available</li>';

    // Display Personality Details
    keywordElement.textContent = data.personalityDetails?.keyword || 'N/A';
    coreDesireElement.textContent = data.personalityDetails?.coreDesire || 'N/A';
    hiddenFearElement.textContent = data.personalityDetails?.hiddenFear || 'N/A';
    coreMotivationsElement.textContent = data.personalityDetails?.coreMotivations || 'N/A';
    communicationStyleElement.textContent = data.personalityDetails?.communicationStyle || 'N/A';
    learningStyleElement.textContent = data.personalityDetails?.learningStyle || 'N/A';
    conflictStyleElement.textContent = data.personalityDetails?.conflictStyle || 'N/A';
    innovationVsStabilityElement.textContent = data.personalityDetails?.innovationVsStability || 'N/A';

    // Work & Collaboration
    workplaceRoleElement.textContent = data.personalityDetails?.workplaceRole || 'N/A';
    bestCollaborationMatchElement.textContent = data.personalityDetails?.bestCollaborationMatch || 'N/A';
    bestIndustriesListElement.innerHTML = '<strong>Best Industries:</strong>' + (data.personalityDetails?.bestIndustries?.map(industry => `<li>${industry}</li>`).join('') || '<li>No industries available</li>');
    stressTriggersListElement.innerHTML = '<strong>Stress Triggers:</strong>' + (data.personalityDetails?.stressTriggers?.map(trigger => `<li>${trigger}</li>`).join('') || '<li>No triggers available</li>');

    // Projects and Self-Improvement
    projectListElement.innerHTML = Array.isArray(data.projectNames) ? data.projectNames.map(project => `<li>${project}</li>`).join('') : '<li>No projects available</li>';
    selfImprovementTipElement.textContent = data.personalityDetails?.selfImprovementTip || 'N/A';

  } catch (error) {
    console.error('Error fetching results:', error);
    mbtiTypeElement.textContent = 'Error loading results. Please try again.';
  }
}

// Share Results
shareButton.addEventListener('click', () => {
  const results = `My MBTI Type: ${mbtiTypeElement.textContent}\n` +
    `Description: ${descriptionElement.textContent}\n` +
    `Psychological Score: ${psychologicalScoreElement.textContent}\n` +
    `Keyword: ${keywordElement.textContent}\n` +
    `Core Desire: ${coreDesireElement.textContent}\n` +
    `Hidden Fear: ${hiddenFearElement.textContent}\n` +
    `Core Motivations: ${coreMotivationsElement.textContent}\n` +
    `Communication Style: ${communicationStyleElement.textContent}\n` +
    `Learning Style: ${learningStyleElement.textContent}\n` +
    `Conflict Style: ${conflictStyleElement.textContent}\n` +
    `Innovation vs Stability: ${innovationVsStabilityElement.textContent}\n` +
    `Workplace Role: ${workplaceRoleElement.textContent}\n` +
    `Best Collaboration Match: ${bestCollaborationMatchElement.textContent}\n` +
    `Best Industries:\n${Array.from(bestIndustriesListElement.children).map(li => li.textContent).join('\n')}\n` +
    `Stress Triggers:\n${Array.from(stressTriggersListElement.children).map(li => li.textContent).join('\n')}\n` +
    `Strengths:\n${Array.from(strengthsListElement.children).map(li => li.textContent).join('\n')}\n` +
    `Weaknesses:\n${Array.from(weaknessesListElement.children).map(li => li.textContent).join('\n')}\n` +
    `Famous Personalities:\n${Array.from(famousPersonalitiesListElement.children).map(li => li.textContent).join('\n')}\n` +
    `Recommended Projects:\n${Array.from(projectListElement.children).map(li => li.textContent).join('\n')}\n` +
    `Self-Improvement Tip: ${selfImprovementTipElement.textContent}`;
  navigator.clipboard.writeText(results)
    .then(() => alert('Results copied to clipboard!'))
    .catch(() => alert('Failed to copy results.'));
});

// Initialize
fetchResults();