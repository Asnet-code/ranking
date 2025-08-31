"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("/avatars/default.png"); // ścieżka z /public
  const [role, setRole] = useState<"ADMIN" | "PLAYER">("PLAYER");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Błąd tworzenia");
      router.push("/"); // powrót na listę
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Utwórz użytkownika</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nazwa</label>
          <input
            className="w-full border rounded p-2"
            placeholder="np. Jan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Ścieżka obrazka (z /public)
          </label>
          <input
            className="w-full border rounded p-2"
            placeholder="/avatars/jan.png"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Podaj ścieżkę zaczynającą od „/”, np. <code>/avatars/jan.png</code>
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1">Rola</label>
          <select
            className="w-full border rounded p-2"
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "PLAYER")}
          >
            <option value="PLAYER">PLAYER (użytkownik)</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Tworzenie…" : "Utwórz"}
        </button>
      </form>
    </div>
  );
}
