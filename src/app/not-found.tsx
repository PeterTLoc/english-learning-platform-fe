"use client";
import Link from "next/link";
import { Home, ArrowLeft, Search, BookOpen, Users } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#202020] text-white">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#4CC2FF] leading-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-[#CFCFCF] max-w-2xl mx-auto">
              Sorry, we couldn &apos; t find the page you&apos;re looking for.
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Search Suggestion */}
          <div className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Search className="w-5 h-5 text-[#4CC2FF]" />
              <h3 className="text-lg font-semibold text-white">
                Looking for something specific?
              </h3>
            </div>
            <p className="text-sm text-[#CFCFCF] mb-4">
              Try searching for courses, flashcards, or blog posts using the
              search bar above.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link
                href="/"
                className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4 hover:bg-[#373737] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-[#4CC2FF] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Home</h4>
                    <p className="text-sm text-[#CFCFCF]">Back to homepage</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/courses"
                className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4 hover:bg-[#373737] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#4CC2FF] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Courses</h4>
                    <p className="text-sm text-[#CFCFCF]">Browse all courses</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/flashcard-sets"
                className="bg-[#2D2D2D] border border-[#1D1D1D] rounded-lg p-4 hover:bg-[#373737] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#4CC2FF] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Flashcards</h4>
                    <p className="text-sm text-[#CFCFCF]">
                      Study with flashcards
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-[#2D2D2D] text-white border border-[#1D1D1D] rounded-lg hover:bg-[#373737] transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-[#4CC2FF] text-black rounded-lg font-semibold hover:bg-[#3AA0DB] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
