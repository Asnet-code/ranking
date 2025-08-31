"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

type UserOption = { id: string; name: string };
export default function AddCommentForm({ users }: { users: UserOption[] }) {
  const router = useRouter();
  const [userId, setUserId] = useState(users[0]?.id ?? "");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId || !body.trim()) return;
    setLoading(true);
    setErr(null);
    setOk(false);
    try {
      const res = await fetch(`/api/users/${userId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Błąd dodawania komentarza");
      setBody("");
      setOk(true);
      // odśwież ew. cache strony głównej po powrocie
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Użytkownik</label>
        <select
          className="w-full border rounded p-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        >
          {users.map((u) => (
            <option className="text-black" key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Komentarz (od czego zginął)
        </label>
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={4}
          placeholder="Powód śmierci tego minionka."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>

      {err && <p className="text-red-600 text-sm">{err}</p>}
      {ok && (
        <p className="text-green-600 text-sm">Dodano komentarz (+1 śmierć).</p>
      )}

      <button
        type="submit"
        disabled={loading || !userId || !body.trim()}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Dodawanie…" : "Dodaj komentarz"}
      </button>
    </form>
  );
}
