//Name: Carter Robbins Date: 6/8/25
import '../css/style.css';
import { getRecommendations } from './recommendations';

// This code is part of a book search application that fetches book data from the Open Library API and displays it on a webpage. It allows users to search for books by title, view details, and get recommendations based on the selected book.
// It also provides a way to view recommendations for a selected book by opening a new page with the book's details stored in local storage.
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('recommendations'); // This code waits for the DOM to be fully loaded before executing the function to fetch and display recommendations.
    const book = JSON.parse(localStorage.getItem('selectedBook')); // Retrieve the selected book data from local storage, which was set in the previous page when a book was selected.

     console.log("Loaded book:", book);
    if (!book) {
        container.innerHTML = 'No book data found.';
        return;
    }

    container.innerHTML = `<p>Loading recommendations for <strong>${book.title}</strong>...</p>`;
    // Store the selected book in local storage for later use, such as recommendations.
    // This code retrieves the book data from local storage, which was set in the previous page when a book was selected.
    try {
        const recs = await getRecommendations(book);
        if (recs.length === 0) {
            container.innerHTML = 'No recommendations available.'; // If no recommendations are found, display a message indicating that.
        } else {
            container.innerHTML = recs.map(rec => `
                <div class="book">
                    <img src="${rec.cover}" alt="Cover for ${rec.title}" />
                    <div class="book-info">
                        <p><strong>Recommended by ${rec.type === 'author' ? 'same author' : 'shared subject'}:</strong></p>
                        <p>${rec.title}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        container.innerHTML = 'Failed to load recommendations.';
        console.error(err);
    }
});
