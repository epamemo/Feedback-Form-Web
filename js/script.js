const feedbackContainer = document.getElementById("feedback-container");
const feedbackForm = document.getElementById("feedback-form");
const nameInput = document.getElementById("name-input");
const feedbackInput = document.getElementById("feedback-input");
const editIdInput = document.getElementById("edit-id");
const submitButton = document.getElementById("submit-button");

let feedbackData = [];

// Mengambil feedback dari jsonbin.io
async function fetchData() {
  try {
    const response = await fetch(
      "https://api.jsonbin.io/v3/b/6614edeaad19ca34f85737db/latest"
    );
    const jsonData = await response.json();
    feedbackData = jsonData.record.data;
    //Memanggil fungsi displayFeedback untuk menampilkan element card feedback
    displayFeedback();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Menampilkan feedback
function displayFeedback() {
  //Membersihkan container dari element sample yang dibuat di HTML
  feedbackContainer.innerHTML = "";

  //Membuat element card feedback secara recursive
  feedbackData.forEach((feedback) => {
    const feedbackItem = document.createElement("article");
    feedbackItem.classList.add("feedback-item");
    feedbackItem.innerHTML = `
    <h3>From: ${feedback.name ? feedback.name : "Kind Person!"}</h3>
      <p>Message: ${feedback.feedback}</p>
      <button class="secondary" onclick="editFeedback(${
        feedback.id
      })">Edit</button>
      <button class="tertiary" onclick="deleteFeedback(${
        feedback.id
      })">Delete</button>
    `;
    feedbackContainer.appendChild(feedbackItem);
  });
}

// Membuat/Edit feedback
feedbackForm.addEventListener("submit", async function (event) {
  //Mencegah form untuk melakukan submit/refresh halaman
  event.preventDefault();
  if (editIdInput.value !== "") {
    // Jika status editIdInput tidak kosong, maka update feedback
    const index = feedbackData.findIndex(
      (feedback) => feedback.id === parseInt(editIdInput.value)
    );
    if (index !== -1) {
      feedbackData[index] = {
        id: parseInt(editIdInput.value),
        name: nameInput.value || null,
        feedback: feedbackInput.value,
      };
      editIdInput.value = ""; // Reset editIdInput
    }
  } else {
    // Jika status editIdInput kosong, maka tambahkan feedback baru
    const newFeedback = {
      id: feedbackData.length,
      name: nameInput.value || null,
      feedback: feedbackInput.value,
    };
    feedbackData.push(newFeedback);
  }
  await saveData();
  nameInput.value = "";
  feedbackInput.value = "";
  submitButton.innerText = "Submit";
});

// Edit feedback
function editFeedback(id) {
  const feedbackToEdit = feedbackData.find((feedback) => feedback.id === id);
  if (feedbackToEdit) {
    nameInput.value = feedbackToEdit.name || "";
    feedbackInput.value = feedbackToEdit.feedback;
    editIdInput.value = id;
    submitButton.innerText = "Update";
  }
}

// Hapus feedback
function deleteFeedback(id) {
  const confirmation = confirm(
    "Are you sure you want to delete this feedback?"
  );
  if (confirmation) {
    feedbackData = feedbackData.filter((feedback) => feedback.id !== id);
    saveData();
  }
}

// Save data ke jsonbin.io
async function saveData() {
  try {
    await fetch("https://api.jsonbin.io/v3/b/6614edeaad19ca34f85737db", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: feedbackData }),
    });
    displayFeedback();
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// Memanggil fungsi fetchData ketika load halaman
fetchData();
