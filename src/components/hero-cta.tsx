"use client";

import { billet, links } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import {
  isApplicant,
  isUnitMember,
  useBilletSession,
} from "@/lib/use-billet-session";

/**
 * Hero call-to-action pair. Recruiting copy for prospects; members get sent
 * to their portal instead of being asked to enlist again, and applicants are
 * pointed back at the application they started.
 */
export function HeroCta() {
  const session = useBilletSession();
  const member = isUnitMember(session);
  const applicant = isApplicant(session);

  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      {member ? (
        <ButtonLink href={billet.base} variant="primary" size="lg">
          Open your portal
        </ButtonLink>
      ) : (
        <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
          {applicant ? "Finish applying" : "Enlist Now"}
        </ButtonLink>
      )}
      <ButtonLink href={links.discord} variant="secondary" size="lg">
        Join our Discord
      </ButtonLink>
    </div>
  );
}
