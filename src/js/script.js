import '../css/style.css';
import { getRecommendations } from './recommendations';

class BookSearch {
    constructor(inputId, resultsId, buttonId) {
        this.input = document.getElementById(inputId);
        this.results = document.getElementById(resultsId);
        this.button = document.getElementById(buttonId);

        this.handleSearch = this.handleSearch.bind(this);
        this.addEventHandlers();
    }

    addEventHandlers() {
        this.button.addEventListener('click', this.handleSearch);
    }

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

            let html = '';
            const topBooks = data.docs.slice(0, 3);
            this.books = topBooks;

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
                            <button class="rec-btn" data-index="${i}">Show Recommendations</button>
                            <div class="recommendations" id="rec-${i}"></div>
                        </div>
                    </div>
                `;

            });
            this.results.innerHTML = html;
            this.addRecommendationHandlers();        
        }

        catch (error) {
            this.results.innerHTML = 'An error occurred while fetching the book data.';
            console.error(error);
        }
    }

    addRecommendationHandlers() {
        document.querySelectorAll('.rec-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = e.target.getAttribute('data-index');
                const book = this.books[index];
                const container = document.getElementById(`rec-${index}`);

                container.innerHTML = 'Loading recommendations...';

                const recommendations = await getRecommendations(book);

                if (recommendations.length === 0) {
                    container.innerHTML = 'No recommendations available.';
                } else {
                    container.innerHTML = recommendations.map(rec => `
                        <p><strong>${rec.type}:</strong> ${rec.title}</p>
                    `).join('');
                }
            });
        });
        
    }
}

window.onload = () => {
    new BookSearch('inputId', 'resultsId', 'searchBtn');
};