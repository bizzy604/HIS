import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to sign-up page
  redirect("/sign-up");
  
  // This will never be rendered, but is required for the component
  return null;
}
