//app/login/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    // Dummy credentials
    const validEmail = "admin@example.com";
    const validPassword = "password123";

    if (email === validEmail && password === validPassword) {
      router.push("/dashboard");
    } else {
      alert("Invalid email or password. Please try again.");
    }
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
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-xs border border-gray-400 cursor-pointer transition-all duration-200 ${
                  rememberMe ? "bg-[#EE3425]" : "bg-white"
                }`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </div>
              <label
                htmlFor="remember"
                className="text-sm leading-none cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
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
            className="w-full h-12 bg-[#EE3425] hover:bg-red-600"
          >
            Log In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center my-6">
            <div className="w-2/3 h-[1px] bg-gray-300"></div>
            <p className="px-3  text-xs font-bold">Or</p>
            <div className="w-2/3 h-[1px] bg-gray-300"></div>
          </div>
          <div className="mt-4 space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 font-light relative justify-center pl-10 text-[#616161]"
            >
              <Image
                src="/google.png"
                alt="Google"
                width={20}
                height={20}
                className="absolute left-10"
              />
              Log In with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 font-light relative justify-center pl-10 text-[#616161]"
            >
              <Image
                src="/facebook.png"
                alt="Facebook"
                width={20}
                height={20}
                className="absolute left-10"
              />
              Log In with Facebook
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 font-light relative justify-center pl-10 text-[#616161]"
            >
              <Image
                src="/apple.png"
                alt="Apple"
                width={20}
                height={20}
                className="absolute left-10"
              />
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
