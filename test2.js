import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=a673970e"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=a673970e"; const useState = __vite__cjsImport1_react["useState"];
import {
  LayoutDashboard,
  Activity,
  Wallet,
  History,
  Coins,
  Image,
  TrendingUp,
  BarChart3,
  Receipt,
  FileText,
  Download,
  Users,
  Bell,
  HelpCircle,
  HeartPulse,
  Settings,
  LogOut,
  Search,
  User,
  Menu,
  X
} from "/node_modules/.vite/deps/lucide-react.js?v=a673970e";
import { Link, Routes, Route, useLocation } from "/node_modules/.vite/deps/react-router-dom.js?v=a673970e";
import Portfolio from "/src/pages/dashboard/Portfolio.tsx";
import Reconciliation from "/src/pages/dashboard/Reconciliation.tsx";
import Wallets from "/src/pages/dashboard/Wallets.tsx";
import Transactions from "/src/pages/dashboard/Transactions.tsx";
import DeFi from "/src/pages/dashboard/DeFi.tsx";
import NFTs from "/src/pages/dashboard/NFTs.tsx";
import Performance from "/src/pages/dashboard/Performance.tsx";
import Prices from "/src/pages/dashboard/Prices.tsx";
import Taxes from "/src/pages/dashboard/Taxes.tsx";
import TaxLossHarvesting from "/src/pages/dashboard/TaxLossHarvesting.tsx";
import Exports from "/src/pages/dashboard/Exports.tsx";
import Team from "/src/pages/dashboard/Team.tsx";
import Notifications from "/src/pages/dashboard/Notifications.tsx";
import Support from "/src/pages/dashboard/Support.tsx";
import AccountHealth from "/src/pages/dashboard/AccountHealth.tsx";
import SettingsPage from "/src/pages/dashboard/Settings.tsx";
export default function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };
  const navLinkClass = (path) => `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm ${isActive(path) ? "bg-brand-purple/10 text-brand-purple font-bold" : "text-brand-text-gray hover:bg-gray-50 hover:text-brand-dark"}`;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#F8FAFC] flex font-sans text-brand-dark", children: [
    isMobileMenuOpen && /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "fixed inset-0 bg-brand-dark/20 z-40 lg:hidden",
        onClick: closeMobileMenu
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 50,
        columnNumber: 9
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("aside", { className: `fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-screen transform transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "p-6 pb-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDEV(Link, { to: "/", className: "flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity", onClick: closeMobileMenu, children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xl shadow-md", children: "R" }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 62,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "font-display font-bold text-xl tracking-tight text-brand-dark", children: "RestoreChain" }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 65,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 61,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: closeMobileMenu,
            className: "lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg mb-6",
            children: /* @__PURE__ */ jsxDEV(X, { size: 20 }, void 0, false, {
              fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
              lineNumber: 71,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 67,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("nav", { className: "flex-1 px-3 overflow-y-auto pb-6 space-y-1 custom-scrollbar", children: [
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard", onClick: closeMobileMenu, className: navLinkClass("/dashboard"), children: [
          /* @__PURE__ */ jsxDEV(LayoutDashboard, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 77,
            columnNumber: 13
          }, this),
          " Portfolio"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 76,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/reconciliation", onClick: closeMobileMenu, className: navLinkClass("/dashboard/reconciliation"), children: [
          /* @__PURE__ */ jsxDEV(Activity, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 80,
            columnNumber: 13
          }, this),
          " Reconciliation",
          /* @__PURE__ */ jsxDEV("span", { className: "ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold", children: "3" }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 81,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 79,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/wallets", onClick: closeMobileMenu, className: navLinkClass("/dashboard/wallets"), children: [
          /* @__PURE__ */ jsxDEV(Wallet, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 84,
            columnNumber: 13
          }, this),
          " Wallets"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 83,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/transactions", onClick: closeMobileMenu, className: navLinkClass("/dashboard/transactions"), children: [
          /* @__PURE__ */ jsxDEV(History, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 87,
            columnNumber: 13
          }, this),
          " Transactions"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 86,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "my-2 border-t border-gray-100" }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 90,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/defi", onClick: closeMobileMenu, className: navLinkClass("/dashboard/defi"), children: [
          /* @__PURE__ */ jsxDEV(Coins, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 93,
            columnNumber: 13
          }, this),
          " DeFi Positions"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 92,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/nfts", onClick: closeMobileMenu, className: navLinkClass("/dashboard/nfts"), children: [
          /* @__PURE__ */ jsxDEV(Image, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 96,
            columnNumber: 13
          }, this),
          " NFTs"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 95,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "my-2 border-t border-gray-100" }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/performance", onClick: closeMobileMenu, className: navLinkClass("/dashboard/performance"), children: [
          /* @__PURE__ */ jsxDEV(TrendingUp, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 102,
            columnNumber: 13
          }, this),
          " Performance"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 101,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/prices", onClick: closeMobileMenu, className: navLinkClass("/dashboard/prices"), children: [
          /* @__PURE__ */ jsxDEV(BarChart3, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 105,
            columnNumber: 13
          }, this),
          " Prices"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 104,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "my-2 border-t border-gray-100" }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 108,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/taxes", onClick: closeMobileMenu, className: navLinkClass("/dashboard/taxes"), children: [
          /* @__PURE__ */ jsxDEV(Receipt, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 111,
            columnNumber: 13
          }, this),
          " Taxes"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 110,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/tax-loss-harvesting", onClick: closeMobileMenu, className: navLinkClass("/dashboard/tax-loss-harvesting"), children: [
          /* @__PURE__ */ jsxDEV(FileText, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 114,
            columnNumber: 13
          }, this),
          " Tax Loss Harvesting"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 113,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "my-2 border-t border-gray-100" }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 117,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/exports", onClick: closeMobileMenu, className: navLinkClass("/dashboard/exports"), children: [
          /* @__PURE__ */ jsxDEV(Download, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 120,
            columnNumber: 13
          }, this),
          " Exports"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/team", onClick: closeMobileMenu, className: navLinkClass("/dashboard/team"), children: [
          /* @__PURE__ */ jsxDEV(Users, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 123,
            columnNumber: 13
          }, this),
          " Team & Pros"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 122,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 75,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "p-3 border-t border-gray-100 bg-gray-50/50", children: [
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/account-health", onClick: closeMobileMenu, className: navLinkClass("/dashboard/account-health"), children: [
          /* @__PURE__ */ jsxDEV(HeartPulse, { size: 18, className: "text-green-500" }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 129,
            columnNumber: 13
          }, this),
          " Account Health"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 128,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/notifications", onClick: closeMobileMenu, className: navLinkClass("/dashboard/notifications"), children: [
          /* @__PURE__ */ jsxDEV(Bell, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 132,
            columnNumber: 13
          }, this),
          " Notifications"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/support", onClick: closeMobileMenu, className: navLinkClass("/dashboard/support"), children: [
          /* @__PURE__ */ jsxDEV(HelpCircle, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this),
          " Support"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 134,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/settings", onClick: closeMobileMenu, className: navLinkClass("/dashboard/settings"), children: [
          /* @__PURE__ */ jsxDEV(Settings, { size: 18 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 138,
            columnNumber: 13
          }, this),
          " Settings"
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 137,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-2 pt-2 border-t border-gray-200", children: /* @__PURE__ */ jsxDEV(Link, { to: "/login", className: "flex items-center gap-3 px-4 py-2 hover:bg-white rounded-xl transition-colors group", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500", children: /* @__PURE__ */ jsxDEV(User, { size: 16 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 144,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 143,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-bold text-brand-dark truncate group-hover:text-brand-purple transition-colors", children: "Jane Doe" }, void 0, false, {
              fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
              lineNumber: 147,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-[11px] font-bold text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded inline-block", children: "Pro Plan" }, void 0, false, {
              fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
              lineNumber: 148,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 146,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(LogOut, { size: 16, className: "text-gray-400 group-hover:text-red-500 transition-colors" }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 150,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 142,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 141,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
      lineNumber: 57,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxDEV("header", { className: "bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 flex-1", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setIsMobileMenuOpen(true),
              className: "lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors",
              children: /* @__PURE__ */ jsxDEV(Menu, { size: 24 }, void 0, false, {
                fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
                lineNumber: 165,
                columnNumber: 15
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
              lineNumber: 161,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 max-w-xl", children: /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
            /* @__PURE__ */ jsxDEV(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 18 }, void 0, false, {
              fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
              lineNumber: 169,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "text",
                placeholder: "Search transactions, wallets...",
                className: "w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
                lineNumber: 170,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 168,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 167,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 160,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 ml-4 shrink-0", children: /* @__PURE__ */ jsxDEV(Link, { to: "/dashboard/notifications", className: "p-2 text-gray-400 hover:text-brand-dark transition-colors relative", children: [
          /* @__PURE__ */ jsxDEV(Bell, { size: 20 }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 180,
            columnNumber: 16
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" }, void 0, false, {
            fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
            lineNumber: 181,
            columnNumber: 16
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 179,
          columnNumber: 14
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 178,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 159,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "p-6 lg:p-10 max-w-7xl mx-auto", children: /* @__PURE__ */ jsxDEV(Routes, { children: [
        /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(Portfolio, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 188,
          columnNumber: 38
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 188,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/reconciliation", element: /* @__PURE__ */ jsxDEV(Reconciliation, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 189,
          columnNumber: 52
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/wallets", element: /* @__PURE__ */ jsxDEV(Wallets, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 190,
          columnNumber: 45
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 190,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/transactions", element: /* @__PURE__ */ jsxDEV(Transactions, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 191,
          columnNumber: 50
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 191,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/defi", element: /* @__PURE__ */ jsxDEV(DeFi, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 192,
          columnNumber: 42
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/nfts", element: /* @__PURE__ */ jsxDEV(NFTs, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 193,
          columnNumber: 42
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/performance", element: /* @__PURE__ */ jsxDEV(Performance, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 194,
          columnNumber: 49
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 194,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/prices", element: /* @__PURE__ */ jsxDEV(Prices, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 195,
          columnNumber: 44
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 195,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/taxes", element: /* @__PURE__ */ jsxDEV(Taxes, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 196,
          columnNumber: 43
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 196,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/tax-loss-harvesting", element: /* @__PURE__ */ jsxDEV(TaxLossHarvesting, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 197,
          columnNumber: 57
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 197,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/exports", element: /* @__PURE__ */ jsxDEV(Exports, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 198,
          columnNumber: 45
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 198,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/team", element: /* @__PURE__ */ jsxDEV(Team, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 199,
          columnNumber: 42
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 199,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/notifications", element: /* @__PURE__ */ jsxDEV(Notifications, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 200,
          columnNumber: 51
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 200,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/support", element: /* @__PURE__ */ jsxDEV(Support, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 201,
          columnNumber: 45
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 201,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/account-health", element: /* @__PURE__ */ jsxDEV(AccountHealth, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 202,
          columnNumber: 52
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 202,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "/settings/*", element: /* @__PURE__ */ jsxDEV(SettingsPage, {}, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 203,
          columnNumber: 48
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
          lineNumber: 203,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 187,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
      lineNumber: 157,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/layouts/DashboardLayout.tsx",
    lineNumber: 47,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhc2hib2FyZExheW91dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgXG4gIExheW91dERhc2hib2FyZCwgQWN0aXZpdHksIFdhbGxldCwgSGlzdG9yeSwgQ29pbnMsIEltYWdlLCBcbiAgVHJlbmRpbmdVcCwgQmFyQ2hhcnQzLCBSZWNlaXB0LCBGaWxlVGV4dCwgRG93bmxvYWQsIFVzZXJzLCBcbiAgQmVsbCwgSGVscENpcmNsZSwgSGVhcnRQdWxzZSwgU2V0dGluZ3MsIExvZ091dCwgU2VhcmNoLCBVc2VyLFxuICBNZW51LCBYXG59IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgeyBMaW5rLCBSb3V0ZXMsIFJvdXRlLCB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuXG4vLyBQbGFjZWhvbGRlciBpbXBvcnRzIGZvciByb3V0ZXNcbmltcG9ydCBQb3J0Zm9saW8gZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1BvcnRmb2xpbyc7XG5pbXBvcnQgUmVjb25jaWxpYXRpb24gZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1JlY29uY2lsaWF0aW9uJztcbmltcG9ydCBXYWxsZXRzIGZyb20gJy4uL3BhZ2VzL2Rhc2hib2FyZC9XYWxsZXRzJztcbmltcG9ydCBUcmFuc2FjdGlvbnMgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1RyYW5zYWN0aW9ucyc7XG5pbXBvcnQgRGVGaSBmcm9tICcuLi9wYWdlcy9kYXNoYm9hcmQvRGVGaSc7XG5pbXBvcnQgTkZUcyBmcm9tICcuLi9wYWdlcy9kYXNoYm9hcmQvTkZUcyc7XG5pbXBvcnQgUGVyZm9ybWFuY2UgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1BlcmZvcm1hbmNlJztcbmltcG9ydCBQcmljZXMgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1ByaWNlcyc7XG5pbXBvcnQgVGF4ZXMgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1RheGVzJztcbmltcG9ydCBUYXhMb3NzSGFydmVzdGluZyBmcm9tICcuLi9wYWdlcy9kYXNoYm9hcmQvVGF4TG9zc0hhcnZlc3RpbmcnO1xuaW1wb3J0IEV4cG9ydHMgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL0V4cG9ydHMnO1xuaW1wb3J0IFRlYW0gZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1RlYW0nO1xuaW1wb3J0IE5vdGlmaWNhdGlvbnMgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL05vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IFN1cHBvcnQgZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL1N1cHBvcnQnO1xuaW1wb3J0IEFjY291bnRIZWFsdGggZnJvbSAnLi4vcGFnZXMvZGFzaGJvYXJkL0FjY291bnRIZWFsdGgnO1xuaW1wb3J0IFNldHRpbmdzUGFnZSBmcm9tICcuLi9wYWdlcy9kYXNoYm9hcmQvU2V0dGluZ3MnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEYXNoYm9hcmRMYXlvdXQoKSB7XG4gIGNvbnN0IGxvY2F0aW9uID0gdXNlTG9jYXRpb24oKTtcbiAgY29uc3QgW2lzTW9iaWxlTWVudU9wZW4sIHNldElzTW9iaWxlTWVudU9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGlzQWN0aXZlID0gKHBhdGg6IHN0cmluZykgPT4ge1xuICAgIGlmIChwYXRoID09PSAnL2Rhc2hib2FyZCcgJiYgbG9jYXRpb24ucGF0aG5hbWUgPT09ICcvZGFzaGJvYXJkJykgcmV0dXJuIHRydWU7XG4gICAgaWYgKHBhdGggIT09ICcvZGFzaGJvYXJkJyAmJiBsb2NhdGlvbi5wYXRobmFtZS5zdGFydHNXaXRoKHBhdGgpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgbmF2TGlua0NsYXNzID0gKHBhdGg6IHN0cmluZykgPT4gYGZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHB4LTQgcHktMi41IHJvdW5kZWQteGwgZm9udC1tZWRpdW0gdHJhbnNpdGlvbi1jb2xvcnMgdGV4dC1zbSAke1xuICAgIGlzQWN0aXZlKHBhdGgpXG4gICAgICA/ICdiZy1icmFuZC1wdXJwbGUvMTAgdGV4dC1icmFuZC1wdXJwbGUgZm9udC1ib2xkJ1xuICAgICAgOiAndGV4dC1icmFuZC10ZXh0LWdyYXkgaG92ZXI6YmctZ3JheS01MCBob3Zlcjp0ZXh0LWJyYW5kLWRhcmsnXG4gIH1gO1xuXG4gIGNvbnN0IGNsb3NlTW9iaWxlTWVudSA9ICgpID0+IHNldElzTW9iaWxlTWVudU9wZW4oZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctWyNGOEZBRkNdIGZsZXggZm9udC1zYW5zIHRleHQtYnJhbmQtZGFya1wiPlxuICAgICAgey8qIE1vYmlsZSBNZW51IE92ZXJsYXkgKi99XG4gICAgICB7aXNNb2JpbGVNZW51T3BlbiAmJiAoXG4gICAgICAgIDxkaXYgXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCBiZy1icmFuZC1kYXJrLzIwIHotNDAgbGc6aGlkZGVuXCJcbiAgICAgICAgICBvbkNsaWNrPXtjbG9zZU1vYmlsZU1lbnV9XG4gICAgICAgIC8+XG4gICAgICApfVxuXG4gICAgICB7LyogU2lkZWJhciAqL31cbiAgICAgIDxhc2lkZSBjbGFzc05hbWU9e2BmaXhlZCBpbnNldC15LTAgbGVmdC0wIHotNTAgdy02NCBiZy13aGl0ZSBib3JkZXItciBib3JkZXItZ3JheS0yMDAgZmxleCBmbGV4LWNvbCBoLXNjcmVlbiB0cmFuc2Zvcm0gdHJhbnNpdGlvbi10cmFuc2Zvcm0gZHVyYXRpb24tMzAwIGxnOnRyYW5zbGF0ZS14LTAgbGc6c3RhdGljICR7XG4gICAgICAgIGlzTW9iaWxlTWVudU9wZW4gPyAndHJhbnNsYXRlLXgtMCcgOiAnLXRyYW5zbGF0ZS14LWZ1bGwnXG4gICAgICB9YH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02IHBiLTIgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgPExpbmsgdG89XCIvXCIgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgbWItNiBob3ZlcjpvcGFjaXR5LTgwIHRyYW5zaXRpb24tb3BhY2l0eVwiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctOCBoLTggcm91bmRlZC1sZyBiZy1icmFuZC1wdXJwbGUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC13aGl0ZSBmb250LWJvbGQgdGV4dC14bCBzaGFkb3ctbWRcIj5cbiAgICAgICAgICAgICAgUlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LWRpc3BsYXkgZm9udC1ib2xkIHRleHQteGwgdHJhY2tpbmctdGlnaHQgdGV4dC1icmFuZC1kYXJrXCI+UmVzdG9yZUNoYWluPC9zcGFuPlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgICAgb25DbGljaz17Y2xvc2VNb2JpbGVNZW51fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibGc6aGlkZGVuIHAtMiB0ZXh0LWdyYXktNTAwIGhvdmVyOmJnLWdyYXktMTAwIHJvdW5kZWQtbGcgbWItNlwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFggc2l6ZT17MjB9IC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiZmxleC0xIHB4LTMgb3ZlcmZsb3cteS1hdXRvIHBiLTYgc3BhY2UteS0xIGN1c3RvbS1zY3JvbGxiYXJcIj5cbiAgICAgICAgICA8TGluayB0bz1cIi9kYXNoYm9hcmRcIiBvbkNsaWNrPXtjbG9zZU1vYmlsZU1lbnV9IGNsYXNzTmFtZT17bmF2TGlua0NsYXNzKCcvZGFzaGJvYXJkJyl9PlxuICAgICAgICAgICAgPExheW91dERhc2hib2FyZCBzaXplPXsxOH0gLz4gUG9ydGZvbGlvXG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Rhc2hib2FyZC9yZWNvbmNpbGlhdGlvblwiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvcmVjb25jaWxpYXRpb24nKX0+XG4gICAgICAgICAgICA8QWN0aXZpdHkgc2l6ZT17MTh9IC8+IFJlY29uY2lsaWF0aW9uXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtbC1hdXRvIGJnLXJlZC0xMDAgdGV4dC1yZWQtNjAwIHB4LTIgcHktMC41IHJvdW5kZWQtZnVsbCB0ZXh0LVsxMHB4XSBmb250LWJvbGRcIj4zPC9zcGFuPlxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8TGluayB0bz1cIi9kYXNoYm9hcmQvd2FsbGV0c1wiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvd2FsbGV0cycpfT5cbiAgICAgICAgICAgIDxXYWxsZXQgc2l6ZT17MTh9IC8+IFdhbGxldHNcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL3RyYW5zYWN0aW9uc1wiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvdHJhbnNhY3Rpb25zJyl9PlxuICAgICAgICAgICAgPEhpc3Rvcnkgc2l6ZT17MTh9IC8+IFRyYW5zYWN0aW9uc1xuICAgICAgICAgIDwvTGluaz5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXktMiBib3JkZXItdCBib3JkZXItZ3JheS0xMDBcIj48L2Rpdj5cblxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Rhc2hib2FyZC9kZWZpXCIgb25DbGljaz17Y2xvc2VNb2JpbGVNZW51fSBjbGFzc05hbWU9e25hdkxpbmtDbGFzcygnL2Rhc2hib2FyZC9kZWZpJyl9PlxuICAgICAgICAgICAgPENvaW5zIHNpemU9ezE4fSAvPiBEZUZpIFBvc2l0aW9uc1xuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8TGluayB0bz1cIi9kYXNoYm9hcmQvbmZ0c1wiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvbmZ0cycpfT5cbiAgICAgICAgICAgIDxJbWFnZSBzaXplPXsxOH0gLz4gTkZUc1xuICAgICAgICAgIDwvTGluaz5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXktMiBib3JkZXItdCBib3JkZXItZ3JheS0xMDBcIj48L2Rpdj5cblxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Rhc2hib2FyZC9wZXJmb3JtYW5jZVwiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvcGVyZm9ybWFuY2UnKX0+XG4gICAgICAgICAgICA8VHJlbmRpbmdVcCBzaXplPXsxOH0gLz4gUGVyZm9ybWFuY2VcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL3ByaWNlc1wiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvcHJpY2VzJyl9PlxuICAgICAgICAgICAgPEJhckNoYXJ0MyBzaXplPXsxOH0gLz4gUHJpY2VzXG4gICAgICAgICAgPC9MaW5rPlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteS0yIGJvcmRlci10IGJvcmRlci1ncmF5LTEwMFwiPjwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Rhc2hib2FyZC90YXhlc1wiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvdGF4ZXMnKX0+XG4gICAgICAgICAgICA8UmVjZWlwdCBzaXplPXsxOH0gLz4gVGF4ZXNcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL3RheC1sb3NzLWhhcnZlc3RpbmdcIiBvbkNsaWNrPXtjbG9zZU1vYmlsZU1lbnV9IGNsYXNzTmFtZT17bmF2TGlua0NsYXNzKCcvZGFzaGJvYXJkL3RheC1sb3NzLWhhcnZlc3RpbmcnKX0+XG4gICAgICAgICAgICA8RmlsZVRleHQgc2l6ZT17MTh9IC8+IFRheCBMb3NzIEhhcnZlc3RpbmdcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteS0yIGJvcmRlci10IGJvcmRlci1ncmF5LTEwMFwiPjwvZGl2PlxuXG4gICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL2V4cG9ydHNcIiBvbkNsaWNrPXtjbG9zZU1vYmlsZU1lbnV9IGNsYXNzTmFtZT17bmF2TGlua0NsYXNzKCcvZGFzaGJvYXJkL2V4cG9ydHMnKX0+XG4gICAgICAgICAgICA8RG93bmxvYWQgc2l6ZT17MTh9IC8+IEV4cG9ydHNcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL3RlYW1cIiBvbkNsaWNrPXtjbG9zZU1vYmlsZU1lbnV9IGNsYXNzTmFtZT17bmF2TGlua0NsYXNzKCcvZGFzaGJvYXJkL3RlYW0nKX0+XG4gICAgICAgICAgICA8VXNlcnMgc2l6ZT17MTh9IC8+IFRlYW0gJiBQcm9zXG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L25hdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMyBib3JkZXItdCBib3JkZXItZ3JheS0xMDAgYmctZ3JheS01MC81MFwiPlxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Rhc2hib2FyZC9hY2NvdW50LWhlYWx0aFwiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvYWNjb3VudC1oZWFsdGgnKX0+XG4gICAgICAgICAgICA8SGVhcnRQdWxzZSBzaXplPXsxOH0gY2xhc3NOYW1lPVwidGV4dC1ncmVlbi01MDBcIiAvPiBBY2NvdW50IEhlYWx0aFxuICAgICAgICAgIDwvTGluaz5cbiAgICAgICAgICA8TGluayB0bz1cIi9kYXNoYm9hcmQvbm90aWZpY2F0aW9uc1wiIG9uQ2xpY2s9e2Nsb3NlTW9iaWxlTWVudX0gY2xhc3NOYW1lPXtuYXZMaW5rQ2xhc3MoJy9kYXNoYm9hcmQvbm90aWZpY2F0aW9ucycpfT5cbiAgICAgICAgICAgIDxCZWxsIHNpemU9ezE4fSAvPiBOb3RpZmljYXRpb25zXG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDxMaW5rIHRvPVwiL2Rhc2hib2FyZC9zdXBwb3J0XCIgb25DbGljaz17Y2xvc2VNb2JpbGVNZW51fSBjbGFzc05hbWU9e25hdkxpbmtDbGFzcygnL2Rhc2hib2FyZC9zdXBwb3J0Jyl9PlxuICAgICAgICAgICAgPEhlbHBDaXJjbGUgc2l6ZT17MTh9IC8+IFN1cHBvcnRcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL3NldHRpbmdzXCIgb25DbGljaz17Y2xvc2VNb2JpbGVNZW51fSBjbGFzc05hbWU9e25hdkxpbmtDbGFzcygnL2Rhc2hib2FyZC9zZXR0aW5ncycpfT5cbiAgICAgICAgICAgIDxTZXR0aW5ncyBzaXplPXsxOH0gLz4gU2V0dGluZ3NcbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0yIHB0LTIgYm9yZGVyLXQgYm9yZGVyLWdyYXktMjAwXCI+XG4gICAgICAgICAgICA8TGluayB0bz1cIi9sb2dpblwiIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHB4LTQgcHktMiBob3ZlcjpiZy13aGl0ZSByb3VuZGVkLXhsIHRyYW5zaXRpb24tY29sb3JzIGdyb3VwXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy04IGgtOCByb3VuZGVkLWZ1bGwgYmctZ3JheS0yMDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAgICAgIDxVc2VyIHNpemU9ezE2fSAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJvbGQgdGV4dC1icmFuZC1kYXJrIHRydW5jYXRlIGdyb3VwLWhvdmVyOnRleHQtYnJhbmQtcHVycGxlIHRyYW5zaXRpb24tY29sb3JzXCI+SmFuZSBEb2U8L3A+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gZm9udC1ib2xkIHRleHQtYnJhbmQtcHVycGxlIGJnLWJyYW5kLXB1cnBsZS8xMCBweC0xLjUgcHktMC41IHJvdW5kZWQgaW5saW5lLWJsb2NrXCI+UHJvIFBsYW48L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8TG9nT3V0IHNpemU9ezE2fSBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwIGdyb3VwLWhvdmVyOnRleHQtcmVkLTUwMCB0cmFuc2l0aW9uLWNvbG9yc1wiIC8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9hc2lkZT5cblxuICAgICAgey8qIE1haW4gQ29udGVudCAqL31cbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgey8qIFRvcGJhciBmb3IgbW9iaWxlICsgc2VhcmNoICovfVxuICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImJnLXdoaXRlIGJvcmRlci1iIGJvcmRlci1ncmF5LTIwMCBweC02IHB5LTQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHN0aWNreSB0b3AtMCB6LTIwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBmbGV4LTFcIj5cbiAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzTW9iaWxlTWVudU9wZW4odHJ1ZSl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxnOmhpZGRlbiBwLTIgLW1sLTIgdGV4dC1ncmF5LTUwMCBob3ZlcjpiZy1ncmF5LTEwMCByb3VuZGVkLWxnIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE1lbnUgc2l6ZT17MjR9IC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1heC13LXhsXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICA8U2VhcmNoIGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1ncmF5LTQwMFwiIHNpemU9ezE4fSAvPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCIgXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCB0cmFuc2FjdGlvbnMsIHdhbGxldHMuLi5cIiBcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBwbC0xMCBwci00IHB5LTIgYmctZ3JheS01MCBib3JkZXIgYm9yZGVyLWdyYXktMjAwIHJvdW5kZWQteGwgdGV4dC1zbSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWJyYW5kLXB1cnBsZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1icmFuZC1wdXJwbGUgdHJhbnNpdGlvbi1hbGxcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtbC00IHNocmluay0wXCI+XG4gICAgICAgICAgICAgPExpbmsgdG89XCIvZGFzaGJvYXJkL25vdGlmaWNhdGlvbnNcIiBjbGFzc05hbWU9XCJwLTIgdGV4dC1ncmF5LTQwMCBob3Zlcjp0ZXh0LWJyYW5kLWRhcmsgdHJhbnNpdGlvbi1jb2xvcnMgcmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgIDxCZWxsIHNpemU9ezIwfSAvPlxuICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTEuNSByaWdodC0xLjUgdy0yIGgtMiBiZy1yZWQtNTAwIHJvdW5kZWQtZnVsbCBib3JkZXItMiBib3JkZXItd2hpdGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNiBsZzpwLTEwIG1heC13LTd4bCBteC1hdXRvXCI+XG4gICAgICAgICAgPFJvdXRlcz5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGVsZW1lbnQ9ezxQb3J0Zm9saW8gLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9yZWNvbmNpbGlhdGlvblwiIGVsZW1lbnQ9ezxSZWNvbmNpbGlhdGlvbiAvPn0gLz5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3dhbGxldHNcIiBlbGVtZW50PXs8V2FsbGV0cyAvPn0gLz5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3RyYW5zYWN0aW9uc1wiIGVsZW1lbnQ9ezxUcmFuc2FjdGlvbnMgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9kZWZpXCIgZWxlbWVudD17PERlRmkgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9uZnRzXCIgZWxlbWVudD17PE5GVHMgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9wZXJmb3JtYW5jZVwiIGVsZW1lbnQ9ezxQZXJmb3JtYW5jZSAvPn0gLz5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3ByaWNlc1wiIGVsZW1lbnQ9ezxQcmljZXMgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi90YXhlc1wiIGVsZW1lbnQ9ezxUYXhlcyAvPn0gLz5cbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL3RheC1sb3NzLWhhcnZlc3RpbmdcIiBlbGVtZW50PXs8VGF4TG9zc0hhcnZlc3RpbmcgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9leHBvcnRzXCIgZWxlbWVudD17PEV4cG9ydHMgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi90ZWFtXCIgZWxlbWVudD17PFRlYW0gLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9ub3RpZmljYXRpb25zXCIgZWxlbWVudD17PE5vdGlmaWNhdGlvbnMgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9zdXBwb3J0XCIgZWxlbWVudD17PFN1cHBvcnQgLz59IC8+XG4gICAgICAgICAgICA8Um91dGUgcGF0aD1cIi9hY2NvdW50LWhlYWx0aFwiIGVsZW1lbnQ9ezxBY2NvdW50SGVhbHRoIC8+fSAvPlxuICAgICAgICAgICAgPFJvdXRlIHBhdGg9XCIvc2V0dGluZ3MvKlwiIGVsZW1lbnQ9ezxTZXR0aW5nc1BhZ2UgLz59IC8+XG4gICAgICAgICAgPC9Sb3V0ZXM+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9tYWluPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm1hcHBpbmdzIjoiQUFpRFE7QUFqRFIsU0FBZ0IsZ0JBQWdC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