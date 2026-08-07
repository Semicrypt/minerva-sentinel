const loginForm =
document.getElementById("loginForm");

loginForm.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
        document.getElementById("email").value;

        const password =
        document.getElementById("password").value;

        const response =
        await fetch(
            API_BASE_URL + "/auth/login",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    email,
                    password

                })

            }
        );

        const data =
        await response.json();

        if(data.success){

            localStorage.setItem(
                "token",
                data.data.token
            );

            alert("Login successful!");

            window.location =
            "dashboard.html";

        }

        else{

            alert(data.message);

        }

    }
);