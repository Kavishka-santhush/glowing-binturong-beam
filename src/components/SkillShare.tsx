import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { showSuccess } from '@/utils/toast'

export function SkillShare({ skillId }: { skillId: string }) {
  const [open, setOpen] = useState(false)
  const shareUrl = `${window.location.origin}/skill/${skillId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    showSuccess('Link copied to clipboard!')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Skill</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}