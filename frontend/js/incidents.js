const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("token");

    window.location.href = "login.html";

};

loadIncidents();

async function loadIncidents() {

    try {

        const response = await fetch(

            API_BASE_URL + "/incidents",

            {

                headers: {

                    Authorization:
                    "Bearer " + token

                }

            }

        );

        const result =
        await response.json();

        if (!result.success) {

            alert(result.message);

            return;

        }

        const container =
        document.getElementById("incidentList");

        container.innerHTML = "";

        if(result.data.length===0){

            container.innerHTML=`

<div class="incident">

<div>-</div>

<div>No incidents found.</div>

<div>-</div>

<div>-</div>

<div>-</div>

</div>

`;

            return;

        }

        result.data.forEach(incident=>{

            container.innerHTML+=`

<div class="incident">

<div>

${incident.name}

</div>

<div>

${incident.title}

</div>

<div>

<span class="${
incident.status==="OPEN"
? "status-open"
: "status-resolved"
}">

${incident.status}

</span>

</div>

<div>

${new Date(
incident.created_at
).toLocaleString()}

</div>

<div>

${
incident.resolved_at
? new Date(
incident.resolved_at
).toLocaleString()
: "-"
}

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

        alert("Unable to load incidents.");

    }

}