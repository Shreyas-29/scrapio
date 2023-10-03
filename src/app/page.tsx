import { getProducts } from '@/actions';
import { HeroCarousel, ProductCard, Searchbar } from '@/components';
import { ArrowRight } from 'lucide-react';

export default async function Home() {

    const products = await getProducts();

    return (
        <>
            <section className="px-6 md:px-20 py-24">
                <div className="flex max-xl:flex-col gap-16">
                    <div className="flex flex-col justify-center w-full max-w-xl mx-auto">
                        <p className="small-text capitalize">
                            Smart shopping starts here:
                            <ArrowRight className="inline-block w-4 h-4 ml-2" />
                        </p>
                        <h1 className="head-text">
                            Unleash the power of {" "}
                            <span className="text-primary">
                                Scrapio
                            </span>
                        </h1>
                        <p className="mt-6">
                            Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
                        </p>

                        <Searchbar />
                    </div>
                    <HeroCarousel />
                </div>
            </section>
            <section className="trending-section">
                <h2 className="section-text">
                    Trending
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {products?.map((product, index) => (
                        <ProductCard product={product} key={index} />
                    ))}
                </div>
            </section>
        </>
    )
}
