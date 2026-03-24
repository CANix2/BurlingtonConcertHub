// pages/mockPosts.ts
import type { PostData } from '../types.tsx';

export const MOCK_POSTS: PostData[] = [
  {
    id: '1',
    artistName: 'Band1',
    content: 'Good show',
    venue: 'higher_ground',
    concertDate: '2024-11-15',
    rating: 5,
    tags: ['jam band', 'vermont', 'live music'],
    postDate: new Date('2024-11-16'),
    likes: 10
  },
  {
    id: '2',
    artistName: 'Singer 2',
    content: 'Bad show',
    venue: 'radio_bean',
    concertDate: '2024-10-03',
    rating: 4,
    tags: ['indie pop', 'local'],
    postDate: new Date('2024-10-04'),
    likes: 5
  },
];