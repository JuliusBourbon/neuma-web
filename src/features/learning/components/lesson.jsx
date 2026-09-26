import DialogBubble from "../../../components/common/dialogBubble";
import { getText } from "../../../utils/text";

/**
 * Lesson component — displays a single material step.
 * @param {{ material: { contentText: object, mediaUrl?: string, orderIndex: number } }} props
 */
export default function Lesson({ material, lang = 'id' }) {
    if (!material) return null;

    const text = getText(material.contentText, lang);
    const mediaUrl = material.mediaUrl;

    if (!mediaUrl) {
        return (
            <div className="w-full flex-1 my-auto flex flex-col items-center justify-center">
                <div className="w-full px-4 md:px-0 md:w-4/5 lg:w-2/3">
                    <DialogBubble text={text} className="mb-0" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center md:gap-5">
            <div className="w-full px-1 md:px-0 md:w-4/5 lg:w-2/3">
                <DialogBubble text={text} />
            </div>
            <div className="flex justify-center">
                <img
                    className="w-3/5 md:w-1/3 lg:w-1/5 rounded-2xl shadow-lg object-contain"
                    src={mediaUrl}
                    alt={lang === 'id' ? `Ilustrasi materi ${material.orderIndex || ''}` : `Illustration for material ${material.orderIndex || ''}`}
                    loading="lazy"
                />
            </div>
        </div>
    );
}