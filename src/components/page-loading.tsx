export function PageLoading({ label = "Memuat..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#FEFBF5]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F0E8D8] border-t-[#F5A62A]" />
        <p className="text-sm font-semibold text-[#5C4813]">{label}</p>
      </div>
    </div>
  );
}
