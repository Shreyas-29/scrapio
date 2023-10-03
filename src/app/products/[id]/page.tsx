import { getProductById, getSimilarProducts } from "@/actions";
import { Modal, PriceCard, ProductCard } from "@/components";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import { ArrowUpRight, Bookmark, Heading3, Heart, MessageCircle, MessageSquare, Share, Share2, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// @ts-ignore
import { redirect } from "next/navigation";


interface ProductPageProps {
    params: {
        id: string;
    }
}

export async function generateMetadata({ params }: ProductPageProps) {
    const product = await getProductById(params?.id);

    return {
        title: `${product?.title} - Scrapio`,
        description: product?.description,
    };
};

export default async function ProductPage({
    params
}: ProductPageProps) {

    const product: Product = await getProductById(params?.id);

    if (!product) redirect("/");

    const similarProducts = await getSimilarProducts(product?._id!);

    return (
        <div className="product-container">
            <div className="flex flex-col gap-28 xl:flex-row">
                <div className="product-image">
                    <Image
                        src={product?.image}
                        alt="Product Image"
                        width={580}
                        height={400}
                        className="mx-auto"
                    />
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-5 pb-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-2xl font-semibold text-secondary font-heading">
                                {product?.title}
                            </p>
                            <Link
                                href={product?.url}
                                target="_blank"
                                className="flex items-center text-base text-gray-600 hover:text-gray-900"
                            >
                                Visit Product
                                <ArrowUpRight className="inline-block w-4 h-4 ml-2" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="product-hearts">
                                <Heart className="w-4 h-4 text-red-500" />
                                <p className="text-sm font-semibold text-red-500">
                                    {product?.reviewsCount}
                                </p>
                            </div>
                            <div className="p-2 cursor-pointer bg-white-200 rounded-10 hover:bg-slate-200">
                                <Bookmark className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="p-2 cursor-pointer bg-white-200 rounded-10 hover:bg-slate-200">
                                <Share2 className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                    </div>
                    <div className="product-info">
                        <div className="flex flex-col gap-2">
                            <p className="text-3xl font-bold text-secondary">
                                {product.currency} {formatNumber(product.currentPrice)}
                            </p>
                            <p className="text-xl text-gray-600 line-through">
                                {product.currency} {formatNumber(product.originalPrice)}
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="product-stars">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <p className="text-sm font-semibold text-primary-orange">
                                        {product?.stars || "25"}
                                    </p>
                                </div>
                                <div className="product-reviews">
                                    <MessageSquare className="w-4 h-4 text-gray-600" />
                                    <p className="text-sm text-gray-600">
                                        {product?.reviewsCount} reviews
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-primary-green">
                                    93% {" "}
                                </span>
                                buyers enjoyed this product!
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 my-8">
                        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                            <PriceCard
                                title="Current Price"
                                icon="/assets/icons/price-tag.svg"
                                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                            />
                            <PriceCard
                                title="Average Price"
                                icon="/assets/icons/chart.svg"
                                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
                            />
                            <PriceCard
                                title="Highest Price"
                                icon="/assets/icons/arrow-up.svg"
                                value={`${product.currency} ${formatNumber(product.highestPrice || product.originalPrice)}`}
                            />
                            <PriceCard
                                title="Lowest Price"
                                icon="/assets/icons/arrow-down.svg"
                                value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                            />
                        </div>
                    </div>
                    <Modal productId={params?.id} />
                </div>
            </div>
            <div className="flex flex-col gap-16">
                <div className="flex flex-col gap-5">
                    <h3 className="text-2xl font-semibold font-heading text-secondary">
                        Product Description
                    </h3>
                    <div className="flex flex-col gap-4">
                        {product?.description?.split("\n")}
                    </div>
                </div>
                <button className="mx-auto px-5 py-4 rounded-2xl bg-secondary hover:opacity-70 text-white flex items-center justify-center min-w-[200px]">
                    <Link href="/" className="flex items-center justify-center w-full gap-3">
                        <ShoppingBag className="w-5 h-5 text-white" />
                        <span>Buy Now</span>
                    </Link>
                </button>
            </div>

            {similarProducts && similarProducts?.length > 0 ? (
                <div className="flex flex-col w-full gap-2 py-14">
                    <p className="section-text">
                        Similar Products
                    </p>

                    <div className="flex flex-wrap w-full gap-10 mt-8">
                        {similarProducts?.map((product) => (
                            <ProductCard
                                key={product?._id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
};