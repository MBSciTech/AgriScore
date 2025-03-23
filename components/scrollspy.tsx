"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ScrollSpyProps {
  sections: {
    id: string
    label: string
  }[]
}

export default function ScrollSpy({ sections }: ScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -80% 0px",
      }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (element) observer.unobserve(element)
      })
    }
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:block">
      <div className="flex flex-col space-y-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="ghost"
            size="sm"
            className={cn(
              "justify-start px-3 py-1 h-auto",
              activeSection === section.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => scrollToSection(section.id)}
          >
            {section.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

