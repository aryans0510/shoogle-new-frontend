export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  buyer_id: string;
  created_at: string;
  buyer?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
  review_reply?: {
    id: string;
    reply: string;
    seller_id: string;
    created_at: string;
  } | null;
}
