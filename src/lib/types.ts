

export interface Photo {
  id: string;
  url: string;
  title: string;
  originalName?: string;
  aspectRatio?: "portrait" | "landscape"; // 2:3 or 3:2
}


export interface Album {
  id: string;
  title: string;
  photos: Photo[];
  createdAt: number;
}
