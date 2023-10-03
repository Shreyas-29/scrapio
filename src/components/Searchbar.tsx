"use client";

import { scrapeAndStoreProduct } from '@/actions';
import { Loader2 } from 'lucide-react';
// @ts-ignore
import { useRouter } from 'next/navigation';
// import { isValidProductLink } from '@/constants';
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast';

const isValidProductLink = (url: string) => {
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

const Searchbar = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchPrompt, setSearchPrompt] = useState<string>("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = isValidProductLink(searchPrompt);

        if (!isValidLink) {
            return toast.error("Please provide a valid Amazon product link.");
        }

        try {
            setIsLoading(true);

            // scrap the product
            const product = await scrapeAndStoreProduct(searchPrompt);

            console.log("product", product);

            // router.push(`/products/${product._id}`);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 mt-12">
            <input
                type="text"
                placeholder='Enter product link here...'
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                className="searchbar-input"
            />
            <button
                type="submit"
                disabled={isLoading || !searchPrompt}
                className="searchbar-btn"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                    <span className='w-full mx-auto text-center'>
                        {isLoading ? 'Searching...' : 'Search'}
                    </span>
                )}
            </button>
        </form>
    )
}

export default Searchbar
