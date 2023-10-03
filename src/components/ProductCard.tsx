import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ProductCardProps {
    product: any;
}

const ProductCard: FC<ProductCardProps> = ({
    product
}) => {
    return (
        <Link href={`/products/${product?._id}`} className="product-card group">
            <div className="product-card_img-container">
                <Image
                    src={product?.image}
                    alt="Product Image"
                    width={200}
                    height={200}
                    className="product-card_img group-hover:scale-105 transition transform"
                />
            </div>
            <div className="flex flex-col gap-3">
                <h3 className="product-title">
                    {product?.title}
                </h3>
                <div className="flex justify-between">
                    <p className="text-gray-600 text-lg capitalize">
                        {product?.category}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                        <span>
                            {product?.currency}
                        </span>
                        <span>
                            {product?.currentPrice.toLocaleString()}
                        </span>
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;