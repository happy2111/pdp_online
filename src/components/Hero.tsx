"use client"

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const Hero = () => {
    // Sample images - replace these with your own course images
    const slides = [
        {
            id: 1,
            image: "https://swiperjs.com/demos/images/nature-1.jpg",
            title: "Web Development",
            description: "Master HTML, CSS, JavaScript, React"
        },
        {
            id: 2,
            image: "https://swiperjs.com/demos/images/nature-2.jpg",
            title: "Mobile Development",
            description: "iOS, Android, React Native"
        },
        {
            id: 3,
            image: "https://swiperjs.com/demos/images/nature-3.jpg",
            title: "Backend Development",
            description: "Node.js, Python, Java, Databases"
        },
        {
            id: 4,
            image: "https://swiperjs.com/demos/images/nature-4.jpg",
            title: "Data Science",
            description: "Machine Learning, AI, Analytics"
        },
        {
            id: 5,
            image: "https://swiperjs.com/demos/images/nature-5.jpg",
            title: "DevOps",
            description: "Docker, Kubernetes, Cloud"
        },
        {
            id: 6,
            image: "https://swiperjs.com/demos/images/nature-6.jpg",
            title: "UI/UX Design",
            description: "Figma, Adobe XD, Prototyping"
        },
        {
            id: 7,
            image: "https://swiperjs.com/demos/images/nature-7.jpg",
            title: "Cybersecurity",
            description: "Network Security, Ethical Hacking"
        },
        {
            id: 8,
            image: "https://swiperjs.com/demos/images/nature-8.jpg",
            title: "Cloud Computing",
            description: "AWS, Azure, Google Cloud"
        },
        {
            id: 9,
            image: "https://swiperjs.com/demos/images/nature-9.jpg",
            title: "Artificial Intelligence",
            description: "Neural Networks, Deep Learning"
        }
    ];

    return (
        <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black pt-[30px] pb-[30px] overflow-hidden">
            <div className="container mx-auto px-4 h-full flex flex-col">
                {/* Hero Title - Now with 100px top margin */}
                <div className="text-center mb-6 flex-shrink-0 mt-[100px]">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        Learn with <span className="text-blue-500">PDP Online</span>
                    </h1>
                </div>

                {/* Carousel - Takes most of the space */}
                <div className="flex-1 flex items-center justify-center min-h-0">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 30,
                            stretch: 0,
                            depth: 200,
                            modifier: 2.5,
                            slideShadows: true,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={true}
                        modules={[EffectCoverflow, Pagination, Autoplay]}
                        className="w-full h-full"
                    >
                        {slides.map((slide) => (
                            <SwiperSlide
                                key={slide.id}
                                className="!w-[450px] md:!w-[550px] !h-[500px] md:!h-[600px] bg-center bg-cover rounded-3xl overflow-hidden group cursor-pointer transition-all duration-300"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 450px, 550px"
                                        priority={slide.id <= 3}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">
                                            {slide.title}
                                        </h3>
                                        <p className="text-gray-200 text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                            {slide.description}
                                        </p>
                                        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 hover:bg-blue-700 text-lg font-semibold">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto w-full flex-shrink-0">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-blue-500">500+</div>
                        <div className="text-gray-400 text-lg">Courses</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-blue-500">50k+</div>
                        <div className="text-gray-400 text-lg">Students</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-blue-500">100+</div>
                        <div className="text-gray-400 text-lg">Instructors</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-blue-500">24/7</div>
                        <div className="text-gray-400 text-lg">Support</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;