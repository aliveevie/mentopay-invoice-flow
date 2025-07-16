import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Receipt, QrCode } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InvoiceData {
  id: string;
  description: string;
  amount: string;
  currency: string;
  dueDate: Date | undefined;
  createdAt: Date;
  status: "pending" | "paid" | "overdue";
}

interface InvoiceGeneratorProps {
  onInvoiceGenerated: (invoice: InvoiceData) => void;
}

const CURRENCIES = [
  { value: "cUSD", label: "cUSD", description: "Celo Dollar" },
  { value: "cEUR", label: "cEUR", description: "Celo Euro" },
  { value: "cREAL", label: "cREAL", description: "Celo Real" },
];

const InvoiceGenerator = ({ onInvoiceGenerated }: InvoiceGeneratorProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [invoiceCounter, setInvoiceCounter] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInvoice = async () => {
    if (!description || !amount || !currency || !dueDate) return;

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoice: InvoiceData = {
      id: `INV-${invoiceCounter.toString().padStart(3, '0')}`,
      description,
      amount,
      currency,
      dueDate,
      createdAt: new Date(),
      status: "pending",
    };

    onInvoiceGenerated(invoice);
    setInvoiceCounter(prev => prev + 1);
    
    // Reset form
    setDescription("");
    setAmount("");
    setCurrency("");
    setDueDate(undefined);
    setIsGenerating(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card border-primary/10">
      <CardHeader className="text-center bg-gradient-card rounded-t-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Receipt className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Generate Invoice
          </CardTitle>
        </div>
        <div className="text-sm text-muted-foreground">
          Invoice #{invoiceCounter.toString().padStart(3, '0')}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Payment Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what this payment is for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium">
              Currency
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{curr.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {curr.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={generateInvoice}
          disabled={!description || !amount || !currency || !dueDate || isGenerating}
          variant="web3"
          className="w-full h-12 text-base font-semibold"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating Invoice...
            </div>
          ) : (
            <>
              <QrCode className="w-5 h-5" />
              Generate Invoice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;