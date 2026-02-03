import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export default function CallToday({ leadsdata }: { leadsdata?: { id: string | number; name: string; profile?: { interest?: string }; notes?: { note: string }[] }[] }) {


    return (

        <>
            <Card className="h-[150vh] flex flex-col">
                <CardHeader>
                    <CardTitle>Follow-up scheduled today</CardTitle>
                  <div className="flex gap-1">
                      <Input placeholder="Search leads..." />
                    <Input type="Date"></Input>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-3">
                    {leadsdata?.map(lead => (
                        <div key={lead.id} className="rounded-lg border p-3">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">{lead.name}</p>
                                <Button size="sm" variant="outline">
                                    View
                                </Button>
                            </div>
                            <div>
                                <p>interest : {lead.profile?.interest}</p>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {lead.notes?.[0]?.note ?? 'No notes available'}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </>
    )
};
