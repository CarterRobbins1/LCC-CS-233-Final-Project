//Name: Carter Robbins Date: 6/8/25

import '../css/style.css';
import { getRecommendations } from './recommendations';
let bookSearchInstance;
// This code is part of a book search application that fetches book data from the Open Library API and displays it on a webpage. It allows users to search for books by title, view details, and get recommendations based on the selected book.
// The BookSearch class handles the
// search functionality, fetching data from the Open Library API, and displaying the results. It also provides a way to view recommendations for a selected book by opening a new page with the book's details stored in local storage.
// The recommendations are fetched based on the author of the selected book, and the results are displayed in a separate recommendations page.
class BookSearch {
    constructor(inputId, resultsId, buttonId) { //basic constructor to initialize the BookSearch instance with input, results, and button element IDs.
        this.input = document.getElementById(inputId);
        this.results = document.getElementById(resultsId);
        this.button = document.getElementById(buttonId);

        this.handleSearch = this.handleSearch.bind(this);
        this.addEventHandlers();
    }
    // Initializes the BookSearch instance with input, results, and button elements.
    addEventHandlers() {
        this.button.addEventListener('click', this.handleSearch);
    }
    // Adds event listeners to the search button to trigger the search functionality.
    // Handles the search functionality by fetching book data from the Open Library API based on the user's input.
    // It updates the results section with the fetched book data or an error message if no results are found.
    async handleSearch() {
        console.log("Search triggered");
        const query = this.input.value.trim();
        this.results.innerHTML = 'Searching...';

        if (!query) {
            this.results.innerHTML = 'Please enter a search term.';
            return;
        }


        try {
            const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.docs.length === 0) {
                this.results.innerHTML = 'No results found.';
                return;
         }

            let html = ''; // Initialize an empty string to build the HTML for the book results.
            const topBooks = data.docs.slice(0, 3); // Limit the results to the top 3 books for display.
            this.books = topBooks; // Store the fetched books in the instance for later use, such as recommendations.
            // Iterate over the top 3 books and build the HTML structure for each book.
            // Each book will display its title, author(s), rating, and cover image.
            topBooks.forEach((book, i) => {
                const title = book.title || 'No title available';
                const author = book.author_name ? book.author_name.join(', ') : 'No author available';
                const rating = book.ratings_average ? `${book.ratings_average} stars` : 'No rating available';
                const cover = book.cover_i 
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                    : 'https://placehold.co/100x150?text=No+Cover';

                html += `
                    <div class="book">
                        <img src="${cover}" alt="Cover for ${title}" /> 
                        <div class="book-info">
                            <h3>${title}</h3>
                            <p><strong>Author:</strong> ${author}</p>
                            <p><strong>Rating:</strong> ${rating}</p>
                            <button class="rec-btn" onclick="viewRecommendations(${i})">Show Recommendations</button>
                        </div>
                    </div>
                `;

            });
            this.results.innerHTML = html;        
        }

        catch (error) {
            this.results.innerHTML = 'An error occurred while fetching the book data.';
            console.error(error);
        }
    }

}
// The BookSearch class is responsible for handling the book search functionality, including fetching data from the Open Library API and displaying the results on the webpage.
window.onload = () => {
    bookSearchInstance = new BookSearch('inputId', 'resultsId', 'searchBtn');
};
// The window.onload event initializes the BookSearch instance when the page loads, allowing users to search for books immediately.
window.viewRecommendations = (index) => {
    const book = bookSearchInstance.books[index];
    localStorage.setItem('selectedBook', JSON.stringify(book));
    window.open('recommendations.html', '_blank');
};