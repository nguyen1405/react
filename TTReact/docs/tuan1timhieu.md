# JavaScript Array Methods - Tuần 1

## Các phương thức mảng trong JavaScript

---

### 1. `toString()`
Chuyển đổi mảng thành chuỗi các phần tử, ngăn cách bằng dấu phẩy.

```javascript
const fruits = ["Banana", "Orange", "Apple"];
console.log(fruits.toString()); // "Banana,Orange,Apple"
```

---

### 2. `join()`
Giống toString() nhưng có thể tùy chỉnh dấu phân cách.

```javascript
const fruits = ["Banana", "Orange", "Apple"];
console.log(fruits.join(" - ")); // "Banana - Orange - Apple"
```

---

### 3. `pop()`
Xóa phần tử cuối cùng của mảng và trả về phần tử đó.

```javascript
const fruits = ["Banana", "Orange", "Apple"];
fruits.pop();
console.log(fruits); // ["Banana", "Orange"]
```

---

### 4. `push()`
Thêm phần tử mới vào cuối mảng và trả về độ dài mới của mảng.

```javascript
const fruits = ["Banana", "Orange"];
fruits.push("Mango");
console.log(fruits); // ["Banana", "Orange", "Mango"]
```

---

### 5. `shift()`
Xóa phần tử đầu tiên của mảng và trả về phần tử đó.

```javascript
const fruits = ["Banana", "Orange", "Apple"];
fruits.shift();
console.log(fruits); // ["Orange", "Apple"]
```

---

### 6. `unshift()`
Thêm phần tử mới vào đầu mảng và trả về độ dài mới.

```javascript
const fruits = ["Orange", "Apple"];
fruits.unshift("Banana");
console.log(fruits); // ["Banana", "Orange", "Apple"]
```

---

### 7. `concat()`
Nối hai hoặc nhiều mảng với nhau, trả về mảng mới.

```javascript
const arr1 = ["A", "B"];
const arr2 = ["C", "D"];
const merged = arr1.concat(arr2);
console.log(merged); // ["A", "B", "C", "D"]
```

---

### 8. `splice()`
Thêm hoặc xóa phần tử khỏi mảng. Cú pháp: `splice(vị trí, số_lượng_xóa, phần_tử_mới...)`

```javascript
const fruits = ["Banana", "Orange", "Apple", "Mango"];
// Xóa 1 phần tử tại vị trí 2, thêm "Kiwi"
fruits.splice(2, 1, "Kiwi");
console.log(fruits); // ["Banana", "Orange", "Kiwi", "Mango"]
```

---

### 9. `slice()`
Trả về một phần của mảng (mảng mới), không thay đổi mảng gốc.

```javascript
const fruits = ["Banana", "Orange", "Apple", "Mango"];
const citrus = fruits.slice(1, 3);
console.log(citrus); // ["Orange", "Apple"]
```

---

### 10. `sort()`
Sắp xếp các phần tử mảng theo thứ tự tăng dần (theo alphabet).

```javascript
const fruits = ["Banana", "Apple", "Orange"];
fruits.sort();
console.log(fruits); // ["Apple", "Banana", "Orange"]
```

---

### 11. `reverse()`
Đảo ngược thứ tự các phần tử trong mảng.

```javascript
const fruits = ["Banana", "Orange", "Apple"];
fruits.reverse();
console.log(fruits); // ["Apple", "Orange", "Banana"]
```

---

### 12. `find()`
Trả về giá trị phần tử đầu tiên thỏa mãn điều kiện.

```javascript
const numbers = [4, 9, 16, 25, 36];
const result = numbers.find(n => n > 10);
console.log(result); // 16
```

---

### 13. `filter()`
Trả về mảng mới chứa các phần tử thỏa mãn điều kiện.

```javascript
const numbers = [4, 9, 16, 25, 36];
const result = numbers.filter(n => n > 10);
console.log(result); // [16, 25, 36]
```

---

### 14. `map()`
Tạo mảng mới bằng cách thực hiện hàm trên mỗi phần tử.

```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]
```

---

### 15. `forEach()`
Gọi hàm cho mỗi phần tử trong mảng (không trả về giá trị).

```javascript
const fruits = ["Apple", "Banana", "Orange"];
fruits.forEach((item, index) => {
  console.log(index + ": " + item);
});
```

---

### 16. `reduce()`
Thu gọn mảng thành một giá trị duy nhất (từ trái sang phải).

```javascript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((total, n) => total + n, 0);
console.log(sum); // 10
```

---

### 17. `indexOf()`
Tìm kiếm phần tử trong mảng và trả về vị trí đầu tiên (-1 nếu không tìm thấy).

```javascript
const fruits = ["Apple", "Banana", "Orange"];
console.log(fruits.indexOf("Banana")); // 1
```

---

### 18. `includes()`
Kiểm tra mảng có chứa phần tử hay không (trả về true/false).

```javascript
const fruits = ["Apple", "Banana", "Orange"];
console.log(fruits.includes("Banana")); // true
```

---

### 19. `length`
Thuộc tính trả về số lượng phần tử trong mảng.

```javascript
const fruits = ["Apple", "Banana", "Orange"];
console.log(fruits.length); // 3
```

---

### 20. `at()`
Trả về phần tử tại vị trí chỉ định (hỗ trợ chỉ số âm).

```javascript
const fruits = ["Apple", "Banana", "Orange"];
console.log(fruits.at(1));    // "Banana"
console.log(fruits.at(-1));   // "Orange" (phần tử cuối)
```

---

### 21. `every()`
Kiểm tra TẤT CẢ phần tử có thỏa mãn điều kiện không.

```javascript
const numbers = [10, 20, 30];
const result = numbers.every(n => n > 5);
console.log(result); // true
```

---

### 22. `some()`
Kiểm tra có ÍT NHẤT một phần tử thỏa mãn điều kiện không.

```javascript
const numbers = [2, 5, 8];
const result = numbers.some(n => n > 6);
console.log(result); // true
```

---

### 23. `flat()`
Làm phẳng mảng (mảng lồng nhau).

```javascript
const arr = [1, 2, [3, 4]];
console.log(arr.flat()); // [1, 2, 3, 4]
```

---

### 24. `flatMap()`
Kết hợp map() và flat().

```javascript
const arr = [1, 2, 3];
console.log(arr.flatMap(x => [x, x * 2])); // [1, 2, 2, 4, 3, 6]
```

---

### 25. `fill()`
Thay đổi giá trị các phần tử trong mảng.

```javascript
const arr = [1, 2, 3, 4];
arr.fill(0, 1, 3);
console.log(arr); // [1, 0, 0, 4]
```

---

### 26. `copyWithin()`
Sao chép phần tử trong mảng.

```javascript
const arr = ["a", "b", "c", "d"];
arr.copyWithin(1, 2);
console.log(arr); // ["a", "c", "d", "d"]
```