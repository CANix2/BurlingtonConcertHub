import React, { useState, useEffect } from 'react';
import { useFetcher } from 'react-router-dom';

interface  Post {
    id: number;
    artist_name: string;
    venue: string;
    rating: number;
    content: string;
    created_at: string;
}

interface FetchState {
    isLoading: boolean;
    error?: string;  
}

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ isLoading: true });
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/posts');

                if (!response.ok) {
                    throw new Error('Failed to fetch posts.');
                }

                const data: Post[] = await response.json();
                setPosts(data);
            }
            catch (error) {
                setFetchState(prev => ({ ...prev, error: 'Failed to load posts. Please try again.' }));
            }
            finally {
                setFetchState(prev => ({ ...prev, isLoading: false }));
            }
        };
        fetchPosts();
    }, []);

    if (posts.length === 0) {
        return <p>No posts yet.</p>;
    }

    return (
        <div className="feed">
            {posts.map((post)=> (
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
            ))}
        </div>
    );
};

export default Feed;