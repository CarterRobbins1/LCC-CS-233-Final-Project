import '../css/style.css';
import { getRecommendations } from './recommendations';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('recommendations');
    const book = JSON.parse(localStorage.getItem('selectedBook'));

     console.log("Loaded book:", book);
    if (!book) {
        container.innerHTML = 'No book data found.';
        return;
    }

    container.innerHTML = `<p>Loading recommendations for <strong>${book.title}</strong>...</p>`;

    try {
        const recs = await getRecommendations(book);
        if (recs.length === 0) {
            container.innerHTML = 'No recommendations available.';
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
