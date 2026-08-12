// "use client";

// import { useState, type FormEvent } from "react";
// import { toast } from "sonner";
// import { ArrowUpRight } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export function NewsletterSignup() {
//   const [email, setEmail] = useState("");

//   function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     if (!email.trim()) return;
//     toast.success("Thanks for subscribing!");
//     setEmail("");
//   }

//   return (
//     <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
//       <Input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="you@company.com"
//         aria-label="Email for newsletter"
//         className="h-10"
//         required
//       />
//       <Button
//         type="submit"
//         className="h-10 shrink-0 bg-gradient-to-r from-primary to-seal text-primary-foreground hover:opacity-90"
//       >
//         Subscribe
//         <ArrowUpRight className="h-4 w-4" />
//       </Button>
//     </form>
//   );
// }