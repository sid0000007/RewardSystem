"use client";

import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="mx-auto p-8">
      <div className="">
        <h2 className="text-3xl font-bold mb-4">User Profile</h2>        
      </div>
      <UserProfile />
    </div>
  );
}
