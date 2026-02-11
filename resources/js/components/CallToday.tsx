import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import { LeadViewDialog } from "./LeadViewDialog";

type Reminder = {
  id: number;
  remind_at: string;
  is_completed: string | number;
  created_at: string;
  lead: {
    id: number;
    name: string;
    email: string;
    phone: string;
    whatsapp_number?: string;
    created_at: string;
  };
};

export default function CallToday({
  leadRemindersdata,
}: {
  leadRemindersdata: Reminder[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const leadReminders: Reminder[] = leadRemindersdata || [];

  // Inertia pagination
  const { props } = usePage<{
    leads?: { current_page: number; last_page: number };
  }>();

  const pagination = props.leads;
  const currentPage = pagination?.current_page ?? 1;
  const totalPages = pagination?.last_page ?? 1;

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const uniqueReminderDates = useMemo(() => {
    const dates = leadReminders.map((r) => {
      // normalize to only date part (YYYY-MM-DD)
      const d = new Date(r.remind_at);
      return d.toISOString().split("T")[0];
    });
  
    return [...new Set(dates)];
  }, [leadReminders]);

  // Filter + Sort (recent reminder first)
const filteredReminders = useMemo(() => {
  return leadReminders
    .filter((reminder) => {
      const matchSearch = reminder.lead.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const reminderDate = new Date(reminder.remind_at)
        .toISOString()
        .split("T")[0];

      const matchDate = selectedDate
        ? reminderDate === selectedDate
        : true;

      return matchSearch && matchDate;
    })
    .sort((a, b) => {
      return (
        new Date(b.remind_at).getTime() -
        new Date(a.remind_at).getTime()
      );
    });
}, [leadReminders, search, selectedDate]);

  // Pagination navigation
  const goToPage = (page: number) => {
    router.get(
      "/leads/call-center",
      { page, search, date: selectedDate },
      { preserveState: true, preserveScroll: true }
    );
  };

  useEffect(() => {
    goToPage(1);
  }, [search, selectedDate]);

  // Safe Date Formatter
  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return date;

    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <LeadViewDialog
        open={open}
        onOpenChange={setOpen}
        lead={selectedLead}
      />

      <Card className="h-[150vh] flex flex-col">
        <CardHeader>
          <CardTitle>Follow-up Scheduled</CardTitle>

          <div className="flex gap-2">
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="w-full border rounded-md p-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="">All Dates</option>

              {uniqueReminderDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-3">
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => (
              <div key={reminder.id} className="rounded-lg border p-3">
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {reminder.lead.name}
                  </p>

                  <Button
                    onClick={() => {
                      setSelectedLead(reminder.lead);
                      setOpen(true);
                    }}
                  >
                    View
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Reminder: {formatDate(reminder.remind_at)}
                </p>

                <p className="text-xs text-muted-foreground">
                  Lead Created:{" "}
                  {formatDate(reminder.lead.created_at)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No reminders found.
            </p>
          )}
        </CardContent>

        {/* Pagination */}
        <div className="flex justify-center gap-2 p-3 border-t">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            )
          )}

          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </Card>
    </>
  );
}