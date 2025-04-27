"use client";

import Image from "next/image";


export default function Sidebar() {

  return (
    <div className="w-64 h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-white border-r shadow-lg p-6 mr-4">
      {/* Top Logo Section */}
      <div className="flex flex-col items-center gap-2">
      <Image
        src="/messenger.png"
        alt="messenger"
        width={64}
        height={64}
        className="rounded-full border-4 border-blue-200 shadow-md"
      />
      </div>

      {/* Bottom: Username 
      <div className="text-center text-gray-600 font-medium">
      <span className="text-blue-400 font-bold">Ezzehi Nour</span>
      </div>*/}
    </div>
  );
}
