import { useEffect, useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(images[0]);

  useEffect(() => {
    setActive(images[0]);
  }, [images, name]);

  return (
    <div>
      <div className="relative overflow-hidden bg-cream aspect-[4/5] w-full">
        <img src={active} alt={`${name} product view`} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setActive(image)}
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