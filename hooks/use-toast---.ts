"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = React.useCallback((props: ToastProps) => {
    // Simple toast implementation - in a real app, you'd use a proper toast library
    console.log("Toast:", props)

    // Create a simple alert for now
    if (props.variant === "destructive") {
      alert(`Error: ${props.title}\n${props.description}`)
    } else {
      alert(`${props.title}\n${props.description}`)
    }
  }, [])

  return { toast }
}
