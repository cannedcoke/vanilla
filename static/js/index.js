// vista principal de navegacion

function navLinkView() {
document.getElementById("app").innerHTML = `
  <div class="form-group">

    <div class="col">
      <div class="field-group">
        <label for="link_input">Agregar enlace</label>
        <input type="url" id="link_input" placeholder="https://whatever.com" required>
        <label for="tags_new_link">Etiquetas del link</label>
        <select name="tags" id="tags_new_link" multiple required></select>
        <button id="add_link_btn">Agregar link</button>
      </div>
    </div>

    <div class="col">
      <div class="field-group">
        <label for="new_tag_input">Nueva etiqueta</label>
        <input type="text" id="new_tag_input" placeholder="Nombre de etiqueta">
        <button id="add_tag_btn">Agregar etiqueta</button>
      </div>
    </div>

    <div class="full-width">
      <label for="tags_input">Filtrar por etiqueta</label>
      <select name="tags" id="tags_input" required></select>
    </div>

    <div class="full-width">
      <table id="data"></table>
    </div>

  </div>
`;
  const tag = document.getElementById("tags_input");
  tag.addEventListener("change", filter);

  const addLinks = document.getElementById("add_link_btn");
  addLinks.addEventListener("click", addLink);

  const addTags = document.getElementById("add_tag_btn");
  addTags.addEventListener("click", addTag);

  populateSelect();
}

async function populateSelect() {
  const response = await fetch("http://localhost:5000/api/pupulateSelect");

  if (!response.ok) {
    throw new Error("buu no anda");
  }

  const data = await response.json();
  
  const allOptions = data.tags
    .map((tag) => `<option value="${tag.name}">${tag.name}</option>`)
    .join("");

  const filteredOptions = data.tags
    .filter((tag) => tag.name !== "Todos")
    .map((tag) => `<option value="${tag.name}">${tag.name}</option>`)
    .join("");

  document.getElementById("tags_new_link").innerHTML = `
    <option value="" disabled selected>Seleccioná una etiqueta</option>
    ${filteredOptions}
  `;

  document.getElementById("tags_input").innerHTML = `
    <option value="" disabled selected>Seleccioná una etiqueta</option>
    ${allOptions}
  `;
}

async function addLink() {
  const link = document.getElementById("link_input").value;
  const select = document.getElementById("tags_new_link");
  const selectedTags = Array.from(select.selectedOptions).map(
    (opt) => opt.value,
  );

  if (!link || selectedTags === 0) {
    window.alert("completa los campos");
    return;
  }
  const response = await fetch("http://localhost:5000/api/addLink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ link, selectedTags }),
  });

  if (!response.ok) {
    throw new Error("buu no anda");
  }
  window.alert("done");
  document.getElementById("link_input").value = "";
  select.selectedIndex = -1;
}

async function addTag() {
  const tag = document.getElementById("new_tag_input").value;
  if (!tag) {
    window.alert("completa el campo");
    return;
  }
  const response = await fetch("http://localhost:5000/api/addTag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag }),
  });

  if (!response.ok) {
    throw new Error("buu no anda");
  }
  window.alert("done");
  document.getElementById("new_tag_input").value = "";
  select.selectedIndex = -1;
}

// filtro por etiquetas
async function filter() {
  const tag = document.getElementById("tags_input").value;
  const response = await fetch("http://localhost:5000/api/filter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag }),
  });

  if (!response.ok) {
    throw new Error("buu no anda");
  }

  const data = await response.json();
  const table = document.getElementById("data");
  table.innerHTML = `
    <tr>
        <th>Enlace</th>
        <th>Etiquetas</th>
        <th>Acciones</th>
    </tr>
    `;
  data.records.forEach((record) => {
    const tags = Array.isArray(record.etiquetas)
      ? record.etiquetas.map((t) => t.name).join(", ")
      : "";
    table.innerHTML += `
        <tr  >
            <td>${record.tema}</td>
            <td>${tags}</td>
            <td><button class="detalles_btn" data-id="${record._id}">detalles</button>
            <button class="vote_btn" data-id="${record._id}">vote</button>
            <button class="comment_btn" data-id="${record._id}">Add a comment</button>
            <input class="comment_input" data-id="${record._id}" style="display:none" placeholder="add a comment">
            <button class="send" data-id="${record._id}" style="display:none">send</button>
            </td>
        </tr>
        `;
  });
  const detail = document.getElementById("data");
  detail.addEventListener("click", (e) => {
    if (e.target.classList.contains("vote_btn")) {
      const id = e.target.dataset.id;
      addVote(id);
    }
  });
  const details = document.getElementById("data");
  details.addEventListener("click", (e) => {
    if (e.target.classList.contains("detalles_btn")) {
      const id = e.target.dataset.id;
      detalleView(id);
    }
  });
  const comment = document.getElementById("data");
  comment.addEventListener("click", (e) => {
    if (e.target.classList.contains("comment_btn")) {
      const id = e.target.dataset.id;
      const input = document.querySelector(
        `.comment_input[data-id="${id}"]`,
      ).value;
      addComment(id, input);
    }
  });
}
async function addComment(id, input) {
  const field = document.querySelector(`.comment_input[data-id="${id}"]`);
  const sendBtn = document.querySelector(`.send[data-id="${id}"]`);

  if (field.style.display === "block") {
    field.style.display = "none";
    sendBtn.style.display = "none";
  } else {
    field.style.display = "block";
    sendBtn.style.display = "block";
  }

  sendBtn.addEventListener("click", async () => {
    const input = field.value;
    const response = await fetch("http://localhost:5000/api/addComment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, input }),
    });

    if (!response.ok) {
      throw new Error("buu no anda");
    }
    window.alert("comment saved");
    field.value = "";
    field.style.display = "none";
    sendBtn.style.display = "none";
  });
}
// vista de los detalles de los links
async function detalleView(id) {
  const response = await fetch("http://localhost:5000/api/details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("buu no anda");
  }

  const data = await response.json();
  const record = data.details;
  document.getElementById("app").innerHTML = `
    <button id="btn-volver">← Volver</button> 
    <table id="data"></table>
    `;
  const table = document.getElementById("data");
  table.innerHTML = `
    <tr>
        <th>Enlace</th>
        <th>Etiquetas</th>
        <th>Comentarios</th>
        <th>Votos</th>
        <th>Acciones</th>
    </tr>
    `;

  const tags = Array.isArray(record.etiquetas)
    ? record.etiquetas.map((t) => t.name).join(", ")
    : "";
  table.innerHTML += `
        <tr>
            <td>${record.tema}</td>
            <td>${tags}</td>
            <td>${record.comment}</td>
            <td>${record.votes}</td>
            <td><button class="vote_btn" data-id="${record._id}">vote</button></td>
        </tr>
        `;
  document.getElementById("btn-volver").addEventListener("click", navLinkView);

  const details = document.getElementById("data");
  details.addEventListener("click", (e) => {
    if (e.target.classList.contains("vote_btn")) {
      const id = e.target.dataset.id;
      addVote(id);
    }
  });
}

async function addVote(id) {
  const response = await fetch("http://localhost:5000/api/addVote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("buu no anda");
  }
  detalleView(id);
}

navLinkView();
