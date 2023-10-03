"use server";

import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { Product } from "@/models";
import { User } from "@/types";
import { revalidatePath } from "next/cache";

export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return;

    try {

        connectToDB();

        const scrapedProduct = await scrapeProduct(productUrl);

        if (!scrapedProduct) return;

        // check if product already exists in db else create a new one

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({
            url: scrapedProduct.url
        });

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                // @ts-ignore
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        };

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/products/${newProduct._id}`);

    } catch (error: any) {
        throw new Error(`Error while scrapping product: ${error.message}`);
    }
};

export async function getProductById(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ _id: productId });

        if (!product) return null;

        return product;

    } catch (error) {
        console.log(error);
    }
};

export async function getProducts() {
    try {
        connectToDB();

        const products = await Product.find({});

        return products;

    } catch (error) {
        console.log(error);
    }
};

export async function getSimilarProducts(productId: string) {
    try {
        connectToDB();

        const currentProduct = await Product.findById(productId);

        if (!currentProduct) return null;

        const similarProducts = await Product.find({
            _id: { $ne: productId },
        }).limit(4);

        return similarProducts;

    } catch (error) {
        console.log(error);
    }
};

export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findById(productId);

        if (!product) return;

        const userExists = product.users.some((user: User) => user.email === userEmail);

        if (!userExists) {
            product.users.push({ email: userEmail });

            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");

            await sendEmail(emailContent, [userEmail]);
        }
    } catch (error) {
        console.log("Error while adding user email to product: ", error);
    }
};