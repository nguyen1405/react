const student = {
  id: 1001,
  fullName: "Nguyễn Văn Phu",
  scores: [8, 9, 7, 10],
  address: { city: "HCM", district: "Q1" }
};

const {fullName} = student
const {city} = student.address
const avg = student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length;
const graduated ={
    ...student,
    status: "graduated"
};

const employees = [
  { id: 1, name: "Phu", dept: "IT", salary: 20000000, active: true },
  { id: 2, name: "An", dept: "Marketing", salary: 15000000, active: true },
  { id: 3, name: "Bình", dept: "IT", salary: 25000000, active: false },
  { id: 4, name: "Châu", dept: "IT", salary: 18000000, active: true },
];
const available = employees.filter(emp=> emp.active)
const total = available.reduce((sum,emp)=> sum + emp.salary,0);
const name = employees.find(emp=>emp.name === 'Bình')
employees
    .filter(emp=>emp.active)
    .reduce((sum, emp)=> sum+emp.salary,0);
const highSalaryNames = employees
  .filter(emp => emp.salary > 18000000)
  .map(emp => emp.name);
const idx = employees.findIndex(emp => emp.id === 3);
const empById = employees.find(emp => emp.id === 3);
console.log("Nhân viên lương cao:", highSalaryNames);
console.log("Trung bình điểm:", avg);
console.log("Tổng lương NV hoạt động:", total);
console.log("Index của NV id=3:", idx);
console.log("Nhân viên có id=3:", empById);
console.log("Sinh viên:", fullName, "- Thành phố:", city);
console.log("Trạng thái tốt nghiệp:", graduated.status);
console.log(name);
