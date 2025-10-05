# API Tạo Đơn Hàng - Documentation

## Endpoint
```
POST /api/orders
```

## Mô tả
API này cho phép tạo đơn hàng mới với đầy đủ thông tin theo yêu cầu. API sử dụng thông tin khách hàng và địa chỉ có sẵn (đã được tạo trước đó).

## Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Request Body

### Cấu trúc dữ liệu chính
```json
{
  "customerId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "deliveryAddressId": "64f1a2b3c4d5e6f7g8h9i0j2",
  "products": [
    {
      "productId": "64f1a2b3c4d5e6f7g8h9i0j3",
      "productName": "Sản phẩm A",
      "price": 100000,
      "quantity": 2,
      "note": "Ghi chú sản phẩm"
    }
  ],
  "deliveryDate": "2024-01-15T10:00:00.000Z",
  "shippingUnit": "64f1a2b3c4d5e6f7g8h9i0j4",
  "paymentMethod": "BANK_TRANSFER",
  "prepaidAmount": 50000,
  "shippingFee": 30000,
  "hasVATInvoice": true,
  "notes": "Ghi chú đơn hàng"
}
```

### Chi tiết các trường

#### 1. customerId (string, required)
ID của khách hàng (đã được tạo trước đó)

#### 2. deliveryAddressId (string, required)
ID của địa chỉ giao hàng (đã được tạo trước đó)

#### 3. products (array, required)
- **productId** (string, required): ID sản phẩm
- **productName** (string, required): Tên sản phẩm
- **price** (number, required): Giá bán
- **quantity** (number, required): Số lượng
- **note** (string, optional): Ghi chú sản phẩm

#### 4. deliveryDate (string, optional)
Ngày giao hàng dự kiến (ISO 8601 format)

#### 5. shippingUnit (string, optional)
ID đơn vị vận chuyển

#### 6. paymentMethod (string, required)
Hình thức thanh toán:
- `COD`: Thanh toán khi nhận hàng
- `CASH`: Tiền mặt
- `BANK_TRANSFER`: Chuyển khoản
- `CREDIT`: Công nợ

#### 7. creditDays (number, required khi paymentMethod = 'CREDIT')
Số ngày trả cho công nợ

#### 8. bankInfo (object, required khi paymentMethod = 'BANK_TRANSFER')
Thông tin ngân hàng nhận tiền:
- **bankName** (string): Tên ngân hàng
- **accountNumber** (string): Số tài khoản
- **accountHolder** (string): Tên chủ tài khoản
- **branch** (string, optional): Chi nhánh

#### 9. prepaidAmount (number, optional)
Số tiền trả trước (mặc định: 0)

#### 10. shippingFee (number, optional)
Phí giao hàng (mặc định: 0)

#### 11. hasVATInvoice (boolean, optional)
Có xuất hóa đơn VAT hay không (mặc định: false)

#### 12. notes (string, optional)
Ghi chú đơn hàng

## Response

### Success (201)
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "user": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "fullName": "Nguyễn Văn A",
        "email": "nguyenvana@email.com",
        "phone": "0123456789"
      },
      "deliveryAddress": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "receiverName": "Nguyễn Văn A",
        "receiverPhone": "0123456789",
        "fullAddress": "123 Đường ABC, Dịch Vọng, Cầu Giấy, Hà Nội"
      },
      "paymentMethod": "BANK_TRANSFER",
      "subtotal": 200000,
      "shippingFee": 30000,
      "total": 230000,
      "prepaidAmount": 50000,
      "remainingAmount": 180000,
      "status": "PENDING",
      "hasVATInvoice": true,
      "notes": "Ghi chú đơn hàng",
      "deliveryDate": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    },
    "orderItems": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
        "product": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "productName": "Sản phẩm A",
          "images": ["image1.jpg", "image2.jpg"]
        },
        "productName": "Sản phẩm A",
        "price": 100000,
        "quantity": 2,
        "total": 200000,
        "note": "Ghi chú sản phẩm"
      }
    ],
    "message": "Tạo đơn hàng thành công"
  }
}
```

### Error (400)
```json
{
  "status": "fail",
  "data": {
    "message": "Thiếu thông tin khách hàng, địa chỉ giao hàng hoặc danh sách sản phẩm"
  }
}
```

### Error (500)
```json
{
  "status": "error",
  "data": {
    "message": "Lỗi server khi tạo đơn hàng"
  }
}
```

## Các trường hợp đặc biệt

### 1. Hình thức thanh toán
- **COD/CASH**: Không cần thông tin bổ sung
- **BANK_TRANSFER**: Bắt buộc cung cấp thông tin ngân hàng
- **CREDIT**: Bắt buộc nhập số ngày trả

### 2. Kiểm tra tồn kho
- Tự động kiểm tra số lượng tồn kho
- Cập nhật số lượng tồn kho sau khi tạo đơn hàng

### 3. Tính toán tự động
- Tổng tiền sản phẩm (subtotal)
- Tổng tiền cuối cùng (total = subtotal + shippingFee)
- Số tiền còn nợ (remainingAmount = total - prepaidAmount)

## Lưu ý quan trọng

### Trước khi gọi API này, bạn cần:
1. **Tạo khách hàng** bằng API quản lý khách hàng
2. **Tạo địa chỉ giao hàng** bằng API quản lý địa chỉ
3. **Có sẵn danh sách sản phẩm** trong hệ thống

### API này chỉ xử lý:
- Tạo đơn hàng mới
- Tạo order items
- Cập nhật tồn kho
- Xử lý thông tin thanh toán
- Tính toán tổng tiền

## Workflow sử dụng

1. **Bước 1**: Tạo khách hàng (nếu chưa có)
2. **Bước 2**: Tạo địa chỉ giao hàng cho khách hàng
3. **Bước 3**: Gọi API này để tạo đơn hàng với `customerId` và `deliveryAddressId` đã có

## Lưu ý
- API tự động tạo mã đơn hàng (sử dụng _id của MongoDB)
- Trạng thái đơn hàng mặc định là "PENDING"
- Timestamps được tự động tạo (createdAt, updatedAt)
- Tất cả validation được thực hiện trước khi lưu vào database
- Không tự động tạo khách hàng mới hoặc địa chỉ mới 