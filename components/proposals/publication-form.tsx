"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Publication {
  id?: string
  title: string
  journal: string
  year: number | null
  link: string
  doi: string
}

interface PublicationFormProps {
  publications: Publication[]
  onChange: (publications: Publication[]) => void
}

export function PublicationForm({ publications, onChange }: PublicationFormProps) {
  const [newPublication, setNewPublication] = useState<Publication>({
    title: "",
    journal: "",
    year: null,
    link: "",
    doi: "",
  })

  const addPublication = () => {
    if (newPublication.title) {
      onChange([...publications, { ...newPublication }])
      setNewPublication({ title: "", journal: "", year: null, link: "", doi: "" })
    }
  }

  const removePublication = (index: number) => {
    onChange(publications.filter((_, i) => i !== index))
  }

  const updatePublication = (index: number, field: keyof Publication, value: string | number | null) => {
    const updated = publications.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Related Publications</Label>
        <Button type="button" variant="outline" size="sm" onClick={addPublication}>
          <Plus className="mr-2 h-4 w-4" />
          Add Publication
        </Button>
      </div>

      {/* Add New Publication Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pubTitle">Title *</Label>
              <Input
                id="pubTitle"
                value={newPublication.title}
                onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                placeholder="Publication title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journal">Journal/Conference</Label>
                <Input
                  id="journal"
                  value={newPublication.journal}
                  onChange={(e) => setNewPublication({ ...newPublication, journal: e.target.value })}
                  placeholder="Journal or conference name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newPublication.year || ""}
                  onChange={(e) =>
                    setNewPublication({ ...newPublication, year: Number.parseInt(e.target.value) || null })
                  }
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link">Link/URL</Label>
                <Input
                  id="link"
                  value={newPublication.link}
                  onChange={(e) => setNewPublication({ ...newPublication, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  value={newPublication.doi}
                  onChange={(e) => setNewPublication({ ...newPublication, doi: e.target.value })}
                  placeholder="10.1000/xyz123"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Publications */}
      {publications.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Publications ({publications.length})</Label>
          {publications.map((pub, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={pub.title}
                      onChange={(e) => updatePublication(index, "title", e.target.value)}
                      placeholder="Publication title"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Journal/Conference</Label>
                      <Input
                        value={pub.journal}
                        onChange={(e) => updatePublication(index, "journal", e.target.value)}
                        placeholder="Journal name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={pub.year || ""}
                        onChange={(e) => updatePublication(index, "year", Number.parseInt(e.target.value) || null)}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        value={pub.link}
                        onChange={(e) => updatePublication(index, "link", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2 flex items-end">
                      <div className="flex-1">
                        <Label>DOI</Label>
                        <Input
                          value={pub.doi}
                          onChange={(e) => updatePublication(index, "doi", e.target.value)}
                          placeholder="DOI"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePublication(index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
