"use client";

import CodeScanner from "@/components/actions/CodeScanner";

export default function ScanPage() {
  return (
    <div className=" mx-auto p-4">  
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">           
           Validate Product Codes
          </h1>
        </div>        
      </div>
      <CodeScanner />
    </div>
    </div>
  );
}
