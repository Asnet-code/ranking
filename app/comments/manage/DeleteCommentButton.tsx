"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCommentButton({
  commentId,
}: {
  commentId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onDelete() {
    if (
      !confirm("Na pewno usunąć komentarz? Zmniejszy to licznik śmierci o 1.")
    )
      return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.error || "Nie udało się usunąć komentarza");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDelete}
        disabled={loading}
        className="
          text-xs px-3 py-1.5 rounded-md font-semibold
          bg-gradient-to-r from-red-500 to-red-600
          text-white shadow hover:from-red-600 hover:to-red-700
          disabled:opacity-50 disabled:cursor-not-allowed
          transition
        "
        title="Usuń komentarz"
      >
        {loading ? "Usuwanie…" : "Usuń"}
      </button>
      {err && <span className="text-xs text-red-400">{err}</span>}
    </div>
  );
}
