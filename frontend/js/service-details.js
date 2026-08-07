const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const serviceId = params.get("id");

if (!serviceId) {
    window.location.href = "dashboard.html";
}

document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("token");

    window.location.href = "login.html";

};

loadPage();

async function loadPage() {

    await loadService();

    await loadHistory();

}

async function loadService() {

    const response = await fetch(

        API_BASE_URL + "/services/" + serviceId,

        {

            headers: {

                Authorization: "Bearer " + token

            }

        }

    );

    const result = await response.json();

    if (!result.success) {

        alert(result.message);

        return;

    }

    const service = result.data;

    document.getElementById("serviceTitle").textContent =
        service.name;

    document.getElementById("statusCard").textContent =
        service.status;

    document.getElementById("typeCard").textContent =
        service.service_type;

    document.getElementById("intervalCard").textContent =
        service.check_interval + " sec";

    document.getElementById("urlCard").textContent =
        service.url;

}

async function loadHistory() {

    const response = await fetch(

        API_BASE_URL +
        "/checks/" +
        serviceId +
        "/history",

        {

            headers: {

                Authorization:
                "Bearer " + token

            }

        }

    );

    const result = await response.json();

    if (!result.success) {

        return;

    }

    const history = result.data;

    drawChart(history);

    loadTable(history);

    calculateStats(history);

}

function calculateStats(history){

    const valid =
        history.filter(
            h=>h.response_time_ms>0
        );

    if(valid.length===0){

        return;

    }

    const values =
        valid.map(
            h=>h.response_time_ms
        );

    const average =
        Math.round(
            values.reduce(
                (a,b)=>a+b,0
            )/values.length
        );

    const fastest =
        Math.min(...values);

    const slowest =
        Math.max(...values);

    document.getElementById("statusCard").innerHTML +=

        `<br><small>Avg ${average} ms</small>`;

    document.getElementById("typeCard").innerHTML +=

        `<br><small>Fastest ${fastest} ms</small>`;

    document.getElementById("intervalCard").innerHTML +=

        `<br><small>Slowest ${slowest} ms</small>`;

}

function drawChart(history){

    const labels =
        history.map(h=>
            new Date(
                h.checked_at
            ).toLocaleTimeString()
        );

    const values =
        history.map(h=>
            h.response_time_ms
        );

    new Chart(

        document.getElementById("responseChart"),

        {

            type:"line",

            data:{

                labels,

                datasets:[{

                    label:"Response Time",

                    data:values,

                    fill:true,

                    tension:.3,

                    borderColor:"#3B82F6",

                    backgroundColor:
                    "rgba(59,130,246,.2)"

                }]

            }

        }

    );

}

function loadTable(history){

    const container =
        document.getElementById("historyList");

    container.innerHTML="";

    history
    .slice()
    .reverse()
    .forEach(item=>{

        container.innerHTML+=`

<div class="history-row">

<div>

${new Date(
item.checked_at
).toLocaleString()}

</div>

<div>

<span class="${
item.status==="UP"
?
"status-up"
:
"status-down"
}">

${item.status}

</span>

</div>

<div>

${item.http_status}

</div>

<div>

${item.response_time_ms} ms

</div>

</div>

`;

    });

}