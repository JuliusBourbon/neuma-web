import { useEffect, useState } from "react";
import CoinIcon from "../../../components/icons/coinIcon";

import ShopItemCard from "../components/ShopItemCard";
import PageHeader from "../../../components/layout/PageHeader";
import ShopModal from "../components/ShopModal";

import {
  getShopItems,
  purchaseShopItem,
} from "../../../services/api/shopService";
import { getMyStats } from "../../../services/api/userService";
import { getText } from "../../../utils/text";

function ShopPage() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const lang = user?.preferredLanguage || 'id';

  const [items, setItems] = useState([]);
  const [currencyBalance, setCurrencyBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasingItemId, setPurchasingItemId] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setModalMessage("");
  };

  // Ambil daftar item shop dan saldo currency
  useEffect(() => {
    async function fetchShopData() {
      try {
        setIsLoading(true);
        setModalType(null);
        setModalMessage("");

        const [shopItems, userStats] = await Promise.all([
          getShopItems(),
          getMyStats(),
        ]);

        setItems(shopItems);
        setCurrencyBalance(userStats?.currencyBalance ?? 0);
      } catch (error) {
        console.error("Gagal mengambil data shop:", error);

        setModalType("error");
        setModalMessage(lang === 'id' ? "Gagal memuat data shop. Silakan coba lagi." : "Failed to load shop data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopData();
  }, []);

  // Handler konfirmasi pembelian
  const handlePurchase = (item) => {
    if (isPurchasing || item.isOwned) return;

    setSelectedItem(item);
    setModalType("confirmation");
    setModalMessage(
      lang === 'id'
        ? `Apakah kamu yakin ingin membeli ${getText(item.name, lang) || "Avatar"} seharga ${item.price} Coins?`
        : `Are you sure you want to buy ${getText(item.name, lang) || "Avatar"} for ${item.price} Coins?`
    );
  };

  // Memproses pembelian setelah user melakukan konfirmasi
  const confirmPurchase = async () => {
    if (!selectedItem || isPurchasing) return;

    try {
      setIsPurchasing(true);
      setPurchasingItemId(selectedItem.id);

      const result = await purchaseShopItem(selectedItem.id);

      // Perbarui saldo currency
      setCurrencyBalance(result?.newCurrencyBalance ?? currencyBalance);

      // Tandai item sebagai sudah dimiliki
      setItems((previousItems) =>
        previousItems.map((shopItem) =>
          shopItem.id === selectedItem.id
            ? {
              ...shopItem,
              isOwned: true,
            }
            : shopItem,
        ),
      );

      // Tutup modal setelah pembelian berhasil
      setSelectedItem(null);
      // Tampilkan modal berhasil
      setModalType("success");
      setModalMessage(
        lang === 'id'
          ? `${getText(selectedItem.name, lang) || "Avatar"} berhasil dibeli!`
          : `${getText(selectedItem.name, lang) || "Avatar"} successfully purchased!`
      );

      console.log("Pembelian berhasil:", result);
    } catch (error) {
      console.error("Gagal membeli item:", error);

      let errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (lang === 'id' ? "Pembelian gagal. Silakan coba lagi." : "Purchase failed. Please try again.");

      if (lang !== 'id' && errorMessage === "Saldo currency tidak mencukupi.") {
        errorMessage = "Insufficient currency balance.";
      }

      // Ubah modal menjadi modal error
      setModalType("error");
      setModalMessage(errorMessage);
    } finally {
      setIsPurchasing(false);
      setPurchasingItemId(null);
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden justify-between bg-primary text-tertiary">
      <ShopModal
        isOpen={Boolean(modalType)}
        type={modalType}
        message={modalMessage}
        item={selectedItem}
        onClose={() => {
          if (isPurchasing) return;

          closeModal();
        }}
        onConfirm={confirmPurchase}
        isConfirming={isPurchasing}
        lang={lang}
      />

      <PageHeader title="Shop" showBackButton={true} backButtonPath="/home" />

      {/* Currency Balance */}
      <div className="flex shrink-0 justify-center px-4 pb-6 pt-2 sm:pb-4">
        <div className="flex items-center gap-2 rounded-full border-2 border-secondary bg-white px-4 py-2 text-base font-medium text-secondary shadow-sm sm:gap-3 sm:px-6 sm:py-3 sm:text-lg">
          <CoinIcon size={20} color="#FE7236" className="sm:h-6 sm:w-6" />

          <span>{currencyBalance} Coins</span>
        </div>
      </div>

      {/* Shop Content */}
      <div className="mx-4 mb-6 flex h-dvh md:min-h-0 flex-col overflow-hidden rounded-2xl bg-tertiary p-3 sm:mx-6 sm:rounded-3xl sm:p-6 lg:mx-auto lg:w-full lg:max-w-350 lg:px-10">
        {isLoading ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-lg text-primary">{lang === 'id' ? "Memuat shop..." : "Loading shop..."}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-lg text-primary">{lang === 'id' ? "Belum ada item di shop." : "No items in the shop yet."}</p>
          </div>
        ) : (
          <div className="min-h-0 md:max-h-[80dvh] overflow-y-auto px-2 py-2 sm:max-h-[60dvh] lg:max-h-none lg:flex-1 custom-scrollbar-primary">
            <div className="grid justify-items-center gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ">
              {items.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  isPurchasing={isPurchasing && purchasingItemId === item.id}
                  onPurchase={handlePurchase}
                  lang={lang}
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
