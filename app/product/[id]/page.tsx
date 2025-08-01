"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Gift, Info, Clock, Copy } from "lucide-react";
import { getProductById } from "@/data/codes";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import CustomBadge from "@/components/Custombadge";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = getProductById(productId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!", {
      description: "You can now paste it in the scanner",
      duration: 2000,
    });
  };

  if (!product) {
    return (
      <div className="p-4 mx-auto max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-sm md:text-base mb-6">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()} className="bg-gradient-to-r text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
  };

  return (
    <div className="p-4 mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => router.push("/product")}
        variant="ghost"
        className="hover: mb-4 text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 md:p-6 border"
      >
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-gradient-to-br rounded-2xl border flex items-center justify-center overflow-hidden relative">
              {/* Product image with proper sizing */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  const iconElement = e.currentTarget
                    .previousElementSibling as HTMLElement;
                  if (iconElement) {
                    iconElement.style.display = "none";
                  }
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3 md:space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2"></div>
              <h1 className="text-sm md:text-lg lg:text-xl font-bold mb-2">
                {product.name}
              </h1>
              <p className="text-xs md:text-sm lg:text-md font-light">{product.description}</p>
            </div>

            {/* Product Code */}
            <div className="rounded-xl p-3 md:p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs lg:text-sm font-medium mb-1">Product Code</h3>
                  <p className="text-base lg:text-sm font-mono font-semibold">
                    {product.code}
                  </p>
                </div>
                <Button
                  onClick={() => copyToClipboard(`${product.code}-DEMO`)}
                  variant="ghost"
                  size="sm"
                  className="hover: text-xs md:text-sm"
                >
                  <Copy className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reward Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 md:p-6 border"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm lg:text-md">
            <Gift className="w-5 h-5 md:w-6 md:h-6" />
            Reward Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="rounded-xl p-3 md:p-4 border">
              <h3 className="text-sm lg:text-md font-semibold mb-2">{product.reward}</h3>
              <p className="text-xs lg:text-sm">{product.rewardDescription}</p>
            </div>
            <div className="rounded-xl p-3 md:p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm lg:text-md font-semibold">Rarity</h3>
              </div>
              <CustomBadge type={product.rarity} />
            </div>
          </div>
        </CardContent>
      </motion.div>

      {/* Scheme Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 md:p-6 border"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm lg:text-md">
            <Info className="w-5 h-5 md:w-6 md:h-6" />
            Scheme Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="rounded-xl p-3 md:p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="text-sm lg:text-md font-semibold">Expiry Date</h3>
              </div>
              <p className="text-xs lg:text-sm">{formatDate(product.expiryDate)}</p>
            </div>
            <div className="rounded-xl p-3 md:p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <h3 className="text-sm lg:text-md font-semibold">Validity</h3>
              </div>
              <p className="text-xs lg:text-sm">{product.schemeDetails}</p>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
