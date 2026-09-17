import DialogBubble from "../../../components/common/dialogBubble";
import { getText } from "../../../utils/text";

/**
 * Lesson component — displays a single material step.
 * @param {{ material: { contentText: object, mediaUrl?: string, orderIndex: number } }} props
 */
export default function Lesson({ material }) {
    if (!material) return null;

    const text = getText(material.contentText);
    const mediaUrl = material.mediaUrl;

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <div className="w-2/3">
                <DialogBubble text={text} />
            </div>
            {mediaUrl && (
                <div className="flex justify-center">
                    <img
                        className="w-1/5 rounded-2xl shadow-lg object-contain"
                        src={mediaUrl}
                        alt={`Ilustrasi materi ${material.orderIndex || ''}`}
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    );
}