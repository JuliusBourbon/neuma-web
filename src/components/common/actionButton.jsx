export default function ActionButton({ text, classes = '', onClick = () => { }, type = 'button', disabled = false, svg = '' }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${classes} cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition duration-200`}
        >
            <div className="flex items-center gap-2 justify-center">{svg}{text}</div>
        </button>
    )
}