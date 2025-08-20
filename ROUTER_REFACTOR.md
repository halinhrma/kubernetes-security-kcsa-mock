# React Router Refactoring

## Tổng quan

Ứng dụng đã được refactor từ việc sử dụng if-else statements để quản lý các trang sang sử dụng React Router DOM để quản lý routing một cách chuyên nghiệp.

## Thay đổi chính

### 1. **Cài đặt React Router DOM**

```bash
npm install react-router-dom
```

### 2. **Router Type: HashRouter vs BrowserRouter**

Ứng dụng sử dụng **HashRouter** thay vì BrowserRouter vì:

- ✅ **Tương thích với static hosting** (GitHub Pages, Netlify, Vercel)
- ✅ **Không cần server configuration** cho client-side routing
- ✅ **Tránh 404 errors** khi refresh trang
- ❌ **URL có dấu #** (ví dụ: `/#/exam` thay vì `/exam`)
- ❌ **SEO ít tốt hơn** so với clean URLs

**HashRouter:** `https://example.com/#/exam`
**BrowserRouter:** `https://example.com/exam`

### 3. **Cấu trúc Routing mới**

#### **App.js - Router Configuration**

```jsx
<Router>
  <Routes>
    {/* Home page */}
    <Route path="/" element={<KCSAMockExamPro />} />

    {/* Exam page */}
    <Route path="/exam" element={<Exam />} />

    {/* Review flagged questions page */}
    <Route path="/review" element={<ReviewFlagged />} />

    {/* Results page */}
    <Route path="/results" element={<Results />} />

    {/* Catch all route */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</Router>
```

### 4. **Navigation Flow**

```
Home (/#/) → Start Exam → Exam (/#/exam) → Finish Exam → Review (/#/review) → Finish Review → Results (/#/results) → Restart → Home (/#/)
```

### 5. **State Management với React Router**

#### **Trước (if-else):**

```jsx
{
  examStarted && !reviewingFlagged && <Exam />;
}
{
  reviewingFlagged && <ReviewFlagged />;
}
{
  examFinished && <Results />;
}
```

#### **Sau (React Router):**

```jsx
<Route path="/exam" element={<Exam />} />
<Route path="/review" element={<ReviewFlagged />} />
<Route path="/results" element={<Results />} />
```

### 6. **Component Updates**

#### **Exam Component**

- Sử dụng `useNavigate()` hook
- Tự động navigate đến `/review` khi finish exam
- Cập nhật localStorage state

#### **ReviewFlagged Component**

- Sử dụng `useNavigate()` hook
- Tự động navigate đến `/results` khi finish review
- Cập nhật localStorage state

#### **Results Component**

- Sử dụng `useNavigate()` hook
- Tự động navigate về `/` khi restart
- Xóa tất cả exam state

#### **KCSAMockExamPro Component**

- Sử dụng `useNavigate()` hook
- Tự động navigate đến `/exam` khi start exam
- Cập nhật localStorage state

### 7. **Lợi ích của React Router**

#### **Trước:**

- ❌ Khó quản lý state
- ❌ Không có URL routing
- ❌ Không thể bookmark các trang
- ❌ Không có browser history
- ❌ Khó debug và maintain

#### **Sau:**

- ✅ Clean URL routing
- ✅ Có thể bookmark các trang
- ✅ Browser back/forward buttons hoạt động
- ✅ Dễ debug và maintain
- ✅ Code structure rõ ràng hơn
- ✅ Tách biệt logic routing và component logic

### 8. **URL Structure**

- **Home:** `/#/`
- **Exam:** `/#/exam`
- **Review Flagged:** `/#/review`
- **Results:** `/#/results`

**Lưu ý:** Sử dụng HashRouter thay vì BrowserRouter để tương thích với static hosting và tránh vấn đề với server-side routing.

### 9. **State Persistence**

- Sử dụng `useLocalStorage` hook để persist state
- State được sync giữa localStorage và React state
- Khi refresh trang, state được restore từ localStorage

### 10. **Navigation Guards**

- Sử dụng `<Navigate>` component để redirect
- Kiểm tra state trước khi render component
- Redirect về home nếu không có quyền truy cập

### 11. **Cách sử dụng**

1. **Start Exam:** Click "Start Exam" → navigate to `/#/exam`
2. **Finish Exam:** Click "Finish Exam" → navigate to `/#/review`
3. **Finish Review:** Click "Finish Review" → navigate to `/#/results`
4. **Restart:** Click "Restart Exam" → navigate to `/#/`

## Kết luận

Việc refactor sang React Router đã cải thiện đáng kể:

- **Code quality:** Cleaner, more maintainable
- **User experience:** Better navigation, bookmarkable URLs
- **Developer experience:** Easier to debug, better structure
- **Scalability:** Dễ dàng thêm routes mới trong tương lai
