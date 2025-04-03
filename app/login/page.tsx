//app/login/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Apple, Facebook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate credentials against an API
    router.push("/dashboard");
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-between pl-[220px] pr-[220px] bg-cover bg-center  absolute inset-0"
      style={{ backgroundImage: "url('/login-bg.png')" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(46.33deg, rgba(33, 33, 33, 0.839) 0%, rgba(66, 66, 66, 0.239) 178.98%)"
        }}
      ></div>

      <div className="relative ">
        <div className="flex flex-col text-white justify-baseline space-y-30">
          <Image
            src="/logo_highbridge.png"
            alt="HighBridge"
            width={180}
            height={40}
          />
          <div className="w-[380px] h-[85px] text-justify">
            <p className="text-3xl font-bold mb-4">Building the Future ...</p>
            <p className="text-md  font-extralight">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute z-10 bottom-0 left-[780px] bg-white bg-opacity-90 p-8 rounded-t-lg shadow-lg w-full max-w-md">
        <h2 className="text-sm uppercase font-medium ">WELCOME BACK!</h2>
        <h1 className="text-2xl font-bold mt-1">Log In to your Account</h1>

        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-[#4F4F4F]">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Type here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-[#BDBDBD]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-[#4F4F4F]">
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

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
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
  );
}
