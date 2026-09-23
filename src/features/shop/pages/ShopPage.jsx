import { useEffect, useState } from "react";
import CoinIcon from "../../../components/icons/coinIcon";

import ShopItemCard from "../components/ShopItemCard";
import ShopErrorModal from "../components/ShopErrorModal";
import PageHeader from "../../../components/layout/PageHeader";

import {
  getShopItems,
  purchaseShopItem,
} from "../../../services/api/shopService";
import { getMyStats } from "../../../services/api/userService";

function ShopPage() {
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
    <div className="flex h-dvh flex-col overflow-hidden bg-primary text-tertiary">
      <ShopErrorModal
        isOpen={Boolean(error)}
        message={error}
        onClose={() => setError("")}
      />

      <PageHeader title="Shop" showBackButton={true} backButtonPath="/home" />

      {/* Currency Balance */}
      <div className="flex shrink-0 justify-center px-4 pb-6 pt-2 sm:pb-8">
        <div className="flex items-center gap-2 rounded-full border-2 border-secondary bg-white px-4 py-2 text-base font-medium text-secondary shadow-sm sm:gap-3 sm:px-6 sm:py-3 sm:text-lg">
          <CoinIcon size={20} color="#FE7236" className="sm:h-6 sm:w-6" />

          <span>{currencyBalance} Coins</span>
        </div>
      </div>

      {/* Shop Content */}
      <div className="mx-4 mb-6 flex min-h-0 flex-col overflow-hidden rounded-2xl bg-tertiary p-3 sm:mx-6 sm:rounded-3xl sm:p-6 lg:mx-auto lg:w-full lg:max-w-350 lg:p-10">
        {isLoading ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-lg text-primary">Loading shop...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-lg text-primary">Belum ada item di shop.</p>
          </div>
        ) : (
          <div className="min-h-0 max-h-[55dvh] overflow-y-auto px-2 py-2 sm:max-h-[60dvh] lg:max-h-none lg:flex-1">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
