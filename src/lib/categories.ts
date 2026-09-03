import fashion from "@/assets/products/hoodie.jpg";
import electronics from "@/assets/products/headphones.jpg";
import beauty from "@/assets/products/serum.jpg";
import home from "@/assets/products/lamp.jpg";
import accessories from "@/assets/products/bag.jpg";
import sports from "@/assets/products/yoga-mat.jpg";

export interface Category {
  name: string;
  slug: string;
  blurb: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  { name: "Fashion", slug: "fashion", blurb: "Everyday staples & denim", image: fashion },
  { name: "Electronics", slug: "electronics", blurb: "Audio, wearables & more", image: electronics },
  { name: "Beauty", slug: "beauty", blurb: "Skin, hair & body care", image: beauty },
  {
    name: "Home & Lifestyle",
    slug: "home-lifestyle",
    blurb: "Lighting, textiles & tableware",
    image: home,
  },
  { name: "Accessories", slug: "accessories", blurb: "Bags, wallets & eyewear", image: accessories },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    blurb: "Train at home or outdoors",
    image: sports,
  },
];
