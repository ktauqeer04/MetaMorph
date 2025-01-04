"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from '@clerk/nextjs'
import SignInButton from "./signin";
import SignOutButton from "./signout";

function Navbar() {
    
    const { sessionId } = useAuth();


  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing session, redirecting, etc.)
    console.log("Logged out");
  };

  return (
    <header className="bg-blue-600 p-4">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {/* MetaMorph Title */}
        <Link href="/" className="text-white text-2xl font-bold">
          MetaMorph
        </Link>

        {/* Logout Button */}
        {sessionId !== null ? <SignOutButton /> : <SignInButton />}
      </div>
    </header>
  );
}

export default Navbar;
