async function searchCategory() {
    const input = document.getElementById('categoryInput').value.toLowerCase();
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.className = 'results active';

    const result = await gimme(input);
    resultsList = result.split(',').map(item => item.trim());

    let resultsHTML = '';
        resultsList.forEach((item, index) => {
            resultsHTML += `
                <div class="result-item">
                    <span class="rank">#${index + 1}</span>
                    <span class="item-name">${item}</span>
                </div>
            `;
        });
    resultsContainer.innerHTML = resultsHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('categoryInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCategory();
        }
    });
});

async function gimme(promptText) {
    if (!promptText.trim()) {
        alert('Please enter a category.');
        return;
    }

    try {
        const response = await fetch('https://gimme-public-6b3c3df38d94.herokuapp.com/gimme', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: `According to public perception, what are the top 10 ${promptText}? Respond only with a comma-separated list of items ordered from best to worst. If there are less than 10 items in the category, the list may be shorter.` })
        });

        const data = await response.json();
        
        if (response.ok) {
            return data.response;
        } else {
            return `Error: ${data.error}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}