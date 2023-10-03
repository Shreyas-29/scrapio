import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { Product } from "@/models";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        connectToDB();

        // const products = await Product.find({});

        // if (!products) {
        //     throw new Error("No products found");
        // }

        // // 1. scrape latest product details and update the database
        // const updatedProducts = await Promise.all(
        //     products?.map(async (currentProduct) => {
        //         const scrapedProduct = await scrapeProduct(currentProduct.url);

        //         if (!scrapedProduct) {
        //             throw new Error("Error while scraping product");
        //         }

        //         const updatedPriceHistory: any = [
        //             ...currentProduct.priceHistory,
        //             { price: scrapedProduct.currentPrice }
        //         ]

        //         const product = {
        //             ...scrapedProduct,
        //             priceHistory: updatedPriceHistory,
        //             // @ts-ignore
        //             lowestPrice: getLowestPrice(updatedPriceHistory),
        //             highestPrice: getHighestPrice(updatedPriceHistory),
        //             averagePrice: getAveragePrice(updatedPriceHistory),
        //         }

        //         const updatedProduct = await Product.findOneAndUpdate(
        //             { url: scrapedProduct.url },
        //             product,
        //         );

        //         // 2. check each product status and send email accordingly
        //         const emailNotificationType = getEmailNotifType(scrapedProduct, currentProduct);

        //         if (emailNotificationType && updatedProduct.users.length > 0) {
        //             const productInfo = {
        //                 title: updatedProduct.title,
        //                 url: updatedProduct.url
        //             }

        //             const emailContent = await generateEmailBody(productInfo, emailNotificationType);

        //             const userEmails = updatedProduct.users.map((user: any) => user.email);

        //             await sendEmail(emailContent, userEmails);
        //         }

        //         return updatedProduct;
        //     })
        // )

        const products = await Product.find({});

        if (!products) throw new Error("No product fetched");

        // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                // Scrape product
                const scrapedProduct = await scrapeProduct(currentProduct.url);

                if (!scrapedProduct) return;

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    {
                        price: scrapedProduct.currentPrice,
                    },
                ];

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };

                // Update Products in DB
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        url: product.url,
                    },
                    product
                );

                // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
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
                    // Get array of user emails
                    const userEmails = updatedProduct.users.map((user: any) => user.email);
                    // Send email notification
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