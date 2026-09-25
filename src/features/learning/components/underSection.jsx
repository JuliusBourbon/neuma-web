import ActionButton from "../../../components/common/actionButton";

/**
 * Bottom navigation bar with Back and Next buttons.
 * @param {{
 *   onBack: () => void,
 *   onNext: () => void,
 *   canGoBack: boolean,
 *   canGoNext: boolean,
 *   nextLabel: string,
 *   isLoading: boolean,
 * }} props
 */
export default function UnderSection({
    onBack,
    onNext,
    canGoBack = true,
    canGoNext = true,
    nextLabel = "Lanjut",
    isLoading = false,
    lang = 'id',
}) {
    return (
        <div className="w-full">
            <hr className="w-full border-tertiary/80" />
            <div className="flex justify-between mx-6 sm:mx-16">
                <ActionButton
                    text={lang === 'id' ? "Kembali" : "Back"}
                    classes="bg-tertiary text-white py-2 px-12 sm:px-24 rounded-lg my-3 sm:my-6"
                    onClick={onBack}
                    disabled={!canGoBack}
                    svg={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    }
                />
                <ActionButton
                    text={isLoading ? (lang === 'id' ? "Memproses..." : "Processing...") : nextLabel}
                    classes="bg-secondary text-white py-2 px-12 sm:px-24 rounded-lg my-3 sm:my-6"
                    onClick={onNext}
                    disabled={!canGoNext || isLoading}
                    svg={
                        !isLoading && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        )
                    }
                />
            </div>
        </div>
    );
}