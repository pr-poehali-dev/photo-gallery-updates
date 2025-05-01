
export interface Photo {
  id: string;
  url: string;
  title: string;
}

export interface Album {
  id: string;
  title: string;
  photos: Photo[];
  createdAt: number;
}
