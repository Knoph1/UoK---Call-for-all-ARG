import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "UoK Research Portal - University of Kabianga",
  description: "University of Kabianga Research Portal for Annual Research Grants",
}

export default function HomePage() {
  redirect("/auth/signin")
}
