"use client"

import ServerInfoCard from "@/components/server-info-card"
import DatabaseInfoCard from "@/components/database-info-card"
import PeopleList from "@/components/people-list"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-row gap-6 w-full justify-center">
        {" "}
        {/* Changed to flex-col and max-w-xs for stacking */}
        <ServerInfoCard />
        <DatabaseInfoCard />
        <PeopleList />
      </div>
    </div>
  )
}
