"use client"
import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Download,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  StickyNote,
  Bell,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Lead, LeadSource, LeadStatus, User } from "@/types/Leads"
type SortDirection = "asc" | "desc" | null
type SortField = "id" | "name" | "email" | "town" | "status" | "source" | "assignedUser" | "occupation" | "company" | "interest" | "created_at" | "updated_at"

interface ColumnVisibility {
  id: boolean
  name: boolean
  email: boolean
  phone: boolean
  whatsapp: boolean
  status: boolean
  source: boolean
  assignedTo: boolean
  town: boolean
  address: boolean
  occupation: boolean
  company: boolean
  interest: boolean
  createdAt: boolean
  updatedAt: boolean
  notes: boolean
  calls: boolean
  reminders: boolean
}

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Proposal Sent": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Negotiation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  Won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  Lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

//Now, the LeadsTable component
export function LeadsTable({ leadsdata, users, lead_statuses, leadSources, leadStatus }: { leadsdata: Lead[], users: User[], lead_statuses: LeadStatus[], leadSources: LeadSource[], leadStatus: LeadStatus }) {
  const allLeads = leadsdata;
  const leadStatuses = lead_statuses;
  void leadStatus; // Intentionally unused parameter
  // Filters
  const [globalSearch, setGlobalSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([])
  const [selectedSources, setSelectedSources] = useState<number[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [selectedTowns, setSelectedTowns] = useState<string[]>([])
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [createdDateRange, setCreatedDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [updatedDateRange, setUpdatedDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [hasNotes, setHasNotes] = useState<boolean | null>(null)
  const [hasCalls, setHasCalls] = useState<boolean | null>(null)
  const [hasReminders, setHasReminders] = useState<boolean | null>(null)
  const [hasCompletedReminders, setHasCompletedReminders] = useState<boolean | null>(null)

  // Sorting
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Column visibility
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    name: true,
    email: true,
    phone: true,
    whatsapp: false,
    status: true,
    source: true,
    assignedTo: true,
    town: true,
    address: false,
    occupation: true,
    company: true,
    interest: false,
    createdAt: true,
    updatedAt: false,
    notes: true,
    calls: true,
    reminders: true,
  })

  // Selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Get unique values for filters
  const uniqueTowns = useMemo(() => [...new Set(allLeads.map((l) => l.town))].sort(), [allLeads])
  const uniqueOccupations = useMemo(() => [...new Set(allLeads.map((l) => l.profile?.occupation).filter(Boolean))].sort() as string[], [allLeads])
  const uniqueCompanies = useMemo(() => [...new Set(allLeads.map((l) => l.profile?.company).filter(Boolean))].sort() as string[], [allLeads])
  const uniqueInterests = useMemo(() => [...new Set(allLeads.map((l) => l.profile?.interest).filter(Boolean))].sort() as string[], [allLeads])

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...allLeads]

    // Global search
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      data = data.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.phone.includes(search) ||
          lead.town.toLowerCase().includes(search) ||
          lead.profile?.company?.toLowerCase().includes(search) ||
          lead.profile?.occupation?.toLowerCase().includes(search)
      )
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      data = data.filter((lead) => selectedStatuses.includes(lead.status_id))
    }

    // Source filter
    if (selectedSources.length > 0) {
      data = data.filter((lead) => selectedSources.includes(lead.source_id))
    }

    // Assigned user filter
    if (selectedUsers.length > 0) {
      data = data.filter((lead) => selectedUsers.includes(lead.assigned_to))
    }

    // Town filter
    if (selectedTowns.length > 0) {
      data = data.filter((lead) => selectedTowns.includes(lead.town))
    }

    // Occupation filter
    if (selectedOccupations.length > 0) {
      data = data.filter((lead) => lead.profile && selectedOccupations.includes(lead.profile.occupation))
    }

    // Company filter
    if (selectedCompanies.length > 0) {
      data = data.filter((lead) => lead.profile && selectedCompanies.includes(lead.profile.company))
    }

    // Interest filter
    if (selectedInterests.length > 0) {
      data = data.filter((lead) => lead.profile && selectedInterests.includes(lead.profile.interest))
    }

    // Created date range filter
    if (createdDateRange.from) {
      data = data.filter((lead) => new Date(lead.created_at) >= createdDateRange.from!)
    }
    if (createdDateRange.to) {
      data = data.filter((lead) => new Date(lead.created_at) <= createdDateRange.to!)
    }

    // Updated date range filter
    if (updatedDateRange.from) {
      data = data.filter((lead) => new Date(lead.updated_at) >= updatedDateRange.from!)
    }
    if (updatedDateRange.to) {
      data = data.filter((lead) => new Date(lead.updated_at) <= updatedDateRange.to!)
    }

    // Has notes filter
    if (hasNotes === true) {
      data = data.filter((lead) => lead.notes && lead.notes.length > 0)
    } else if (hasNotes === false) {
      data = data.filter((lead) => !lead.notes || lead.notes.length === 0)
    }

    // Has calls filter
    if (hasCalls === true) {
      data = data.filter((lead) => lead.calls && lead.calls.length > 0)
    } else if (hasCalls === false) {
      data = data.filter((lead) => !lead.calls || lead.calls.length === 0)
    }

    // Has reminders filter
    if (hasReminders === true) {
      data = data.filter((lead) => lead.reminders && lead.reminders.length > 0)
    } else if (hasReminders === false) {
      data = data.filter((lead) => !lead.reminders || lead.reminders.length === 0)
    }

    // Has completed reminders filter
    if (hasCompletedReminders === true) {
      data = data.filter((lead) => lead.reminders?.some((r) => r.is_completed))
    } else if (hasCompletedReminders === false) {
      data = data.filter((lead) => lead.reminders?.some((r) => !r.is_completed))
    }

    // Sorting
    if (sortField && sortDirection) {
      data.sort((a, b) => {
        let aVal: string | number | undefined
        let bVal: string | number | undefined

        switch (sortField) {
          case "status":
            aVal = a.status?.name
            bVal = b.status?.name
            break
          case "source":
            aVal = a.source?.name
            bVal = b.source?.name
            break
          case "assignedUser":
            aVal = users.find((u) => u.id === a.assigned_to)?.name
            bVal = users.find((u) => u.id === b.assigned_to)?.name
            break
          case "occupation":
            aVal = a.profile?.occupation
            bVal = b.profile?.occupation
            break
          case "company":
            aVal = a.profile?.company
            bVal = b.profile?.company
            break
          case "interest":
            aVal = a.profile?.interest
            bVal = b.profile?.interest
            break
          default:
            aVal = a[sortField as keyof Lead] as string | number
            bVal = b[sortField as keyof Lead] as string | number
        }

        if (aVal === undefined) return 1
        if (bVal === undefined) return -1

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }

        return sortDirection === "asc"
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number)
      })
    }

    return data
  }, [
    allLeads,
    globalSearch,
    selectedStatuses,
    selectedSources,
    selectedUsers,
    selectedTowns,
    selectedOccupations,
    selectedCompanies,
    selectedInterests,
    createdDateRange,
    updatedDateRange,
    hasNotes,
    hasCalls,
    hasReminders,
    hasCompletedReminders,
    sortField,
    sortDirection,
    users,
  ])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])
  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    if (sortDirection === "asc") return <ArrowUp className="ml-1 h-3 w-3" />
    return <ArrowDown className="ml-1 h-3 w-3" />
  }

  const clearAllFilters = () => {
    setGlobalSearch("")
    setSelectedStatuses([])
    setSelectedSources([])
    setSelectedUsers([])
    setSelectedTowns([])
    setSelectedOccupations([])
    setSelectedCompanies([])
    setSelectedInterests([])
    setCreatedDateRange({ from: undefined, to: undefined })
    setUpdatedDateRange({ from: undefined, to: undefined })
    setHasNotes(null)
    setHasCalls(null)
    setHasReminders(null)
    setHasCompletedReminders(null)
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    selectedStatuses.length > 0,
    selectedSources.length > 0,
    selectedUsers.length > 0,
    selectedTowns.length > 0,
    selectedOccupations.length > 0,
    selectedCompanies.length > 0,
    selectedInterests.length > 0,
    createdDateRange.from || createdDateRange.to,
    updatedDateRange.from || updatedDateRange.to,
    hasNotes !== null,
    hasCalls !== null,
    hasReminders !== null,
    hasCompletedReminders !== null,
  ].filter(Boolean).length

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(paginatedData.map((l) => l.id))
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Source", "Assigned To", "Town", "Company", "Created At"]
    const rows = filteredData.map((lead) => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.status?.name || "",
      lead.source?.name || "",
      users.find((u) => u.id === lead.assigned_to)?.name || "",
      lead.town,
      lead.profile?.company || "",
      format(new Date(lead.created_at), "yyyy-MM-dd"),
    ])
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, email, phone, town, company..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Advanced Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs" variant="secondary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Advanced Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear all
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {leadStatuses.map((status) => (
                        <div key={status.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status.id}`}
                            checked={selectedStatuses.includes(status.id)}
                            onCheckedChange={(checked) => {
                              setSelectedStatuses(
                                checked
                                  ? [...selectedStatuses, status.id]
                                  : selectedStatuses.filter((id) => id !== status.id)
                              )
                              setCurrentPage(1)
                            }}
                          />
                          <label htmlFor={`status-${status.id}`} className="text-sm">
                            {status.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Source Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source</label>
                    <div className="grid grid-cols-2 gap-2">
                      {leadSources.map((source) => (
                        <div key={source.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`source-${source.id}`}
                            checked={selectedSources.includes(source.id)}
                            onCheckedChange={(checked) => {
                              setSelectedSources(
                                checked
                                  ? [...selectedSources, source.id]
                                  : selectedSources.filter((id) => id !== source.id)
                              )
                              setCurrentPage(1)
                            }}
                          />
                          <label htmlFor={`source-${source.id}`} className="text-sm">
                            {source.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assigned To Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assigned To</label>
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => {
                              setSelectedUsers(
                                checked
                                  ? [...selectedUsers, user.id]
                                  : selectedUsers.filter((id) => id !== user.id)
                              )
                              setCurrentPage(1)
                            }}
                          />
                          <label htmlFor={`user-${user.id}`} className="text-sm">
                            {user.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Town Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Town</label>
                    <Select
                      value={selectedTowns.join(",")}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedTowns([])
                        } else {
                          setSelectedTowns(value ? value.split(",") : [])
                        }
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select towns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All towns</SelectItem>
                        {uniqueTowns.map((town) => (
                          <SelectItem key={town} value={town}>
                            {town}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Occupation Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Occupation</label>
                    <Select
                      value={selectedOccupations.join(",")}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedOccupations([])
                        } else {
                          setSelectedOccupations(value ? value.split(",") : [])
                        }
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select occupations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All occupations</SelectItem>
                        {uniqueOccupations.map((occupation) => (
                          <SelectItem key={occupation} value={occupation}>
                            {occupation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <Select
                      value={selectedCompanies.join(",")}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedCompanies([])
                        } else {
                          setSelectedCompanies(value ? value.split(",") : [])
                        }
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All companies</SelectItem>
                        {uniqueCompanies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Interest Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Interest</label>
                    <Select
                      value={selectedInterests.join(",")}
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedInterests([])
                        } else {
                          setSelectedInterests(value ? value.split(",") : [])
                        }
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All interests</SelectItem>
                        {uniqueInterests.map((interest) => (
                          <SelectItem key={interest} value={interest}>
                            {interest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Created Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Created Date</label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {createdDateRange.from ? format(createdDateRange.from, "MMM dd, yyyy") : "From"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={createdDateRange.from}
                            onSelect={(date) => {
                              setCreatedDateRange((prev) => ({ ...prev, from: date }))
                              setCurrentPage(1)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {createdDateRange.to ? format(createdDateRange.to, "MMM dd, yyyy") : "To"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={createdDateRange.to}
                            onSelect={(date) => {
                              setCreatedDateRange((prev) => ({ ...prev, to: date }))
                              setCurrentPage(1)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Updated Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Updated Date</label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {updatedDateRange.from ? format(updatedDateRange.from, "MMM dd, yyyy") : "From"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={updatedDateRange.from}
                            onSelect={(date) => {
                              setUpdatedDateRange((prev) => ({ ...prev, from: date }))
                              setCurrentPage(1)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 justify-start text-left font-normal bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {updatedDateRange.to ? format(updatedDateRange.to, "MMM dd, yyyy") : "To"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={updatedDateRange.to}
                            onSelect={(date) => {
                              setUpdatedDateRange((prev) => ({ ...prev, to: date }))
                              setCurrentPage(1)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Activity Filters */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Activity</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Has Notes</span>
                        <Select
                          value={hasNotes === null ? "any" : hasNotes ? "yes" : "no"}
                          onValueChange={(v) => {
                            setHasNotes(v === "any" ? null : v === "yes")
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Has Calls</span>
                        <Select
                          value={hasCalls === null ? "any" : hasCalls ? "yes" : "no"}
                          onValueChange={(v) => {
                            setHasCalls(v === "any" ? null : v === "yes")
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Has Reminders</span>
                        <Select
                          value={hasReminders === null ? "any" : hasReminders ? "yes" : "no"}
                          onValueChange={(v) => {
                            setHasReminders(v === "any" ? null : v === "yes")
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed Reminders</span>
                        <Select
                          value={hasCompletedReminders === null ? "any" : hasCompletedReminders ? "yes" : "no"}
                          onValueChange={(v) => {
                            setHasCompletedReminders(v === "any" ? null : v === "yes")
                            setCurrentPage(1)
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setColumnVisibility((prev) => ({ ...prev, [key]: checked }))
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedStatuses.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Status: {selectedStatuses.map((id) => leadStatuses.find((s) => s.id === id)?.name).join(", ")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedStatuses([])
                  setCurrentPage(1)
                }}
              />
            </Badge>
          )}
          {selectedSources.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Source: {selectedSources.map((id) => leadSources.find((s) => s.id === id)?.name).join(", ")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedSources([])
                  setCurrentPage(1)
                }}
              />
            </Badge>
          )}
          {selectedUsers.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Assigned: {selectedUsers.map((id) => users.find((u) => u.id === id)?.name).join(", ")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedUsers([])
                  setCurrentPage(1)
                }}
              />
            </Badge>
          )}
          {selectedTowns.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Town: {selectedTowns.join(", ")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedTowns([])
                  setCurrentPage(1)
                }}
              />
            </Badge>
          )}
          {(createdDateRange.from || createdDateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Created: {createdDateRange.from ? format(createdDateRange.from, "MMM dd") : "Start"} -{" "}
              {createdDateRange.to ? format(createdDateRange.to, "MMM dd") : "End"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setCreatedDateRange({ from: undefined, to: undefined })
                  setCurrentPage(1)
                }}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {leadsdata.length} leads
          {filteredData.length !== allLeads.length && ` (filtered from ${allLeads.length} total)`}
        </div>
        {selectedRows.length > 0 && (
          <div className="text-primary">{selectedRows.length} selected</div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {columnVisibility.id && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.name && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Name {getSortIcon("name")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.email && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("email")}>
                    <div className="flex items-center">
                      Email {getSortIcon("email")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.phone && <TableHead>Phone</TableHead>}
                {columnVisibility.whatsapp && <TableHead>WhatsApp</TableHead>}
                {columnVisibility.status && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status {getSortIcon("status")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.source && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("source")}>
                    <div className="flex items-center">
                      Source {getSortIcon("source")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.assignedTo && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("assignedUser")}>
                    <div className="flex items-center">
                      Assigned To {getSortIcon("assignedUser")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.town && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("town")}>
                    <div className="flex items-center">
                      Town {getSortIcon("town")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.address && <TableHead>Address</TableHead>}
                {columnVisibility.occupation && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("occupation")}>
                    <div className="flex items-center">
                      Occupation {getSortIcon("occupation")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.company && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("company")}>
                    <div className="flex items-center">
                      Company {getSortIcon("company")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.interest && <TableHead>Interest</TableHead>}
                {columnVisibility.createdAt && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center">
                      Created {getSortIcon("created_at")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.updatedAt && (
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("updated_at")}>
                    <div className="flex items-center">
                      Updated {getSortIcon("updated_at")}
                    </div>
                  </TableHead>
                )}
                {columnVisibility.notes && <TableHead className="text-center">Notes</TableHead>}
                {columnVisibility.calls && <TableHead className="text-center">Calls</TableHead>}
                {columnVisibility.reminders && <TableHead className="text-center">Reminders</TableHead>}
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} className="h-24 text-center">
                    No leads found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((lead) => (
                  <TableRow key={lead.id} className={cn(selectedRows.includes(lead.id) && "bg-muted/50")}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(lead.id)}
                        onCheckedChange={(checked) => {
                          setSelectedRows(
                            checked
                              ? [...selectedRows, lead.id]
                              : selectedRows.filter((id) => id !== lead.id)
                          )
                        }}
                      />
                    </TableCell>
                    {columnVisibility.id && <TableCell className="font-medium">#{lead.id}</TableCell>}
                    {columnVisibility.name && <TableCell className="font-medium">{lead.name}</TableCell>}
                    {columnVisibility.email && (
                      <TableCell>
                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                          {lead.email}
                        </a>
                      </TableCell>
                    )}
                    {columnVisibility.phone && (
                      <TableCell>
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </a>
                      </TableCell>
                    )}
                    {columnVisibility.whatsapp && (
                      <TableCell>
                        <a
                          href={`https://wa.me/${lead.whatsapp_number.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 hover:underline"
                        >
                          <MessageSquare className="h-3 w-3" />
                          {lead.whatsapp_number}
                        </a>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge className={cn("text-xs", statusColors[lead.status?.name || ""])}>
                          {lead.status?.name}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.source && (
                      <TableCell>
                        <Badge variant="outline">{lead.source?.name}</Badge>
                      </TableCell>
                    )}
                    {columnVisibility.assignedTo && (
                      <TableCell>{users.find((u) => u.id === lead.assigned_to)?.name}</TableCell>
                    )}
                    {columnVisibility.town && <TableCell>{lead.town}</TableCell>}
                    {columnVisibility.address && <TableCell className="max-w-[200px] truncate">{lead.address}</TableCell>}
                    {columnVisibility.occupation && <TableCell>{lead.profile?.occupation}</TableCell>}
                    {columnVisibility.company && <TableCell>{lead.profile?.company}</TableCell>}
                    {columnVisibility.interest && <TableCell>{lead.profile?.interest}</TableCell>}
                    {columnVisibility.createdAt && (
                      <TableCell>{format(new Date(lead.created_at), "MMM dd, yyyy")}</TableCell>
                    )}
                    {columnVisibility.updatedAt && (
                      <TableCell>{format(new Date(lead.updated_at), "MMM dd, yyyy")}</TableCell>
                    )}
                    {columnVisibility.notes && (
                      <TableCell className="text-center">
                        {lead.notes && lead.notes.length > 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            <StickyNote className="h-3 w-3" />
                            {lead.notes.length}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.calls && (
                      <TableCell className="text-center">
                        {lead.calls && lead.calls.length > 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.calls.length}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.reminders && (
                      <TableCell className="text-center">
                        {lead.reminders && lead.reminders.length > 0 ? (
                          <Badge
                            variant={lead.reminders.some((r) => !r.is_completed) ? "default" : "secondary"}
                            className="gap-1"
                          >
                            <Bell className="h-3 w-3" />
                            {lead.reminders.length}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{lead.name}</DialogTitle>
                            <DialogDescription>Lead ID: #{lead.id}</DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="details">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="notes">Notes ({lead.notes?.length || 0})</TabsTrigger>
                              <TabsTrigger value="calls">Calls ({lead.calls?.length || 0})</TabsTrigger>
                              <TabsTrigger value="reminders">Reminders ({lead.reminders?.length || 0})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                                  <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {lead.email}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                  <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {lead.phone}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">WhatsApp</label>
                                  <p className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    {lead.whatsapp_number}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                                  <p>
                                    <Badge className={statusColors[lead.status?.name || ""]}>{lead.status?.name}</Badge>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Source</label>
                                  <p>
                                    <Badge variant="outline">{lead.source?.name}</Badge>
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                                  <p>{users.find((u) => u.id === lead.assigned_to)?.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Town</label>
                                  <p>{lead.town}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                                  <p>{lead.address}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                                  <p>{lead.profile?.occupation}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                                  <p>{lead.profile?.company}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-muted-foreground">Interest</label>
                                  <p>{lead.profile?.interest}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                  <p>{format(new Date(lead.created_at), "PPpp")}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                                  <p>{format(new Date(lead.updated_at), "PPpp")}</p>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="notes" className="space-y-4">
                              {lead.notes && lead.notes.length > 0 ? (
                                lead.notes.map((note) => (
                                  <div key={note.id} className="rounded-lg border p-4">
                                    <p className="text-sm">{note.note}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                      By {users.find((u) => u.id === note.user_id)?.name} on{" "}
                                      {format(new Date(note.created_at), "PPp")}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted-foreground">No notes for this lead.</p>
                              )}
                            </TabsContent>
                            <TabsContent value="calls" className="space-y-4">
                              {lead.calls && lead.calls.length > 0 ? (
                                lead.calls.map((call) => (
                                  <div key={call.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                      <Badge variant={call.result === "Interested" ? "default" : "secondary"}>
                                        {call.result}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {format(new Date(call.called_at), "PPp")}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-sm">{call.remarks}</p>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                      By {users.find((u) => u.id === call.user_id)?.name}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted-foreground">No calls for this lead.</p>
                              )}
                            </TabsContent>
                            <TabsContent value="reminders" className="space-y-4">
                              {lead.reminders && lead.reminders.length > 0 ? (
                                lead.reminders.map((reminder) => (
                                  <div key={reminder.id} className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                      <Badge variant={reminder.is_completed ? "secondary" : "default"}>
                                        {reminder.is_completed ? "Completed" : "Pending"}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Due: {format(new Date(reminder.remind_at), "PPp")}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                      Assigned to {users.find((u) => u.id === reminder.user_id)?.name}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-muted-foreground">No reminders for this lead.</p>
                              )}
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
