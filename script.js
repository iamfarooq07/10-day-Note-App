const SUPABASE_URL = "https://pjkzxrbjnrarhglwecwq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqa3p4cmJqbnJhcmhnbHdlY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTM2NjEsImV4cCI6MjA3MjcyOTY2MX0.pPrx6Ud20Zt2hcuxGaBm45f2rwADfGgokqt16zHXhrI";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const textarea = document.getElementById("textarea");
const btnAdd = document.getElementById("btn");
const addList = document.getElementById("addText");

let editingLi = null;

// Add button
btnAdd.addEventListener("click", async () => {
  const textareaValue = textarea.value.trim();
  if (textareaValue === "") return;

  if (editingLi === null) {
    // new li
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-start bg-purple-400 p-4 mt-2 rounded-2xl";
    li.innerHTML = `
      <span class="break-words flex-1 text-left mr-3">
        ${textareaValue}
      </span>
      <div class="space-x-3 flex-shrink-0">
        <i class="fa-solid fa-pen cursor-pointer"></i>
        <i class="fa-solid fa-trash cursor-pointer"></i>
      </div>
    `;

    addList.appendChild(li);
  } else {
    editingLi.querySelector("span").innerText = textareaValue;
    editingLi = null;
  }

  textarea.value = "";

  // --------------
  const { error, data } = await supabase
    .from("note_app")
    .insert({ contact: textareaValue });

  if (error) {
    alert(error.message);
  }
  // console.log(data);

  // --------------
});

// Handle Edit/Delete
addList.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    e.target.closest("li").remove();
  }

  if (e.target.classList.contains("fa-pen")) {
    editingLi = e.target.closest("li");
    const span = editingLi.querySelector("span");
    textarea.value = span.innerText;
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase
    .from("note_app")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);
  if (error) {
    alert(error.message);
    return;
  }

  if (data && data.length > 0) {
    textarea.value = data[0].contact;
  } else {
    console.log("No record found");
  }
});
