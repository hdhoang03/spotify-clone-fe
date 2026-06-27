# 🎵 Springtunes Client (Frontend)

Springtunes là một ứng dụng nghe nhạc trực tuyến chất lượng cao lấy cảm hứng từ Spotify, được xây dựng trên nền tảng **React 19**, **TypeScript**, và **Vite**. Dự án hướng tới một giao diện hiện đại (Premium Aesthetics), mượt mà, hỗ trợ đa ngôn ngữ và sở hữu các tối ưu hóa đặc biệt giúp chạy ổn định trên các thiết bị cấu hình cũ.

---

## ✨ Tính Năng Nổi Bật

### 1. Giao Diện & Trải Nghiệm Người Dùng (Premium Aesthetics)
- **Đồng bộ hóa màu sắc thông minh**: Sử dụng thuật toán phân tích màu trung bình từ thư viện `fast-average-color` để tự động tách xuất màu sắc chủ đạo từ ảnh bìa bài hát/playlist. Màu sắc này được áp dụng làm nền gradient chuyển động mượt mà cho giao diện, đem lại trải nghiệm thị giác sống động.
- **Đặc quyền tài khoản Premium**: Người dùng Premium sẽ sở hữu vòng hào quang động quanh ảnh đại diện, vương miện lấp lánh và hiệu ứng tên chữ ánh kim lấp lánh (Golden Shimmer Name Effect) nổi bật.
- **Chế độ Sáng/Tối (Light/Dark Mode)**: Tùy biến chủ đề hiển thị toàn diện theo sở thích người dùng.

### 2. Trình Phát Nhạc Đa Dạng (Advanced Audio Player)
Hỗ trợ 3 trạng thái phát nhạc linh hoạt phù hợp với nhu cầu thao tác:
- **MiniPlayer**: Trình phát thu nhỏ thông minh hỗ trợ kéo thả (drag-and-drop) tự do đến bất kỳ vị trí nào trên màn hình.
- **Sidebar Player**: Tích hợp trực tiếp bên cạnh thanh điều hướng để tối giản hóa vùng làm việc.
- **Fullscreen Player**: Chế độ phát nhạc toàn màn hình tuyệt đẹp với lời bài hát (Lyrics) cuộn tự động theo thời gian thực và thông tin nghệ sĩ chi tiết.
- **Hàng đợi & Tự động phát (Queue & Autoplay)**: Tiếp tục phát tự động các bài hát liên quan khi danh sách bài hát hiện tại kết thúc.

### 3. Tối Ưu Hóa Thiết Bị Cấu Hình Thấp (Low Performance Mode)
- **Tắt hiệu ứng nặng**: Cung cấp tùy chọn chuyển đổi nhanh trong phần cài đặt giúp vô hiệu hóa toàn bộ hiệu ứng chuyển động (`transition`), làm mờ nền (`backdrop-blur`), và các hiệu ứng keyframe animation phức tạp.
- **Lợi ích**: Tối ưu hóa chỉ số FPS, tránh hiện tượng Reflow/Repaint, giúp ứng dụng hoạt động cực kỳ mượt mà trên các dòng máy cũ hoặc cấu hình yếu.

### 4. Chia Sẻ Hồ Sơ & Mã QR
- **Profile Share Card**: Xuất thẻ hồ sơ cá nhân đẹp mắt dưới dạng hình ảnh chất lượng cao kèm mã QR tự động (sử dụng `html-to-image` và `qrcode.react`) để chia sẻ nhanh lên mạng xã hội.
- **Chỉnh sửa hồ sơ trực quan**: Thay đổi ảnh đại diện tích hợp công cụ cắt ảnh (`react-easy-crop`) chuẩn xác.

### 5. Bộ Máy Kết Nối API Nâng Cao (Axios Client in `api.ts`)
Bộ điều phối yêu cầu HTTP của ứng dụng sở hữu các cơ chế xử lý cực kỳ mạnh mẽ:
- **Cơ chế Dự Phòng Điểm Cuối (Endpoint Fallback)**: Nếu một máy chủ API gặp sự cố mạng (`ERR_NETWORK`), ứng dụng sẽ tự động chuyển sang địa chỉ API dự phòng tiếp theo trong danh sách cấu hình và thực hiện lại yêu cầu ngay lập tức mà không làm gián đoạn trải nghiệm người dùng.
- **Hàng Đợi Làm Mới Token (Mutex-based Refresh Token Queue)**: Khi nhiều yêu cầu đồng thời bị từ chối do Token hết hạn (Lỗi 401), bộ lọc sẽ tạm giữ các yêu cầu này trong một hàng đợi. Ứng dụng chỉ gửi duy nhất 1 yêu cầu refresh token lên backend. Khi nhận được token mới, nó sẽ tự động phân phối lại cho toàn bộ các yêu cầu đang chờ và thực thi tiếp.
- **Hỗ trợ Ngrok**: Tự động đính kèm tiêu đề `'ngrok-skip-browser-warning': 'true'` giúp bỏ qua màn hình cảnh báo khi nhà phát triển sử dụng ngrok làm đường truyền tunnel để test API cục bộ.

### 6. Đa Ngôn Ngữ (i18n)
- Hỗ trợ đầy đủ **4 ngôn ngữ**: **Tiếng Việt (VI)**, **Tiếng Anh (EN)**, **Tiếng Hàn (KO)**, và **Tiếng Nhật (JA)**.

---

## 🛠️ Công Nghệ Sử Dụng

- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion
- **State Management**: Zustand (Quản lý trạng thái trình phát nhạc, hàng đợi phát, cài đặt giao diện)
- **API Client**: Axios
- **Localization**: i18next & i18next-browser-languagedetector
- **Media Helpers**: fast-average-color, html-to-image, qrcode.react, react-easy-crop
- **Icons**: Lucide React
- **Charts**: Recharts (Sử dụng trong Admin Dashboard)

---

## 📁 Cấu Trúc Thư Mục Dự Án

```bash
src/
├── components/          # Các components giao diện chính
│   ├── Account/         # Quản lý tài khoản (Thông tin cá nhân, Bảo mật, Đăng ký Premium)
│   ├── Admin/           # Dashboard quản trị, biểu đồ thống kê dành cho Admin
│   ├── Artist/          # Trang nghệ sĩ, thông tin discography, danh sách bài hát nổi bật
│   ├── Auth/            # Đăng nhập, đăng ký, OTP, xác thực Google OAuth, ReCAPTCHA v3
│   ├── HomePage/        # Trang chủ, danh mục thịnh hành, Footer hệ thống
│   ├── MusicPlayer/     # Trình phát nhạc (Mini, Fullscreen, Sidebar, Lyrics)
│   ├── Profile/         # Trang cá nhân, chia sẻ hồ sơ, quản lý blocklist
│   ├── Search/          # Tính năng tìm kiếm và bộ lọc thể loại
│   ├── Settings/        # Cài đặt ngôn ngữ, quyền riêng tư, và Low Performance Mode
│   ├── Sidebar/         # Sidebar điều hướng và Thư viện nhạc cá nhân (Library)
│   └── common/          # Các component dùng chung (Toast, Loader, Button, v.v.)
├── contexts/            # Context API toàn cục
├── hooks/               # Custom hooks toàn cục
├── locales/             # Tệp tin ngôn ngữ (vi.json, en.json, ko.json, ja.json)
├── services/            # Tương tác API (likeApi, notificationService, api.ts)
├── utils/               # Các hàm bổ trợ
├── App.tsx              # Cấu hình Router và Layout chính
├── main.tsx             # Điểm khởi chạy ứng dụng
└── index.css            # Style toàn cục và biến tối ưu hóa CSS
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
- Đã cài đặt **Node.js** (Khuyến nghị phiên bản LTS v18 trở lên).
- Trình quản lý gói: **npm** hoặc **yarn**.

### Bước 1: Clone Kho Lưu Trữ
```bash
git clone https://github.com/hdhoang03/spotify-clone-fe.git
cd spotify-clone-fe
```

### Bước 2: Cài Đặt Các Thư Viện Phụ Thuộc
```bash
npm install
```

### Bước 3: Cấu Hình Biến Môi Trường
Tạo tệp tin `.env` ở thư mục gốc của dự án (cùng cấp với `package.json`) và điền cấu hình:
```env
# Địa chỉ API của Backend (Có thể điền nhiều URL ngăn cách bằng dấu phẩy để kích hoạt cơ chế dự phòng)
VITE_API_URL=http://localhost:8080/spotify,https://spotify-clone-8xkm.onrender.com

# Khóa Public Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Bước 4: Khởi Động Ở Môi Trường Phát Triển
```bash
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

### Bước 5: Biên Tập Cho Môi Trường Production
```bash
npm run build
```
Mã nguồn sau khi được tối ưu hóa và nén sẽ nằm trong thư mục `/dist`.
