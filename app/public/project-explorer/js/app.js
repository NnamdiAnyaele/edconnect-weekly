let currentPage = window.location.href;

if (currentPage.includes("/project-explorer/register.html")) {
  async function getPrograms() {
    try {
      const res = await fetch("/api/programs");
      const json = await res.json();

      let programList = "";
      json.forEach((program) => {
        programList += `<option>${program}</option>`;
      });
      document.getElementById("program").innerHTML = programList;
    } catch (error) {
      console.log(error);
    }
  }

  async function getGraduationYears() {
    try {
      const res = await fetch("/api/graduationYears");
      const json = await res.json();

      let graduationYears = "";
      json.map((gradYear) => {
        graduationYears += `<option>${gradYear}</option>`;
      });
      document.getElementById("graduationYear").innerHTML = graduationYears;
    } catch (error) {
      console.log("error", error.message);
    }
  }
  getPrograms();
  getGraduationYears();

  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstname = document.getElementById("firstName").value;
    const lastname = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const matricNumber = document.getElementById("matricNumber").value;
    const program = document.getElementById("program").value;
    const graduationYear = document.getElementById("graduationYear").value;

    const data = {
      firstname,
      lastname,
      email,
      password,
      program,
      graduationYear,
      matricNumber,
    };
    handleRegistrationSubmit(data);
  });

  async function handleRegistrationSubmit(data) {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("res", res);
      const response = await res.json();
      if (response.status === "ok") {
        document.cookie = `uid=${response.data.id};path=/`;
        window.location.href = "/project-explorer/index.html";
      } else {
        let errorDiv = document.createElement("div");
        errorDiv.classList.add("alert", "alert-danger", "w-100");
        let errors = response.errors.map((error) => {
          return `<p>${error}</p>`;
        });
        errorDiv.innerHTML = errors.join("");
        signupForm.prepend(errorDiv);
        throw "error occurred";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

window.onload = async function () {
  try {
    let userId = document.cookie.split("=")[1];
    let res = await fetch(`/api/users/${userId}`);
    let json = await res.json();
    console.log(json);
    let logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.classList.add("text-white");
    logoutButton.style.background = "transparent";
    logoutButton.style.border = "none";
    let loginRegister = document.getElementById("navBarLoginRegister");
    let navbar = document.getElementById("navbar");
    let navbarUser = document.createElement("span");
    navbarUser.innerHTML = `<span id="username">Hi ${json.firstname}</span>`;
    navbarUser.classList.add("text-white");
    loginRegister.classList.add("invisible");
    navbar.appendChild(logoutButton);
    navbar.appendChild(navbarUser);
    logoutButton.addEventListener('click', function (){
      document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      window.location.href = "/project-explorer/index.html"
    })    
  } catch (error) {
    console.log(error)
  }
};

if (currentPage.includes("/project-explorer/login.html")) {
  const loginForm = document.getElementById("loginForm")
  loginForm.addEventListener('submit', (event) =>{
    event.preventDefault()
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = {email, password}
    console.log(data)
    handleLogin(data)
  })

  async function handleLogin(data) {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.status === "ok"){
        document.cookie = `uid=${json.data.id};path=/`;
        window.location.assign("/project-explorer/index.html")
      }else {
        const div = document.createElement("div")
        div.classList.add("alert", "alert-danger", "alert-dismissible", "w-100")
        div.textContent = "Invalid email/password"
        loginForm.prepend(div)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

if (currentPage.includes("/project-explorer/createproject.html")) {

  const isCookie = document.cookie.startsWith("uid")
  const isLoggedIn = document.cookie.split("=")[1]
  if (!isCookie || !isLoggedIn) {
    window.location.replace("/project-explorer/login.html")
  }

  const createProjectForm = document.getElementById("createProjectForm")
  createProjectForm.addEventListener('submit', (event) =>{
    event.preventDefault()
    const name = document.getElementById("name").value
    const abstract = document.getElementById("abstract").value
    const authors = document.getElementById("authors").value.split(",")
    const tags = document.getElementById("tags").value.split(" ")
    const data = { name, abstract, authors, tags }
    console.log(data)
    handleCreateProject(data)
  })

  async function handleCreateProject (data) {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (json.status === "ok"){
        window.location.assign("/project-explorer/index.html")
      }else {
        let div = document.createElement("div");
        div.classList.add("alert", "alert-danger", "w-100");
        let errors = response.errors.map((error) => {
          return `<p>${error}</p>`;
        });
        div.innerHTML = errors.join("");
        createProjectForm.prepend(div);
        throw "error occurred";
      }
    } catch (error) {
      console.log(error)
    }
  }
}

if (currentPage.includes("/project-explorer/index.html")) {
  let showcase = document.querySelector(".showcase")
  ;(async function () {
    try {
      let response = await fetch("/api/projects")
      let result = await response.json()
      console.log(result)
      let projects = result
        .map(project => {
          return `
          <div class="col-md-3">
              <div class="card">
              <div class="card-body">
                <h5 class="card-title text-primary">${project.name}</h5>
                <h6 class="card-subtitle text-secondary">${project.authors.join(", ")}</h6>
                <p class="card-text">${project.abstract}</p>
                <div class="d-flex flex-row flex-wrap">
                  ${project.tags.map((tag) => (`<a href="#" >${tag.split(",")[0]} </a>`)).join("")}
                </div>
              </div>
              </div>
              </div>`
        })
        .join("")
      showcase.innerHTML = projects
    } catch (error) {
      console.log(error)
    }
    })()
}
if (window.location.href.includes("/project-explorer/viewproject.html")) {
  const projectName = document.getElementById("project_name")
  const projectAuthor = document.getElementById("project_author")
  const projectAbstract = document.getElementById("project_abstract")
  const projectAuthors = document.getElementById("project_authors")
  const projectTags = document.getElementById("project_tags")
  let arr = location.search
  if (arr.includes("?id=")) {
    let id
    let newArr = arr.split("?")
    newArr.find(item => {
      if (item.includes("id=")) {
        let value = item.split("=")[1]
        id = value
        return
      }
    })
    ;(async function () {
      let response = await fetch(`/api/projects/${id}`)
      let result = await response.json()
      if (result) {
        let name = await (await fetch(`/api/users/${result.createdBy}`)).json()
        projectName.innerText = result.name
        projectAbstract.innerText = result.abstract
        projectAuthor.innerHTML = `Created by: <br/> ${name.firstname} ${name.lastname}`
        projectAuthors.innerText = result.authors.join(", ")
        projectTags.innerText = result.tags.map(tag => `#${tag}`).join(", ")
      }
    })()
  }
}