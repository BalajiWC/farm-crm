// ---------------- LOGIN ----------------
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("app").classList.add("active");

    setTimeout(() => loadCharts(0), 100); // load default charts
  } else {
    alert("Invalid login");
  }
}

// ---------------- SIDEBAR NAV ----------------
function openTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".menu").forEach(m => m.classList.remove("active"));
  event.target.classList.add("active");
}

// ---------------- DATA ----------------
const zones = [
  {
    name: "Zone 1",
    crops: ["Carrot", "Beans"],
    work: [8, 6, 7],
    attendance: [3, 1],
    growth: [20, 40, 60, 80]
  },
  {
    name: "Zone 2",
    crops: ["Tomato", "Onion"],
    work: [5, 4, 6],
    attendance: [4, 0],
    growth: [30, 50, 70, 90]
  },
  {
    name: "Zone 3",
    crops: ["Potato"],
    work: [6, 5, 4],
    attendance: [2, 2],
    growth: [10, 30, 50, 70]
  },
  {
    name: "Zone 4",
    crops: ["Corn"],
    work: [4, 3, 5],
    attendance: [3, 1],
    growth: [25, 45, 65, 85]
  },
  {
    name: "Zone 5",
    crops: ["Wheat"],
    work: [7, 6, 5],
    attendance: [4, 0],
    growth: [15, 35, 55, 75]
  }
];

const employees = ["Ravi", "Kumar", "Sita", "Anu"];
const fields = ["Field A", "Field B", "Field C"];

// ---------------- CHART VARIABLES ----------------
let workChart, attendanceChart, growthChart;

// ---------------- LOAD CHARTS ----------------
function loadCharts(zoneIndex = 0) {
  const z = zones[zoneIndex];

  // destroy old charts
  if (workChart) workChart.destroy();
  if (attendanceChart) attendanceChart.destroy();
  if (growthChart) growthChart.destroy();

  // WORK CHART
  workChart = new Chart(document.getElementById("workChart"), {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed"],
      datasets: [{
        label: "Tasks Done",
        data: z.work
      }]
    }
  });

  // ATTENDANCE CHART
  attendanceChart = new Chart(document.getElementById("attendanceChart"), {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent"],
      datasets: [{
        data: z.attendance
      }]
    }
  });

  // GROWTH CHART
  growthChart = new Chart(document.getElementById("growthChart"), {
    type: "line",
    data: {
      labels: ["W1", "W2", "W3", "W4"],
      datasets: [{
        label: "Growth %",
        data: z.growth,
        fill: false
      }]
    }
  });
}

// ---------------- ZONE UI INIT ----------------
const zoneTabs = document.getElementById("zoneTabs");

if (zoneTabs) {
  zones.forEach((z, i) => {
    const span = document.createElement("span");
    span.innerText = z.name;

    span.onclick = () => selectZone(i);

    zoneTabs.appendChild(span);
  });
}

// ---------------- SELECT ZONE ----------------
function selectZone(index) {
  // highlight active zone
  document.querySelectorAll(".zones span")
    .forEach(s => s.classList.remove("active"));

  document.querySelectorAll(".zones span")[index]
    .classList.add("active");

  const zone = zones[index];

  // update UI
  document.getElementById("zoneTitle").innerText = zone.name;
  document.getElementById("zoneCrops").innerText =
    "Crops: " + zone.crops.join(", ");

  fillSelect("fieldSelect", fields);
  fillSelect("employeeSelect", employees);

  // 🔥 update charts based on zone
  loadCharts(index);
}

// ---------------- FILL DROPDOWNS ----------------
function fillSelect(id, list) {
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML = "";

  list.forEach(item => {
    const opt = document.createElement("option");
    opt.text = item;
    select.add(opt);
  });
}

// ---------------- INITIAL LOAD ----------------
window.onload = () => {
  if (zoneTabs) {
    selectZone(0); // default zone
  }
};
// ---------------- TASK STORAGE ----------------
let tasks = [];

// ---------------- ASSIGN TASK ----------------
function assignTask() {
  const employee = document.getElementById("employeeSelect").value;
  const field = document.getElementById("fieldSelect").value;
  const remarks = document.getElementById("remarksInput").value;

  if (!employee || !field) {
    alert("Please select employee and field");
    return;
  }

  const time = new Date().toLocaleTimeString();

  const task = {
    employee,
    field,
    remarks,
    time,
    status: "Pending"
  };

  tasks.push(task);

  document.getElementById("remarksInput").value = "";

  renderTasks();
}

// ---------------- RENDER TASKS ----------------
function renderTasks() {
  const container = document.getElementById("taskList");
  container.innerHTML = "";

  tasks.forEach((t, index) => {
    const div = document.createElement("div");
    div.className = "task-card";

    div.innerHTML = `
      <p><b>Employee:</b> ${t.employee}</p>
      <p><b>Field:</b> ${t.field}</p>
      <p><b>Remarks:</b> ${t.remarks || "-"}</p>
      <p><b>Time:</b> ${t.time}</p>
      <p><b>Status:</b> ${t.status}</p>

      <button onclick="updateStatus(${index}, 'Completed')">✅ Completed</button>
      <button onclick="updateStatus(${index}, 'Pending')">⏳ Pending</button>
    `;

    container.appendChild(div);
  });
}

// ---------------- UPDATE STATUS ----------------
function updateStatus(index, status) {
  tasks[index].status = status;
  renderTasks();
}