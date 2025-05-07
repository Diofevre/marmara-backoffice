"use client";

import Image from "next/image";
import { useState } from "react";

export default function DeleteAccountPage() {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    { src: "/assets/1.jpg", alt: "Account menu" },
    { src: "/assets/2.jpg", alt: "Delete page" },
    { src: "/assets/3.jpg", alt: "Delete confirmation" },
  ];

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsCarouselOpen(true);
  };

  const handleCloseCarousel = () => {
    setIsCarouselOpen(false);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseCarousel();
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
        Account Deletion – Marmara Spra
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        At Marmara Spra, we respect your privacy. If you wish to delete your
        account and associated data, please follow the steps below.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Steps to request account deletion:
      </h2>
      <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">
        <li>Log in to your account in our application.</li>
        <li>
          Go to{" "}
          <strong className="text-gray-900">
            Profiles &gt; My account &gt; Delete my account
          </strong>
          .
        </li>
        <li>Follow the on-screen instructions to confirm deletion.</li>
      </ol>
      <p className="text-gray-700 mb-6">
        If you cannot access the application, you may also request deletion via
        email at{" "}
        <a
          href="mailto:contact@diofevre.com"
          className="text-blue-600 hover:underline"
        >
          contact@diofevre.com
        </a>{" "}
        with the subject line: &quot;Account Deletion&quot;.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Data that will be deleted:
      </h2>
      <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">
        <li>Profile information (name, email, password, address, photo)</li>
        <li>App activity history</li>
        <li>User preferences</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Screenshots:
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={300}
            height={600}
            className="rounded-lg shadow-md cursor-pointer"
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {isCarouselOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={handleCloseCarousel}
              className="absolute top-4 right-4 text-white text-4xl rounded-full w-10 h-10 flex items-center justify-center z-10"
            >
              ×
            </button>
            <button
              onClick={handlePrev}
              className="absolute left-4 text-white text-3xl font-bold bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center z-10"
            >
              ‹
            </button>
            <Image
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              width={280}
              height={1200}
              className="rounded-lg"
            />
            <button
              onClick={handleNext}
              className="absolute right-4 text-white text-3xl font-bold bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center z-10"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
