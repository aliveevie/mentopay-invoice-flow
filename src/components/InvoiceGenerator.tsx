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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, QrCode, Plus, Trash2 } from "lucide-react";
import { saveInvoiceToStorage } from "@/lib/utils";

interface InvoiceItem {
  id: string;
  description: string;
  amount: string;
}

interface InvoiceData {
  id: string;
  items: InvoiceItem[];
  currency: string;
  totalAmount: string;
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
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", amount: "" }
  ]);
  const [currency, setCurrency] = useState("");
  const [invoiceCounter, setInvoiceCounter] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: (items.length + 1).toString(),
      description: "",
      amount: ""
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0).toFixed(2);
  };

  const generateInvoice = async () => {
    const validItems = items.filter(item => item.description && item.amount);
    if (validItems.length === 0 || !currency) return;

    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoice: InvoiceData = {
      id: `INV-${invoiceCounter.toString().padStart(3, '0')}`,
      items: validItems,
      currency,
      totalAmount: calculateTotal(),
      createdAt: new Date(),
      status: "pending",
    };

    saveInvoiceToStorage(invoice);
    onInvoiceGenerated(invoice);
    setInvoiceCounter(prev => prev + 1);
    
    // Reset form
    setItems([{ id: "1", description: "", amount: "" }]);
    setCurrency("");
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Invoice Items</Label>
            <Button 
              type="button" 
              onClick={addItem} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <Card key={item.id} className="border border-muted">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Item #{index + 1}
                  </span>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`description-${item.id}`} className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id={`description-${item.id}`}
                      placeholder="Describe this item..."
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`amount-${item.id}`} className="text-sm font-medium">
                      Amount
                    </Label>
                    <Input
                      id={`amount-${item.id}`}
                      type="number"
                      placeholder="0.00"
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, "amount", e.target.value)}
                      className="text-lg font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Total Amount</Label>
            <div className="text-2xl font-bold font-mono p-3 bg-muted rounded-md">
              {calculateTotal()} {currency || "---"}
            </div>
          </div>
        </div>

        <Button
          onClick={generateInvoice}
          disabled={items.every(item => !item.description || !item.amount) || !currency || isGenerating}
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