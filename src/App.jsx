import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { routes } from "./routes"; // Import routes
import Header from "./components/Header";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page content under header */}
          <main className="flex-1 p-4 bg-gray-200">
            <Routes>
              <Route path="/" element={<Navigate to="/shifts" replace />} />
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
