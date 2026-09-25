import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/new")({
  loader: () => {
    throw redirect({ to: "/admin/products" });
  },
});
