using System;

async function searchBook() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Searching...';


    try {
        const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.docs.length === 0) {
            resultsDiv.innerHTML = 'No results found.';
            return;
        }

        const book = data.docs[0];

        const title = book.title || 'No title available';
        const author = book.author_name ? book.author_name.join(', ') : 'No author available';
        const rating = book.ratings_average ? `${book.ratings_average} stars` : 'No rating available';

        resultsDiv.innerHTML = `
        <h2>${title}</h2>
        <p><strong>Author:</strong> ${author}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        `;
    }

    catch (error) {
        resultsDiv.innerHTML = 'An error occurred while fetching the book data.';
        console.error(error);
    }
}