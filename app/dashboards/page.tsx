import Link from "next/link";
import { getActiveExternalDashboards, getDashboardHeaderConfig } from "@/app/actions/dashboards";
import { ArrowLeft, ExternalLink, Activity } from "lucide-react";

export const metadata = {
  title: "Program Implementation Dashboards | Adhigam",
};

export default async function PublicDashboardsPage() {
  const [dashboards, headerConfig] = await Promise.all([
    getActiveExternalDashboards(),
    getDashboardHeaderConfig(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Dynamic Header Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-[100px] opacity-30 dark:opacity-20 pointer-events-none">
          <div className="aspect-square w-[500px] rounded-full bg-gradient-to-br from-amber-500 to-orange-500" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-[100px] opacity-20 dark:opacity-10 pointer-events-none">
          <div className="aspect-square w-[400px] rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-amber-500 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Heading & Text */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
                <Activity className="w-4 h-4" /> Real-time Analytics
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Implementation</span> Dashboards
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {headerConfig.description}
              </p>
            </div>

            {/* Side Image next to Heading */}
            {headerConfig.imageUrl && (
              <div className="lg:col-span-5 relative">
                {headerConfig.linkUrl ? (
                  <a href={headerConfig.linkUrl} target="_blank" rel="noreferrer" className="group block">
                    <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/20 dark:border-amber-500/30 shadow-2xl shadow-amber-500/10 group-hover:shadow-amber-500/20 transition-all duration-300 group-hover:-translate-y-1">
                      <img 
                        src={headerConfig.imageUrl} 
                        alt={headerConfig.title} 
                        className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 bg-amber-500/80 backdrop-blur-md px-3 py-1.5 rounded-full">
                          Open Dashboard <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <img 
                      src={headerConfig.imageUrl} 
                      alt={headerConfig.title} 
                      className="w-full h-64 sm:h-72 object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboards Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dashboards.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[36px] border border-slate-200 dark:border-slate-800">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Dashboards Available</h3>
              <p className="text-slate-500 mt-2">New analytical dashboards will be published here soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {dashboards.map((dashboard, index) => (
                <a
                  key={dashboard.id}
                  href={dashboard.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Header with Glassmorphism Overlay */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {dashboard.imageUrl ? (
                      <img 
                        src={dashboard.imageUrl} 
                        alt={dashboard.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <Activity className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                      </div>
                    )}
                    {/* Dark gradient overlay at bottom of image */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    
                    {/* Floating Action Button */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors">
                      {dashboard.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                      {dashboard.description || "Click to view the detailed analytics and metrics for this dashboard."}
                    </p>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1 uppercase tracking-wider">
                        View Dashboard &rarr;
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

