// FullPageSpinner.tsx
import { TailSpin } from "react-loader-spinner";

// Full-screen spinner (blocks the entire viewport)
export const FullPageSpinner = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
      <TailSpin height="50" width="50" color="#4F46E5" ariaLabel="loading" />
      <p className="mt-4 text-sm font-medium text-gray-600">{text}</p>
    </div>
  );
};

// Inline/compact spinner (for cards, buttons, tables, etc.)
export const InlineSpinner = ({ size = 24, color = "#4F46E5" }: { size?: number; color?: string }) => {
  return (
    <div className="flex items-center justify-center">
      <TailSpin height={size} width={size} color={color} ariaLabel="loading" />
    </div>
  );
};

// Optional: Default export remains the full-page version for backward compatibility
export default FullPageSpinner;