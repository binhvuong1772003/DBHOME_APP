# SHN App — Frontend

SHN App là frontend cho nền tảng quản lý salon/nail và marketplace khám phá dịch vụ. Ứng dụng được xây dựng bằng React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI và Lucide.

## Yêu cầu

- Node.js và npm phiên bản tương thích với Vite/TypeScript hiện tại.
- Backend SHN đang chạy và cho phép CORS credentials từ frontend.

Frontend mặc định gọi backend qua `VITE_API_URL`.

## Chạy local

```bash
npm install
npm run dev
```

Vite sẽ mở ứng dụng tại `http://localhost:5173`.

Tạo `.env.local` cho máy cá nhân (file này không nên commit):

```env
VITE_API_URL=http://localhost:3000
```

Các lệnh thường dùng:

```bash
npm run dev       # development server
npm run build     # TypeScript check + production build
npm run preview   # preview bản build
npm run lint      # ESLint toàn bộ source
```

## Cấu hình runtime

`src/config/env.ts` đọc biến môi trường Vite và loại bỏ dấu `/` cuối domain. Không đặt secret, access key hoặc credential nội bộ vào biến `VITE_*`; các biến này được đưa vào client bundle.

`src/api/axiosClient.ts` là HTTP client dùng chung:

- `baseURL` lấy từ `VITE_API_URL`.
- Tự gắn access token từ `localStorage`.
- Gửi cookie refresh với `withCredentials`.
- Tự thử refresh token khi nhận `401`.
- Chuẩn hoá xử lý `FormData` và timeout.

Backend trả response theo dạng:

```ts
{
  success: true,
  data: ...,
  meta?: ...
}
```

Response phân trang dùng `meta.page`, `meta.limit`, `meta.total`, `meta.totalPages`, `meta.hasNext` và `meta.hasPrev`.

## Kiến trúc source

```text
src/
  api/          Axios client và kiểu response chung
  components/   UI dùng chung, shadcn/ui và layout primitives
  config/       Cấu hình runtime
  context/      Auth, shop và membership context
  features/     Mỗi domain gồm components, hooks, services, types
  i18n/         Resource tiếng Việt/tiếng Anh theo namespace
  lib/          Utility dùng chung
  pages/        Route-level page và adapter tới feature
  routes/       Khai báo route shop/workspace
  services/     API service dùng chung cho domain
  types/        Kiểu dữ liệu dùng ở nhiều feature
```

Feature hiện tại gồm:

- `auth`: đăng nhập, đăng ký, Google callback và xác minh email.
- `marketplace-home`: homepage khám phá dịch vụ/salon.
- `marketplace-search`: tìm shop tại `/shops`.
- `public-shop`: trang shop công khai và luồng đặt lịch.
- `ai-assistant`: chat assistant, conversation history và message history.
- `shop/admin`: dashboard, appointments, staff, services, customers, payments, payroll, financial report và settings.
- `shop/workspace`: lịch làm việc, attendance, time-off, payroll và profile cho staff.

Import nội bộ dùng alias `@/`, ví dụ:

```ts
import axiosClient from "@/api/axiosClient";
```

## Routing chính

| Khu vực | Route |
| --- | --- |
| Homepage công khai | `/` |
| Tìm shop | `/shops` |
| Shop công khai | `/shops/:shopSlug` |
| Đặt lịch công khai | `/shops/:shopSlug/book` |
| Auth | `/auth` |
| Tạo shop | `/shops/create` |
| Admin dashboard | `/shops/:shopSlug/admin` |
| Admin services | `/shops/:shopSlug/admin/services` |
| Admin appointments | `/shops/:shopSlug/admin/appointments` |
| Admin staff | `/shops/:shopSlug/admin/staff` |
| Admin payments | `/shops/:shopSlug/admin/payments` |
| Admin customers | `/shops/:shopSlug/admin/customers` |
| Admin payroll | `/shops/:shopSlug/admin/payroll` |
| Financial report | `/shops/:shopSlug/admin/financial-report` |
| Workspace | `/shops/:shopSlug/workspace` |
| Workspace schedule | `/shops/:shopSlug/workspace/schedule` |
| Tài khoản | `/account` |

Route admin/workspace được bảo vệ bởi `PrivateRoute`, `ShopAccessRoute`, `ShopManagerRoute` hoặc `WorkspaceAccess` tuỳ quyền. Backend vẫn là nơi enforce authorization cuối cùng.

## Auth và context

- `AuthProvider` khôi phục user qua `/auth/me`, giữ session và refresh token.
- `ShopProvider` tải danh sách shop user có quyền truy cập và resolve shop theo `shopSlug` trên URL.
- `ShopMembershipProvider` tải membership của shop hiện tại cho các route shop.
- Public homepage và public shop không nên gọi `useShopContext()` bắt buộc; dùng provider scope phù hợp hoặc hook optional khi cần.

Không đọc `userId`, role hoặc permission từ query string để quyết định quyền. Các action ghi dữ liệu phải đi qua API và được backend kiểm tra.

## API và data flow

Mỗi domain nên giữ flow:

```text
page/component → hook → service → axiosClient → backend
```

Không gọi Axios trực tiếp trong JSX. Khi thêm endpoint:

1. Kiểm tra service/hook hiện có trước khi tạo mới.
2. Định nghĩa request/response type theo contract backend.
3. Xử lý loading, empty và error state ở hook/page.
4. Sau mutation, refetch hoặc invalidate dữ liệu liên quan; không tự đoán lại số liệu backend.
5. Với danh sách lớn, gửi pagination/filter xuống backend thay vì tải toàn bộ dữ liệu về client.

Một số service tiêu biểu:

- `src/services/marketplaceService.ts`
- `src/services/accountService.ts`
- `src/services/notificationService.ts`
- `src/features/public-shop/services/publicShopService.ts`
- `src/features/shop/admin/*/services/*Service.ts`

## AI Assistant

AI assistant được mount trong shop layout thông qua `AiAssistantScope`. Service hiện tại sử dụng:

```text
GET  /api/ai/shops/:shopSlug/conversations
GET  /api/ai/shops/:shopSlug/conversations/:conversationId/messages
POST /api/ai/shops/:shopSlug/chat
```

`useAiChat` quản lý conversation hiện tại, danh sách history, phân trang message cũ, gửi message, retry và trạng thái loading/error. Conversation id chỉ được lưu trong `sessionStorage` theo shop; không lưu secret trong frontend.

## i18n và theme

- i18n khởi tạo tại `src/i18n/index.ts`.
- Resource đặt tại `src/i18n/locales/en` và `src/i18n/locales/vi`.
- Mỗi feature nên dùng namespace riêng qua `useTranslation("namespace")`.
- Ngôn ngữ hiện tại được lưu ở key `language`; fallback là English.
- Theme dùng `ThemeProvider`, hỗ trợ `light`, `dark` và `system`, lưu ở key `vite-ui-theme`.

UI text mới phải đi qua i18n. Không hardcode màu theo từng feature; dùng semantic token trong `src/index.css` như `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `border-border` và `bg-primary`.

Quy ước giao diện của project:

- Không dùng gradient cho UI.
- Dùng icon vector từ Lucide; không dùng emoji làm icon chức năng.
- Ưu tiên shadcn/ui primitives hiện có.
- Giữ light/dark pairing, focus-visible, target thao tác tối thiểu 44px và responsive không tràn ngang.

## Homepage discovery preview

Homepage hiện có ba section khám phá: Recommended, Popular và Explore Categories. Vì thuật toán recommendation/popularity chưa chốt, dữ liệu preview nằm riêng tại:

```text
src/features/marketplace-home/mock/discoveryMockData.ts
```

Các card preview được gắn nhãn xem trước và không giả lập rating, khoảng cách hoặc booking count. Khi backend có contract recommendation/popularity, thay data layer này bằng service/hook mới; không đưa thuật toán phức tạp vào JSX.

Explore Categories đang dùng shop type backend (`NAIL`, `SPA`, `HAIR`, `COMBO`) và điều hướng tới `/shops?type=...`.

## Thêm hoặc sửa feature

Giữ cấu trúc feature-first và tách trách nhiệm:

```text
features/<domain>/
  components/
  hooks/
  services/
  types/
  utils/
```

Tái sử dụng component/context/service trước khi tạo mới. Route-level page chỉ kết nối hook và component; không biến page thành file chứa toàn bộ API, business logic và markup.

Trước khi mở pull request:

```bash
npm run build
npm run lint
```

Nếu lint phát hiện lỗi ở file không liên quan, ghi rõ đó là baseline hiện có thay vì sửa lan sang domain khác.

## Backend local

Khi chạy đầy đủ hệ thống, khởi động backend SHN và đặt `VITE_API_URL` trỏ tới domain backend. Kiểm tra CORS, credentials và route prefix `/api` nếu API request bị `401`, `403`, `404` hoặc lỗi preflight.
