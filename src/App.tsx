import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "./components/context/NotificationsProvider"
import Index from "./pages/Index";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Savings from "./pages/Savings";
import NotFound from "./pages/NotFound";
import '@progress/kendo-theme-default/dist/all.css';

const App = () => (
  <NotificationsProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </NotificationsProvider>
);

export default App;
