export type House = {
  id: number;
  contactPerson: string;
  size: string;
  rooms: number;
  images: string[];
};

const imgConstant = [
  "jpg.jpg",
  "jpg2.jpg",
  "webp.webp",
  "png.png",
  "triangle1.png",
  "triangle2.png",
  "triangle3.png",
];

export const dummyData = [
  {
    id: 1,
    contactPerson: "John Doe",
    size: "2000 sqft",
    rooms: 4,
    images: imgConstant,
  },
  {
    id: 2,
    contactPerson: "Jane Smith",
    size: "1800 sqft",
    rooms: 3,
    images: imgConstant,
  },
  // Add more dummy data as needed
];
