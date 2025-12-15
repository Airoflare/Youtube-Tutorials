"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, UserPlus, Trash } from "lucide-react"

interface Person {
  id: number;
  name: string;
}

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([])
  const [newName, setNewName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fetchPeople = async () => {
    setError(null)
    try {
      const res = await fetch("/api/people")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: Person[] = await res.json()
      setPeople(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchPeople()
  }, [])

  const handleAddPerson = async () => {
    if (newName.trim() !== "") {
      try {
        const res = await fetch("/api/people", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName.trim() }),
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        setNewName("")
        fetchPeople() // Re-fetch the list to update the UI
      } catch (e: any) {
        setError(e.message)
      }
    }
  }

  const handleDeletePerson = async (id: number) => {
    try {
      const res = await fetch(`/api/people?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      fetchPeople() // Re-fetch the list to update the UI
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddPerson()
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center p-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.6 }}
    >
      <Card className="w-96 bg-background/95 backdrop-blur-sm border border-border shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">People List</span>
          </div>

          {error ? (
            <div className="text-center text-sm text-red-500">Cannot connect to database: {error}</div>
          ) : (
            <>
              <div className="max-h-[120px] overflow-y-auto">
                {people.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No people in the list yet.</p>
                ) : (
                  <ol className="list-decimal list-inside space-y-1 text-sm text-foreground">
                    {people.map((person, index) => (
                      <li key={person.id} className="flex items-center justify-between">
                        <span className="mr-2">{index + 1}. {person.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePerson(person.id)} className="h-6 w-6 mr-2">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="flex w-full space-x-2 mt-4">
                <Input
                  placeholder="Enter new name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow"
                />
                <Button onClick={handleAddPerson} className="h-9 rounded-md px-3">
                  <UserPlus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
