
export async function getRecommendations(book) {
    const recommendations = [];

    if (book.subject && book.subject.length > 0) {
        const subject = book.subject[0];
        try { 
            const response = await fetch(`https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=3`);
            const data = await response.json();
            data.works.forEach(work => {
                recommendations.push({
                    type: 'subject',
                    title: work.title,
                });
            });
        }
        catch (error) {
            console.error('Error fetching subject recommendations:', error);
        }
    }
    
    if (book.author_key && book.author_key.length > 0) {
        const authorId = book.author_key[0];
        try {
            const response = await fetch(`https://openlibrary.org/authors/${encodeURIComponent(authorId)}/works.json?limit=3`);
            const data = await response.json();
            data.entries.forEach(entry => {
                recommendations.push({
                    type: 'author',
                    title: entry.title,
                });
            });
        }
        catch (error) {
            console.error('Error fetching author recommendations:', error);
        }
    } 
    return recommendations;
}