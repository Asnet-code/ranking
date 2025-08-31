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

  const maxDeath = users[0]?.deathCount ?? 0;

  return (
    <div className="relative min-h-screen">
      {/* TŁO */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070a12] via-[#0a0f1d] to-[#0c1224]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse at center, black 60%, transparent 100%)",
          }}
        />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[70%] bg-[radial-gradient(600px_circle_at_center,rgba(88,101,242,0.18),transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 drop-shadow">
            Hardcore Minecraft
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch gap-8">
          {users.map((u) => {
            const isTop = u.deathCount === maxDeath && maxDeath > 0;
            return (
              <div
                key={u.id}
                className="
        relative flex h-full w-full flex-col overflow-hidden rounded-2xl border
        bg-gradient-to-br from-[#0b0f1a] via-[#0d1222] to-[#10162b]
        text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)] ring-1 ring-white/10
      "
              >
                {/* Odznaka wewnątrz karty – nad zdjęciem */}
                {isTop && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide
              bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-black shadow
              ring-1 ring-yellow-200/60 animate-pulse"
                    >
                      ⭐ Gwiazda
                    </span>
                  </div>
                )}

                {/* Aura hover */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_-20%,rgba(88,101,242,0.25),transparent_60%)] opacity-0 transition-opacity duration-500 hover:opacity-100" />

                {/* Profil */}
                <div className="flex flex-col items-center gap-4 p-6 pt-12">
                  <div className="relative">
                    <Image
                      src={u.image}
                      alt={u.name}
                      width={176}
                      height={176}
                      className="h-44 w-44 rounded-2xl object-cover border border-white/10 shadow-[0_10px_40px_-10px_rgba(88,101,242,0.45)]"
                    />
                    <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-cyan-500/10 blur-[18px]" />
                  </div>

                  <div className="text-center min-h-[2.25rem] flex items-center justify-center">
                    <h2 className="text-xl font-semibold tracking-wide line-clamp-1">
                      {u.name}
                    </h2>
                  </div>

                  <div className="mt-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
                      <span className="text-xs uppercase tracking-widest text-white/70">
                        Śmierci
                      </span>
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 drop-shadow">
                        {u.deathCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Komentarze */}
                <div className="flex min-h-[220px] flex-1 flex-col p-6">
                  <h3 className="mb-3 text-sm font-medium tracking-wide text-white/80">
                    Powód:
                  </h3>
                  {u.profileNotes.length === 0 ? (
                    <p className="text-sm text-white/60">Brak wpisów.</p>
                  ) : (
                    <ul className="space-y-3 overflow-y-auto pr-1">
                      {u.profileNotes.map((c) => (
                        <li
                          key={c.id}
                          className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap text-white/90">
                            {c.body}
                          </div>
                          <div className="mt-2 text-[11px] uppercase tracking-wider text-white/40">
                            {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* STOPKA */}
        <footer className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-white/90">
            <a
              href="/comments"
              className="underline underline-offset-4 decoration-white/40 hover:decoration-white transition"
            >
              Dodaj komentarz
            </a>
            <span className="mx-3 text-white/40">•</span>
            <a
              href="/comments/manage"
              className="underline underline-offset-4 decoration-white/40 hover:decoration-white transition"
            >
              Zarządzaj komentarzami
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
