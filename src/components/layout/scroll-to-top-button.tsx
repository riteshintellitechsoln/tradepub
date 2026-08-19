// "use client";

// import { useEffect, useState } from "react";
// import { ArrowUp } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export function ScrollToTopButton() {
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     function onScroll() {
//       setVisible(window.scrollY > 400);
//     }
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   if (!visible) return null;

//   return (
//     <Button
//       size="icon"
//       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//       aria-label="Scroll to top"
//       className="fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full shadow-lg"
//     >
//       <ArrowUp className="h-5 w-5" />
//     </Button>
//   );
// }