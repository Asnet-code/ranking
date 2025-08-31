import Image from "next/image";
import prisma from "@/lib/prismadb";

export const runtime = "nodejs";

export default async function Home() {
  const users = await prisma.user.findMany({
    orderBy: [{ deathCount: "desc" }, { createdAt: "asc" }],
    include: {
      profileNotes: {
        orderBy: { createdAt: "desc" },
        select: { id: true, body: true, createdAt: true },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Gracze</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((u) => (
          <div key={u.id} className="border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Image
                src={u.image}
                alt={u.name}
                width={64}
                height={64}
                className="rounded-full border"
              />
              <div className="min-w-0">
                <h2 className="text-lg font-medium truncate">{u.name}</h2>
                <div className="text-sm text-gray-600">
                  Śmierci: <b>{u.deathCount}</b>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium">Komentarze (od czego zginął):</h3>
              {u.profileNotes.length === 0 ? (
                <p className="text-sm text-gray-500">Brak wpisów.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {u.profileNotes.map((c) => (
                    <li key={c.id} className="text-sm border rounded p-2">
                      <div className="whitespace-pre-wrap">{c.body}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
