export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prismadb";
import Image from "next/image";
import DeleteCommentButton from "./DeleteCommentButton";

export default async function ManageCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      targetUser: {
        select: { id: true, name: true, image: true, deathCount: true },
      },
    },
  });

  return (
    <div className="relative min-h-screen">
      {/* TŁO (jak na stronie głównej) */}
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

      <div className="max-w-3xl mx-auto p-6 space-y-5 text-white">
        <h1 className="text-3xl font-bold tracking-tight text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 drop-shadow">
            Zarządzanie komentarzami
          </span>
        </h1>
        <p className="text-sm text-white/70 text-center">
          Usuń komentarz, jeśli był omyłkowy — licznik śmierci spadnie o 1.
        </p>

        {comments.length === 0 ? (
          <p className="text-sm text-white/70 text-center">
            Brak komentarzy do wyświetlenia.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border ring-1 ring-white/10 bg-gradient-to-br from-[#0b0f1a] via-[#0d1222] to-[#10162b] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={c.targetUser.image}
                    alt={c.targetUser.name}
                    width={48}
                    height={48}
                    className="rounded-full border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="font-medium">{c.targetUser.name}</span>
                        <span className="text-xs text-white/60 ml-2">
                          (Śmierci teraz: {c.targetUser.deathCount})
                        </span>
                      </div>
                      <DeleteCommentButton commentId={c.id} />
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-white/90">
                      {c.body}
                    </p>
                    <div className="text-xs text-white/40 mt-2">
                      {new Date(c.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-10 border-t border-white/10 pt-6 text-center">
          <a
            href="/"
            className="text-white/90 underline underline-offset-4 decoration-white/40 hover:decoration-white transition"
          >
            ← Wróć na stronę główną
          </a>
        </footer>
      </div>
    </div>
  );
}
