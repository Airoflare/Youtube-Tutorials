import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const people = await prisma.person.findMany()
    return NextResponse.json(people, { headers: { 'Connection': 'close' } })
  } catch (error: any) {
    console.error("Database query error:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch people data", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", 'Connection': 'close' },
    })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    if (!name) {
      return new NextResponse(JSON.stringify({ error: "Name is required" }), { status: 400, headers: { 'Connection': 'close' } })
    }

    const newPerson = await prisma.person.create({
      data: { name },
    })

    return NextResponse.json(newPerson, { status: 201, headers: { 'Connection': 'close' } })
  } catch (error: any) {
    console.error("Database insert error:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to add person", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", 'Connection': 'close' },
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return new NextResponse(JSON.stringify({ error: "ID is required" }), { status: 400, headers: { 'Connection': 'close' } })
    }

    await prisma.person.delete({
      where: { id: parseInt(id, 10) },
    })

    return new NextResponse(null, { status: 204, headers: { 'Connection': 'close' } })
  } catch (error: any) {
    console.error("Database delete error:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to delete person", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", 'Connection': 'close' },
    })
  }
}
