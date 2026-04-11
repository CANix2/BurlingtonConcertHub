import React, { useState, useEffect } from 'react';

import './Venues.css';

interface  VenuePost {
    id: number;
    venue: string;
    title: string;
    content: string;
}

interface FetchState {
    isLoading: boolean;
    error?: string;  
}

const Venues: React.FC = () => {
    const [venuePosts, setVenuePosts] = useState<VenuePost[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ isLoading: true });
    
    useEffect(() => {
        const fetchVenuePosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/venueposts');

                if (!response.ok) {
                    throw new Error('Failed to fetch venue posts.');
                }

                const data: VenuePost[] = await response.json();
                setVenuePosts(data);
            }
            catch (error) {
                setFetchState(prev => ({ ...prev, error: 'Failed to load posts. Please try again.' }));
            }
            finally {
                setFetchState(prev => ({ ...prev, isLoading: false }));
            }
        };
        fetchVenuePosts();
    }, []);

    if (venuePosts.length === 0) {
        return <p>No posts yet.</p>;
    }

    return (
        <div className="feed">
            {venuePosts.map((vp) => (
                <div key={vp.id} className="post-card">
                    <p className="venue">{vp.venue}</p>
                    <h3>{vp.title}</h3>
                    {vp.content && <p className="content">{vp.content}</p>}
                </div>
            ))}
        </div>
    );
};

export default Venues;