const student = {
  id: 1001,
  fullName: "Nguyễn Văn Phu",
  scores: [8, 9, 7, 10],
  address: { city: "HCM", district: "Q1" }
};

const {fullName,id}=student
const {city} = student.address
const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
const graduated ={
    ...student,
    status: "grauated"
};

const employees = [
  { id: 1, name: "Phu", dept: "IT", salary: 20000000, active: true },
  { id: 2, name: "An", dept: "Marketing", salary: 15000000, active: true },
  { id: 3, name: "Bình", dept: "IT", salary: 25000000, active: false },
  { id: 4, name: "Châu", dept: "IT", salary: 18000000, active: true },
];
const available = employees.filter(emp=> emp.active)
const total = available.reduce((sum,emp)=> sum + emp.salary,0);
const sumTotal = employees
    .filter(emp=>emp.active)
    .reduce((sum, emp)=> sum+emp.salary,0);
const highSalaryNames = employees
  .filter(emp => emp.salary > 18000000)
  .map(emp => emp.name);
console.log(highSalaryNames); 
const idx = products.findIndex(emp => emp.id === 3);