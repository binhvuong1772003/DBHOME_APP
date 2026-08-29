const service = {
  page: { eyebrow: "Service workspace", title: "Services", description: "Manage your salon services, pricing and availability." },
  actions: { add: "Add service", changeStatus: "Change service status", expand: "Show service options", collapse: "Hide service options", viewOptions: "View options", hideOptions: "Hide options" },
  overview: { label: "Service overview", all: "All services", active: "Active", hidden: "Hidden", categories: "Categories" },
  toolbar: { label: "Service filters" },
  search: { label: "Search services", placeholder: "Search services...", clear: "Clear search" },
  filters: { all: "All", active: "Active", inactive: "Hidden", clear: "Clear filters" },
  sort: { label: "Sort", name: "Name", price: "Price", duration: "Duration" },
  fields: { service: "Service", category: "Category", status: "Status", priceDuration: "Price · Duration" },
  status: { active: "Active", hidden: "Hidden" },
  service: { optionGroups: "option group", noOptions: "No options", uncategorized: "Uncategorized", required: "Required" },
  units: { minutes: "min", pricePrefix: "+" },
  empty: { title: "No services yet", description: "Create your first service to start accepting appointments.", filteredTitle: "No matching services", filteredDescription: "Try a different search or clear the current filters." },
  messages: { loadError: "Unable to load services", refreshHint: "Refresh the page and try again." },
};
export default service;
