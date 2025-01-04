import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './App.css';
import { HomePage } from "./pages/Home";
import { QueryClientProvider, QueryClient } from "react-query";
import { Helmet } from "react-helmet";
import { ExplorerPage } from "./pages/Explorer";
import {InstallingManual} from "./pages/InstallingManual";

const router = createBrowserRouter([
  {path: "/", element: <HomePage />},
  {path: "/install-node", element: <InstallingManual />},
  {path: "/explore/:id?", element: <ExplorerPage />},
]);

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
        <Helmet>
            <title>Story Protocol Assistant</title>
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Helmet>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
