import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { Product } from "@/models";
import { NextResponse } from "next/server";

export const maxDuration = 100; // 100 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        connectToDB();

        const products = await Product.find({});

        if (!products) throw new Error("No product fetched");

        // 1. Scrape the latest products and update in DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                // Scrape product
                const scrapedProduct = await scrapeProduct(currentProduct.url);

                if (!scrapedProduct) return;

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    {
                        price: scrapedProduct?.currentPrice,
                    },
                ];

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };

                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        url: product.url,
                    },
                    product
                );

                // 2. Check each product's status & send email accordingly
                const emailNotifType = getEmailNotifType(
                    scrapedProduct,
                    currentProduct
                );

                if (emailNotifType && updatedProduct.users.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                    };
                    // Construct emailContent
                    const emailContent = await generateEmailBody(productInfo, emailNotifType);

                    const userEmails = updatedProduct.users.map((user: any) => user.email);

                    await sendEmail(emailContent, userEmails);
                }

                return updatedProduct;
            })
        );

        return NextResponse.json({
            message: "Ok", data: updatedProducts
        });

    } catch (error: any) {
        throw new Error(`Error while scrapping product: ${error.message}`);
    }
}