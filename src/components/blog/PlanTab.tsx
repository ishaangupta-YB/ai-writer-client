import { BlogResult } from "../../lib/types";
import { CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
interface PlanTabProps {
    plan: BlogResult["plan"];
}

function BoolIcon({ value }: { value: boolean }) {
    return value
        ? <div className="mx-auto w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-black">Y</div>
        : <div className="mx-auto w-5 h-5 flex items-center justify-center bg-muted text-muted-foreground text-[10px] font-black">N</div>;
}

export function PlanTab({ plan }: PlanTabProps) {

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500 pb-8 px-2 sm:px-0">
            {/* Header */}
            <div className="bg-transparent border-b border-primary/20 p-4 sm:p-6 mb-4">
                <div className="pb-4 sm:pb-6 mb-4 sm:mb-6">
                    <Badge variant="outline" className="font-display text-[10px] uppercase tracking-widest border-primary/30 bg-primary/5 text-primary mb-3">
                        Scroll Plan
                    </Badge>
                    <CardTitle className="text-2xl sm:text-4xl font-display font-medium text-primary tracking-wide leading-tight mb-4 text-wrap">
                        {plan.blog_title}
                    </CardTitle>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className="font-serif italic text-foreground/80 px-2 py-1 bg-primary/5 border border-primary/10 rounded">
                            <span className="text-muted-foreground mr-1">Kind:</span> <span className="font-semibold uppercase tracking-wider">{plan.blog_kind.replace("_", " ")}</span>
                        </span>
                        <span className="font-serif italic text-foreground/80 px-2 py-1 bg-primary/5 border border-primary/10 rounded">
                            <span className="text-muted-foreground mr-1">Audience:</span> <span className="font-semibold">{plan.audience}</span>
                        </span>
                        <span className="font-serif italic text-foreground/80 px-2 py-1 bg-primary/5 border border-primary/10 rounded">
                            <span className="text-muted-foreground mr-1">Tone:</span> <span className="font-semibold">{plan.tone}</span>
                        </span>
                    </div>
                </div>

                {plan.constraints.length > 0 && (
                    <div className="bg-destructive/5 border-l-4 border-destructive p-4">
                        <span className="font-bold text-destructive uppercase text-xs tracking-wider block mb-2">Constraints</span>
                        <ul className="space-y-1.5">
                            {plan.constraints.map((c, i) => (
                                <li key={i} className="flex gap-2 items-start text-sm">
                                    <span className="text-destructive font-bold shrink-0">{i + 1}.</span>
                                    <span className="text-foreground/80">{c}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Tasks Table */}
            <div className="bg-transparent border border-primary/20 rounded-lg overflow-hidden">
                <div className="bg-primary/5 px-4 sm:px-6 py-4 flex justify-between items-center border-b border-primary/20">
                    <CardTitle className="font-display text-sm tracking-widest uppercase text-primary">Sections</CardTitle>
                    <span className="font-serif italic text-sm text-primary/80">{plan.tasks.length} tasks</span>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[40px] font-bold text-xs">#</TableHead>
                                <TableHead className="font-bold text-xs">Title</TableHead>
                                <TableHead className="text-right font-bold text-xs">Words</TableHead>
                                <TableHead className="text-center font-bold text-xs">Research</TableHead>
                                <TableHead className="text-center font-bold text-xs">Cite</TableHead>
                                <TableHead className="text-center font-bold text-xs">Code</TableHead>
                                <TableHead className="font-bold text-xs">Tags</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plan.tasks.map((task, i) => (
                                <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-bold text-muted-foreground text-center">{i + 1}</TableCell>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell className="text-right font-mono text-sm">{task.target_words}</TableCell>
                                    <TableCell className="text-center"><BoolIcon value={task.requires_research} /></TableCell>
                                    <TableCell className="text-center"><BoolIcon value={task.requires_citations} /></TableCell>
                                    <TableCell className="text-center"><BoolIcon value={task.requires_code} /></TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {task.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0 border-border">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Accordion Details */}
            <div className="space-y-4">
                <h3 className="text-xl font-display text-primary tracking-wide">Section Details</h3>
                <Accordion type="multiple" className="w-full space-y-2">
                    {plan.tasks.map((task, i) => (
                        <AccordionItem key={task.id} value={task.id.toString()} className="border border-primary/20 bg-transparent mb-2 rounded overflow-hidden data-[state=open]:bg-primary/5 transition-all">
                            <AccordionTrigger className="hover:no-underline hover:bg-primary/5 px-3 sm:px-4 py-3 sm:py-4 transition-colors">
                                <div className="flex items-center gap-3 text-left">
                                    <span className="bg-primary/10 text-primary font-display border border-primary/20 rounded text-sm w-7 h-7 flex items-center justify-center shrink-0">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <span className="font-bold text-base">{task.title}</span>
                                        <span className="text-muted-foreground text-sm block mt-0.5 line-clamp-1">{task.goal}</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="border-t border-border">
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                                    <div className="p-4 md:col-span-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Goal</span>
                                        <p className="text-sm leading-relaxed">{task.goal}</p>
                                    </div>
                                    <div className="p-4 md:col-span-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Key Points</span>
                                        <ul className="space-y-2">
                                            {task.bullets.map((bullet, idx) => (
                                                <li key={idx} className="flex gap-2 items-start text-sm">
                                                    <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                                                    <span className="leading-relaxed">{bullet}</span>
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
    );
}
