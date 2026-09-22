import { businessConfig } from "../data/config";
import type { Product } from "../types/product";

export const createWhatsAppUrl = (message: string) =>
  `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(message)}`; // encode uricomponent is used to encode msg to send as url and then send there 

export const productEnquiryMessage = (product: Product) =>
  `Hi, I am interested in the product:\n${product.name}\n\nCould you please share more details about availability, sizes and pricing?`;
