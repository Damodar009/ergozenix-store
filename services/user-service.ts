import type { User } from "@/models/user"

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
]

export class UserService {
  static async getUser(id: string): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockUsers.find((u) => u.id === id) || null
  }

  static async getAllUsers(): Promise<User[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockUsers
  }

  static async createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUsers.push(newUser)
    return newUser
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const user = mockUsers.find((u) => u.id === id)
    if (!user) return null

    const updated = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    }

    const index = mockUsers.findIndex((u) => u.id === id)
    mockUsers[index] = updated
    return updated
  }

  static async deleteUser(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) return false

    mockUsers.splice(index, 1)
    return true
  }
}
