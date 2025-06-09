//Name: Carter Robbins Date: 6/8/25
import '../css/style.css';

// This code is part of a book search application that fetches book data from the Open Library API and displays it on a webpage. It allows users to search for books by title, view details, and get recommendations based on the selected book.
// It also provides a way to view recommendations for a selected book by opening a new page with the book's details stored in local storage.
export async function getRecommendations(book) {
    const recommendations = [];
    if (book.author_key && book.author_key.length > 0) {
        const authorId = book.author_key[0]; // Use the first author key for recommendations
        try {
            const response = await fetch(`https://openlibrary.org/authors/${encodeURIComponent(authorId)}/works.json?limit=3`);
            const data = await response.json(); // Fetch works by the author
            data.entries.forEach(entry => {
                const isEnglish = !entry.languages || entry.languages.some(lang => lang.key === '/languages/eng');
                // Check if the work is in English or has no language specified
                // If the work is in English or has no language specified, add it to recommendations
                if (isEnglish) {
                    recommendations.push({
                        type: 'author',
                        title: entry.title,
                        cover: entry.covers && entry.covers.length > 0 
                        ? `https://covers.openlibrary.org/b/id/${entry.covers[0]}-M.jpg`
                        : 'https://placehold.co/100x150?text=No+Cover'
                    });
                }
            });
        }
        catch (error) {
            console.error('Error fetching author recommendations:', error);
        }
    } 
    return recommendations; // Return the recommendations array
}
