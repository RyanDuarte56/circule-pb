import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserTypeSelection from "./pages/UserTypeSelection";
import EmailVerification from "./pages/EmailVerification";
import DriverSetup from "./pages/DriverSetup";
import DriverCRLV from "./pages/DriverCRLV";
import DriverCNH from "./pages/DriverCNH";
import Menu from "./pages/Menu";
import Profile from "./pages/Profile";
import RequestRide from "./pages/RequestRide";
import OfferRide from "./pages/OfferRide";
import RidesList from "./pages/RidesList";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-type-selection" element={<UserTypeSelection />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/driver-setup" element={<DriverSetup />} />
            <Route path="/driver-crlv" element={<DriverCRLV />} />
            <Route path="/driver-cnh" element={<DriverCNH />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/request-ride" element={<RequestRide />} />
            <Route path="/offer-ride" element={<OfferRide />} />
            <Route path="/rides" element={<RidesList />} />
            <Route path="/chat/:rideId" element={<Chat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
