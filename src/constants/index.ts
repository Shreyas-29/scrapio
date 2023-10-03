import { Heart, Search, User } from 'lucide-react'

export const navIcons = [
    {
        name: "Search",
        icon: Search,
        link: "/search"
    },
    {
        name: "Heart",
        icon: Heart,
        link: "/favourites"
    }, {
        name: "Profile",
        icon: User,
        link: "/profile"
    }
];

export const heroImages = [
    {
        url: '/assets/images/hero-1.svg',
        alt: 'Hero 1',
    },
    {
        url: '/assets/images/hero-2.svg',
        alt: 'Hero 2',
    },
    {
        url: '/assets/images/hero-3.svg',
        alt: 'Hero 3',
    },
    {
        url: '/assets/images/hero-6.svg',
        alt: 'Hero 4',
    },
    {
        url: '/assets/images/hero-5.svg',
        alt: 'Hero 5',
    },
];

export const isValidProductLink = (url: string) => {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;

        // check if hostname contains amazon.com or amazon.in
        if (hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.includes("amazon")) {
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
};