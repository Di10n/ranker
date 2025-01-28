document.addEventListener('DOMContentLoaded', function() {
    setInput();
});

function setInput() {
    document.getElementById('categoryForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const category = document.getElementById('categoryInput').value;
        const result = await gimme(category);
        output(result);
    });
}

function output(result) {
    const output = document.getElementById('output');
    output.innerHTML = result;
}

async function gimme(promptText) {
    const submitBtn = document.getElementById('categorySubmit');

    if (!promptText.trim()) {
        alert('Please enter a prompt');
        return;
    }

    submitBtn.disabled = true;

    try {
        const response = await fetch('https://gimme-public-6b3c3df38d94.herokuapp.com/gimme', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: `According to public perception, what are the top 10 ${promptText}? Respond only with a comma-separated list of items ordered from best to worst.` })
        });

        const data = await response.json();
        
        if (response.ok) {
            return data.response;
        } else {
            return `Error: ${data.error}`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    } finally {
        submitBtn.disabled = false;
    }
}