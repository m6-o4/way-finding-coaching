import { Categories } from "@/payload/collections/categories/schema";
import { FAQs } from "@/payload/collections/faqs/schema";
import { Media } from "@/payload/collections/media/schema";
import { Pages } from "@/payload/collections/pages/schema";
import { Posts } from "@/payload/collections/posts/schema";
import { Products } from "@/payload/collections/products/schema";
import { Testimonials } from "@/payload/collections/testimonials/schema";
import { Users } from "@/payload/collections/users/schema";

const collections = [Pages, Posts, Products, FAQs, Testimonials, Categories, Media, Users];

export { collections };
