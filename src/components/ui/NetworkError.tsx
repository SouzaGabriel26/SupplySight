import { Button } from "@/components/ui/button";
import { RefreshCw, WifiOff } from "lucide-react";

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
  isOffline?: boolean;
}

export function NetworkError({
  message,
  onRetry,
  isOffline = false,
}: NetworkErrorProps) {
  const getErrorMessage = () => {
    if (isOffline) {
      return "You appear to be offline. Please check your internet connection.";
    }
    return (
      message ||
      "Network error occurred. Please check your connection and try again."
    );
  };

  const getIcon = () => {
    return isOffline ? (
      <WifiOff className="h-8 w-8 text-orange-500" />
    ) : (
      <WifiOff className="h-8 w-8 text-red-500" />
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mx-auto mb-4">{getIcon()}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isOffline ? "You're Offline" : "Network Error"}
        </h3>
        <p className="text-gray-600 mb-4">{getErrorMessage()}</p>
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2 mx-auto">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
