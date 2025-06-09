class BookSearch {
    constructor(inputId, resultsId) {
        this.input = document.getElementById(inputId);
        this.results = document.getElementById(resultsId);

        this.handleSearch = this.handleSearch.bind(this);
    }
    async handleSearch() {
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

            topBooks.forEach(book => {
                const title = book.title || 'No title available';
                const author = book.author_name ? book.author_name.join(', ') : 'No author available';
                const rating = book.ratings_average ? `${book.ratings_average} stars` : 'No rating available';
                const cover = book.cover_i 
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                    : 'https://via.placeholder.com/100x150?text=No+Cover';

                html += `
                    <div class="book">
                        <img src="${cover}" alt="Cover for ${title}" /> 
                        <h3>${title}</h3>
                        <p><strong>Author:</strong> ${author}</p>
                        <p><strong>Rating:</strong> ${rating}</p>
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

window.onload = () => {
    const bookSearch = new BookSearch('bookInput', 'results');

    const button = document.getElementById('searchBtn');
    button.addEventListener('click', bookSearch.handleSearch);
};