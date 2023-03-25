// called when form submit is clicked on create post page
const createPost = async (event) => {
  event.preventDefault();

  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;

  const response = await fetch("/api/dashboard/post", {
    method: "POST",
    body: JSON.stringify({ title, content }),

    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

const deletePost = async () => {
  const postId = location.href.split("/").reverse()[0];
  const response = await fetch(`/api/dashboard/post/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

const updatePost = async () => {
  const postId = location.href.split("/").reverse()[0];

  const title = document.querySelector(".post-title").value;
  const content = document.querySelector(".post-content").value;

  const response = await fetch(`/api/dashboard/post/${postId}`, {
    method: "PUT",
    body: JSON.stringify({ title, content }),

    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

const addComment = async () => {
  const title = document.getElementById("comment-title").value;
  const content = document.getElementById("comment-content").value;
  const postId = location.href.split("/").reverse()[0];

  await fetch("/api/dashboard/comment", {
    method: "POST",
    body: JSON.stringify({ title, content, postId }),

    headers: { "Content-Type": "application/json" },
  });
};

if (document.querySelector("#create-post")) {
  document.querySelector("#create-post").addEventListener("submit", createPost);
}

if (document.querySelector(".create-comment")) {
  document
    .querySelector(".create-comment")
    .addEventListener("submit", addComment);
}

if (document.querySelector(".toggle-comment")) {
  document
    .querySelector(".toggle-comment")
    .addEventListener("click", toggleAddComment);
}

if (document.querySelector(".update-button")) {
  document
    .querySelector(".update-button")
    .addEventListener("click", updatePost);
}

if (document.querySelector(".delete-button")) {
  document
    .querySelector(".delete-button")
    .addEventListener("click", deletePost);
}
