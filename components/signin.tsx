import React from "react";
import { useRouter } from "next/navigation";

function SignInButton() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin"); // Redirect to the /signin page
  };

  return (
    <div>
      <button onClick={handleSignIn} className="px-4 py-2 bg-blue-500 text-white rounded">
        Sign in
      </button>
    </div>
  );
}

export default SignInButton;
