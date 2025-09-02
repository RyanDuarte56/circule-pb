import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RidesProvider } from "@/contexts/RidesContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserTypeSelection from "./pages/UserTypeSelection";
import EmailVerification from "./pages/EmailVerification";
import DriverSetup from "./pages/DriverSetup";

import Menu from "./pages/Menu";
import Profile from "./pages/Profile";
import RequestRide from "./pages/RequestRide";
import OfferRide from "./pages/OfferRide";
import RideConfirmation from "./pages/RideConfirmation";
import RidesList from "./pages/RidesList";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import RideHistory from "./pages/RideHistory";
import TrackRide from "./pages/TrackRide";
import FavoriteRoute from "./pages/FavoriteRoute";
import RateUser from "./pages/RateUser";
import UserRatings from "./pages/UserRatings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RidesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-type-selection" element={<UserTypeSelection />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/driver-setup" element={<DriverSetup />} />

            <Route path="/menu" element={<Menu />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/request-ride" element={<RequestRide />} />
            <Route path="/offer-ride" element={<OfferRide />} />
            <Route path="/ride-confirmation" element={<RideConfirmation />} />
            <Route path="/rides" element={<RidesList />} />
            <Route path="/chat/:rideId" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
        <Route path="/ride-history" element={<RideHistory />} />
        <Route path="/track-ride/:rideId" element={<TrackRide />} />
        <Route path="/favorite-routes" element={<FavoriteRoute />} />
        <Route path="/rate-user/:userId" element={<RateUser />} />
        <Route path="/user-ratings/:userId?" element={<UserRatings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </RidesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
