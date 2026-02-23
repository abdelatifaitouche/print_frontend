import { Printer } from "lucide-react"
import { LoginForm } from "@/Components/login-form"
import { Toaster } from "sonner"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Printer className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">PrintFlow</span>
          </div>
          <div className="text-sm text-slate-600">
            Need help? <a href="#" className="text-slate-900 font-medium hover:underline">Contact Support</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marketing Content */}
          <div className="hidden lg:block">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-slate-900 mb-6">
                Manage print orders with precision
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Streamline your workflow, track production in real-time, and deliver exceptional results to your clients.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Real-time Order Tracking</h3>
                    <p className="text-sm text-slate-600">Monitor every order from submission to delivery</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Automated Workflows</h3>
                    <p className="text-sm text-slate-600">Save time with intelligent automation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Team Collaboration</h3>
                    <p className="text-sm text-slate-600">Keep everyone aligned with shared dashboards</p>
                  </div>
                </div>
              </div>

              {/* Brought to you by */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Brought to you by <span className="font-semibold text-slate-900">Axentis</span>
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Contact: <a href="tel:0778185928" className="text-slate-700 hover:text-slate-900 font-medium">0778 18 59 28</a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <LoginForm />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}