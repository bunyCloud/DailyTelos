import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';

export function useRecentTransaction() {
  const addRecentTransaction = useAddRecentTransaction();

  const addTransaction = (hash, description) => {
    addRecentTransaction({
      hash,
      description,
    });
  };

  return {
    addTransaction,
  };
}
