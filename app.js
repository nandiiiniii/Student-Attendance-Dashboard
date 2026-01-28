let overviewChartObj = null;

const students = [
  { name: "Amit Kumar", branch: "CSE", sem: 5, attendance: 82 },
  { name: "Priya Singh", branch: "CSE", sem: 5, attendance: 68 },
  { name: "Rahul Das", branch: "ECE", sem: 5, attendance: 75 },
  { name: "Sneha Patra", branch: "ME", sem: 5, attendance: 88 },
  { name: "Rohit Sharma", branch: "ECE", sem: 5, attendance: 70 },

  { name: "Ananya Mishra", branch: "CSE", sem: 5, attendance: 91 },
  { name: "Sourav Behera", branch: "ME", sem: 5, attendance: 64 },
  { name: "Pooja Verma", branch: "ECE", sem: 5, attendance: 79 },
  { name: "Kunal Gupta", branch: "CSE", sem: 5, attendance: 85 },
  { name: "Neha Rani", branch: "ME", sem: 5, attendance: 73 },

  { name: "Abhishek Nayak", branch: "ECE", sem: 5, attendance: 88 },
  { name: "Ritika Panda", branch: "CSE", sem: 5, attendance: 92 },
  { name: "Manish Sahoo", branch: "ME", sem: 5, attendance: 69 },
  { name: "Swati Patil", branch: "ECE", sem: 5, attendance: 81 },
  { name: "Arjun Mehta", branch: "CSE", sem: 5, attendance: 76 },

  { name: "Deepak Yadav", branch: "ME", sem: 5, attendance: 67 },
  { name: "Isha Kulkarni", branch: "CSE", sem: 5, attendance: 89 },
  { name: "Vikas Singh", branch: "ECE", sem: 5, attendance: 72 },
  { name: "Nikita Joshi", branch: "ME", sem: 5, attendance: 94 },
  { name: "Harsh Agarwal", branch: "CSE", sem: 5, attendance: 78 }
];

/* ===============================
   SECTION REFERENCES
================================ */
const sections = {
  dashboard: document.getElementById("dashboardSection"),
  students: document.getElementById("studentsSection"),
  attendance: document.getElementById("attendanceSection"),
  reports: document.getElementById("reportsSection")
};

/* ===============================
   SIDEBAR NAVIGATION
================================ */
document.querySelectorAll(".list-group-item").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".list-group-item")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    Object.values(sections)
      .forEach(sec => sec.classList.add("d-none"));

    sections[btn.dataset.section].classList.remove("d-none");

    if (btn.dataset.section === "dashboard") loadDashboard();
    if (btn.dataset.section === "students") renderStudents();
    if (btn.dataset.section === "attendance") loadAttendance();
    if (btn.dataset.section === "reports") loadReports();
  });
});

/* ===============================
   MOBILE MENU
================================ */
menuToggle.onclick = () => sidebar.classList.toggle("show");

/* ===============================
   STUDENTS TABLE
================================ */
function renderStudents() {
  studentTable.innerHTML = "";
  students.forEach(s => {
    studentTable.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.branch}</td>
        <td>${s.sem}</td>
        <td>${s.attendance}%</td>
        <td>
          <span class="badge ${s.attendance < 75 ? "bg-danger" : "bg-success"}">
            ${s.attendance < 75 ? "Low" : "Good"}
          </span>
        </td>
      </tr>
    `;
  });
}

/* ===============================
   DASHBOARD (MAIN FIX)
================================ */
let branchChartObj = null;
let semChartObj = null;

function loadDashboard() {

  const total = students.length;
  const avg = Math.round(
    students.reduce((a, b) => a + b.attendance, 0) / total
  );
  const low = students.filter(s => s.attendance < 75).length;

  totalStudents.innerText = total;
  avgAttendance.innerText = avg + "%";
  lowAttendance.innerText = low;
  alertCount.innerText = low;

  /* Branch-wise */
  const branchMap = {};
  students.forEach(s => {
    if (!branchMap[s.branch]) branchMap[s.branch] = [];
    branchMap[s.branch].push(s.attendance);
  });

  const labels = Object.keys(branchMap);
  const data = labels.map(b =>
    Math.round(branchMap[b].reduce((a, v) => a + v, 0) / branchMap[b].length)
  );

  if (branchChartObj) branchChartObj.destroy();
  branchChartObj = new Chart(branchChart, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#0d6efd", "#198754", "#fd7e14"]
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  /* Semester trend */
  if (semChartObj) semChartObj.destroy();
  semChartObj = new Chart(semesterChart, {
    type: "line",
    data: {
      labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"],
      datasets: [{
        data: [65, 70, 74, 78, avg],
        tension: 0.4,
        borderWidth: 3
      }]
    }
  });
}

/* ===============================
   ATTENDANCE SECTION
================================ */
let attendanceChartInstance = null;

function loadAttendance() {
  const good = students.filter(s => s.attendance >= 75).length;
  const low = students.filter(s => s.attendance < 75).length;

  if (attendanceChartInstance) attendanceChartInstance.destroy();

  attendanceChartInstance = new Chart(attendanceChart, {
    type: "doughnut",
    data: {
      labels: ["Good (≥75%)", "Low (<75%)"],
      datasets: [{ data: [good, low] }]
    }
  });

  lowList.innerHTML = "";
  students.filter(s => s.attendance < 75).forEach(s => {
    lowList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        ${s.name}
        <span class="badge bg-danger">${s.attendance}%</span>
      </li>
    `;
  });
}

/* ===============================
   REPORTS SECTION
================================ */
function loadReports() {
  reportTable.innerHTML = "";
  students.forEach(s => {
    reportTable.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.branch}</td>
        <td>${s.attendance}%</td>
        <td>
          <span class="badge ${s.attendance < 75 ? "bg-danger" : "bg-success"}">
            ${s.attendance < 75 ? "Low" : "Good"}
          </span>
        </td>
      </tr>
    `;
  });
}

/* ===============================
   THEME + DARK MODE
================================ */
themeColor.onchange = e =>
  document.documentElement.style.setProperty("--primary", e.target.value);

themeToggle.onclick = () =>
  document.body.classList.toggle("dark");

/* ===== Attendance Overview ===== */
loadDashboard()
function animateValue(el, start, end, duration) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

animateValue(totalStudents, 0, total, 800);
animateValue(lowAttendance, 0, low, 800);
animateValue(alertCount, 0, low, 800);
avgAttendance.innerText = avg + "%";

const goodCount = students.filter(s => s.attendance >= 75).length;
const lowCount = students.filter(s => s.attendance < 75).length;

const overviewCanvas = document.getElementById("overviewChart");
if (!overviewCanvas) return;

if (overviewChartObj) overviewChartObj.destroy();

overviewChartObj = new Chart(overviewCanvas, {
  type: "bar",
  data: {
    labels: ["Good Attendance", "Low Attendance"],
    datasets: [{
      data: [goodCount, lowCount],
      backgroundColor: ["#198754", "#dc3545"],
      borderRadius: 10
    }]
  },
  options: {
    animation: {
      duration: 1200,
      easing: "easeOutBounce"
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 }
      }
    }
  }
});

