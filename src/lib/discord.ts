/**
 * Live Discord member counts via the public invite API (no auth, no widget
 * required). Cached for an hour; returns null on any failure so callers can
 * render without the numbers.
 */
export type DiscordCounts = { members: number; online: number };

const INVITE_CODE = "paramarines";

export async function getDiscordCounts(): Promise<DiscordCounts | null> {
  try {
    const res = await fetch(
      `https://discord.com/api/v9/invites/${INVITE_CODE}?with_counts=true`,
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
