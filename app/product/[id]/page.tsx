"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Gift,
  Info,
  Clock,
  Copy,
  Star,
} from "lucide-react";
import { getProductById } from "@/data/codes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="p-4 mx-auto max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-purple-300 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "epic":
        return "bg-gradient-to-r from-purple-400 to-pink-500 text-white";
      case "rare":
        return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
      case "special":
        return "bg-gradient-to-r from-pink-400 to-rose-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied to clipboard!", {
      description: "You can now paste it in the scanner",
      duration: 2000,
    });
  };

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
        className="text-purple-300 hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 flex items-center justify-center overflow-hidden relative">              
              {/* Product image with proper sizing */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  // Hide image and show icon if image fails to load
                  e.currentTarget.style.display = "none";
                }}
                onLoad={(e) => {
                  // Hide icon when image loads successfully
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
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getRarityColor(product.rarity)}>
                  {product.rarity}
                </Badge>
                <span className="text-sm text-purple-300">{product.brand}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-purple-300 text-lg">{product.description}</p>
            </div>

            {/* Product Code */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-purple-300 mb-1">
                    Product Code
                  </h3>
                  <p className="text-lg font-mono font-semibold text-white">
                    {product.code}
                  </p>
                </div>
                <Button
                  onClick={() => copyToClipboard(`${product.code}-DEMO`)}
                  variant="ghost"
                  size="sm"
                  className="text-purple-300 hover:text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
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
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Gift className="w-6 h-6 text-purple-400" />
            Reward Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                {product.reward}
              </h3>
              <p className="text-purple-300">{product.rewardDescription}</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Rarity</h3>
              </div>
              <Badge className={`${getRarityColor(product.rarity)} text-sm`}>
                {product.rarity}
              </Badge>
            </div>
          </div>
        </CardContent>
      </motion.div>

      {/* Scheme Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Info className="w-6 h-6 text-purple-400" />
            Scheme Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  Expiry Date
                </h3>
              </div>
              <p className="text-purple-300">
                {formatDate(product.expiryDate)}
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Validity</h3>
              </div>
              <p className="text-purple-300">{product.schemeDetails}</p>
            </div>
          </div>
        </CardContent>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          onClick={() => copyToClipboard(`${product.code}-DEMO`)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
        >
          <Copy className="w-5 h-5 mr-2" />
          Copy Product Code
        </Button>
        <Button
          onClick={() => router.push("/product")}
          variant="outline"
          className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white font-semibold py-3"
        >
          <Gift className="w-5 h-5 mr-2" />
          Scan Code Now
        </Button>
      </motion.div>
    </div>
  );
}
