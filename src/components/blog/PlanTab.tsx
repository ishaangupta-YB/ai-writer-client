import { BlogResult } from "../../lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Check, X } from "lucide-react";

interface PlanTabProps {
    plan: BlogResult["plan"];
}

export function PlanTab({ plan }: PlanTabProps) {
    const BoolIcon = ({ value }: { value: boolean }) =>
        value
            ? <div className="mx-auto w-6 h-6 flex items-center justify-center bg-primary border-2 border-border shadow-[2px_2px_0_rgba(0,0,0,1)]"><Check className="h-4 w-4 text-primary-foreground stroke-[3px]" /></div>
            : <div className="mx-auto w-6 h-6 flex items-center justify-center bg-muted border-2 border-border"><X className="h-3 w-3 text-muted-foreground stroke-[3px]" /></div>;

    return (
        <div className="space-y-12 max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-12">
            <div className="brutal-card bg-card border-4 border-border shadow-[8px_8px_0_rgba(0,0,0,1)] rounded-none relative overflow-hidden p-8">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_8px)]"></div>

                <div className="relative z-10 border-b-4 border-foreground pb-6 mb-6">
                    <Badge variant="outline" className="text-xs uppercase font-black border-2 border-border bg-accent text-accent-foreground mb-4 rounded-none shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        Mission Brief
                    </Badge>
                    <CardTitle className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                        {plan.blog_title}
                    </CardTitle>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                            <span className="bg-foreground text-background font-bold px-3 py-1 text-sm border-2 border-border uppercase">Kind</span>
                            <span className="bg-background text-foreground font-bold px-3 py-1 text-sm border-y-2 border-r-2 border-border uppercase">{plan.blog_kind.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="bg-secondary text-secondary-foreground font-bold px-3 py-1 text-sm border-2 border-border uppercase">Audience</span>
                            <span className="bg-background text-foreground font-bold px-3 py-1 text-sm border-y-2 border-r-2 border-border uppercase">{plan.audience}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="bg-primary text-primary-foreground font-bold px-3 py-1 text-sm border-2 border-border uppercase">Tone</span>
                            <span className="bg-background text-foreground font-bold px-3 py-1 text-sm border-y-2 border-r-2 border-border uppercase">{plan.tone}</span>
                        </div>
                    </div>
                </div>

                {plan.constraints.length > 0 && (
                    <div className="relative z-10 bg-destructive/10 border-l-8 border-destructive p-6 font-mono">
                        <span className="font-black text-destructive uppercase tracking-widest block mb-4 border-b-2 border-destructive/20 pb-2">CRITICAL_CONSTRAINTS //</span>
                        <ul className="space-y-3">
                            {plan.constraints.map((c, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="text-destructive font-black">[{i + 1}]</span>
                                    <span className="font-bold text-foreground/80">{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="brutal-card bg-card border-4 border-border shadow-[8px_8px_0_rgba(0,0,0,1)] rounded-none">
                <div className="bg-foreground text-background p-4 flex justify-between items-center border-b-4 border-border">
                    <CardTitle className="text-xl font-black uppercase tracking-widest">Execution Protocol</CardTitle>
                    <div className="font-mono text-sm bg-background text-foreground px-2 py-1 font-bold">
                        PHASES: {plan.tasks.length}
                    </div>
                </div>

                <div className="p-0 sm:p-6 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]">
                    <div className="border-4 border-border mb-12 overflow-x-auto bg-background shadow-[4px_4px_0_rgba(0,0,0,1)]">
                        <Table>
                            <TableHeader className="bg-muted border-b-4 border-border">
                                <TableRow className="hover:bg-muted">
                                    <TableHead className="w-[50px] font-black text-foreground uppercase">Phase</TableHead>
                                    <TableHead className="font-black text-foreground uppercase">Objective</TableHead>
                                    <TableHead className="text-right font-black text-foreground uppercase">Words</TableHead>
                                    <TableHead className="text-center font-black text-foreground uppercase"><span className="bg-secondary text-secondary-foreground px-1 border border-border">RSRCH</span></TableHead>
                                    <TableHead className="text-center font-black text-foreground uppercase"><span className="bg-accent text-accent-foreground px-1 border border-border">CITE</span></TableHead>
                                    <TableHead className="text-center font-black text-foreground uppercase"><span className="bg-primary text-primary-foreground px-1 border border-border">CODE</span></TableHead>
                                    <TableHead className="font-black text-foreground uppercase">Tags</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plan.tasks.map((task, i) => (
                                    <TableRow key={task.id} className="border-b-2 border-border hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-black text-lg border-r-2 border-border/50 bg-muted/30 text-center">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </TableCell>
                                        <TableCell className="font-bold">{task.title}</TableCell>
                                        <TableCell className="text-right font-mono font-bold text-lg">{task.target_words}</TableCell>
                                        <TableCell className="text-center bg-muted/10 border-l-2 border-border/50"><BoolIcon value={task.requires_research} /></TableCell>
                                        <TableCell className="text-center bg-muted/10 border-l-2 border-border/50"><BoolIcon value={task.requires_citations} /></TableCell>
                                        <TableCell className="text-center bg-muted/10 border-l-2 border-border/50"><BoolIcon value={task.requires_code} /></TableCell>
                                        <TableCell className="border-l-2 border-border/50">
                                            <div className="flex flex-wrap gap-2">
                                                {task.tags.map(tag => (
                                                    <Badge key={tag} variant="outline" className="text-[10px] uppercase font-black px-1.5 py-0 rounded-none border-2 border-border bg-background shadow-[1px_1px_0_rgba(0,0,0,1)]">
                                                        #{tag.replace(' ', '_')}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tighter inline-block border-b-4 border-primary pb-1">Detailed Breakdown</h3>
                        <Accordion type="multiple" className="w-full space-y-4">
                            {plan.tasks.map((task, i) => (
                                <AccordionItem key={task.id} value={task.id.toString()} className="border-4 border-border bg-background data-[state=open]:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all">
                                    <AccordionTrigger className="hover:no-underline hover:bg-accent/10 p-4 sm:p-6 transition-colors group">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-foreground text-background font-black text-xl w-10 h-10 flex items-center justify-center border-2 border-border transform -rotate-3 group-hover:rotate-0 transition-transform">
                                                {i + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-xl uppercase tracking-tight">{task.title}</span>
                                                <span className="text-muted-foreground font-mono text-sm line-clamp-1 mt-1 font-bold">
                                                    {'>'} {task.goal}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-0 border-t-4 border-border">
                                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-border">
                                            <div className="p-6 md:col-span-1 bg-muted/30">
                                                <span className="inline-block bg-primary text-primary-foreground font-black uppercase px-2 py-1 border-2 border-border mb-4 text-xs tracking-wider shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                                    Directive
                                                </span>
                                                <p className="font-bold leading-relaxed">{task.goal}</p>
                                            </div>
                                            <div className="p-6 md:col-span-2 bg-background">
                                                <span className="inline-block bg-secondary text-secondary-foreground font-black uppercase px-2 py-1 border-2 border-border mb-4 text-xs tracking-wider shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                                    Key Vectors
                                                </span>
                                                <ul className="space-y-4">
                                                    {task.bullets.map((bullet, idx) => (
                                                        <li key={idx} className="flex gap-4 items-start font-medium bg-muted p-3 border-2 border-border relative">
                                                            <span className="absolute -left-3 -top-3 w-6 h-6 bg-accent border-2 border-border flex items-center justify-center font-black text-xs shadow-[1px_1px_0_rgba(0,0,0,1)]">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="ml-2 leading-relaxed">{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
