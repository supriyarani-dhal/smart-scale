"use client";

import { SignUp, useSignUp } from "@clerk/nextjs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  if (!isLoaded) {
    return <Loader2 />;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      //by using this value, we are unmounting the signup component from the page and redirecting it to the verify page
      setPendingVerification(true);
    } catch (e: unknown) {
      setError(e.errors[0].message || "An error occurred");
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">
          Sign Up for Todo Master
        </h2>
        <div>
          {!pendingVerification ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div role="alert" className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}
              <button type="submit" className="btn w-full">
                Sign Up
              </button>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code">Verification Code</label>
                <input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                />
              </div>
              {error && (
                <div role="alert" className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}
              <button type="submit" className="btn w-full">
                Verify Email
              </button>
            </form>
          )}
        </div>
        <div className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
