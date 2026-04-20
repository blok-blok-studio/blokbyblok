"use client";

import { useRouter } from "next/navigation";
import { CreateCohortDialog } from "@/components/cohorts/create-cohort-dialog";
import { JoinCohortDialog } from "@/components/cohorts/join-cohort-dialog";

interface CohortActionsProps {
  canCreate: boolean;
}

export function CohortActions({ canCreate }: CohortActionsProps) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="flex items-center gap-2 shrink-0">
      <JoinCohortDialog onJoined={refresh} />
      {canCreate && <CreateCohortDialog onCreated={refresh} />}
    </div>
  );
}
