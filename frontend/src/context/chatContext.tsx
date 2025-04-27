// Create a new file called ChatContext.tsx
'use client'

import { createContext, useState, useContext, ReactNode } from 'react'

type ChatContextType = {
  latestRequestId: string | null
  setLatestRequestId: (id: string | null) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [latestRequestId, setLatestRequestId] = useState<string | null>(null)

  return (
    <ChatContext.Provider value={{ latestRequestId, setLatestRequestId }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}