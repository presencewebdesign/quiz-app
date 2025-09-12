interface ErrorHighlightProps {
  text: string;
  highlightClass?: string;
}

export const ErrorHighlight = ({
  text,
  highlightClass = "error-highlight",
}: ErrorHighlightProps) => {
  const parseText = (text: string) => {
    // Convert "*text*" to highlighted spans
    const parts = text.split(/(\*.*?\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const errorText = part.slice(1, -1);
        return (
          <span key={index} className={highlightClass}>
            {errorText}
          </span>
        );
      }
      return part;
    });
  };

  return <div className="error-highlight-container">{parseText(text)}</div>;
};
