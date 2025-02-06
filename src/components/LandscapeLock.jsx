import { useEffect, useState } from "react";

const LandscapeLock = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isPortrait) {
    return (
      <div
  className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black text-white text-xxl text-center p-4"
  style={{ touchAction: "none", pointerEvents: "none", userSelect: "none" }}
>
  📱 Please rotate your device to landscape mode
</div>
    );
  }
  return null;
};

export default LandscapeLock;
