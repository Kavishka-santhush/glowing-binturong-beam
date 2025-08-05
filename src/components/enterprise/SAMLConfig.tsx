import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export function SAMLConfig({ organizationId }: { organizationId: string }) {
  const { toast } = useToast()
  const { register, handleSubmit } = useForm()

  const configureSAML = async (data: any) => {
    try {
      const { error } = await supabase.rpc('enable_saml_for_org', {
        org_id: organizationId,
        metadata_url: data.metadataUrl,
        entity_id: data.entityId  
      })
      
      if (error) throw error
      toast({ title: 'SAML configured successfully' })
    } catch (err) {
      toast({ title: 'Configuration failed', description: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(configureSAML)} className="space-y-4">
      <Input
        label="Metadata URL"
        {...register('metadataUrl', { required: true })}
      />
      <Input
        label="Entity ID" 
        {...register('entityId', { required: true })}
      />
      <Button type="submit">Save Configuration</Button>
    </form>
  )
}