import React, { useState, useEffect } from 'react';

import './Artists.css';

interface  ArtistPost {
    id: number;
    artist: string;
    title: string;
    content: string;
}
interface FetchState {
    isLoading: boolean;
    error?: string;  
}

const Artists: React.FC = () => {
    const [artistPosts, setArtistPosts] = useState<ArtistPost[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ isLoading: true });
    
    useEffect(() => {
        const fetchArtistPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/artistposts');

                if (!response.ok) {
                    throw new Error('Failed to fetch artist posts.');
                }

                const data: ArtistPost[] = await response.json();
                setArtistPosts(data);
            }
            catch (error) {
                setFetchState(prev => ({ ...prev, error: 'Failed to load posts. Please try again.' }));
            }
            finally {
                setFetchState(prev => ({ ...prev, isLoading: false }));
            }
        };
        fetchArtistPosts();
    }, []);

    if (artistPosts.length === 0) {
        return <p>No posts yet.</p>;
    }

    return (
        <div className="feed">
            {artistPosts.map((ap) => (
                <div key={ap.id} className="post-card">
                    <p className="artist">{ap.artist}</p>
                    <h3>{ap.title}</h3>
                    {ap.content && <p className="content">{ap.content}</p>}
                </div>
            ))}
        </div>
    );
};

export default Artists;