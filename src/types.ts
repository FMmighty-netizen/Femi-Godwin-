export interface Chapter {
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: "magic" | "spiritual" | "korean";
  description: string;
  price: number; // USD
  priceNGN: number; // NGN
  coverImage: string;
  chapters: Chapter[];
}

export interface Purchase {
  id: string;
  userId: string;
  bookId: string;
  purchasedAt: string;
  paymentMethod: "stripe" | "opay" | "paystack";
  paymentReference: string;
  status: "completed" | "pending";
  amountPaid: number;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  lastReadAt: string;
  notes?: Note[];
}

export interface Note {
  id: string;
  page: number;
  text: string;
  createdAt: string;
}
