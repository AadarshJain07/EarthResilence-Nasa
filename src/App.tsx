import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // <-- HashRouter
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Coach from "./pages/Coach";
import Simulate from "./pages/Simulate";
import Community from "./pages/Community";
import Games from "./pages/Games";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/coach" element={
                <ProtectedRoute><Coach /></ProtectedRoute>
              } />
              <Route path="/simulate" element={
                <ProtectedRoute><Simulate /></ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute><Community /></ProtectedRoute>
              } />
              <Route path="/games" element={
                <ProtectedRoute><Games /></ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute><Marketplace /></ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
