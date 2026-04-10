import React, { useState, useEffect } from 'react';

interface Post {
    id: number;
    artist_name: string;
    venue: string;
    rating: number;
    content: string;
    created_at: string;
}

interface SearchResult {
    id: number;
    artist?: string;
    venue?: string;
}

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/posts');

                if (!response.ok) {
                    throw new Error('Failed to fetch posts.');
                }

                const data: Post[] = await response.json();
                setPosts(data);
                setFilteredPosts(data);
            }
            catch (error) {
                setError('Failed to load posts. Please try again.');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Search for artists/venues from the database
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        
        if (!query.trim()) {
            setFilteredPosts(posts);
            setShowSuggestions(false);
            setSearchResults([]);
            return;
        }

        // Filter posts locally based on search query
        const filtered = posts.filter(post => 
            post.artist_name.toLowerCase().includes(query.toLowerCase()) ||
            (post.venue && post.venue.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredPosts(filtered);

        // Fetch suggestions from the database
        try {
            const response = await fetch(`http://localhost:3001/api/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                const suggestions = [
                    ...data.artists.map((a: any) => ({ id: a.id, artist: a.artist })),
                    ...data.venues.map((v: any) => ({ id: v.id, venue: v.venue }))
                ];
                setSearchResults(suggestions.slice(0, 5)); // Show top 5 suggestions
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleSuggestionClick = (suggestion: SearchResult) => {
        const searchTerm = suggestion.artist || suggestion.venue || '';
        setSearchQuery(searchTerm);
        
        // Filter posts by the selected artist or venue
        const filtered = posts.filter(post => 
            post.artist_name.toLowerCase() === searchTerm.toLowerCase() ||
            (post.venue && post.venue.toLowerCase() === searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
        setShowSuggestions(false);
    };

    if (isLoading) {
        return <p>Loading posts...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <>
            {/* Search Bar */}
            <div className="relative">
                <form className="max-w-xs rounded-lg flex mt-2 mb-4 ml-2 border-black border-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="text" 
                        placeholder="Search for artists or venues..." 
                        className="min-w-full mt-0.5 mb-0.5 ml-0.5 italic outline-0 p-1"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                    />
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchResults.length > 0 && (
                    <div className="absolute mt-0 ml-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {searchResults.map((result) => (
                            <div 
                                key={result.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                onClick={() => handleSuggestionClick(result)}
                            >
                                {result.artist && <span>🎤 {result.artist}</span>}
                                {result.venue && <span>🏢 {result.venue}</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {searchQuery && (
                <p className="text-sm text-gray-600 ml-2 mb-2">
                    Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
            )}

            {/* Posts Feed */}
            <div className="feed">
                {filteredPosts.length === 0 ? (
                    <p className="ml-2">No posts found matching your search.</p>
                ) : (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="post-card">
                            <h3>{post.artist_name}</h3>
                            {post.venue && <p className="venue">{post.venue}</p>}
                            <p className="rating">
                                {'★'.repeat(post.rating)}{'☆'.repeat(5 - post.rating)}
                            </p>
                            {post.content && <p className="content">{post.content}</p>}
                            <p className="created-at">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Feed;