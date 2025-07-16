

import { useState } from "react"
import { Button } from "@innovator/components/ui/button"
import { Card } from "@innovator/components/ui/card"
import { MainLayout } from "../../components/layout/main-layout";
import { SendFundSettingsDialog } from "@innovator/components/modals/SendFundSettingsDialog"
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react"
import { FundWalletDialog } from "@/dashboard/Innovator/components/modals/fund-wallet-dialog";


export default function WalletPage() {
  
  const [isSendFundsSettingsOpen, setIsSendFundsSettingsOpen] = useState(false)
  const [isFundWaletDialogOpen, setisFundWaletDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("All Time")


  const RecentTransactions = [
    {
      id: "1",
      name: "Wallet funding",
      date: "20/02/2025",
      amount: "+$500",
    },
    {
      id: "2",
      name: "Funding",
      date: "2/02/2025",
      amount: "-$100",
    },
  ];


  return (
    <MainLayout>
      <div className=" space-y-6 md:p-6 md:pr-3 md:pl-1 md:pt-1 px-3 pt-2 ">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold dashtext">Wallet</h1>
            <p className="text-sm text-gray-400">Manage your wallet and transactions</p>
          </div>
          <Button className=" dashbutton" onClick={() => setIsSendFundsSettingsOpen(true)}>Wallet Settings</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="secondbg p-6">
            <div className="mb-2 text-sm text-gray-400">Available Balance</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold dashtext">$1,000</div>
              <Button variant="ghost" size="icon" className=" rounded-full text-[#00bf8f]">
                <ArrowUpRight className="h-6 w-6" />
              </Button>
            </div>
          </Card>
          <Card className="secondbg p-6">
            <div className="mb-2 text-sm text-gray-400">Total Transactions</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold dashtext">10</div>
              <Button variant="ghost" size="icon" className=" rounded-full text-[#00bf8f]">
                <ArrowUpRight className="h-6 w-6" />
              </Button>
            </div>
          </Card>
          <Card className="secondbg p-6">
            <div className="mb-2 text-sm text-gray-400">Pending Payments</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold dashtext">2</div>
              <Button variant="ghost" size="icon" className=" rounded-full text-[#00bf8f]">
                <ArrowUpRight className="h-6 w-6" />
              </Button>
            </div>
          </Card>
          <Card className="secondbg p-6">
            <div className="mb-2 text-sm text-gray-400">Successful Payments</div>
            <div className="flex items-center">
              <div className="text-2xl font-bold dashtext">8</div>
              <Button variant="ghost" size="icon" className=" rounded-full text-[#00bf8f]">
                <ArrowUpRight className="h-6 w-6" />
              </Button>
            </div>
          </Card>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            className="dashbutton  p-6 transition-colors hover:secondbg cursor-pointer"
            onClick={() => setisFundWaletDialogOpen(true)}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full secondbg p-3">
                <ArrowDownRight className="h-6 w-6 text-[#00bf8f]" />
              </div>
              <div className="">
                <h3 className="font-semibold  text-white">Fund Wallet</h3>
                <p className="text-sm text-gray-300">Add funds to your wallet</p>
              </div>
            </div>
          </Card>
    
        </div>
        <div className="rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold dashtext">Transactions History</h2>
            <div className="flex items-center gap-2">
              {/* Dropdown Menu */}
         
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  id="options-menu"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen ? "true" : "false"}
                >
                  {selectedPeriod}
                  <svg
                    className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => { setSelectedPeriod("All Time"); setDropdownOpen(false) }}
                      >
                        All Time
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => { setSelectedPeriod("This Month"); setDropdownOpen(false) }}
                      >
                        This Month
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => { setSelectedPeriod("This Week"); setDropdownOpen(false) }}
                      >
                        This Week
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

          </div>

          {RecentTransactions?.length > 0 &&
            RecentTransactions.map((transaction) => (
              <Card key={transaction?.id} className="secondbg rounded-none">
                <div className="p-2">
                  <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 py-2 px-3">
                    <div className="flex items-center gap-4">
                      <div className="secondbg p-2">
                        <ArrowDownRight className="h-4 w-4 text-[#00bf8f]" />
                      </div>
                      <div>
                        <h3 className="font-semibold dashtext">{transaction?.name}</h3>
                        <p className="text-sm text-gray-400">{transaction?.date}</p>
                      </div>
                    </div>
                    <div className={`text-lg font-semibold ${transaction?.amount[0] === '+' ? 'text-[#00bf8f]' : 'text-red-600'}`}>
                      {transaction?.amount}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          }
        </div>

        <FundWalletDialog isOpen={isFundWaletDialogOpen} onClose={() => setisFundWaletDialogOpen(false)} />

       
        <SendFundSettingsDialog
          isOpen={isSendFundsSettingsOpen}
          onClose={() => setIsSendFundsSettingsOpen(false)}
        />
      </div>
    </MainLayout>
  )
}

