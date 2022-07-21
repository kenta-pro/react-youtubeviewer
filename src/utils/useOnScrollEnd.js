import { useEffect } from "react";

export default (onScrollEnd) => {
  useEffect(() => {
    let cleanup;
    if (!onScrollEnd) {
      return cleanup;
    }
    const scrollHandler = ({ target: { scrollingElement } }) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollingElement;
      if (scrollTop < scrollHeight - clientHeight) {
        return;
      }
      onScrollEnd();
    };
    window.document.addEventListener("scroll", scrollHandler);
    cleanup = () => {
      window.document.removeEventListener("scroll", scrollHandler);
    };
    return cleanup;
  }, [onScrollEnd]);
};
