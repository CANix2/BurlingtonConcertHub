import React from 'react';
import type { PostData, Venue } from '../types';


interface PostHolderProps {
    post: PostData;
    onLike: (id: string) => void;
}



// for handling likes

const PostHolder: React.FC<PostHolderProps> = ({ post, onLike }) => {
    // derived data
    const formattedConcertDate = post.concertDate
        ? new Date(post.concertDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;
    const formattedPostDate = post.postDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    // const venueLabel = VENUES.find(v => v.value === post.venue)?.label ?? 'Unknown Venue'; // TODO: make venues a constant?
    const venueLabel = post.venue === 'higher_ground' ? 'Higher Ground'    
  : post.venue === 'radio_bean' ? 'Radio Bean'
  : 'Unknown Venue';



    // render stars
    const renderStars = () => (
        <div className="rating-container">
        {[1, 2, 3, 4, 5].map(star => (
            <span
            key={star}
            className={`star-btn ${post.rating >= star ? 'active' : ''}`}
            >
            ★
            </span>
        ))}
        <span className="rating-label">{post.rating}/5</span>
        </div>
    );

    // handle like click
    const handleLike = () => onLike(post.id);

    // render likes
    const renderLikes = () => (
        <div className="likes-container">
            <button
                type="button"
                className ={`like-btn ${post.likes > 0 ? 'liked' : ''}`}
                onClick={handleLike}
            >
                ♡       
            </button>
            <span className="likes-label">{post.likes}</span>
        </div>
    );




    return (
        <div className="post-holder">

            <div className="post-holder-header">
                <h3>{post.artistName}</h3>
                <span className="post-date">Posted {formattedPostDate}</span>
            </div>

            <div className="post-holder-body">
                <span>{venueLabel}</span>
                {formattedConcertDate && <span>{formattedConcertDate}</span>}
            </div>

            {renderStars()}

            {renderLikes()}

            {post.content && (
                <p className="post-content">{post.content}</p>
            )}

            {post.tags.length > 0 && (
                <div className="tags-container">
                {post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                ))}
                </div>
            )}

        </div>

    );
};
export default PostHolder;