import React, { useState } from "react";
import { useRouter } from "next/router";
import { Upload, Loader2 } from "lucide-react";
import { uploadGameToContract } from "@/lib/contract-integration";
import { useWalletStore } from "@/providers/walletStoreProvider";
import { useMetaMask } from "@/providers/metamask-provider";

export default function UploadGame() {
  const router = useRouter();
  const { connectedAccount } = useWalletStore((state) => state);
  const { accountAddress: metamaskAddress } = useMetaMask((state) => state);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ipfsHash: "",
    thumbnailIpfs: "",
    category: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userAddr = metamaskAddress || connectedAccount?.address;
    if (!userAddr) {
      setError("Please connect your wallet");
      return;
    }

    if (!formData.title || !formData.ipfsHash || !formData.category) {
      setError("Title, IPFS Hash, and Category are required");
      return;
    }

    setIsUploading(true);

    try {
      const gameId = await uploadGameToContract(
        formData.title,
        formData.description,
        formData.ipfsHash,
        formData.thumbnailIpfs,
        formData.category,
        connectedAccount
      );

      alert(`Game uploaded successfully! Game ID: ${gameId}`);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to upload game");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-indigo-950 relative overflow-hidden font-mono">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(to right, #ffffff10 1px, transparent 1px),
          linear-gradient(to bottom, #ffffff10 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-indigo-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Upload className="w-8 h-8" />
              Upload Game to Blockchain
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-indigo-200 mb-2 text-sm font-semibold">
                  Game Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-indigo-950/50 border border-indigo-500/50 rounded text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Enter game title"
                  required
                />
              </div>

              <div>
                <label className="block text-indigo-200 mb-2 text-sm font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-indigo-950/50 border border-indigo-500/50 rounded text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Enter game description"
                />
              </div>

              <div>
                <label className="block text-indigo-200 mb-2 text-sm font-semibold">
                  Game File IPFS Hash *
                </label>
                <input
                  type="text"
                  name="ipfsHash"
                  value={formData.ipfsHash}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-indigo-950/50 border border-indigo-500/50 rounded text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Qm... or bafybei..."
                  required
                />
                <p className="text-indigo-300 text-xs mt-1">
                  Upload your .swf file to IPFS (Pinata/Web3.Storage) and paste the hash
                </p>
              </div>

              <div>
                <label className="block text-indigo-200 mb-2 text-sm font-semibold">
                  Thumbnail IPFS Hash
                </label>
                <input
                  type="text"
                  name="thumbnailIpfs"
                  value={formData.thumbnailIpfs}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-indigo-950/50 border border-indigo-500/50 rounded text-white focus:outline-none focus:border-indigo-400"
                  placeholder="Qm... or bafybei..."
                />
              </div>

              <div>
                <label className="block text-indigo-200 mb-2 text-sm font-semibold">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-indigo-950/50 border border-indigo-500/50 rounded text-white focus:outline-none focus:border-indigo-400"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="arcade">Arcade</option>
                  <option value="racing">Racing</option>
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="puzzle">Puzzle</option>
                  <option value="strategy">Strategy</option>
                  <option value="sports">Sports</option>
                  <option value="simulation">Simulation</option>
                  <option value="casino">Casino</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading to Blockchain...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Game
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-indigo-500/30">
              <h3 className="text-indigo-200 font-semibold mb-2 text-sm">
                How to upload files to IPFS:
              </h3>
              <ul className="text-indigo-300 text-xs space-y-1">
                <li>• Pinata: https://pinata.cloud (free tier available)</li>
                <li>• Web3.Storage: https://web3.storage (free)</li>
                <li>• NFT.Storage: https://nft.storage (free)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
