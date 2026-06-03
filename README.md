# 💌 Lời xin lỗi gửi em yêu

Một website nhỏ siêu cute để gửi lời xin lỗi tới bạn gái, gồm 4 cảnh:

1. **Lời xin lỗi** – "Em ơi, em à... Anh xin lỗi vì đã làm em giận!"
2. **Bản kiểm điểm** – bản kiểm điểm decor dễ thương, bấm nút để xem.
3. **Lời nhắn** – "Anh bít lỗi gòi, em đừng giận anh nữa nha."
4. **Vũ trụ** – trái đất màu hồng, xung quanh là ảnh của em xoay quanh ✨

## 🖼️ Thêm ảnh & nhạc (tùy chọn)

Ảnh trong cảnh vũ trụ đang được lấy từ thư mục `images/`.
Muốn thêm/bớt ảnh, sửa mảng `PHOTO_SOURCES` trong `script.js`.

Muốn có nhạc nền: thêm file `assets/song.mp3`.

> Không có ảnh/nhạc web vẫn chạy bình thường (ảnh trống sẽ thay bằng 💗).

## ▶️ Chạy thử trên máy

Không mở trực tiếp file `index.html` bằng `file://`, vì Chrome sẽ chặn ảnh local khi đưa vào WebGL/Three.js và ảnh sẽ bị thay bằng trái tim.

Chạy bằng local server:

```bash
python3 -m http.server 8765
```

Sau đó mở:
`http://127.0.0.1:8765/index.html`

## 🚀 Deploy lên GitHub Pages

1. Tạo một repository mới trên GitHub (ví dụ: `loi-xin-loi`).
2. Đẩy code lên repo:

   ```bash
   git init
   git add .
   git commit -m "Website xin loi cute"
   git branch -M main
   git remote add origin https://github.com/<TÊN-GITHUB>/<TÊN-REPO>.git
   git push -u origin main
   ```

3. Vào repo trên GitHub → **Settings** → **Pages**.
4. Mục **Source** chọn **Deploy from a branch**.
5. Chọn branch `main`, thư mục `/ (root)` → bấm **Save**.
6. Đợi khoảng 1 phút, web sẽ chạy tại:
   `https://<TÊN-GITHUB>.github.io/<TÊN-REPO>/`

Gửi link đó cho em là xong 💕
