import { useEffect } from "react";

export function usePageMeta(title: string, description: string) { //to add meta title and description to the page
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  }, [title, description]);
}
