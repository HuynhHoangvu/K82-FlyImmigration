export declare class News {
    id: string;
    title: string;
    titleEn: string;
    slug: string;
    excerpt: string;
    excerptEn: string;
    content: string;
    contentEn: string;
    image: string;
    type: 'news' | 'handbook' | 'study' | 'travel';
    country: string;
    studyType: string;
    registerUrl: string;
    priceFrom: number;
    priceTo: number;
    priceCurrency: string;
    itinerary: string;
    itineraryEn: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
