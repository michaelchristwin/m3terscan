import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, Copy, Check, Grid3x3, List, Table } from "lucide-react";
import { M3terHead } from "m3ters";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getProposals } from "~/queries";

function Proposals({ hash }: { hash: string }) {
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { data } = useSuspenseQuery({
    queryKey: ["getProposals", hash],
    queryFn: () => getProposals(hash),
  });
  const navigate = useNavigate();
  const filteredData = data.filter((meter) =>
    meter.m3ter_no.toString().includes(search)
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div className="max-w-7xl mx-auto">
      {/* Controls */}
      <div className="bg-card rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-100 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by m3ter number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 bg-slate-100 dark:bg-neutral-800 rounded-lg p-1 text-foreground">
          <button
            onClick={() => setView("cards")}
            className={`p-2 rounded ${view === "cards" ? "bg-white dark:bg-neutral-100 dark:text-background shadow" : "hover:bg-slate-200 dark:hover:bg-slate-200/50"}`}
            title="Card View"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${view === "list" ? "bg-white dark:bg-neutral-100 dark:text-background shadow" : "hover:bg-slate-200 dark:hover:bg-slate-200/50"}`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("table")}
            className={`p-2 rounded ${view === "table" ? "bg-white dark:bg-neutral-100 dark:text-background shadow" : "hover:bg-slate-200 dark:hover:bg-slate-200/50"}`}
            title="Table View"
          >
            <Table className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card View */}
      {view === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((meter) => (
            <div
              key={meter.m3ter_no}
              className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <Link
                to={`/m3ter/${meter.m3ter_no}`}
                className="flex items-center gap-3 mb-4 p-1 border-l-2 border-transparent transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              >
                <M3terHead seed={meter.m3ter_no.toString()} size={40} />
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-200 uppercase tracking-wide">
                    M3ter No
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-400">
                    {meter.m3ter_no}
                  </div>
                </div>
              </Link>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Account</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-slate-50 dark:bg-slate-600 px-2 py-1 rounded border border-slate-200">
                      {meter.account}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          meter.account,
                          `${meter.m3ter_no}-account`
                        )
                      }
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-100/10 rounded transition-colors"
                    >
                      {copied === `${meter.m3ter_no}-account` ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">Nonce</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-slate-50 dark:bg-slate-600 px-2 py-1 rounded border border-slate-200">
                      {meter.nonce}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          meter.nonce.toString(),
                          `${meter.m3ter_no}-nonce`
                        )
                      }
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-100/10 rounded transition-colors"
                    >
                      {copied === `${meter.m3ter_no}-nonce` ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-background rounded-lg shadow-sm divide-y">
          {filteredData.map((meter) => (
            <div
              key={meter.m3ter_no}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-50/10 transition-colors"
            >
              <Link to={`/m3ter/${meter.m3ter_no}`}>
                <div className="flex items-center gap-4">
                  <M3terHead seed={meter.m3ter_no.toString()} size={40} />

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Account</div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-slate-50 dark:bg-slate-600 px-2 py-1 rounded border border-slate-200">
                          {meter.account}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              meter.account,
                              `${meter.m3ter_no}-account-list`
                            )
                          }
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-100/10 rounded transition-colors"
                        >
                          {copied === `${meter.m3ter_no}-account-list` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500 mb-1">Nonce</div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-slate-50 dark:bg-slate-600 px-2 py-1 rounded border border-slate-200">
                          {meter.nonce}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              meter.nonce.toString(),
                              `${meter.m3ter_no}-nonce-list`
                            )
                          }
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-100/10 rounded transition-colors"
                        >
                          {copied === `${meter.m3ter_no}-nonce-list` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-neutral-900 border-b border-slate-200">
                <tr>
                  <th className="md:px-6 px-2 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-100 uppercase tracking-wider">
                    M3ter No
                  </th>
                  <th className="md:px-6 px-2 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-100  uppercase tracking-wider">
                    Account
                  </th>
                  <th className="md:px-6 px-2 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-100  uppercase tracking-wider">
                    Nonce
                  </th>
                  <th className="md:px-6 px-2 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-100  uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((meter) => (
                  <tr
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/m3ter/${meter.m3ter_no}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ")
                        navigate(`/m3ter/${meter.m3ter_no}`);
                    }}
                    key={meter.m3ter_no}
                    className="hover:bg-slate-50 dark:hover:bg-slate-50/10 cursor-pointer"
                  >
                    <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <M3terHead seed={meter.m3ter_no.toString()} size={40} />
                        <span className="font-medium text-slate-900 dark:text-slate-200">
                          {meter.m3ter_no}
                        </span>
                      </div>
                    </td>
                    <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                      <code className="text-sm bg-slate-50 dark:bg-slate-600 px-2 py-1 rounded border border-slate-200">
                        {meter.account}
                      </code>
                    </td>
                    <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                      <code className="text-sm bg-slate-50 dark:bg-slate-600 px-2 py-1 rounded border border-slate-200">
                        {meter.nonce}
                      </code>
                    </td>
                    <td className="md:px-6 px-2 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            copyToClipboard(
                              meter.account,
                              `${meter.m3ter_no}-account-table`
                            )
                          }
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-100/10 rounded transition-colors"
                          title="Copy Account"
                        >
                          {copied === `${meter.m3ter_no}-account-table` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredData.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-slate-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            No m3ters found
          </h3>
          <p className="text-slate-500">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}

export default Proposals;
