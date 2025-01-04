import React from "react";
import { useRouter } from "next/navigation";
import { useClerk } from '@clerk/nextjs'


function SignOutButton() {
  
    const { signOut } = useClerk();

  return (
    <div>
      <button onClick={() => signOut({ redirectUrl: '/home'})} className="px-4 py-2 bg-red-500 text-white rounded">
        Sign out
      </button>
    </div>
  );
}

export default SignOutButton;
