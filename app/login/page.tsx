"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Apple, Facebook } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials against an API
    // For demo purposes, we'll just redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Background and branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-700 to-blue-900 flex-col justify-center items-center p-10 relative">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="z-10 text-white max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">HighBridge</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Building the Future...</h2>
          <p className="text-lg opacity-80">
            Streamline your workflow processes with our intuitive management
            system. Design, deploy, and monitor your workflows with ease.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <h1 className="text-3xl font-bold">HighBridge</h1>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="mb-6">
              <h2 className="text-sm uppercase text-gray-600 font-semibold">
                WELCOME BACK!
              </h2>
              <h1 className="text-2xl font-bold mt-1">
                Log In to your Account
              </h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Type here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Type here..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Log In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Or</p>

              <div className="mt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Log In with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  Log In with Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Apple className="h-5 w-5" />
                  Log In with Apple
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm">
                New User?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  SIGN UP HERE
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
