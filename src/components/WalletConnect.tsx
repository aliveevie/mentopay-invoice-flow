import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    // Simulate wallet connection
    const mockAddress = "0x1234...5678";
    setWalletAddress(mockAddress);
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    setIsConnected(false);
  };

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="wallet" className="gap-3">
            <div className="w-2 h-2 bg-web3-success rounded-full"></div>
            <span className="font-mono text-sm">{walletAddress}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={connectWallet} variant="web3" className="gap-2">
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;