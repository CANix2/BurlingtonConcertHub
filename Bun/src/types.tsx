// types.ts

export interface PostData {
  id: string;
  artistName: string;
  content: string;
  venue?: string;
  concertDate?: string;
  rating: number;
  image?: File | null;
  tags: string[];
  postDate: Date;
  likes: number;
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