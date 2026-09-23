import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoinIcon from "../../../components/icons/coinIcon";

import ShopItemCard from "../components/ShopItemCard";
import {
  getShopItems,
  purchaseShopItem,
} from "../../../services/api/shopService";
import { getMyStats } from "../../../services/api/userService";

function ShopPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [currencyBalance, setCurrencyBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasingItemId, setPurchasingItemId] = useState(null);
  const [error, setError] = useState("");

  // Ambil daftar item shop dan saldo currency
  useEffect(() => {
    async function fetchShopData() {
      try {
        setIsLoading(true);
        setError("");

        const [shopItems, userStats] = await Promise.all([
          getShopItems(),
          getMyStats(),
        ]);

        setItems(shopItems);
        setCurrencyBalance(userStats?.currencyBalance ?? 0);
      } catch (error) {
        console.error("Gagal mengambil data shop:", error);
        setError("Gagal memuat data shop. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopData();
  }, []);

  // Handler pembelian item
  const handlePurchase = async (item) => {
    if (isPurchasing) return;

    try {
      setIsPurchasing(true);
      setPurchasingItemId(item.id);
      setError("");

      const result = await purchaseShopItem(item.id);

      // Perbarui saldo currency setelah pembelian
      setCurrencyBalance(result?.newCurrencyBalance ?? currencyBalance);

      // Tandai item sebagai sudah dimiliki
      setItems((previousItems) =>
        previousItems.map((shopItem) =>
          shopItem.id === item.id
            ? {
                ...shopItem,
                isOwned: true,
              }
            : shopItem,
        ),
      );

      console.log("Pembelian berhasil:", result);
    } catch (error) {
      console.error("Gagal membeli item:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Pembelian gagal. Silakan coba lagi.";

      setError(errorMessage);
    } finally {
      setIsPurchasing(false);
      setPurchasingItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-8 text-tertiary md:px-12 lg:px-20">
      {/* Header */}
      <div className="relative mb-12 flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="absolute left-0 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary text-4xl leading-none text-white transition hover:scale-105"
          aria-label="Back to home"
        >
          ‹
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-normal md:text-4xl">Shop</h1>

          <p className="mt-4 text-2xl font-medium text-secondary md:text-3xl">
            Collect Your Favorite Avatar
          </p>
        </div>
      </div>

      {/* Currency Balance */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-3 rounded-full bg-tertiary px-6 py-3 text-lg font-medium text-primary">
          <CoinIcon size={24} color="#E5FE96" />

          <span>{currencyBalance} Coins</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-auto mb-6 w-full max-w-4xl rounded-lg bg-secondary px-4 py-3 text-center text-white">
          {error}
        </div>
      )}

      {/* Shop Content */}
      <div className="mx-auto w-full max-w-350 rounded-3xl bg-tertiary p-6 sm:p-8 lg:p-12">
        {isLoading ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-lg text-primary">Loading shop...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-lg text-primary">Belum ada item di shop.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                isPurchasing={isPurchasing && purchasingItemId === item.id}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
