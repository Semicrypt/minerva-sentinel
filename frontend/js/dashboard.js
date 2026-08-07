const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const socket = io("http://localhost:5000");

socket.on("connect", () => {

    console.log("🟢 Connected to live server");

});

socket.on("monitor:update", () => {

    console.log("📡 Live update received");

    loadDashboard();

});

const modal = document.getElementById("serviceModal");
const serviceList = document.getElementById("serviceList");

const totalServices = document.getElementById("totalServices");
const onlineServices = document.getElementById("onlineServices");
const offlineServices = document.getElementById("offlineServices");
const avgResponse = document.getElementById("avgResponse");

document.getElementById("logoutBtn").onclick = logout;

document.getElementById("addServiceBtn").onclick = () => {
    modal.classList.remove("hidden");
};

document.getElementById("cancelBtn").onclick = () => {
    modal.classList.add("hidden");
};

document.getElementById("saveBtn").onclick = addService;

loadDashboard();

function logout() {

    localStorage.removeItem("token");

    socket.disconnect();

    window.location.href = "login.html";

}

async function loadDashboard() {

    await loadSummary();

    await loadServices();

}

async function loadSummary() {

    const response = await fetch(
        API_BASE_URL + "/dashboard/summary",
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    );

    const result = await response.json();

    if (!result.success) {
        return;
    }

    totalServices.textContent = result.data.totalServices;
    onlineServices.textContent = result.data.onlineServices;
    offlineServices.textContent = result.data.offlineServices;
    avgResponse.textContent = result.data.averageResponse + " ms";

}

async function loadServices() {

    const response = await fetch(
        API_BASE_URL + "/services",
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    );

    const result = await response.json();

    if (!result.success) {
        return;
    }

    serviceList.innerHTML = "";

    result.data.forEach(service => {

        serviceList.innerHTML += `

<div class="service"
onclick="openService(${service.id})"
style="cursor:pointer;">

<div class="service-info">

<h3>${service.name}</h3>

<p>${service.url}</p>

</div>

<div>

<strong>${service.service_type}</strong>

</div>

<div>

${service.check_interval}s

</div>

<div>

<span class="${
service.status === "UP"
? "status-up"
: "status-down"
}">

${service.status}

</span>

</div>

</div>

`;

    });

}

async function addService() {

    const response = await fetch(
        API_BASE_URL + "/services",
        {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById("serviceName").value,
                url: document.getElementById("serviceUrl").value,
                serviceType: document.getElementById("serviceType").value,
                checkInterval: Number(document.getElementById("checkInterval").value)
            })
        }
    );

    const result = await response.json();

    if (result.success) {

        modal.classList.add("hidden");

        document.getElementById("serviceName").value = "";
        document.getElementById("serviceUrl").value = "";
        document.getElementById("checkInterval").value = 60;

        loadDashboard();

    } else {

        alert(result.message);

    }

}

function openService(id) {

    window.location.href =
        `service-details.html?id=${id}`;

}