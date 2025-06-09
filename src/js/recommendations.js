import '../css/style.css';

export async function getRecommendations(book) {
    const recommendations = [];
    if (book.author_key && book.author_key.length > 0) {
        const authorId = book.author_key[0];
        try {
            const response = await fetch(`https://openlibrary.org/authors/${encodeURIComponent(authorId)}/works.json?limit=3`);
            const data = await response.json();
            data.entries.forEach(entry => {
                const isEnglish = !entry.languages || entry.languages.some(lang => lang.key === '/languages/eng');

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
    return recommendations;
}
