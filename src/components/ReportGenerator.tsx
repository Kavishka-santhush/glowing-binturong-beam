import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { showLoading, dismissToast, showSuccess, showError } from '@/utils/toast'
import { format } from 'date-fns'

export function ReportGenerator() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  })
  const [reportType, setReportType] = useState('progress')
  const [formatType, setFormatType] = useState('pdf')
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    const toastId = showLoading('Generating report...')
    setLoading(true)
    try {
      const { data } = await supabase.functions.invoke('generate-report', {
        body: {
          userId: user.id,
          startDate: format(dateRange.from, 'yyyy-MM-dd'),
          endDate: format(dateRange.to, 'yyyy-MM-dd'),
          reportType,
          format: formatType
        }
      })

      if (data.error) throw data.error
      
      // Download the report
      const link = document.createElement('a')
      link.href = data.url
      link.download = `skill-report-${format(new Date(), 'yyyyMMdd')}.${formatType}`
      link.click()
      
      showSuccess('Report generated successfully!')
    } catch (err) {
      showError(err.message)
    } finally {
      dismissToast(toastId)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-medium">Generate Custom Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress Summary</SelectItem>
              <SelectItem value="skills">Skills Breakdown</SelectItem>
              <SelectItem value="team">Team Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select value={formatType} onValueChange={setFormatType}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={generateReport} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Report'}
      </Button>
    </div>
  )
}