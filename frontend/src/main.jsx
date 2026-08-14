import React from "react";
import ReactDOM from "react-dom/client";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(
    document.getElementById("root")
).render(
    <React.StrictMode>

        <QueryClientProvider client={queryClient}>

            <App />
            <Toaster position="top-right" />

        </QueryClientProvider>

    </React.StrictMode>
);