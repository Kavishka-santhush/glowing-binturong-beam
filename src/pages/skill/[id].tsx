// Add state for dialogs
const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

// Update delete buttons:
<Button 
  variant="ghost" 
  size="sm"
  onClick={() => setDeleteResourceId(resource.id)}
>
  Delete
</Button>

<Button 
  variant="ghost" 
  size="sm"
  onClick={() => setDeleteProjectId(project.id)}
>
  Delete
</Button>

// Add dialogs at the bottom of the component return:
<ConfirmDialog
  open={!!deleteResourceId}
  onOpenChange={(open) => !open && setDeleteResourceId(null)}
  onConfirm={() => {
    if (deleteResourceId) {
      deleteResource(deleteResourceId);
      setDeleteResourceId(null);
    }
  }}
  title="Delete Resource"
  description="Are you sure you want to delete this resource?"
/>

<ConfirmDialog
  open={!!deleteProjectId}
  onOpenChange={(open) => !open && setDeleteProjectId(null)}
  onConfirm={() => {
    if (deleteProjectId) {
      deleteProject(deleteProjectId);
      setDeleteProjectId(null);
    }
  }}
  title="Delete Project"
  description="Are you sure you want to delete this project?"
/>