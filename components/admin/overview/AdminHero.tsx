import Image from "next/image";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function AdminHero({ name }: { name?: string | null }) {
  const who = name?.split(" ")[0] ?? "there";

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="flex items-start justify-between gap-4 p-1">
        <div className="z-10 max-w-[58%] py-2 pl-1">
          <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight">
            {greeting()}, {who} 👋
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Here&apos;s what&apos;s happening in Paseo today.
          </p>
        </div>
        <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-44">
          <Image
            src="/admin-desert-hero.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
