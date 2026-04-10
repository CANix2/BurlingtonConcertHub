// types.ts

export interface PostData {
  id: number;
  artist_name: string;
  content: string;
  venue?: string;
  concertDate?: string;
  rating: number;
  image?: File | null;
  tags: string[];
  postDate: Date;
  likes: number;
  accountId: number;
  created_at: string;
}

export interface Venue {
  value: string;
  label: string;
}

export interface FormErrors {
  artistName?: string;
  content?: string;
  venue?: string;
  concertDate?: string;
  rating?: number;
  general?: string;
}