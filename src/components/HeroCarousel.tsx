"use client";

import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from 'react-responsive-carousel';
import { heroImages } from '@/constants';
import Image from 'next/image';

const HeroCarousel = () => {
    return (
        <div className="hero-carousel select-none">
            <Carousel
                showThumbs={false}
                // autoPlay
                infiniteLoop
                showStatus={false}
                showArrows={false}
            // interval={2000}
            >
                {heroImages?.map((image) => (
                    <Image
                        key={image.alt}
                        src={image.url}
                        alt={image.alt}
                        width={484}
                        height={484}
                        draggable={false}
                        className='object-contain'
                    />
                ))}
            </Carousel>

            <Image
                src="/assets/icons/hand-drawn-arrow.svg"
                alt=""
                width={175}
                height={175}
                draggable={false}
                className='object-contain max-xl:hidden absolute bottom-0 -left-[15%] z-0'
            />
        </div>
    )
}

export default HeroCarousel
