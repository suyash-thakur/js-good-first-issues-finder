"use client";
import dynamic from "next/dynamic";

const IssuesListing = dynamic(() => import("@/components/IssuesListing"), { ssr: false });

export default function Home() {
  return <IssuesListing />;
}
