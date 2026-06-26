# 🎵 Springtunes Client (Frontend)

Springtunes là một ứng dụng nghe nhạc trực tuyến chất lượng cao lấy cảm hứng từ Spotify, được xây dựng trên nền tảng **React 19**, **TypeScript**, và **Vite**. Dự án hướng tới một giao diện hiện đại (Premium Aesthetics), mượt mà, hỗ trợ đa ngôn ngữ và có chế độ tối ưu hóa đặc biệt dành cho các thiết bị cấu hình thấp.

---

## ✨ Tính Năng Nổi Bật

### 1. Giao Diện & Trải Nghiệm Người Dùng (Premium Aesthetics)
* **Giao diện hiện đại:** Lấy cảm hứng từ thiết kế sang trọng của Spotify nhưng có bản sắc riêng, hỗ trợ chuyển đổi chủ đề Sáng (Light) và Tối (Dark).
* **Đồng bộ hóa màu sắc:** Tự động phân tích màu chủ đạo của ảnh bìa (Avatar/Cover) bằng thuật toán phân tích màu trung bình để tạo nền gradient chuyển động mượt mà.
* **Giao diện Premium:** Người dùng đăng ký gói Premium sẽ có vòng hào quang động quanh avatar, vương miện lấp lánh và hiệu ứng chữ ánh kim lấp lánh (Golden Shimmer Name).

### 2. Trình Phát Nhạc Đa Dạng (Advanced Audio Player)
* **3 Trạng thái linh hoạt:**
  * **MiniPlayer:** Trình phát thu nhỏ thông minh hỗ trợ kéo thả (drag-and-drop) tự do.
  * **Sidebar Player:** Tích hợp trực tiếp bên cạnh thanh điều hướng để dễ thao tác.
  * **Fullscreen Player:** Chế độ toàn màn hình tuyệt đẹp hiển thị lời bài hát (Lyrics) cuộn động theo thời gian thực và thông tin nghệ sĩ chi tiết.
* **Tự động phát tiếp (Autoplay):** Tiếp tục phát các bài hát liên quan khi danh sách kết thúc.

### 3. Tối Ưu Hóa Cho Thiết Bị Cấu Hình Yếu (Low Performance Mode)
* **Tự động & Chủ động:** Nút chuyển đổi nhanh trong trang cài đặt giúp tắt toàn bộ hiệu ứng chuyển động nặng (`transition`), làm mờ nền (`backdrop-blur`) và các hiệu ứng animation để tối ưu hóa FPS, tránh Reflow, giúp ứng dụng chạy cực kỳ mượt mà trên thiết bị cũ.

### 4. Quản Lý Hồ Sơ & Quyền Riêng Tư
* **Chỉnh sửa hồ sơ:** Thay đổi ảnh đại diện trực quan tích hợp công cụ cắt ảnh (`react-easy-crop`).
* **Tính năng chia sẻ:** Xuất thẻ hồ sơ đẹp mắt (Profile Share Card) dưới dạng hình ảnh chất lượng cao kèm mã QR để chia sẻ dễ dàng.
* **Quyền riêng tư:** Chế độ hồ sơ công khai/riêng tư, quản lý danh sách chặn người dùng (Blocked List) trực quan.

### 5. Đa Ngôn Ngữ (Internationalization - i18n)
* Hỗ trợ đầy đủ **4 ngôn ngữ**: **Tiếng Việt (VI)**, **Tiếng Anh (EN)**, **Tiếng Hàn (KO)**, và **Tiếng Nhật (JA)**.

---

## 🛠️ Công Nghệ Sử Dụng

* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS, Vanilla CSS
* **Animations:** Framer Motion
* **State Management:** Zustand (quản lý trạng thái phát nhạc, cài đặt người dùng)
* **API Client:** Axios
* **Localization:** i18next
* **Charts:** Recharts (sử dụng trong trang quản trị/Admin Dashboard)

---

## 📁 Cấu Trúc Thư Mục Dự Án

```bash
src/
├── components/          # Các components giao diện chính của hệ thống
│   ├── Account/         # Quản lý tài khoản (Profile, Bảo mật, Gói dịch vụ)
│   ├── Admin/           # Dashboard quản trị dành cho Admin
│   ├── Artist/          # Trang nghệ sĩ và discography
│   ├── Auth/            # Đăng nhập, đăng ký, xác thực OTP, ReCAPTCHA
│   ├── HomePage/        # Trang chủ, danh mục xu hướng và Footer
│   ├── MusicPlayer/     # Trình phát nhạc (Mini, Fullscreen, Sidebar, Lyrics)
│   ├── Profile/         # Trang cá nhân của người dùng và các modal tương tác
│   ├── Search/          # Tính năng tìm kiếm thông minh và bộ lọc
│   ├── Settings/        # Trang cài đặt (Ngôn ngữ, Quyền riêng tư, Hiệu năng)
│   ├── Sidebar/         # Sidebar điều hướng và Thư viện nhạc (Library)
│   └── common/          # Các component dùng chung (Loader, BackButton, v.v.)
├── contexts/            # React Context (MusicContext quản lý luồng phát nhạc)
├── hooks/               # Các custom hooks toàn cục
├── locales/             # File bản dịch đa ngôn ngữ (vi, en, ko, ja)
├── services/            # Tích hợp API (likeApi, notificationService, v.v.)
├── utils/               # Các helper functions tiện ích
├── App.tsx              # Component cấu hình Router và Layout chính
├── main.tsx             # Điểm khởi chạy ứng dụng (Bootstrap)
└── index.css            # Stylesheet toàn cục, chứa design tokens và biến tối ưu hóa
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
* Cài đặt sẵn **Node.js** (Khuyến nghị phiên bản LTS v18 trở lên).
* Quản lý gói: **npm** hoặc **yarn**.

### Bước 1: Clone kho lưu trữ
```bash
git clone https://github.com/hdhoang03/spotify-clone-fe.git
cd spotify-clone-fe
```

### Bước 2: Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc của dự án (cùng cấp với `package.json`) và điền cấu hình API Backend của bạn:
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Bước 4: Khởi động dự án ở môi trường phát triển
```bash
npm run dev
```
*Ứng dụng sẽ chạy tại địa chỉ mặc định:* `http://localhost:5173`

### Bước 5: Build ứng dụng cho môi trường Production
```bash
npm run build
```
*Mã nguồn sau khi tối ưu hóa và nén sẽ nằm trong thư mục `/dist`.*

---

## 🤝 Hướng Dẫn Đóng Góp (Contribution)
1. Fork dự án.
2. Tạo nhánh tính năng mới (`git checkout -b feature/NewFeature`).
3. Commit thay đổi (`git commit -m 'Add new feature'`).
4. Push lên nhánh vừa tạo (`git push origin feature/NewFeature`).
5. Mở một Pull Request mới để được review và merge.
