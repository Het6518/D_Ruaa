import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(images[0]);
  const [loaded, setLoaded] = useState(false);

  return (
    <div>
      <div className="relative overflow-hidden bg-cream aspect-[4/5] w-full">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream">
            <div className="w-12 h-12 rounded-full border-2 border-clay/20 border-t-clay animate-spin flex items-center justify-center">
              <img src="/logo.jpeg" alt="" className="w-6 h-6 rounded-full object-contain animate-pulse" />
            </div>
          </div>
        )}
        <img
          src={active}
          alt={`${name} product view`}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => {
                if (active !== image) {
                  setLoaded(false);
                  setActive(image);
                }
              }}
              className={`overflow-hidden border transition ${active === image ? "border-clay" : "border-transparent"}`}
              aria-label={`Show ${name} image ${index + 1}`}
            >
              <img src={image} alt={`${name} thumbnail ${index + 1}`} className="aspect-square w-full object-cover" />
            </button>
          ))} 
        </div> 
      )}
    </div>
  );
}
