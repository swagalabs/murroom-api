const money = { amount: 120000, currency: "UAH" };
const venue = {
  id: "00000000-0000-4000-8000-000000000010",
  name: "Mock Beauty Studio",
  rating: 4.9,
  reviewCount: 128,
  address: "Kyiv, Mock Street 1",
  image: { url: "https://example.com/mock-studio.jpg", alt: "Mock Beauty Studio" },
  isFavorite: false,
  fromPrice: money,
};
const staff = { id: "00000000-0000-4000-8000-000000000020", name: "Jane Smith", rating: 4.9 };
const slot = { startsAt: "2026-10-22T10:00:00+03:00", endsAt: "2026-10-22T11:00:00+03:00", staff };
const paymentMethod = { id: "00000000-0000-4000-8000-000000000030", type: "card", label: "Visa •••• 4242", isDefault: true };
const service = { id: "00000000-0000-4000-8000-000000000040", name: "Mock manicure", price: money, durationMinutes: 60 };
const profile = { id: "00000000-0000-4000-8000-000000000001", firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "+380501234567", theme: "system" };
const address = { id: "00000000-0000-4000-8000-000000000070", label: "Home", formatted: "Kyiv, Mock Street 1", latitude: 50.4501, longitude: 30.5234, isDefault: true };
const cart = { id: "00000000-0000-4000-8000-000000000050", venue, items: [{ id: "00000000-0000-4000-8000-000000000051", service }], paymentMethod, selection: slot, totals: { services: money, discount: { amount: 0, currency: "UAH" }, total: money } };
const appointment = { id: "00000000-0000-4000-8000-000000000060", status: "confirmed", venue, items: [{ id: "00000000-0000-4000-8000-000000000051", service }], staff, startsAt: slot.startsAt, endsAt: slot.endsAt, payment: paymentMethod, totals: cart.totals };
const review = { id: "00000000-0000-4000-8000-000000000090", rating: 5, author: "Olena M.", createdAt: "2026-10-01T10:00:00+03:00" };

const json = (status, body) => new Response(body === undefined ? null : JSON.stringify(body), {
  status,
  headers: body === undefined ? {} : { "Content-Type": "application/json; charset=utf-8" },
});

function mockResponse(method, path) {
  if (method === "POST" && path === "/auth/register") return json(201, { accessToken: "mock-access-token", profile });
  if (method === "POST" && path === "/auth/login") return json(200, { accessToken: "mock-access-token", profile });
  if (method === "POST" && path === "/auth/password-reset/request") return json(202);
  if (method === "POST" && path === "/auth/password-reset/confirm") return json(204);
  if (method === "GET" && path === "/me") return json(200, profile);
  if (method === "PATCH" && path === "/me") return json(200, profile);
  if (method === "PUT" && path === "/me/theme") return json(204);
  if (method === "GET" && path === "/me/addresses") return json(200, [address]);
  if (method === "POST" && path === "/me/addresses") return json(201, address);
  if (method === "PATCH" && /^\/me\/addresses\/[^/]+$/.test(path)) return json(200, address);
  if (method === "DELETE" && /^\/me\/addresses\/[^/]+$/.test(path)) return json(204);
  if (method === "GET" && path === "/favorites") return json(200, [venue]);
  if (method === "POST" && path === "/favorites") return json(201);
  if (method === "DELETE" && /^\/favorites\/[^/]+$/.test(path)) return json(204);
  if (method === "GET" && path === "/categories") return json(200, [{ id: "00000000-0000-4000-8000-000000000080", name: "Манікюр", icon: "sparkles" }]);
  if (method === "GET" && path === "/venues") return json(200, { items: [venue], page: { nextCursor: null } });
  if (method === "GET" && /^\/venues\/[^/]+$/.test(path)) return json(200, { ...venue, description: "A deterministic mock venue.", specialties: [], location: address, openingHours: [] });
  if (method === "GET" && /^\/venues\/[^/]+\/services$/.test(path)) return json(200, [{ id: "00000000-0000-4000-8000-000000000081", name: "Manicure", services: [service] }]);
  if (method === "GET" && /^\/venues\/[^/]+\/reviews$/.test(path)) return json(200, { items: [review], page: { nextCursor: null } });
  if (method === "GET" && path === "/cart") return json(200, cart);
  if (method === "DELETE" && path === "/cart") return json(204);
  if (method === "POST" && path === "/cart/items") return json(201, cart);
  if (method === "DELETE" && /^\/cart\/items\/[^/]+$/.test(path)) return json(200, cart);
  if (method === "PUT" && ["/cart/comment", "/cart/promo-code", "/cart/selection", "/cart/payment-method"].includes(path)) return json(200, cart);
  if (method === "DELETE" && path === "/cart/promo-code") return json(200, cart);
  if (method === "GET" && path === "/cart/availability") return json(200, { venueId: venue.id, slots: [slot] });
  if (method === "GET" && path === "/payment-methods") return json(200, [paymentMethod]);
  if (method === "POST" && path === "/payment-methods") return json(201, paymentMethod);
  if (method === "DELETE" && /^\/payment-methods\/[^/]+$/.test(path)) return json(204);
  if (method === "POST" && path === "/checkout") return json(201, appointment);
  if (method === "GET" && path === "/appointments") return json(200, [appointment]);
  if (method === "GET" && /^\/appointments\/[^/]+$/.test(path)) return json(200, appointment);
  if (method === "GET" && /^\/appointments\/[^/]+\/availability$/.test(path)) return json(200, { venueId: venue.id, slots: [slot] });
  if (method === "POST" && /^\/appointments\/[^/]+\/reschedule$/.test(path)) return json(200, appointment);
  if (method === "GET" && /^\/appointments\/[^/]+\/cancel-quote$/.test(path)) return json(200, { refundableAmount: { amount: 90000, currency: "UAH" }, policyText: "Mock cancellation policy." });
  if (method === "POST" && /^\/appointments\/[^/]+\/cancel$/.test(path)) return json(200, appointment);
  if (method === "POST" && /^\/appointments\/[^/]+\/review$/.test(path)) return json(201, review);
  return json(404, { message: "Mock endpoint not found", method, path });
}

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const marker = "/mock";
  const markerIndex = url.pathname.indexOf(marker);
  if (url.origin !== self.location.origin || markerIndex === -1) return;
  const path = url.pathname.slice(markerIndex + marker.length) || "/";
  event.respondWith(mockResponse(event.request.method, path));
});
