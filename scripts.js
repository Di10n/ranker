async function searchCategory(isSpicy = false) {
    // Disable inputs during search
    const categoryInput = document.getElementById('categoryInput');
    const categorySubmit = document.getElementById('categorySubmit');
    const spicyButton = document.getElementById('spicyButton');
    
    categoryInput.disabled = true;
    categorySubmit.disabled = true;
    spicyButton.disabled = true;

    const input = document.getElementById('categoryInput').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.className = 'results active';
    resultsContainer.dataset.category = input;

    const result = await getRankings(input, isSpicy);
    resultsList = result.split(',').map(item => item.trim());

    let resultsHTML = '';
    resultsList.forEach((item, index) => {
        resultsHTML += `
            <div class="result-item" onclick="toggleContent(${index})">
                <div class="result-header">
                    <span class="rank">#${index + 1}</span>
                    <span class="item-name">${item}</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="result-content" id="content-${index}">
                    Lorem ipsum dolor sit amet
                </div>
            </div>
        `;
    });
    resultsContainer.innerHTML = resultsHTML;

    // Re-enable inputs after search completes
    categoryInput.disabled = false;
    categorySubmit.disabled = false;
    spicyButton.disabled = false;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('categoryInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCategory();
        }
    });
});

async function getRankings(promptText, isSpicy = false) {
    if (!promptText.trim()) {
        alert('Please enter a category.');
        return;
    }

    const basePrompt = isSpicy 
    ? `Give a controversial ranking of the top 10 ${promptText}. Respond only with a comma-separated list of items ordered from best to worst. If there are less than 10 items in the category, the list may be shorter.`
    : `According to public perception, what are the top 10 ${promptText}? Respond only with a comma-separated list of items ordered from best to worst. If there are less than 10 items in the category, the list may be shorter.`;

    const rankings = await gimme(basePrompt, isSpicy);
    return rankings;
}

async function gimme(basePrompt, isSpicy = false) {
    const endpoints = [
        'http://localhost:3000/gimme',
        'https://gimme-public-6b3c3df38d94.herokuapp.com/gimme'
    ];

    const promptBody = JSON.stringify({
        prompt: basePrompt,
        temperature: isSpicy ? 1 : 0
    });

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: promptBody
            });

            const data = await response.json();
            
            if (response.ok) {
                return data.response;
            }
        } catch (error) {
            // If this is the last endpoint and it failed, return the error
            if (endpoint === endpoints[endpoints.length - 1]) {
                return `Error: ${error.message}`;
            }
            // Otherwise continue to next endpoint
            continue;
        }
    }
}

async function toggleContent(index) {
    const content = document.getElementById(`content-${index}`);
    const arrow = content.parentElement.querySelector('.arrow');
    const itemName = content.parentElement.querySelector('.item-name').textContent;
    const category = document.getElementById('resultsContainer').dataset.category;
    
    // Toggle visibility and arrow
    content.classList.toggle('active');
    arrow.classList.toggle('active');
    
    // Only fetch content if we're opening and content is empty/default
    if (content.classList.contains('active') && !content.dataset.loaded) {
        content.textContent = 'Loading...';
        
        const details = await gimme(`Tell me about ${itemName} as an item in the category ${category}. Respond only with a 1-3 sentence description of the item.`, false);
        content.textContent = details;
        content.dataset.loaded = 'true';
    }
}