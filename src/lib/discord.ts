/**
 * Live Discord member counts via the public invite API (no auth, no widget
 * required). Cached for an hour; returns null on any failure so callers can
 * render without the numbers.
 */
export type DiscordCounts = { members: number; online: number };

const FALLBACK_INVITE_CODE = "paramarines";

/** Pull the invite code out of a discord.gg / discord.com invite URL. */
export function inviteCodeFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/(?:discord\.gg|discord\.com\/invite)\/([\w-]+)/i);
  return m ? m[1] : null;
}

export async function getDiscordCounts(
  inviteCode: string | null = null,
): Promise<DiscordCounts | null> {
  try {
    const code = inviteCode ?? FALLBACK_INVITE_CODE;
    const res = await fetch(
      `https://discord.com/api/v9/invites/${code}?with_counts=true`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      approximate_member_count?: number;
      approximate_presence_count?: number;
    };
    if (!data.approximate_member_count) return null;
    return {
      members: data.approximate_member_count,
      online: data.approximate_presence_count ?? 0,
    };
  } catch {
    return null;
  }
}
